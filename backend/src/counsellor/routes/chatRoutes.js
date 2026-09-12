const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { requireCounsellorAuth } = require('../middleware/auth');

router.get('/token', requireCounsellorAuth, chatController.getChatToken);

module.exports = router;
