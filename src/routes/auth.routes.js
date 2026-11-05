const express = require('express');
const authController = require('../controllers/auth.controller');
const validateSchema = require('../middlewares/validateSchema.middleware');
const { protect } = require('../middlewares/auth.middlewares');
const { registerSchema, loginSchema } = require('../schemas/auth.schemas');

const router = express.Router();

router.post('/register', validateSchema(registerSchema, 'body'), authController.register);
router.post('/login', validateSchema(loginSchema, 'body'), authController.login);
router.get('/me', protect, authController.me);

module.exports = router;
