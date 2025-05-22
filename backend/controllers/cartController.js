const Cart = require('../models/Cart');
const Supplement = require('../models/Supplement'); // Assuming Supplement model exists

// Get cart items for a given userId
const getCart = async (req, res) => {
  const { userId } = req.params; // Use req.params instead of req.query
  try {
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    const cartItems = await Cart.findAll({
      where: { userId },
      include: [{ model: Supplement, as: 'supplement' }],
    });
    res.status(200).json(cartItems);
  } catch (err) {
    console.error('Error fetching cart:', err);
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
};
// Add or update item in cart
const addToCart = async (req, res) => {
  const { userId, supplementId, quantity } = req.body;
  try {
    console.log("Request Body:", req.body);
    if (!userId || !supplementId || !quantity || quantity < 1) {
      return res.status(400).json({ error: 'User ID, supplement ID, and valid quantity are required' });
    }
    const supplement = await Supplement.findByPk(supplementId);
    console.log("Supplement:", supplement);
    if (!supplement) {
      return res.status(404).json({ error: 'Supplement not found' });
    }
    const [cartItem, created] = await Cart.findOrCreate({
      where: { userId, supplementId },
      defaults: { quantity, userId, supplementId },
    });
    console.log("Cart Item:", cartItem, "Created:", created);
    if (!created) {
      await cartItem.update({ quantity });
    }
    const updatedCart = await Cart.findOne({
      where: { userId, supplementId },
      include: [{ model: Supplement, as: 'supplement' }],
    });
    res.status(200).json(updatedCart);
  } catch (err) {
    console.error("Add to Cart Error:", err.message, err.stack);
    res.status(500).json({ error: `Failed to add to cart: ${err.message}` });
  }
};

// Update quantity of an item in cart
const updateCartItem = async (req, res) => {
  const { supplementId } = req.params;
  const { userId, quantity } = req.body;
  try {
    if (!userId || !quantity || quantity < 1) {
      return res.status(400).json({ error: 'User ID and valid quantity are required' });
    }
    const cartItem = await Cart.findOne({
      where: { userId, supplementId },
    });
    if (!cartItem) {
      return res.status(404).json({ error: 'Cart item not found' });
    }
    await cartItem.update({ quantity });
    const updatedCart = await Cart.findOne({
      where: { userId, supplementId },
      include: [{ model: Supplement, as: 'supplement' }],
    });
    res.status(200).json(updatedCart);
  } catch (err) {
    console.error('Error updating cart:', err);
    res.status(500).json({ error: 'Failed to update cart' });
  }
};

// Remove item from cart
const removeFromCart = async (req, res) => {
  const { supplementId } = req.params;
//   const { userId } = req.body;
  try {
    // if (!userId) {
    //   return res.status(400).json({ error: 'User ID is required' });
    // }
    const cartItem = await Cart.findOne({
      where: { supplementId },
    });
    if (!cartItem) {
      return res.status(404).json({ error: 'Cart item not found' });
    }
    await cartItem.destroy();
    res.status(200).json({ message: 'Item removed from cart' });
  } catch (err) {
    console.error('Error removing from cart:', err);
    res.status(500).json({ error: 'Failed to remove from cart' });
  }
};

// Clear entire cart for the user
const clearCart = async (req, res) => {
  const { userId } = req.body;
  try {
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    await Cart.destroy({ where: { userId } });
    res.status(200).json({ message: 'Cart cleared successfully' });
  } catch (err) {
    console.error('Error clearing cart:', err);
    res.status(500).json({ error: 'Failed to clear cart' });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
};