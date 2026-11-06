
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

function Analytics({ transactions, onBack }) {
  const safeTransactions = transactions || [];

  // Calculate Total Income
  const totalIncome = safeTransactions
    .filter((item) => item.type === "income")
    .reduce((total, item) => total + Number(item.amount || 0), 0);

  // Calculate Total Expenses
  const totalExpenses = safeTransactions
    .filter((item) => item.type === "expense")
    .reduce((total, item) => total + Number(item.amount || 0), 0);

  // Calculate Net Savings
  const netSavings = totalIncome - totalExpenses;

  // Format Currency
  const formatAmount = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(amount);

  // Monthly Income and Expense Data (Last 6 Months)
  const monthlyData = Array.from({ length: 6 }, (_, index) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (5 - index));

    const month = date.getMonth();
    const year = date.getFullYear();

    const monthTransactions = safeTransactions.filter((item) => {
      const itemDate = new Date(item.date);

      return (
        !isNaN(itemDate.getTime()) &&
        itemDate.getMonth() === month &&
        itemDate.getFullYear() === year
      );
    });

    const income = monthTransactions
      .filter((item) => item.type === "income")
      .reduce((sum, item) => sum + Number(item.amount || 0), 0);

    const expense = monthTransactions
      .filter((item) => item.type === "expense")
      .reduce((sum, item) => sum + Number(item.amount || 0), 0);

    return {
      month: date.toLocaleString("en-IN", { month: "short" }),
      income,
      expense,
    };
  });

  // Category-wise Expense Data
  const categoryData = Object.values(
    safeTransactions
      .filter((item) => item.type === "expense")
      .reduce((acc, item) => {
        const category = item.category || "Other";

        if (!acc[category]) {
          acc[category] = {
            name: category,
            value: 0,
          };
        }

        acc[category].value += Number(item.amount || 0);

        return acc;
      }, {})
  );

  // Pie Chart Colors
  const COLORS = [
    "#2563eb",
    "#16a34a",
    "#dc2626",
    "#9333ea",
    "#f59e0b",
    "#0891b2",
    "#db2777",
    "#64748b",
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-7xl">

        {/* Page Heading */}
        <h1 className="mb-2 text-3xl font-bold text-gray-800">
          📈 Financial Analytics
        </h1>

        <p className="mb-6 text-gray-600">
          Analyze your income, expenses and savings.
        </p>

        {/* Back Button */}
        <button
          onClick={onBack}
          className="mb-6 rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
        >
          ← Back to Dashboard
        </button>

        {/* Summary Cards */}
        <div className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-3">

          {/* Income Card */}
          <div className="rounded-xl bg-white p-6 shadow">
            <p className="text-gray-500">Total Income</p>
            <h2 className="mt-3 text-2xl font-bold text-green-600">
              {formatAmount(totalIncome)}
            </h2>
          </div>

          {/* Expense Card */}
          <div className="rounded-xl bg-white p-6 shadow">
            <p className="text-gray-500">Total Expenses</p>
            <h2 className="mt-3 text-2xl font-bold text-red-600">
              {formatAmount(totalExpenses)}
            </h2>
          </div>

          {/* Savings Card */}
          <div className="rounded-xl bg-white p-6 shadow">
            <p className="text-gray-500">Net Savings</p>
            <h2 className="mt-3 text-2xl font-bold text-blue-600">
              {formatAmount(netSavings)}
            </h2>
          </div>

        </div>

        {/* Monthly Income vs Expense Chart */}
        <div className="mb-8 rounded-xl bg-white p-6 shadow">

          <h2 className="mb-5 text-xl font-bold text-gray-800">
            📊 Monthly Income vs Expense
          </h2>

          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />

                <Tooltip
                  formatter={(value) => formatAmount(value)}
                />

                <Legend />

                <Bar
                  dataKey="income"
                  name="Income"
                  fill="#16a34a"
                  radius={[5, 5, 0, 0]}
                />

                <Bar
                  dataKey="expense"
                  name="Expenses"
                  fill="#dc2626"
                  radius={[5, 5, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

        </div>

        {/* Category-wise Expense Pie Chart */}
        <div className="mb-8 rounded-xl bg-white p-6 shadow">

          <h2 className="mb-5 text-xl font-bold text-gray-800">
            🥧 Category-wise Expenses
          </h2>

          {categoryData.length === 0 ? (
            <p className="py-10 text-center text-gray-500">
              No expense data available.
            </p>
          ) : (
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={110}
                    label
                  >
                    {categoryData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>

                  <Tooltip
                    formatter={(value) => formatAmount(value)}
                  />

                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}

        </div>

        {/* Monthly Data Table */}
        <div className="rounded-xl bg-white p-6 shadow">

          <h2 className="mb-5 text-xl font-bold text-gray-800">
            📅 Monthly Income & Expense Data
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left">

              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3">Month</th>
                  <th className="p-3">Income</th>
                  <th className="p-3">Expenses</th>
                </tr>
              </thead>

              <tbody>
                {monthlyData.map((item, index) => (
                  <tr key={index} className="border-t">

                    <td className="p-3 font-medium">
                      {item.month}
                    </td>

                    <td className="p-3 font-semibold text-green-600">
                      {formatAmount(item.income)}
                    </td>

                    <td className="p-3 font-semibold text-red-600">
                      {formatAmount(item.expense)}
                    </td>

                  </tr>
                ))}
              </tbody>

            </table>
          </div>

        </div>

      </div>
    </div>
  );
}

export default Analytics;
