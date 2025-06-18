const ExerciseCategory = require('../models/ExerciseCategory');

// Create new category
const createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    const newCategory = await ExerciseCategory.create({ name });
    res.status(201).json(newCategory);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all categories
const getAllCategories = async (req, res) => {
  try {
    const categories = await ExerciseCategory.findAll();
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get category by ID
const getCategoryById = async (req, res) => {
  try {
    const category = await ExerciseCategory.findByPk(req.params.id);
    if (!category) return res.status(404).json({ error: 'Category not found' });

    res.status(200).json(category);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update category
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const category = await ExerciseCategory.findByPk(id);
    if (!category) return res.status(404).json({ error: 'Category not found' });

    await category.update({ name });
    res.status(200).json(category);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete category
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await ExerciseCategory.findByPk(id);
    if (!category) return res.status(404).json({ error: 'Category not found' });

    await category.destroy();
    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
