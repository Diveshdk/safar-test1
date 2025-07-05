import { supabaseAdmin } from "@/lib/supabase"

export async function POST(request: Request) {
  try {
    const { userId } = await request.json()

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      // Return empty array if Supabase is not configured
      return Response.json({ trips: [] })
    }

    // Get trips for this user from Supabase
    const { data: trips, error } = await supabaseAdmin
      .from("trips")
      .select(`
        *,
        trip_members(*),
        trip_expenses(*)
      `)
      .eq("owner_id", userId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Supabase error:", error)
      return Response.json({ trips: [] })
    }

    // Format the data
    const formattedTrips =
      trips?.map((trip) => ({
        id: trip.id,
        name: trip.name,
        startDate: trip.start_date,
        endDate: trip.end_date,
        startLocation: trip.start_location,
        destination: trip.destination,
        description: trip.description,
        budget: trip.budget,
        transportMode: trip.transport_mode,
        members:
          trip.trip_members?.map((member: any) => ({
            id: member.id,
            name: member.name,
            email: member.email,
            color: member.color,
          })) || [],
        expenses:
          trip.trip_expenses?.map((expense: any) => ({
            id: expense.id,
            title: expense.title,
            amount: expense.amount,
            category: expense.category,
            description: expense.description,
            date: expense.date,
            location: expense.location,
            paidBy: expense.paid_by,
            splitWith: expense.split_with,
          })) || [],
      })) || []

    return Response.json({ trips: formattedTrips })
  } catch (error) {
    console.error("Trips error:", error)
    return Response.json({ trips: [] })
  }
}
