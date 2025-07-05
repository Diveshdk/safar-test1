import { supabaseAdmin } from "@/lib/supabase"

export async function POST(request: Request) {
  try {
    const { userId, location } = await request.json()

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      // Return empty array if Supabase is not configured
      return Response.json({ expenses: [] })
    }

    // Get expenses for this user from Supabase
    const { data: expenses, error } = await supabaseAdmin
      .from("expenses")
      .select("*")
      .eq("user_id", userId)
      .order("date", { ascending: false })
      .limit(50)

    if (error) {
      console.error("Supabase error:", error)
      return Response.json({ expenses: [] })
    }

    return Response.json({ expenses: expenses || [] })
  } catch (error) {
    console.error("Expenses error:", error)
    return Response.json({ expenses: [] })
  }
}
