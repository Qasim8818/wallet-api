// routes/wallet.js - FIXED VERSION
const express = require('express');
const {
    createWallet,
    getWallet,
    deposit,
    withdraw,
    getBalance,
} = require('../controllers/walletController');
const { asyncHandler } = require('../utils/helpers');
const { authenticateToken } = require('../middleware/auth');

// Protect all wallet routes
const router = express.Router();
router.use(authenticateToken);



// Wallet routes
router.post('/', asyncHandler(createWallet));
router.get('/:id', asyncHandler(getWallet));
router.post('/:id/deposit', asyncHandler(deposit));
router.post('/:id/withdraw', asyncHandler(withdraw));
router.get('/:id/balance', asyncHandler(getBalance));

// Add the test route back for debugging
router.get('/test', (req, res) => {
    res.json({ success: true, message: 'API is working' });
});


module.exports = router;