"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Database, Wifi, WifiOff } from "lucide-react"

export default function DebugInfo() {
  const [dbStatus, setDbStatus] = useState<"checking" | "connected" | "disconnected">("checking")
  const [envVars, setEnvVars] = useState({
    supabaseUrl: false,
    supabaseAnonKey: false,
    clerkKey: false,
  })

  useEffect(() => {
    // Check environment variables
    setEnvVars({
      supabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      supabaseAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      clerkKey: !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    })

    // Test database connection
    testDbConnection()
  }, [])

  const testDbConnection = async () => {
    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ city: "Test", showAll: true, userId: "test" }),
      })

      if (response.ok) {
        setDbStatus("connected")
      } else {
        setDbStatus("disconnected")
      }
    } catch (error) {
      setDbStatus("disconnected")
    }
  }

  return (
    <Card className="mb-4 border-dashed">
      <CardHeader>
        <CardTitle className="flex items-center text-sm">
          <Database className="h-4 w-4 mr-2" />
          System Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm">Database</span>
          <div className="flex items-center">
            {dbStatus === "checking" && <Badge variant="secondary">Checking...</Badge>}
            {dbStatus === "connected" && (
              <Badge className="bg-green-100 text-green-700">
                <Wifi className="h-3 w-3 mr-1" />
                Connected
              </Badge>
            )}
            {dbStatus === "disconnected" && (
              <Badge variant="destructive">
                <WifiOff className="h-3 w-3 mr-1" />
                Mock Data
              </Badge>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm">Supabase URL</span>
          <Badge variant={envVars.supabaseUrl ? "default" : "secondary"}>
            {envVars.supabaseUrl ? "Set" : "Missing"}
          </Badge>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm">Supabase Key</span>
          <Badge variant={envVars.supabaseAnonKey ? "default" : "secondary"}>
            {envVars.supabaseAnonKey ? "Set" : "Missing"}
          </Badge>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm">Clerk Auth</span>
          <Badge variant={envVars.clerkKey ? "default" : "secondary"}>{envVars.clerkKey ? "Set" : "Missing"}</Badge>
        </div>
      </CardContent>
    </Card>
  )
}
