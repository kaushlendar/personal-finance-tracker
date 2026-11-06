import { useState } from "react";

function App() {
  const [transactions, setTransactions] = useState([
    { id: 1, title: "Salary", category: "Salary", amount: 25000, type: "income" },
    { id: 2, title: "Shopping", category: "Shopping", amount: 2500, type: "expense" },
    { id: 3, title: "Food", category: "Food", amount: 800, type: "expense" },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense");

  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((total, t) => total + t.amount, 0);

  const expenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((total, t) => total + t.amount, 0);

  const balance = income - expenses;

  const addTransaction = (e) => {
    e.preventDefault();

    const value = Number(amount);
    if (!title.trim() || !Number.isFinite(value) || value <= 0) return;

    const newTransaction = {
      id: Date.now(),
      title: title.trim(),
      category: type === "income" ? "Income" : "Other",
      amount: value,
      type,
    };

    setTransactions((prev) => [newTransaction, ...prev]);
    setTitle("");
    setAmount("");
    setShowForm(false);
  };

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(value);

  return (
    <div className="min-h-screen bg-gray-100 md:flex">

      {/* Sidebar */}
      <aside className="bg-slate-900 p-6 text-white md:min-h-screen md:w-64">
        <h1 className="mb-8 text-2xl font-bold">💰 Finance Tracker</h1>

        <nav className="space-y-4">
          <div className="rounded-lg bg-blue-600 p-3">📊 Dashboard</div>
          <div className="p-3">💳 Transactions</div>
          <div className="p-3">📈 Analytics</div>
          <div className="p-3">⚙️ Settings</div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8">

        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">
              Dashboard
            </h2>
            <p className="text-gray-500">
              Welcome to your finance dashboard
            </p>
          </div>

          <button
            onClick={() => setShowForm(!showForm)}
            className="rounded-lg bg-blue-600 px-5 py-3 text-white hover:bg-blue-700"
          >
            + Add Transaction
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">

          <div className="rounded-xl bg-white p-6 shadow">
            <p className="text-gray-500">Total Balance</p>
            <h3 className="mt-2 text-3xl font-bold text-blue-600">
              {formatCurrency(balance)}
            </h3>
          </div>

          <div className="rounded-xl bg-white p-6 shadow">
            <p className="text-gray-500">Total Income</p>
            <h3 className="mt-2 text-3xl font-bold text-green-600">
              {formatCurrency(income)}
            </h3>
          </div>

          <div className="rounded-xl bg-white p-6 shadow">
            <p className="text-gray-500">Total Expenses</p>
            <h3 className="mt-2 text-3xl font-bold text-red-600">
              {formatCurrency(expenses)}
            </h3>
          </div>

        </div>

        {/* Add Transaction Form */}
        {showForm && (
          <form
            onSubmit={addTransaction}
            className="mt-8 rounded-xl bg-white p-6 shadow"
          >
            <h3 className="mb-4 text-xl font-bold">Add Transaction</h3>

            <div className="grid gap-4 md:grid-cols-3">
              <input
                type="text"
                placeholder="Transaction Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="rounded-lg border p-3"
              />

              <input
                type="number"
                placeholder="Amount"
                min="0.01"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                className="rounded-lg border p-3"
              />

              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="rounded-lg border p-3"
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>

            <button
              type="submit"
              className="mt-4 rounded-lg bg-green-600 px-6 py-3 text-white hover:bg-green-700"
            >
              Save Transaction
            </button>
          </form>
        )}

        {/* Recent Transactions */}
        <div className="mt-8 overflow-x-auto rounded-xl bg-white p-6 shadow">
          <h3 className="mb-6 text-xl font-bold">
            Recent Transactions
          </h3>

          <table className="w-full min-w-[450px] text-left">
            <thead>
              <tr className="border-b text-gray-500">
                <th className="p-3">Title</th>
                <th className="p-3">Category</th>
                <th className="p-3">Type</th>
                <th className="p-3">Amount</th>
              </tr>
            </thead>

            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="border-b">
                  <td className="p-3">{transaction.title}</td>
                  <td className="p-3">{transaction.category}</td>
                  <td className="p-3 capitalize">{transaction.type}</td>
                  <td
                    className={`p-3 font-semibold ${
                      transaction.type === "income"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {transaction.type === "income" ? "+" : "-"}
                    {formatCurrency(transaction.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </main>
    </div>
  );
}

export default App;