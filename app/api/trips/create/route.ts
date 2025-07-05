import { supabaseAdmin } from "@/lib/supabase"

export async function POST(request: Request) {
  try {
    const tripData = await request.json()
    console.log("Creating trip with data:", tripData)

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.log("Supabase not configured, returning success")
      return Response.json({ success: true })
    }

    // Validate required fields
    if (!tripData.name || !tripData.destination || !tripData.start_date || !tripData.end_date) {
      return Response.json({
        success: false,
        error: "Missing required fields: name, destination, start_date, or end_date",
      })
    }

    // Create the main trip
    const { data: trip, error: tripError } = await supabaseAdmin
      .from("trips")
      .insert({
        id: tripData.id || `trip_${Date.now()}`,
        owner_id: tripData.owner_id,
        name: tripData.name,
        description: tripData.description || "",
        start_date: tripData.start_date,
        end_date: tripData.end_date,
        start_location: tripData.start_location || tripData.destination,
        destination: tripData.destination,
        budget: tripData.budget || 0,
        transport_mode: tripData.transport_mode || "flight",
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (tripError) {
      console.error("Supabase trip creation error:", tripError)
      return Response.json({ success: false, error: tripError.message })
    }

    // Add trip members if provided
    if (tripData.members && tripData.members.length > 0) {
      const membersToInsert = tripData.members.map((member: any) => ({
        trip_id: trip.id,
        user_id: member.user_id || null,
        name: member.name,
        email: member.email || null,
        color: member.color || "#3B82F6",
        created_at: new Date().toISOString(),
      }))

      const { error: membersError } = await supabaseAdmin.from("trip_members").insert(membersToInsert)

      if (membersError) {
        console.error("Trip members creation error:", membersError)
        // Don't fail the entire request for member errors
      }
    }

    // Add trip plan if provided (from AI planner)
    if (tripData.itinerary) {
      const { error: planError } = await supabaseAdmin.from("trip_plans").insert({
        trip_id: trip.id,
        title: tripData.name,
        destination: tripData.destination,
        start_date: tripData.start_date,
        end_date: tripData.end_date,
        budget: tripData.budget || 0,
        travelers: tripData.travelers || 2,
        preferences: tripData.preferences || [],
        itinerary: tripData.itinerary,
        is_generated: true,
        created_at: new Date().toISOString(),
      })

      if (planError) {
        console.error("Trip plan creation error:", planError)
        // Don't fail the entire request for plan errors
      }
    }

    console.log("Trip created successfully:", trip)
    return Response.json({ success: true, trip })
  } catch (error) {
    console.error("Create trip error:", error)
    return Response.json({ success: false, error: "Failed to create trip" })
  }
}
