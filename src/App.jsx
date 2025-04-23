"use client"

import { useState, useEffect } from "react"
import { DatabaseProvider } from "./context/database-context"
import { AuthProvider } from "./context/auth-context"
import AppContent from "./components/app-content"

export default function App() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <DatabaseProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </DatabaseProvider>
  )
}

