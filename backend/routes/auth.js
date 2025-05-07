// /routes/authRoutes.js

const express = require("express");
const router = express.Router();
const { register, login, refreshToken } = require("../controllers/authController");
const { authenticateToken } = require("../middleware/auth");  // Token validation middleware

// Public routes
router.post("/login", login);
router.post("/admin/register", register);

// Protected route for refreshing token
router.post("/refresh-token", authenticateToken, refreshToken);

module.exports = router;
