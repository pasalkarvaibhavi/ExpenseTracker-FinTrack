"use client"

import { useState } from "react"
import DashboardView from "./dashboard-view"
import ExpenseView from "./expense-view"
import BudgetView from "./budget-view"
import { initialExpenseData } from "../lib/data"
import Navbar from "./navbar"

export default function ExpenseTracker() {
  const [expenseData, setExpenseData] = useState(initialExpenseData)
  const [activeTab, setActiveTab] = useState("dashboard")

  const addExpense = (expense) => {
    setExpenseData((prev) => {
      const newData = { ...prev }

      // Update category total
      newData.categories = newData.categories.map((cat) => {
        if (cat.name === expense.category) {
          return {
            ...cat,
            amount: cat.amount + expense.amount,
            transactions: cat.transactions + 1,
          }
        }
        return cat
      })

      // Update total spent
      newData.totalSpent += expense.amount

      // Update monthly data for chart
      const monthIndex = expense.date.getMonth()
      newData.monthlyData[monthIndex].amount += expense.amount

      return newData
    })
  }

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen shadow-lg">
      <div className="sticky top-0 z-10">
        <div className="bg-purple-600 text-white p-4">
          <h1 className="text-xl font-semibold">Expense Tracker</h1>
          <p className="text-sm opacity-90">Track your spending habits</p>
        </div>

        <div className="w-full bg-purple-500 rounded-none h-14">
          <div className="flex w-full h-full">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`text-white flex-1 h-full ${activeTab === "dashboard" ? "bg-purple-700" : ""}`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab("expenses")}
              className={`text-white flex-1 h-full ${activeTab === "expenses" ? "bg-purple-700" : ""}`}
            >
              Expenses
            </button>
            <button
              onClick={() => setActiveTab("budget")}
              className={`text-white flex-1 h-full ${activeTab === "budget" ? "bg-purple-700" : ""}`}
            >
              Budget
            </button>
          </div>
        </div>
      </div>

      <div className="pb-16">
        {activeTab === "dashboard" && <DashboardView data={expenseData} />}
        {activeTab === "expenses" && <ExpenseView data={expenseData} onAddExpense={addExpense} />}
        {activeTab === "budget" && <BudgetView data={expenseData} />}
      </div>

      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  )
}

