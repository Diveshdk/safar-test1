import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { message, currentLocation, conversationHistory, tripContext } = body

    console.log("AI Travel Chat request:", {
      message: message?.substring(0, 100),
      currentLocation: currentLocation?.city,
      tripContext: tripContext?.destination,
    })

    // Validate required fields
    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return Response.json({
        response: "I didn't receive your message properly. Could you please try asking your question again?",
      })
    }

    // Check if API key is available
    if (!process.env.GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY not found")
      return Response.json({
        response: "I'm sorry, but the AI service is currently unavailable. Please check back later!",
      })
    }

    try {
      const model = genAI.getGenerativeModel({
        model: "gemini-pro",
        generationConfig: {
          temperature: 0.8,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
      })

      // Build comprehensive context for the AI
      let context = `You are an expert AI travel assistant specializing in travel advice, recommendations, and planning. You provide helpful, accurate, and culturally sensitive travel information.

Key guidelines:
- Provide practical travel advice about destinations, transportation, accommodation, food, culture, and safety
- Include budget-friendly options and mention prices in appropriate currencies when relevant
- Be respectful of local cultures and traditions
- Provide specific recommendations when possible
- Keep responses concise but informative (max 200 words)
- Use a friendly, helpful tone with occasional local greetings
- Focus on actionable advice and insider tips

`

      // Add current location context
      if (currentLocation && currentLocation.city) {
        context += `The user is currently in ${currentLocation.city}. Provide location-specific advice when relevant.\n\n`
      }

      // Add trip context if available
      if (tripContext) {
        context += `Trip Context:
- Destination: ${tripContext.destination || "Not specified"}
- Travel Dates: ${tripContext.dates || "Not specified"}
- Budget: ₹${tripContext.budget || "Not specified"}
- Preferences: ${tripContext.preferences?.join(", ") || "None specified"}

`
      }

      // Add conversation history for context (limit to last 3 messages to avoid token limits)
      if (conversationHistory && Array.isArray(conversationHistory) && conversationHistory.length > 0) {
        context += "Recent conversation:\n"
        const recentHistory = conversationHistory.slice(-3)
        recentHistory.forEach((msg: any) => {
          if (msg && msg.text) {
            context += `${msg.isBot ? "Assistant" : "User"}: ${msg.text.substring(0, 100)}\n`
          }
        })
        context += "\n"
      }

      context += `User's current question: ${message.trim()}\n\nProvide a helpful, informative response:`

      console.log("Sending request to Gemini API for chat...")

      const result = await model.generateContent(context)
      const response = result.response
      const text = response.text()

      console.log("Gemini API chat response received, length:", text.length)

      // Clean the response
      const cleanedResponse = text.trim()

      if (cleanedResponse.length === 0) {
        return Response.json({
          response:
            "I'm here to help with your travel questions! Could you please ask me something specific about travel, destinations, or planning?",
        })
      }

      return Response.json({ response: cleanedResponse })
    } catch (aiError) {
      console.error("Gemini API error:", aiError)

      // Provide contextual fallback responses
      let fallbackResponse =
        "I'm experiencing some technical difficulties right now. Please try asking your question again in a moment!"

      if (message.toLowerCase().includes("weather")) {
        fallbackResponse =
          "I'm having trouble accessing weather information right now. You can check current weather conditions on weather.com or your local weather app."
      } else if (message.toLowerCase().includes("restaurant") || message.toLowerCase().includes("food")) {
        fallbackResponse =
          "I'm having trouble accessing restaurant information right now. I recommend checking local review sites like Zomato or Google Maps for restaurant recommendations."
      } else if (message.toLowerCase().includes("hotel") || message.toLowerCase().includes("accommodation")) {
        fallbackResponse =
          "I'm having trouble accessing accommodation information right now. You can check booking sites like Booking.com or Airbnb for available options."
      }

      return Response.json({ response: fallbackResponse })
    }
  } catch (error) {
    console.error("AI Travel Chat error:", error)

    // Provide a helpful error message based on the error type
    let errorMessage =
      "I apologize, but I'm experiencing some technical difficulties right now. Please try asking your question again in a moment!"

    if (error instanceof Error) {
      if (error.message.includes("API key") || error.message.includes("API_KEY")) {
        errorMessage = "The AI service is currently unavailable. Please check back later!"
      } else if (error.message.includes("quota") || error.message.includes("limit")) {
        errorMessage = "I'm currently experiencing high demand. Please try again in a few minutes!"
      } else if (error.message.includes("network") || error.message.includes("fetch")) {
        errorMessage = "I'm having trouble connecting right now. Please check your internet connection and try again!"
      }
    }

    return Response.json({
      response: errorMessage,
    })
  }
}
