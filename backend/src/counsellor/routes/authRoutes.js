const express = require('express');
const router = express.Router();
const counsellorAuthController = require('../controllers/counsellorAuthController');

router.post('/send-otp', counsellorAuthController.sendOTP);
router.post('/verify-otp', counsellorAuthController.verifyOTP);
router.post('/login', counsellorAuthController.login);
router.put('/onboarding', counsellorAuthController.completeOnboarding);
router.get('/profile/:phone', counsellorAuthController.getProfile);

module.exports = router;
