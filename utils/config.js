// utils/config.js – Centralised configuration

require('dotenv').config();

module.exports = {
    // Server
    PORT: process.env.PORT || 3000,

    // MongoDB 
    MONGODB_URI:
        process.env.MONGODB_URI,

    // Redis
    REDIS_URL: process.env.REDIS_URL ,

    // PostgreSQL – read from environment
    PG: {
        user: process.env.PG_USER || 'postgres',
        host: process.env.PG_HOST || 'postgres',
        database: process.env.PG_DATABASE || 'indexdemo',
        password: process.env.PG_PASSWORD || '1234',
        port: parseInt(process.env.PG_PORT, 10) || 5432,
    },

    // Security / rate‑limit
    RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
    RATE_LIMIT_MAX: parseInt(process.env.RATE_LIMIT_MAX) || 100,

    NODE_ENV: process.env.NODE_ENV || 'development',
};