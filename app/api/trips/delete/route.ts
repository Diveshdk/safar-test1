import { supabaseAdmin } from "@/lib/supabase"

export async function POST(request: Request) {
  try {
    const { id, userId } = await request.json()

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      // Return success if Supabase is not configured
      return Response.json({ success: true })
    }

    // Delete trip from Supabase (this will cascade delete members and expenses)
    const { error } = await supabaseAdmin.from("trips").delete().eq("id", id).eq("owner_id", userId)

    if (error) {
      console.error("Supabase error:", error)
      return Response.json({ success: false, error: error.message })
    }

    return Response.json({ success: true })
  } catch (error) {
    console.error("Delete trip error:", error)
    return Response.json({ success: false, error: "Failed to delete trip" })
  }
}
