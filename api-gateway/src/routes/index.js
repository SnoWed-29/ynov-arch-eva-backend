const router = require('express').Router();
const proxy = require('express-http-proxy');
const authMiddleware = require('../middlewares/auth.middleware');

const authRoutes = require('./auth.routes');

// Public routes — forwarded directly
router.use('/auth', authRoutes);

// Protected routes — JWT required before proxying
router.use('/products', authMiddleware, proxy(process.env.PRODUCTS_SERVICE_URL, {
  proxyReqPathResolver: (req) => `/api/products${req.url}`,
}));

router.use('/orders', authMiddleware, proxy(process.env.ORDER_SERVICE_URL, {
  proxyReqPathResolver: (req) => `/api/orders${req.url}`,
}));

router.use('/payments', authMiddleware, proxy(process.env.PAYMENT_SERVICE_URL, {
  proxyReqPathResolver: (req) => `/api/payments${req.url}`,
}));

router.use('/notifications', authMiddleware, proxy(process.env.NOTIFICATION_SERVICE_URL, {
  proxyReqPathResolver: (req) => `/api/notifications${req.url}`,
}));

module.exports = router;