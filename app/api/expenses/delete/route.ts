import { supabaseAdmin } from "@/lib/supabase"

export async function POST(request: Request) {
  try {
    const { id, userId } = await request.json()

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      // Return success if Supabase is not configured (client will handle localStorage)
      return Response.json({ success: true })
    }

    // Delete expense from Supabase
    const { error } = await supabaseAdmin.from("expenses").delete().eq("id", id).eq("user_id", userId)

    if (error) {
      console.error("Supabase error:", error)
      return Response.json({ success: false, error: error.message })
    }

    return Response.json({ success: true })
  } catch (error) {
    console.error("Delete expense error:", error)
    return Response.json({ success: false, error: "Failed to delete expense" })
  }
}
