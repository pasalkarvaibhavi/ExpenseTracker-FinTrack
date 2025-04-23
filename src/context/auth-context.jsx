"use client"

import { createContext, useState, useContext, useEffect } from "react"
import { useDatabase } from "./database-context"

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const db = useDatabase()

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedAuth = localStorage.getItem("expenseTrackerAuth")
        if (storedAuth) {
          const { email } = JSON.parse(storedAuth)
          const userData = db.getUser(email)
          if (userData) {
            // Don't store password in state
            const { password, ...userWithoutPassword } = userData
            setUser(userWithoutPassword)
          } else {
            localStorage.removeItem("expenseTrackerAuth")
          }
        }
      } catch (error) {
        console.error("Auth error:", error)
        localStorage.removeItem("expenseTrackerAuth")
      } finally {
        setLoading(false)
      }
    }

    if (!db.loading) {
      checkAuth()
    }
  }, [db, db.loading])

  const login = (email, password) => {
    const userData = db.getUser(email)

    if (!userData || userData.password !== password) {
      return { success: false, message: "Invalid email or password" }
    }

    // Store auth in localStorage
    localStorage.setItem("expenseTrackerAuth", JSON.stringify({ email }))

    // Don't store password in state
    const { password: _, ...userWithoutPassword } = userData
    setUser(userWithoutPassword)

    return { success: true }
  }

  const register = (name, email, password, autoLogin = false) => {
    // Check if user already exists
    if (db.getUser(email)) {
      return { success: false, message: "Email already in use" }
    }

    // Create new user
    const newUser = db.createUser({
      name,
      email,
      password,
      avatar: null, // Start with no avatar
    })

    if (!newUser) {
      return { success: false, message: "Failed to create account" }
    }

    // Only auto-login if specified
    if (autoLogin) {
      // Store auth in localStorage
      localStorage.setItem("expenseTrackerAuth", JSON.stringify({ email }))

      // Don't store password in state
      const { password: _, ...userWithoutPassword } = newUser
      setUser(userWithoutPassword)
    }

    return { success: true }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("expenseTrackerAuth")
  }

  const requestPasswordReset = (email) => {
    const user = db.getUser(email)
    if (!user) {
      return { success: false, message: "No account found with that email" }
    }

    // In a real app, this would send an email with a reset code
    // For demo purposes, we'll just generate a code and store it
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString() // 6-digit code
    const result = db.setResetCode(email, resetCode)

    if (!result) {
      return { success: false, message: "Failed to generate reset code" }
    }

    // In a real app, we would send an email here
    console.log(`Reset code for ${email}: ${resetCode}`)

    return { success: true, message: "Reset code sent to your email" }
  }

  const verifyResetCode = (email, code) => {
    return db.verifyResetCode(email, code)
  }

  const resetPassword = (email, code, newPassword) => {
    return db.resetPassword(email, code, newPassword)
  }

  const addExpense = (expense) => {
    if (!user) return { success: false, message: "Not authenticated" }

    const result = db.addExpense(user.email, expense)
    if (!result) {
      return { success: false, message: "Failed to add expense" }
    }

    // Update user state with the latest data
    const updatedUser = db.getUser(user.email)
    if (updatedUser) {
      const { password, ...userWithoutPassword } = updatedUser
      setUser(userWithoutPassword)
    }

    return { success: true, data: result }
  }

  const deleteExpense = (expenseId) => {
    if (!user) return { success: false, message: "Not authenticated" }

    const result = db.deleteExpense(user.email, expenseId)
    if (!result) {
      return { success: false, message: "Failed to delete expense" }
    }

    // Update user state with the latest data
    const updatedUser = db.getUser(user.email)
    if (updatedUser) {
      const { password, ...userWithoutPassword } = updatedUser
      setUser(userWithoutPassword)
    }

    return { success: true }
  }

  const updateProfile = (updates) => {
    if (!user) return { success: false, message: "Not authenticated" }

    const result = db.updateUser(user.email, updates)
    if (!result) {
      return { success: false, message: "Failed to update profile" }
    }

    // Update user state with the latest data
    const { password, ...userWithoutPassword } = result
    setUser(userWithoutPassword)

    return { success: true }
  }

  const updateBudget = (budget) => {
    if (!user) return { success: false, message: "Not authenticated" }

    const result = db.setUserBudget(user.email, budget)
    if (!result) {
      return { success: false, message: "Failed to update budget" }
    }

    // Update user state with the latest data
    const { password, ...userWithoutPassword } = result
    setUser(userWithoutPassword)

    return { success: true }
  }

  const updateCategory = (categoryId, updates) => {
    if (!user) return { success: false, message: "Not authenticated" }

    // Find the category
    const categoryIndex = user.categories.findIndex((c) => c.id === categoryId)
    if (categoryIndex === -1) {
      return { success: false, message: "Category not found" }
    }

    // Create updated categories array
    const updatedCategories = [...user.categories]
    updatedCategories[categoryIndex] = {
      ...updatedCategories[categoryIndex],
      ...updates,
    }

    // Update user with new categories
    const result = db.updateUser(user.email, { categories: updatedCategories })
    if (!result) {
      return { success: false, message: "Failed to update category" }
    }

    // Update user state with the latest data
    const { password, ...userWithoutPassword } = result
    setUser(userWithoutPassword)

    return { success: true }
  }

  const addCategory = (categoryData) => {
    if (!user) return { success: false, message: "Not authenticated" }

    // Check if category with same name already exists
    if (user.categories.some((c) => c.name.toLowerCase() === categoryData.name.toLowerCase())) {
      return { success: false, message: "A category with this name already exists" }
    }

    // Create new category
    const newCategory = {
      id: Date.now().toString(),
      ...categoryData,
    }

    // Update user with new category
    const result = db.updateUser(user.email, {
      categories: [...user.categories, newCategory],
    })

    if (!result) {
      return { success: false, message: "Failed to add category" }
    }

    // Update user state with the latest data
    const { password, ...userWithoutPassword } = result
    setUser(userWithoutPassword)

    return { success: true, data: newCategory }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading: loading || db.loading,
        login,
        register,
        logout,
        requestPasswordReset,
        verifyResetCode,
        resetPassword,
        addExpense,
        deleteExpense,
        updateProfile,
        updateBudget,
        updateCategory,
        addCategory,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === null) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
