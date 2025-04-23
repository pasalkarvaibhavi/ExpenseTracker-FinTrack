"use client"

import { useAuth } from "../context/auth-context"

export default function Sidebar({ activeView, setActiveView }) {
  const { user, logout } = useAuth()

  const menuItems = [
    {
      id: "overview",
      label: "Overview",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
          <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
        </svg>
      ),
    },
    {
      id: "expenses",
      label: "Expenses",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      id: "budget",
      label: "Budget",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 11a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 102 0V6a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      id: "reports",
      label: "Reports",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm2 10a1 1 0 10-2 0v3a1 1 0 102 0v-3zm4-1a1 1 0 011 1v3a1 1 0 11-2 0v-3a1 1 0 011-1zm-2-7a1 1 0 00-1 1v3a1 1 0 102 0V5a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      id: "trends",
      label: "Trends",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      id: "alerts",
      label: "Alerts & Tips",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      id: "profile",
      label: "Profile",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
        </svg>
      ),
    },
  ]

  // Generate a default avatar if none exists
  const userAvatar =
    user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=8B5CF6&color=fff`

  return (
    <div className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="p-3 border-b border-gray-200 bg-gradient-to-r from-purple-600 to-purple-800 text-white">
        <div className="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 text-white"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 5a1 1 0 100 2h1a2 2 0 011.732 1H7a1 1 0 100 2h2.732A2 2 0 018 11H7a1 1 0 00-.707 1.707l3 3a1 1 0 001.414-1.414l-1.483-1.484A4.008 4.008 0 0011.874 10H13a1 1 0 100-2h-1.126a3.976 3.976 0 00-.41-1H13a1 1 0 100-2H7z"
              clipRule="evenodd"
            />
          </svg>
          <h1 className="text-2xl font-bold ml-2 text-white">FinTrack</h1>
        </div>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center">
          <img
            src={userAvatar || "/placeholder.svg"}
            alt={user.name}
            className="w-10 h-10 rounded-full mr-3 border-2 border-purple-200 object-cover"
          />
          <div>
            <div className="font-medium text-gray-800">{user.name}</div>
            <div className="text-xs text-gray-500">{user.email}</div>
          </div>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => setActiveView(item.id)}
                className={`flex items-center w-full px-4 py-2 rounded-lg text-sm ${
                  activeView === item.id
                    ? "bg-purple-100 text-purple-700 font-medium"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout - positioned at the very bottom */}
      <div className="p-4 mt-auto border-t border-gray-200">
        <button
          onClick={logout}
          className="flex items-center w-full px-4 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-3 text-red-500"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
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
  )
}
