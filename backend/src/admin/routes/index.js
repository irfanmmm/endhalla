const express = require('express');
const router = express.Router();

const { requireAdmin } = require('../middleware/auth');
const authController = require('../controllers/authController');
const dashboardController = require('../controllers/dashboardController');
const counsellorController = require('../controllers/counsellorController');
const userController = require('../controllers/userController');
const bookingController = require('../controllers/bookingController');

// --- Auth ---
router.post('/auth/login', authController.login);
router.get('/auth/me', requireAdmin, authController.me);
router.put('/auth/password', requireAdmin, authController.changePassword);

// Everything below requires a valid admin token
router.use(requireAdmin);

// --- Dashboard ---
router.get('/dashboard/overview', dashboardController.getOverview);
router.get('/dashboard/activity', dashboardController.getActivity);

// --- Counsellors (self-register via the counsellor app; admin reviews them) ---
router.get('/counsellors', counsellorController.list);
router.get('/counsellors/pending/count', counsellorController.pendingCount);
router.get('/counsellors/:id', counsellorController.getById);
router.put('/counsellors/:id', counsellorController.update);
router.patch('/counsellors/:id/approval', counsellorController.review);
router.delete('/counsellors/:id', counsellorController.remove);

// --- Users ---
router.get('/users', userController.list);
router.get('/users/:id', userController.getById);
router.put('/users/:id', userController.update);
router.delete('/users/:id', userController.remove);

// --- Bookings & payments ---
router.get('/bookings', bookingController.list);
router.get('/bookings/payments/list', bookingController.payments);
router.get('/bookings/:id', bookingController.getById);
router.patch('/bookings/:id', bookingController.update);
router.delete('/bookings/:id', bookingController.remove);

module.exports = router;
