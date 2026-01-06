exports.errorHandler = (err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({ status: 'error', message: err.message || 'Server error', data: null, error_code: err.code || 'SERVER_ERROR' });
};