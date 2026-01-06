const User = require('../models/user');
const Transaction = require('../models/transaction');
const { sendResponse, sendError } = require('../utils/helpers');
const { getCache, setCache, promoteHotKey, getTopHotKeys } = require('../utils/cache');
const BST = require('../utils/bst');
const MinHeap = require('../utils/minHeap');
const { v4: uuidv4 } = require('uuid');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { Graph } = require('../utils/graph');

// AUTH
exports.register = async (req, res) => {
  const { userId, initialBalance = 0 } = req.body;
  if (!userId) return sendError(res, 'userId required', 'INVALID_PARAMS', 400);
  try {
    const existing = await User.findOne({ userId });
    if (existing) return sendError(res, 'User exists', 'USER_EXISTS', 400);
    const user = await User.create({ userId, balance: initialBalance });
    const token = jwt.sign({ userId: user.userId }, process.env.JWT_SECRET, { expiresIn: '30d' });
    return sendResponse(res, 'Registered', { userId: user.userId, token });
  } catch (err) { return sendError(res, err.message, 'SERVER_ERROR', 500); }
};

exports.login = async (req, res) => {
  const { userId } = req.body;
  if (!userId) return sendError(res, 'userId required', 'INVALID_PARAMS', 400);
  const user = await User.findOne({ userId });
  if (!user) return sendError(res, 'User not found', 'USER_NOT_FOUND', 404);
  const token = jwt.sign({ userId: user.userId }, process.env.JWT_SECRET, { expiresIn: '30d' });
  return sendResponse(res, 'Logged in', { userId: user.userId, token });
};

// GET balance with cache & hot promotion
exports.getBalance = async (req, res) => {
  const userId = req.query.userId || req.user.userId;
  if (!userId) return sendError(res, 'userId required', 'INVALID_PARAMS', 400);
  try {
    const cached = await getCache(`user:${userId}`);
    if (cached) { await promoteHotKey(`user:${userId}`); return sendResponse(res, 'Balance (cache)', cached); }
    const user = await User.findOne({ userId }, { balance: 1, currency: 1, _id: 0 });
    if (!user) return sendError(res, 'User not found', 'USER_NOT_FOUND', 404);
    const data = { balance: user.balance, currency: user.currency };
    await setCache(`user:${userId}`, data);
    await promoteHotKey(`user:${userId}`);
    return sendResponse(res, 'Balance', data);
  } catch (err) { return sendError(res, err.message, 'SERVER_ERROR', 500); }
};

// Transfer via MongoDB transaction + queue pattern (inline simple version)
exports.transferFunds = async (req, res) => {
  const { fromUserId, toUserId, amount } = req.body;
  const value = parseFloat(amount);
  if (!fromUserId || !toUserId || isNaN(value) || value <= 0) return sendError(res, 'Invalid params', 'INVALID_PARAMS', 400);

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const [fromUser, toUser] = await Promise.all([
      User.findOne({ userId: fromUserId }).session(session),
      User.findOne({ userId: toUserId }).session(session)
    ]);
    if (!fromUser || !toUser) throw new Error('User(s) not found');
    if (fromUser.balance < value) throw new Error('Insufficient funds');

    const tx = await Transaction.create([{ txId: uuidv4(), fromUserId, toUserId, amount: value, status: 'PENDING' }], { session });

    fromUser.balance -= value;
    toUser.balance += value;

    await Promise.all([fromUser.save({ session }), toUser.save({ session })]);

    tx[0].status = 'COMPLETED';
    await tx[0].save({ session });

    await session.commitTransaction();
    session.endSession();

    // update caches
    await setCache(`user:${fromUserId}`, { balance: fromUser.balance, currency: fromUser.currency });
    await setCache(`user:${toUserId}`, { balance: toUser.balance, currency: toUser.currency });

    return sendResponse(res, 'Transfer completed', { fromUserBalance: fromUser.balance, toUserBalance: toUser.balance });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    return sendError(res, err.message, 'TRANSFER_FAILED', 400);
  }
};

// Top balances using indexed query + BST / MinHeap fallback
exports.topBalances = async (req, res) => {
  try {
    // Try cache first
    const cached = await getCache('leaderboard:top100');
    if (cached) return sendResponse(res, 'Top balances (cache)', cached);

    const users = await User.find({}, { userId:1, balance:1, _id:0 }).sort({ balance: -1 }).limit(100);
    // convert to simple array
    const output = users.map(u => ({ userId: u.userId, balance: u.balance }));

    // populate cache (hot)
    await setCache('leaderboard:top100', output, 30); // short TTL
    return sendResponse(res, 'Top balances', output);
  } catch (err) { return sendError(res, err.message, 'SERVER_ERROR', 500); }
};

// Leaderboard that uses Hot cache + BST for fast in-memory sort
exports.leaderboardCached = async (req, res) => {
  try {
    // get top hot keys and fetch their cached values
    const hotKeys = await getTopHotKeys(200);
    const result = [];
    for (const key of hotKeys) {
      const val = await getCache(key);
      if (val) result.push({ userId: key.replace('user:', ''), balance: val.balance });
    }
    // if not enough, fallback to DB topBalances
    if (result.length < 100) {
      const dbTop = await User.find({}, { userId:1, balance:1, _id:0 }).sort({ balance: -1 }).limit(100 - result.length);
      result.push(...dbTop.map(u => ({ userId: u.userId, balance: u.balance })));
    }
    // use min-heap to keep top 100
    const heap = new MinHeap();
    for (const u of result) {
      if (heap.size() < 100) heap.push(u);
      else if (u.balance > heap.peek().balance) { heap.pop(); heap.push(u); }
    }
    const out = [];
    while (heap.size()) out.push(heap.pop());
    // out is ascending; reverse for descending
    return sendResponse(res, 'Leaderboard', out.reverse());
  } catch (err) { return sendError(res, err.message, 'SERVER_ERROR', 500); }
};

// Graph: demo endpoints could use these internally; keep functions exported for reuse
exports.buildUserGraph = async (transactionsLimit = 10000) => {
  // build graph from recent transactions (for analysis)
  const txs = await Transaction.find({}).sort({ createdAt: -1 }).limit(transactionsLimit);
  const g = new Graph();
  txs.forEach(t => g.addEdge(t.fromUserId, t.toUserId, t.amount));
  return g;
};

// Example Dijkstra wrapper
exports.findShortestPaymentPath = async (start, dest) => {
  const g = await exports.buildUserGraph(50000);
  const { dist, prev } = g.dijkstra(start);
  const distance = dist.get(dest);
  if (distance === Infinity) return null;
  // reconstruct path
  const path = []; let cur = dest;
  while (cur) { path.push(cur); cur = prev.get(cur); }
  return { distance, path: path.reverse() };
};