const mongoose = require('mongoose');

const quoteSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    trim: true
  },
  author: {
    type: String,
    default: "Anonymous",
    trim: true
  },
  image: {
    type: String, // This will store the image filename or full URL depending on how you handle it
    default: null
  }
}, { timestamps: true });

module.exports = mongoose.model('Quote', quoteSchema);
