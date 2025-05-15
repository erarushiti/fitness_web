const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');
const Trainer = require('./Trainer'); 
const Order = require('./Orders');

const Client = sequelize.define('Client', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'user_id',
    references: {
      model: User,
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  trainerId: {
    type: DataTypes.UUID,
    allowNull: true,
    field: 'trainer_id',
    references: {
      model: Trainer,
      key: 'id',
    },
    onDelete: 'SET NULL',
  },
  dateOfBirth: {
    type: DataTypes.DATEONLY,
    field: 'date_of_birth',
  },
  weight: {
    type: DataTypes.DECIMAL(5, 2),
  },
  height: {
    type: DataTypes.DECIMAL(5, 2),
  },
  fitnessGoals: {
    type: DataTypes.TEXT,
    field: 'fitness_goals',
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    field: 'created_at',
  },
}, {
  tableName: 'clients',
  timestamps: false,
});

Client.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Client.belongsTo(Trainer, { foreignKey: 'trainerId', as: 'trainer' });
Trainer.hasMany(Client, { foreignKey: 'trainerId', as: 'clients' });

module.exports = Client;