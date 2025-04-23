"use client"

import { useAuth } from "../context/auth-context"
import {
  formatCurrency,
  calculateTotalExpenses,
  calculateExpensesByCategory,
  getCurrentMonthExpenses,
  getTodayExpenses,
  getMonthlyData,
} from "../lib/utils"
import ExpensePieChart from "./expense-pie-chart"
import MonthlyTrendChart from "./monthly-trend-chart"
import SavingsInsights from "./savings-insights"

export default function Overview() {
  const { user } = useAuth()

  const currentMonthExpenses = getCurrentMonthExpenses(user.expenses)
  const todayExpenses = getTodayExpenses(user.expenses)
  const totalSpent = calculateTotalExpenses(currentMonthExpenses)
  const expensesByCategory = calculateExpensesByCategory(currentMonthExpenses, user.categories)
  const monthlyData = getMonthlyData(user.expenses)

  // Calculate budget progress
  const budgetProgress = Math.min(100, (totalSpent / user.budget) * 100)

  // Get top categories
  const topCategories = [...user.categories]
    .map((category) => ({
      ...category,
      spent: expensesByCategory[category.id] || 0,
    }))
    .sort((a, b) => b.spent - a.spent)
    .slice(0, 4)

  // Get recent transactions
  const recentTransactions = [...user.expenses].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5)

  // Prepare data for pie chart
  const pieChartData = user.categories
    .map((category) => ({
      id: category.id,
      name: category.name,
      value: expensesByCategory[category.id] || 0,
      color: category.color,
    }))
    .filter((item) => item.value > 0)

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Overview</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-purple-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 text-sm font-medium">Monthly Spending</h3>
            <div className="bg-purple-100 text-purple-600 p-2 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-800 mb-2">{formatCurrency(totalSpent)}</div>
          <div className="text-sm text-gray-500">Budget: {formatCurrency(user.budget)}</div>
          <div className="mt-4 h-2 bg-gray-100 rounded-full">
            <div
              className={`h-full rounded-full ${budgetProgress > 80 ? "bg-red-500" : "bg-purple-500"}`}
              style={{ width: `${budgetProgress}%` }}
            ></div>
          </div>
          <div className="mt-2 text-xs">
            {budgetProgress > 90 ? (
              <span className="text-red-500">Critical: You've used {budgetProgress.toFixed(0)}% of your budget</span>
            ) : budgetProgress > 75 ? (
              <span className="text-orange-500">Warning: You've used {budgetProgress.toFixed(0)}% of your budget</span>
            ) : (
              <span className="text-green-500">Good: You've used {budgetProgress.toFixed(0)}% of your budget</span>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-purple-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 text-sm font-medium">Today's Spending</h3>
            <div className="bg-purple-100 text-purple-600 p-2 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-800 mb-2">
            {formatCurrency(calculateTotalExpenses(todayExpenses))}
          </div>
          <div className="text-sm text-gray-500">{todayExpenses.length} transactions today</div>

          <div className="mt-4 text-xs">
            {todayExpenses.length > 0 ? (
              <div className="bg-purple-50 p-2 rounded-lg">
                <p className="font-medium text-purple-700">Today's biggest expense:</p>
                {todayExpenses.length > 0 && (
                  <p className="mt-1">
                    {
                      user.categories.find(
                        (c) => c.id === todayExpenses.sort((a, b) => b.amount - a.amount)[0]?.categoryId,
                      )?.name
                    }
                    : {formatCurrency(todayExpenses.sort((a, b) => b.amount - a.amount)[0]?.amount)}
                  </p>
                )}
              </div>
            ) : (
              <div className="bg-green-50 p-2 rounded-lg text-green-700">
                No expenses recorded today. Great job saving!
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-purple-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 text-sm font-medium">Total Transactions</h3>
            <div className="bg-purple-100 text-purple-600 p-2 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path
                  fillRule="evenodd"
                  d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2-2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-800 mb-2">{user.expenses.length}</div>
          <div className="text-sm text-gray-500">All time</div>

          <div className="mt-4 text-xs">
            <div className="bg-purple-50 p-2 rounded-lg">
              <p className="font-medium text-purple-700">Average transaction:</p>
              <p className="mt-1">
                {formatCurrency(
                  user.expenses.length > 0 ? calculateTotalExpenses(user.expenses) / user.expenses.length : 0,
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Visualization Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-purple-100">
          <h3 className="text-gray-800 font-medium mb-4">Spending by Category</h3>
          <div className="h-72">
            <ExpensePieChart data={pieChartData} />
          </div>
          {/* <div className="mt-5 text-sm text-gray-600">
            <p>
              This chart shows how your spending is distributed across different categories. The larger the slice, the
              more you've spent in that category this month.
            </p>
          </div> */}
        </div>

        {/* Monthly Trend Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-purple-100">
          <h3 className="text-gray-800 font-medium mb-4">Monthly Spending Trend</h3>
          <div className="h-64">
            <MonthlyTrendChart data={monthlyData} />
          </div>
          <div className="mt-4 text-sm text-gray-600">
            <p>
              This chart shows your spending trend over the past months. Look for patterns to identify months with
              unusually high expenses.
            </p>
          </div>
        </div>
      </div>

      {/* Savings Insights */}
      {
        <SavingsInsights
          categories={user.categories}
          expenses={currentMonthExpenses}
          expensesByCategory={expensesByCategory}
          budget={user.budget}
        />
      }

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Categories */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-purple-100">
          <h3 className="text-gray-800 font-medium mb-4">Top Categories</h3>
          <div className="space-y-4">
            {topCategories.map((category) => (
              <div key={category.id} className="flex items-center">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center mr-4"
                  style={{ backgroundColor: category.color + "20" }}
                >
                  <span className="text-lg">{category.icon}</span>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="font-medium text-gray-800">{category.name}</span>
                    <span className="font-medium text-gray-800">{formatCurrency(category.spent)}</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${Math.min(100, (category.spent / category.budget) * 100)}%`,
                        backgroundColor: category.color,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-purple-100">
          <h3 className="text-gray-800 font-medium mb-4">Recent Transactions</h3>
          <div className="space-y-4">
            {recentTransactions.map((transaction) => {
              const category = user.categories.find((c) => c.id === transaction.categoryId)
              return (
                <div key={transaction.id} className="flex items-center">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center mr-4"
                    style={{ backgroundColor: category?.color + "20" }}
                  >
                    <span className="text-lg">{category?.icon}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <div>
                        <div className="font-medium text-gray-800">{category?.name}</div>
                        <div className="text-xs text-gray-500">{transaction.description}</div>
                      </div>
                      <div className="font-medium text-gray-800">{formatCurrency(transaction.amount)}</div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
