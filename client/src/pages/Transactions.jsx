
import React from "react";

function Transactions({
  transactions,
  onBack,
  onEdit,
  onDelete,
  formatCurrency,
  loading,
}) {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [filterType, setFilterType] = React.useState("all");
  const [currentPage, setCurrentPage] = React.useState(1);

  const safeTransactions = transactions || [];

  // Search and Filter
  const filteredTransactions = safeTransactions.filter((transaction) => {
    const search = searchTerm.toLowerCase();

    const matchesSearch =
      transaction.title?.toLowerCase().includes(search) ||
      transaction.category?.toLowerCase().includes(search);

    const matchesType =
      filterType === "all" || transaction.type === filterType;

    return matchesSearch && matchesType;
  });

  // Pagination
  const itemsPerPage = 5;

  const totalPages = Math.ceil(
    filteredTransactions.length / itemsPerPage
  );

  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-7xl">

        {/* Page Heading */}
        <h1 className="mb-2 text-3xl font-bold text-gray-800">
          💳 Transactions
        </h1>

        <p className="mb-6 text-gray-600">
          Manage all your income and expenses in one place.
        </p>

        {/* Back Button */}
        <button
          onClick={onBack}
          className="mb-6 rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
        >
          ← Back to Dashboard
        </button>

        {/* Search and Filter */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row">

          <input
            type="text"
            placeholder="Search by title or category..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full rounded-lg border border-gray-300 bg-white p-3 outline-none focus:border-blue-500"
          />

          <select
            value={filterType}
            onChange={(e) => {
              setFilterType(e.target.value);
              setCurrentPage(1);
            }}
            className="rounded-lg border border-gray-300 bg-white p-3"
          >
            <option value="all">All Transactions</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>

        </div>

        {/* Transactions Table */}
        <div className="overflow-x-auto rounded-xl bg-white shadow">

          {loading ? (
            <p className="p-6 text-center text-gray-600">
              Loading transactions...
            </p>
          ) : filteredTransactions.length === 0 ? (

            <div className="p-10 text-center">
              <h2 className="mb-2 text-xl font-semibold text-gray-700">
                {safeTransactions.length === 0
                  ? "No Transactions Yet"
                  : "No Results Found"}
              </h2>

              <p className="text-gray-500">
                {safeTransactions.length === 0
                  ? "Your transactions will appear here."
                  : "Try changing your search or filter."}
              </p>
            </div>

          ) : (

            <table className="w-full min-w-[700px] text-left">

              <thead className="bg-gray-100">
                <tr>
                  <th className="p-4">Title</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Action</th>
                </tr>
              </thead>

              <tbody>
                {paginatedTransactions.map((transaction) => (
                  <tr
                    key={transaction._id || transaction.id}
                    className="border-t hover:bg-gray-50"
                  >
                    <td className="p-4 font-medium">
                      {transaction.title}
                    </td>

                    <td className="p-4">
                      {transaction.category}
                    </td>

                    <td className="p-4">
                      <span
                        className={`rounded-full px-3 py-1 text-sm ${
                          transaction.type === "income"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {transaction.type}
                      </span>
                    </td>

                    <td className="p-4">
                      {transaction.date
                        ? new Date(transaction.date).toLocaleDateString()
                        : "-"}
                    </td>

                    <td className="p-4 font-semibold">
                      {formatCurrency
                        ? formatCurrency(Number(transaction.amount))
                        : transaction.amount}
                    </td>

                    <td className="p-4">
                      <div className="flex gap-2">

                        <button
                          onClick={() => onEdit(transaction)}
                          className="rounded bg-blue-600 px-3 py-1 text-white hover:bg-blue-700"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() =>
                            onDelete(transaction._id || transaction.id)
                          }
                          className="rounded bg-red-600 px-3 py-1 text-white hover:bg-red-700"
                        >
                          Delete
                        </button>

                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          )}

        </div>

        {/* Pagination */}
        {!loading && filteredTransactions.length > 0 && (
          <div className="mt-5 flex flex-col items-center justify-between gap-4 sm:flex-row">

            <p className="text-gray-600">
              Page {currentPage} of {totalPages}
            </p>

            <div className="flex gap-3">

              <button
                onClick={() =>
                  setCurrentPage((page) => Math.max(page - 1, 1))
                }
                disabled={currentPage === 1}
                className="rounded-lg bg-gray-700 px-4 py-2 text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-40"
              >
                ← Previous
              </button>

              <button
                onClick={() =>
                  setCurrentPage((page) =>
                    Math.min(page + 1, totalPages)
                  )
                }
                disabled={currentPage === totalPages}
                className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next →
              </button>

            </div>
          </div>
        )}

        {/* Total Transactions */}
        <p className="mt-4 text-gray-600">
          Total Transactions: {filteredTransactions.length}
        </p>

      </div>
    </div>
  );
}

export default Transactions;
