const express = require('express');
const router = express.Router();
const walletController = require('../controllers/walletController');
const { authenticate } = require('../middleware/auth');

router.post('/auth/register', walletController.register);
router.post('/auth/login', walletController.login);

router.get('/balance', authenticate, walletController.getBalance);
router.post('/funds/transfer', authenticate, walletController.transferFunds);
router.get('/top-balances', authenticate, walletController.topBalances);
router.get('/leaderboard', authenticate, walletController.leaderboardCached);

module.exports = router;