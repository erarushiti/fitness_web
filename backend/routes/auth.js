// /routes/authRoutes.js

const express = require("express");
const router = express.Router();
const { register, login, refreshToken } = require("../controllers/authController");
const { authenticateToken, isAdmin } = require("../middleware/auth");  // Token validation middleware
const usersController = require("../controllers/userController");

// Public routes
router.post("/login", login);
router.post("/admin/register", register);

// USERS
router.get('/users', authenticateToken, isAdmin, usersController.getAllUsers);
router.get('/users/:id', authenticateToken, usersController.getUserById);
router.put('/users/:id', authenticateToken, usersController.updateUser);
router.delete('/users/:id', authenticateToken, isAdmin, usersController.deleteUser);

// CLIENTS
router.get('/clients', authenticateToken, usersController.getAllClients);
router.put('/clients/:id', authenticateToken, usersController.updateClient);
router.delete('/clients/:id', authenticateToken, usersController.deleteClient);

// TRAINERS
router.get('/trainers', authenticateToken, usersController.getAllTrainers);
router.put('/trainers/:id', authenticateToken, usersController.updateTrainer);
router.delete('/trainers/:id', authenticateToken, usersController.deleteTrainer);

// Protected route for refreshing token
router.post("/refresh-token", authenticateToken, refreshToken);

module.exports = router;
