const express = require('express');
const trainingController = require('../controllers/trainingController');
const { requireAuth } = require('../middleware/auth');
const router = express.Router();

// Game pages - All require authentication
router.get('/cyberGame', requireAuth, trainingController.getCyberGame);
router.get('/architecture', requireAuth, trainingController.getArchitecture);
router.get('/exploit', requireAuth, trainingController.getExploit);
router.get('/penetration', requireAuth, trainingController.getPenetration);
router.get('/socialEngineering', requireAuth, trainingController.getSocialEngineering);

// Leaderboard page (public access)
router.get('/leaderboard', trainingController.getLeaderboardPage);

// API endpoints for game data
router.post('/save-session', requireAuth, trainingController.saveGameSession);
router.get('/progress', requireAuth, trainingController.getUserProgress);
router.get('/leaderboard', trainingController.getLeaderboard);
router.get('/leaderboard/:gameType', trainingController.getLeaderboard);

module.exports = router;