const express = require('express');
const router = express.Router();
const CodeSnippet = require('../models/CodeSnippet');

// Save a new code
router.post('/', async (req, res) => {
  try {
    const { title, language, code } = req.body;

    if (!title || !language || !code) {
      return res.status(400).json({ error: 'Title, language and code are required' });
    }

    const newSnippet = new CodeSnippet({
      user: '000000000000000000000001', // temporary (no login yet)
      title,
      language,
      code,
    });

    const saved = await newSnippet.save();
    res.json(saved);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save code' });
  }
});

// Get all saved codes
router.get('/', async (req, res) => {
  try {
    const snippets = await CodeSnippet.find().sort({ createdAt: -1 });
    res.json(snippets);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch codes' });
  }
});

// Delete a code
router.delete('/:id', async (req, res) => {
  try {
    await CodeSnippet.findByIdAndDelete(req.params.id);
    res.json({ message: 'Code deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete' });
  }
});

module.exports = router;