const express = require('express');
const router = express.Router();
const counsellorController = require('../controllers/counsellorController');

router.get('/', counsellorController.getCounsellors);
router.get('/categories', counsellorController.getCategories);
router.get('/:id', counsellorController.getCounsellorById);

module.exports = router;
