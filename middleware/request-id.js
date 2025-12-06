// middleware/request-id.js – attach a request ID to all requests

const { v4: uuidv4 } = require('uuid');
const logger = require('../utils/logger');

module.exports = (req, res, next) => {
    const id = uuidv4();
    req.id = id;
    res.setHeader('X-Request-Id', id);
    req.log = logger.child({ requestId: id });
    next();
};