// dynamic route – don’t prerender
export const dynamic = "force-dynamic"

/**
 * Server-side forward-geocoding: converts a city (string)
 * to { name, lat, lng } using the Google Geocoding API.
 *
 * This keeps the GOOGLE_MAPS_API_KEY hidden from the client.
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const city = searchParams.get("city")

    if (!city) {
      return Response.json({ error: "Missing city parameter" }, { status: 400 })
    }

    const res = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        city,
      )}&key=${process.env.GOOGLE_MAPS_API_KEY}`,
    )

    if (!res.ok) {
      throw new Error(`Google Maps error: ${res.status}`)
    }

    const data = await res.json()
    const loc = data.results?.[0]

    if (!loc) {
      return Response.json({ error: "City not found" }, { status: 404 })
    }

    return Response.json({
      name: loc.formatted_address,
      lat: loc.geometry.location.lat,
      lng: loc.geometry.location.lng,
    })
  } catch (err) {
    console.error(err)
    return Response.json({ error: "Forward geocode failed" }, { status: 500 })
  }
}
