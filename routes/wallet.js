// routes/wallet.js
const express = require('express');
const {
    createWallet,
    getWallet,
    deposit,
    withdraw,
    getBalance,
    getWalletsByOwner,
    getTopWallets,
} = require('../controllers/walletController');
const { asyncHandler } = require('../utils/helpers');
const {
    walletCreateSchema,
    walletUpdateSchema,
} = require('../middleware/validation'); // <-- NEW

const router = express.Router();

/**
 * @swagger
 * /api/v1/wallet/{id}:
 *   get:
 *     summary: Get wallet by ID
 *     tags: [Wallet]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Wallet data
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Wallet' }
 */
router.get('/:id', asyncHandler(getWallet));

// Create a wallet – validated by Joi
router.post('/', walletCreateSchema, asyncHandler(createWallet));

// Deposit – validated
router.post('/:id/deposit', walletUpdateSchema, asyncHandler(deposit));

// Withdraw – validated
router.post('/:id/withdraw', walletUpdateSchema, asyncHandler(withdraw));

// Get only the balance
router.get('/:id/balance', asyncHandler(getBalance));

// Get wallets by owner
router.get('/', asyncHandler(getWalletsByOwner));

// Get top wallets by balance
router.get('/top/:limit?', asyncHandler(getTopWallets));

module.exports = router;