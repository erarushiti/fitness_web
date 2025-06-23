const express = require('express');
const router = express.Router();
const orderController = require('../controllers/ordersController');
const Order = require('../models/Orders');
const OrderItem = require('../models/OrderItems');
const Supplement = require('../models/Supplement');
const User = require('../models/User'); // Corrected to singular 'orderController'

router.post('/', orderController.createOrder);
router.get('/', orderController.getAllOrders);
router.get('/user/:userId', orderController.getOrdersByUserId);
router.put('/:id', orderController.updateOrder); // Added for edit functionality
router.delete('/:id', orderController.deleteOrder);
router.get('/:id', orderController.getOrderById);


router.get('/', async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'email', 'firstName', 'lastName'],
        },
        {
          model: OrderItem,
          as: 'orderItems',
          include: [
            {
              model: Supplement,
              as: 'supplement',
              attributes: ['id', 'name', 'image'],
            },
          ],
        },
      ],
    });
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders', details: error.message });
  }
});

router.get('/user/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const orders = await Order.findAll({
      where: { userId },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'email', 'firstName', 'lastName'],
        },
        {
          model: OrderItem,
          as: 'orderItems',
          include: [
            {
              model: Supplement,
              as: 'supplement',
              attributes: ['id', 'name', 'image'],
            },
          ],
        },
      ],
    });
    if (!orders.length) {
      return res.status(404).json({ error: 'No orders found for this user' });
    }
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders', details: error.message });
  }
});

module.exports = router;