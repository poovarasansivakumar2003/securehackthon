const express = require('express');
const AuthController = require('../controllers/authController');
const { redirectIfAuthenticated } = require('../middleware/auth');
const router = express.Router();

router.get('/login', redirectIfAuthenticated, AuthController.getLogin);
router.get('/signup', redirectIfAuthenticated, AuthController.getSignup);
router.post('/signup', redirectIfAuthenticated, AuthController.postSignup);
router.post('/login', redirectIfAuthenticated, AuthController.postLogin);
router.post('/logout', AuthController.logout);
router.get('/logout', AuthController.logout);

module.exports = router;
