"use client"

import { useAuth } from "../context/auth-context"
import LandingPage from "./landing-page"
import Dashboard from "./dashboard"

export default function AppContent() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-500 to-purple-600">
        <div className="p-8 rounded-lg bg-white shadow-2xl flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600 font-medium">Loading your finances...</p>
        </div>
      </div>
    )
  }

  return user ? <Dashboard /> : <LandingPage />
}

