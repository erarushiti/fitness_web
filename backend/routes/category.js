const router = require('express').Router();
const categoryCtrl = require('../controllers/exerciseCategoryController');
const upload = require('../middleware/upload'); // multer config

// Category routes
router.post('/', categoryCtrl.createCategory);
router.get('/', categoryCtrl.getAllCategories);
router.get('/categories/:id', categoryCtrl.getCategoryById);
router.put('/categories/:id', categoryCtrl.updateCategory);
router.delete('/categories/:id', categoryCtrl.deleteCategory);

module.exports = router;