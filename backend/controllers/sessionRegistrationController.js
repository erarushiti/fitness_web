const SessionRegistration = require('../models/SessionRegistration');
const Session = require('../models/Sessions');

// CREATE a new registration
const createSessionRegistration = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { fullName, email, phone } = req.body;

    if (!fullName || !email) {
      return res.status(400).json({ error: 'Full name and email are required' });
    }

    const session = await Session.findByPk(sessionId);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    const now = new Date();
    if (new Date(session.endDate) < now) {
      return res.status(400).json({ error: 'This session has ended' });
    }

    const existingRegistration = await SessionRegistration.findOne({
      where: { sessionId, email },
    });
    if (existingRegistration) {
      return res.status(400).json({ error: 'This email is already registered for the session' });
    }

    const registration = await SessionRegistration.create({
      sessionId,
      fullName,
      email,
      phone,
      status: 'pending', // Added required status field
    });

    res.status(201).json({
      message: 'Registration successful',
      registration,
    });
  } catch (error) {
    console.error('Error creating registration:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// READ all registrations for a session
const getRegistrationsBySession = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const session = await Session.findByPk(sessionId);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    const registrations = await SessionRegistration.findAll({
      where: { sessionId },
      include: [{ model: Session, as: 'sessions', attributes: ['name', 'startDate'] }],
    });

    res.status(200).json(registrations);
  } catch (error) {
    console.error('Error fetching registrations:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// READ a single registration
const getSessionRegistrationById = async (req, res) => {
  try {
    const { id } = req.params;

    const registration = await SessionRegistration.findByPk(id, {
      include: [{ model: Session, as: 'sessions', attributes: ['name', 'startDate'] }],
    });

    if (!registration) {
      return res.status(404).json({ error: 'Registration not found' });
    }

    res.status(200).json(registration);
  } catch (error) {
    console.error('Error fetching registration:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// UPDATE a registration
const updateSessionRegistration = async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, email, phone, status } = req.body;

    const registration = await SessionRegistration.findByPk(id);
    if (!registration) {
      return res.status(404).json({ error: 'Registration not found' });
    }

    // Validate status if provided
    if (status && !['pending', 'confirmed', 'cancelled'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }

    await registration.update({
      fullName: fullName || registration.fullName,
      email: email || registration.email,
      phone: phone !== undefined ? phone : registration.phone,
      status: status || registration.status, // Allow status update
    });

    res.status(200).json({
      message: 'Registration updated successfully',
      registration,
    });
  } catch (error) {
    console.error('Error updating registration:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// DELETE a registration
const deleteSessionRegistration = async (req, res) => {
  try {
    const { id } = req.params;

    const registration = await SessionRegistration.findByPk(id);
    if (!registration) {
      return res.status(404).json({ error: 'Registration not found' });
    }

    await registration.destroy();

    res.status(200).json({ message: 'Registration deleted successfully' });
  } catch (error) {
    console.error('Error deleting registration:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Export the sessionRegistrationController object with all methods
const sessionRegistrationController = {
  createSessionRegistration,
  getRegistrationsBySession,
  getSessionRegistrationById,
  updateSessionRegistration,
  deleteSessionRegistration,
};

module.exports = sessionRegistrationController;
