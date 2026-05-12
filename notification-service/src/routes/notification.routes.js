const router = require('express').Router();
const ctrl = require('../controllers/notification.controller');

// Internal routes called by other services
router.post('/internal/order-placed',    ctrl.orderPlaced);
router.post('/internal/payment-success', ctrl.paymentSuccess);
router.post('/internal/payment-failed',  ctrl.paymentFailed);
router.post('/internal/order-shipped',   ctrl.orderShipped);

// Public retrieval for inside-app notification display
router.get('/my', ctrl.getMyNotifications);

module.exports = router;