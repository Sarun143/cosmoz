const express = require('express');
const router = express.Router();
const chatbotController = require('../controllers/ChatbotController');
// const { authMiddleware } = require('../middleware/auth'); // If you have auth middleware

// Handle chatbot messages
router.post('/', chatbotController.handleMessage);

// Save feedback from chatbot
router.post('/feedback', chatbotController.saveFeedback);

module.exports = router;