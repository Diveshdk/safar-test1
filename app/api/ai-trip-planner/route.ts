import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

// Enhanced destination data with real places and accurate information
const DESTINATION_DATA = {
  Goa: {
    type: "Beach & Heritage",
    bestMonths: ["Nov", "Dec", "Jan", "Feb", "Mar"],
    currency: "INR",
    attractions: [
      {
        name: "Baga Beach",
        type: "beach",
        cost: 0,
        duration: "3 hours",
        rating: 4.2,
        tips: "Best for water sports and beach shacks",
      },
      {
        name: "Calangute Beach",
        type: "beach",
        cost: 0,
        duration: "2 hours",
        rating: 4.0,
        tips: "Most popular beach, can be crowded",
      },
      {
        name: "Anjuna Beach",
        type: "beach",
        cost: 0,
        duration: "4 hours",
        rating: 4.3,
        tips: "Famous for flea market on Wednesdays",
      },
      {
        name: "Basilica of Bom Jesus",
        type: "heritage",
        cost: 0,
        duration: "1 hour",
        rating: 4.5,
        tips: "UNESCO World Heritage Site, dress modestly",
      },
      {
        name: "Se Cathedral",
        type: "heritage",
        cost: 0,
        duration: "45 mins",
        rating: 4.3,
        tips: "Largest church in Asia",
      },
      { name: "Fort Aguada", type: "heritage", cost: 25, duration: "2 hours", rating: 4.1, tips: "Great sunset views" },
      {
        name: "Dudhsagar Falls",
        type: "nature",
        cost: 1200,
        duration: "6 hours",
        rating: 4.6,
        tips: "Best during monsoon, book jeep safari",
      },
      {
        name: "Spice Plantation Tour",
        type: "nature",
        cost: 800,
        duration: "4 hours",
        rating: 4.4,
        tips: "Includes traditional Goan lunch",
      },
      {
        name: "Casino Cruise",
        type: "entertainment",
        cost: 2500,
        duration: "4 hours",
        rating: 4.0,
        tips: "Evening cruise with dinner",
      },
      { name: "Dona Paula", type: "scenic", cost: 0, duration: "2 hours", rating: 3.9, tips: "Romantic sunset point" },
    ],
    restaurants: [
      {
        name: "Fisherman's Wharf",
        cuisine: "Goan",
        cost: 1200,
        rating: 4.4,
        specialty: "Goan Fish Curry",
        location: "Cavelossim",
      },
      {
        name: "Vinayak Family Restaurant",
        cuisine: "Goan",
        cost: 800,
        rating: 4.6,
        specialty: "Authentic Goan Thali",
        location: "Assagao",
      },
      { name: "Thalassa", cuisine: "Greek", cost: 1800, rating: 4.3, specialty: "Greek Mezze", location: "Vagator" },
      {
        name: "Gunpowder",
        cuisine: "South Indian",
        cost: 900,
        rating: 4.5,
        specialty: "Ghee Roast",
        location: "Assagao",
      },
      {
        name: "Pousada by the Beach",
        cuisine: "Continental",
        cost: 1500,
        rating: 4.2,
        specialty: "Seafood Platter",
        location: "Calangute",
      },
    ],
    accommodation: {
      budget: { range: "₹1000-2500", examples: ["Zostel Goa", "Backpacker Panda", "Anjuna Beach Resort"] },
      midRange: { range: "₹2500-6000", examples: ["Hotel Baia do Sol", "Lemon Tree Hotel", "The Zuri White Sands"] },
      luxury: { range: "₹6000+", examples: ["Taj Exotica", "The Leela Goa", "Grand Hyatt Goa"] },
    },
    transport: {
      local: [
        { type: "Scooter Rental", cost: 400, duration: "per day", tips: "Most convenient, need valid license" },
        { type: "Taxi", cost: 15, duration: "per km", tips: "Use Ola/Uber or pre-paid taxis" },
        { type: "Bus", cost: 15, duration: "per trip", tips: "Kadamba buses connect major areas" },
        { type: "Auto Rickshaw", cost: 25, duration: "per km", tips: "Negotiate fare beforehand" },
      ],
    },
    localTips: [
      "Rent a scooter for easy mobility",
      "Try authentic Goan fish curry rice",
      "Visit churches early morning to avoid crowds",
      "Bargain at Anjuna flea market",
      "Carry cash as many places don't accept cards",
      "Respect local customs at religious sites",
    ],
  },
  Kerala: {
    type: "Backwaters & Hills",
    bestMonths: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
    currency: "INR",
    attractions: [
      {
        name: "Alleppey Backwaters",
        type: "nature",
        cost: 8000,
        duration: "8 hours",
        rating: 4.7,
        tips: "Book houseboat in advance",
      },
      {
        name: "Munnar Tea Gardens",
        type: "nature",
        cost: 500,
        duration: "4 hours",
        rating: 4.5,
        tips: "Visit Tata Tea Museum",
      },
      {
        name: "Periyar Wildlife Sanctuary",
        type: "wildlife",
        cost: 300,
        duration: "6 hours",
        rating: 4.3,
        tips: "Early morning best for wildlife spotting",
      },
      {
        name: "Kochi Fort Area",
        type: "heritage",
        cost: 0,
        duration: "3 hours",
        rating: 4.2,
        tips: "See Chinese fishing nets at sunset",
      },
      {
        name: "Varkala Beach",
        type: "beach",
        cost: 0,
        duration: "4 hours",
        rating: 4.4,
        tips: "Famous for cliff-top restaurants",
      },
      {
        name: "Kumarakom Bird Sanctuary",
        type: "nature",
        cost: 100,
        duration: "3 hours",
        rating: 4.1,
        tips: "Best time: 6-9 AM and 4-6 PM",
      },
      {
        name: "Athirapally Falls",
        type: "nature",
        cost: 30,
        duration: "3 hours",
        rating: 4.5,
        tips: "Kerala's Niagara, best during monsoon",
      },
      {
        name: "Mattancherry Palace",
        type: "heritage",
        cost: 15,
        duration: "1 hour",
        rating: 4.0,
        tips: "Dutch Palace with Kerala murals",
      },
      {
        name: "Spice Markets Kochi",
        type: "shopping",
        cost: 0,
        duration: "2 hours",
        rating: 4.2,
        tips: "Buy cardamom, pepper, and cinnamon",
      },
      {
        name: "Kathakali Performance",
        type: "culture",
        cost: 300,
        duration: "2 hours",
        rating: 4.6,
        tips: "Traditional Kerala dance form",
      },
    ],
    restaurants: [
      { name: "Dhe Puttu", cuisine: "Kerala", cost: 600, rating: 4.5, specialty: "Puttu varieties", location: "Kochi" },
      {
        name: "Kayees Biryani",
        cuisine: "Malabar",
        cost: 400,
        rating: 4.6,
        specialty: "Thalassery Biryani",
        location: "Kozhikode",
      },
      {
        name: "Paragon Restaurant",
        cuisine: "Kerala",
        cost: 800,
        rating: 4.4,
        specialty: "Fish Moilee",
        location: "Kozhikode",
      },
      {
        name: "Rapsy Restaurant",
        cuisine: "Kerala",
        cost: 500,
        rating: 4.3,
        specialty: "Appam with Stew",
        location: "Alleppey",
      },
      {
        name: "Sadhya Restaurant",
        cuisine: "Kerala",
        cost: 350,
        rating: 4.7,
        specialty: "Traditional Sadhya",
        location: "Munnar",
      },
    ],
    accommodation: {
      budget: { range: "₹800-2000", examples: ["Backwater Ripples", "Munnar Dreams", "Zostel Varkala"] },
      midRange: {
        range: "₹2000-5000",
        examples: ["Spice Village Thekkady", "Tea Valley Resort", "Marari Beach Resort"],
      },
      luxury: { range: "₹5000+", examples: ["Kumarakom Lake Resort", "Taj Green Cove", "Niraamaya Retreats"] },
    },
    transport: {
      local: [
        { type: "Auto Rickshaw", cost: 20, duration: "per km", tips: "Most common local transport" },
        { type: "KSRTC Bus", cost: 25, duration: "per trip", tips: "Connects all major destinations" },
        { type: "Taxi", cost: 12, duration: "per km", tips: "Book through Ola/Uber in cities" },
        { type: "Boat", cost: 200, duration: "per trip", tips: "Essential for backwater exploration" },
      ],
    },
    localTips: [
      "Try traditional Kerala Sadhya on banana leaf",
      "Book houseboats well in advance",
      "Carry light cotton clothes and rain gear",
      "Learn basic Malayalam phrases",
      "Respect local customs in temples",
      "Bargain politely in local markets",
    ],
  },
  Rajasthan: {
    type: "Desert & Palaces",
    bestMonths: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
    currency: "INR",
    attractions: [
      {
        name: "City Palace Jaipur",
        type: "heritage",
        cost: 500,
        duration: "3 hours",
        rating: 4.5,
        tips: "Audio guide recommended",
      },
      {
        name: "Amber Fort",
        type: "heritage",
        cost: 500,
        duration: "4 hours",
        rating: 4.6,
        tips: "Take elephant ride or jeep",
      },
      {
        name: "Hawa Mahal",
        type: "heritage",
        cost: 200,
        duration: "1 hour",
        rating: 4.2,
        tips: "Best photos from opposite building",
      },
      {
        name: "Jaisalmer Fort",
        type: "heritage",
        cost: 250,
        duration: "4 hours",
        rating: 4.7,
        tips: "Living fort with shops and hotels",
      },
      {
        name: "Sam Sand Dunes",
        type: "desert",
        cost: 2500,
        duration: "6 hours",
        rating: 4.4,
        tips: "Camel safari and cultural program",
      },
      {
        name: "Udaipur City Palace",
        type: "heritage",
        cost: 300,
        duration: "3 hours",
        rating: 4.6,
        tips: "Overlooks Lake Pichola",
      },
      {
        name: "Lake Pichola Boat Ride",
        type: "scenic",
        cost: 400,
        duration: "1 hour",
        rating: 4.5,
        tips: "Sunset cruise recommended",
      },
      {
        name: "Mehrangarh Fort Jodhpur",
        type: "heritage",
        cost: 600,
        duration: "4 hours",
        rating: 4.8,
        tips: "One of India's largest forts",
      },
      {
        name: "Pushkar Lake",
        type: "spiritual",
        cost: 0,
        duration: "2 hours",
        rating: 4.3,
        tips: "Holy lake, remove shoes",
      },
      {
        name: "Chittorgarh Fort",
        type: "heritage",
        cost: 300,
        duration: "5 hours",
        rating: 4.4,
        tips: "UNESCO World Heritage Site",
      },
    ],
    restaurants: [
      {
        name: "Chokhi Dhani",
        cuisine: "Rajasthani",
        cost: 1200,
        rating: 4.3,
        specialty: "Traditional Thali",
        location: "Jaipur",
      },
      {
        name: "1135 AD",
        cuisine: "Rajasthani",
        cost: 2000,
        rating: 4.5,
        specialty: "Royal Cuisine",
        location: "Amber Fort",
      },
      {
        name: "Trio Restaurant",
        cuisine: "Rajasthani",
        cost: 800,
        rating: 4.4,
        specialty: "Dal Baati Churma",
        location: "Jaisalmer",
      },
      {
        name: "Ambrai Restaurant",
        cuisine: "Multi-cuisine",
        cost: 1500,
        rating: 4.6,
        specialty: "Lake view dining",
        location: "Udaipur",
      },
      { name: "Indique", cuisine: "Rajasthani", cost: 1000, rating: 4.2, specialty: "Laal Maas", location: "Jodhpur" },
    ],
    accommodation: {
      budget: { range: "₹1200-3000", examples: ["Zostel Jaipur", "Moustache Hostel", "Hotel Pearl Palace"] },
      midRange: { range: "₹3000-8000", examples: ["Hotel Diggi Palace", "Rang Mahal Hotel", "Hotel Pleasant Haveli"] },
      luxury: { range: "₹8000+", examples: ["Taj Lake Palace", "Umaid Bhawan Palace", "Rambagh Palace"] },
    },
    transport: {
      local: [
        { type: "Auto Rickshaw", cost: 25, duration: "per km", tips: "Negotiate fare, use meter in cities" },
        { type: "Taxi", cost: 18, duration: "per km", tips: "Book full day for sightseeing" },
        { type: "RSRTC Bus", cost: 30, duration: "per trip", tips: "Connects major cities" },
        { type: "Camel Cart", cost: 500, duration: "per hour", tips: "Traditional desert transport" },
      ],
    },
    localTips: [
      "Carry water bottle and stay hydrated",
      "Dress modestly, especially at religious sites",
      "Bargain is expected in markets",
      "Try traditional Rajasthani thali",
      "Book desert safari in advance",
      "Respect photography restrictions in palaces",
    ],
  },
  "Himachal Pradesh": {
    type: "Mountains & Adventure",
    bestMonths: ["Mar", "Apr", "May", "Jun", "Sep", "Oct", "Nov"],
    currency: "INR",
    attractions: [
      {
        name: "Mall Road Shimla",
        type: "scenic",
        cost: 0,
        duration: "3 hours",
        rating: 4.1,
        tips: "Evening walk, try local snacks",
      },
      {
        name: "Solang Valley",
        type: "adventure",
        cost: 1500,
        duration: "6 hours",
        rating: 4.5,
        tips: "Paragliding and skiing activities",
      },
      {
        name: "Rohtang Pass",
        type: "scenic",
        cost: 500,
        duration: "8 hours",
        rating: 4.3,
        tips: "Permit required, check weather",
      },
      {
        name: "McLeod Ganj",
        type: "spiritual",
        cost: 0,
        duration: "4 hours",
        rating: 4.6,
        tips: "Dalai Lama's residence",
      },
      { name: "Kasol", type: "nature", cost: 0, duration: "6 hours", rating: 4.4, tips: "Mini Israel of India" },
      {
        name: "Tosh Village",
        type: "nature",
        cost: 0,
        duration: "4 hours",
        rating: 4.5,
        tips: "Scenic Parvati Valley village",
      },
      {
        name: "Kufri",
        type: "adventure",
        cost: 800,
        duration: "4 hours",
        rating: 4.0,
        tips: "Horse riding and skiing",
      },
      {
        name: "Spiti Valley",
        type: "adventure",
        cost: 3000,
        duration: "2 days",
        rating: 4.8,
        tips: "High altitude desert, acclimatize",
      },
      {
        name: "Triund Trek",
        type: "trekking",
        cost: 200,
        duration: "8 hours",
        rating: 4.7,
        tips: "Moderate trek, carry water",
      },
      {
        name: "Khajjiar",
        type: "nature",
        cost: 0,
        duration: "4 hours",
        rating: 4.2,
        tips: "Mini Switzerland of India",
      },
    ],
    restaurants: [
      {
        name: "Johnson's Cafe",
        cuisine: "Continental",
        cost: 800,
        rating: 4.4,
        specialty: "Trout Fish",
        location: "Manali",
      },
      {
        name: "Cafe 1947",
        cuisine: "Multi-cuisine",
        cost: 600,
        rating: 4.3,
        specialty: "Israeli Food",
        location: "Kasol",
      },
      {
        name: "The Corner House",
        cuisine: "Tibetan",
        cost: 400,
        rating: 4.5,
        specialty: "Momos",
        location: "McLeod Ganj",
      },
      {
        name: "Ashiana Restaurant",
        cuisine: "Indian",
        cost: 500,
        rating: 4.2,
        specialty: "Himachali Dham",
        location: "Shimla",
      },
      {
        name: "German Bakery",
        cuisine: "Continental",
        cost: 300,
        rating: 4.1,
        specialty: "Fresh Bread",
        location: "Kasol",
      },
    ],
    accommodation: {
      budget: { range: "₹800-2000", examples: ["Zostel Manali", "Backpacker's Inn", "Hotel Snow View"] },
      midRange: { range: "₹2000-5000", examples: ["Hotel Holiday Home", "Apple Country Resort", "The Himalayan"] },
      luxury: { range: "₹5000+", examples: ["Oberoi Cecil", "Wildflower Hall", "Span Resort & Spa"] },
    },
    transport: {
      local: [
        { type: "Local Bus", cost: 20, duration: "per trip", tips: "HRTC buses, can be crowded" },
        { type: "Taxi", cost: 25, duration: "per km", tips: "Shared taxis available" },
        { type: "Auto Rickshaw", cost: 30, duration: "per km", tips: "Limited to certain areas" },
        { type: "Bike Rental", cost: 800, duration: "per day", tips: "Royal Enfield popular choice" },
      ],
    },
    localTips: [
      "Carry warm clothes even in summer",
      "Book accommodation in advance during peak season",
      "Try local Himachali cuisine",
      "Respect local customs and environment",
      "Check road conditions before traveling",
      "Carry altitude sickness medication for high areas",
    ],
  },
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { destination, startDate, endDate, budget, travelers, preferences, customRequirements, currentLocation } =
      body

    console.log("Trip planner request received:", { destination, startDate, endDate, budget, travelers })

    // Validate required fields
    if (!destination || !startDate || !endDate || !budget || !travelers) {
      console.error("Missing required fields")
      return Response.json(
        {
          error: "Missing required fields",
          itinerary: [],
        },
        { status: 400 },
      )
    }

    // Check if API key is available
    if (!process.env.GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY not found")
      return Response.json({
        error: "AI service is currently unavailable",
        itinerary: generateFallbackItinerary(destination, startDate, endDate, budget, travelers, preferences || []),
      })
    }

    // Calculate trip duration
    const start = new Date(startDate)
    const end = new Date(endDate)
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1

    console.log("Trip duration calculated:", days, "days")

    // Check if destination exists in our database
    const destinationData = DESTINATION_DATA[destination as keyof typeof DESTINATION_DATA]

    try {
      const model = genAI.getGenerativeModel({
        model: "gemini-pro",
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 8192,
        },
      })

      let prompt = ""

      if (destinationData) {
        // Use our detailed database for known destinations
        prompt = `You are an expert travel planner. Create a detailed ${days}-day itinerary for ${destination}.

Trip Details:
- Destination: ${destination}
- Duration: ${days} days (${startDate} to ${endDate})
- Budget: ₹${budget} total for ${travelers} people
- Preferences: ${(preferences || []).join(", ") || "General sightseeing"}
${customRequirements ? `- Special Requirements: ${customRequirements}` : ""}

Use this destination data: ${JSON.stringify(destinationData, null, 2)}

Create a JSON response with this structure:
{
  "itinerary": [
    {
      "day": 1,
      "date": "${start.toISOString().split("T")[0]}",
      "activities": [
        {
          "id": "day1-activity1",
          "time": "09:00",
          "title": "Activity Name",
          "description": "Detailed description",
          "location": "Specific location",
          "duration": "2 hours",
          "cost": 500,
          "category": "sightseeing",
          "rating": 4.5,
          "tips": "Helpful tips",
          "bookingRequired": false
        }
      ],
      "totalCost": 2000,
      "notes": "Day summary"
    }
  ]
}

Important: Respond ONLY with valid JSON. No markdown, no explanations.`
      } else {
        // For unknown destinations
        prompt = `You are an expert travel planner. Create a detailed ${days}-day itinerary for ${destination}.

Trip Details:
- Destination: ${destination}
- Duration: ${days} days (${startDate} to ${endDate})
- Budget: ₹${budget} total for ${travelers} people
- Preferences: ${(preferences || []).join(", ") || "General sightseeing"}
${customRequirements ? `- Special Requirements: ${customRequirements}` : ""}

Research real attractions, restaurants, and activities for ${destination}. Include:
1. Specific attraction names with entry fees
2. Real restaurant names with cuisine types
3. Local transport costs
4. Cultural insights and tips

Create a JSON response with this structure:
{
  "itinerary": [
    {
      "day": 1,
      "date": "${start.toISOString().split("T")[0]}",
      "activities": [
        {
          "id": "day1-activity1",
          "time": "09:00",
          "title": "Real attraction/restaurant name",
          "description": "Detailed description with cultural context",
          "location": "Specific address or area",
          "duration": "2 hours",
          "cost": 500,
          "category": "sightseeing",
          "rating": 4.5,
          "tips": "Local insights and practical advice",
          "bookingRequired": false
        }
      ],
      "totalCost": 2000,
      "notes": "Day summary with cultural insights"
    }
  ]
}

Important: Respond ONLY with valid JSON. No markdown, no explanations.`
      }

      console.log("Sending request to Gemini API...")

      const result = await model.generateContent(prompt)
      const response = result.response
      const text = response.text()

      console.log("Gemini API response received, length:", text.length)

      // Clean and parse the response
      let cleanedText = text.trim()

      // Remove markdown code blocks
      if (cleanedText.startsWith("```json")) {
        cleanedText = cleanedText.replace(/```json\n?/, "").replace(/\n?```$/, "")
      } else if (cleanedText.startsWith("```")) {
        cleanedText = cleanedText.replace(/```\n?/, "").replace(/\n?```$/, "")
      }

      cleanedText = cleanedText.trim()

      console.log("Attempting to parse JSON response...")
      const parsedResponse = JSON.parse(cleanedText)

      // Validate response structure
      if (parsedResponse.itinerary && Array.isArray(parsedResponse.itinerary) && parsedResponse.itinerary.length > 0) {
        console.log("Successfully generated itinerary with", parsedResponse.itinerary.length, "days")

        // Ensure all days have proper dates
        parsedResponse.itinerary.forEach((day: any, index: number) => {
          const dayDate = new Date(start)
          dayDate.setDate(start.getDate() + index)
          day.date = dayDate.toISOString().split("T")[0]
          day.day = index + 1

          // Ensure activities have proper IDs
          if (day.activities) {
            day.activities.forEach((activity: any, actIndex: number) => {
              if (!activity.id) {
                activity.id = `day${day.day}-activity${actIndex + 1}`
              }
            })
          }
        })

        return Response.json(parsedResponse)
      } else {
        throw new Error("Invalid response structure - missing or empty itinerary array")
      }
    } catch (aiError) {
      console.error("AI generation failed:", aiError)
      console.log("Generating fallback itinerary...")

      return Response.json({
        itinerary: generateFallbackItinerary(destination, startDate, endDate, budget, travelers, preferences || []),
      })
    }
  } catch (error) {
    console.error("Trip planner error:", error)

    try {
      const body = await request.json()
      const { destination, startDate, endDate, budget, travelers, preferences } = body

      return Response.json({
        error: "Unable to generate trip plan",
        itinerary: generateFallbackItinerary(destination, startDate, endDate, budget, travelers, preferences || []),
      })
    } catch (fallbackError) {
      console.error("Fallback generation failed:", fallbackError)
      return Response.json(
        {
          error: "Unable to generate trip plan",
          itinerary: [],
        },
        { status: 500 },
      )
    }
  }
}

