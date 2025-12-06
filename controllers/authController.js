// controllers/authController.js
const User = require('../models/user');
const { generateToken, authenticateToken } = require('../middleware/auth');
const { successResponse, errorResponse, asyncHandler } = require('../utils/helpers');
const logger = require('../utils/logger');

const register = asyncHandler(async (req, res) => {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
        return errorResponse(res, new Error('Email, password, and name are required'), 400);
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return errorResponse(res, new Error('User already exists'), 409);
    }

    const user = await User.create({ email, password, name });
    const token = generateToken(user._id, user.email);

    logger.info(`New user registered: ${email}`);
    successResponse(res, {
        user: { id: user._id, email: user.email, name: user.name },
        token
    }, 'Registration successful', 201);
});

const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return errorResponse(res, new Error('Email and password are required'), 400);
    }

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
        return errorResponse(res, new Error('Invalid credentials'), 401);
    }

    const token = generateToken(user._id, user.email);

    logger.info(`User logged in: ${email}`);
    successResponse(res, {
        user: { id: user._id, email: user.email, name: user.name },
        token
    }, 'Login successful');
});

const getProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.userId).select('-password');
    successResponse(res, { user });
});

/**
 * @swagger
 * /api/v1/wallet:
 *   post:
 *     summary: Create a new wallet
 *     tags: [Wallet]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - owner
 *             properties:
 *               owner:
 *                 type: string
 *                 description: Wallet owner's email
 *               balance:
 *                 type: number
 *                 description: Initial balance
 *     responses:
 *       201:
 *         description: Wallet created successfully
 */

module.exports = { register, login, getProfile };