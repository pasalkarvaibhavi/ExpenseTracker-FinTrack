export default function TransactionList({ transactions }) {
  return (
    <div className="mt-6">
      {transactions.map((transaction) => (
        <div key={transaction.id} className="flex items-center justify-between py-3 border-b border-gray-100">
          <div className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${transaction.bgColor}`}>
              {transaction.icon}
            </div>
            <div className="ml-3">
              <h3 className="font-medium text-gray-900">{transaction.category}</h3>
              <p className="text-xs text-gray-500">{transaction.count} transactions</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-semibold">${transaction.amount.toLocaleString()}</p>
          </div>
        </div>
      ))}

      <button className="mt-4 bg-blue-500 text-white w-10 h-10 rounded-full flex items-center justify-center mx-auto shadow-lg">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      </button>
    </div>
  )
}

