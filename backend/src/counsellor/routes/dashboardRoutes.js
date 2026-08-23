const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

router.get('/overview/:phone', dashboardController.getDashboardOverview);
router.put('/settings', dashboardController.updateSettings);

module.exports = router;
