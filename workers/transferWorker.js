const Queue = require('bull');
const mongoose = require('mongoose');
const User = require('../models/user');
const Transaction = require('../models/transaction');
const { setCache } = require('../utils/cache');

const transferQueue = new Queue('transfer processing', process.env.BULL_REDIS || 'redis://127.0.0.1:6379');

transferQueue.process(async (job) => {
  const { fromUserId, toUserId, amount, txId } = job.data;
  
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const [fromUser, toUser] = await Promise.all([
      User.findOne({ userId: fromUserId }).session(session),
      User.findOne({ userId: toUserId }).session(session)
    ]);
    
    if (!fromUser || !toUser) throw new Error('User(s) not found');
    if (fromUser.balance < amount) throw new Error('Insufficient funds');
    
    fromUser.balance -= amount;
    toUser.balance += amount;
    
    await Promise.all([fromUser.save({ session }), toUser.save({ session })]);
    
    await Transaction.findOneAndUpdate(
      { txId },
      { status: 'COMPLETED' },
      { session }
    );
    
    await session.commitTransaction();
    session.endSession();
    
    // Update caches
    await setCache(`user:${fromUserId}`, { balance: fromUser.balance, currency: fromUser.currency });
    await setCache(`user:${toUserId}`, { balance: toUser.balance, currency: toUser.currency });
    
    return { success: true, fromBalance: fromUser.balance, toBalance: toUser.balance };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    
    await Transaction.findOneAndUpdate({ txId }, { status: 'FAILED' });
    throw error;
  }
});

module.exports = transferQueue;