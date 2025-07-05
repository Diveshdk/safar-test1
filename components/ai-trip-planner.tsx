"use client"

import { useState } from "react"
import { Calendar, MapPin, DollarSign, Plane, Car, Train, Bus, Sparkles, Clock, ArrowLeft } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

interface TripPlan {
  id: string
  title: string
  destination: string
  startDate: string
  endDate: string
  budget: number
  travelers: number
  preferences: string[]
  itinerary: {
    day: number
    date: string
    activities: {
      time: string
      activity: string
      location: string
      cost: number
      description: string
    }[]
    totalCost: number
  }[]
  totalCost: number
  isGenerated: boolean
}

interface Props {
  userId: string
  onBack: () => void
}

const transportModes = [
  { value: "flight", label: "Flight", icon: Plane },
  { value: "train", label: "Train", icon: Train },
  { value: "bus", label: "Bus", icon: Bus },
  { value: "car", label: "Car", icon: Car },
]

const travelPreferences = [
  "Adventure",
  "Culture",
  "Food",
  "Nature",
  "History",
  "Shopping",
  "Nightlife",
  "Photography",
  "Relaxation",
  "Budget-friendly",
  "Luxury",
  "Family-friendly",
]

export default function AITripPlanner({ userId, onBack }: Props) {
  const [currentStep, setCurrentStep] = useState<"form" | "planning" | "result">("form")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedPlan, setGeneratedPlan] = useState<TripPlan | null>(null)

  const [formData, setFormData] = useState({
    destination: "",
    startDate: "",
    endDate: "",
    budget: "",
    travelers: "2",
    transportMode: "flight",
    preferences: [] as string[],
    additionalRequests: "",
  })

  const handlePreferenceToggle = (preference: string) => {
    setFormData((prev) => ({
      ...prev,
      preferences: prev.preferences.includes(preference)
        ? prev.preferences.filter((p) => p !== preference)
        : [...prev.preferences, preference],
    }))
  }

  const generateTripPlan = async () => {
    if (!formData.destination || !formData.startDate || !formData.endDate) {
      alert("Please fill in destination and dates")
      return
    }

    setIsGenerating(true)
    setCurrentStep("planning")

    try {
      const response = await fetch("/api/ai-trip-planner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destination: formData.destination,
          startDate: formData.startDate,
          endDate: formData.endDate,
          budget: Number(formData.budget) || 50000,
          travelers: Number(formData.travelers),
          transportMode: formData.transportMode,
          preferences: formData.preferences,
          additionalRequests: formData.additionalRequests,
        }),
      })

      const data = await response.json()

      if (data.success && data.plan) {
        setGeneratedPlan(data.plan)
        setCurrentStep("result")

        // Save to database
        await saveTripToDatabase(data.plan)
      } else {
        throw new Error(data.error || "Failed to generate trip plan")
      }
    } catch (error) {
      console.error("Trip generation error:", error)
      alert("Failed to generate trip plan. Please try again.")
      setCurrentStep("form")
    } finally {
      setIsGenerating(false)
    }
  }

  const saveTripToDatabase = async (plan: TripPlan) => {
    try {
      const response = await fetch("/api/trips/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: plan.id,
          owner_id: userId,
          name: plan.title,
          description: `AI-generated trip to ${plan.destination}`,
          start_date: plan.startDate,
          end_date: plan.endDate,
          start_location: "Current Location",
          destination: plan.destination,
          budget: plan.totalCost,
          transport_mode: formData.transportMode,
          travelers: plan.travelers,
          preferences: plan.preferences,
          itinerary: plan.itinerary,
          members: [
            {
              name: "Trip Owner",
              user_id: userId,
              color: "#3B82F6",
            },
          ],
        }),
      })

      const result = await response.json()
      if (!result.success) {
        console.error("Failed to save trip to database:", result.error)
      }
    } catch (error) {
      console.error("Database save error:", error)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const calculateDays = () => {
    if (!formData.startDate || !formData.endDate) return 0
    const start = new Date(formData.startDate)
    const end = new Date(formData.endDate)
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1
  }

  if (currentStep === "planning") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
        <div className="max-w-2xl mx-auto">
          <Card className="border-0 shadow-xl">
            <CardContent className="p-12 text-center">
              <div className="relative mb-8">
                <div className="w-20 h-20 mx-auto bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center animate-pulse">
                  <Sparkles className="h-10 w-10 text-white" />
                </div>
                <div className="absolute inset-0 w-20 h-20 mx-auto bg-gradient-to-r from-purple-500 to-blue-500 rounded-full animate-ping opacity-20"></div>
              </div>

              <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Creating Your Perfect Trip
              </h2>

              <p className="text-gray-600 mb-8 text-lg">
                Our AI is crafting a personalized itinerary for your {calculateDays()}-day adventure to{" "}
                {formData.destination}
              </p>

              <div className="space-y-4">
                <div className="flex items-center justify-center space-x-2 text-purple-600">
                  <Clock className="h-5 w-5 animate-spin" />
                  <span>Analyzing destination insights...</span>
                </div>
                <div className="flex items-center justify-center space-x-2 text-blue-600">
                  <MapPin className="h-5 w-5" />
                  <span>Finding the best attractions...</span>
                </div>
                <div className="flex items-center justify-center space-x-2 text-green-600">
                  <DollarSign className="h-5 w-5" />
                  <span>Optimizing your budget...</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (currentStep === "result" && generatedPlan) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-6">
            <Button variant="ghost" onClick={onBack} className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Plans
            </Button>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                {generatedPlan.title}
              </h1>
              <p className="text-gray-600">
                {calculateDays()} days • {generatedPlan.travelers} travelers • {formatCurrency(generatedPlan.totalCost)}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="p-6 text-center">
                <MapPin className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                <h3 className="font-semibold">{generatedPlan.destination}</h3>
                <p className="text-sm text-gray-600">Destination</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Calendar className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                <h3 className="font-semibold">{calculateDays()} Days</h3>
                <p className="text-sm text-gray-600">Duration</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <DollarSign className="h-8 w-8 mx-auto mb-2 text-green-500" />
                <h3 className="font-semibold">{formatCurrency(generatedPlan.totalCost)}</h3>
                <p className="text-sm text-gray-600">Estimated Cost</p>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {generatedPlan.itinerary.map((day, index) => (
              <Card key={index} className="overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                  <CardTitle className="flex items-center justify-between">
                    <span>
                      Day {day.day} - {day.date}
                    </span>
                    <Badge variant="secondary" className="bg-white/20 text-white">
                      {formatCurrency(day.totalCost)}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {day.activities.map((activity, actIndex) => (
                      <div key={actIndex} className="flex items-start space-x-4 p-4 rounded-lg bg-gray-50">
                        <div className="flex-shrink-0 w-16 text-center">
                          <div className="text-sm font-medium text-purple-600">{activity.time}</div>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{activity.activity}</h4>
                          <p className="text-sm text-gray-600 mb-1">{activity.location}</p>
                          <p className="text-sm text-gray-700">{activity.description}</p>
                        </div>
                        <div className="flex-shrink-0 text-right">
                          <div className="text-sm font-medium text-green-600">{formatCurrency(activity.cost)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Trip Preferences</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {generatedPlan.preferences.map((pref, index) => (
                  <Badge key={index} variant="outline">
                    {pref}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <Button variant="ghost" onClick={onBack} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Plans
          </Button>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            AI Trip Planner
          </h1>
          <p className="text-gray-600 text-lg">Let our AI create the perfect itinerary for your next adventure</p>
        </div>

        <Card className="border-0 shadow-xl">
          <CardContent className="p-8">
            <div className="space-y-6">
              <div>
                <Label htmlFor="destination" className="text-base font-medium">
                  Where do you want to go? *
                </Label>
                <Input
                  id="destination"
                  value={formData.destination}
                  onChange={(e) => setFormData((prev) => ({ ...prev, destination: e.target.value }))}
                  placeholder="e.g., Paris, Tokyo, Bali, New York..."
                  className="mt-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate" className="text-base font-medium">
                    Start Date *
                  </Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData((prev) => ({ ...prev, startDate: e.target.value }))}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="endDate" className="text-base font-medium">
                    End Date *
                  </Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData((prev) => ({ ...prev, endDate: e.target.value }))}
                    className="mt-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="budget" className="text-base font-medium">
                    Budget (₹)
                  </Label>
                  <Input
                    id="budget"
                    type="number"
                    value={formData.budget}
                    onChange={(e) => setFormData((prev) => ({ ...prev, budget: e.target.value }))}
                    placeholder="50000"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="travelers" className="text-base font-medium">
                    Travelers
                  </Label>
                  <Select
                    value={formData.travelers}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, travelers: value }))}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num} {num === 1 ? "Person" : "People"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label className="text-base font-medium">Transport Mode</Label>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  {transportModes.map((mode) => {
                    const Icon = mode.icon
                    return (
                      <Button
                        key={mode.value}
                        variant={formData.transportMode === mode.value ? "default" : "outline"}
                        onClick={() => setFormData((prev) => ({ ...prev, transportMode: mode.value }))}
                        className="justify-start"
                      >
                        <Icon className="h-4 w-4 mr-2" />
                        {mode.label}
                      </Button>
                    )
                  })}
                </div>
              </div>

              <div>
                <Label className="text-base font-medium">Travel Preferences</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {travelPreferences.map((pref) => (
                    <Button
                      key={pref}
                      variant={formData.preferences.includes(pref) ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePreferenceToggle(pref)}
                    >
                      {pref}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="additionalRequests" className="text-base font-medium">
                  Additional Requests
                </Label>
                <Textarea
                  id="additionalRequests"
                  value={formData.additionalRequests}
                  onChange={(e) => setFormData((prev) => ({ ...prev, additionalRequests: e.target.value }))}
                  placeholder="Any specific requirements, dietary restrictions, accessibility needs, etc."
                  className="mt-2"
                  rows={3}
                />
              </div>

              <Separator />

              <Button
                onClick={generateTripPlan}
                disabled={isGenerating || !formData.destination || !formData.startDate || !formData.endDate}
                className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white py-3 text-lg"
              >
                <Sparkles className="h-5 w-5 mr-2" />
                {isGenerating ? "Generating Your Trip..." : "Generate AI Trip Plan"}
              </Button>

              {formData.startDate && formData.endDate && (
                <div className="text-center text-sm text-gray-600">
                  Planning a {calculateDays()}-day trip to {formData.destination || "your destination"}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
