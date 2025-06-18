// models/Exercise.js
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Trainer = require('./Trainer');
const ExerciseCategory = require('./ExerciseCategory');

const Exercise = sequelize.define('Exercise', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  trainerId: {
    type: DataTypes.UUID,
    allowNull: true,
    field: 'trainer_id',
    references: {
      model: Trainer,
      key: 'id',
    },
    onDelete: 'SET NULL',
  },
  categoryId: {
    type: DataTypes.UUID,
    allowNull: true,
    field: 'category_id',
    references: {
      model: ExerciseCategory,
      key: 'id',
    },
    onDelete: 'SET NULL',
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  imageUrl: {
    type: DataTypes.STRING(255),
    allowNull: true,
    field: 'image_url',
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  steps: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  musclesWorked: {
    type: DataTypes.JSON,
    allowNull: true,
    field: 'muscles_worked',
  },
  recommendedSetsReps: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'recommended_sets_reps',
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    field: 'created_at',
  },
}, {
  tableName: 'exercises',
  timestamps: false,
});

// ─── Associations ───
Exercise.belongsTo(Trainer, { foreignKey: 'trainerId', as: 'trainer' });
Exercise.belongsTo(ExerciseCategory, { foreignKey: 'categoryId', as: 'category' });


Trainer.hasMany(Exercise, { foreignKey: 'trainerId', as: 'exercises' });
ExerciseCategory.hasMany(Exercise, { foreignKey: 'categoryId', as: 'exercises' });

module.exports = Exercise;
