// controllers/feedbackController.js
const Feedback = require("../models/Feedback");
const { verifyAccessToken } = require("../utils/jwt");

const feedbackController = {
  async createFeedback(req, res) {
    try {
      const { name, rating, comment } = req.body;

      if (!name || !rating || !comment) {
        return res.status(400).json({ error: "All fields are required" });
      }

      const newFeedback = await Feedback.create({ name, rating, comment });
      res.status(201).json(newFeedback);
    } catch (error) {
      console.error("Error creating feedback:", error);
      res.status(500).json({ error: "Failed to submit feedback" });
    }
  },

  async getAllFeedbacks(req, res) {
    try {
      const feedbacks = await Feedback.find().sort({ createdAt: -1 });
      
      // Map _id to id for frontend convenience
      const transformed = feedbacks.map(fdb => ({
        id: fdb._id.toString(),
        name: fdb.name,
        rating: fdb.rating,
        comment: fdb.comment,
        createdAt: fdb.createdAt,
        updatedAt: fdb.updatedAt,
      }));
  
      res.json(transformed);
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
      res.status(500).json({ error: "Failed to fetch feedbacks" });
    }
  },  
  
  async deleteFeedback(req, res) {
      try {
        const feedback = await Feedback.findById(req.params.id);
  
        if (!feedback) {
          return res.status(404).json({ error: "Feedback not found" });
        }
  
        await feedback.deleteOne();
        res.status(204).send();
      } catch (error) {
        console.error("Error deleting feedback:", error);
        res.status(500).json({ error: "Failed to delete feedback" });
      }
    },
};

module.exports = { feedbackController };
