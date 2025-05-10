const express = require('express');
const router = express.Router();
const { authenticateToken, isAdmin } = require('../middleware/auth'); 
const Supplements = require("../controllers/supplementsController");
const upload = require("../middleware/upload");

// Protected routes
router.post('/', authenticateToken, isAdmin, upload.single('image'), Supplements.createSupplement);
router.put('/:id', authenticateToken, isAdmin,  upload.single('image'),  Supplements.updateSupplement);
router.delete('/:id', authenticateToken, isAdmin, Supplements.deleteSupplement);

router.get('/', Supplements.getAllSupplements);

//this fix: TypeError('argument handler must be a function')
module.exports = router;