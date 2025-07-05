import { supabaseAdmin } from "@/lib/supabase"

export async function POST(request: Request) {
  try {
    const { city } = await request.json()

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      // Mock hotels data with INR pricing for Indian market
      const mockHotels = [
        {
          id: "hotel-1",
          name: "Taj Heritage Palace",
          price: 8500,
          city: city,
          description:
            "Luxury heritage hotel with royal architecture • Swimming pool • Spa • Fine dining • Cultural shows",
          image_url: "/placeholder.svg?height=300&width=500",
          rating: 4.9,
        },
        {
          id: "hotel-2",
          name: "Business Plaza Hotel",
          price: 3200,
          city: city,
          description:
            "Modern business hotel in city center • Business center • Gym • Multi-cuisine restaurant • Free WiFi",
          image_url: "/placeholder.svg?height=300&width=500",
          rating: 4.5,
        },
        {
          id: "hotel-3",
          name: "Comfort Inn Express",
          price: 1800,
          city: city,
          description:
            "Budget-friendly hotel with modern amenities • Clean rooms • 24/7 front desk • Complimentary breakfast",
          image_url: "/placeholder.svg?height=300&width=500",
          rating: 4.2,
        },
        {
          id: "hotel-4",
          name: "Backpacker's Den",
          price: 800,
          city: city,
          description:
            "Hostel for budget travelers • Shared & private rooms • Common kitchen • Travel assistance • WiFi",
          image_url: "/placeholder.svg?height=300&width=500",
          rating: 4.0,
        },
        {
          id: "hotel-5",
          name: "Boutique Retreat",
          price: 5500,
          city: city,
          description: "Boutique hotel with personalized service • Unique decor • Rooftop restaurant • Wellness center",
          image_url: "/placeholder.svg?height=300&width=500",
          rating: 4.7,
        },
      ]
      return Response.json({ hotels: mockHotels })
    }

    // Get hotels for this city from Supabase
    const { data: hotels, error } = await supabaseAdmin
      .from("hotels")
      .select(`
        id,
        name,
        description,
        price_per_night,
        city,
        image_url,
        amenities,
        rating,
        created_at
      `)
      .eq("city", city)
      .order("rating", { ascending: false })
      .limit(10)

    if (error) {
      console.error("Supabase error:", error)
      return Response.json({ hotels: [] })
    }

    const formattedHotels =
      hotels?.map((hotel) => ({
        id: hotel.id,
        name: hotel.name,
        price: hotel.price_per_night,
        city: hotel.city,
        description: hotel.description,
        image_url: hotel.image_url,
        rating: hotel.rating,
        amenities: hotel.amenities,
      })) || []

    return Response.json({ hotels: formattedHotels })
  } catch (error) {
    console.error("Hotels error:", error)
    return Response.json({ hotels: [] })
  }
}
