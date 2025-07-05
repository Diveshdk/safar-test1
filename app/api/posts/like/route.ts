import { supabaseAdmin } from "@/lib/supabase"

export async function POST(request: Request) {
  try {
    const { postId, userId } = await request.json()

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      // Mock response if Supabase is not configured
      await new Promise((resolve) => setTimeout(resolve, 200))
      return Response.json({ success: true })
    }

    // Check if user already liked this post
    const { data: existingLike } = await supabaseAdmin
      .from("post_likes")
      .select("id")
      .eq("post_id", postId)
      .eq("user_id", userId)
      .single()

    if (existingLike) {
      // Unlike the post
      await supabaseAdmin.from("post_likes").delete().eq("post_id", postId).eq("user_id", userId)

      // Decrease like count
      const { data: currentPost } = await supabaseAdmin.from("user_posts").select("likes").eq("id", postId).single()

      if (currentPost) {
        await supabaseAdmin
          .from("user_posts")
          .update({ likes: Math.max(0, currentPost.likes - 1) })
          .eq("id", postId)
      }
    } else {
      // Like the post
      await supabaseAdmin.from("post_likes").insert([{ post_id: postId, user_id: userId }])

      // Increase like count
      const { data: currentPost } = await supabaseAdmin.from("user_posts").select("likes").eq("id", postId).single()

      if (currentPost) {
        await supabaseAdmin
          .from("user_posts")
          .update({ likes: currentPost.likes + 1 })
          .eq("id", postId)
      }
    }

    return Response.json({ success: true })
  } catch (error) {
    console.error("Like post error:", error)
    return Response.json({ error: "Failed to like post" }, { status: 500 })
  }
}
