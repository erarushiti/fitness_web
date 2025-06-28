const Contact = require("../models/contact");
const { verifyAccessToken } = require("../utils/jwt");

const contactController = {
  // CREATE new contact message
  async createContact(req, res) {
    try {
      const { name, email, subject, message } = req.body;

      if (!name || !email || !subject || !message) {
        return res.status(400).json({ error: "All fields are required" });
      }

      const newMessage = await Contact.create({
        name,
        email,
        subject,
        message,
        userId: req.user?.id || null, // Optional if logged in
      });

      res.status(201).json(newMessage);
    } catch (error) {
      console.error("Error creating contact:", error);
      res.status(500).json({
        error: "Failed to submit message",
        details: error.message,
      });
    }
  },

  // GET all contact messages (admin only)
  async getAllContacts(req, res) {
    try {
      const messages = await Contact.find().sort({ createdAt: -1 });
  
      // Map _id to id for frontend convenience
      const transformed = messages.map(msg => ({
        id: msg._id.toString(),
        name: msg.name,
        email: msg.email,
        subject: msg.subject,
        message: msg.message,
        createdAt: msg.createdAt,
        updatedAt: msg.updatedAt,
      }));
  
      res.json(transformed);
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ error: "Failed to fetch messages" });
    }
  },

  // DELETE a contact message (admin only)
  async deleteContact(req, res) {
    try {
      const message = await Contact.findById(req.params.id);

      if (!message) {
        return res.status(404).json({ error: "Message not found" });
      }

      await message.deleteOne();
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting message:", error);
      res.status(500).json({ error: "Failed to delete message" });
    }
  },
};

module.exports = {
  contactController
};