function generateFallbackItinerary(
  destination: string,
  startDate: string,
  endDate: string,
  budget: number,
  travelers: number,
  preferences: string[],
) {
  console.log("Generating fallback itinerary for:", destination)

  const start = new Date(startDate)
  const end = new Date(endDate)
  const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1
  const dailyBudget = Math.floor(budget / days)

  return Array.from({ length: days }, (_, index) => {
    const currentDate = new Date(start)
    currentDate.setDate(start.getDate() + index)

    const activities = [
      {
        id: `day${index + 1}-arrival`,
        time: "09:00",
        title: index === 0 ? `Arrival in ${destination}` : `Morning Exploration of ${destination}`,
        description:
          index === 0
            ? `Arrive at ${destination}, check into accommodation, and get oriented with the local area. Take time to settle in and plan your upcoming days.`
            : `Start your day exploring the main attractions and highlights of ${destination}. Visit popular landmarks and soak in the local culture.`,
        location: `${destination} City Center`,
        duration: "3 hours",
        cost: Math.floor(dailyBudget * 0.2),
        category: index === 0 ? "accommodation" : "sightseeing",
        rating: 4.2,
        tips: "Plan ahead and book tickets online when possible. Ask locals for recommendations and hidden gems.",
        bookingRequired: index === 0,
      },
      {
        id: `day${index + 1}-lunch`,
        time: "13:00",
        title: `Local Cuisine Experience in ${destination}`,
        description: `Try authentic local dishes and specialties of ${destination}. Experience the local food culture and discover regional flavors.`,
        location: `${destination} Restaurant District`,
        duration: "1.5 hours",
        cost: Math.floor(dailyBudget * 0.25),
        category: "food",
        rating: 4.3,
        tips: "Ask locals for their favorite restaurants and must-try dishes. Don't miss regional specialties and street food.",
        bookingRequired: false,
      },
      {
        id: `day${index + 1}-afternoon`,
        time: "16:00",
        title: preferences.includes("adventure")
          ? `Adventure Activity in ${destination}`
          : preferences.includes("culture")
            ? `Cultural Site Visit in ${destination}`
            : preferences.includes("nature")
              ? `Nature Experience in ${destination}`
              : `Local Sightseeing in ${destination}`,
        description: preferences.includes("adventure")
          ? `Exciting outdoor adventure experience in ${destination}. Perfect for thrill seekers and outdoor enthusiasts.`
          : preferences.includes("culture")
            ? `Explore historical and cultural landmarks of ${destination}. Learn about local heritage and traditions.`
            : preferences.includes("nature")
              ? `Enjoy the natural beauty and outdoor spaces of ${destination}. Connect with nature and scenic landscapes.`
              : `Visit popular local attractions and scenic spots in ${destination}. Discover what makes this place special.`,
        location: `${destination} Main Attraction Area`,
        duration: "3 hours",
        cost: Math.floor(dailyBudget * 0.35),
        category: preferences.includes("adventure")
          ? "adventure"
          : preferences.includes("culture")
            ? "culture"
            : preferences.includes("nature")
              ? "sightseeing"
              : "sightseeing",
        rating: 4.4,
        tips: "Check opening hours, weather conditions, and local customs. Bring camera for photos and comfortable shoes.",
        bookingRequired: preferences.includes("adventure"),
      },
      {
        id: `day${index + 1}-transport`,
        time: "All Day",
        title: `Local Transportation in ${destination}`,
        description: `Daily transportation costs including local buses, taxis, ride-sharing services, or public transport in ${destination}`,
        location: destination,
        duration: "As needed",
        cost: Math.floor(dailyBudget * 0.2),
        category: "transport",
        rating: 4.0,
        tips: "Use local transport apps, negotiate taxi fares, or consider day passes for public transport. Keep small change handy.",
        bookingRequired: false,
      },
    ]

    const totalCost = activities.reduce((sum, activity) => sum + activity.cost, 0)

    return {
      day: index + 1,
      date: currentDate.toISOString().split("T")[0],
      activities,
      totalCost,
      notes: `Day ${index + 1} exploring ${destination} - Mix of sightseeing, local cuisine, and ${preferences.includes("budget") ? "budget-friendly" : "premium"} experiences. Research local customs and transportation options for the best experience.`,
    }
  })
}
