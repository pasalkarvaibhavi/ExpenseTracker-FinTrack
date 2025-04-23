"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { initialData } from "../lib/initial-data"

const DatabaseContext = createContext(null)

export function DatabaseProvider({ children }) {
  const [database, setDatabase] = useState(null)
  const [loading, setLoading] = useState(true)

  // Initialize database from localStorage or with default data
  useEffect(() => {
    try {
      const storedData = localStorage.getItem("expenseTrackerDB")
      if (storedData) {
        setDatabase(JSON.parse(storedData))
      } else {
        setDatabase(initialData)
        localStorage.setItem("expenseTrackerDB", JSON.stringify(initialData))
      }
    } catch (error) {
      console.error("Error initializing database:", error)
      setDatabase(initialData)
    } finally {
      setLoading(false)
    }
  }, [])

  // Save database changes to localStorage
  useEffect(() => {
    if (database && !loading) {
      try {
        localStorage.setItem("expenseTrackerDB", JSON.stringify(database))
      } catch (error) {
        console.error("Error saving database:", error)
      }
    }
  }, [database, loading])

  // Database operations
  const getUser = (email) => {
    if (!database) return null
    return database.users.find((user) => user.email === email) || null
  }

  const createUser = (userData) => {
    if (!database) return false

    // Check if user already exists
    if (getUser(userData.email)) return false

    const newUser = {
      id: Date.now().toString(),
      ...userData,
      createdAt: new Date().toISOString(),
      expenses: [],
      categories: [...database.defaultCategories],
      budget: 5000, // Default budget
      currency: "USD", // Default currency
      financialGoals: [], // Array for financial goals
      notificationPreferences: {
        expenseAlerts: true,
        budgetWarnings: true,
        monthlyReports: true,
      },
    }

    setDatabase({
      ...database,
      users: [...database.users, newUser],
    })

    return newUser
  }

  const updateUser = (email, updates) => {
    if (!database) return false

    const userIndex = database.users.findIndex((user) => user.email === email)
    if (userIndex === -1) return false

    const updatedUsers = [...database.users]
    updatedUsers[userIndex] = {
      ...updatedUsers[userIndex],
      ...updates,
    }

    setDatabase({
      ...database,
      users: updatedUsers,
    })

    return updatedUsers[userIndex]
  }

  const setResetCode = (email, code) => {
    if (!database) return false

    const userIndex = database.users.findIndex((user) => user.email === email)
    if (userIndex === -1) return false

    const updatedUsers = [...database.users]
    updatedUsers[userIndex] = {
      ...updatedUsers[userIndex],
      resetCode: code,
      resetCodeExpires: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutes
    }

    setDatabase({
      ...database,
      users: updatedUsers,
    })

    return true
  }

  const verifyResetCode = (email, code) => {
    if (!database) return { success: false, message: "Database error" }

    const user = database.users.find((user) => user.email === email)
    if (!user) return { success: false, message: "User not found" }

    if (!user.resetCode) return { success: false, message: "No reset code requested" }

    if (user.resetCode !== code) return { success: false, message: "Invalid reset code" }

    if (new Date() > new Date(user.resetCodeExpires)) {
      return { success: false, message: "Reset code expired" }
    }

    return { success: true }
  }

  const resetPassword = (email, code, newPassword) => {
    if (!database) return { success: false, message: "Database error" }

    // Verify the code first
    const verifyResult = verifyResetCode(email, code)
    if (!verifyResult.success) return verifyResult

    const userIndex = database.users.findIndex((user) => user.email === email)
    if (userIndex === -1) return { success: false, message: "User not found" }

    const updatedUsers = [...database.users]
    updatedUsers[userIndex] = {
      ...updatedUsers[userIndex],
      password: newPassword,
      resetCode: null,
      resetCodeExpires: null,
    }

    setDatabase({
      ...database,
      users: updatedUsers,
    })

    return { success: true }
  }

  const setUserBudget = (email, budget) => {
    return updateUser(email, { budget: Number(budget) })
  }

  const setUserCurrency = (email, currency) => {
    return updateUser(email, { currency })
  }

  const addFinancialGoal = (email, goal) => {
    if (!database) return false

    const user = getUser(email)
    if (!user) return false

    const newGoal = {
      id: Date.now().toString(),
      ...goal,
      createdAt: new Date().toISOString(),
      completed: false,
    }

    return updateUser(email, {
      financialGoals: [...user.financialGoals, newGoal],
    })
  }

  const updateFinancialGoal = (email, goalId, updates) => {
    if (!database) return false

    const user = getUser(email)
    if (!user) return false

    const updatedGoals = user.financialGoals.map((goal) => (goal.id === goalId ? { ...goal, ...updates } : goal))

    return updateUser(email, {
      financialGoals: updatedGoals,
    })
  }

  const updateNotificationPreferences = (email, preferences) => {
    return updateUser(email, {
      notificationPreferences: {
        ...getUser(email).notificationPreferences,
        ...preferences,
      },
    })
  }

  const addExpense = (email, expense) => {
    if (!database) return false

    const userIndex = database.users.findIndex((user) => user.email === email)
    if (userIndex === -1) return false

    const user = database.users[userIndex]
    const newExpense = {
      id: Date.now().toString(),
      ...expense,
      createdAt: new Date().toISOString(),
    }

    const updatedUsers = [...database.users]
    updatedUsers[userIndex] = {
      ...user,
      expenses: [newExpense, ...user.expenses],
    }

    setDatabase({
      ...database,
      users: updatedUsers,
    })

    return newExpense
  }

  const deleteExpense = (email, expenseId) => {
    if (!database) return false

    const userIndex = database.users.findIndex((user) => user.email === email)
    if (userIndex === -1) return false

    const user = database.users[userIndex]
    const updatedExpenses = user.expenses.filter((exp) => exp.id !== expenseId)

    const updatedUsers = [...database.users]
    updatedUsers[userIndex] = {
      ...user,
      expenses: updatedExpenses,
    }

    setDatabase({
      ...database,
      users: updatedUsers,
    })

    return true
  }

  return (
    <DatabaseContext.Provider
      value={{
        loading,
        getUser,
        createUser,
        updateUser,
        setUserBudget,
        setUserCurrency,
        addFinancialGoal,
        updateFinancialGoal,
        updateNotificationPreferences,
        addExpense,
        deleteExpense,
        setResetCode,
        verifyResetCode,
        resetPassword,
      }}
    >
      {children}
    </DatabaseContext.Provider>
  )
}

export function useDatabase() {
  const context = useContext(DatabaseContext)
  if (context === null) {
    throw new Error("useDatabase must be used within a DatabaseProvider")
  }
  return context
}
