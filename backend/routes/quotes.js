const express = require('express');
const router = express.Router();
const { authenticateToken, isAdmin } = require('../middleware/auth');
const quoteController = require('../controllers/quoteController');
const upload = require('../middleware/upload');

// Protected routes
router.post('/', authenticateToken, isAdmin, upload.single('image'), quoteController.createQuote);
router.put('/:id', authenticateToken, isAdmin, upload.single('image'), quoteController.updateQuote);
router.delete('/:id', authenticateToken, isAdmin, quoteController.deleteQuote);

// Public route
router.get('/', quoteController.getAllQuotes);

module.exports = router;
