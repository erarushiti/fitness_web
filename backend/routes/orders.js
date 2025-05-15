const express = require('express');
const router = express.Router();
const orderController = require('../controllers/ordersController'); // Corrected to singular 'orderController'

router.post('/', orderController.createOrder);
router.get('/', orderController.getAllOrders);
router.get('/user/:userId', orderController.getOrdersByUserId);
router.put('/:id', orderController.updateOrder); // Added for edit functionality
router.delete('/:id', orderController.deleteOrder);

module.exports = router;