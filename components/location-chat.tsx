"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Send, Users, MapPin, Wifi, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

interface LocationChatProps {
  currentLocation: { lat: number; lng: number; name: string; city: string } | null
  userId: string
  userName: string
  userAvatar: string
}

interface ChatMessage {
  id: string
  user_id: string
  user_name: string
  user_avatar?: string
  message: string
  city: string
  created_at: string
}

export default function LocationChat({ currentLocation, userId, userName, userAvatar }: LocationChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [onlineUsers, setOnlineUsers] = useState(0)
  const [loading, setLoading] = useState(false)
  const [connected, setConnected] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const wsRef = useRef<WebSocket | null>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (currentLocation) {
      connectWebSocket()
      loadMessages()
    }

    return () => {
      if (wsRef.current) {
        wsRef.current.close()
      }
    }
  }, [currentLocation])

  const connectWebSocket = () => {
    if (!currentLocation) return

    // Simulate WebSocket connection
    setConnected(true)
    setOnlineUsers(Math.floor(Math.random() * 15) + 3)

    // Simulate real-time updates every 10 seconds
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        loadMessages()
      }
    }, 10000)

    return () => clearInterval(interval)
  }

  const loadMessages = async () => {
    if (!currentLocation) return

    try {
      const response = await fetch("/api/chat/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          city: currentLocation.city,
          lat: currentLocation.lat,
          lng: currentLocation.lng,
        }),
      })

      const data = await response.json()
      setMessages(data.messages || [])
    } catch (error) {
      console.error("Error loading messages:", error)
      // Set empty array on error
      setMessages([])
    }
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || !currentLocation) return

    setLoading(true)
    try {
      const response = await fetch("/api/chat/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: newMessage,
          city: currentLocation.city,
          lat: currentLocation.lat,
          lng: currentLocation.lng,
          userId: userId,
          userName: userName,
          userAvatar: userAvatar,
        }),
      })

      const data = await response.json()
      if (data.success) {
        setNewMessage("")
        loadMessages()
      }
    } catch (error) {
      console.error("Error sending message:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  if (!currentLocation) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <MapPin className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600">Set your location to join local chat</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Local Chat 💬</h2>
        <p className="text-gray-600">Connect with travelers in {currentLocation.city}</p>
      </div>

      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-green-500 to-blue-600 text-white">
          <CardTitle className="flex items-center justify-between text-lg">
            <div className="flex items-center">
              <MapPin className="h-5 w-5 mr-2" />
              {currentLocation.city}
            </div>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center">
                <Wifi className={`h-4 w-4 mr-1 ${connected ? "text-green-200" : "text-red-200"}`} />
                {connected ? "Live" : "Offline"}
              </div>
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                {onlineUsers}
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {/* Messages Area */}
          <div className="h-80 sm:h-96 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 mt-8">
                <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium mb-2">No messages yet</p>
                <p className="text-sm">Be the first to start a conversation in {currentLocation.city}!</p>
              </div>
            ) : (
              messages.map((message) => (
                <div key={message.id} className="flex space-x-3">
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarImage src={message.user_avatar || "/placeholder.svg"} />
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs">
                      {message.user_name?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-sm truncate">{message.user_name}</span>
                      <span className="text-xs text-gray-500 flex-shrink-0">
                        {new Date(message.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                      {message.user_id === userId && (
                        <Badge variant="secondary" className="text-xs">
                          You
                        </Badge>
                      )}
                    </div>
                    <div className="bg-white p-3 rounded-lg shadow-sm border">
                      <p className="text-gray-700 text-sm break-words">{message.message}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="p-4 border-t bg-white">
            <div className="flex space-x-2">
              <Input
                placeholder={`Message travelers in ${currentLocation.city}...`}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
                maxLength={500}
              />
              <Button
                onClick={sendMessage}
                disabled={loading || !newMessage.trim()}
                className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 px-4"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2">Only travelers in {currentLocation.city} can see this chat</p>
          </div>
        </CardContent>
      </Card>

      {/* Chat Guidelines */}
      <Card>
        <CardContent className="p-4">
          <h4 className="font-medium mb-2 text-sm">💡 Chat Guidelines</h4>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>• Share local tips and recommendations</li>
            <li>• Ask questions about {currentLocation.city}</li>
            <li>• Be respectful and helpful</li>
            <li>• No spam or inappropriate content</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
