const express = require('express');
const router = express.Router();
const { authenticateToken, isAdmin } = require('../middleware/auth'); 
const Supplements = require("../controllers/supplementsController");
const upload = require("../middleware/upload");
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Supplement = require('../models/Supplement');
const Order = require('../models/Orders');
const OrderItem = require('../models/OrderItems');
const Cart = require('../models/Cart'); // Add Cart model import
const { validate: isUUID } = require('uuid');

// Protected routes
router.post('/', authenticateToken, isAdmin, upload.single('image'), Supplements.createSupplement);
router.put('/:id', authenticateToken, isAdmin, upload.single('image'), Supplements.updateSupplement);
router.delete('/:id', authenticateToken, isAdmin, Supplements.deleteSupplement);

router.get('/', Supplements.getAllSupplements);
router.get('/search', Supplements.advancedSearch); // ← match first
router.get('/:id', Supplements.getSupplementById); // ← fallback for IDs


router.post('/checkout', async (req, res) => {
  try {
    console.log('Request body:', req.body);
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    // Optional: Validate userId format if using UUID
    if (!isUUID(userId)) {
      return res.status(400).json({ error: 'Invalid User ID format' });
    }

    const cartItems = await Cart.findAll({
      where: { userId },
      include: [{ model: Supplement, as: 'supplement' }],
    });
    console.log('Cart items:', JSON.stringify(cartItems, null, 2));

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    let totalAmount = 0;
    const lineItems = cartItems.map((item) => {
      const supplement = item.supplement;
      console.log('Supplement:', supplement);
      if (!supplement || !supplement.name || supplement.price == null || isNaN(parseFloat(supplement.price))) {
        console.error('Invalid supplement:', supplement);
        throw new Error(`Invalid supplement data for supplement ID ${item.supplementId}`);
      }
      const price = parseFloat(supplement.price);
      if (price <= 0) {
        throw new Error(`Invalid price for supplement ID ${item.supplementId}`);
      }
      totalAmount += price * item.quantity;
      return {
        price_data: {
          currency: 'eur',
          product_data: {
            name: supplement.name,
            description: supplement.description || 'No description available',
          },
          unit_amount: Math.round(price * 100), // Convert to cents
        },
        quantity: item.quantity,
      };
    });
    console.log('Line items:', JSON.stringify(lineItems, null, 2));

    const order = await Order.create({
      userId,
      totalAmount,
      status: 'pending',
    });
    console.log('Order created:', order.id);

    await Promise.all(
      cartItems.map((item) =>
        OrderItem.create({
          orderId: order.id,
          supplementId: item.supplementId,
          quantity: item.quantity,
          unitPrice: parseFloat(item.supplement.price),
        })
      )
    );
    console.log('Order items created');

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `http://localhost:3000/Cart/success?session_id={CHECKOUT_SESSION_ID}&order_id=${order.id}`,
      cancel_url: `http://localhost:3000/Cart/cancel`,
      metadata: {
        orderId: order.id.toString(), // Ensure string for Stripe metadata
        userId: userId || 'anonymous',
      },
    });
    console.log('Stripe session:', session.id);

    await order.update({ stripeSessionId: session.id });
    await Cart.destroy({ where: { userId } });
    console.log('Cart cleared');

    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error('Error creating cart checkout session:', error);
    res.status(500).json({ error: 'Failed to create payment session', details: error.message });
  }
});

module.exports = router;