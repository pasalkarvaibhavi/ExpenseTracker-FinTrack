"use client"

import { Home, PieChart, BarChart3, Settings, Plus } from "lucide-react"

export default function Navbar({ activeTab, setActiveTab }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around py-2 max-w-md mx-auto">
      <button
        onClick={() => setActiveTab("dashboard")}
        className={`flex flex-col items-center p-2 ${activeTab === "dashboard" ? "text-purple-600" : "text-gray-500"}`}
      >
        <Home className="w-5 h-5" />
        <span className="text-xs mt-1">Home</span>
      </button>

      <button
        onClick={() => setActiveTab("expenses")}
        className={`flex flex-col items-center p-2 ${activeTab === "expenses" ? "text-purple-600" : "text-gray-500"}`}
      >
        <PieChart className="w-5 h-5" />
        <span className="text-xs mt-1">Expenses</span>
      </button>

      <button className="relative flex flex-col items-center">
        <div className="absolute -top-5 bg-purple-600 w-12 h-12 rounded-full flex items-center justify-center text-white">
          <Plus className="w-6 h-6" />
        </div>
        <div className="mt-7 text-xs text-transparent">Add</div>
      </button>

      <button
        onClick={() => setActiveTab("budget")}
        className={`flex flex-col items-center p-2 ${activeTab === "budget" ? "text-purple-600" : "text-gray-500"}`}
      >
        <BarChart3 className="w-5 h-5" />
        <span className="text-xs mt-1">Budget</span>
      </button>

      <button className="flex flex-col items-center p-2 text-gray-500">
        <Settings className="w-5 h-5" />
        <span className="text-xs mt-1">Settings</span>
      </button>
    </div>
  )
}

