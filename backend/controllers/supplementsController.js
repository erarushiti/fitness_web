const Supplement = require("../models/Supplement");
const { verifyAccessToken } = require("../utils/jwt");
const path = require('path');
const { validate: isUUID } = require('uuid');
const { Op } = require('sequelize');



const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ error: "Access token required" });
  }

  try {
    const payload = verifyAccessToken(token);
    req.user = payload; // Attach user info to request
    next();
  } catch (error) {
    return res.status(403).json({ error: "Invalid or expired access token" });
  }
};

// Check if user is admin
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({ error: "Admin access required" });
  }
};

const supplementController = {

 
async advancedSearch(req, res) {
  try {
    const {
      name,
      goal,
      activity,
      gender,
      age,
      minPrice,
      maxPrice,
      userId,
    } = req.query;

    const whereClause = {};

    if (name) {
     whereClause.name = { [Op.like]: `%${name}%` }; // ✅ Compatible with MySQL
// case-insensitive match
    }

    if (goal) whereClause.goal = goal;
    if (activity) whereClause.activity = activity;
    if (gender) whereClause.gender = gender;
    if (age) whereClause.age = age;
    if (userId) whereClause.userId = userId;

    if (minPrice || maxPrice) {
      whereClause.price = {};
      if (minPrice && !isNaN(parseFloat(minPrice))) {
        whereClause.price[Op.gte] = parseFloat(minPrice);
      }
      if (maxPrice && !isNaN(parseFloat(maxPrice))) {
        whereClause.price[Op.lte] = parseFloat(maxPrice);
      }
    }

    const supplements = await Supplement.findAll({
      where: whereClause,
      order: [['createdAt', 'DESC']],
      limit: 100,
    });

    res.status(200).json(supplements);
  } catch (error) {
    console.error('Advanced search error:', error);
    res.status(500).json({ message: 'Server error', error });
  }
},
  // CREATE a new session (admin only)
  async createSupplement(req, res) {
    try {
      const { name, description, price, age, gender, activity, goal } = req.body;
      const image = req.file ? req.file.filename : null;

      // Validate required fields
      if (!name || !description || !price || !age || !gender || !activity || !goal) {
        return res.status(400).json({ error: "All fields are required" });
      }

      // Validate ENUM values
      const validGoals = ['lose weight', 'gain weight'];
      const validActivities = ['high', 'low', 'moderate'];
      const validGenders = ['male', 'female', 'other'];
      const validAges = ['18-29', '30-39', '40-54', '55+'];

      if (!validGoals.includes(goal)) {
        return res.status(400).json({ error: `Invalid goal value. Must be one of: ${validGoals.join(', ')}` });
      }
      if (!validActivities.includes(activity)) {
        return res.status(400).json({ error: `Invalid activity value. Must be one of: ${validActivities.join(', ')}` });
      }
      if (!validGenders.includes(gender)) {
        return res.status(400).json({ error: `Invalid gender value. Must be one of: ${validGenders.join(', ')}` });
      }
      if (!validAges.includes(age)) {
        return res.status(400).json({ error: `Invalid age value. Must be one of: ${validAges.join(', ')}` });
      }

      // Validate price
      const parsedPrice = parseFloat(price);
      if (isNaN(parsedPrice) || parsedPrice <= 0) {
        return res.status(400).json({ error: "Price must be a valid positive number" });
      }

      // Create new supplement
      const newSupplement = await Supplement.create({
        name,
        description,
        age,
        gender,
        activity,
        goal,
        image,
        userId: req.user.id,
        price: parsedPrice,
      });

      res.status(201).json(newSupplement);
    } catch (error) {
      console.error("Error creating supplement:", error);
      res.status(500).json({ error: "Failed to create supplement", details: error.message });
    }
  },

  // READ all sessions
  async getAllSupplements(req, res) {
    try {
      const supplements = await Supplement.findAll();
      res.json(supplements);
    } catch (error) {
      console.error("Error fetching supplements:", error);
      res.status(500).json({ error: "Failed to fetch supplements" });
    }
  },

  // READ a single registration
async  getSupplementById(req, res) {
  try {
    const { id } = req.params;
      console.log("id", id)
    // Validate UUID
    if (!id) {
      return res.status(400).json({ error: 'Invalid or missing UUID' });
    }

    // Fetch single supplement by primary key
    const supplement = await Supplement.findByPk(id);

    if (!supplement) {
      return res.status(404).json({ error: 'Supplement not found' });
    }

    res.status(200).json(supplement);
  } catch (error) {
    console.error('Error fetching supplement:', error);
    res.status(500).json({ error: 'Failed to fetch supplement', details: error.message });
  }
},
  // UPDATE a session by UUID (admin only)
  async updateSupplement(req, res) {
  try {
    const { name, description, price, age, gender, activity, goal } = req.body;
    const supplement = await Supplement.findByPk(req.params.id);

    if (!supplement) {
      return res.status(404).json({ error: "Supplement not found" });
    }

    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      return res.status(400).json({
        error: "Price must be a valid number and cannot be negative",
      });
    }

    const updatedData = {
      name: name || supplement.name,
      description: description || supplement.description,
      age: age || supplement.age,
      goal: goal || supplement.goal,
      gender: gender || supplement.gender,
      activity: activity || supplement.activity,
      price: parsedPrice || supplement.price,
      userId: req.user.id,
    };

    // Check if image file was uploaded
    if (req.file) {
      updatedData.image = req.file.filename;
    }

    await supplement.update(updatedData);

    res.json(supplement);
  } catch (error) {
    console.error("Error updating supplement:", error);
    res.status(500).json({ error: "Failed to update supplement" });
  }
},


  // DELETE a session by UUID (admin only)
 // DELETE a supplement by UUID (admin only)
async deleteSupplement(req, res) {
  try {
    const { id } = req.params;

    // ✅ Validate UUID first
    if (!id) {
      return res.status(400).json({ error: "Invalid or missing UUID" });
    }

    const supplement = await Supplement.findByPk(id);

    if (!supplement) {
      return res.status(404).json({ error: "Supplement not found" });
    }

    await supplement.destroy();
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting supplement:", error);
    res.status(500).json({ error: "Failed to delete supplement" });
  }
},

};

module.exports = supplementController;
