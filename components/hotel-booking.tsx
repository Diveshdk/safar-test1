"use client"

import { useEffect, useState } from "react"
import { Hotel, BedDouble, Loader2, CalendarDays, MapPin, Plus, Star } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface HotelInfo {
  id: string
  name: string
  price: number
  city: string
  description: string
  image_url?: string
  rating?: number
  owner_id?: string
  amenities?: string[]
  contact_phone?: string
  contact_email?: string
}

interface Props {
  currentLocation: { lat: number; lng: number; name: string; city: string } | null
  userId: string
}

// List of major Indian cities
const indianCities = [
  "Mumbai",
  "Delhi",
  "Bangalore",
  "Hyderabad",
  "Ahmedabad",
  "Chennai",
  "Kolkata",
  "Surat",
  "Pune",
  "Jaipur",
  "Lucknow",
  "Kanpur",
  "Nagpur",
  "Indore",
  "Thane",
  "Bhopal",
  "Visakhapatnam",
  "Pimpri-Chinchwad",
  "Patna",
  "Vadodara",
  "Ghaziabad",
  "Ludhiana",
  "Agra",
  "Nashik",
  "Faridabad",
  "Meerut",
  "Rajkot",
  "Kalyan-Dombivali",
  "Vasai-Virar",
  "Varanasi",
  "Srinagar",
  "Aurangabad",
  "Dhanbad",
  "Amritsar",
  "Navi Mumbai",
  "Allahabad",
  "Ranchi",
  "Howrah",
  "Coimbatore",
  "Jabalpur",
  "Gwalior",
  "Vijayawada",
  "Jodhpur",
  "Madurai",
  "Raipur",
  "Kota",
  "Guwahati",
  "Chandigarh",
  "Solapur",
  "Hubli-Dharwad",
  "Bareilly",
  "Moradabad",
  "Mysore",
  "Gurgaon",
  "Aligarh",
  "Jalandhar",
  "Tiruchirappalli",
  "Bhubaneswar",
  "Salem",
  "Mira-Bhayandar",
  "Warangal",
  "Guntur",
  "Bhiwandi",
  "Saharanpur",
  "Gorakhpur",
  "Bikaner",
  "Amravati",
  "Noida",
  "Jamshedpur",
  "Bhilai Nagar",
  "Cuttack",
  "Firozabad",
  "Kochi",
  "Bhavnagar",
  "Dehradun",
  "Durgapur",
  "Asansol",
  "Nanded-Waghala",
  "Kolhapur",
  "Ajmer",
  "Gulbarga",
  "Jamnagar",
  "Ujjain",
  "Loni",
  "Siliguri",
  "Jhansi",
  "Ulhasnagar",
  "Nellore",
  "Jammu",
  "Sangli-Miraj & Kupwad",
  "Belgaum",
  "Mangalore",
  "Ambattur",
  "Tirunelveli",
  "Malegaon",
  "Gaya",
  "Jalgaon",
  "Udaipur",
  "Maheshtala",
  "Davanagere",
  "Kozhikode",
  "Kurnool",
  "Rajpur Sonarpur",
  "Rajahmundry",
  "Bokaro Steel City",
  "South Dumdum",
  "Bellary",
  "Patiala",
  "Gopalpur",
  "Agartala",
  "Bhagalpur",
  "Muzaffarnagar",
  "Bhatpara",
  "Panihati",
  "Latur",
  "Dhule",
  "Rohtak",
  "Korba",
  "Bhilwara",
  "Berhampur",
  "Muzaffarpur",
  "Ahmednagar",
  "Mathura",
  "Kollam",
  "Avadi",
  "Kadapa",
  "Kamarhati",
  "Sambalpur",
  "Bilaspur",
  "Shahjahanpur",
  "Satara",
  "Bijapur",
  "Rampur",
  "Shivamogga",
  "Chandrapur",
  "Junagadh",
  "Thrissur",
  "Alwar",
  "Bardhaman",
  "Kulti",
  "Kakinada",
  "Nizamabad",
  "Parbhani",
  "Tumkur",
  "Khammam",
  "Ozhukarai",
  "Bihar Sharif",
  "Panipat",
  "Darbhanga",
  "Bally",
  "Aizawl",
  "Dewas",
  "Ichalkaranji",
  "Karnal",
  "Bathinda",
  "Jalna",
  "Eluru",
  "Kirari Suleman Nagar",
  "Barabanki",
  "Purnia",
  "Satna",
  "Mau",
  "Sonipat",
  "Farrukhabad",
  "Sagar",
  "Rourkela",
  "Durg",
  "Imphal",
  "Ratlam",
  "Hapur",
  "Arrah",
]

