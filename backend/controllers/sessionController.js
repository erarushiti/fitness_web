const Session = require('../models/Sessions');

const sessionController = {
  // CREATE a new session
  async createSession(req, res) {
    try {
      const { name, description, startDate, endDate, time, price } = req.body;

      if (!name || !description || !startDate || !endDate || !time || !price) {
        return res.status(400).json({ error: 'All fields are required' });
      }

      const newSession = await Session.create({
        name,
        description,
        startDate,
        endDate,
        time,
        price,
      });

      res.status(201).json(newSession);
    } catch (error) {
      console.error('Error creating session:', error);
      res.status(500).json({ error: 'Failed to create session' });
    }
  },

  // READ all sessions
  async getAllSessions(req, res) {
    try {
      const sessions = await Session.findAll();
      res.json(sessions);
    } catch (error) {
      console.error('Error fetching sessions:', error);
      res.status(500).json({ error: 'Failed to fetch sessions' });
    }
  },

  // READ a single session by UUID
  async getSessionById(req, res) {
    try {
      const session = await Session.findByPk(req.params.id);
      if (!session) {
        return res.status(404).json({ error: 'Session not found' });
      }
      res.json(session);
    } catch (error) {
      console.error('Error fetching session:', error);
      res.status(500).json({ error: 'Failed to fetch session' });
    }
  },

  // UPDATE a session by UUID
  async updateSession(req, res) {
    try {
      const { name, description, startDate, endDate, time, price } = req.body;
      const session = await Session.findByPk(req.params.id);

      if (!session) {
        return res.status(404).json({ error: 'Session not found' });
      }

      await session.update({
        name: name || session.name,
        description: description || session.description,
        startDate: startDate || session.startDate,
        endDate: endDate || session.endDate,
        time: time || session.time,
        price: price || session.price,
      });

      res.json(session);
    } catch (error) {
      console.error('Error updating session:', error);
      res.status(500).json({ error: 'Failed to update session' });
    }
  },

  // DELETE a session by UUID
  async deleteSession(req, res) {
    try {
      const session = await Session.findByPk(req.params.id);

      if (!session) {
        return res.status(404).json({ error: 'Session not found' });
      }

      await session.destroy();
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting session:', error);
      res.status(500).json({ error: 'Failed to delete session' });
    }
  },

  // Redirect to registration page
  registerSession(req, res) {
    res.redirect(`http://localhost:3001/sessions/${req.params.id}/register`);
  },
};

module.exports = sessionController;