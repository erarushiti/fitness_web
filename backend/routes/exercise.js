const router = require('express').Router();
const exerciseCtrl = require('../controllers/exerciseController');
const upload = require('../middleware/upload');

// Exercise routes
router.post('/', upload.single('image'), exerciseCtrl.createExercise);
router.get('/', exerciseCtrl.getAllExercises);
router.get('/:id', exerciseCtrl.getExerciseById);
router.put('/:id', exerciseCtrl.updateExercise);
router.delete('/:id', exerciseCtrl.deleteExercise);

module.exports = router;
