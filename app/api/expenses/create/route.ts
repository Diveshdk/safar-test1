import { supabaseAdmin } from "@/lib/supabase"

export async function POST(request: Request) {
  try {
    const { id, title, amount, category, description, date, location, userId, tripId, paidBy, splitWith } =
      await request.json()

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      // Return success if Supabase is not configured (client will handle localStorage)
      return Response.json({ success: true })
    }

    if (tripId) {
      // Insert into trip_expenses table
      const { error } = await supabaseAdmin.from("trip_expenses").upsert({
        id,
        trip_id: tripId,
        title,
        amount,
        category,
        description,
        date,
        location,
        paid_by: paidBy,
        split_with: splitWith,
        created_at: new Date().toISOString(),
      })

      if (error) {
        console.error("Supabase trip expense error:", error)
        return Response.json({ success: false, error: error.message })
      }
    } else {
      // Insert into regular expenses table
      const { error } = await supabaseAdmin.from("expenses").upsert({
        id,
        user_id: userId,
        title,
        amount,
        category,
        description,
        date,
        location,
        created_at: new Date().toISOString(),
      })

      if (error) {
        console.error("Supabase expense error:", error)
        return Response.json({ success: false, error: error.message })
      }
    }

    return Response.json({ success: true })
  } catch (error) {
    console.error("Create expense error:", error)
    return Response.json({ success: false, error: "Failed to create expense" })
  }
}
