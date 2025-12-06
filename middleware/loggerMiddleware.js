// middleware/loggerMiddleware.js
const logger = require('../utils/logger');

const requestLogger = (req, res, next) => {
    const start = Date.now();

    res.on('finish', () => {
        const duration = Date.now() - start;
        logger.info({
            method: req.method,
            url: req.url,
            status: res.statusCode,
            duration: `${duration}ms`,
            ip: req.ip,
            userAgent: req.get('User-Agent')
        }, 'HTTP request');
    });

    next();
};

const performanceMonitor = (req, res, next) => {
    req.startTime = process.hrtime();
    next();
};

module.exports = { requestLogger, performanceMonitor };