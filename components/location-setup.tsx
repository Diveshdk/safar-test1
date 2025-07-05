"use client"

import { useState } from "react"
import { LocateFixed, Search, Sparkles, Globe, Star } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

interface Props {
  onLocationSet: (location: { lat: number; lng: number; name: string; city: string }) => void
  onClose: () => void
}

// Popular cities with coordinates (like BookMyShow)
const POPULAR_CITIES = [
  { name: "Mumbai", lat: 19.076, lng: 72.8777, emoji: "🏙️", desc: "Financial Capital" },
  { name: "Delhi", lat: 28.6139, lng: 77.209, emoji: "🏛️", desc: "Capital City" },
  { name: "Bangalore", lat: 12.9716, lng: 77.5946, emoji: "💻", desc: "Silicon Valley" },
  { name: "Hyderabad", lat: 17.385, lng: 78.4867, emoji: "💎", desc: "City of Pearls" },
  { name: "Chennai", lat: 13.0827, lng: 80.2707, emoji: "🏖️", desc: "Detroit of India" },
  { name: "Kolkata", lat: 22.5726, lng: 88.3639, emoji: "🎭", desc: "Cultural Capital" },
  { name: "Pune", lat: 18.5204, lng: 73.8567, emoji: "🎓", desc: "Oxford of East" },
  { name: "Ahmedabad", lat: 23.0225, lng: 72.5714, emoji: "🏭", desc: "Manchester of India" },
  { name: "Jaipur", lat: 26.9124, lng: 75.7873, emoji: "👑", desc: "Pink City" },
  { name: "Surat", lat: 21.1702, lng: 72.8311, emoji: "💍", desc: "Diamond City" },
  { name: "Lucknow", lat: 26.8467, lng: 80.9462, emoji: "🕌", desc: "City of Nawabs" },
  { name: "Kanpur", lat: 26.4499, lng: 80.3319, emoji: "🏭", desc: "Leather City" },
  { name: "Nagpur", lat: 21.1458, lng: 79.0882, emoji: "🍊", desc: "Orange City" },
  { name: "Indore", lat: 22.7196, lng: 75.8577, emoji: "🍽️", desc: "Food Capital" },
  { name: "Thane", lat: 19.2183, lng: 72.9781, emoji: "🌊", desc: "City of Lakes" },
  { name: "Bhopal", lat: 23.2599, lng: 77.4126, emoji: "🏞️", desc: "City of Lakes" },
  { name: "Visakhapatnam", lat: 17.6868, lng: 83.2185, emoji: "⚓", desc: "Jewel of East Coast" },
  { name: "Pimpri-Chinchwad", lat: 18.6298, lng: 73.7997, emoji: "🏭", desc: "Industrial Hub" },
  { name: "Patna", lat: 25.5941, lng: 85.1376, emoji: "📚", desc: "Ancient Capital" },
  { name: "Vadodara", lat: 22.3072, lng: 73.1812, emoji: "🎨", desc: "Cultural City" },
  { name: "Ghaziabad", lat: 28.6692, lng: 77.4538, emoji: "🏘️", desc: "Gateway of UP" },
  { name: "Ludhiana", lat: 30.901, lng: 75.8573, emoji: "🌾", desc: "Manchester of Punjab" },
  { name: "Agra", lat: 27.1767, lng: 78.0081, emoji: "🕌", desc: "City of Taj" },
  { name: "Nashik", lat: 19.9975, lng: 73.7898, emoji: "🍇", desc: "Wine Capital" },
  { name: "Faridabad", lat: 28.4089, lng: 77.3178, emoji: "🏭", desc: "Industrial City" },
  { name: "Meerut", lat: 28.9845, lng: 77.7064, emoji: "⚔️", desc: "Sports City" },
  { name: "Rajkot", lat: 22.3039, lng: 70.8022, emoji: "🏏", desc: "Cricket Hub" },
  { name: "Kalyan-Dombivli", lat: 19.2403, lng: 73.1305, emoji: "🚂", desc: "Railway Junction" },
  { name: "Vasai-Virar", lat: 19.4912, lng: 72.8054, emoji: "🏖️", desc: "Coastal City" },
  { name: "Varanasi", lat: 25.3176, lng: 82.9739, emoji: "🕉️", desc: "Spiritual Capital" },
  { name: "Srinagar", lat: 34.0837, lng: 74.7973, emoji: "🏔️", desc: "Paradise on Earth" },
  { name: "Aurangabad", lat: 19.8762, lng: 75.3433, emoji: "🏛️", desc: "City of Gates" },
  { name: "Dhanbad", lat: 23.7957, lng: 86.4304, emoji: "⛏️", desc: "Coal Capital" },
  { name: "Amritsar", lat: 31.634, lng: 74.8723, emoji: "🏛️", desc: "Golden City" },
  { name: "Navi Mumbai", lat: 19.033, lng: 73.0297, emoji: "🌆", desc: "Planned City" },
  { name: "Allahabad", lat: 25.4358, lng: 81.8463, emoji: "🌊", desc: "Sangam City" },
  { name: "Ranchi", lat: 23.3441, lng: 85.3096, emoji: "🏞️", desc: "City of Waterfalls" },
  { name: "Howrah", lat: 22.5958, lng: 88.2636, emoji: "🌉", desc: "Bridge City" },
  { name: "Coimbatore", lat: 11.0168, lng: 76.9558, emoji: "🏭", desc: "Textile Hub" },
  { name: "Jabalpur", lat: 23.1815, lng: 79.9864, emoji: "🏞️", desc: "Marble City" },
  { name: "Gwalior", lat: 26.2183, lng: 78.1828, emoji: "🏰", desc: "City of Palaces" },
  { name: "Vijayawada", lat: 16.5062, lng: 80.648, emoji: "🌊", desc: "Business Capital" },
  { name: "Jodhpur", lat: 26.2389, lng: 73.0243, emoji: "💙", desc: "Blue City" },
  { name: "Madurai", lat: 9.9252, lng: 78.1198, emoji: "🏛️", desc: "Temple City" },
  { name: "Raipur", lat: 21.2514, lng: 81.6296, emoji: "🌾", desc: "Rice Bowl" },
  { name: "Kota", lat: 25.2138, lng: 75.8648, emoji: "📚", desc: "Education Hub" },
  { name: "Guwahati", lat: 26.1445, lng: 91.7362, emoji: "🌿", desc: "Gateway to Northeast" },
  { name: "Chandigarh", lat: 30.7333, lng: 76.7794, emoji: "🌹", desc: "City Beautiful" },
  { name: "Solapur", lat: 17.6599, lng: 75.9064, emoji: "🌾", desc: "Cotton City" },
  { name: "Hubli-Dharwad", lat: 15.3647, lng: 75.124, emoji: "🏭", desc: "Commercial Hub" },
  { name: "Bareilly", lat: 28.367, lng: 79.4304, emoji: "🌾", desc: "Furniture Hub" },
  { name: "Moradabad", lat: 28.8386, lng: 78.7733, emoji: "🥄", desc: "Brass City" },
  { name: "Mysore", lat: 12.2958, lng: 76.6394, emoji: "🏰", desc: "Palace City" },
  { name: "Gurgaon", lat: 28.4595, lng: 77.0266, emoji: "🏢", desc: "Millennium City" },
  { name: "Aligarh", lat: 27.8974, lng: 78.088, emoji: "🔒", desc: "Lock City" },
  { name: "Jalandhar", lat: 31.326, lng: 75.5762, emoji: "⚽", desc: "Sports Hub" },
  { name: "Tiruchirappalli", lat: 10.7905, lng: 78.7047, emoji: "🏛️", desc: "Rock Fort City" },
  { name: "Bhubaneswar", lat: 20.2961, lng: 85.8245, emoji: "🏛️", desc: "Temple City" },
  { name: "Salem", lat: 11.6643, lng: 78.146, emoji: "🌿", desc: "Steel City" },
  { name: "Mira-Bhayandar", lat: 19.2952, lng: 72.8544, emoji: "🏘️", desc: "Twin City" },
  { name: "Warangal", lat: 17.9689, lng: 79.5941, emoji: "🏰", desc: "Orugallu" },
  { name: "Thiruvananthapuram", lat: 8.5241, lng: 76.9366, emoji: "🌴", desc: "Evergreen City" },
  { name: "Guntur", lat: 16.3067, lng: 80.4365, emoji: "🌶️", desc: "Chilli Capital" },
  { name: "Bhiwandi", lat: 19.3002, lng: 73.0635, emoji: "🧵", desc: "Textile City" },
  { name: "Saharanpur", lat: 29.968, lng: 77.5552, emoji: "🪵", desc: "Wood Carving Hub" },
  { name: "Gorakhpur", lat: 26.7606, lng: 83.3732, emoji: "🚂", desc: "Railway Junction" },
  { name: "Bikaner", lat: 28.0229, lng: 73.3119, emoji: "🐪", desc: "Camel City" },
  { name: "Amravati", lat: 20.9374, lng: 77.7796, emoji: "🍊", desc: "Cotton City" },
  { name: "Noida", lat: 28.5355, lng: 77.391, emoji: "💻", desc: "Planned City" },
  { name: "Jamshedpur", lat: 22.8046, lng: 86.2029, emoji: "⚙️", desc: "Steel City" },
  { name: "Bhilai", lat: 21.1938, lng: 81.3509, emoji: "⚙️", desc: "Steel Hub" },
  { name: "Cuttack", lat: 20.4625, lng: 85.8828, emoji: "⚔️", desc: "Silver City" },
  { name: "Firozabad", lat: 27.1592, lng: 78.3957, emoji: "🔮", desc: "Glass City" },
  { name: "Kochi", lat: 9.9312, lng: 76.2673, emoji: "⚓", desc: "Queen of Arabian Sea" },
  { name: "Nellore", lat: 14.4426, lng: 79.9865, emoji: "🌾", desc: "Rice Bowl" },
  { name: "Bhavnagar", lat: 21.7645, lng: 72.1519, emoji: "⚓", desc: "Cultural City" },
  { name: "Dehradun", lat: 30.3165, lng: 78.0322, emoji: "🏔️", desc: "Doon Valley" },
  { name: "Durgapur", lat: 23.5204, lng: 87.3119, emoji: "⚙️", desc: "Steel Hub" },
  { name: "Asansol", lat: 23.6739, lng: 86.9524, emoji: "⛏️", desc: "Coal Hub" },
  { name: "Rourkela", lat: 22.2604, lng: 84.8536, emoji: "⚙️", desc: "Steel City" },
  { name: "Nanded", lat: 19.1383, lng: 77.321, emoji: "🏛️", desc: "Sikh Pilgrimage" },
  { name: "Kolhapur", lat: 16.705, lng: 74.2433, emoji: "👑", desc: "City of Palaces" },
  { name: "Ajmer", lat: 26.4499, lng: 74.6399, emoji: "🕌", desc: "Sufi City" },
  { name: "Akola", lat: 20.7002, lng: 77.0082, emoji: "🌾", desc: "Cotton City" },
  { name: "Gulbarga", lat: 17.3297, lng: 76.8343, emoji: "🏛️", desc: "Sufi City" },
  { name: "Jamnagar", lat: 22.4707, lng: 70.0577, emoji: "⚓", desc: "Brass City" },
  { name: "Ujjain", lat: 23.1765, lng: 75.7885, emoji: "🕉️", desc: "Temple City" },
  { name: "Loni", lat: 28.7333, lng: 77.2833, emoji: "🏘️", desc: "Industrial Town" },
  { name: "Siliguri", lat: 26.7271, lng: 88.3953, emoji: "🌿", desc: "Gateway to Northeast" },
  { name: "Jhansi", lat: 25.4484, lng: 78.5685, emoji: "⚔️", desc: "Gateway to Bundelkhand" },
  { name: "Ulhasnagar", lat: 19.2215, lng: 73.1645, emoji: "🏭", desc: "Industrial City" },
  { name: "Jammu", lat: 32.7266, lng: 74.857, emoji: "🏔️", desc: "City of Temples" },
  { name: "Sangli-Miraj & Kupwad", lat: 16.8524, lng: 74.5815, emoji: "🍇", desc: "Turmeric City" },
  { name: "Mangalore", lat: 12.9141, lng: 74.856, emoji: "🏖️", desc: "Rome of the East" },
  { name: "Erode", lat: 11.341, lng: 77.7172, emoji: "🧵", desc: "Textile Hub" },
  { name: "Belgaum", lat: 15.8497, lng: 74.4977, emoji: "🌿", desc: "Sugar Bowl" },
  { name: "Ambattur", lat: 13.1143, lng: 80.1548, emoji: "🏭", desc: "Industrial Hub" },
  { name: "Tirunelveli", lat: 8.7139, lng: 77.7567, emoji: "🌾", desc: "Rice Bowl" },
  { name: "Malegaon", lat: 20.5579, lng: 74.5287, emoji: "🧵", desc: "Manchester of Maharashtra" },
  { name: "Gaya", lat: 24.7914, lng: 85.0002, emoji: "🕉️", desc: "Holy City" },
  { name: "Jalgaon", lat: 21.0077, lng: 75.5626, emoji: "🍌", desc: "Banana City" },
  { name: "Udaipur", lat: 24.5854, lng: 73.7125, emoji: "🏰", desc: "City of Lakes" },
  { name: "Maheshtala", lat: 22.5049, lng: 88.2482, emoji: "🏘️", desc: "Suburban City" },
]

