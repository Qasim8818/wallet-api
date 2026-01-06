require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/user');
const { setCache } = require('./utils/cache');

const MONGO_URI = process.env.MONGO_URI;
const TOTAL_USERS = parseInt(process.env.TOTAL_USERS || 1000000);
const BATCH = parseInt(process.env.BATCH_SIZE || 10000);

function randomBalance() { return parseFloat((Math.random() * 10000).toFixed(2)); }

(async () => {
  await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Connected to MongoDB');
  for (let i = 0; i < TOTAL_USERS; i += BATCH) {
    const batch = [];
    for (let j = 0; j < BATCH && (i + j) < TOTAL_USERS; j++) {
      const id = (1000000000 + i + j).toString();
      batch.push({ userId: id, balance: randomBalance(), currency: 'USD' });
    }
    try { await User.insertMany(batch, { ordered: false }); } catch (e) { /* ignore duplicates */ }
    console.log(`Inserted ${Math.min(i + BATCH, TOTAL_USERS)} users`);
  }
  // Warm cache for top 100
  const top = await User.find({}, { userId:1, balance:1, _id:0 }).sort({ balance: -1 }).limit(100);
  for (const u of top) await setCache(`user:${u.userId}`, { balance: u.balance, currency: 'USD' }, 3600);
  console.log('Cache warmed for top 100');
  process.exit(0);
})();