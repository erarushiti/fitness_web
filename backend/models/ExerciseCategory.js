// models/ExerciseCategory.js
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const ExerciseCategory = sequelize.define('ExerciseCategory', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    field: 'created_at',
  }
}, {
  tableName: 'exercise_categories',
  timestamps: false,
});

module.exports = ExerciseCategory;
