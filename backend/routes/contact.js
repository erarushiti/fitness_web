const express = require("express");
const router = express.Router();
const {
  contactController
} = require("../controllers/contactController");
const { authenticateToken, isAdmin } = require('../middleware/auth'); 

// Public (or authenticated) contact form submission
router.post("/", contactController.createContact);

// Admin-only: Get all messages
router.get("/", authenticateToken, isAdmin, contactController.getAllContacts);

// Admin-only: Delete message
router.delete("/:id", authenticateToken, isAdmin, contactController.deleteContact);

module.exports = router;
