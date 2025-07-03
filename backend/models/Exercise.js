const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const ExerciseCategory = require('./ExerciseCategory');

const Exercise = sequelize.define(
  'Exercise',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    /* UI fields you’re showing on the card / popup */
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,         // short blurb under the card
      allowNull: true,
    },
    steps: {
      type: DataTypes.JSON,         // long text for the popup (steps, tips…)
      allowNull: true,
    },
      musclesWorked: {
      type: DataTypes.JSON,         // long text for the popup (steps, tips…)
      allowNull: true,
    },
    recommendedSetsReps: {
      type: DataTypes.TEXT,         // long text for the popup (steps, tips…)
      allowNull: true,
    },
   



    imageUrl: {
      type: DataTypes.STRING,       // path you store in the DB or S3 URL
      allowNull: true,
      field: 'image_url',
    },

    /* FK → ExerciseCategory */
    categoryId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'category_id',
      references: {
        model: ExerciseCategory,
        key: 'id',
      },
    },
  },
  {
    tableName: 'exercises',
    underscored: true,
    timestamps: false,
  }
);

/* Associations */
Exercise.belongsTo(ExerciseCategory, {
  foreignKey: 'categoryId',
  as: 'category',
});
ExerciseCategory.hasMany(Exercise, {
  foreignKey: 'categoryId',
  as: 'exercises',
});

module.exports = Exercise;
