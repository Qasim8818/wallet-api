// Redis cluster-aware hot-cache and sharded cache helper
const Redis = require('ioredis');
require('dotenv').config();

let client;
if (process.env.REDIS_NODES) {
  // create cluster
  const nodes = process.env.REDIS_NODES.split(',').map(n => {
    const [host, port] = n.split(':');
    return { host, port: parseInt(port) };
  });
  client = new Redis.Cluster(nodes);
} else {
  client = new Redis({ host: process.env.REDIS_HOST, port: process.env.REDIS_PORT });
}

const DEFAULT_TTL = parseInt(process.env.CACHE_TTL || 60);

async function getCache(key) {
  try {
    const v = await client.get(key);
    return v ? JSON.parse(v) : null;
  } catch (err) { console.error('Redis get error', err); return null; }
}

async function setCache(key, value, ttl = DEFAULT_TTL) {
  try {
    await client.set(key, JSON.stringify(value), 'EX', ttl);
  } catch (err) { console.error('Redis set error', err); }
}

// hot-cache promotion: increment a score and keep top-N hot keys in sorted set
async function promoteHotKey(key) {
  try {
    await client.zincrby('hot_keys', 1, key);
  } catch (err) { console.error('Redis promote error', err); }
}

async function getTopHotKeys(limit = 100) {
  try {
    const keys = await client.zrevrange('hot_keys', 0, limit - 1);
    return keys;
  } catch (err) { console.error('Redis zrevrange', err); return []; }
}

module.exports = { client, getCache, setCache, promoteHotKey, getTopHotKeys };