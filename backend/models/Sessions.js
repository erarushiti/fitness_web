const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Session = sequelize.define('Session', {
  id: {
    type: DataTypes.CHAR(36),
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  weekDays: {
    type: DataTypes.JSON, // store an array like ["Monday", "Wednesday"]
    allowNull: false,
    field: 'week_days',
  },
  time: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    field: 'created_at',
  },
}, {
  tableName: 'sessions',
  timestamps: false,
});

module.exports = Session;
