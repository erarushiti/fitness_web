const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');

const RefreshToken = sequelize.define('RefreshToken', {
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
      model: User,  // User model association
      key: 'id',
    },
    onDelete: 'CASCADE',  // If the user is deleted, the refresh token should also be deleted
  },
  token: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'expires_at',  // Custom field name
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    field: 'created_at',  // Custom field name
  },
}, {
  tableName: 'refresh_tokens',  // Custom table name
  timestamps: false,  // This disables the automatic createdAt and updatedAt columns.
});

RefreshToken.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = RefreshToken;
