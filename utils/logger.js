// utils/logger.js
// Winston logger configured for JSON output (easy to ship to log aggregators).

const { createLogger, format, transports } = require('winston');
const { NODE_ENV } = require('./config');

const logger = createLogger({
    level: NODE_ENV === 'development' ? 'debug' : 'info',
    format: format.combine(
        format.timestamp(),
        format.errors({ stack: true }),
        format.json()
    ),
    transports: [new transports.Console()],
    
});

module.exports = logger;
