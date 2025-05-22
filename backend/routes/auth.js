// /routes/authRoutes.js

const express = require("express");
const router = express.Router();
const { register, login, refreshToken } = require("../controllers/authController");
const { authenticateToken, isAdmin } = require("../middleware/auth");  // Token validation middleware
const usersController = require("../controllers/userController");

// Public routes
router.post("/login", login);
router.post("/admin/register", register);

// Protected routes
router.get('/', authenticateToken, isAdmin, usersController.getAllUsers);
router.get('/:id', authenticateToken, usersController.getUserById);
router.put('/:id', authenticateToken, usersController.updateUser);
router.delete('/:id', authenticateToken, isAdmin, usersController.deleteUser);

// Protected route for refreshing token
router.post("/refresh-token", authenticateToken, refreshToken);

module.exports = router;
