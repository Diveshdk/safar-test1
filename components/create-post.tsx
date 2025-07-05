"use client"

import { useState } from "react"
import { X, MapPin, Camera, Upload } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface CreatePostProps {
  currentLocation: { lat: number; lng: number; name: string; city: string } | null
  userId: string
  userName: string
  userAvatar: string
  onClose: () => void
  onPostCreated: () => void
}

export default function CreatePost({ 
  currentLocation, 
  userId, 
  userName, 
  userAvatar, 
  onClose, 
  onPostCreated 
}: CreatePostProps) {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !content.trim() || !currentLocation) return

    setLoading(true)
    try {
      const response = await fetch("/api/posts/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
          city: currentLocation.city,
          lat: currentLocation.lat,
          lng: currentLocation.lng,
          userId: userId,
          userName: userName,
          userAvatar: userAvatar,
          imageUrl: imageUrl.trim() || null,
        }),
      })

      const data = await response.json()
      if (data.success) {
        onPostCreated()
      }
    } catch (error) {
      console.error("Error creating post:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Camera className="h-5 w-5 mr-2" />
              Share Your Experience
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20">
              <X className="h-4 w-4" />
            </Button>
          </div>
          {currentLocation && (
            <div className="flex items-center text-sm text-blue-100">
              <MapPin className="h-4 w-4 mr-1" />
              {currentLocation.city}
            </div>
          )}
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                placeholder="Give your post a catchy title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                maxLength={100}
                className="text-lg font-medium"
              />
              <p className="text-xs text-gray-500 mt-1">{title.length}/100</p>
            </div>

            <div>
              <Textarea
                placeholder="Share your travel experience, tips, or recommendations..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={4}
                required
                maxLength={1000}
                className="resize-none"
              />
              <p className="text-xs text-gray-500 mt-1">{content.length}/1000</p>
            </div>

            <div>
              <Input
                placeholder="Add image URL (optional)"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                type="url"
              />
              <p className="text-xs text-gray-500 mt-1">
                <Upload className="h-3 w-3 inline mr-1" />
                Paste an image URL to add a photo
              </p>
            </div>

            {imageUrl && (
              <div className="rounded-lg overflow-hidden border">
                <img 
                  src={imageUrl || "/placeholder.svg"} 
                  alt="Preview" 
                  className="w-full h-32 object-cover"
                  onError={() => setImageUrl("")}
                />
              </div>
            )}

            <div className="flex space-x-3 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose} 
                className="flex-1"
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading || !title.trim() || !content.trim()}
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Posting...
                  </>
                ) : (
                  "Share Post"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
