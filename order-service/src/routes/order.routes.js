const router = require('express').Router();
const ctrl = require('../controllers/order.controller');
const isAdmin = require('../middlewares/isAdmin.middleware');

router.post('/',                         ctrl.createOrder);
router.get('/',                          ctrl.getMyOrders);
router.get('/:id',                       ctrl.getOne);
router.patch('/:id/status', isAdmin,     ctrl.updateStatus);

// Internal — called by payment-service
router.get('/internal/:id/details',      ctrl.getOneInternal);
router.patch('/internal/:id/mark-paid',  ctrl.markPaid);

module.exports = router;