const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

// Cart routes
router.get('/:userId', cartController.getCart);
router.post('/', cartController.addToCart);
router.put('/:supplementId', cartController.updateCartItem);
router.delete('/:supplementId', cartController.removeFromCart);
router.delete('/', cartController.clearCart);

module.exports = router;