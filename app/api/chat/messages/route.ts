import { supabaseAdmin } from "@/lib/supabase"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { city, lat, lng } = await request.json()

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      // Enhanced mock data for better testing
      const mockMessages = [
        {
          id: "msg-1",
          user_id: "user_123",
          user_name: "Adventure Seeker",
          user_avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
          message: `Hey everyone! Just arrived in ${city}. Any recommendations for good local food?`,
          city: city,
          created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: "msg-2",
          user_id: "user_456",
          user_name: "Local Guide",
          user_avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
          message: `Welcome to ${city}! You should definitely try the local street food near the main market. The chaat is amazing!`,
          city: city,
          created_at: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: "msg-3",
          user_id: "user_789",
          user_name: "Foodie Explorer",
          user_avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
          message: `I second that! Also check out the rooftop restaurants for great city views. Perfect for sunset!`,
          city: city,
          created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        },
      ]
      return NextResponse.json({ messages: mockMessages })
    }

    // Get messages for this city from Supabase
    const { data: messages, error } = await supabaseAdmin
      .from("chat_messages")
      .select(`
        id,
        user_id,
        user_name,
        user_avatar,
        message,
        city,
        created_at
      `)
      .eq("city", city)
      .order("created_at", { ascending: true })
      .limit(50)

    if (error) {
      console.error("Supabase error:", error)
      // Return mock data on error
      const mockMessages = [
        {
          id: "msg-1",
          user_id: "user_123",
          user_name: "Adventure Seeker",
          user_avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
          message: `Hey everyone! Just arrived in ${city}. Any recommendations for good local food?`,
          city: city,
          created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        },
      ]
      return NextResponse.json({ messages: mockMessages })
    }

    return NextResponse.json({ messages: messages || [] })
  } catch (error) {
    console.error("Chat messages error:", error)
    return NextResponse.json({ messages: [] })
  }
}
