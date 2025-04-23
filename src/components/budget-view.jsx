"use client"

import { useState } from "react"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { formatCurrency } from "../lib/utils"

export default function BudgetView({ data }) {
  const currentMonth = new Date().getMonth()
  const monthName = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ][currentMonth]

  const [activeTab, setActiveTab] = useState("categories")

  return (
    <div className="p-4">
      <div className="bg-purple-600 text-white p-4 rounded-lg mb-4">
        <div className="flex items-center justify-between mb-2">
          <button className="text-white opacity-80">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <h2 className="text-lg font-semibold">Budget</h2>
          <button className="text-white opacity-80">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
            </svg>
          </button>
        </div>

        <div className="text-3xl font-bold">{formatCurrency(data.monthlyData[currentMonth].amount)}</div>
        <div className="text-sm opacity-80">{monthName}</div>

        <div className="mt-4 h-40">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.monthlyData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.2)" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "white", fontSize: 10 }} />
              <YAxis hide={true} />
              <Tooltip
                contentStyle={{ backgroundColor: "white", color: "#6b21a8", borderRadius: "8px", border: "none" }}
                formatter={(value) => [`${value}`, "Amount"]}
              />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="white"
                strokeWidth={2}
                dot={{ fill: "white", stroke: "white", strokeWidth: 2, r: 4 }}
                activeDot={{ fill: "#6b21a8", stroke: "white", strokeWidth: 2, r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="w-full">
        <div className="w-full grid grid-cols-2 mb-4">
          <button
            onClick={() => setActiveTab("categories")}
            className={`py-2 ${activeTab === "categories" ? "border-b-2 border-purple-600" : ""}`}
          >
            CATEGORIES
          </button>
          <button
            onClick={() => setActiveTab("merchants")}
            className={`py-2 ${activeTab === "merchants" ? "border-b-2 border-purple-600" : ""}`}
          >
            MERCHANTS
          </button>
        </div>

        {activeTab === "categories" ? (
          <div className="space-y-4">
            {data.categories.map((category) => (
              <div key={category.name} className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex items-center mb-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                    style={{ backgroundColor: category.color }}
                  >
                    <div className="text-white">{category.icon}</div>
                  </div>
                  <div>
                    <div className="font-medium">{category.name}</div>
                    <div className="text-xs text-gray-500">₹{category.budget} Per Month</div>
                  </div>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                  <div
                    className="h-2.5 rounded-full"
                    style={{
                      width: `₹{Math.min(100, (category.amount / category.budget) * 100)}%`,
                      backgroundColor: category.color,
                    }}
                  ></div>
                </div>

                <div className="flex justify-between text-xs text-gray-500 mb-2">
                  <span>₹{category.amount.toFixed(2)}</span>
                  <span>₹{category.budget.toFixed(2)}</span>
                </div>

                {category.amount > category.budget && (
                  <div className="text-xs text-red-500">
                    You are {formatCurrency(category.amount - category.budget)} over your budget
                  </div>
                )}

                {category.amount <= category.budget && (
                  <div className="text-xs text-green-500">Your spending is within your budget</div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-40 bg-white rounded-lg">
            <p className="text-gray-500">Merchant tracking coming soon</p>
          </div>
        )}
      </div>
    </div>
  )
}

