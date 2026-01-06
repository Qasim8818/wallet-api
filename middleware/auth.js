const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.authenticate = async (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ status:'error', message:'Missing token', error_code:'NO_TOKEN' });
  const token = auth.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ userId: payload.userId });
    if (!user) return res.status(401).json({ status:'error', message:'Invalid token user', error_code:'INVALID_USER' });
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ status:'error', message:'Invalid token', error_code:'INVALID_TOKEN' });
  }
};