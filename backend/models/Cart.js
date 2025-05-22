const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User'); // Assuming User model is in user.js
const Supplement = require('./Supplement'); // Assuming Supplement model exists

const Cart = sequelize.define('Cart', {
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
    field: 'user_id',
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
    validate: {
      min: 1,
    },
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    field: 'created_at',
  },
}, {
  tableName: 'carts',
  timestamps: false,
  indexes: [
    {
      unique: true,
      fields: ['user_id', 'supplement_id'],
    },
  ],
});

// Associations
Cart.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Cart.belongsTo(Supplement, { foreignKey: 'supplementId', as: 'supplement' });
User.hasMany(Cart, { foreignKey: 'userId', as: 'carts' });
Supplement.hasMany(Cart, { foreignKey: 'supplementId', as: 'carts' });

module.exports = Cart;