export async function POST(request: Request) {
  try {
    const { query, currentLocation } = await request.json()

    // Generate AI-powered travel content using Gemini API
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Give a detailed travel guide for visiting ${query}. Include:
                  1. Brief description (2-3 sentences)
                  2. Culture and traditions (2-3 sentences)
                  3. History (2-3 sentences)
                  4. 5-7 notable places to visit
                  5. Distance and transport modes from ${currentLocation?.name || "current location"}
                  6. 5-7 things to do and activities
                  7. 5-7 local food items and cuisine
                  8. 5-7 hotels or accommodation options
                  
                  Format the response as JSON with these exact keys:
                  {
                    "name": "${query}",
                    "description": "...",
                    "culture": "...",
                    "history": "...",
                    "notablePlaces": ["...", "..."],
                    "distance": "approximate distance and time",
                    "transport": ["Flight", "Train", "Bus", "Car"],
                    "thingsToDo": ["...", "..."],
                    "food": ["...", "..."],
                    "hotels": ["...", "..."]
                  }`,
                },
              ],
            },
          ],
        }),
      },
    )

    const geminiData = await geminiResponse.json()
    let placeInfo

    try {
      // Extract JSON from Gemini response
      const responseText = geminiData.candidates[0].content.parts[0].text
      const jsonMatch = responseText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        placeInfo = JSON.parse(jsonMatch[0])
      } else {
        throw new Error("No JSON found in response")
      }
    } catch (parseError) {
      // Fallback data if AI parsing fails
      placeInfo = {
        name: query,
        description: `${query} is a beautiful destination with rich culture and history.`,
        culture: "This place has a vibrant culture with unique traditions and customs.",
        history: "The area has a fascinating history spanning many centuries.",
        notablePlaces: ["Historic Center", "Local Museum", "Cultural District", "Scenic Viewpoint"],
        distance: "Distance varies based on your location",
        transport: ["Flight", "Train", "Bus", "Car"],
        thingsToDo: ["Sightseeing", "Local Tours", "Cultural Activities", "Photography"],
        food: ["Local Cuisine", "Traditional Dishes", "Street Food", "Regional Specialties"],
        hotels: ["Luxury Hotels", "Budget Hotels", "Boutique Properties", "Local Guesthouses"],
      }
    }

    // Get weather data (mock for now - replace with actual weather API)
    const weather = {
      temperature: `${Math.floor(Math.random() * 20) + 15}°C`,
      condition: ["Sunny", "Partly Cloudy", "Clear", "Pleasant"][Math.floor(Math.random() * 4)],
      humidity: `${Math.floor(Math.random() * 30) + 40}%`,
    }

    return Response.json({
      ...placeInfo,
      weather,
      photos: [], // Can be populated with Google Places API
    })
  } catch (error) {
    console.error("Search place error:", error)
    return Response.json({ error: "Failed to search place" }, { status: 500 })
  }
}
