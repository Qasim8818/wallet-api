const sendResponse = (res, message, data) => res.json({ status: 'success', message, data });
const sendError = (res, message, error_code, status = 400) => res.status(status).json({ status: 'error', message, data: null, error_code });
module.exports = { sendResponse, sendError };