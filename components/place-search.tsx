"use client"

import type React from "react"
import { useState } from "react"
import { Search, MapPin, Cloud, Camera, Utensils, Hotel, Car, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface PlaceSearchProps {
  currentLocation: { lat: number; lng: number; name: string } | null
}

interface PlaceInfo {
  name: string
  description: string
  culture: string
  history: string
  notablePlaces: string[]
  distance: string
  transport: string[]
  weather: {
    temperature: string
    condition: string
    humidity: string
  }
  thingsToDo: string[]
  food: string[]
  hotels: string[]
  photos: string[]
}

export default function PlaceSearch({ currentLocation }: PlaceSearchProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<PlaceInfo | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/search-place", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: searchQuery,
          currentLocation: currentLocation,
        }),
      })

      if (!response.ok) {
        throw new Error(`Search failed: ${response.status}`)
      }

      const data = await response.json()
      setSearchResults(data)
    } catch (error) {
      console.error("Search error:", error)
      setError("Failed to search. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Explore Destinations 🗺️</h2>
        <p className="text-gray-600">Search for any place and get AI-powered travel insights</p>
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="p-6">
          <div className="flex space-x-4">
            <div className="flex-1">
              <Input
                placeholder="Search for a destination (e.g., Manali, Paris, Tokyo)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="text-lg"
              />
            </div>
            <Button
              onClick={handleSearch}
              disabled={loading || !searchQuery.trim()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Search className="h-4 w-4" />
              )}
            </Button>
          </div>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </CardContent>
      </Card>

      {/* Search Results */}
      {searchResults && (
        <div className="space-y-6">
          {/* Header Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <MapPin className="h-6 w-6 mr-2 text-blue-600" />
                {searchResults.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">{searchResults.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center">
                  <Car className="h-4 w-4 mr-2 text-green-600" />
                  <span className="text-sm">{searchResults.distance}</span>
                </div>
                <div className="flex items-center">
                  <Cloud className="h-4 w-4 mr-2 text-blue-600" />
                  <span className="text-sm">
                    {searchResults.weather?.temperature} • {searchResults.weather?.condition}
                  </span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-orange-600" />
                  <span className="text-sm">Best time to visit</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {searchResults.transport?.map((mode, index) => (
                  <Badge key={index} variant="secondary">
                    {mode}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Detailed Information Tabs */}
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="culture">Culture</TabsTrigger>
              <TabsTrigger value="places">Places</TabsTrigger>
              <TabsTrigger value="activities">Activities</TabsTrigger>
              <TabsTrigger value="food">Food</TabsTrigger>
              <TabsTrigger value="stay">Stay</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>History & Background</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{searchResults.history}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Cloud className="h-5 w-5 mr-2" />
                    Current Weather
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Temperature</p>
                      <p className="text-lg font-semibold">{searchResults.weather?.temperature}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Condition</p>
                      <p className="text-lg font-semibold">{searchResults.weather?.condition}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Humidity</p>
                      <p className="text-lg font-semibold">{searchResults.weather?.humidity}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="culture">
              <Card>
                <CardHeader>
                  <CardTitle>Culture & Traditions</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{searchResults.culture}</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="places">
              <Card>
                <CardHeader>
                  <CardTitle>Notable Places to Visit</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {searchResults.notablePlaces?.map((place, index) => (
                      <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <MapPin className="h-4 w-4 mr-2 text-blue-600" />
                        <span>{place}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activities">
              <Card>
                <CardHeader>
                  <CardTitle>Things to Do</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {searchResults.thingsToDo?.map((activity, index) => (
                      <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <Camera className="h-4 w-4 mr-2 text-green-600" />
                        <span>{activity}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="food">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Utensils className="h-5 w-5 mr-2" />
                    Food & Cuisine
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {searchResults.food?.map((dish, index) => (
                      <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <Utensils className="h-4 w-4 mr-2 text-orange-600" />
                        <span>{dish}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="stay">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Hotel className="h-5 w-5 mr-2" />
                    Hotels & Accommodation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {searchResults.hotels?.map((hotel, index) => (
                      <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <Hotel className="h-4 w-4 mr-2 text-purple-600" />
                        <span>{hotel}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}

      {/* Sample searches for empty state */}
      {!searchResults && !loading && (
        <Card>
          <CardHeader>
            <CardTitle>Popular Destinations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {["Manali", "Goa", "Kerala", "Rajasthan", "Paris", "Tokyo", "Bali", "Thailand"].map((place) => (
                <Button
                  key={place}
                  variant="outline"
                  onClick={() => {
                    setSearchQuery(place)
                    setTimeout(handleSearch, 100)
                  }}
                  className="justify-start"
                >
                  {place}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
