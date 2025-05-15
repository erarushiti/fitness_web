const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Order = require('./Orders'); // Adjust path as needed
const Supplement = require('./Supplement'); // Adjust path as needed

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
  },
  supplementId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'supplements',
      key: 'id',
    },
    field: 'supplement_id',
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
  unitPrice: {
    type: DataTypes.FLOAT,
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
OrderItem.belongsTo(Order, { foreignKey: 'orderId' });
Order.hasMany(OrderItem, { foreignKey: 'orderId' });
OrderItem.belongsTo(Supplement, { foreignKey: 'supplementId' });
Supplement.hasMany(OrderItem, { foreignKey: 'supplementId' });

module.exports = OrderItem;