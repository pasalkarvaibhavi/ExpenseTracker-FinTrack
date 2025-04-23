"use client"

import { useRef, useState } from "react"
import { useAuth } from "@/context/auth-context"

export default function UserProfile({ onClose }) {
  const { user, logout } = useAuth()
  const fileInputRef = useRef(null)
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || "/cartoon-avatar.png")

  if (!user) return null

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarPreview(reader.result)
        // TODO: Upload to server or cloud storage if needed
      }
      reader.readAsDataURL(file)
    }
  }

  const triggerFileSelect = () => fileInputRef.current.click()

  return (
    <div className="bg-white rounded-lg p-4 shadow-lg max-w-md mx-auto">
      {onClose && (
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Your Profile</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      )}

      {/* Avatar section */}
      <div className="flex flex-col items-center mb-6">
        <div className="relative">
          <img
            src={avatarPreview}
            alt={user.name}
            className="w-20 h-20 rounded-full mb-3 border-4 border-purple-100 object-cover"
          />
          <button
            onClick={triggerFileSelect}
            className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow hover:bg-gray-100"
            title="Change Profile Picture"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.232 5.232l3.536 3.536M9 13h3l6.293-6.293a1 1 0 00-1.414-1.414L10.586 11H9v2z"
              />
            </svg>
          </button>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
        <h3 className="text-xl font-bold">{user.name}</h3>
        <p className="text-gray-500">{user.email}</p>
      </div>

      {/* Summary */}
      <div className="space-y-4">
        <div className="bg-purple-50 p-4 rounded-lg">
          <h4 className="font-medium text-purple-700 mb-2">Account Summary</h4>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-sm text-gray-500">Total Spent</p>
              <p className="font-bold">${user.expenseData.totalSpent.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Monthly Budget</p>
              <p className="font-bold">${user.expenseData.monthlyBudget.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Settings */}
        <div>
          <h4 className="font-medium mb-2">Account Settings</h4>
          <ul className="space-y-2">
            <li>
              <button className="flex items-center text-gray-700 hover:text-purple-600 w-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                Edit Profile
              </button>
            </li>
            <li>
              <button className="flex items-center text-gray-700 hover:text-purple-600 w-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                Change Password
              </button>
            </li>
            <li>
              <button className="flex items-center text-gray-700 hover:text-purple-600 w-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Help & Support
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Logout */}
      <div className="mt-6 pt-4 border-t">
        <button
          onClick={logout}
          className="w-full bg-red-100 text-red-600 py-2 rounded-lg font-medium hover:bg-red-200 transition-colors flex items-center justify-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          Logout
        </button>
      </div>
    </div>
  )
}
