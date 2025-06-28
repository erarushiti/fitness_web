const Exercise = require('../models/Exercise');
const fs = require('fs');
const path = require('path');

const createExercise = async (req, res) => {
  try {
    const { 
      name, 
      description, 
      steps, 
      musclesWorked,
      recommendedSetsReps, 
      categoryId 
    } = req.body;

    const imageFile = req.file;

    // Validimi i të dhënave
    if (!name || !categoryId) {
      // Fshi imazhin e ngarkuar nëse validimi dështon
      if (imageFile) fs.unlinkSync(imageFile.path);
      return res.status(400).json({ error: 'Name and categoryId are required' });
    }

    // Krijo objektin e ri të ushtrimit
    const newExercise = await Exercise.create({
      name,
      description,
      steps: steps ? JSON.parse(steps) : [],
      musclesWorked: musclesWorked ? JSON.parse(musclesWorked) : [],
      recommendedSetsReps,
      categoryId,
      imageUrl: imageFile ? imageFile.path : null
    });

    return res.status(201).json(newExercise);

  } catch (err) {
    console.error(err);
    
    // Fshi imazhin nëse ndodh gabim
    if (req.file) fs.unlinkSync(req.file.path);
    
    return res.status(500).json({ 
      error: err.message || 'Internal server error' 
    });
  }
};

// Merr të gjitha ushtrimet me kategori
const getAllExercises = async (req, res) => {
  try {
    const exercises = await Exercise.findAll({
      include: ['category'],
    });
    
    // Konverto shtegun e imazhit në URL të plotë
    const exercisesWithImageUrl = exercises.map(exercise => {
      if (exercise.imageUrl) {
        return {
          ...exercise.toJSON(),
          imageUrl: `${req.protocol}://${req.get('host')}/${exercise.imageUrl}`
        };
      }
      return exercise;
    });

    res.status(200).json(exercisesWithImageUrl);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Merr ushtrim sipas ID
const getExerciseById = async (req, res) => {
  try {
    const exercise = await Exercise.findByPk(req.params.id, {
      include: ['category'],
    });

    if (!exercise) {
      return res.status(404).json({ error: 'Exercise not found' });
    }

    // Shto URL të plotë për imazhin nëse ekziston
    if (exercise.imageUrl) {
      exercise.imageUrl = `${req.protocol}://${req.get('host')}/${exercise.imageUrl}`;
    }

    res.status(200).json(exercise);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Përditëso ushtrim
const  updateExercise = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const imageFile = req.file;

    const exercise = await Exercise.findByPk(id);
    if (!exercise) {
      return res.status(404).json({ error: 'Exercise not found' });
    }

    // Nëse ka imazh të ri, fshi të vjetrën
    if (imageFile) {
      if (exercise.imageUrl) {
        fs.unlinkSync(exercise.imageUrl);
      }
      updates.imageUrl = imageFile.path;
    }

    await exercise.update(updates);
    res.status(200).json(exercise);

  } catch (err) {
    console.error(err);
    // Fshi imazhin e ri nëse ndodh gabim
    if (req.file) fs.unlinkSync(req.file.path);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Fshi ushtrim
const deleteExercise = async (req, res) => {
  try {
    const { id } = req.params;

    const exercise = await Exercise.findByPk(id);
    if (!exercise) {
      return res.status(404).json({ error: 'Exercise not found' });
    }

    // Fshi imazhin nëse ekziston
    if (exercise.imageUrl) {
      fs.unlinkSync(exercise.imageUrl);
    }

    await exercise.destroy();
    res.status(200).json({ message: 'Exercise deleted successfully' });

  } catch (err) {
    console.error(err);
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