export default function LocationSetup({ onLocationSet, onClose }: Props) {
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<"popular" | "all">("popular")

  // Filter cities based on search
  const filteredCities = POPULAR_CITIES.filter(
    (city) =>
      city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      city.desc.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Get popular cities (top 12)
  const popularCities = POPULAR_CITIES.slice(0, 12)
  const displayCities = selectedCategory === "popular" ? popularCities : filteredCities

  const detectLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported in this browser")
      return
    }

    setLoading(true)
    setError(null)

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          // Use a simple reverse geocoding approach
          const response = await fetch(`/api/geocode?lat=${coords.latitude}&lng=${coords.longitude}`)
          const data = await response.json()

          onLocationSet({
            lat: coords.latitude,
            lng: coords.longitude,
            name: data.name || "Current Location",
            city: data.name || "Current Location",
          })
        } catch (err) {
          // Fallback to coordinates if geocoding fails
          onLocationSet({
            lat: coords.latitude,
            lng: coords.longitude,
            name: "Current Location",
            city: "Current Location",
          })
        } finally {
          setLoading(false)
        }
      },
      (err) => {
        setLoading(false)
        setError("Unable to retrieve your location. Please select a city manually.")
        console.error("Geolocation error:", err)
      },
      {
        timeout: 10000,
        enableHighAccuracy: false,
        maximumAge: 300000, // 5 minutes
      },
    )
  }

  const selectCity = (city: (typeof POPULAR_CITIES)[0]) => {
    onLocationSet({
      lat: city.lat,
      lng: city.lng,
      name: city.name,
      city: city.name,
    })
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 text-white">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center text-2xl">
              <Globe className="h-6 w-6 mr-3" />
              Choose Your City
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20">
              ✕
            </Button>
          </div>
          <p className="text-blue-100 mt-2">
            Select your city to discover local experiences and connect with travelers
          </p>
        </CardHeader>

        <CardContent className="p-6 overflow-y-auto max-h-[70vh]">
          {/* Auto Detect Location */}
          <div className="mb-6">
            <Button
              className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white py-4 text-lg rounded-xl shadow-lg"
              onClick={detectLocation}
              disabled={loading}
            >
              <LocateFixed className="h-5 w-5 mr-3" />
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Detecting your location...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Auto-Detect My Location
                </>
              )}
            </Button>
            {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Search for your city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 py-3 text-lg rounded-xl border-2 border-gray-200 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex space-x-2 mb-6">
            <Button
              variant={selectedCategory === "popular" ? "default" : "outline"}
              onClick={() => setSelectedCategory("popular")}
              className="rounded-full"
            >
              <Star className="h-4 w-4 mr-2" />
              Popular Cities
            </Button>
            <Button
              variant={selectedCategory === "all" ? "default" : "outline"}
              onClick={() => setSelectedCategory("all")}
              className="rounded-full"
            >
              <Globe className="h-4 w-4 mr-2" />
              All Cities ({POPULAR_CITIES.length})
            </Button>
          </div>

          {/* Cities Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayCities.map((city) => (
              <Card
                key={city.name}
                className="hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer border-2 hover:border-blue-300 group"
                onClick={() => selectCity(city)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="text-3xl group-hover:scale-110 transition-transform">{city.emoji}</div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600">{city.name}</h3>
                      <p className="text-sm text-gray-600">{city.desc}</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="mt-2 text-xs">
                    Popular destination
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>

          {displayCities.length === 0 && searchQuery && (
            <div className="text-center py-12">
              <Search className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No cities found</h3>
              <p className="text-gray-500">Try searching with a different term</p>
            </div>
          )}

          {/* Fun Stats */}
          <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">{POPULAR_CITIES.length}+</div>
                <div className="text-sm text-gray-600">Cities Available</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">10K+</div>
                <div className="text-sm text-gray-600">Active Travelers</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-pink-600">50K+</div>
                <div className="text-sm text-gray-600">Travel Stories</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
