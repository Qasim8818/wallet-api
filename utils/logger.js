// utils/logger.js – Winston logger with request ID

const { createLogger, format, transports } = require('winston');
const { NODE_ENV } = require('./config');
const { v4: uuidv4 } = require('uuid');

const logger = createLogger({
    level: NODE_ENV === 'development' ? 'debug' : 'info',
    format: format.combine(
        format.timestamp(),
        format.errors({ stack: true }),
        format((info) => {
            info.requestId = info.requestId || uuidv4(); // fallback
            return info;
        })(),
        format.json()
    ),
    transports: [new transports.Console()],
});

module.exports = logger;