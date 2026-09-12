const express = require('express');
const router = express.Router();
const counsellorAuthController = require('../controllers/counsellorAuthController');
const { requireCounsellorAuth } = require('../middleware/auth');

router.post('/send-otp', counsellorAuthController.sendOTP);
router.post('/verify-otp', counsellorAuthController.verifyOTP);
router.post('/login', counsellorAuthController.login);
router.put('/onboarding', counsellorAuthController.completeOnboarding);
router.get('/profile/:phone', counsellorAuthController.getProfile);
router.put('/push-token', requireCounsellorAuth, counsellorAuthController.updatePushToken);

module.exports = router;
