const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/sessionController');
const registrationController = require('../controllers/sessionRegistrationController');

router.post('/', sessionController.createSession);

// READ all sessions
router.get('/', sessionController.getAllSessions);

// READ a single session by UUID
router.get('/:id', sessionController.getSessionById);

// UPDATE a session by UUID
router.put('/:id', sessionController.updateSession);

// DELETE a session by UUID
router.delete('/:id', sessionController.deleteSession);

// Handle registration form submission
router.post('/:sessionId/register', registrationController.createSessionRegistration);

// Get all registrations for a session
router.get('/:sessionId/registrations', registrationController.getRegistrationsBySession);

// Get a single registration by UUID
router.get('/registrations/:id', registrationController.getSessionRegistrationById);

// Update a registration by UUID
router.put('/registrations/:id', registrationController.updateSessionRegistration);

// Delete a registration by UUID
router.delete('/registrations/:id', registrationController.deleteSessionRegistration);

module.exports = router;