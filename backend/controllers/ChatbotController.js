const { GoogleGenerativeAI } = require('@google/generative-ai');
const Route = require('../model/Route');
const Bus = require('../model/Bus');
const Promotion = require('../model/Promotion');
const Feedback = require('../model/Feedback');

// Initialize Gemini API with your API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const chatbotController = {
  /**
   * Handle user messages and generate responses
   */
  async handleMessage(req, res) {
    try {
      // Check if Gemini API key is configured
      if (!process.env.GEMINI_API_KEY) {
        console.error('GEMINI_API_KEY is not configured in environment variables');
        return res.status(500).json({ 
          error: 'API key configuration error',
          response: "I'm sorry, but my AI service isn't properly configured. Please contact the administrator." 
        });
      }

      const { message } = req.body;
      
      if (!message) {
        return res.status(400).json({ 
          error: 'Message is required',
          response: "I couldn't process your message. Please try again." 
        });
      }

      console.log('Processing chatbot message:', message);

      // Get relevant data from the database
      try {
        const [routes, buses, promotions] = await Promise.all([
          Route.find({ status: 'Active' }).lean(),
          Bus.find({ status: 'Active' }).lean(),
          Promotion.find({ isActive: true }).lean()
        ]);

        console.log(`Retrieved data: ${routes.length} routes, ${buses.length} buses, ${promotions.length} promotions`);

        // Create a context object with data the AI might need
        const context = {
          routes: routes.map(route => ({
            id: route.routeId,
            name: route.name,
            from: route.departureStop,
            to: route.arrivalStop,
            departure: route.departure,
            arrival: route.arrival,
            frequency: route.frequency,
            days: route.selectedDays,
            stops: route.stops.map(stop => stop.stop).join(', ')
          })),
          buses: buses.map(bus => ({
            type: bus.type,
            totalSeats: bus.seats.totalSeats,
            lowerDeckSeats: bus.seats.Lower,
            upperDeckSeats: bus.seats.Upper
          })),
          promotions: promotions.map(promo => ({
            name: promo.name,
            details: promo.details,
            valid: `${new Date(promo.startDate).toLocaleDateString()} to ${new Date(promo.endDate).toLocaleDateString()}`,
            discountRule: promo.discountRule
          }))
        };

        // Create the AI prompt with context and user message
        const prompt = `
        You are a helpful assistant for a bus tracking and booking service. 
        
        Current context:
        Routes: ${JSON.stringify(context.routes)}
        Buses: ${JSON.stringify(context.buses)}
        Promotions: ${JSON.stringify(context.promotions)}

        Common questions you can answer:
        - Information about routes, including departure/arrival locations and times
        - Bus types and available seats
        - Current promotions and discounts
        - How to track a bus or check schedule

        For questions you can't answer with the given context, suggest that the user contact customer support or check specific pages in the app.

        User question: ${message}
        
        Provide a helpful, friendly, and concise response. Use bullet points for lists if needed.
        `;

        // Generate response using Gemini
        try {
          console.log('Sending request to Gemini API...');
          const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
          const result = await model.generateContent(prompt);
          const response = result.response.text();
          console.log('Received response from Gemini API');

          // Format and send response
          return res.json({ response });
        } catch (aiError) {
          console.error('Gemini API error:', aiError);
          return res.status(500).json({ 
            error: 'AI generation error', 
            response: "I'm having trouble understanding that right now. Could you try asking in a different way?" 
          });
        }

      } catch (dbError) {
        console.error('Database error:', dbError);
        return res.status(500).json({ 
          error: 'Database error', 
          response: "I'm having trouble accessing the latest information. Please try again shortly." 
        });
      }

    } catch (error) {
      console.error('Chatbot general error:', error);
      res.status(500).json({ 
        error: 'Failed to process message', 
        message: error.message,
        response: "Sorry, I encountered an unexpected error. The team has been notified." 
      });
    }
  },

  /**
   * Save feedback from the chatbot
   */
  async saveFeedback(req, res) {
    try {
      const { name, mobile, email, feedback } = req.body;
      
      if (!name || !mobile || !email || !feedback) {
        return res.status(400).json({ error: 'All fields are required' });
      }

      const newFeedback = new Feedback({
        name,
        mobile,
        email,
        feedback
      });

      await newFeedback.save();
      res.status(201).json({ message: 'Feedback submitted successfully' });
    } catch (error) {
      console.error('Feedback error:', error);
      res.status(500).json({ error: 'Failed to save feedback' });
    }
  }
};

module.exports = chatbotController;