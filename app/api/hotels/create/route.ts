import { supabaseAdmin } from "@/lib/supabase"

export async function POST(request: Request) {
  try {
    const hotelData = await request.json()
    console.log("Creating hotel with data:", hotelData)

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.log("Supabase not configured, returning success")
      return Response.json({ success: true })
    }

    // Validate required fields
    if (!hotelData.name || !hotelData.city || !hotelData.price || !hotelData.description) {
      return Response.json({
        success: false,
        error: "Missing required fields: name, city, price, or description",
      })
    }

    // Insert hotel into Supabase
    const { data, error } = await supabaseAdmin
      .from("hotels")
      .insert({
        id: hotelData.id || `hotel_${Date.now()}`,
        owner_id: hotelData.owner_id,
        name: hotelData.name,
        description: hotelData.description,
        city: hotelData.city,
        price_per_night: Number(hotelData.price),
        image_url: hotelData.image_url || "/placeholder.svg?height=240&width=400",
        amenities: hotelData.amenities || [],
        rating: hotelData.rating || 4.0,
        contact_phone: hotelData.contact_phone || null,
        contact_email: hotelData.contact_email || null,
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error("Supabase hotel creation error:", error)
      return Response.json({ success: false, error: error.message })
    }

    console.log("Hotel created successfully:", data)
    return Response.json({ success: true, hotel: data })
  } catch (error) {
    console.error("Create hotel error:", error)
    return Response.json({ success: false, error: "Failed to create hotel" })
  }
}
