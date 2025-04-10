const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/sessionController');

// CREATE a new session
router.post('/sessions', sessionController.createSession);

// READ all sessions
router.get('/sessions', sessionController.getAllSessions);

// READ a single session by UUID
router.get('/sessions/:id', sessionController.getSessionById);

// UPDATE a session by UUID
router.put('/sessions/:id', sessionController.updateSession);

// DELETE a session by UUID
router.delete('/sessions/:id', sessionController.deleteSession);

// Redirect to registration page
router.get('/sessions/:id/register', sessionController.registerSession);

module.exports = router;