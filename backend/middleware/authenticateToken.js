// /routes/protected.js

const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authenticateToken'); // Import authenticateToken middleware

// Example protected route
router.get('/admin-dashboard', authenticateToken, (req, res) => {
  // The user will be attached to the request if the token is valid
  res.json({
    message: 'Welcome to the admin dashboard',
    user: req.user, // Attach user data to the response
  });
});

// Other protected routes can go here...

module.exports = router; // Export the protected routes
