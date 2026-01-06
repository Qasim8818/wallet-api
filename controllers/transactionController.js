// controllers/transactionController.js
const Transaction = require('../models/transaction');
const Wallet = require('../models/WalletModel');
const { successResponse, errorResponse } = require('../utils/helpers');
const { recordWalletOperation, recordDbQuery } = require('../utils/metrics');
const logger = require('../utils/logger');
const mongoose = require('mongoose');

const getTransactionHistory = async (req, res) => {
    try {
        const { walletId } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const type = req.query.type; // Optional filter
        const skip = (page - 1) * limit;

        // Validate wallet exists
        const wallet = await Wallet.findById(walletId);
        if (!wallet) {
            return errorResponse(res, new Error('Wallet not found'), 404);
        }

        // Build query
        const query = { walletId };
        if (type) {
            query.type = type;
        }

        // Get transactions with pagination
        const transactions = await recordDbQuery(
            'find',
            'transactions',
            () => Transaction.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate('fromWalletId', 'owner')
                .populate('toWalletId', 'owner')
                .lean()
        );

        const total = await Transaction.countDocuments(query);

        // Format transactions for response
        const formattedTransactions = transactions.map(tx => ({
            id: tx._id,
            type: tx.type,
            amount: tx.amount,
            currency: tx.currency,
            balanceBefore: tx.balanceBefore,
            balanceAfter: tx.balanceAfter,
            description: tx.description,
            referenceId: tx.referenceId,
            status: tx.status,
            createdAt: tx.createdAt,
            // Include transfer partner info
            transferPartner: tx.fromWalletId || tx.toWalletId ? {
                id: (tx.fromWalletId || tx.toWalletId)._id,
                owner: (tx.fromWalletId || tx.toWalletId).owner
            } : null
        }));

        return successResponse(res, {
            transactions: formattedTransactions,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        logger.error('Error getting transaction history:', error);
        return errorResponse(res, error, 500);
    }
};

const transferFunds = async (req, res) => {
    try {
        const { fromWalletId, toWalletId, amount, description } = req.body;
        const userId = req.user ? req.user.userId : 'test-user';

        // Validation
        if (!fromWalletId || !toWalletId || !amount || amount <= 0) {
            return errorResponse(res, new Error('Invalid transfer parameters'), 400);
        }

        if (fromWalletId === toWalletId) {
            return errorResponse(res, new Error('Cannot transfer to the same wallet'), 400);
        }

        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            // Get both wallets
            const [fromWallet, toWallet] = await Promise.all([
                Wallet.findById(fromWalletId).session(session),
                Wallet.findById(toWalletId).session(session)
            ]);

            if (!fromWallet || !toWallet) {
                await session.abortTransaction();
                return errorResponse(res, new Error('One or both wallets not found'), 404);
            }

            if (fromWallet.balance < amount) {
                await session.abortTransaction();
                return errorResponse(res, new Error('Insufficient funds'), 400);
            }

            // Update balances
            const fromBalanceBefore = fromWallet.balance;
            const toBalanceBefore = toWallet.balance;

            fromWallet.balance -= amount;
            toWallet.balance += amount;

            await Promise.all([
                fromWallet.save({ session }),
                toWallet.save({ session })
            ]);

            // Create transaction records
            const referenceId = `transfer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

            const transactions = await Transaction.createBulk([
                {
                    walletId: fromWalletId,
                    type: 'transfer_out',
                    amount,
                    balanceBefore: fromBalanceBefore,
                    balanceAfter: fromWallet.balance,
                    description: description || `Transfer to ${toWallet.owner}`,
                    referenceId,
                    fromWalletId,
                    toWalletId,
                    userId,
                    status: 'completed'
                },
                {
                    walletId: toWalletId,
                    type: 'transfer_in',
                    amount,
                    balanceBefore: toBalanceBefore,
                    balanceAfter: toWallet.balance,
                    description: description || `Transfer from ${fromWallet.owner}`,
                    referenceId,
                    fromWalletId,
                    toWalletId,
                    userId,
                    status: 'completed'
                }
            ], { session });

            await session.commitTransaction();

            // Update caches (invalidate both wallets)
            const cache = require('../utils/cache');
            const lruCache = require('../utils/lruCache');

            await Promise.all([
                cache.del(`wallet:${fromWalletId}`),
                cache.del(`wallet:${toWalletId}`),
                Promise.resolve(lruCache.del(`wallet:${fromWalletId}`)),
                Promise.resolve(lruCache.del(`wallet:${toWalletId}`))
            ]);

            recordWalletOperation('transfer', 'success');

            return successResponse(res, {
                transfer: {
                    id: referenceId,
                    fromWallet: {
                        id: fromWalletId,
                        owner: fromWallet.owner,
                        balanceBefore: fromBalanceBefore,
                        balanceAfter: fromWallet.balance
                    },
                    toWallet: {
                        id: toWalletId,
                        owner: toWallet.owner,
                        balanceBefore: toBalanceBefore,
                        balanceAfter: toWallet.balance
                    },
                    amount,
                    description,
                    timestamp: new Date()
                }
            }, 'Transfer completed successfully');

        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    } catch (error) {
        logger.error('Error transferring funds:', error);
        recordWalletOperation('transfer', 'error');
        return errorResponse(res, error, 500);
    }
};

const getTransactionById = async (req, res) => {
    try {
        const { id } = req.params;

        const transaction = await recordDbQuery(
            'findById',
            'transactions',
            () => Transaction.findById(id)
                .populate('fromWalletId', 'owner')
                .populate('toWalletId', 'owner')
        );

        if (!transaction) {
            return errorResponse(res, new Error('Transaction not found'), 404);
        }

        return successResponse(res, { transaction: transaction.toFormatted() });
    } catch (error) {
        logger.error('Error getting transaction:', error);
        return errorResponse(res, error, 500);
    }
};

module.exports = {
    getTransactionHistory,
    transferFunds,
    getTransactionById
};
