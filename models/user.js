const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true, index: true },
  balance: { type: Number, required: true, default: 0 },
  currency: { type: String, required: true, default: 'USD' },
  createdAt: { type: Date, default: Date.now }
});

userSchema.index({ balance: -1, userId: 1 }); // leaderboard index

module.exports = mongoose.model('User', userSchema);