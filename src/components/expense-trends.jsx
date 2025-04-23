"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../context/auth-context"
import { formatCurrency } from "../lib/utils"

export default function ExpenseTrends() {
  const { user } = useAuth()
  const [timeRange, setTimeRange] = useState("6months") // 3months, 6months, 1year, all
  const [chartData, setChartData] = useState([])
  const [categoryTrends, setCategoryTrends] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)

    // Calculate date range
    const endDate = new Date()
    let startDate = new Date()

    if (timeRange === "3months") {
      startDate.setMonth(startDate.getMonth() - 3)
    } else if (timeRange === "6months") {
      startDate.setMonth(startDate.getMonth() - 6)
    } else if (timeRange === "1year") {
      startDate.setFullYear(startDate.getFullYear() - 1)
    } else {
      // All time - use the earliest expense date
      if (user.expenses.length > 0) {
        const dates = user.expenses.map((exp) => new Date(exp.date))
        startDate = new Date(Math.min(...dates))
      } else {
        startDate.setFullYear(startDate.getFullYear() - 1)
      }
    }

    // Filter expenses within the date range
    const filteredExpenses = user.expenses.filter((expense) => {
      const expenseDate = new Date(expense.date)
      return expenseDate >= startDate && expenseDate <= endDate
    })

    // Generate monthly data for the chart
    const monthlyData = []
    const currentDate = new Date(startDate)

    while (currentDate <= endDate) {
      const year = currentDate.getFullYear()
      const month = currentDate.getMonth()

      const monthExpenses = filteredExpenses.filter((expense) => {
        const expDate = new Date(expense.date)
        return expDate.getFullYear() === year && expDate.getMonth() === month
      })

      const totalAmount = monthExpenses.reduce((sum, exp) => sum + exp.amount, 0)

      monthlyData.push({
        name: `${currentDate.toLocaleString("default", { month: "short" })} ${year}`,
        amount: totalAmount,
      })

      currentDate.setMonth(currentDate.getMonth() + 1)
    }

    setChartData(monthlyData)

    // Calculate category trends
    const categoryData = user.categories
      .map((category) => {
        const categoryExpenses = filteredExpenses.filter((exp) => exp.categoryId === category.id)
        const totalAmount = categoryExpenses.reduce((sum, exp) => sum + exp.amount, 0)

        // Calculate month-over-month growth
        let growth = 0
        if (monthlyData.length >= 2) {
          const lastMonth = monthlyData[monthlyData.length - 1]
          const previousMonth = monthlyData[monthlyData.length - 2]

          const lastMonthCategoryExpenses = filteredExpenses.filter((exp) => {
            const expDate = new Date(exp.date)
            const lastMonthDate = new Date()
            lastMonthDate.setMonth(lastMonthDate.getMonth() - 1)
            return (
              expDate.getMonth() === lastMonthDate.getMonth() &&
              expDate.getFullYear() === lastMonthDate.getFullYear() &&
              exp.categoryId === category.id
            )
          })

          const previousMonthCategoryExpenses = filteredExpenses.filter((exp) => {
            const expDate = new Date(exp.date)
            const prevMonthDate = new Date()
            prevMonthDate.setMonth(prevMonthDate.getMonth() - 2)
            return (
              expDate.getMonth() === prevMonthDate.getMonth() &&
              expDate.getFullYear() === prevMonthDate.getFullYear() &&
              exp.categoryId === category.id
            )
          })

          const lastMonthTotal = lastMonthCategoryExpenses.reduce((sum, exp) => sum + exp.amount, 0)
          const previousMonthTotal = previousMonthCategoryExpenses.reduce((sum, exp) => sum + exp.amount, 0)

          if (previousMonthTotal > 0) {
            growth = ((lastMonthTotal - previousMonthTotal) / previousMonthTotal) * 100
          }
        }

        return {
          ...category,
          amount: totalAmount,
          growth: growth,
        }
      })
      .filter((cat) => cat.amount > 0)
      .sort((a, b) => b.amount - a.amount)

    setCategoryTrends(categoryData)
    setLoading(false)
  }, [timeRange, user.expenses, user.categories])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Expense Trends</h1>
        <div>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          >
            <option value="3months">Last 3 Months</option>
            <option value="6months">Last 6 Months</option>
            <option value="1year">Last Year</option>
            <option value="all">All Time</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-purple-100 text-center">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading trend data...</p>
        </div>
      ) : (
        <>
          {/* Monthly Trend Chart */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-purple-100">
            <h2 className="text-lg font-medium text-gray-800 mb-4">Monthly Spending Trend</h2>
            <div className="h-64">
              {chartData.length > 0 ? (
                <div className="relative h-full">
                  <div className="absolute inset-0 flex items-end">
                    {chartData.map((month, index) => (
                      <div key={index} className="flex-1 flex flex-col items-center">
                        <div className="text-xs text-gray-500 mb-1">{formatCurrency(month.amount)}</div>
                        <div
                          className="w-full max-w-[30px] bg-purple-500 rounded-t-md mx-auto"
                          style={{
                            height: `${Math.max(5, (month.amount / Math.max(...chartData.map((d) => d.amount))) * 100)}%`,
                            opacity: index === chartData.length - 1 ? 1 : 0.7,
                          }}
                        ></div>
                        <div className="text-xs text-gray-500 mt-1 truncate w-full text-center">{month.name}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500">No data available for the selected period</p>
                </div>
              )}
            </div>

            <div className="mt-4 text-sm text-gray-600">
              <p>
                This chart shows your monthly spending over time. Look for patterns and trends to identify months with
                unusually high expenses.
              </p>
            </div>
          </div>

          {/* Category Trends */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-purple-100">
            <h2 className="text-lg font-medium text-gray-800 mb-4">Category Trends</h2>

            {categoryTrends.length > 0 ? (
              <div className="space-y-4">
                {categoryTrends.map((category) => (
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
                        <span className="font-medium text-gray-800">{formatCurrency(category.amount)}</span>
                      </div>
                      <div className="flex items-center">
                        <div className="text-xs text-gray-500 mr-2">Month-over-month:</div>
                        <div
                          className={`text-xs ${category.growth > 0 ? "text-red-500" : category.growth < 0 ? "text-green-500" : "text-gray-500"}`}
                        >
                          {category.growth > 0 ? "↑" : category.growth < 0 ? "↓" : "–"}
                          {Math.abs(category.growth).toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No category data available for the selected period</p>
              </div>
            )}
          </div>

          {/* Spending Insights */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-purple-100">
            <h2 className="text-lg font-medium text-gray-800 mb-4">Spending Insights</h2>

            {chartData.length > 1 ? (
              <div className="space-y-4">
                {/* Average Monthly Spending */}
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="font-medium text-purple-800 mb-2">Average Monthly Spending</h3>
                  <p className="text-gray-700">
                    Your average monthly spending is{" "}
                    {formatCurrency(chartData.reduce((sum, month) => sum + month.amount, 0) / chartData.length)}.
                  </p>
                </div>

                {/* Highest Spending Month */}
                {chartData.length > 0 && (
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h3 className="font-medium text-purple-800 mb-2">Highest Spending Month</h3>
                    <p className="text-gray-700">
                      Your highest spending month was {chartData.sort((a, b) => b.amount - a.amount)[0].name}
                      with {formatCurrency(chartData.sort((a, b) => b.amount - a.amount)[0].amount)}.
                    </p>
                  </div>
                )}

                {/* Spending Trend */}
                {chartData.length >= 3 && (
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h3 className="font-medium text-purple-800 mb-2">Spending Trend</h3>
                    <p className="text-gray-700">
                      {(() => {
                        const lastThreeMonths = chartData.slice(-3)
                        const isIncreasing =
                          lastThreeMonths[0].amount < lastThreeMonths[1].amount &&
                          lastThreeMonths[1].amount < lastThreeMonths[2].amount
                        const isDecreasing =
                          lastThreeMonths[0].amount > lastThreeMonths[1].amount &&
                          lastThreeMonths[1].amount > lastThreeMonths[2].amount

                        if (isIncreasing) {
                          return "Your spending has been increasing over the last three months. Consider reviewing your budget."
                        } else if (isDecreasing) {
                          return "Your spending has been decreasing over the last three months. Great job managing your finances!"
                        } else {
                          return "Your spending has been fluctuating over the last three months."
                        }
                      })()}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-500">Not enough data to generate insights. Add more expenses to see trends.</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
