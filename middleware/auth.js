// middleware/auth.js
const jwt = require('jsonwebtoken');
const { errorResponse } = require('../utils/helpers');
const logger = require('../utils/logger');

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return errorResponse(res, new Error('Access token required'), 401);
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            logger.warn('JWT verification failed:', err.message);
            return errorResponse(res, new Error('Invalid or expired token'), 403);
        }
        req.user = user;
        next();
    });
};

const generateToken = (userId, email) => {
    return jwt.sign({ userId, email }, JWT_SECRET, { expiresIn: '24h' });
};

module.exports = { authenticateToken, generateToken, JWT_SECRET };