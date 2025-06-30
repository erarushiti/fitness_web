// routes/feedback.js
const express = require("express");
const { feedbackController } = require("../controllers/feedbackController");
const { authenticateToken, isAdmin } = require('../middleware/auth'); 

const router = express.Router();

router.post("/", feedbackController.createFeedback);
router.get("/", feedbackController.getAllFeedbacks);
router.delete("/:id", authenticateToken, isAdmin, feedbackController.deleteFeedback);

module.exports = router;
