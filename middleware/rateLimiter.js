const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: (process.env.RATE_LIMIT_WINDOW || 1) * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX || 200),
  standardHeaders: true,
  legacyHeaders: false,
  message: { status: 'error', message: 'Too many requests', data: null, error_code: 'RATE_LIMIT_EXCEEDED' }
});

module.exports = limiter;