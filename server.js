// server.js - Simplified version without owner router
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const logger = require('./utils/logger');
const config = require('./utils/config');
const walletRouter = require('./routes/wallet');
const { errorResponse } = require('./utils/helpers');
// Add Swagger documentation
const { swaggerUi, specs } = require('./utils/swagger');
const postgresRouter = require('./routes/postgres');   // <-- NEW
const requestId = require('./middleware/request-id');
// Use request ID middleware
app.disable('x-powered-by');
app.use(requestId);


// MongoDB connection
mongoose.connect(config.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => logger.info('MongoDB connected'))
.catch((err) => {
    logger.error('MongoDB connection error:', err);
    process.exit(1);
});

const app = express();

// Security middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10kb' }));


// Rate limiting
const limiter = rateLimit({
    windowMs: config.RATE_LIMIT_WINDOW_MS,
    max: config.RATE_LIMIT_MAX,
    standardHeaders: true,
    legacyHeaders: false,
});
app.use(limiter);

// Health check
app.get('/healthz', (req, res) => res.status(200).json({ status: 'ok' }));

// Cache stats endpoint (for monitoring)
app.get('/cache/stats', (req, res) => {
    const lruCache = require('./utils/lruCache');
    res.json({
        lruCacheSize: lruCache.size(),
        lruCacheMaxSize: 1000, // matches our singleton initialization
    });
});

// Register wallet routes only
app.use('/api/v1/wallet', walletRouter);
// Register PostgreSQL demo routes under /api/v1/pg
app.use('/api/v1/pg', postgresRouter);

// Swagger docs route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
// 404 handler
app.use((req, res) => errorResponse(res, new Error('Not Found'), 404));

// Error handler
app.use((err, req, res, next) => {
    logger.error('Unhandled error:', err);
    return errorResponse(res, err, err.status || 500);
});

// Graceful shutdown
function gracefulShutdown() {
    logger.info('Shutting down gracefully...');
    mongoose.connection.close(false, () => {
        logger.info('MongoDB connection closed.');
        process.exit(0);
    });
}
process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);

// Start server
app.listen(config.PORT, () => {
    logger.info(`Server listening on http://localhost:${config.PORT}`);
    logger.info(`LRU cache initialized with max size: 1000 entries`);
});