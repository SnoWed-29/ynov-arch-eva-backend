const router = require('express').Router();
const ctrl = require('../controllers/product.controller');
const categoryCtrl = require('../controllers/category.controller');
const isAdmin = require('../middlewares/isAdmin.middleware');

router.get('/',                          ctrl.getAll);
router.get('/categories',                categoryCtrl.getAll);
router.post('/categories',               isAdmin, categoryCtrl.create);
router.put('/categories/:id',            isAdmin, categoryCtrl.update);
router.delete('/categories/:id',         isAdmin, categoryCtrl.remove);
router.get('/:id',                       ctrl.getOne);
router.post('/',                         isAdmin, ctrl.create);
router.put('/:id',                       isAdmin, ctrl.update);
router.delete('/:id',                    isAdmin, ctrl.remove);

// Internal — called by order-service (no role check, internal network only)
router.post('/internal/decrement-stock',  ctrl.decrementStock);

module.exports = router;