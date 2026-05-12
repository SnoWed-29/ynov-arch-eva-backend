const router = require('express').Router();
const authController = require('../controllers/auth.controller');
const { validateRegister, validateLogin } = require('../middlewares/validate.middleware');
const authMiddleware = require('../middlewares/auth.middleware');

router.post('/register', validateRegister, authController.register);
router.post('/login',    validateLogin,    authController.login);
router.get('/verify',                      authController.verifyToken);
router.get('/me',        authMiddleware,   authController.getMe);
router.put('/me',        authMiddleware,   authController.updateProfile);

module.exports = router;