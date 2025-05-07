const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Client = require('./Client');

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
      model: Client,
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  amount: {
    type: DataTypes.INTEGER,
    allowNull: false,
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

WaterLog.belongsTo(Client, { foreignKey: 'clientId', as: 'client' });
Client.hasMany(WaterLog, { foreignKey: 'clientId', as: 'waterLogs' });

module.exports = WaterLog;
