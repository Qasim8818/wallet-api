// models/Wallet.js - Separate model definition
const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
    owner: { type: String, required: true, index: true },
    balance: { type: Number, required: true, default: 0, index: true },
}, { timestamps: true });

walletSchema.index({ owner: 1, balance: -1 });
walletSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Wallet', walletSchema);