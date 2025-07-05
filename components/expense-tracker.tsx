"use client"

import { useState, useEffect } from "react"
import {
  Plus,
  Calculator,
  Trash2,
  Edit,
  IndianRupee,
  Calendar,
  Tag,
  TrendingUp,
  PieChart,
  Users,
  Map,
  Train,
  Plane,
  Bus,
  Car,
  ArrowRight,
  Clock,
  Divide,
  UserPlus,
  X,
  MapPin,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

interface Expense {
  id: string
  title: string
  amount: number
  category: string
  description?: string
  date: string
  location?: string
  paidBy?: string
  splitWith?: string[]
}

interface TripMember {
  id: string
  name: string
  email?: string
  avatar?: string
  color?: string
}

interface Trip {
  id: string
  name: string
  startDate: string
  endDate: string
  startLocation: string
  destination: string
  members: TripMember[]
  budget?: number
  description?: string
  transportMode?: string
  expenses: Expense[]
}

interface Props {
  currentLocation: { lat: number; lng: number; name: string; city: string } | null
  userId: string
}

const categories = [
  { value: "transport", label: "🚗 Transport", color: "bg-blue-100 text-blue-700" },
  { value: "food", label: "🍽️ Food & Dining", color: "bg-green-100 text-green-700" },
  { value: "accommodation", label: "🏨 Accommodation", color: "bg-purple-100 text-purple-700" },
  { value: "activities", label: "🎯 Activities", color: "bg-orange-100 text-orange-700" },
  { value: "shopping", label: "🛍️ Shopping", color: "bg-pink-100 text-pink-700" },
  { value: "miscellaneous", label: "📝 Miscellaneous", color: "bg-gray-100 text-gray-700" },
]

const transportModes = [
  { value: "train", label: "🚆 Train", icon: Train },
  { value: "flight", label: "✈️ Flight", icon: Plane },
  { value: "bus", label: "🚌 Bus", icon: Bus },
  { value: "car", label: "🚗 Car", icon: Car },
  { value: "mixed", label: "🔄 Mixed", icon: TrendingUp },
]

const popularCities = [
  "Mumbai",
  "Delhi",
  "Bangalore",
  "Hyderabad",
  "Chennai",
  "Kolkata",
  "Jaipur",
  "Ahmedabad",
  "Pune",
  "Goa",
  "Kochi",
  "Varanasi",
  "Agra",
  "Amritsar",
  "Shimla",
  "Manali",
  "Darjeeling",
  "Rishikesh",
]

// Generate a random color for member avatars
const getRandomColor = () => {
  const colors = [
    "bg-red-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-indigo-500",
    "bg-teal-500",
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}

export default function ExpenseTracker({ currentLocation, userId }: Props) {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [trips, setTrips] = useState<Trip[]>([])
  const [activeTrip, setActiveTrip] = useState<Trip | null>(null)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showAddTripDialog, setShowAddTripDialog] = useState(false)
  const [showAddMemberDialog, setShowAddMemberDialog] = useState(false)
  const [showTransportDialog, setShowTransportDialog] = useState(false)
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    category: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
    paidBy: "",
    splitWith: [] as string[],
  })

  const [tripFormData, setTripFormData] = useState({
    name: "",
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    startLocation: currentLocation?.city || "",
    destination: "",
    description: "",
    budget: "",
    transportMode: "mixed",
  })

  const [memberFormData, setMemberFormData] = useState({
    name: "",
    email: "",
  })

  const [transportResults, setTransportResults] = useState<any[]>([])
  const [transportLoading, setTransportLoading] = useState(false)

  useEffect(() => {
    loadExpenses()
    loadTrips()
  }, [currentLocation])

  const loadExpenses = async () => {
    try {
      const response = await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, location: currentLocation?.city }),
      })
      const data = await response.json()
      setExpenses(data.expenses || [])
    } catch (error) {
      console.error("Load expenses error:", error)
      // Load from localStorage as fallback
      const saved = localStorage.getItem(`expenses_${userId}`)
      if (saved) {
        setExpenses(JSON.parse(saved))
      }
    }
  }

  const loadTrips = async () => {
    try {
      const response = await fetch("/api/trips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      })
      const data = await response.json()
      setTrips(data.trips || [])
    } catch (error) {
      console.error("Load trips error:", error)
      // Load from localStorage as fallback
      const saved = localStorage.getItem(`trips_${userId}`)
      if (saved) {
        setTrips(JSON.parse(saved))
      }
    }
  }

  const saveExpense = async () => {
    if (!formData.title || !formData.amount || !formData.category) return

    const expense: Expense = {
      id: editingExpense?.id || Date.now().toString(),
      title: formData.title,
      amount: Number.parseFloat(formData.amount),
      category: formData.category,
      description: formData.description,
      date: formData.date,
      location: activeTrip ? activeTrip.destination : currentLocation?.city,
      paidBy: formData.paidBy,
      splitWith: formData.splitWith,
    }

    try {
      const response = await fetch("/api/expenses/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...expense,
          userId,
          tripId: activeTrip?.id,
        }),
      })

      if (response.ok) {
        if (activeTrip) {
          // Add expense to trip
          const updatedTrip = {
            ...activeTrip,
            expenses: editingExpense
              ? activeTrip.expenses.map((e) => (e.id === expense.id ? expense : e))
              : [...activeTrip.expenses, expense],
          }

          setActiveTrip(updatedTrip)
          setTrips(trips.map((t) => (t.id === updatedTrip.id ? updatedTrip : t)))
          localStorage.setItem(
            `trips_${userId}`,
            JSON.stringify(trips.map((t) => (t.id === updatedTrip.id ? updatedTrip : t))),
          )
        } else {
          // Add to general expenses
          if (editingExpense) {
            setExpenses((prev) => prev.map((e) => (e.id === expense.id ? expense : e)))
          } else {
            setExpenses((prev) => [...prev, expense])
          }
          localStorage.setItem(
            `expenses_${userId}`,
            JSON.stringify(
              editingExpense ? expenses.map((e) => (e.id === expense.id ? expense : e)) : [...expenses, expense],
            ),
          )
        }
      }
    } catch (error) {
      console.error("Save expense error:", error)
      // Save to localStorage as fallback
      if (activeTrip) {
        const updatedTrip = {
          ...activeTrip,
          expenses: editingExpense
            ? activeTrip.expenses.map((e) => (e.id === expense.id ? expense : e))
            : [...activeTrip.expenses, expense],
        }

        setActiveTrip(updatedTrip)
        setTrips(trips.map((t) => (t.id === updatedTrip.id ? updatedTrip : t)))
        localStorage.setItem(
          `trips_${userId}`,
          JSON.stringify(trips.map((t) => (t.id === updatedTrip.id ? updatedTrip : t))),
        )
      } else {
        const newExpenses = editingExpense
          ? expenses.map((e) => (e.id === expense.id ? expense : e))
          : [...expenses, expense]
        setExpenses(newExpenses)
        localStorage.setItem(`expenses_${userId}`, JSON.stringify(newExpenses))
      }
    }

    resetForm()
  }

  const saveTrip = async () => {
    if (!tripFormData.name || !tripFormData.startLocation || !tripFormData.destination) return

    const trip: Trip = {
      id: Date.now().toString(),
      name: tripFormData.name,
      startDate: tripFormData.startDate,
      endDate: tripFormData.endDate,
      startLocation: tripFormData.startLocation,
      destination: tripFormData.destination,
      description: tripFormData.description,
      budget: tripFormData.budget ? Number.parseFloat(tripFormData.budget) : undefined,
      transportMode: tripFormData.transportMode,
      members: [
        {
          id: userId,
          name: "You (Owner)",
          color: "bg-blue-500",
        },
      ],
      expenses: [],
    }

    try {
      const response = await fetch("/api/trips/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...trip, userId }),
      })

      if (response.ok) {
        setTrips([...trips, trip])
        setActiveTrip(trip)
      }
    } catch (error) {
      console.error("Save trip error:", error)
      // Save to localStorage as fallback
      const newTrips = [...trips, trip]
      setTrips(newTrips)
      setActiveTrip(trip)
      localStorage.setItem(`trips_${userId}`, JSON.stringify(newTrips))
    }

    resetTripForm()
  }

  const addMember = () => {
    if (!memberFormData.name || !activeTrip) return

    const newMember: TripMember = {
      id: Date.now().toString(),
      name: memberFormData.name,
      email: memberFormData.email,
      color: getRandomColor(),
    }

    const updatedTrip = {
      ...activeTrip,
      members: [...activeTrip.members, newMember],
    }

    setActiveTrip(updatedTrip)
    setTrips(trips.map((t) => (t.id === updatedTrip.id ? updatedTrip : t)))
    localStorage.setItem(
      `trips_${userId}`,
      JSON.stringify(trips.map((t) => (t.id === updatedTrip.id ? updatedTrip : t))),
    )

    setMemberFormData({
      name: "",
      email: "",
    })

    setShowAddMemberDialog(false)
  }

  const removeMember = (memberId: string) => {
    if (!activeTrip) return

    const updatedTrip = {
      ...activeTrip,
      members: activeTrip.members.filter((m) => m.id !== memberId),
    }

    setActiveTrip(updatedTrip)
    setTrips(trips.map((t) => (t.id === updatedTrip.id ? updatedTrip : t)))
    localStorage.setItem(
      `trips_${userId}`,
      JSON.stringify(trips.map((t) => (t.id === updatedTrip.id ? updatedTrip : t))),
    )
  }

  const searchTransport = async () => {
    if (!activeTrip) return

    setTransportLoading(true)

    try {
      const response = await fetch("/api/transport", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          from: activeTrip.startLocation,
          to: activeTrip.destination,
          date: activeTrip.startDate,
          mode: activeTrip.transportMode,
        }),
      })

      const data = await response.json()
      setTransportResults(data.options || [])
    } catch (error) {
      console.error("Transport search error:", error)
      // Mock data as fallback
      setTransportResults([
        {
          id: "1",
          mode: "train",
          name: "Rajdhani Express",
          departureTime: "06:30",
          arrivalTime: "14:45",
          duration: "8h 15m",
          price: 1250,
          stops: 3,
        },
        {
          id: "2",
          mode: "flight",
          name: "IndiGo 6E-345",
          departureTime: "08:15",
          arrivalTime: "10:00",
          duration: "1h 45m",
          price: 4500,
          stops: 0,
        },
        {
          id: "3",
          mode: "bus",
          name: "Volvo A/C Sleeper",
          departureTime: "21:00",
          arrivalTime: "07:30",
          duration: "10h 30m",
          price: 950,
          stops: 2,
        },
      ])
    } finally {
      setTransportLoading(false)
    }
  }

  const deleteExpense = async (id: string) => {
    try {
      await fetch("/api/expenses/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, userId }),
      })
    } catch (error) {
      console.error("Delete expense error:", error)
    }

    if (activeTrip) {
      const updatedTrip = {
        ...activeTrip,
        expenses: activeTrip.expenses.filter((e) => e.id !== id),
      }

      setActiveTrip(updatedTrip)
      setTrips(trips.map((t) => (t.id === updatedTrip.id ? updatedTrip : t)))
      localStorage.setItem(
        `trips_${userId}`,
        JSON.stringify(trips.map((t) => (t.id === updatedTrip.id ? updatedTrip : t))),
      )
    } else {
      const newExpenses = expenses.filter((e) => e.id !== id)
      setExpenses(newExpenses)
      localStorage.setItem(`expenses_${userId}`, JSON.stringify(newExpenses))
    }
  }

  const deleteTrip = async (id: string) => {
    try {
      await fetch("/api/trips/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, userId }),
      })
    } catch (error) {
      console.error("Delete trip error:", error)
    }

    const newTrips = trips.filter((t) => t.id !== id)
    setTrips(newTrips)

    if (activeTrip && activeTrip.id === id) {
      setActiveTrip(null)
    }

    localStorage.setItem(`trips_${userId}`, JSON.stringify(newTrips))
  }

  const resetForm = () => {
    setFormData({
      title: "",
      amount: "",
      category: "",
      description: "",
      date: new Date().toISOString().split("T")[0],
      paidBy: activeTrip ? activeTrip.members[0].id : "",
      splitWith: activeTrip ? activeTrip.members.map((m) => m.id) : [],
    })
    setEditingExpense(null)
    setShowAddDialog(false)
  }

  const resetTripForm = () => {
    setTripFormData({
      name: "",
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      startLocation: currentLocation?.city || "",
      destination: "",
      description: "",
      budget: "",
      transportMode: "mixed",
    })
    setShowAddTripDialog(false)
  }

  const startEdit = (expense: Expense) => {
    setFormData({
      title: expense.title,
      amount: expense.amount.toString(),
      category: expense.category,
      description: expense.description || "",
      date: expense.date,
      paidBy: expense.paidBy || (activeTrip ? activeTrip.members[0].id : ""),
      splitWith: expense.splitWith || (activeTrip ? activeTrip.members.map((m) => m.id) : []),
    })
    setEditingExpense(expense)
    setShowAddDialog(true)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const getMemberById = (id: string) => {
    if (!activeTrip) return null
    return activeTrip.members.find((m) => m.id === id)
  }

  const calculateMemberBalance = (memberId: string) => {
    if (!activeTrip) return 0

    let paid = 0
    let owes = 0

    activeTrip.expenses.forEach((expense) => {
      // What this member paid
      if (expense.paidBy === memberId) {
        paid += expense.amount
      }

      // What this member owes
      if (expense.splitWith && expense.splitWith.includes(memberId)) {
        owes += expense.amount / expense.splitWith.length
      }
    })

    return paid - owes
  }

  const calculateTripProgress = () => {
    if (!activeTrip || !activeTrip.budget) return 0

    const totalSpent = activeTrip.expenses.reduce((sum, expense) => sum + expense.amount, 0)
    return Math.min(100, Math.round((totalSpent / activeTrip.budget) * 100))
  }

  const totalExpenses = activeTrip
    ? activeTrip.expenses.reduce((sum, expense) => sum + expense.amount, 0)
    : expenses.reduce((sum, expense) => sum + expense.amount, 0)

  const categoryTotals = categories
    .map((cat) => ({
      ...cat,
      total: (activeTrip ? activeTrip.expenses : expenses)
        .filter((e) => e.category === cat.value)
        .reduce((sum, e) => sum + e.amount, 0),
    }))
    .filter((cat) => cat.total > 0)

  const currentExpenses = activeTrip ? activeTrip.expenses : expenses

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Calculator className="h-5 w-5 mr-2 text-pink-500" />
              {activeTrip ? `Trip: ${activeTrip.name}` : "Expense Tracker"}
              {currentLocation && !activeTrip && (
                <Badge variant="secondary" className="ml-2">
                  {currentLocation.city}
                </Badge>
              )}
            </CardTitle>
            <div className="flex space-x-2">
              {activeTrip && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setActiveTrip(null)
                  }}
                >
                  Back to All Trips
                </Button>
              )}

              <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Expense
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{editingExpense ? "Edit Expense" : "Add New Expense"}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                        placeholder="e.g., Lunch at restaurant"
                      />
                    </div>
                    <div>
                      <Label htmlFor="amount">Amount (₹)</Label>
                      <Input
                        id="amount"
                        type="number"
                        value={formData.amount}
                        onChange={(e) => setFormData((prev) => ({ ...prev, amount: e.target.value }))}
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat.value} value={cat.value}>
                              {cat.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="date">Date</Label>
                      <Input
                        id="date"
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
                      />
                    </div>

                    {activeTrip && (
                      <>
                        <div>
                          <Label htmlFor="paidBy">Paid By</Label>
                          <Select
                            value={formData.paidBy}
                            onValueChange={(value) => setFormData((prev) => ({ ...prev, paidBy: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select who paid" />
                            </SelectTrigger>
                            <SelectContent>
                              {activeTrip.members.map((member) => (
                                <SelectItem key={member.id} value={member.id}>
                                  {member.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label className="mb-2 block">Split With</Label>
                          <div className="space-y-2 border rounded-md p-3">
                            {activeTrip.members.map((member) => (
                              <div key={member.id} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`member-${member.id}`}
                                  checked={formData.splitWith.includes(member.id)}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      setFormData((prev) => ({
                                        ...prev,
                                        splitWith: [...prev.splitWith, member.id],
                                      }))
                                    } else {
                                      setFormData((prev) => ({
                                        ...prev,
                                        splitWith: prev.splitWith.filter((id) => id !== member.id),
                                      }))
                                    }
                                  }}
                                />
                                <Label htmlFor={`member-${member.id}`} className="cursor-pointer">
                                  {member.name}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    )}

                    <div>
                      <Label htmlFor="description">Description (Optional)</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                        placeholder="Additional details..."
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button onClick={saveExpense} className="flex-1">
                        {editingExpense ? "Update" : "Add"} Expense
                      </Button>
                      <Button variant="outline" onClick={resetForm}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Main Content */}
      {!activeTrip ? (
        <div className="space-y-6">
          {/* My Trips Section */}
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">My Trips</h2>
            <Dialog open={showAddTripDialog} onOpenChange={setShowAddTripDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Trip
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>Create New Trip</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="tripName">Trip Name</Label>
                    <Input
                      id="tripName"
                      value={tripFormData.name}
                      onChange={(e) => setTripFormData((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., Weekend Getaway to Goa"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="startDate">Start Date</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={tripFormData.startDate}
                        onChange={(e) => setTripFormData((prev) => ({ ...prev, startDate: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="endDate">End Date</Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={tripFormData.endDate}
                        onChange={(e) => setTripFormData((prev) => ({ ...prev, endDate: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="startLocation">Starting Point</Label>
                      <Select
                        value={tripFormData.startLocation}
                        onValueChange={(value) => setTripFormData((prev) => ({ ...prev, startLocation: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select city" />
                        </SelectTrigger>
                        <SelectContent>
                          {popularCities.map((city) => (
                            <SelectItem key={city} value={city}>
                              {city}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="destination">Destination</Label>
                      <Select
                        value={tripFormData.destination}
                        onValueChange={(value) => setTripFormData((prev) => ({ ...prev, destination: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select city" />
                        </SelectTrigger>
                        <SelectContent>
                          {popularCities.map((city) => (
                            <SelectItem key={city} value={city}>
                              {city}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="transportMode">Transport Mode</Label>
                    <Select
                      value={tripFormData.transportMode}
                      onValueChange={(value) => setTripFormData((prev) => ({ ...prev, transportMode: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select transport" />
                      </SelectTrigger>
                      <SelectContent>
                        {transportModes.map((mode) => (
                          <SelectItem key={mode.value} value={mode.value}>
                            {mode.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="budget">Budget (₹) (Optional)</Label>
                    <Input
                      id="budget"
                      type="number"
                      value={tripFormData.budget}
                      onChange={(e) => setTripFormData((prev) => ({ ...prev, budget: e.target.value }))}
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <Label htmlFor="tripDescription">Description (Optional)</Label>
                    <Textarea
                      id="tripDescription"
                      value={tripFormData.description}
                      onChange={(e) => setTripFormData((prev) => ({ ...prev, description: e.target.value }))}
                      placeholder="Trip details, plans, etc."
                    />
                  </div>

                  <div className="flex space-x-2">
                    <Button onClick={saveTrip} className="flex-1">
                      Create Trip
                    </Button>
                    <Button variant="outline" onClick={resetTripForm}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {trips.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {trips.map((trip) => (
                <Card key={trip.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex justify-between items-center">
                      <span>{trip.name}</span>
                      <Badge variant="outline">
                        {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{trip.startLocation}</span>
                      <ArrowRight className="h-4 w-4 mx-1" />
                      <span>{trip.destination}</span>
                    </div>

                    <div className="flex items-center space-x-4 mb-3">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1 text-blue-600" />
                        <span className="text-sm">{trip.members.length} members</span>
                      </div>
                      <div className="flex items-center">
                        <Calculator className="h-4 w-4 mr-1 text-green-600" />
                        <span className="text-sm">
                          {formatCurrency(trip.expenses.reduce((sum, e) => sum + e.amount, 0))}
                        </span>
                      </div>
                    </div>

                    {trip.budget && (
                      <div className="mb-2">
                        <div className="flex justify-between text-xs mb-1">
                          <span>Budget</span>
                          <span>
                            {formatCurrency(trip.expenses.reduce((sum, e) => sum + e.amount, 0))} /{" "}
                            {formatCurrency(trip.budget)}
                          </span>
                        </div>
                        <Progress
                          value={Math.min(
                            100,
                            Math.round((trip.expenses.reduce((sum, e) => sum + e.amount, 0) / trip.budget) * 100),
                          )}
                          className="h-2"
                        />
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" size="sm" onClick={() => setActiveTrip(trip)}>
                      Manage Trip
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-800"
                      onClick={() => deleteTrip(trip.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Map className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600">No trips created yet</p>
                <p className="text-sm text-gray-500 mt-2 mb-4">
                  Create a trip to track expenses with friends and family
                </p>
                <Button onClick={() => setShowAddTripDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Trip
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Personal Expenses Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Personal Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card>
                  <CardContent className="p-4 text-center">
                    <IndianRupee className="h-6 w-6 mx-auto mb-2 text-green-600" />
                    <p className="text-xl font-bold text-green-600">{formatCurrency(totalExpenses)}</p>
                    <p className="text-xs text-gray-600">Total Spent</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <TrendingUp className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                    <p className="text-xl font-bold">{expenses.length}</p>
                    <p className="text-xs text-gray-600">Entries</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <PieChart className="h-6 w-6 mx-auto mb-2 text-purple-600" />
                    <p className="text-xl font-bold">{categoryTotals.length}</p>
                    <p className="text-xs text-gray-600">Categories</p>
                  </CardContent>
                </Card>
              </div>

              {/* Personal Expenses List */}
              {expenses.length > 0 ? (
                <div className="space-y-3">
                  {expenses
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .slice(0, 5)
                    .map((expense) => {
                      const category = categories.find((cat) => cat.value === expense.category)
                      return (
                        <div
                          key={expense.id}
                          className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                        >
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className="font-medium">{expense.title}</h3>
                              {category && <Badge className={category.color}>{category.label}</Badge>}
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <div className="flex items-center space-x-1">
                                <Calendar className="h-3 w-3" />
                                <span>{new Date(expense.date).toLocaleDateString()}</span>
                              </div>
                              {expense.location && (
                                <div className="flex items-center space-x-1">
                                  <Tag className="h-3 w-3" />
                                  <span>{expense.location}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-lg font-bold text-green-600">{formatCurrency(expense.amount)}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => startEdit(expense)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteExpense(expense.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      )
                    })}
                  {expenses.length > 5 && (
                    <div className="text-center pt-2">
                      <Button variant="outline" size="sm">
                        View All {expenses.length} Expenses
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-6">
                  <Calculator className="h-8 w-8 mx-auto mb-3 text-gray-400" />
                  <p className="text-gray-600">No personal expenses yet</p>
                  <p className="text-sm text-gray-500 mt-1">Add your first expense to get started</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      ) : (
        // Active Trip View
        <div className="space-y-6">
          {/* Trip Header */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Map className="h-5 w-5 mr-2 text-blue-600" />
                  {activeTrip.name}
                </div>
                <Badge variant="outline">
                  {new Date(activeTrip.startDate).toLocaleDateString()} -{" "}
                  {new Date(activeTrip.endDate).toLocaleDateString()}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center text-gray-700">
                <MapPin className="h-5 w-5 mr-2 text-red-500" />
                <span className="font-medium">{activeTrip.startLocation}</span>
                <ArrowRight className="h-5 w-5 mx-2" />
                <span className="font-medium">{activeTrip.destination}</span>
              </div>

              {activeTrip.description && <p className="text-gray-600">{activeTrip.description}</p>}

              {activeTrip.budget && (
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600">Budget</span>
                    <span className="font-medium">
                      {formatCurrency(activeTrip.expenses.reduce((sum, e) => sum + e.amount, 0))} /{" "}
                      {formatCurrency(activeTrip.budget)}
                    </span>
                  </div>
                  <Progress value={calculateTripProgress()} className="h-2" />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Trip Tabs */}
          <Tabs defaultValue="expenses" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="expenses">Expenses</TabsTrigger>
              <TabsTrigger value="members">Members</TabsTrigger>
              <TabsTrigger value="transport">Transport</TabsTrigger>
              <TabsTrigger value="planning">Planning</TabsTrigger>
            </TabsList>

            <TabsContent value="expenses" className="space-y-4">
              {/* Trip Expenses Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <IndianRupee className="h-6 w-6 mx-auto mb-2 text-green-600" />
                    <p className="text-xl font-bold text-green-600">
                      {formatCurrency(activeTrip.expenses.reduce((sum, e) => sum + e.amount, 0))}
                    </p>
                    <p className="text-xs text-gray-600">Total Spent</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <TrendingUp className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                    <p className="text-xl font-bold">{activeTrip.expenses.length}</p>
                    <p className="text-xs text-gray-600">Expenses</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <Users className="h-6 w-6 mx-auto mb-2 text-purple-600" />
                    <p className="text-xl font-bold">{activeTrip.members.length}</p>
                    <p className="text-xs text-gray-600">Members</p>
                  </CardContent>
                </Card>
              </div>

              {/* Split Summary */}
              {activeTrip.members.length > 1 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <Divide className="h-5 w-5 mr-2" />
                      Split Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {activeTrip.members.map((member) => {
                        const balance = calculateMemberBalance(member.id)
                        return (
                          <div key={member.id} className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <Avatar className={`h-8 w-8 ${member.color || "bg-gray-500"}`}>
                                <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <span>{member.name}</span>
                            </div>
                            <div
                              className={`font-semibold ${
                                balance > 0 ? "text-green-600" : balance < 0 ? "text-red-600" : "text-gray-600"
                              }`}
                            >
                              {balance > 0
                                ? `Gets back ${formatCurrency(balance)}`
                                : balance < 0
                                  ? `Owes ${formatCurrency(Math.abs(balance))}`
                                  : "Settled"}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Trip Expenses List */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Trip Expenses</CardTitle>
                </CardHeader>
                <CardContent>
                  {activeTrip.expenses.length > 0 ? (
                    <div className="space-y-3">
                      {activeTrip.expenses
                        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                        .map((expense) => {
                          const category = categories.find((cat) => cat.value === expense.category)
                          const paidByMember = expense.paidBy ? getMemberById(expense.paidBy) : null

                          return (
                            <div
                              key={expense.id}
                              className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                            >
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                  <h3 className="font-semibold">{expense.title}</h3>
                                  {category && <Badge className={category.color}>{category.label}</Badge>}
                                </div>
                                <div className="flex items-center space-x-4 text-sm text-gray-600">
                                  <div className="flex items-center space-x-1">
                                    <Calendar className="h-3 w-3" />
                                    <span>{new Date(expense.date).toLocaleDateString()}</span>
                                  </div>
                                  {paidByMember && (
                                    <div className="flex items-center space-x-1">
                                      <Users className="h-3 w-3" />
                                      <span>Paid by {paidByMember.name}</span>
                                    </div>
                                  )}
                                </div>
                                {expense.description && (
                                  <p className="text-sm text-gray-600 mt-1">{expense.description}</p>
                                )}

                                {expense.splitWith && expense.splitWith.length > 0 && (
                                  <div className="mt-2 flex flex-wrap gap-1">
                                    <span className="text-xs text-gray-500">Split with:</span>
                                    {expense.splitWith.map((memberId) => {
                                      const member = getMemberById(memberId)
                                      return member ? (
                                        <Badge key={memberId} variant="outline" className="text-xs">
                                          {member.name}
                                        </Badge>
                                      ) : null
                                    })}
                                  </div>
                                )}
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className="text-lg font-bold text-green-600">
                                  {formatCurrency(expense.amount)}
                                </span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => startEdit(expense)}
                                  className="text-blue-600 hover:text-blue-800"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => deleteExpense(expense.id)}
                                  className="text-red-600 hover:text-red-800"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          )
                        })}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Calculator className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                      <p className="text-gray-600">No expenses recorded for this trip</p>
                      <p className="text-sm text-gray-500 mt-2">Add your first expense to get started</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="members" className="space-y-4">
              {/* Trip Members */}
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg flex items-center">
                      <Users className="h-5 w-5 mr-2" />
                      Trip Members
                    </CardTitle>
                    <Dialog open={showAddMemberDialog} onOpenChange={setShowAddMemberDialog}>
                      <DialogTrigger asChild>
                        <Button size="sm">
                          <UserPlus className="h-4 w-4 mr-2" />
                          Add Member
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add Trip Member</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="memberName">Name</Label>
                            <Input
                              id="memberName"
                              value={memberFormData.name}
                              onChange={(e) => setMemberFormData((prev) => ({ ...prev, name: e.target.value }))}
                              placeholder="e.g., John Doe"
                            />
                          </div>
                          <div>
                            <Label htmlFor="memberEmail">Email (Optional)</Label>
                            <Input
                              id="memberEmail"
                              type="email"
                              value={memberFormData.email}
                              onChange={(e) => setMemberFormData((prev) => ({ ...prev, email: e.target.value }))}
                              placeholder="e.g., john@example.com"
                            />
                          </div>
                          <div className="flex space-x-2">
                            <Button onClick={addMember} className="flex-1">
                              Add Member
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => {
                                setMemberFormData({ name: "", email: "" })
                                setShowAddMemberDialog(false)
                              }}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {activeTrip.members.map((member) => {
                      const balance = calculateMemberBalance(member.id)
                      return (
                        <div key={member.id} className="flex items-center justify-between p-2 rounded-lg border">
                          <div className="flex items-center space-x-3">
                            <Avatar className={`h-8 w-8 ${member.color || "bg-gray-500"}`}>
                              <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{member.name}</p>
                              {member.email && <p className="text-xs text-gray-500">{member.email}</p>}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span
                              className={`text-sm font-medium ${
                                balance > 0 ? "text-green-600" : balance < 0 ? "text-red-600" : "text-gray-600"
                              }`}
                            >
                              {balance > 0
                                ? `+${formatCurrency(balance)}`
                                : balance < 0
                                  ? `-${formatCurrency(Math.abs(balance))}`
                                  : "₹0"}
                            </span>
                            {member.id !== userId && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeMember(member.id)}
                                className="text-red-600 hover:text-red-800"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="transport" className="space-y-4">
              {/* Transport Options */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Train className="h-5 w-5 mr-2" />
                    Transport Options
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {transportResults.length > 0 ? (
                      <div className="space-y-3">
                        {transportResults.map((option) => {
                          const TransportIcon = transportModes.find((m) => m.value === option.mode)?.icon || Train
                          return (
                            <div key={option.id} className="flex items-center justify-between p-3 border rounded-lg">
                              <div>
                                <div className="flex items-center space-x-2 mb-1">
                                  <TransportIcon className="h-5 w-5 text-blue-600" />
                                  <span className="font-medium">{option.name}</span>
                                </div>
                                <div className="flex items-center space-x-4 text-sm">
                                  <div className="flex items-center">
                                    <Clock className="h-4 w-4 mr-1 text-gray-500" />
                                    <span>
                                      {option.departureTime} - {option.arrivalTime}
                                    </span>
                                  </div>
                                  <div>
                                    <span className="text-gray-600">{option.duration}</span>
                                  </div>
                                  <div>
                                    <Badge variant="outline">{option.stops} stops</Badge>
                                  </div>
                                </div>
                              </div>
                              <div className="text-lg font-bold text-green-600">{formatCurrency(option.price)}</div>
                            </div>
                          )
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        {transportLoading ? (
                          <div className="flex flex-col items-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
                            <p className="text-gray-600">Searching for transport options...</p>
                          </div>
                        ) : (
                          <>
                            <p className="text-gray-600 mb-4">
                              Search for transport options between {activeTrip.startLocation} and{" "}
                              {activeTrip.destination}
                            </p>
                            <Button onClick={searchTransport}>Search Transport Options</Button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="planning" className="space-y-4">
              {/* Trip Planning */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Trip Planning</CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="itinerary">
                      <AccordionTrigger>Suggested Itinerary</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4 p-2">
                          <p className="text-gray-600">
                            Plan your trip from {activeTrip.startLocation} to {activeTrip.destination} with our
                            AI-powered itinerary suggestions.
                          </p>
                          <Button>Generate Itinerary</Button>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="budget">
                      <AccordionTrigger>Budget Prediction</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4 p-2">
                          <p className="text-gray-600">
                            Get an estimate of how much your trip will cost based on your destination and duration.
                          </p>
                          <Button>Predict Budget</Button>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="checklist">
                      <AccordionTrigger>Packing Checklist</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4 p-2">
                          <p className="text-gray-600">
                            Generate a customized packing list for your trip to {activeTrip.destination}.
                          </p>
                          <Button>Create Packing List</Button>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  )
}
