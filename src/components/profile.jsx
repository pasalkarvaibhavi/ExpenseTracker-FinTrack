"use client"

import { useState, useRef } from "react"
import { useAuth } from "../context/auth-context"
import { formatCurrency, calculateTotalExpenses } from "../lib/utils"

export default function Profile() {
  const { user, updateProfile, logout } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState(user.name)
  const [avatarPreview, setAvatarPreview] = useState(null)
  const fileInputRef = useRef(null)

  // Generate a default avatar if none exists
  const userAvatar =
    avatarPreview || user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=8B5CF6&color=fff`

  const handleSave = () => {
    if (name.trim() !== "") {
      const updates = { name }
      if (avatarPreview) {
        updates.avatar = avatarPreview
      }
      updateProfile(updates)
      setIsEditing(false)
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const triggerFileSelect = () => {
    fileInputRef.current.click()
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Profile</h1>

      {/* Profile Card */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col md:flex-row items-center md:items-start">
          <div className="mb-4 md:mb-0 md:mr-6 relative">
            <img
              src={userAvatar || "/placeholder.svg"}
              alt={user.name}
              className="w-24 h-24 rounded-full border-4 border-gray-100 object-cover"
            />
            <button
              onClick={triggerFileSelect}
              className="absolute bottom-0 right-0 bg-purple-600 text-white p-2 rounded-full shadow-md hover:bg-purple-700 transition-colors"
              title="Change profile picture"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
          </div>

          <div className="flex-1 text-center md:text-left">
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={handleSave}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex-1"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false)
                      setAvatarPreview(null)
                    }}
                    className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-gray-800 mb-1">{user.name}</h2>
                <p className="text-gray-500 mb-4">{user.email}</p>
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
                >
                  Edit Profile
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Account Stats */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-gray-800 font-medium mb-4">Account Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-500 mb-1">Total Expenses</div>
            <div className="text-xl font-bold text-gray-800">
              {formatCurrency(calculateTotalExpenses(user.expenses))}
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-500 mb-1">Monthly Budget</div>
            <div className="text-xl font-bold text-gray-800">{formatCurrency(user.budget)}</div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-500 mb-1">Total Transactions</div>
            <div className="text-xl font-bold text-gray-800">{user.expenses.length}</div>
          </div>
        </div>
      </div>

      {/* Account Actions */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-gray-800 font-medium mb-4">Account Actions</h3>
        <div className="space-y-3">
          <button onClick={logout} className="flex items-center text-red-600 hover:text-red-800 w-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
                clipRule="evenodd"
              />
            </svg>
            Logout
          </button>
        </div>
      </div>
    </div>
  )
}
