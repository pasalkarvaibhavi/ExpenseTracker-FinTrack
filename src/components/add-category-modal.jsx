"use client"

import { useState } from "react"
import { useAuth } from "../context/auth-context"

const EMOJI_OPTIONS = [
  "🏠",
  "🚗",
  "🛒",
  "💡",
  "🍽️",
  "🎬",
  "🛍️",
  "⚕️",
  "💼",
  "📚",
  "✈️",
  "🎮",
  "🎵",
  "🏋️",
  "🎁",
  "💰",
  "💻",
  "📱",
  "👕",
  "🏦",
  "🍔",
  "☕",
  "🍺",
  "🐶",
]

const COLOR_OPTIONS = [
  "#3B82F6",
  "#EF4444",
  "#10B981",
  "#F59E0B",
  "#8B5CF6",
  "#6366F1",
  "#14B8A6",
  "#F97316",
  "#0EA5E9",
  "#A855F7",
  "#D946EF",
  "#F43F5E",
  "#64748B",
  "#22C55E", // Emerald Green
  "#E11D48", // Rose
  "#0F766E"  // Teal
];

 

export default function AddCategoryModal({ onClose }) {
  const { user, addCategory } = useAuth()
  const [formData, setFormData] = useState({
    name: "",
    icon: "🏠",
    color: "#3B82F6",
    budget: "",
  })
  const [error, setError] = useState("")

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError("")

    try {
      // Validate form
      if (!formData.name.trim()) {
        throw new Error("Please enter a category name")
      }

      if (!formData.budget || isNaN(formData.budget) || Number(formData.budget) <= 0) {
        throw new Error("Please enter a valid budget amount")
      }

      // Add category
      const result = addCategory({
        name: formData.name.trim(),
        icon: formData.icon,
        color: formData.color,
        budget: Number(formData.budget),
      })

      if (!result.success) {
        throw new Error(result.message || "Failed to add category")
      }

      // Close modal
      onClose()
    } catch (error) {
      setError(error.message)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
<div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full px-6 py-2 relative">

        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
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

        <h2 className="text-2xl font-bold mb-6 text-gray-800">Add New Category</h2>

        {error && <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Category Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="e.g., Groceries, Entertainment"
            />
          </div>

          <div>
            <label htmlFor="icon" className="block text-sm font-medium text-gray-700 mb-1">
              Icon
            </label>
            <div className="grid grid-cols-8 gap-1 mb-2">
              {EMOJI_OPTIONS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  className={`w-10 h-10 flex items-center justify-center rounded-lg text-xl ${
                    formData.icon === emoji
                      ? "bg-purple-100 border-2 border-purple-500"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                  onClick={() => setFormData((prev) => ({ ...prev, icon: emoji }))}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-1">
              Color
            </label>
            <div className="grid grid-cols-8 gap-1 mb-2">
              {COLOR_OPTIONS.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`w-10 h-10 rounded-lg ${
                    formData.color === color ? "ring-2 ring-offset-2 ring-purple-500" : ""
                  }`}

                  
                  style={{ backgroundColor: color }}
                  onClick={() => setFormData((prev) => ({ ...prev, color: color }))}
                ></button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-1">
              Monthly Budget
            </label>
            <input
              id="budget"
              name="budget"
              type="number"
              step="0.01"
              value={formData.budget}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="0.00"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-500 to-purple-700 text-white py-2 px-4 rounded-lg hover:from-purple-600 hover:to-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors"
          >
            Add Category
          </button>
        </form>
      </div>
    </div>
  )
}
