const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');

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
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
    field: 'updated_at',
  },
}, {
  tableName: 'clients',
  timestamps: false,
});

Client.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = Client;