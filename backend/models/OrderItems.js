const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const OrderItem = sequelize.define('OrderItem', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  orderId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'order_id',
  },
  supplementId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'supplement_id',
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
}, {
  tableName: 'order_items',
  timestamps: false,
  underscored: true,
});

// Define associations
OrderItem.associate = (models) => {
  OrderItem.belongsTo(models.Order, { foreignKey: 'order_id', as: 'order' });
  OrderItem.belongsTo(models.Supplement, { foreignKey: 'supplement_id', as: 'supplement' });
};

module.exports = OrderItem;
