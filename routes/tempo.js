const express = require('express');
const { 
  fundWallet, 
  getTIP20Balance, 
  transferTIP20, 
  getTransactionReceipt 
} = require('../controllers/tempoController');

const router = express.Router();

/**
 * @swagger
 * /api/v1/tempo/fund:
 *   post:
 *     summary: Fund address with testnet tokens
 *     tags: [Tempo]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               address:
 *                 type: string
 *                 description: Address to fund
 *     responses:
 *       200:
 *         description: Address funded successfully
 */
router.post('/fund', fundWallet);

/**
 * @swagger
 * /api/v1/tempo/balance/{tokenAddress}/{userAddress}:
 *   get:
 *     summary: Get TIP-20 token balance
 *     tags: [Tempo]
 *     parameters:
 *       - in: path
 *         name: tokenAddress
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: userAddress
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Token balance retrieved
 */
router.get('/balance/:tokenAddress/:userAddress', getTIP20Balance);

/**
 * @swagger
 * /api/v1/tempo/transfer:
 *   post:
 *     summary: Transfer TIP-20 tokens
 *     tags: [Tempo]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tokenAddress:
 *                 type: string
 *               to:
 *                 type: string
 *               amount:
 *                 type: string
 *               privateKey:
 *                 type: string
 *     responses:
 *       200:
 *         description: Transfer initiated
 */
router.post('/transfer', transferTIP20);

/**
 * @swagger
 * /api/v1/tempo/receipt/{txHash}:
 *   get:
 *     summary: Get transaction receipt
 *     tags: [Tempo]
 *     parameters:
 *       - in: path
 *         name: txHash
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Transaction receipt
 */
router.get('/receipt/:txHash', getTransactionReceipt);

module.exports = router;