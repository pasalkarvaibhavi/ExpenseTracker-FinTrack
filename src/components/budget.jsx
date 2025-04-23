"use client"

import { useState } from "react"
import { useAuth } from "../context/auth-context"
import { formatCurrency, calculateExpensesByCategory, getCurrentMonthExpenses } from "../lib/utils"
import AddCategoryModal from "./add-category-modal"

export default function Budget() {
  const { user, updateCategory, updateBudget } = useAuth()
  const [isEditingBudget, setIsEditingBudget] = useState(false)
  const [newBudget, setNewBudget] = useState(user.budget)
  const [editingCategory, setEditingCategory] = useState(null)
  const [showAddCategory, setShowAddCategory] = useState(false)

  const currentMonthExpenses = getCurrentMonthExpenses(user.expenses)
  const expensesByCategory = calculateExpensesByCategory(currentMonthExpenses, user.categories)

  // Calculate total budget and spent
  const totalBudget = user.budget
  const totalSpent = currentMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0)
  const budgetProgress = Math.min(100, (totalSpent / totalBudget) * 100)

  // Get categories with spending data
  const categoriesWithSpending = user.categories.map((category) => ({
    ...category,
    spent: expensesByCategory[category.id] || 0,
    progress: Math.min(100, ((expensesByCategory[category.id] || 0) / category.budget) * 100),
  }))

  const handleSaveBudget = () => {
    if (newBudget && !isNaN(newBudget) && Number(newBudget) > 0) {
      updateBudget(Number(newBudget))
      setIsEditingBudget(false)
    }
  }

  const handleCategoryBudgetChange = (categoryId, value) => {
    // Create a temporary updated category for UI display
    const updatedCategories = user.categories.map((category) => {
      if (category.id === categoryId) {
        return { ...category, budget: value }
      }
      return category
    })

    // Update the user object temporarily for UI display
    user.categories = updatedCategories
  }

  const handleSaveCategoryBudget = (categoryId) => {
    const category = user.categories.find((c) => c.id === categoryId)
    if (!category || isNaN(category.budget) || Number(category.budget) <= 0) return

    updateCategory(categoryId, { budget: Number(category.budget) })
    setEditingCategory(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Budget</h1>
        <button
          onClick={() => setIsEditingBudget(!isEditingBudget)}
          className="text-purple-600 hover:text-purple-800 font-medium"
        >
          {isEditingBudget ? "Cancel" : "Edit Budget"}
        </button>
      </div>

      <div className="flex justify-between items-center mt-4">
        <h2 className="text-lg font-medium text-gray-800">Categories</h2>
        <button
          onClick={() => setShowAddCategory(true)}
          className="bg-purple-600 text-white px-3 py-1 rounded-lg hover:bg-purple-700 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          Add Category
        </button>
      </div>

      {/* Total Budget Card */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-purple-100">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-gray-800 font-medium">Total Monthly Budget</h3>
          {isEditingBudget ? (
            <div className="flex space-x-2">
              <input
                type="number"
                value={newBudget}
                onChange={(e) => setNewBudget(e.target.value)}
                className="w-32 px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
              <button
                onClick={handleSaveBudget}
                className="bg-purple-600 text-white px-3 py-1 rounded-lg hover:bg-purple-700"
              >
                Save
              </button>
            </div>
          ) : (
            <div className="text-2xl font-bold text-gray-800">{formatCurrency(totalBudget)}</div>
          )}
        </div>

        <div className="flex justify-between text-sm text-gray-500 mb-2">
          <span>Spent: {formatCurrency(totalSpent)}</span>
          <span>Remaining: {formatCurrency(totalBudget - totalSpent)}</span>
        </div>

        <div className="w-full h-2 bg-gray-100 rounded-full">
          <div
            className={`h-full rounded-full ${budgetProgress > 80 ? "bg-red-500" : "bg-purple-500"}`}
            style={{ width: `${budgetProgress}%` }}
          ></div>
        </div>

        {/* <div className="mt-4 bg-purple-50 p-4 rounded-lg">
          <h4 className="font-medium text-purple-800 mb-2">Budget Insights</h4>
          <p className="text-sm text-gray-600">
            {budgetProgress > 90
              ? "You've almost reached your monthly budget limit. Consider reducing non-essential expenses."
              : budgetProgress > 75
                ? "You've used more than 75% of your monthly budget. Monitor your spending closely."
                : budgetProgress > 50
                  ? "You've used about half of your monthly budget. You're on track!"
                  : "You're well within your monthly budget. Great job managing your finances!"}
          </p>

          <div className="mt-3 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Daily budget:</span>
              <span className="font-medium">
                {formatCurrency(
                  totalBudget / new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate(),
                )}
              </span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Days left in month:</span>
              <span className="font-medium">
                {new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate() - new Date().getDate()}
              </span>
            </div>
            <div className="flex justify-between text-gray-600 mt-1 pt-1 border-t border-purple-200">
              <span>Daily budget remaining:</span>
              <span className="font-medium">
                {formatCurrency(
                  (totalBudget - totalSpent) /
                    (new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate() -
                      new Date().getDate() || 1),
                )}
              </span>
            </div>
          </div>
        </div> */}
      </div>

      {/* Category Budgets */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-purple-100">
        <h3 className="text-gray-800 font-medium mb-4">Category Budgets</h3>
        <div className="space-y-6">
          {categoriesWithSpending.map((category) => (
            <div key={category.id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center mr-3"
                    style={{ backgroundColor: category.color + "20" }}
                  >
                    <span className="text-base">{category.icon}</span>
                  </div>
                  <span className="font-medium text-gray-800">{category.name}</span>
                </div>

                {editingCategory === category.id ? (
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      defaultValue={category.budget}
                      onChange={(e) => handleCategoryBudgetChange(category.id, e.target.value)}
                      className="w-24 px-2 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                    />
                    <button
                      onClick={() => handleSaveCategoryBudget(category.id)}
                      className="bg-purple-600 text-white px-2 py-1 rounded-lg hover:bg-purple-700 text-sm"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <div className="font-medium text-gray-800 mr-3">{formatCurrency(category.budget)}</div>
                    <button
                      onClick={() => setEditingCategory(category.id)}
                      className="text-gray-400 hover:text-purple-600"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>

              <div className="flex justify-between text-sm text-gray-500 mb-2">
                <span>Spent: {formatCurrency(category.spent)}</span>
                <span>Remaining: {formatCurrency(category.budget - category.spent)}</span>
              </div>

              <div className="w-full h-2 bg-gray-100 rounded-full">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${category.progress}%`,
                    backgroundColor: category.color,
                  }}
                ></div>
              </div>

              {category.spent > category.budget && (
                <div className="mt-2 text-xs text-red-500">
                  You've exceeded your budget by {formatCurrency(category.spent - category.budget)}
                </div>
              )}

              {category.spent > 0 && category.spent <= category.budget && category.progress > 80 && (
                <div className="mt-2 text-xs text-orange-500">
                  You're approaching your budget limit for this category
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Add Category Modal */}
      {showAddCategory && <AddCategoryModal onClose={() => setShowAddCategory(false)} />}
    </div>
  )
}
