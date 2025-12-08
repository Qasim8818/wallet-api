// utils/cache.js
// Simple wrapper around ioredis / node‑redis (using the official redis v4 client).

const { createClient } = require('redis');
const config = require('./config');
const logger = require('./logger');

const client = createClient({
    url: config.REDIS_URL,
});

client
    .on('error', (err) => logger.error('Redis Client Error', err))
    .connect()
    .catch((err) => logger.error('Redis connection failed', err));

/**
 * Get a value from Redis and JSON‑parse it.
 */
async function get(key) {
    if (process.env.NODE_ENV === 'test') return null;
    const raw = await client.get(key);
    return raw ? JSON.parse(raw) : null;
}

/**
 * Set a value (JSON‑stringified) with optional TTL (seconds).
 */
async function set(key, value, ttlSeconds = null) {
    if (process.env.NODE_ENV === 'test') return;
    const payload = JSON.stringify(value);
    if (ttlSeconds) {
        await client.setEx(key, ttlSeconds, payload);
    } else {
        await client.set(key, payload);
    }
}

/**
 * Delete a key.
 */
async function del(key) {
    if (process.env.NODE_ENV === 'test') return;
    await client.del(key);
}

module.exports = {
    get,
    set,
    del,
    client, // exported for graceful shutdown if needed
};