const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Order = require('./Orders'); // Corrected from 'Orders'
const Supplement = require('./Supplement');

const OrderItem = sequelize.define('OrderItem', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  orderId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'orders',
      key: 'id',
    },
    field: 'order_id',
    onDelete: 'CASCADE',
  },
  supplementId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'supplements',
      key: 'id',
    },
    field: 'supplement_id',
    onDelete: 'CASCADE',
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
  unitPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    field: 'unit_price',
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    field: 'created_at',
  },
}, {
  tableName: 'order_items',
  timestamps: false,
});

// Define associations
OrderItem.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });
Order.hasMany(OrderItem, { foreignKey: 'orderId', as: 'orderItems' });
OrderItem.belongsTo(Supplement, { foreignKey: 'supplementId', as: 'supplement' });
Supplement.hasMany(OrderItem, { foreignKey: 'supplementId', as: 'orderItems' });

module.exports = OrderItem;