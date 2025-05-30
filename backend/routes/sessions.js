// routes/sessions.js
const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/sessionController');
const registrationController = require('../controllers/sessionRegistrationController');
const { authenticateToken, isAdmin } = require('../middleware/auth'); 
const { verifyRefreshToken, signAccessToken } = require('../utils/jwt');
// Protected routes
router.post('/', authenticateToken, isAdmin, sessionController.createSession);
router.put('/:id', authenticateToken, isAdmin, sessionController.updateSession);
router.delete('/:id', authenticateToken, isAdmin, sessionController.deleteSession);

// Public routes
router.get('/', sessionController.getAllSessions);
router.get('/:id', sessionController.getSessionById);
router.post('/:sessionId/register', registrationController.createSessionRegistration);
router.get('/:sessionId/registrations', registrationController.getRegistrationsBySession);
router.get('/registrations/:id', registrationController.getSessionRegistrationById);
router.put('/registrations/:id', registrationController.updateSessionRegistration);
router.delete('/registrations/:id', registrationController.deleteSessionRegistration);

router.post('/refresh-token', (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(401).json({ error: 'Refresh token required' });

  try {
    const userData = verifyRefreshToken(refreshToken);
    const newAccessToken = signAccessToken({ id: userData.id, role: userData.role });
    res.json({ accessToken: newAccessToken });
  } catch (err) {
    res.status(403).json({ error: 'Invalid or expired refresh token' });
  }
});

module.exports = router;
