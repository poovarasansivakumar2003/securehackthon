const express = require('express');
const HomeController = require('../controllers/homeController');
const { requireAuth } = require('../middleware/auth');
const router = express.Router();

router.get('/', HomeController.getHome);
router.get('/training', HomeController.getTraining);
router.get('/lab', HomeController.getLab);
router.get('/quiz', HomeController.getQuiz);

router.get('/helpline', requireAuth, HomeController.getHelpline); // Protect helpline route with requireAuth

module.exports = router;