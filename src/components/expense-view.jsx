"use client"

import { useState } from "react"

export default function ExpenseView({ data, onAddExpense }) {
  const [showAddExpense, setShowAddExpense] = useState(false)
  const [newExpense, setNewExpense] = useState({
    category: "",
    amount: "",
    description: "",
  })

  const handleAddExpense = (e) => {
    e.preventDefault()

    if (!newExpense.category || !newExpense.amount) {
      return
    }

    onAddExpense({
      category: newExpense.category,
      amount: Number.parseFloat(newExpense.amount),
      date: new Date(),
      description: newExpense.description,
    })

    setNewExpense({
      category: "",
      amount: "",
      description: "",
    })

    setShowAddExpense(false)
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <button>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div>
          <h2 className="text-white text-center font-medium">Today: ₹{data.todaySpent.toFixed(2)}</h2>
        </div>
        <button className="text-white text-sm font-medium">Upgrade</button>
      </div>

      <div className="bg-white rounded-lg p-2 mt-4">
        <div className="flex">
          <button className="flex-1 bg-blue-500 text-white py-2 rounded-lg">Expense</button>
          <button className="flex-1 text-gray-500 py-2 rounded-lg">Income</button>
        </div>
      </div>

      <div className="bg-white rounded-lg p-4 mt-4">
        <h3 className="text-gray-500 text-sm mb-2">Main balance</h3>
        <h2 className="text-2xl font-bold">${data.totalSpent.toLocaleString()}</h2>

        <div className="mt-4 space-y-3">
          <div>
            <div className="flex justify-between text-sm text-gray-500 mb-1">
              <span>₹0.00</span>
              <span>${data.monthlyBudget.toLocaleString()}</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500"
                style={{ width: `${Math.min(100, (data.totalSpent / data.monthlyBudget) * 100)}%` }}
              ></div>
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowAddExpense(true)}
          className="mt-4 w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors"
        >
          Add New Expense
        </button>

        {showAddExpense && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
              <button
                onClick={() => setShowAddExpense(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <h2 className="text-xl font-bold mb-6">Add New Expense</h2>

              <form onSubmit={handleAddExpense} className="space-y-4">
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    id="category"
                    value={newExpense.category}
                    onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="">Select a category</option>
                    {data.categories.map((cat) => (
                      <option key={cat.name} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                    Amount
                  </label>
                  <input
                    id="amount"
                    type="number"
                    step="0.01"
                    value={newExpense.amount}
                    onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description (Optional)
                  </label>
                  <input
                    id="description"
                    type="text"
                    value={newExpense.description}
                    onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="What was this expense for?"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                >
                  Add Expense
                </button>
              </form>
            </div>
          </div>
        )}

        <div className="mt-6">
          <h3 className="font-medium mb-4">Top Spending</h3>

          <div className="grid grid-cols-5 gap-2 text-center">
            {data.topSpending.map((item) => (
              <div key={item.name} className="flex flex-col items-center">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-1 ${item.bgColor}`}>
                  {item.icon}
                </div>
                <span className="text-xs">{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8">
          <h3 className="font-medium mb-4">Monthly Budget</h3>

          {data.budgetCategories.slice(0, 2).map((category) => (
            <div key={category.name} className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${category.bgColor}`}>
                    {category.icon}
                  </div>
                  <div className="ml-2">
                    <h4 className="font-medium">{category.name}</h4>
                    <p className="text-xs text-gray-500">${category.perDay} Per day</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">{Math.round((category.spent / category.budget) * 100)}%</p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="w-16 text-xs">${category.spent.toLocaleString()}</div>
                <div className="flex-1 mx-2">
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${category.spent > category.budget ? "bg-red-500" : "bg-purple-500"}`}
                      style={{ width: `${Math.min(100, (category.spent / category.budget) * 100)}%` }}
                    ></div>
                  </div>
                </div>
                <div className="w-16 text-right text-xs">${category.budget.toLocaleString()}</div>
              </div>

              <button className="mt-1 text-xs text-white bg-purple-500 px-3 py-1 rounded-full">View all</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

