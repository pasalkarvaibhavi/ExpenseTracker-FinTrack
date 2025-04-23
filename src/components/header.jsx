"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../context/auth-context"
import { formatCurrency } from "../lib/utils"
import { calculateTotalExpenses, getCurrentMonthExpenses } from "../lib/utils"

export default function Header({ setShowAddExpense, activeView, setActiveView }) {
  const { user, logout } = useAuth()
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [selectedExpense, setSelectedExpense] = useState(null)

  const currentMonthExpenses = getCurrentMonthExpenses(user.expenses)
  const totalSpent = calculateTotalExpenses(currentMonthExpenses)

  // Generate a default avatar if none exists
  const userAvatar =
    user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=8B5CF6&color=fff`

  // Handle search functionality
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setSearchResults([])
      setShowSearchResults(false)
      return
    }

    const term = searchTerm.toLowerCase()
    const results = user.expenses
      .filter((expense) => {
        const category = user.categories.find((c) => c.id === expense.categoryId)
        const categoryName = category ? category.name.toLowerCase() : ""
        const description = expense.description ? expense.description.toLowerCase() : ""

        return categoryName.includes(term) || description.includes(term) || expense.amount.toString().includes(term)
      })
      .slice(0, 5) // Limit to 5 results

    setSearchResults(results)
    setShowSearchResults(true)
  }, [searchTerm, user.expenses, user.categories])

  const handleSearchBlur = () => {
    // Delay hiding the results to allow for clicking on them
    setTimeout(() => {
      setShowSearchResults(false)
    }, 200)
  }

  const handleSearchResultClick = (expense) => {
    setSelectedExpense(expense)
    setSearchTerm("")
    setShowSearchResults(false)

    // Navigate to expenses view and highlight the selected expense
    setActiveView("expenses")

    // Scroll to the expense in the expenses list
    setTimeout(() => {
      const expenseElement = document.getElementById(`expense-${expense.id}`)
      if (expenseElement) {
        expenseElement.scrollIntoView({ behavior: "smooth" })
        expenseElement.classList.add("bg-purple-50")
        setTimeout(() => {
          expenseElement.classList.remove("bg-purple-50")
        }, 2000)
      }
    }, 100)
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="flex items-center justify-between p-3">
        {/* Mobile Menu Button */}
        <button className="md:hidden text-gray-600" onClick={() => setShowMobileMenu(!showMobileMenu)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Logo */}
        <div className="md:hidden flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-7 w-7 text-purple-600"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
              clipRule="evenodd"
            />
          </svg>
          <h1 className="text-lg font-bold ml-1 text-gray-800">FinTrack</h1>
        </div>

        {/* Search Bar */}
        <div className="hidden md:block flex-1 max-w-md mx-8 relative">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search expenses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onBlur={handleSearchBlur}
              onFocus={() => searchTerm.trim() !== "" && setShowSearchResults(true)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>

          {/* Search Results Dropdown */}
          {showSearchResults && searchResults.length > 0 && (
            <div className="absolute mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-20">
              <ul className="py-1">
                {searchResults.map((expense) => {
                  const category = user.categories.find((c) => c.id === expense.categoryId)
                  return (
                    <li
                      key={expense.id}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleSearchResultClick(expense)}
                    >
                      <div className="flex items-center">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center mr-3"
                          style={{ backgroundColor: category?.color + "20" }}
                        >
                          <span>{category?.icon}</span>
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">{category?.name}</div>
                          <div className="text-xs text-gray-500">{expense.description || "No description"}</div>
                        </div>
                        <div className="font-medium">{formatCurrency(expense.amount)}</div>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </div>
          )}

          {showSearchResults && searchResults.length === 0 && searchTerm.trim() !== "" && (
            <div className="absolute mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-20 p-4 text-center text-gray-500">
              No expenses found matching "{searchTerm}"
            </div>
          )}
        </div>

        <div className="flex items-center space-x-4">
          {/* Add Expense Button */}
          <button
            onClick={() => setShowAddExpense(true)}
            className="bg-gradient-to-r from-purple-500 to-purple-700 text-white px-4 py-2 rounded-lg font-medium hover:from-purple-600 hover:to-purple-800 transition-colors shadow-sm hidden md:block"
          >
            Add Expense
            <span className="font-">+</span>
          </button>

          {/* Mobile Add Button */}
          <button
            onClick={() => setShowAddExpense(true)}
            className="md:hidden bg-purple-600 text-white p-2 rounded-full"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          {/* Current Month Spending */}
          <div className="hidden md:block">
            <div className="text-xs text-gray-500">This Month</div>
            <div className="font-bold text-gray-800">{formatCurrency(totalSpent)}</div>
          </div>

          {/* User Menu */}
          <div className="relative flex items-center">
            <button className="flex items-center focus:outline-none mr-4" onClick={() => setActiveView("profile")}>
              <img
                src={userAvatar || "/placeholder.svg"}
                alt={user.name}
                className="w-8 h-8 rounded-full border border-purple-200 object-cover"
              />
            </button>

            {/* Logout Button - Desktop */}
            <button
              onClick={logout}
              className="hidden md:flex items-center text-red-600 hover:text-red-800"
              title="Logout"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="md:hidden bg-white border-t border-gray-200 p-4">
          <nav className="space-y-2">
            <button
              onClick={() => {
                setActiveView("overview")
                setShowMobileMenu(false)
              }}
              className={`flex items-center w-full px-4 py-2 rounded-lg text-sm ${
                activeView === "overview" ? "bg-purple-100 text-purple-700" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
              </svg>
              Overview
            </button>
            <button
              onClick={() => {
                setActiveView("expenses")
                setShowMobileMenu(false)
              }}
              className={`flex items-center w-full px-4 py-2 rounded-lg text-sm ${
                activeView === "expenses" ? "bg-purple-100 text-purple-700" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
              </svg>
              Expenses
            </button>
            <button
              onClick={() => {
                setActiveView("budget")
                setShowMobileMenu(false)
              }}
              className={`flex items-center w-full px-4 py-2 rounded-lg text-sm ${
                activeView === "budget" ? "bg-purple-100 text-purple-700" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 11a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              Budget
            </button>
            <button
              onClick={() => {
                setActiveView("reports")
                setShowMobileMenu(false)
              }}
              className={`flex items-center w-full px-4 py-2 rounded-lg text-sm ${
                activeView === "reports" ? "bg-purple-100 text-purple-700" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm2 10a1 1 0 10-2 0v3a1 1 0 102 0v-3zm4-1a1 1 0 011 1v3a1 1 0 11-2 0v-3a1 1 0 011-1zm-2-7a1 1 0 00-1 1v3a1 1 0 102 0V5a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              Reports
            </button>
            <button
              onClick={() => {
                setActiveView("trends")
                setShowMobileMenu(false)
              }}
              className={`flex items-center w-full px-4 py-2 rounded-lg text-sm ${
                activeView === "trends" ? "bg-purple-100 text-purple-700" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              Trends
            </button>
            <button
              onClick={() => {
                setActiveView("alerts")
                setShowMobileMenu(false)
              }}
              className={`flex items-center w-full px-4 py-2 rounded-lg text-sm ${
                activeView === "alerts" ? "bg-purple-100 text-purple-700" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              Alerts & Tips
            </button>
            <button
              onClick={logout}
              className="flex items-center w-full px-4 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
                  clipRule="evenodd"
                />
              </svg>
              Logout
            </button>
          </nav>
        </div>
      )}
    </header>
  )
}
