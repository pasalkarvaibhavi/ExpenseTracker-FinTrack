"use client"

import { useState } from "react"
import { useAuth } from "../context/auth-context"
import Sidebar from "./sidebar"
import Header from "./header"
import Overview from "./overview"
import Expenses from "./expenses"
import Budget from "./budget"
import Profile from "./profile"
import Reports from "./reports"
import ExpenseTrends from "./expense-trends"
import SpendingAlerts from "./spending-alerts"
import AddExpenseModal from "./add-expense-modal"

export default function Dashboard() {
  const { user } = useAuth()
  const [activeView, setActiveView] = useState("overview")
  const [showAddExpense, setShowAddExpense] = useState(false)

  if (!user) return null

  const renderView = () => {
    switch (activeView) {
      case "expenses":
        return <Expenses />
      case "budget":
        return <Budget />
      case "profile":
        return <Profile />
      case "reports":
        return <Reports />
      case "trends":
        return <ExpenseTrends />
      case "alerts":
        return <SpendingAlerts />
      default:
        return <Overview />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar activeView={activeView} setActiveView={setActiveView} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        <Header setShowAddExpense={setShowAddExpense} activeView={activeView} setActiveView={setActiveView} />

        <main className="flex-1 p-6 overflow-y-auto">{renderView()}</main>
      </div>

      {/* Add Expense Modal */}
      {showAddExpense && <AddExpenseModal onClose={() => setShowAddExpense(false)} />}
    </div>
  )
}
