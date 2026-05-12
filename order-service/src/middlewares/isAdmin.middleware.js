module.exports = (req, res, next) => {
  if (req.headers['x-user-role'] !== 'admin')
    return res.status(403).json({ message: 'Forbidden: admins only' });
  next();
};