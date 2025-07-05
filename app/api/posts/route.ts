import { supabaseAdmin } from "@/lib/supabase"

export async function POST(request: Request) {
  try {
    const { city, showAll, userId } = await request.json()

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      // Mock posts data if Supabase is not configured
      const mockPosts = [
        {
          id: "post-1",
          user_id: "user_123",
          user_name: "Adventure Seeker",
          user_avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
          title: `Hidden Gems in ${city || "the City"}`,
          content:
            "Just discovered this amazing viewpoint that's not on any tourist map! The sunrise here is absolutely breathtaking.",
          city: city || "Current City",
          image_url: "/placeholder.svg?height=400&width=600",
          likes: 24,
          comments: 5,
          created_at: new Date(Date.now() - 86400000).toISOString(),
          liked_by_user: false,
        },
        {
          id: "post-2",
          user_id: "user_456",
          user_name: "Foodie Explorer",
          user_avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
          title: `Best Local Restaurant in ${city || "the Area"}`,
          content:
            "Found this incredible family-run restaurant serving authentic local cuisine. Must try their signature dish!",
          city: city || "Current City",
          image_url: "/placeholder.svg?height=400&width=600",
          likes: 31,
          comments: 8,
          created_at: new Date(Date.now() - 172800000).toISOString(),
          liked_by_user: true,
        },
      ]
      return Response.json({ posts: mockPosts })
    }

    // Build query for Supabase
    let query = supabaseAdmin
      .from("user_posts")
      .select(`
        id,
        user_id,
        user_name,
        user_avatar,
        title,
        content,
        city,
        image_url,
        likes,
        comments,
        created_at
      `)
      .order("likes", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(20)

    if (!showAll && city) {
      query = query.eq("city", city)
    }

    const { data: posts, error } = await query

    if (error) {
      console.error("Supabase error:", error)
      return Response.json({ posts: [] })
    }

    // Check which posts are liked by the current user
    let likedPosts: string[] = []
    if (userId && posts?.length) {
      const { data: likes } = await supabaseAdmin
        .from("post_likes")
        .select("post_id")
        .eq("user_id", userId)
        .in(
          "post_id",
          posts.map((p) => p.id),
        )

      likedPosts = likes?.map((l) => l.post_id) || []
    }

    // Format posts with like status
    const formattedPosts =
      posts?.map((post) => ({
        ...post,
        liked_by_user: likedPosts.includes(post.id),
      })) || []

    return Response.json({ posts: formattedPosts })
  } catch (error) {
    console.error("Posts error:", error)
    return Response.json({ posts: [] })
  }
}
