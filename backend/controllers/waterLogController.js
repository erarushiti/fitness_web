const WaterLog = require('../models/WaterLog');
const User = require('../models/User');

const waterLogController = {
  // CREATE a new water log entry
  async createWaterLog(req, res) {
    try {
      const { clientId, amount } = req.body;

      // Validate required fields
      if (!clientId || amount == null) {
        return res.status(400).json({ error: 'Client ID and amount are required' });
      }

      // Validate amount
      if (isNaN(amount) || Number(amount) <= 0) {
        return res.status(400).json({ error: 'Amount must be a positive number' });
      }

      // Check if user exists and is a client
      const user = await User.findByPk(clientId);
      if (!user || user.role !== 'client') {
        return res.status(404).json({ error: 'Client not found or invalid role' });
      }

      // Create water log entry
      const newWaterLog = await WaterLog.create({
        clientId,
        amount,
      });

      res.status(201).json(newWaterLog);
    } catch (error) {
      console.error('Error creating water log:', error);
      res.status(500).json({ error: 'Failed to create water log', details: error.message });
    }
  },

  // READ all water logs for a client
  async getWaterLogsByClient(req, res) {
    try {
      const { clientId } = req.params;

      // Check if client exists
      const client = await User.findByPk(clientId);
      if (!client || client.role !== 'client') {
        return res.status(404).json({ error: 'Client not found or invalid role' });
      }

      // Get water logs
      const waterLogs = await WaterLog.findAll({ where: { clientId } });

      if (!waterLogs.length) {
        return res.status(404).json({ error: 'No water logs found for this client' });
      }

      res.json(waterLogs);
    } catch (error) {
      console.error('Error fetching water logs:', error);
      res.status(500).json({ error: 'Failed to fetch water logs', details: error.message });
    }
  },
};

module.exports = waterLogController;
