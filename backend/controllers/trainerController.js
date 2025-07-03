const Client = require('../models/Client');

const createClient = async (req, res) => {
  try {
    const { fullName, email, phone } = req.body;
    const image = req.file?.filename;

    const newClient = await Client.create({ fullName, email, phone, image });
    res.status(201).json(newClient);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getAllClients = async (req, res) => {
  try {
    const clients = await Client.findAll();
    res.status(200).json(clients);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getClientById = async (req, res) => {
  try {
    const client = await Client.findByPk(req.params.id);
    if (!client) return res.status(404).json({ error: 'Client not found' });
    res.status(200).json(client);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateClient = async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, email, phone } = req.body;
    const image = req.file?.filename;

    const client = await Client.findByPk(id);
    if (!client) return res.status(404).json({ error: 'Client not found' });

    await client.update({ fullName, email, phone, image });
    res.status(200).json(client);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteClient = async (req, res) => {
  try {
    const { id } = req.params;
    const client = await Client.findByPk(id);
    if (!client) return res.status(404).json({ error: 'Client not found' });

    await client.destroy();
    res.status(200).json({ message: 'Client deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  createClient,
  getAllClients,
  getClientById,
  updateClient,
  deleteClient,
};
