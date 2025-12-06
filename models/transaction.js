const mongoose = require('mongoose');


const txSchema = new mongoose.Schema({
    txId: { type: String, required: true, unique: true },
    fromUserId: { type: String, required: true, index: true },
    toUserId: { type: String, required: true, index: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'USD' },
    status: { type: String, enum: ['PENDING', 'COMPLETED', 'FAILED'], default: 'PENDING' },
    createdAt: { type: Date, default: Date.now }
});


module.exports = mongoose.model('Transaction', txSchema);