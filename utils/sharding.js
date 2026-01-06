// Simple shard router: demonstrates hashing userId to choose a mongo shard/connection.
// In production you will use MongoDB sharded cluster and connect via mongos. This file
// provides a consistent hashing helper to know which logical shard a user would live on.

const crypto = require('crypto');

function shardForUser(userId, shardCount = 4) {
  const hash = crypto.createHash('md5').update(userId).digest('hex');
  const num = parseInt(hash.substring(0, 8), 16);
  return num % shardCount; // returns shard index
}

module.exports = { shardForUser };