const Quote = require('../models/Quote');

const quoteController = {
  // CREATE a new quote (admin only)
  async createQuote(req, res) {
    try {
      const { text, author } = req.body;

      if (!text || text.trim() === '') {
        return res.status(400).json({ error: 'Quote text is required' });
      }

      // If you want to handle image upload for quotes, add this:
      const image = req.file ? req.file.filename : null;

      const newQuote = await Quote.create({
        text: text.trim(),
        author: author && author.trim() !== '' ? author.trim() : 'Anonymous',
        userId: req.user.id,
        image,  // optional, add image field to schema if needed
      });

      res.status(201).json(newQuote);
    } catch (error) {
      console.error('Error creating quote:', error);
      res.status(500).json({ error: 'Failed to create quote', details: error.message });
    }
  },

  // READ all quotes
  async getAllQuotes(req, res) {
    try {
      const quotes = await Quote.find().sort({ createdAt: -1 });
    // Map _id to id for frontend convenience
    const transformed = quotes.map(msg => ({
        id: msg._id.toString(),
        text: msg.text,
        author: msg.author,
        image: msg.image,
        createdAt: msg.createdAt,
        updatedAt: msg.updatedAt,
    }));

    res.json(transformed);
    } catch (error) {
      console.error('Error fetching quotes:', error);
      res.status(500).json({ error: 'Failed to fetch quotes', details: error.message });
    }
  },

  // UPDATE a quote by ID (admin only)
  async updateQuote(req, res) {
    try {
      const { id } = req.params;
      const { text, author } = req.body;

      const quote = await Quote.findById(id);
      if (!quote) {
        return res.status(404).json({ error: 'Quote not found' });
      }

      if (text !== undefined && text.trim() === '') {
        return res.status(400).json({ error: 'Quote text cannot be empty' });
      }

      quote.text = text !== undefined ? text.trim() : quote.text;
      quote.author = author !== undefined ? author.trim() || 'Anonymous' : quote.author;

      // Handle image update if needed
      if (req.file) {
        quote.image = req.file.filename;
      }

      await quote.save();
      res.json(quote);
    } catch (error) {
      console.error('Error updating quote:', error);
      res.status(500).json({ error: 'Failed to update quote', details: error.message });
    }
  },

  // DELETE a quote by ID (admin only)
  async deleteQuote(req, res) {
    try {
      const { id } = req.params;
      const quote = await Quote.findById(id);

      if (!quote) {
        return res.status(404).json({ error: 'Quote not found' });
      }

      await quote.deleteOne();
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting quote:', error);
      res.status(500).json({ error: 'Failed to delete quote', details: error.message });
    }
  }
};

module.exports = quoteController;
