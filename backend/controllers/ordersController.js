const { v4: uuidv4 } = require('uuid');
const Order = require('../models/Orders'); // Updated to use new Order model
const OrderItem = require('../models/OrderItems'); // Updated to use new OrderItem model
const User = require('../models/User'); // Use User model
const Supplement = require('../models/Supplement'); // Existing Supplement model

module.exports = {
  // Create a new order with items
  createOrder: async (req, res) => {
    const { userId, items } = req.body;

    if (!userId || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Invalid order data.' });
    }

    try {
      let totalAmount = 0;

      // Calculate total and validate supplements
      for (const item of items) {
        const supplement = await Supplement.findByPk(item.supplementId);
        if (!supplement) return res.status(404).json({ error: `Supplement not found: ${item.supplementId}` });
        totalAmount += supplement.price * (item.quantity || 1);
      }

      // Create Order
      const order = await Order.create({
        id: uuidv4(),
        userId,
        totalAmount,
        status: 'pending',
      });

      // Create OrderItems
      const orderItems = await Promise.all(items.map(async (item) => {
        const supplement = await Supplement.findByPk(item.supplementId);
        return OrderItem.create({
          id: uuidv4(),
          orderId: order.id,
          supplementId: supplement.id,
          quantity: item.quantity || 1,
          unitPrice: supplement.price,
        });
      }));

      return res.status(201).json({
        message: 'Order created successfully',
        order,
        items: orderItems,
      });
    } catch (error) {
      console.error('Create Order Error:', error);
      return res.status(500).json({ error: 'Internal server error.' });
    }
  },

  // Get all orders (with user and items)
  getAllOrders: async (req, res) => {
    try {
      const orders = await Order.findAll({
        include: [
          { model: User, as: 'User', attributes: ['id', 'email', 'firstName', 'lastName'] },
          {
            model: OrderItem,
            as: 'OrderItems',
            include: [{ model: Supplement, as: 'Supplement' }],
          },
        ],
      });

      return res.status(200).json(orders);
    } catch (error) {
      console.error('Fetch Orders Error:', error);
      return res.status(500).json({ error: 'Internal server error.' });
    }
  },

  // Get a specific order by userId
  getOrdersByUserId: async (req, res) => {
    const { userId } = req.params;

    try {
      const orders = await Order.findAll({
        where: { userId },
        include: [
          { model: User, as: 'User', attributes: ['id', 'email', 'firstName', 'lastName'] },
          {
            model: OrderItem,
            as: 'OrderItems',
            include: [{ model: Supplement, as: 'Supplement' }],
          },
        ],
      });

      if (!orders || orders.length === 0) {
        return res.status(404).json({ error: 'No orders found for this user.' });
      }

      return res.status(200).json(orders);
    } catch (error) {
      console.error('Fetch Orders Error:', error);
      return res.status(500).json({ error: 'Internal server error.' });
    }
  },

  // Update an order
  updateOrder: async (req, res) => {
    const { id } = req.params;
    const { totalAmount, status } = req.body;

    if (!totalAmount || !status) {
      return res.status(400).json({ error: 'Total amount and status are required.' });
    }

    try {
      const order = await Order.findByPk(id, {
        include: [
          { model: User, as: 'User', attributes: ['id', 'email', 'firstName', 'lastName'] },
          {
            model: OrderItem,
            as: 'OrderItems',
            include: [{ model: Supplement, as: 'Supplement' }],
          },
        ],
      });
      if (!order) return res.status(404).json({ error: 'Order not found.' });

      await order.update({
        totalAmount: parseFloat(totalAmount),
        status,
      });

      return res.status(200).json(order);
    } catch (error) {
      console.error('Update Order Error:', error);
      return res.status(500).json({ error: 'Internal server error.' });
    }
  },

  // Delete an order
  deleteOrder: async (req, res) => {
    const { id } = req.params;
    try {
      const order = await Order.findByPk(id);
      if (!order) return res.status(404).json({ error: 'Order not found.' });

      await OrderItem.destroy({ where: { orderId: id } });
      await order.destroy();

      return res.status(200).json({ message: 'Order deleted successfully.' });
    } catch (error) {
      console.error('Delete Order Error:', error);
      return res.status(500).json({ error: 'Internal server error.' });
    }
  },
};