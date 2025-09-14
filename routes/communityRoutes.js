const express = require('express');
const CommunityController = require('../controllers/communityController');
const { requireAuth } = require('../middleware/auth');
const router = express.Router();

router.get('/', requireAuth, CommunityController.getCommunity);
router.post('/post', requireAuth, CommunityController.createPost);
router.post('/reply/:postId', requireAuth, CommunityController.replyToPost);

module.exports = router;
