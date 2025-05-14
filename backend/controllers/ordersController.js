const Orders = require("../models/Orders");
const OrderItems = require("../models/OrderItems");
const Trainer = require("../models/Trainer");
const Client = require("../models/Client");
const Supplement = require("../models/Supplement");
const { v4: uuidv4 } = require('uuid');

module.exports = {
  // Create a new order with items
  createOrder: async (req, res) => {
    const { clientId, trainerId, items } = req.body;

    if (!clientId || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Invalid order data.' });
    }

    try {
      let total_amount = 0;

      // Calculate total and validate supplements
      for (const item of items) {
        const supplement = await Supplement.findByPk(item.supplementId);
        if (!supplement) return res.status(404).json({ error: `Supplement not found: ${item.supplementId}` });
        total_amount += supplement.price * (item.quantity || 1);
      }

      // Create Orders
      const order = await Orders.create({
        id: uuidv4(),
        clientId,
        trainerId,
        total_amount,
        status: 'pending',
      });

      // Create OrderItems
      const orderItems = await Promise.all(items.map(async (item) => {
        const supplement = await Supplement.findByPk(item.supplementId);
        return OrderItems.create({
          id: uuidv4(),
          orderId: order.id,
          supplementId: supplement.id,
          quantity: item.quantity || 1,
          price: supplement.price,
        });
      }));

      return res.status(201).json({
        message: 'Orders created successfully',
        order,
        items: orderItems,
      });
    } catch (error) {
      console.error('Create Orders Error:', error);
      return res.status(500).json({ error: 'Internal server error.' });
    }
  },

  // Get all orders (with client and items)
  getAllOrders: async (req, res) => {
    try {
      const orders = await Orders.findAll({
        include: [
          { model: Client, as: 'client', attributes: ['id', 'userId'] },
          { model: Trainer, as: 'trainer', attributes: ['id', 'userId'] },
          {
            model: OrderItems,
            as: 'items',
            include: [{ model: Supplement, as: 'supplement' }],
          },
        ],
      });

      return res.status(200).json(orders);
    } catch (error) {
      console.error('Fetch Orders Error:', error);
      return res.status(500).json({ error: 'Internal server error.' });
    }
  },

  // Get a specific order
  getOrderById: async (req, res) => {
    const { id } = req.params;
    try {
      const order = await Orders.findByPk(id, {
        include: [
          { model: Client, as: 'client' },
          { model: Trainer, as: 'trainer' },
          {
            model: OrderItems,
            as: 'items',
            include: [{ model: Supplement, as: 'supplement' }],
          },
        ],
      });

      if (!order) return res.status(404).json({ error: 'Orders not found.' });

      return res.status(200).json(order);
    } catch (error) {
      console.error('Fetch Orders Error:', error);
      return res.status(500).json({ error: 'Internal server error.' });
    }
  },

  // Delete an order
  deleteOrder: async (req, res) => {
    const { id } = req.params;
    try {
      const order = await Orders.findByPk(id);
      if (!order) return res.status(404).json({ error: 'Orders not found.' });

      await OrderItems.destroy({ where: { orderId: id } });
      await order.destroy();

      return res.status(200).json({ message: 'Orders deleted successfully.' });
    } catch (error) {
      console.error('Delete Orders Error:', error);
      return res.status(500).json({ error: 'Internal server error.' });
    }
  },
};
