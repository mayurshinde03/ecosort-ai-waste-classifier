const express = require('express');
const router = express.Router();
const { classifyImage } = require('../controllers/classifyController');

// POST /api/classify - Classify uploaded image
router.post('/classify', classifyImage);

// GET /api/test - Test endpoint
router.get('/test', (req, res) => {
  res.json({ message: 'Classify route is working!' });
});

module.exports = router;
