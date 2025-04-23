"use client"

import { formatCurrency } from "../lib/utils"

export default function SavingsInsights({ categories, expenses, expensesByCategory, budget }) {
  // Find categories that are over budget
  const overBudgetCategories = categories
    .map((category) => ({
      ...category,
      spent: expensesByCategory[category.id] || 0,
      overBudget: (expensesByCategory[category.id] || 0) - category.budget,
    }))
    .filter((category) => category.overBudget > 0)
    .sort((a, b) => b.overBudget - a.overBudget)
    .slice(0, 3)

  // Find categories with highest spending
  const highestSpendingCategories = categories
    .map((category) => ({
      ...category,
      spent: expensesByCategory[category.id] || 0,
      percentOfTotal:
        expenses.length > 0
          ? ((expensesByCategory[category.id] || 0) / expenses.reduce((sum, exp) => sum + exp.amount, 0)) * 100
          : 0,
    }))
    .filter((category) => category.spent > 0)
    .sort((a, b) => b.spent - a.spent)
    .slice(0, 3)

  // Calculate potential savings
  const totalOverBudget = overBudgetCategories.reduce((sum, cat) => sum + cat.overBudget, 0)

  // Calculate spending trend
  const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0)
  const budgetRemaining = budget - totalSpent
  const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate()
  const dayOfMonth = new Date().getDate()
  const daysRemaining = daysInMonth - dayOfMonth

  const dailyBudget = budget / daysInMonth
  const currentDailySpend = totalSpent / (dayOfMonth || 1) // Avoid division by zero
  const projectedMonthTotal = totalSpent + currentDailySpend * daysRemaining
  const projectedOverUnder = budget - projectedMonthTotal

  // Generate savings tips based on actual spending
  const generateSavingsTips = (category) => {
    const tips = {
      "Dining Out": [
        "Try meal prepping at home to reduce restaurant expenses",
        "Limit eating out to once a week",
        "Look for restaurant deals and happy hours",
      ],
      Shopping: [
        "Consider a 24-hour waiting period before non-essential purchases",
        "Make a shopping list and stick to it",
        "Look for second-hand options for clothing and furniture",
      ],
      Entertainment: [
        "Look for free or low-cost entertainment options",
        "Use streaming services instead of going to movies",
        "Check for free community events in your area",
      ],
      Transportation: [
        "Consider carpooling or public transportation when possible",
        "Combine errands to save on fuel",
        "Consider walking or biking for short distances",
      ],
      Groceries: [
        "Plan meals around sales and use a shopping list to avoid impulse buys",
        "Buy in bulk for non-perishable items",
        "Try store brands instead of name brands",
      ],
      Housing: [
        "Consider a roommate to split costs",
        "Negotiate rent when renewing your lease",
        "Look for ways to reduce utility costs",
      ],
      Utilities: [
        "Turn off lights and appliances when not in use",
        "Adjust your thermostat to save on heating/cooling",
        "Consider energy-efficient appliances",
      ],
      Health: [
        "Look for preventive care options covered by insurance",
        "Compare prices for medications",
        "Consider generic medications when available",
      ],
    }

    // Return tips for the category if available, otherwise return general tips
    return (
      tips[category.name] || [
        `Look for ways to reduce your ${category.name.toLowerCase()} expenses`,
        "Set specific spending limits for each category",
        "Track your expenses in real-time to stay aware of your spending",
      ]
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-purple-100">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Savings Insights & Recommendations</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Current Status */}
        <div>
          <h4 className="font-medium text-gray-700 mb-3">Current Status</h4>

          <div className="bg-purple-50 rounded-lg p-4 mb-4">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Budget:</span>
              <span className="font-medium">{formatCurrency(budget)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Spent so far:</span>
              <span className="font-medium">{formatCurrency(totalSpent)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Remaining:</span>
              <span className="font-medium">{formatCurrency(budgetRemaining)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Days left in month:</span>
              <span className="font-medium">{daysRemaining}</span>
            </div>
          </div>

          <div className="bg-purple-50 rounded-lg p-4">
            <h5 className="font-medium text-purple-800 mb-2">Spending Projection</h5>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Daily average so far:</span>
              <span className="font-medium">{formatCurrency(currentDailySpend)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Ideal daily budget:</span>
              <span className="font-medium">{formatCurrency(dailyBudget)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Projected month total:</span>
              <span className="font-medium">{formatCurrency(projectedMonthTotal)}</span>
            </div>
            <div className="flex justify-between font-medium">
              <span className="text-gray-700">Projected {projectedOverUnder >= 0 ? "savings" : "overspend"}:</span>
              <span className={projectedOverUnder >= 0 ? "text-green-600" : "text-red-600"}>
                {formatCurrency(Math.abs(projectedOverUnder))}
              </span>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div>
          <h4 className="font-medium text-gray-700 mb-3">Savings Recommendations</h4>

          {overBudgetCategories.length > 0 ? (
            <div className="bg-purple-50 rounded-lg p-4 mb-4">
              <h5 className="font-medium text-purple-800 mb-2">Categories Over Budget</h5>
              <ul className="space-y-3">
                {overBudgetCategories.map((category) => (
                  <li key={category.id} className="flex justify-between">
                    <div className="flex items-center">
                      <span
                        className="w-6 h-6 rounded-full flex items-center justify-center mr-2"
                        style={{ backgroundColor: category.color }}
                      >
                        <span className="text-xs text-white">{category.icon}</span>
                      </span>
                      <span>{category.name}</span>
                    </div>
                    <span className="text-red-600">+{formatCurrency(category.overBudget)}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-3 text-sm text-gray-600">
                <p>
                  You could save up to{" "}
                  <span className="font-medium text-purple-700">{formatCurrency(totalOverBudget)}</span> by staying
                  within budget in these categories.
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-green-50 rounded-lg p-4 mb-4 text-green-700">
              <h5 className="font-medium mb-2">Great job!</h5>
              <p>You're currently within budget for all categories.</p>
            </div>
          )}

          {highestSpendingCategories.length > 0 && (
            <div className="bg-purple-50 rounded-lg p-4">
              <h5 className="font-medium text-purple-800 mb-2">Highest Spending Areas</h5>
              <ul className="space-y-3">
                {highestSpendingCategories.map((category) => (
                  <li key={category.id} className="flex justify-between">
                    <div className="flex items-center">
                      <span
                        className="w-6 h-6 rounded-full flex items-center justify-center mr-2"
                        style={{ backgroundColor: category.color }}
                      >
                        <span className="text-xs text-white">{category.icon}</span>
                      </span>
                      <span>{category.name}</span>
                    </div>
                    <div className="text-right">
                      <div>{formatCurrency(category.spent)}</div>
                      <div className="text-xs text-gray-500">{category.percentOfTotal.toFixed(0)}% of total</div>
                    </div>
                  </li>
                ))}
              </ul>

              {highestSpendingCategories.length > 0 && (
                <div className="mt-4 text-sm">
                  <h6 className="font-medium text-purple-700 mb-1">Tips to reduce spending:</h6>
                  <ul className="list-disc pl-5 space-y-1 text-gray-600">
                    {generateSavingsTips(highestSpendingCategories[0]).map((tip, index) => (
                      <li key={index}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
