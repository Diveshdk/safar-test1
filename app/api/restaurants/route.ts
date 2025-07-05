export async function POST(request: Request) {
  try {
    const { city, lat, lng } = await request.json()

    // This would normally call the Swiggy API, but we'll mock the response
    // In a real app, you would need to integrate with Swiggy's API

    // Mock restaurant data based on city
    const restaurants = [
      {
        name: "Punjabi Tadka",
        cuisine: "North Indian, Punjabi",
        rating: 4.3,
        price_range: "₹500 for two",
        delivery_time: "30-35 min",
        image_url: "/placeholder.svg?height=200&width=200",
      },
      {
        name: "Dosa Plaza",
        cuisine: "South Indian, Dosa",
        rating: 4.1,
        price_range: "₹350 for two",
        delivery_time: "25-30 min",
        image_url: "/placeholder.svg?height=200&width=200",
      },
      {
        name: "China Town",
        cuisine: "Chinese, Asian",
        rating: 3.9,
        price_range: "₹450 for two",
        delivery_time: "40-45 min",
        image_url: "/placeholder.svg?height=200&width=200",
      },
      {
        name: "Pizza Paradise",
        cuisine: "Italian, Pizza",
        rating: 4.5,
        price_range: "₹600 for two",
        delivery_time: "35-40 min",
        image_url: "/placeholder.svg?height=200&width=200",
      },
      {
        name: "Biryani House",
        cuisine: "Biryani, Mughlai",
        rating: 4.2,
        price_range: "₹400 for two",
        delivery_time: "30-35 min",
        image_url: "/placeholder.svg?height=200&width=200",
      },
      {
        name: "Cafe Coffee Day",
        cuisine: "Cafe, Beverages",
        rating: 4.0,
        price_range: "₹300 for two",
        delivery_time: "20-25 min",
        image_url: "/placeholder.svg?height=200&width=200",
      },
    ]

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return Response.json({ restaurants })
  } catch (error) {
    console.error("Restaurants API error:", error)
    return Response.json({ restaurants: [] })
  }
}
