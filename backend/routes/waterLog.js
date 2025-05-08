const express = require('express');
const router = express.Router();

// Import the necessary middlewares and controller
const { authenticateToken, isClient } = require('../middleware/auth');
const waterLogController = require('../controllers/waterLogController');

// POST request to create a new water log
router.post('/',  waterLogController.createWaterLog);

// GET request to fetch all water logs
router.get('/:clientId', waterLogController.getWaterLogsByClient);

module.exports = router;
