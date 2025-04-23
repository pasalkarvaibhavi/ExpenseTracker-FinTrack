import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts"
import { formatCurrency } from "../lib/utils"

export default function DashboardView({ data }) {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  const currentMonth = new Date().getMonth()

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Billing Reports</h2>
        <div className="text-sm text-gray-500">{months[currentMonth]}</div>
      </div>

      <div className="overflow-x-auto pb-2">
        <div className="flex space-x-4 min-w-max">
          {months.map((month, i) => (
            <div
              key={month}
              className={`px-3 py-1 rounded-full text-xs ${
                i === currentMonth ? "bg-purple-600 text-white" : "text-gray-500"
              }`}
            >
              {month}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 bg-white rounded-lg p-4 shadow-sm">
        <div className="text-center mb-2">
          <div className="text-sm text-gray-500">Total</div>
          <div className="text-2xl font-bold">{formatCurrency(data.totalSpent)}</div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data.categories}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="amount"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {data.categories.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-3">Expenses</h3>
        <div className="space-y-3">
          {data.categories.map((category) => (
            <div key={category.name} className="flex items-center bg-white p-3 rounded-lg shadow-sm">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                style={{ backgroundColor: category.color + "20" }}
              >
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-white"
                  style={{ backgroundColor: category.color }}
                >
                  {category.icon}
                </div>
              </div>
              <div className="flex-1">
                <div className="font-medium">{category.name}</div>
                <div className="text-xs text-gray-500">{category.transactions} transactions</div>
              </div>
              <div className="font-semibold">{formatCurrency(category.amount)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

