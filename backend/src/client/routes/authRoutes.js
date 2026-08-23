const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/send-otp', authController.sendOTP);
router.post('/verify-otp', authController.verifyOTP);
router.post('/login', authController.login);
router.put('/profile', authController.updateProfile);
router.get('/profile/:phone', authController.getProfile);

module.exports = router;
