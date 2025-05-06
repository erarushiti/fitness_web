const Session = require('../models/Sessions');

const sessionController = {
  // CREATE a new session
  async createSession(req, res) {
    try {
      const { name, description, time, price, weekDays } = req.body;
  
      // Ensure that all required fields are provided
      // if (!name || !description || !startDate || !endDate || !time || !price || !weekDays) {
      //   return res.status(400).json({ error: 'All fields are required' });
      // }
  
      // Try to parse price to ensure it's a number
      const parsedPrice = parseFloat(price);
      if (isNaN(parsedPrice)) {
        return res.status(400).json({ error: 'Price must be a valid number' });
      }
  
      // Create new session
      const newSession = await Session.create({
        name,
        description,
        time,
        price,  // Store price as a number
        weekDays,  // assuming `weekDays` is an array
      });
  
      res.status(201).json(newSession);
    } catch (error) {
      console.error('Error creating session:', error);  // Log error details
      res.status(500).json({ error: 'Failed to create session', details: error.message });  // Include error details
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

      // Check if session exists
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
      const validWeekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
      const { name, description, weekDays, time, price } = req.body;
      const session = await Session.findByPk(req.params.id);
  
      if (!session) {
        return res.status(404).json({ error: 'Session not found' });
      }
  
      // Validate price
      const parsedPrice = parseFloat(price);
      if (isNaN(parsedPrice) || parsedPrice < 0) {
        return res.status(400).json({ error: 'Price must be a valid number and cannot be negative' });
      }
  
      // Validate weekDays
      if (weekDays && (!Array.isArray(weekDays) || !weekDays.every(day => validWeekDays.includes(day)))) {
        return res.status(400).json({ error: 'weekDays must be an array of valid days of the week' });
      }
  
      await session.update({
        name: name || session.name,
        description: description || session.description,
        weekDays: weekDays || session.weekDays,
        time: time || session.time,
        price: parsedPrice || session.price,
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

      // Check if session exists
      if (!session) {
        return res.status(404).json({ error: 'Session not found' });
      }

      // Delete the session
      await session.destroy();
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting session:', error);
      res.status(500).json({ error: 'Failed to delete session' });
    }
  },

  // Redirect to registration page
  registerSession(req, res) {
    // Properly redirect to registration page
    res.redirect(`http://localhost:3001/sessions/${req.params.id}/register`);
  },
};

module.exports = sessionController;
