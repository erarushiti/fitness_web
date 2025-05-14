const express = require('express');
const router = express.Router();
const { authenticateToken, isAdmin } = require('../middleware/auth');
const Trainer = require("../controllers/trainerController");

const upload = require('../middleware/upload'); // nëse do të ngarkosh foto profili

// Protected routes (vetëm admin mund të krijojë ose fshijë klientë)
router.post('/', authenticateToken, isAdmin, upload.single('image'), Trainer.createClient);
router.put('/:id', authenticateToken, isAdmin, upload.single('image'), Trainer.updateClient);
router.delete('/:id', authenticateToken, isAdmin, Trainer.deleteClient);

// Public or authenticated access (mund të kontrollosh këtë nëse do që të jetë vetëm për userin)
router.get('/', authenticateToken, Trainer.getAllClients);
router.get('/:id', authenticateToken, Trainer.getClientById);

module.exports = router;
