export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const lat = searchParams.get("lat")
    const lng = searchParams.get("lng")

    if (!lat || !lng) {
      return Response.json({ error: "Missing coordinates" }, { status: 400 })
    }

    // Use Google Geocoding API (replace with your API key)
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.GOOGLE_MAPS_API_KEY}`,
    )

    if (!response.ok) {
      // Fallback to a simple location name
      return Response.json({ name: "Current Location" })
    }

    const data = await response.json()

    if (data.results && data.results.length > 0) {
      const result = data.results[0]
      const name = result.formatted_address || "Current Location"
      return Response.json({ name })
    }

    return Response.json({ name: "Current Location" })
  } catch (error) {
    console.error("Geocoding error:", error)
    return Response.json({ name: "Current Location" })
  }
}
