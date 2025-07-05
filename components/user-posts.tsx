"use client"

import { useState, useEffect } from "react"
import { Heart, MessageCircle, MapPin, Clock, Camera } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

interface UserPostsProps {
  currentLocation: { lat: number; lng: number; name: string; city: string } | null
  userId: string
  showAll?: boolean
}

interface Post {
  id: string
  user_id: string
  user_name: string
  user_avatar?: string
  title: string
  content: string
  city: string
  image_url?: string
  likes: number
  comments: number
  created_at: string
  liked_by_user: boolean
}

export default function UserPosts({ currentLocation, userId, showAll = false }: UserPostsProps) {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadPosts()
  }, [currentLocation, showAll])

  const loadPosts = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          city: currentLocation?.city,
          showAll: showAll,
          userId: userId,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setPosts(data.posts || [])
    } catch (error) {
      console.error("Error loading posts:", error)
      setError("Failed to load posts. Please try again.")
      setPosts([])
    } finally {
      setLoading(false)
    }
  }

  const handleLike = async (postId: string) => {
    try {
      const response = await fetch("/api/posts/like", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ postId, userId }),
      })

      if (response.ok) {
        setPosts(
          posts.map((post) =>
            post.id === postId
              ? {
                  ...post,
                  likes: post.liked_by_user ? post.likes - 1 : post.likes + 1,
                  liked_by_user: !post.liked_by_user,
                }
              : post,
          ),
        )
      }
    } catch (error) {
      console.error("Error liking post:", error)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading posts...</p>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Camera className="h-12 w-12 mx-auto text-red-400 mb-4" />
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={loadPosts} variant="outline">
            Try Again
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
          {showAll ? "All Posts" : `Posts from ${currentLocation?.city || "your area"}`} 📝
        </h3>
        {currentLocation && !showAll && (
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="h-4 w-4 mr-1" />
            {currentLocation.city}
          </div>
        )}
      </div>

      {posts.length === 0 ? (
        <Card className="border-dashed border-2">
          <CardContent className="p-8 text-center">
            <Camera className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 mb-2 font-medium">No posts yet</p>
            <p className="text-sm text-gray-500">
              {showAll
                ? "Be the first to share your travel experience!"
                : `Be the first to share something about ${currentLocation?.city}!`}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <Card key={post.id} className="hover:shadow-lg transition-all duration-200 overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10 ring-2 ring-blue-100">
                      <AvatarImage src={post.user_avatar || "/placeholder.svg"} />
                      <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                        {post.user_name?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{post.user_name}</p>
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="h-3 w-3 mr-1" />
                        {post.city}
                        <span className="mx-2">•</span>
                        <Clock className="h-3 w-3 mr-1" />
                        {new Date(post.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700">
                    Travel Story
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <h4 className="font-semibold text-lg mb-2">{post.title}</h4>
                <p className="text-gray-700 mb-4 leading-relaxed">{post.content}</p>

                {post.image_url && (
                  <div className="mb-4 rounded-lg overflow-hidden">
                    <img
                      src={post.image_url || "/placeholder.svg"}
                      alt="Post image"
                      className="w-full h-48 sm:h-64 object-cover hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                )}

                <div className="flex items-center justify-between pt-3 border-t">
                  <div className="flex items-center space-x-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleLike(post.id)}
                      className={`flex items-center space-x-1 hover:bg-red-50 ${
                        post.liked_by_user ? "text-red-600" : "text-gray-600"
                      }`}
                    >
                      <Heart className={`h-4 w-4 ${post.liked_by_user ? "fill-current" : ""}`} />
                      <span>{post.likes}</span>
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center space-x-1 text-gray-600 hover:bg-blue-50"
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span>{post.comments}</span>
                    </Button>
                  </div>

                  <div className="text-xs text-gray-500">
                    {new Date(post.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
