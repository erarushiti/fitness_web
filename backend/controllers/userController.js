const User = require('../models/User');
const Client = require('../models/Client');
const Trainer = require('../models/Trainer');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validate: isUUID } = require('uuid');

// ================= USERS =================

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

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id, {
      attributes: ['id', 'email', 'firstName', 'lastName', 'role', 'createdAt'],
    });
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user', details: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, password, firstName, lastName, role } = req.body;

    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (req.user.id !== id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized to update this user' });
    }

    if (email && email !== user.email) {
      const existing = await User.findOne({ where: { email } });
      if (existing) return res.status(400).json({ error: 'Email already in use' });
    }

    const updates = {};
    if (email) updates.email = email;
    if (firstName) updates.firstName = firstName;
    if (lastName) updates.lastName = lastName;
    if (role && req.user.role === 'admin') updates.role = role;
    if (password) updates.password = await bcrypt.hash(password, 10);

    await user.update(updates);
    res.status(200).json({
      message: 'User updated',
      user: { id: user.id, email: user.email, firstName, lastName, role: user.role },
    });
  } catch (error) {
    console.error('Update user failed:', error);
    res.status(500).json({ error: 'Failed to update user', details: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    await user.destroy();
    res.status(200).json({ message: 'User deleted' });
  } catch (error) {
    console.error('Delete user failed:', error);
    res.status(500).json({ error: 'Failed to delete user', details: error.message });
  }
};

// ================= CLIENTS =================

const getAllClients = async (req, res) => {
  try {
    const clients = await Client.findAll({
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'email', 'firstName', 'lastName', 'role', 'createdAt'],
        },
        {
          model: Trainer,
          as: 'trainer',
          attributes: ['id', 'specialization', 'experienceYears'],
          include: {
            model: User,
            as: 'user',
            attributes: ['id', 'firstName', 'lastName', 'email'],
          },
        },
      ],
    });

    const formatted = clients.map(client => ({
      id: client.id,
      email: client.user?.email,
      name: `${client.user?.firstName} ${client.user?.lastName}`,
      fitnessGoals: client.fitnessGoals,
      weight: client.weight,
      height: client.height,
      trainerName: client.trainer?.user
        ? `${client.trainer.user.firstName} ${client.trainer.user.lastName}`
        : null,
      trainerEmail: client.trainer?.user?.email || null,
      trainerSpecialization: client.trainer?.specialization || null,
    }));

    res.status(200).json(formatted);
  } catch (error) {
    console.error('Error fetching clients:', error);
    res.status(500).json({ error: 'Failed to fetch clients', details: error.message });
  }
};

const updateClient = async (req, res) => {
  try {
    const { id } = req.params;
    const { trainerId, dateOfBirth, weight, height, fitnessGoals } = req.body;

    const client = await Client.findByPk(id);
    if (!client) return res.status(404).json({ error: 'Client not found' });

    await client.update({ trainerId, dateOfBirth, weight, height, fitnessGoals });

    res.status(200).json({ message: 'Client updated', client });
  } catch (error) {
    console.error('Error updating client:', error);
    res.status(500).json({ error: 'Failed to update client', details: error.message });
  }
};

const deleteClient = async (req, res) => {
  try {
    const { id } = req.params;

    const client = await Client.findByPk(id);
    if (!client) return res.status(404).json({ error: 'Client not found' });

    await client.destroy();
    res.status(200).json({ message: 'Client deleted' });
  } catch (error) {
    console.error('Error deleting client:', error);
    res.status(500).json({ error: 'Failed to delete client', details: error.message });
  }
};

// ================= TRAINERS =================

const getAllTrainers = async (req, res) => {
  try {
    const trainers = await Trainer.findAll({
      include: {
        model: User,
        as: 'user',
        attributes: ['id', 'email', 'firstName', 'lastName'],
      },
    });

    const formatted = trainers.map(trainer => ({
      id: trainer.id,
      userId: trainer.userId,
      specialization: trainer.specialization,
      experienceYears: trainer.experienceYears,
      bio: trainer.bio,
      name: `${trainer.user.firstName} ${trainer.user.lastName}`,
      email: trainer.user.email,
    }));

    res.status(200).json(formatted);
  } catch (error) {
    console.error('Error fetching trainers:', error);
    res.status(500).json({ error: 'Failed to fetch trainers' });
  }
};

const updateTrainer = async (req, res) => {
  try {
    const { id } = req.params;
    const { specialization, experienceYears, bio } = req.body;

    const trainer = await Trainer.findByPk(id);
    if (!trainer) return res.status(404).json({ error: 'Trainer not found' });

    await trainer.update({ specialization, experienceYears, bio });
    res.status(200).json({ message: 'Trainer updated', trainer });
  } catch (error) {
    console.error('Error updating trainer:', error);
    res.status(500).json({ error: 'Failed to update trainer', details: error.message });
  }
};

const deleteTrainer = async (req, res) => {
  try {
    const { id } = req.params;

    const trainer = await Trainer.findByPk(id);
    if (!trainer) return res.status(404).json({ error: 'Trainer not found' });

    await trainer.destroy();
    res.status(200).json({ message: 'Trainer deleted' });
  } catch (error) {
    console.error('Error deleting trainer:', error);
    res.status(500).json({ error: 'Failed to delete trainer', details: error.message });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,

  getAllClients,
  updateClient,
  deleteClient,

  getAllTrainers,
  updateTrainer,
  deleteTrainer,
};
