const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  clientId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'client_id',
  },
  trainerId: {
    type: DataTypes.UUID,
    allowNull: true,
    field: 'trainer_id',
  },
  totalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    field: 'total_amount',
  },
  status: {
    type: DataTypes.ENUM('pending', 'paid', 'failed', 'cancelled'),
    defaultValue: 'pending',
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    field: 'created_at',
  },
}, {
  tableName: 'orders',
  timestamps: true,
  underscored: true,
});

// Define associations in associate method
Order.associate = (models) => {
  Order.belongsTo(models.Client, { foreignKey: 'client_id', as: 'client' });
  Order.belongsTo(models.Trainer, { foreignKey: 'trainer_id', as: 'trainer' });
  Order.hasMany(models.OrderItem, { foreignKey: 'order_id', as: 'items' });
};

module.exports = Order;
