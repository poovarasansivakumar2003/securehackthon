const express = require('express');
const HomeController = require('../controllers/homeController');
const { requireAuth } = require('../middleware/auth');
const router = express.Router();

router.get('/', HomeController.getHome);
router.get('/training', HomeController.getTraining);
router.get('/cyberGame', HomeController.getCyberGame);
router.get('/architecture', HomeController.getArchitecture);
router.get('/exploit', HomeController.getExploit);
router.get('/penetration', HomeController.getPenetration);
router.get('/socialEngineering', HomeController.getSocialEngineering);
router.get('/lab', HomeController.getLab);
router.get('/quiz', HomeController.getQuiz);
router.get('/helpline', requireAuth, HomeController.getHelpline); // Protect helpline route with requireAuth

module.exports = router;