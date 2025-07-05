import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SAFAR - Smart AI-Powered Travel Companion",
  description: "Discover amazing places, connect with fellow travelers, and get AI-powered recommendations",
  generator: "v0.dev",
}

// Disable static generation for the entire app
export const dynamic = "force-dynamic"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
