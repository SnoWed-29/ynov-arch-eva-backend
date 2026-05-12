const router = require('express').Router();
const ctrl = require('../controllers/category.controller');
const isAdmin = require('../middlewares/isAdmin.middleware');

router.get('/',         ctrl.getAll);
router.post('/',        isAdmin, ctrl.create);
router.put('/:id',      isAdmin, ctrl.update);
router.delete('/:id',   isAdmin, ctrl.remove);

module.exports = router;