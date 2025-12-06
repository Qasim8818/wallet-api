
require('dotenv').config();

module.exports = {
    // Server
    PORT: process.env.PORT || 3000,

    // MongoDB
    MONGODB_URI:
        process.env.MONGODB_URI, // fallback for local dev

    // Redis
    REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',

    // Security / rate‑limit
    RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
    RATE_LIMIT_MAX: parseInt(process.env.RATE_LIMIT_MAX) || 100,

    // Misc
    NODE_ENV: process.env.NODE_ENV || 'development',
};  