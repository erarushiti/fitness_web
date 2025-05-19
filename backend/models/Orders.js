const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
userId: {
  type: DataTypes.UUID,
  allowNull: false,
  references: {
    model: 'users',
    key: 'id',
  },
  field: 'user_id', // matches your DB naming convention
},
  totalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    field: 'total_amount',
  },
  status: {
    type: DataTypes.ENUM('pending', 'completed', 'cancelled', 'failed'),
    allowNull: false,
    defaultValue: 'pending',
  },
  stripeSessionId: {
    type: DataTypes.STRING(255),
    allowNull: true,
    field: 'stripe_session_id',
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    field: 'created_at',
  },
}, {
  tableName: 'orders',
  timestamps: false,
});


Order.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
User.hasMany(Order, { foreignKey: 'user_id', as: 'orders' });


module.exports = Order;