const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

router.post('/', bookingController.createBooking);
router.post('/create-razorpay-order', bookingController.createRazorpayOrder);
router.post('/verify-razorpay-payment', bookingController.verifyRazorpayPayment);
router.post('/razorpay-webhook', bookingController.handleRazorpayWebhook);
router.get('/booked-slots', bookingController.getBookedSlots);
router.get('/client/:phone', bookingController.getClientBookings);
router.get('/:id', bookingController.getBookingById);
router.patch('/:id/cancel', bookingController.cancelBooking);

module.exports = router;
