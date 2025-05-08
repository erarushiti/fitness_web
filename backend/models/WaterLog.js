const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');

const WaterLog = sequelize.define('WaterLog', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  clientId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'client_id',
    references: {
      model: User,
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  amount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0, // Ensure non-negative water amounts
    },
    comment: 'Amount of water in milliliters',
  },
  timestamp: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
  },

}, {
  tableName: 'water_logs',
  timestamps: false,
});

// Associations
WaterLog.belongsTo(User, { foreignKey: 'clientId', as: 'client' });
User.hasMany(WaterLog, { foreignKey: 'clientId', as: 'waterLogs' });

module.exports = WaterLog;