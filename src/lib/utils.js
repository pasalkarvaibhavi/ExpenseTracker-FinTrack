// Format currency
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  }).format(amount)
}

// Format date
export const formatDate = (dateString) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date)
}

// Calculate total expenses
export const calculateTotalExpenses = (expenses) => {
  return expenses.reduce((total, expense) => total + expense.amount, 0)
}

// Calculate expenses by category
export const calculateExpensesByCategory = (expenses, categories) => {
  const expensesByCategory = {}

  categories.forEach((category) => {
    expensesByCategory[category.id] = 0
  })

  expenses.forEach((expense) => {
    if (expensesByCategory[expense.categoryId] !== undefined) {
      expensesByCategory[expense.categoryId] += expense.amount
    }
  })

  return expensesByCategory
}

// Get current month expenses
export const getCurrentMonthExpenses = (expenses) => {
  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()

  return expenses.filter((expense) => {
    const expenseDate = new Date(expense.date)
    return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear
  })
}

// Get today's expenses
export const getTodayExpenses = (expenses) => {
  const today = new Date()
  const todayString = today.toISOString().split("T")[0] // YYYY-MM-DD

  return expenses.filter((expense) => {
    const expenseDate = new Date(expense.date)
    const expenseDateString = expenseDate.toISOString().split("T")[0]
    return expenseDateString === todayString
  })
}

// Get monthly data for charts
export const getMonthlyData = (expenses) => {
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  const monthlyData = monthNames.map((name) => ({ name, amount: 0 }))

  expenses.forEach((expense) => {
    const expenseDate = new Date(expense.date)
    const month = expenseDate.getMonth()
    monthlyData[month].amount += expense.amount
  })

  return monthlyData
}
