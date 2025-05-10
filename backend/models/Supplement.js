const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User'); // Make sure this path is correct

const Supplement = sequelize.define('Supplement', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING(500), // Assuming URL or path
    allowNull: true,
  },
  goal: {
    type: DataTypes.STRING(100), // E.g., "muscle gain", "fat loss"
    allowNull: false,
  },
  gender: {
    type: DataTypes.ENUM('male', 'female', 'other'),
    allowNull: false,
  },
  activity: {
    type: DataTypes.STRING(100), // E.g., "high", "moderate", "low"
    allowNull: false,
  },
  age: {
    type: DataTypes.STRING(100),
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
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    field: 'created_at',
  },
}, {
  tableName: 'supplements',
  timestamps: false,
});

// Define association
Supplement.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Supplement, { foreignKey: 'userId' });

module.exports = Supplement;
