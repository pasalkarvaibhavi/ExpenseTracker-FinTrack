// Helper functions for generating reports

export function getMonthlyData(expenses, year, month, categories) {
  // Filter expenses for the selected month and year
  const filteredExpenses = expenses.filter((expense) => {
    const expenseDate = new Date(expense.date)
    return expenseDate.getFullYear() === year && expenseDate.getMonth() === month
  })

  if (filteredExpenses.length === 0) {
    return null
  }

  // Calculate total expenses
  const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0)

  // Use the user's monthly budget directly instead of summing category budgets
  // We'll get this from the user object in the Reports component
  const budget = 5000 // This will be replaced with the actual user budget in the Reports component

  // Generate daily data for the chart
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const chartData = []

  for (let day = 1; day <= daysInMonth; day++) {
    const dayExpenses = filteredExpenses.filter((expense) => {
      const expenseDate = new Date(expense.date)
      return expenseDate.getDate() === day
    })

    const dayTotal = dayExpenses.reduce((sum, expense) => sum + expense.amount, 0)

    chartData.push({
      name: `${day}`,
      amount: dayTotal,
    })
  }

  // Calculate category breakdown
  const categoryBreakdown = categories
    .map((category) => {
      const categoryExpenses = filteredExpenses.filter((expense) => expense.categoryId === category.id)
      const amount = categoryExpenses.reduce((sum, expense) => sum + expense.amount, 0)

      return {
        id: category.id,
        name: category.name,
        icon: category.icon,
        color: category.color,
        amount: amount,
        budget: category.budget,
        percentage: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0,
        transactions: categoryExpenses.length,
      }
    })
    .filter((category) => category.amount > 0)
    .sort((a, b) => b.amount - a.amount)

  return {
    totalExpenses,
    budget,
    chartData,
    categoryBreakdown,
    transactions: filteredExpenses.sort((a, b) => new Date(b.date) - new Date(a.date)),
  }
}

export function getYearlyData(expenses, year, categories) {
  // Filter expenses for the selected year
  const filteredExpenses = expenses.filter((expense) => {
    const expenseDate = new Date(expense.date)
    return expenseDate.getFullYear() === year
  })

  if (filteredExpenses.length === 0) {
    return null
  }

  // Calculate total expenses
  const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0)

  // Use the user's monthly budget * 12 for yearly budget
  // We'll get this from the user object in the Reports component
  const budget = 5000 * 12 // This will be replaced with the actual user budget * 12 in the Reports component

  // Generate monthly data for the chart
  const chartData = []
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

  for (let month = 0; month < 12; month++) {
    const monthExpenses = filteredExpenses.filter((expense) => {
      const expenseDate = new Date(expense.date)
      return expenseDate.getMonth() === month
    })

    const monthTotal = monthExpenses.reduce((sum, expense) => sum + expense.amount, 0)

    chartData.push({
      name: months[month],
      amount: monthTotal,
    })
  }

  // Calculate category breakdown
  const categoryBreakdown = categories
    .map((category) => {
      const categoryExpenses = filteredExpenses.filter((expense) => expense.categoryId === category.id)
      const amount = categoryExpenses.reduce((sum, expense) => sum + expense.amount, 0)

      return {
        id: category.id,
        name: category.name,
        icon: category.icon,
        color: category.color,
        amount: amount,
        budget: category.budget * 12, // Annual budget
        percentage: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0,
        transactions: categoryExpenses.length,
      }
    })
    .filter((category) => category.amount > 0)
    .sort((a, b) => b.amount - a.amount)

  return {
    totalExpenses,
    budget,
    chartData,
    categoryBreakdown,
    transactions: filteredExpenses.sort((a, b) => new Date(b.date) - new Date(a.date)),
  }
}

export function getCategoryTotals(expenses, categories) {
  if (expenses.length === 0) {
    return null
  }

  // Calculate total expenses
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)

  // Calculate category breakdown
  const categoryBreakdown = categories
    .map((category) => {
      const categoryExpenses = expenses.filter((expense) => expense.categoryId === category.id)
      const amount = categoryExpenses.reduce((sum, expense) => sum + expense.amount, 0)

      return {
        id: category.id,
        name: category.name,
        icon: category.icon,
        color: category.color,
        amount: amount,
        percentage: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0,
        transactions: categoryExpenses.length,
      }
    })
    .filter((category) => category.amount > 0)
    .sort((a, b) => b.amount - a.amount)

  return {
    totalExpenses,
    categoryBreakdown,
  }
}
