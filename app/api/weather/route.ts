export async function POST(request: Request) {
  try {
    const { city, lat, lng } = await request.json()

    // Use the WeatherAPI.com API key from environment variables
    const apiKey = process.env.WEATHERAPI_KEY || "be4a21c216ae41ada32161909250407"

    const response = await fetch(
      `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city || `${lat},${lng}`}&aqi=no`,
    )

    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`)
    }

    const data = await response.json()

    const weather = {
      temperature: data.current.temp_c,
      condition: data.current.condition.text,
      humidity: data.current.humidity,
      wind_speed: data.current.wind_kph,
      icon: data.current.condition.icon,
    }

    return Response.json({ weather })
  } catch (error) {
    console.error("Weather API error:", error)

    // Return mock data as fallback
    return Response.json({
      weather: {
        temperature: 28,
        condition: "Partly cloudy",
        humidity: 65,
        wind_speed: 12,
        icon: "//cdn.weatherapi.com/weather/64x64/day/116.png",
      },
    })
  }
}
