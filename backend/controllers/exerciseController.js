const Exercise = require('../models/Exercise');
const Trainer = require('../models/Trainer');
const ExerciseCategory = require('../models/ExerciseCategory');

// Create a new exercise
const createExercise = async (req, res) => {
  try {
    const {
      name,
      description,
      trainerId,
      categoryId
    } = req.body;

    const image = req.file?.filename; // uploaded image

    const newExercise = await Exercise.create({
      name,
      description,
      trainerId,
      categoryId,
      image
    });

    res.status(201).json(newExercise);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all exercises
const getAllExercises = async (req, res) => {
  try {
    const exercises = await Exercise.findAll({
      include: [
        { model: Trainer, as: 'trainer' },
        { model: ExerciseCategory, as: 'category' }
      ]
    });
    res.status(200).json(exercises);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get a single exercise by ID
const getExerciseById = async (req, res) => {
  try {
    const exercise = await Exercise.findByPk(req.params.id, {
      include: [
        { model: Trainer, as: 'trainer' },
        { model: ExerciseCategory, as: 'category' }
      ]
    });
    if (!exercise) return res.status(404).json({ error: 'Exercise not found' });
    res.status(200).json(exercise);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update an exercise
const updateExercise = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      trainerId,
      categoryId
    } = req.body;
    const image = req.file?.filename;

    const exercise = await Exercise.findByPk(id);
    if (!exercise) return res.status(404).json({ error: 'Exercise not found' });

    await exercise.update({
      name,
      description,
      trainerId,
      categoryId,
      image
    });

    res.status(200).json(exercise);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete an exercise
const deleteExercise = async (req, res) => {
  try {
    const { id } = req.params;
    const exercise = await Exercise.findByPk(id);
    if (!exercise) return res.status(404).json({ error: 'Exercise not found' });

    await exercise.destroy();
    res.status(200).json({ message: 'Exercise deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  createExercise,
  getAllExercises,
  getExerciseById,
  updateExercise,
  deleteExercise,
};
