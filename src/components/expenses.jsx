"use client"

import { useState } from "react"
import { useAuth } from "../context/auth-context"
import { formatCurrency, formatDate } from "../lib/utils"

export default function Expenses() {
  const { user, deleteExpense } = useAuth()
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("date")
  const [sortOrder, setSortOrder] = useState("desc")

  // Filter expenses by category
  const filteredExpenses = user.expenses.filter((expense) => {
    if (selectedCategory === "all") return true
    return expense.categoryId === selectedCategory
  })

  // Sort expenses
  const sortedExpenses = [...filteredExpenses].sort((a, b) => {
    if (sortBy === "date") {
      const dateA = new Date(a.date)
      const dateB = new Date(b.date)
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA
    } else if (sortBy === "amount") {
      return sortOrder === "asc" ? a.amount - b.amount : b.amount - a.amount
    }
    return 0
  })

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this expense?")) {
      deleteExpense(id)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Expenses</h1>
        <div className="flex space-x-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          >
            <option value="all">All Categories</option>
            {user.categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [newSortBy, newSortOrder] = e.target.value.split("-")
              setSortBy(newSortBy)
              setSortOrder(newSortOrder)
            }}
            className="px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          >
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="amount-desc">Highest Amount</option>
            <option value="amount-asc">Lowest Amount</option>
          </select>
        </div>
      </div>

      {/* Expenses List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {sortedExpenses.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-gray-500">No expenses found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {sortedExpenses.map((expense) => {
                  const category = user.categories.find((c) => c.id === expense.categoryId)
                  return (
                    <tr
                      key={expense.id}
                      id={`expense-${expense.id}`}
                      className="hover:bg-gray-50 transition-colors duration-200"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center mr-3"
                            style={{ backgroundColor: category?.color + "20" }}
                          >
                            <span className="text-base">{category?.icon}</span>
                          </div>
                          <span className="font-medium text-gray-800">{category?.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600">{expense.description || "-"}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600">{formatDate(expense.date)}</td>
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-800">
                        {formatCurrency(expense.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button onClick={() => handleDelete(expense.id)} className="text-red-600 hover:text-red-800">
                          Delete
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
