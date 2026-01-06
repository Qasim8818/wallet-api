const TempoService = require('../services/tempoService');
const { successResponse, errorResponse } = require('../utils/helpers');
const logger = require('../utils/logger');

const tempoService = new TempoService();

// Fund wallet with testnet tokens
const fundWallet = async (req, res) => {
  try {
    const { address } = req.body;
    
    if (!address) {
      return errorResponse(res, new Error('Address is required'), 400);
    }

    const result = await tempoService.fundAddress(address);
    
    logger.info(`Funded address ${address} with testnet tokens`);
    return successResponse(res, result, 'Address funded successfully');
  } catch (error) {
    logger.error('Fund wallet error:', error);
    return errorResponse(res, error, 500);
  }
};

// Get TIP-20 token balance
const getTIP20Balance = async (req, res) => {
  try {
    const { tokenAddress, userAddress } = req.params;
    
    const balance = await tempoService.getTIP20Balance(tokenAddress, userAddress);
    
    return successResponse(res, { 
      balance: balance.toString(),
      tokenAddress,
      userAddress 
    });
  } catch (error) {
    logger.error('Get TIP-20 balance error:', error);
    return errorResponse(res, error, 500);
  }
};

// Transfer TIP-20 tokens
const transferTIP20 = async (req, res) => {
  try {
    const { tokenAddress, to, amount, privateKey } = req.body;
    
    if (!tokenAddress || !to || !amount || !privateKey) {
      return errorResponse(res, new Error('Missing required fields'), 400);
    }

    const tx = await tempoService.transferTIP20(tokenAddress, to, amount, privateKey);
    
    logger.info(`TIP-20 transfer initiated: ${tx.hash}`);
    return successResponse(res, { 
      transactionHash: tx.hash,
      to,
      amount: amount.toString()
    });
  } catch (error) {
    logger.error('TIP-20 transfer error:', error);
    return errorResponse(res, error, 500);
  }
};

// Get transaction receipt
const getTransactionReceipt = async (req, res) => {
  try {
    const { txHash } = req.params;
    
    const receipt = await tempoService.getTransactionReceipt(txHash);
    
    return successResponse(res, receipt);
  } catch (error) {
    logger.error('Get transaction receipt error:', error);
    return errorResponse(res, error, 500);
  }
};

module.exports = {
  fundWallet,
  getTIP20Balance,
  transferTIP20,
  getTransactionReceipt
};