export default function HotelBooking({ currentLocation, userId }: Props) {
  const [hotels, setHotels] = useState<HotelInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    city: currentLocation?.city || "",
    description: "",
    amenities: "",
    contact_phone: "",
    contact_email: "",
    image_url: "",
  })

  useEffect(() => {
    loadHotels()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLocation?.city])

  const loadHotels = async () => {
    if (!currentLocation?.city) {
      setHotels([])
      setLoading(false)
      return
    }
    try {
      setLoading(true)
      const res = await fetch("/api/hotels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ city: currentLocation.city }),
      })
      const data = await res.json()
      setHotels(data.hotels ?? [])
    } catch {
      // fallback demo hotels with INR pricing
      setHotels([
        {
          id: "demo1",
          name: "Heritage Palace Hotel",
          price: 4500,
          city: currentLocation!.city,
          description: "Luxury heritage hotel • Royal architecture • Traditional hospitality • Spa & wellness center",
          image_url: "/placeholder.svg?height=240&width=400",
          rating: 4.8,
        },
        {
          id: "demo2",
          name: "Business Center Inn",
          price: 2800,
          city: currentLocation!.city,
          description: "Modern business hotel • Free WiFi • Conference rooms • 24/7 room service",
          image_url: "/placeholder.svg?height=240&width=400",
          rating: 4.5,
        },
        {
          id: "demo3",
          name: "Backpacker's Paradise",
          price: 1200,
          city: currentLocation!.city,
          description: "Budget-friendly hostel • Shared & private rooms • Common kitchen • Travel desk",
          image_url: "/placeholder.svg?height=240&width=400",
          rating: 4.2,
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const addHotel = async () => {
    if (!formData.name || !formData.price || !formData.city || !formData.description) {
      alert("Please fill in all required fields")
      return
    }

    const hotelData = {
      id: Date.now().toString(),
      name: formData.name,
      price: Number.parseInt(formData.price),
      city: formData.city,
      description: formData.description,
      image_url: formData.image_url || "/placeholder.svg?height=240&width=400",
      amenities: formData.amenities
        .split(",")
        .map((a) => a.trim())
        .filter(Boolean),
      contact_phone: formData.contact_phone,
      contact_email: formData.contact_email,
      owner_id: userId,
      rating: 4.0, // Default rating for new hotels
    }

    try {
      const response = await fetch("/api/hotels/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: hotelData.id,
          owner_id: userId,
          name: hotelData.name,
          description: hotelData.description,
          city: hotelData.city,
          price: hotelData.price,
          image_url: hotelData.image_url,
          amenities: hotelData.amenities,
          rating: hotelData.rating,
          contact_phone: hotelData.contact_phone,
          contact_email: hotelData.contact_email,
        }),
      })

      const result = await response.json()

      if (result.success) {
        setHotels((prev) => [...prev, hotelData])
        setShowAddDialog(false)
        resetForm()
        alert("Hotel listed successfully! It's now live and available for booking.")
      } else {
        console.error("Hotel creation failed:", result.error)
        alert(`Failed to add hotel: ${result.error}`)
      }
    } catch (error) {
      console.error("Add hotel error:", error)
      alert("Failed to add hotel. Please check your connection and try again.")
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      price: "",
      city: currentLocation?.city || "",
      description: "",
      amenities: "",
      contact_phone: "",
      contact_email: "",
      image_url: "",
    })
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(price)
  }

  if (!currentLocation) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <MapPin className="h-10 w-10 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600">Set location to view available hotels</p>
        </CardContent>
      </Card>
    )
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Loader2 className="h-6 w-6 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading hotels in {currentLocation.city}…</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex items-center justify-between">
          <div className="flex items-center">
            <Hotel className="h-5 w-5 mr-2 text-orange-500" />
            <CardTitle className="text-xl">Hotels in {currentLocation.city}</CardTitle>
          </div>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600">
                <Plus className="h-4 w-4 mr-2" />
                List Your Hotel
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>List Your Hotel</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Hotel Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., Grand Palace Hotel"
                    />
                  </div>
                  <div>
                    <Label htmlFor="price">Price per Night (₹) *</Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))}
                      placeholder="2500"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="city">City *</Label>
                  <Select
                    value={formData.city}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, city: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select city" />
                    </SelectTrigger>
                    <SelectContent>
                      {indianCities.map((city) => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe your hotel, facilities, and unique features..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="amenities">Amenities (comma-separated)</Label>
                  <Input
                    id="amenities"
                    value={formData.amenities}
                    onChange={(e) => setFormData((prev) => ({ ...prev, amenities: e.target.value }))}
                    placeholder="Free WiFi, Swimming Pool, Restaurant, Gym"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="contact_phone">Contact Phone</Label>
                    <Input
                      id="contact_phone"
                      value={formData.contact_phone}
                      onChange={(e) => setFormData((prev) => ({ ...prev, contact_phone: e.target.value }))}
                      placeholder="+91 98765 43210"
                    />
                  </div>
                  <div>
                    <Label htmlFor="contact_email">Contact Email</Label>
                    <Input
                      id="contact_email"
                      type="email"
                      value={formData.contact_email}
                      onChange={(e) => setFormData((prev) => ({ ...prev, contact_email: e.target.value }))}
                      placeholder="hotel@example.com"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="image_url">Hotel Image URL</Label>
                  <Input
                    id="image_url"
                    value={formData.image_url}
                    onChange={(e) => setFormData((prev) => ({ ...prev, image_url: e.target.value }))}
                    placeholder="https://example.com/hotel-image.jpg"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Upload your hotel image to a service like Imgur or use a direct image URL
                  </p>
                </div>

                <div className="flex space-x-2">
                  <Button onClick={addHotel} className="flex-1">
                    List Hotel
                  </Button>
                  <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
      </Card>

      {hotels.map((h) => (
        <Card key={h.id} className="overflow-hidden hover:shadow-lg transition-shadow">
          {h.image_url && (
            <img src={h.image_url || "/placeholder.svg"} alt={h.name} className="w-full h-40 object-cover" />
          )}
          <CardHeader className="flex items-center justify-between pb-2">
            <div className="flex items-center space-x-2">
              <BedDouble className="h-4 w-4 text-orange-500" />
              <CardTitle className="text-lg">{h.name}</CardTitle>
              {h.rating && (
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span className="text-sm text-gray-600">{h.rating}</span>
                </div>
              )}
              {h.owner_id === userId && <Badge variant="secondary">Your Listing</Badge>}
            </div>
            <Badge className="bg-green-100 text-green-700 font-medium text-lg">{formatPrice(h.price)}/night</Badge>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-gray-700 text-sm leading-relaxed">{h.description}</p>
            {h.amenities && h.amenities.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {h.amenities.map((amenity, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {amenity}
                  </Badge>
                ))}
              </div>
            )}
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">Starting from {formatPrice(h.price)} per night</div>
              <Button size="sm" className="bg-gradient-to-r from-orange-500 to-pink-500 hover:opacity-90 text-white">
                <CalendarDays className="h-4 w-4 mr-1" />
                Book Now
              </Button>
            </div>
            {(h.contact_phone || h.contact_email) && (
              <div className="text-xs text-gray-500 border-t pt-2">
                {h.contact_phone && <p>📞 {h.contact_phone}</p>}
                {h.contact_email && <p>✉️ {h.contact_email}</p>}
              </div>
            )}
          </CardContent>
        </Card>
      ))}

      {hotels.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Hotel className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600">No hotels found in {currentLocation.city}</p>
            <p className="text-sm text-gray-500 mt-2">Be the first to list your hotel in this city!</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
