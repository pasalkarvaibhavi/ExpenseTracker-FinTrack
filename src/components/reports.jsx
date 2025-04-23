"use client"

import { useState, useEffect, useRef } from "react"
import { useAuth } from "../context/auth-context"
import { formatCurrency, formatDate } from "../lib/utils"
import MonthlyTrendChart from "./monthly-trend-chart"
import { getMonthlyData, getYearlyData, getCategoryTotals } from "../lib/report-utils"
import jsPDF from "jspdf"
import "jspdf-autotable"
import * as XLSX from "xlsx"


export default function Reports() {
  const { user } = useAuth()
  const [reportType, setReportType] = useState("monthly") // monthly, yearly, category
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())
  const [reportData, setReportData] = useState(null)
  const [loading, setLoading] = useState(true)
  const reportRef = useRef(null)

  const years = Array.from(new Set(user.expenses.map((expense) => new Date(expense.date).getFullYear()))).sort(
    (a, b) => b - a,
  )

  const months = [
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
  ]

  useEffect(() => {
    setLoading(true)

    let data
    if (reportType === "monthly") {
      data = getMonthlyData(user.expenses, selectedYear, selectedMonth, user.categories)
      // If data exists, update the budget with the user's actual budget
      if (data) {
        data.budget = user.budget
      }
    } else if (reportType === "yearly") {
      data = getYearlyData(user.expenses, selectedYear, user.categories)
      // If data exists, update the budget with the user's annual budget (monthly * 12)
      if (data) {
        data.budget = user.budget * 12
      }
    } else if (reportType === "category") {
      data = getCategoryTotals(user.expenses, user.categories)
    }

    setReportData(data)
    setLoading(false)
  }, [reportType, selectedYear, selectedMonth, user.expenses, user.categories, user.budget])

  const exportToPDF = () => {
    if (!reportData) return

    const doc = new jsPDF()

    // Add title
    let title = ""
    if (reportType === "monthly") {
      title = `Monthly Report - ${months[selectedMonth]} ${selectedYear}`
    } else if (reportType === "yearly") {
      title = `Yearly Report - ${selectedYear}`
    } else {
      title = "Category Report"
    }

    doc.setFontSize(18)
    doc.text(title, 14, 22)

    // Add summary
    doc.setFontSize(12)
    doc.text(`Total Expenses: ${formatCurrency(reportData.totalExpenses)}`, 14, 32)

    if (reportType !== "category") {
      doc.text(`Budget: ${formatCurrency(reportData.budget)}`, 14, 38)
      const remainingText =
        reportData.totalExpenses <= reportData.budget
          ? `Remaining: ${formatCurrency(reportData.budget - reportData.totalExpenses)}`
          : `Over Budget: ${formatCurrency(reportData.totalExpenses - reportData.budget)}`
      doc.text(remainingText, 14, 44)
    }

    // Add category breakdown table
    doc.setFontSize(14)
    doc.text("Category Breakdown", 14, 54)

    const tableColumns =
      reportType !== "category"
        ? ["Category", "Amount", "% of Total", "Budget", "Transactions"]
        : ["Category", "Amount", "% of Total", "Transactions"]

    const tableRows = reportData.categoryBreakdown.map((category) => {
      if (reportType !== "category") {
        return [
          category.name,
          formatCurrency(category.amount),
          `${category.percentage.toFixed(1)}%`,
          formatCurrency(category.budget),
          category.transactions.toString(),
        ]
      } else {
        return [
          category.name,
          formatCurrency(category.amount),
          `${category.percentage.toFixed(1)}%`,
          category.transactions.toString(),
        ]
      }
    })

    doc.autoTable({
      head: [tableColumns],
      body: tableRows,
      startY: 58,
      theme: "grid",
      styles: { fontSize: 10 },
      headStyles: { fillColor: [136, 92, 246] },
    })

    // Add transactions if available
    if (reportData.transactions && reportData.transactions.length > 0) {
      const finalY = doc.lastAutoTable.finalY || 120

      doc.setFontSize(14)
      doc.text("Transactions", 14, finalY + 10)

      const transactionColumns = ["Date", "Category", "Description", "Amount"]
      const transactionRows = reportData.transactions.map((transaction) => {
        const category = user.categories.find((c) => c.id === transaction.categoryId)
        return [
          formatDate(transaction.date),
          category?.name || "Unknown",
          transaction.description || "-",
          formatCurrency(transaction.amount),
        ]
      })

      doc.autoTable({
        head: [transactionColumns],
        body: transactionRows,
        startY: finalY + 14,
        theme: "grid",
        styles: { fontSize: 10 },
        headStyles: { fillColor: [136, 92, 246] },
      })
    }

    // Save the PDF
    doc.save(`${title.replace(/\s+/g, "_").toLowerCase()}.pdf`)
  }

  const exportToExcel = () => {
    if (!reportData) return

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new()

    // Title
    let title = ""
    if (reportType === "monthly") {
      title = `Monthly Report - ${months[selectedMonth]} ${selectedYear}`
    } else if (reportType === "yearly") {
      title = `Yearly Report - ${selectedYear}`
    } else {
      title = "Category Report"
    }

    // Summary data
    const summaryData = [
      ["", ""],
      ["Total Expenses", reportData.totalExpenses],
    ]

    if (reportType !== "category") {
      summaryData.push(["Budget", reportData.budget])
      summaryData.push([
        reportData.totalExpenses <= reportData.budget ? "Remaining" : "Over Budget",
        Math.abs(reportData.budget - reportData.totalExpenses),
      ])
    }

    // Category breakdown
    const categoryHeaders =
      reportType !== "category"
        ? ["Category", "Amount", "% of Total", "Budget", "Transactions"]
        : ["Category", "Amount", "% of Total", "Transactions"]

    const categoryData = reportData.categoryBreakdown.map((category) => {
      if (reportType !== "category") {
        return [category.name, category.amount, category.percentage, category.budget, category.transactions]
      } else {
        return [category.name, category.amount, category.percentage, category.transactions]
      }
    })

    // Combine all data
    const allData = [[title], [""], ...summaryData, [""], ["Category Breakdown"], categoryHeaders, ...categoryData]

    // Add transactions if available
    if (reportData.transactions && reportData.transactions.length > 0) {
      allData.push([""])
      allData.push(["Transactions"])
      allData.push(["Date", "Category", "Description", "Amount"])

      reportData.transactions.forEach((transaction) => {
        const category = user.categories.find((c) => c.id === transaction.categoryId)
        allData.push([
          new Date(transaction.date),
          category?.name || "Unknown",
          transaction.description || "-",
          transaction.amount,
        ])
      })
    }

    // Create worksheet and add to workbook
    const ws = XLSX.utils.aoa_to_sheet(allData)
    XLSX.utils.book_append_sheet(wb, ws, "Report")

    // Save the file
    XLSX.writeFile(wb, `${title.replace(/\s+/g, "_").toLowerCase()}.xlsx`)
  }

  return (
    <div className="space-y-6" ref={reportRef}>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Financial Reports</h1>
        <div className="flex space-x-2">
          <button
            onClick={exportToPDF}
            className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center"
            disabled={!reportData}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z"
                clipRule="evenodd"
              />
            </svg>
            Export PDF
          </button>
          <button
            onClick={exportToExcel}
            className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center"
            disabled={!reportData}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
            Export Excel
          </button>
        </div>
      </div>

      {/* Report Controls */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-purple-100">
        <div className="flex flex-wrap gap-4">
          <div>
            <label htmlFor="reportType" className="block text-sm font-medium text-gray-700 mb-1">
              Report Type
            </label>
            <select
              id="reportType"
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="monthly">Monthly Report</option>
              <option value="yearly">Yearly Report</option>
              <option value="category">Category Report</option>
            </select>
          </div>

          {reportType !== "category" && (
            <div>
              <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">
                Year
              </label>
              <select
                id="year"
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                {years.length > 0 ? (
                  years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))
                ) : (
                  <option value={new Date().getFullYear()}>{new Date().getFullYear()}</option>
                )}
              </select>
            </div>
          )}

          {reportType === "monthly" && (
            <div>
              <label htmlFor="month" className="block text-sm font-medium text-gray-700 mb-1">
                Month
              </label>
              <select
                id="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                className="px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                {months.map((month, index) => (
                  <option key={month} value={index}>
                    {month}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Report Content */}
      {loading ? (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-purple-100 text-center">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading report data...</p>
        </div>
      ) : reportData ? (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-purple-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            {reportType === "monthly"
              ? `${months[selectedMonth]} ${selectedYear} Report`
              : reportType === "yearly"
                ? `${selectedYear} Annual Report`
                : "Category Breakdown Report"}
          </h2>

          {/* Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-purple-700 mb-1">Total Expenses</h3>
              <p className="text-2xl font-bold">{formatCurrency(reportData.totalExpenses)}</p>
            </div>

            {reportType !== "category" && (
              <>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-purple-700 mb-1">Budget</h3>
                  <p className="text-2xl font-bold">{formatCurrency(reportData.budget)}</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-purple-700 mb-1">
                    {reportData.totalExpenses <= reportData.budget ? "Remaining" : "Over Budget"}
                  </h3>
                  <p
                    className={`text-2xl font-bold ${reportData.totalExpenses <= reportData.budget ? "text-green-600" : "text-red-600"}`}
                  >
                    {formatCurrency(Math.abs(reportData.budget - reportData.totalExpenses))}
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Chart */}
          {reportType !== "category" && (
            <div className="mb-6 h-60 w-90">
              <MonthlyTrendChart data={reportData.chartData} />
            </div>
          )}

          {/* Category Breakdown */}
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-3">Category Breakdown</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      % of Total
                    </th>
                    {reportType !== "category" && (
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Budget
                      </th>
                    )}
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Transactions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {reportData.categoryBreakdown.map((category) => (
                    <tr key={category.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center mr-3"
                            style={{ backgroundColor: category.color + "20" }}
                          >
                            <span className="text-base">{category.icon}</span>
                          </div>
                          <span className="font-medium text-gray-800">{category.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-800">
                        {formatCurrency(category.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600">{category.percentage.toFixed(1)}%</td>
                      {reportType !== "category" && (
                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">{formatCurrency(category.budget)}</td>
                      )}
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600">{category.transactions}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Transactions */}
          {reportData.transactions && reportData.transactions.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-800 mb-3">Transactions</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {reportData.transactions.map((transaction) => {
                      const category = user.categories.find((c) => c.id === transaction.categoryId)
                      return (
                        <tr key={transaction.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-gray-600">{formatDate(transaction.date)}</td>
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
                          <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                            {transaction.description || "-"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-800">
                            {formatCurrency(transaction.amount)}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-purple-100 text-center">
          <p className="text-gray-600">No data available for the selected period.</p>
        </div>
      )}
    </div>
  )
}
