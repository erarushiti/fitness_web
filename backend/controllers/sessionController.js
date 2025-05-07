const Session = require('../models/Sessions');
const { verifyAccessToken } = require('../utils/jwt');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const payload = verifyAccessToken(token);
    req.user = payload; // Attach user info to request
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid or expired access token' });
  }
};

// Check if user is admin
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ error: 'Admin access required' });
  }
};


const sessionController = {
  // CREATE a new session (admin only)
  async createSession(req, res) {
    try {
      const { name, description, time, price, weekDays } = req.body;



      const parsedPrice = parseFloat(price);
      if (isNaN(parsedPrice)) {
        return res.status(400).json({ error: 'Price must be a valid number' });
      }
  
      // Create new session
      const newSession = await Session.create({
        name,
        description,
        time,

        price: parsedPrice,
        weekDays,

      });
  
      res.status(201).json(newSession);
    } catch (error) {

      console.error('Error creating session:', error);
      res.status(500).json({ error: 'Failed to create session', details: error.message });

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

  // UPDATE a session by UUID (admin only)
  async updateSession(req, res) {
    try {
      const validWeekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
      const { name, description, weekDays, time, price } = req.body;
      const session = await Session.findByPk(req.params.id);
  
      if (!session) {
        return res.status(404).json({ error: 'Session not found' });
      }

      const parsedPrice = parseFloat(price);
      if (isNaN(parsedPrice) || parsedPrice < 0) {
        return res.status(400).json({ error: 'Price must be a valid number and cannot be negative' });
      }


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
  

  // DELETE a session by UUID (admin only)
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

    res.redirect(`http://localhost:3000/sessions/${req.params.id}/register`);

  },
};

module.exports = sessionController;
