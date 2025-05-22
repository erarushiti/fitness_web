const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validate: isUUID } = require('uuid');


// Get all users (admin only)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'email', 'firstName', 'lastName', 'role', 'createdAt'],
    });
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users', details: error.message });
  }
};

// Get user by ID
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isUUID(id)) {
      return res.status(400).json({ error: 'Invalid User ID format' });
    }

    const user = await User.findByPk(id, {
      attributes: ['id', 'email', 'firstName', 'lastName', 'role', 'createdAt'],
    });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user', details: error.message });
  }
};

// Update user (admin or self)
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, password, firstName, lastName, role } = req.body;

    if (!isUUID(id)) {
      return res.status(400).json({ error: 'Invalid User ID format' });
    }

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if the requester is admin or updating their own profile
    if (req.user.id !== id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized to update this user' });
    }

    // Validate input
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ error: 'Email already in use' });
      }
    }
    if (role && !['client', 'trainer', 'admin'].includes(role) && req.user.role !== 'admin') {
      return res.status(400).json({ error: 'Invalid role or unauthorized to change role' });
    }

    // Update fields
    const updates = {};
    if (email) updates.email = email;
    if (firstName) updates.firstName = firstName;
    if (lastName) updates.lastName = lastName;
    if (role && req.user.role === 'admin') updates.role = role;
    if (password) {
      const saltRounds = 10;
      updates.password = await bcrypt.hash(password, saltRounds);
    }

    await user.update(updates);

    res.status(200).json({
      message: 'User updated successfully',
      user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role },
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user', details: error.message });
  }
};

// Delete user (admin only)
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isUUID(id)) {
      return res.status(400).json({ error: 'Invalid User ID format' });
    }

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await user.destroy();
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user', details: error.message });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};