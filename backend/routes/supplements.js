const express = require('express');
const router = express.Router();
const { authenticateToken, isAdmin } = require('../middleware/auth'); 
const Supplements = require("../controllers/supplementsController");
const upload = require("../middleware/upload");
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Supplement = require('../models/Supplement');
const Order = require('../models/Orders');
const OrderItem = require('../models/OrderItems');
const { validate: isUUID } = require('uuid');


// Protected routes
router.post('/', authenticateToken, isAdmin, upload.single('image'), Supplements.createSupplement);
router.put('/:id', authenticateToken, isAdmin,  upload.single('image'),  Supplements.updateSupplement);
router.delete('/:id', authenticateToken, isAdmin, Supplements.deleteSupplement);

router.get('/', Supplements.getAllSupplements);
router.get('/:id', Supplements.getSupplementById);

router.post('/:id/payment', async (req, res) => {
  try {
    const { id } = req.params || {};
    if (!id || !isUUID(id)) {
      return res.status(400).json({ error: 'Invalid or missing UUID' });
    }

    const supplement = await Supplement.findByPk(id);
    if (!supplement) {
      return res.status(404).json({ error: 'Supplement not found' });
    }

    if (!supplement.name || !supplement.price || isNaN(supplement.price)) {
      return res.status(400).json({ error: 'Invalid supplement data (name or price missing)' });
    }

    const price = parseFloat(supplement.price);
    const quantity = 1;

    // Create an order
    const order = await Order.create({
      userId: req.body.userId || null,
      totalAmount: price * quantity,
      status: 'pending',
    });

    // Create an order item
    await OrderItem.create({
      orderId: order.id,
      supplementId: id,
      quantity,
      unitPrice: price,
    });

    // Create a Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: supplement.name,
              description: supplement.description || 'No description available',
            },
            unit_amount: Math.round(price * 100),
          },
          quantity,
        },
      ],
      mode: 'payment',
      success_url: `http://localhost:3000/supplements/success?session_id={CHECKOUT_SESSION_ID}&order_id=${order.id}`,
      cancel_url: `http://localhost:3000/supplements/cancel`,
      metadata: {
        supplementId: id,
        orderId: order.id,
        userId: req.body.userId || 'anonymous',
      },
    });

    // Update order with Stripe session ID
    await order.update({ stripeSessionId: session.id });

    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error('Error creating Stripe Checkout session:', error);
    res.status(500).json({ error: 'Failed to create payment session', details: error.message });
  }
});

router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    return res.status(400).json({ error: 'Webhook verification failed' });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const orderId = session.metadata.orderId;

    try {
      const order = await Order.findByPk(orderId);
      if (order) {
        await order.update({ status: 'completed' });
        console.log(`Order ${orderId} marked as completed`);
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  } else if (event.type === 'checkout.session.expired') {
    const session = event.data.object;
    const orderId = session.metadata.orderId;

    try {
      const order = await Order.findByPk(orderId);
      if (order) {
        await order.update({ status: 'cancelled' });
        consoles.log(`Order ${orderId} marked as cancelled`);
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  }

  res.status(200).json({ received: true });
});
module.exports = router;