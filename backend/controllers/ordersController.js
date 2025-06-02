const { v4: uuidv4 } = require("uuid");
const Order = require("../models/Orders"); // Updated to use new Order model
const OrderItem = require("../models/OrderItems"); // Updated to use new OrderItem model
const User = require("../models/User"); // Use User model
const Supplement = require("../models/Supplement"); // Existing Supplement model


module.exports = {
  // Create a new order with items
  createOrder: async (req, res) => {
    const { userId, items } = req.body;

    if (!userId || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Invalid order data." });
    }

    try {
      let totalAmount = 0;

      // Calculate total and validate supplements
      for (const item of items) {
        const supplement = await Supplement.findByPk(item.supplementId);
        if (!supplement)
          return res
            .status(404)
            .json({ error: `Supplement not found: ${item.supplementId}` });
        totalAmount += supplement.price * (item.quantity || 1);
      }

      // Create Order
      const order = await Order.create({
        id: uuidv4(),
        userId,
        totalAmount,
        status: "pending",
      });

      // Create OrderItems
      const orderItems = await Promise.all(
        items.map(async (item) => {
          const supplement = await Supplement.findByPk(item.supplementId);
          return OrderItem.create({
            id: uuidv4(),
            orderId: order.id,
            supplementId: supplement.id,
            quantity: item.quantity || 1,
            unitPrice: supplement.price,
          });
        })
      );

      return res.status(201).json({
        message: "Order created successfully",
        order,
        items: orderItems,
      });
    } catch (error) {
      console.error("Create Order Error:", error);
      return res.status(500).json({ error: "Internal server error." });
    }
  },

  // Get all orders (with user and items)
  getAllOrders: async (req, res) => {
    try {
      const orders = await Order.findAll({
        include: [
          {
            model: User,
            as: "user", // this must match the alias used in Order.belongsTo(User)
            attributes: ["id", "email", "firstName", "lastName"],
          },
          {
            model: OrderItem,
            as: "orderItems", // must match Order.hasMany(OrderItem)
            include: [
              {
                model: Supplement,
                as: "supplement", // must match OrderItem.belongsTo(Supplement)
              },
            ],
          },
        ],
      });

      return res.status(200).json(orders);
    } catch (error) {
      console.error("Fetch Orders Error:", error);
      return res.status(500).json({ error: "Internal server error." });
    }
  },

  // Get a specific order by userId
  getOrdersByUserId: async (req, res) => {
    const { userId } = req.params;

    try {
      const orders = await Order.findAll({
        where: { userId },
        include: [
          {
            model: User,
            as: "user",
            attributes: ["id", "email", "firstName", "lastName"],
          },
          {
            model: OrderItem,
            as: "orderItems", // lowercase as per your association
            include: [
              { model: Supplement, as: "supplement" }, // lowercase as per your association
            ],
          },
        ],
      });

      if (!orders || orders.length === 0) {
        return res
          .status(404)
          .json({ error: "No orders found for this user." });
      }

      return res.status(200).json(orders);
    } catch (error) {
      console.error("Fetch Orders Error:", error);
      return res.status(500).json({ error: "Internal server error." });
    }
  },

// READ a single order by ID
  getOrderById: async  (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'Missing order ID' });
    }

    const order = await Order.findByPk(id, {
      include: [
        {
          model: OrderItem,
          as: 'orderItems', // ✅ use alias
          include: [
            {
              model: Supplement,
              as: 'supplement', // only if you used 'as' for Supplement relation
            },
          ],
        },
        {
          model: User,
          as: 'user', // only if you used alias for user relation
        },
      ],
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Failed to fetch order', details: error.message });
  }
},

  // Update an order
 updateOrder: async (req, res) => {
  const { id } = req.params;
  const { totalAmount, status } = req.body;

  if (!totalAmount || !status) {
    return res
      .status(400)
      .json({ error: "Total amount and status are required." });
  }

  try {
    const order = await Order.findByPk(id);
    if (!order) return res.status(404).json({ error: "Order not found." });

    await order.update({
      totalAmount: parseFloat(totalAmount),
      status,
    });

    // Reload updated order with associations
    const updatedOrder = await Order.findByPk(id, {
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "email", "firstName", "lastName"],
        },
        {
          model: OrderItem,
          as: "orderItems",
          include: [{ model: Supplement, as: "supplement" }],
        },
      ],
    });

    return res.status(200).json(updatedOrder);
  } catch (error) {
    console.error("Update Order Error:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
},

  // Delete an order
  deleteOrder: async (req, res) => {
    const { id } = req.params;
    try {
      const order = await Order.findByPk(id);
      if (!order) return res.status(404).json({ error: "Order not found." });

      await OrderItem.destroy({ where: { orderId: id } });
      await order.destroy();

      return res.status(200).json({ message: "Order deleted successfully." });
    } catch (error) {
      console.error("Delete Order Error:", error);
      return res.status(500).json({ error: "Internal server error." });
    }
  },
};
