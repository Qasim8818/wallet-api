// utils/helpers.js - SIMPLIFIED WORKING VERSION
// Generic helper utilities used across the app.

const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

const successResponse = (res, data, message = 'Success', status = 200) => {
    return res.status(status).json({
        success: true,
        message,
        data,
    });
};

const errorResponse = (res, error, status = 500) => {
    const msg = error?.message || 'Internal Server Error';
    return res.status(status).json({
        success: false,
        message: msg,
        ...(process.env.NODE_ENV === 'development' && { stack: error?.stack }),
    });
};

module.exports = {
    asyncHandler,
    successResponse,
    errorResponse,
};