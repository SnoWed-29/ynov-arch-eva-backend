const router = require('express').Router();
const ctrl = require('../controllers/payment.controller');
const isAdmin = require('../middlewares/isAdmin.middleware');

router.post('/',         ctrl.processPayment);       // authenticated user pays for an order
router.get('/my',        ctrl.getMyTransactions);    // own transactions
router.get('/:id',       ctrl.getTransactionById);   // owner or admin
router.get('/',          isAdmin, ctrl.getAllTransactions); // admin only

module.exports = router;