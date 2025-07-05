import { supabaseAdmin } from "@/lib/supabase"

export async function POST(request: Request) {
  try {
    const { title, content, city, lat, lng, userId, userName, userAvatar, imageUrl } = await request.json()

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      // Mock response if Supabase is not configured
      await new Promise((resolve) => setTimeout(resolve, 800))
      return Response.json({
        success: true,
        post: {
          id: `post-${Date.now()}`,
          user_id: userId,
          user_name: userName,
          user_avatar: userAvatar,
          title: title,
          content: content,
          city: city,
          image_url: imageUrl,
          likes: 0,
          comments: 0,
          created_at: new Date().toISOString(),
        },
      })
    }

    // Insert post into Supabase
    const { data, error } = await supabaseAdmin
      .from("user_posts")
      .insert([
        {
          user_id: userId,
          user_name: userName,
          user_avatar: userAvatar,
          title: title,
          content: content,
          city: city,
          latitude: lat,
          longitude: lng,
          image_url: imageUrl,
          likes: 0,
          comments: 0,
        },
      ])
      .select()

    if (error) {
      console.error("Supabase error:", error)
      return Response.json({ success: false, error: error.message }, { status: 500 })
    }

    return Response.json({ success: true, post: data?.[0] })
  } catch (error) {
    console.error("Create post error:", error)
    return Response.json({ error: "Failed to create post" }, { status: 500 })
  }
}
