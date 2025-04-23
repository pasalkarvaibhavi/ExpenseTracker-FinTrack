"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../context/auth-context"
import { formatCurrency } from "../lib/utils"

export default function SpendingAlerts() {
  const { user } = useAuth()
  const [alerts, setAlerts] = useState([])
  const [dismissedAlerts, setDismissedAlerts] = useState([])
  const [showAllTips, setShowAllTips] = useState(false)

  useEffect(() => {
    if (!user || !user.expenses || !user.categories) return

    const newAlerts = []

    // Get current month expenses
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()

    const currentMonthExpenses = user.expenses.filter((expense) => {
      const expenseDate = new Date(expense.date)
      return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear
    })

    // Calculate total spent this month
    const totalSpent = currentMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0)

    // Check if total spending is approaching budget
    const budgetPercentage = (totalSpent / user.budget) * 100
    if (budgetPercentage >= 90) {
      newAlerts.push({
        id: "budget-critical",
        type: "critical",
        title: "Budget Alert",
        message: `You've used ${budgetPercentage.toFixed(0)}% of your monthly budget. Consider reducing expenses for the rest of the month.`,
        icon: "🚨",
      })
    } else if (budgetPercentage >= 75) {
      newAlerts.push({
        id: "budget-warning",
        type: "warning",
        title: "Budget Warning",
        message: `You've used ${budgetPercentage.toFixed(0)}% of your monthly budget. Monitor your spending closely.`,
        icon: "⚠️",
      })
    }

    // Check categories over budget
    user.categories.forEach((category) => {
      const categoryExpenses = currentMonthExpenses.filter((expense) => expense.categoryId === category.id)
      const categoryTotal = categoryExpenses.reduce((sum, expense) => sum + expense.amount, 0)
      const categoryPercentage = (categoryTotal / category.budget) * 100

      if (categoryPercentage >= 100) {
        newAlerts.push({
          id: `category-over-${category.id}`,
          type: "critical",
          title: `${category.name} Over Budget`,
          message: `You've exceeded your ${category.name} budget by ${formatCurrency(categoryTotal - category.budget)}.`,
          icon: category.icon,
        })
      } else if (categoryPercentage >= 90) {
        newAlerts.push({
          id: `category-warning-${category.id}`,
          type: "warning",
          title: `${category.name} Budget Warning`,
          message: `You've used ${categoryPercentage.toFixed(0)}% of your ${category.name} budget.`,
          icon: category.icon,
        })
      }
    })

    // Check for unusual spending patterns
    const lastMonthDate = new Date(currentYear, currentMonth - 1)
    const lastMonthExpenses = user.expenses.filter((expense) => {
      const expenseDate = new Date(expense.date)
      return (
        expenseDate.getMonth() === lastMonthDate.getMonth() && expenseDate.getFullYear() === lastMonthDate.getFullYear()
      )
    })

    const lastMonthTotal = lastMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0)

    // If this month's spending is significantly higher than last month
    if (lastMonthTotal > 0 && totalSpent > lastMonthTotal * 1.5) {
      newAlerts.push({
        id: "unusual-spending",
        type: "info",
        title: "Unusual Spending Pattern",
        message: `Your spending this month is ${((totalSpent / lastMonthTotal) * 100 - 100).toFixed(0)}% higher than last month.`,
        icon: "📈",
      })
    }

    // Check for large recent transactions
    const recentExpenses = user.expenses.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 10)
    const averageExpense = recentExpenses.reduce((sum, expense) => sum + expense.amount, 0) / recentExpenses.length

    recentExpenses.forEach((expense) => {
      if (expense.amount > averageExpense * 3) {
        const category = user.categories.find((c) => c.id === expense.categoryId)
        newAlerts.push({
          id: `large-expense-${expense.id}`,
          type: "info",
          title: "Large Transaction",
          message: `You had a large ${category?.name || "expense"} transaction of ${formatCurrency(expense.amount)} on ${new Date(expense.date).toLocaleDateString()}.`,
          icon: category?.icon || "💰",
        })
      }
    })

    // Filter out dismissed alerts
    const filteredAlerts = newAlerts.filter((alert) => !dismissedAlerts.includes(alert.id))

    // Add savings tips
    const savingsTips = [
      {
        id: "savings-tip-1",
        type: "tip",
        title: "Savings Tip",
        message: "Consider setting up automatic transfers to a savings account on payday.",
        icon: "💡",
      },
      {
        id: "savings-tip-2",
        type: "tip",
        title: "Savings Tip",
        message: "Review your subscriptions regularly and cancel those you don't use.",
        icon: "💡",
      },
      {
        id: "savings-tip-3",
        type: "tip",
        title: "Savings Tip",
        message: "Try the 50/30/20 rule: 50% for needs, 30% for wants, and 20% for savings.",
        icon: "💡",
      },
      {
        id: "savings-tip-4",
        type: "tip",
        title: "Savings Tip",
        message: "Use cash for discretionary spending to make yourself more aware of what you're spending.",
        icon: "💡",
      },
      {
        id: "savings-tip-5",
        type: "tip",
        title: "Savings Tip",
        message: "Wait 24 hours before making any non-essential purchase to avoid impulse buying.",
        icon: "💡",
      },
      {
        id: "savings-tip-6",
        type: "tip",
        title: "Savings Tip",
        message: "Cook meals at home instead of eating out to save money on food expenses.",
        icon: "💡",
      },
      {
        id: "savings-tip-7",
        type: "tip",
        title: "Savings Tip",
        message: "Set specific financial goals to stay motivated with your savings plan.",
        icon: "💡",
      },
    ]

    // If no alerts, add some savings tips
    if (filteredAlerts.length === 0 || showAllTips) {
      // Add all savings tips if showAllTips is true, otherwise just add one
      const tipsToAdd = showAllTips ? savingsTips : [savingsTips[Math.floor(Math.random() * savingsTips.length)]]
      setAlerts([...filteredAlerts, ...tipsToAdd])
    } else {
      setAlerts(filteredAlerts)
    }
  }, [user, dismissedAlerts, showAllTips])

  const getAlertClass = (type) => {
    switch (type) {
      case "critical":
        return "bg-red-50 border-red-200 text-red-700"
      case "warning":
        return "bg-yellow-50 border-yellow-200 text-yellow-700"
      case "info":
        return "bg-blue-50 border-blue-200 text-blue-700"
      case "tip":
        return "bg-green-50 border-green-200 text-green-700"
      default:
        return "bg-gray-50 border-gray-200 text-gray-700"
    }
  }

  const dismissAlert = (alertId) => {
    setDismissedAlerts((prev) => [...prev, alertId])
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Spending Alerts & Tips</h1>
        <button
          onClick={() => setShowAllTips(!showAllTips)}
          className="text-purple-600 hover:text-purple-800 font-medium"
        >
          {showAllTips ? "Hide Tips" : "Show All Tips"}
        </button>
      </div>

      {alerts.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-purple-100 text-center">
          <p className="text-gray-600">No alerts at this time. Check back later!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {alerts.map((alert) => (
            <div key={alert.id} className={`border rounded-xl shadow-sm p-4 ${getAlertClass(alert.type)} relative`}>
              <div className="flex items-start">
                <div className="text-2xl mr-3">{alert.icon}</div>
                <div className="flex-1">
                  <h3 className="font-medium text-lg">{alert.title}</h3>
                  <p>{alert.message}</p>
                </div>
                {alert.type !== "tip" && (
                  <button
                    onClick={() => dismissAlert(alert.id)}
                    className="text-gray-400 hover:text-gray-600"
                    title="Dismiss"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* General Financial Tips */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-purple-100">
        <h2 className="text-lg font-medium text-gray-800 mb-4">Financial Tips</h2>

        <div className="space-y-4">
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="font-medium text-purple-800 mb-2">50/30/20 Budget Rule</h3>
            <p className="text-gray-700">
              Try allocating 50% of your income to needs, 30% to wants, and 20% to savings and debt repayment.
            </p>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="font-medium text-purple-800 mb-2">Track Every Expense</h3>
            <p className="text-gray-700">
              Make it a habit to record all expenses, no matter how small. This helps identify spending patterns and
              areas for improvement.
            </p>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="font-medium text-purple-800 mb-2">Emergency Fund</h3>
            <p className="text-gray-700">
              Aim to save 3-6 months of living expenses in an emergency fund for unexpected situations.
            </p>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="font-medium text-purple-800 mb-2">Review Subscriptions</h3>
            <p className="text-gray-700">
              Regularly review your subscriptions and cancel those you don't use frequently. These small recurring
              charges can add up quickly.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
