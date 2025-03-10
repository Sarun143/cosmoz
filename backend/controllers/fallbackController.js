const fallbackController = {
    async handleMessage(req, res) {
      try {
        const { message } = req.body;
        
        if (!message) {
          return res.status(400).json({ 
            error: 'Message is required',
            response: "I couldn't process your message. Please try again." 
          });
        }
  
        // Simple keyword-based responses (temporary solution)
        let response = "I'm sorry, I don't understand that question. Can you ask about bus routes, schedules, or promotions?";
        
        const lowerMessage = message.toLowerCase();
        
        if (lowerMessage.includes('route') || lowerMessage.includes('from') || lowerMessage.includes('to')) {
          response = "We have several routes available. Please check the Routes page for a complete list of our destinations and schedules.";
        } 
        else if (lowerMessage.includes('schedule') || lowerMessage.includes('time') || lowerMessage.includes('when')) {
          response = "Our buses run according to the schedules shown on each route page. You can track the current location of any active bus using our live tracking feature.";
        }
        else if (lowerMessage.includes('bus') || lowerMessage.includes('seat')) {
          response = "We offer AC, Non-AC, Sleeper, and Seater buses. Each bus has different seating configurations including lower and upper deck options.";
        }
        else if (lowerMessage.includes('discount') || lowerMessage.includes('promo') || lowerMessage.includes('offer')) {
          response = "We have several ongoing promotions. Check the Promotions page for current discounts and special offers.";
        }
        else if (lowerMessage.includes('track') || lowerMessage.includes('location') || lowerMessage.includes('where')) {
          response = "You can track any bus in real-time using our Live Tracking feature. Simply select your route to see the current location of your bus.";
        }
        else if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
          response = "Hello! How can I help you with our bus services today?";
        }
        
        res.json({ response });
      } catch (error) {
        console.error('Fallback chatbot error:', error);
        res.status(500).json({ 
          response: "Sorry, I'm having trouble right now. Please try again later."
        });
      }
    }
  };
  
  module.exports = fallbackController;