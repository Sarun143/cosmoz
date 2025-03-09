// feedback-analysis.js
const natural = require('natural');
const { WordTokenizer, SentimentAnalyzer, PorterStemmer } = natural;
const tokenizer = new WordTokenizer();
const analyzer = new SentimentAnalyzer('English', PorterStemmer, 'afinn');

// Import required modules
const express = require('express');
const router = express.Router();
const Feedback = require("../model/Feedback");

// Function to perform sentiment analysis
const analyzeSentiment = (text) => {
  const tokens = tokenizer.tokenize(text.toLowerCase());
  const sentiment = analyzer.getSentiment(tokens);
  
  // Classify sentiment based on score
  if (sentiment > 0.2) return 'positive';
  if (sentiment < -0.2) return 'negative';
  return 'neutral';
};

// Function to extract key topics from feedback
const extractTopics = (text) => {
  // Common topics in bus service feedback
  const topicKeywords = {
    'schedule': ['schedule', 'time', 'late', 'delay', 'early', 'punctual', 'wait', 'waited'],
    'cleanliness': ['clean', 'dirty', 'neat', 'hygiene', 'sanitized', 'messy', 'trash', 'garbage'],
    'comfort': ['comfortable', 'seat', 'spacious', 'cramped', 'legroom', 'air conditioning', 'hot', 'cold'],
    'staff': ['driver', 'conductor', 'staff', 'rude', 'helpful', 'friendly', 'polite', 'professional'],
    'safety': ['safe', 'unsafe', 'dangerous', 'secure', 'speed', 'fast', 'slow', 'careful', 'reckless'],
    'app': ['app', 'website', 'booking', 'user interface', 'crash', 'error', 'bug', 'login', 'account'],
    'price': ['price', 'expensive', 'cheap', 'affordable', 'cost', 'fare', 'value', 'money', 'discount'],
    'tracking': ['track', 'location', 'gps', 'accurate', 'inaccurate', 'real-time', 'update']
  };

  const textLower = text.toLowerCase();
  const identifiedTopics = [];

  // Check for each topic's keywords
  Object.entries(topicKeywords).forEach(([topic, keywords]) => {
    if (keywords.some(keyword => textLower.includes(keyword))) {
      identifiedTopics.push(topic);
    }
  });

  return identifiedTopics.length ? identifiedTopics : ['general'];
};

// Enhance Feedback schema to include analysis fields
const enhanceFeedbackSchema = () => {
  const FeedbackSchema = Feedback.schema;
  
  // Only add fields if they don't already exist
  if (!FeedbackSchema.paths.sentiment) {
    FeedbackSchema.add({
      sentiment: { type: String, enum: ['positive', 'negative', 'neutral'] },
      topics: [{ type: String }],
      sentimentScore: { type: Number },
      processed: { type: Boolean, default: false }
    });
    
    // Recreate the model with updated schema
    const updatedFeedback = mongoose.model('Feedback', FeedbackSchema);
    return updatedFeedback;
  }
  
  return Feedback;
};

// POST: Submit Feedback with NLP analysis
router.post("/submit", async (req, res) => {
  try {
    const { name, mobile, email, feedback } = req.body;
    if (!name || !mobile || !email || !feedback) {
      return res.status(400).json({ message: "All fields are required" });
    }
    
    // Perform NLP analysis
    const sentiment = analyzeSentiment(feedback);
    const sentimentScore = analyzer.getSentiment(tokenizer.tokenize(feedback.toLowerCase()));
    const topics = extractTopics(feedback);
    
    // Create new feedback with analysis
    const newFeedback = new Feedback({
      name, 
      mobile, 
      email, 
      feedback,
      sentiment,
      sentimentScore,
      topics,
      processed: true
    });
    
    await newFeedback.save();
    res.status(201).json({ 
      message: "Feedback submitted successfully",
      analysis: { sentiment, topics }
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// GET: Fetch all feedback with analysis (For Admin Panel)
router.get("/all", async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.status(200).json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// GET: Fetch feedback analytics
router.get("/analytics", async (req, res) => {
  try {
    // Get all feedback
    const allFeedback = await Feedback.find();
    
    // Process any unprocessed feedback
    const unprocessedFeedback = allFeedback.filter(f => !f.processed);
    for (const feedback of unprocessedFeedback) {
      feedback.sentiment = analyzeSentiment(feedback.feedback);
      feedback.sentimentScore = analyzer.getSentiment(tokenizer.tokenize(feedback.feedback.toLowerCase()));
      feedback.topics = extractTopics(feedback.feedback);
      feedback.processed = true;
      await feedback.save();
    }
    
    // Calculate sentiment distribution
    const sentimentCounts = {
      positive: allFeedback.filter(f => f.sentiment === 'positive').length,
      neutral: allFeedback.filter(f => f.sentiment === 'neutral').length,
      negative: allFeedback.filter(f => f.sentiment === 'negative').length
    };
    
    // Calculate topic distribution
    const topicDistribution = {};
    allFeedback.forEach(feedback => {
      feedback.topics.forEach(topic => {
        if (topicDistribution[topic]) {
          topicDistribution[topic]++;
        } else {
          topicDistribution[topic] = 1;
        }
      });
    });
    
    // Calculate sentiment trend (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const recentFeedback = allFeedback.filter(f => 
      new Date(f.createdAt) >= sixMonthsAgo
    );
    
    // Group by month
    const sentimentTrend = {};
    recentFeedback.forEach(feedback => {
      const month = new Date(feedback.createdAt).toLocaleString('default', { month: 'short' });
      if (!sentimentTrend[month]) {
        sentimentTrend[month] = { positive: 0, neutral: 0, negative: 0, total: 0 };
      }
      sentimentTrend[month][feedback.sentiment]++;
      sentimentTrend[month].total++;
    });
    
    res.status(200).json({
      totalFeedback: allFeedback.length,
      sentimentDistribution: sentimentCounts,
      topicDistribution,
      sentimentTrend
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;