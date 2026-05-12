module.exports = (err, req, res, next) => {
  console.error(`[API Gateway Error] ${err.message}`);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Gateway Error',
  });
};