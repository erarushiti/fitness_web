const bcrypt = require('bcrypt');
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require('../utils/jwt');
const User = require('../models/User');
const Client = require('../models/Client');
const Admin = require('../models/Admin');
const RefreshToken = require('../models/RefreshToken');
const { v4: uuidv4 } = require('uuid');

const register = async (req, res) => {
  try {
    const { email, password, firstName, lastName, role, dateOfBirth, weight, height, fitnessGoals, permissions } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      id: uuidv4(),
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role,
    });

    // Create role-specific record
    if (role === 'client') {
      await Client.create({
        id: uuidv4(),
        userId: user.id,
        dateOfBirth,
        weight,
        height,
        fitnessGoals,
      });
    } else if (role === 'admin') {
      await Admin.create({
        id: uuidv4(),
        userId: user.id,
        permissions: permissions || ['manage_users', 'view_reports'],
      });
    }

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate tokens
    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);

    // Store refresh token in database
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days expiration
    await RefreshToken.create({
      id: uuidv4(),
      userId: user.id,
      token: refreshToken,
      expiresAt,
    });

    res.json({
      accessToken,
      refreshToken,
      user: { id: user.id, email: user.email, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(401).json({ error: 'Refresh token required' });
    }

    // Verify refresh token
    const payload = verifyRefreshToken(refreshToken);
    const storedToken = await RefreshToken.findOne({ where: { token: refreshToken, userId: payload.userId } });

    if (!storedToken || storedToken.expiresAt < new Date()) {
      return res.status(403).json({ error: 'Invalid or expired refresh token' });
    }

    // Find user
    const user = await User.findByPk(payload.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Generate new access token
    const newAccessToken = signAccessToken(user);

    res.json({ accessToken: newAccessToken });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { register, login, refreshToken };