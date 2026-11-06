
import React, { useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function Reports({ transactions, onBack }) {
  const safeTransactions = transactions || [];
  const today = new Date();

  const [selectedMonth, setSelectedMonth] = useState(
    String(today.getMonth())
  );

  const [selectedYear, setSelectedYear] = useState(
    String(today.getFullYear())
  );

  const [selectedReportYear, setSelectedReportYear] = useState(
    String(today.getFullYear())
  );

  // Currency Formatter
  const formatAmount = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(amount);

  const months = [
    "January", "February", "March", "April",
    "May", "June", "July", "August",
    "September", "October", "November", "December",
  ];

  // Available Years
  const years = Array.from(
    new Set([
      today.getFullYear(),
      ...safeTransactions.map((item) =>
        new Date(item.date).getFullYear()
      ),
    ])
  )
    .filter(Number.isFinite)
    .sort((a, b) => b - a);

  // Overall Summary
  const totalIncome = safeTransactions
    .filter((item) => item.type === "income")
    .reduce((total, item) => total + Number(item.amount || 0), 0);

  const totalExpenses = safeTransactions
    .filter((item) => item.type === "expense")
    .reduce((total, item) => total + Number(item.amount || 0), 0);

  const netSavings = totalIncome - totalExpenses;

  // Monthly Transactions
  const monthlyTransactions = safeTransactions.filter((item) => {
    const date = new Date(item.date);

    return (
      !isNaN(date.getTime()) &&
      date.getMonth() === Number(selectedMonth) &&
      date.getFullYear() === Number(selectedYear)
    );
  });

  const monthlyIncome = monthlyTransactions
    .filter((item) => item.type === "income")
    .reduce((total, item) => total + Number(item.amount || 0), 0);

  const monthlyExpenses = monthlyTransactions
    .filter((item) => item.type === "expense")
    .reduce((total, item) => total + Number(item.amount || 0), 0);

  const monthlySavings = monthlyIncome - monthlyExpenses;

  // Yearly Transactions
  const yearlyTransactions = safeTransactions.filter((item) => {
    const date = new Date(item.date);

    return (
      !isNaN(date.getTime()) &&
      date.getFullYear() === Number(selectedReportYear)
    );
  });

  const yearlyIncome = yearlyTransactions
    .filter((item) => item.type === "income")
    .reduce((total, item) => total + Number(item.amount || 0), 0);

  const yearlyExpenses = yearlyTransactions
    .filter((item) => item.type === "expense")
    .reduce((total, item) => total + Number(item.amount || 0), 0);

  const yearlySavings = yearlyIncome - yearlyExpenses;
  // Download Yearly Report as CSV
const downloadYearlyCSV = () => {
  const headers = ["Date", "Title", "Category", "Type", "Amount"];

  const rows = yearlyTransactions.map((item) => [
    new Date(item.date).toLocaleDateString("en-IN"),
    item.title || "",
    item.category || "",
    item.type || "",
    Number(item.amount || 0),
  ]);

  const csvContent = [headers, ...rows]
    .map((row) =>
      row
        .map((value) => `"${String(value).replace(/"/g, '""')}"`)
        .join(",")
    )
    .join("\n");

  const blob = new Blob(["\uFEFF" + csvContent], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = `Financial-Report-${selectedReportYear}.csv`;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
};

  // Download Yearly Report as PDF
  const downloadYearlyPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text("Financial Report", 14, 20);

    doc.setFontSize(12);
    doc.text(`Year: ${selectedReportYear}`, 14, 30);

    doc.text(`Yearly Income: ${formatAmount(yearlyIncome)}`, 14, 42);
    doc.text(`Yearly Expenses: ${formatAmount(yearlyExpenses)}`, 14, 50);
    doc.text(`Yearly Savings: ${formatAmount(yearlySavings)}`, 14, 58);
    doc.text(`Total Transactions: ${yearlyTransactions.length}`, 14, 66);

    autoTable(doc, {
      startY: 75,
      head: [["Date", "Title", "Category", "Type", "Amount"]],
      body: yearlyTransactions.map((item) => [
        new Date(item.date).toLocaleDateString("en-IN"),
        item.title || "",
        item.category || "",
        item.type || "",
        formatAmount(Number(item.amount || 0)),
      ]),
    });

    doc.save(`Financial-Report-${selectedReportYear}.pdf`);
  };

  // Download Monthly Report as PDF
const downloadMonthlyPDF = () => {
  const doc = new jsPDF();

  doc.setFontSize(20);
  doc.text("Monthly Financial Report", 14, 20);

  doc.setFontSize(12);
  doc.text(`Month: ${selectedMonth} ${selectedReportYear}`, 14, 30);

  doc.text(`Monthly Income: ${formatAmount(monthlyIncome)}`, 14, 42);
  doc.text(`Monthly Expenses: ${formatAmount(monthlyExpenses)}`, 14, 50);
  doc.text(`Monthly Savings: ${formatAmount(monthlySavings)}`, 14, 58);
  doc.text(`Total Transactions: ${monthlyTransactions.length}`, 14, 66);

  autoTable(doc, {
    startY: 75,
    head: [["Date", "Title", "Category", "Type", "Amount"]],
    body: monthlyTransactions.map((item) => [
      new Date(item.date).toLocaleDateString("en-IN"),
      item.title || "",
      item.category || "",
      item.type || "",
      formatAmount(Number(item.amount || 0)),
    ]),
  });

  doc.save(`Monthly-Report-${selectedMonth}-${selectedReportYear}.pdf`);
};

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-7xl">

        {/* Heading */}
        <h1 className="mb-2 text-3xl font-bold text-gray-800">
          📑 Financial Reports
        </h1>

        <p className="mb-6 text-gray-600">
          View and download your financial reports.
        </p>

        <button
          onClick={onBack}
          className="mb-6 rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
        >
          ← Back to Dashboard
        </button>

        

        {/* Overall Summary */}
        <div className="mb-8 rounded-xl bg-white p-6 shadow">
          <h2 className="mb-5 text-xl font-bold text-gray-800">
            Overall Financial Summary
          </h2>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">

            <div className="rounded-lg bg-green-50 p-5">
              <p className="text-gray-600">Total Income</p>
              <h3 className="mt-2 text-2xl font-bold text-green-600">
                {formatAmount(totalIncome)}
              </h3>
            </div>

            <div className="rounded-lg bg-red-50 p-5">
              <p className="text-gray-600">Total Expenses</p>
              <h3 className="mt-2 text-2xl font-bold text-red-600">
                {formatAmount(totalExpenses)}
              </h3>
            </div>

            <div className="rounded-lg bg-blue-50 p-5">
              <p className="text-gray-600">Net Savings</p>
              <h3 className="mt-2 text-2xl font-bold text-blue-600">
                {formatAmount(netSavings)}
              </h3>
            </div>

            <div className="rounded-lg bg-purple-50 p-5">
              <p className="text-gray-600">Total Transactions</p>
              <h3 className="mt-2 text-2xl font-bold text-purple-600">
                {safeTransactions.length}
              </h3>
            </div>

          </div>
        </div>
        

        {/* Monthly Report */}
        <div className="mb-8 rounded-xl bg-white p-6 shadow">

          <h2 className="mb-5 text-xl font-bold text-gray-800">
            📅 Monthly Financial Report
          </h2>

          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">

            <div>
              <label className="mb-2 block font-medium text-gray-700">
                Select Month
              </label>

              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-3"
              >
                {months.map((month, index) => (
                  <option key={index} value={index}>
                    {month}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block font-medium text-gray-700">
                Select Year
              </label>

              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-3"
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">

            <div className="rounded-lg bg-green-50 p-5">
              <p className="text-gray-600">Monthly Income</p>
              <h3 className="mt-2 text-2xl font-bold text-green-600">
                {formatAmount(monthlyIncome)}
              </h3>
            </div>

            <div className="rounded-lg bg-red-50 p-5">
              <p className="text-gray-600">Monthly Expenses</p>
              <h3 className="mt-2 text-2xl font-bold text-red-600">
                {formatAmount(monthlyExpenses)}
              </h3>
            </div>

            <div className="rounded-lg bg-blue-50 p-5">
              <p className="text-gray-600">Monthly Savings</p>
              <h3 className="mt-2 text-2xl font-bold text-blue-600">
                {formatAmount(monthlySavings)}
              </h3>
            </div>

          </div>

          <p className="mt-5 text-gray-600">
            Total Transactions: {monthlyTransactions.length}
          </p>

        </div>
        

        {/* Yearly Report */}
        <div className="mb-8 rounded-xl bg-white p-6 shadow">

          <h2 className="mb-5 text-xl font-bold text-gray-800">
            📊 Yearly Financial Report
          </h2>

          <div className="mb-6">
            <label className="mb-2 block font-medium text-gray-700">
              Select Year
            </label>

            <select
              value={selectedReportYear}
              onChange={(e) => setSelectedReportYear(e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-3 sm:w-1/2"
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">

            <div className="rounded-lg bg-green-50 p-5">
              <p className="text-gray-600">Yearly Income</p>
              <h3 className="mt-2 text-2xl font-bold text-green-600">
                {formatAmount(yearlyIncome)}
              </h3>
            </div>

            <div className="rounded-lg bg-red-50 p-5">
              <p className="text-gray-600">Yearly Expenses</p>
              <h3 className="mt-2 text-2xl font-bold text-red-600">
                {formatAmount(yearlyExpenses)}
              </h3>
            </div>

            <div className="rounded-lg bg-blue-50 p-5">
              <p className="text-gray-600">Yearly Savings</p>
              <h3 className="mt-2 text-2xl font-bold text-blue-600">
                {formatAmount(yearlySavings)}
              </h3>
            </div>

          </div>

          <p className="mt-5 text-gray-600">
            Total Transactions: {yearlyTransactions.length}
          </p>
          <button
  onClick={downloadYearlyCSV}
  className="mt-5 rounded-lg bg-green-600 px-5 py-3 font-medium text-white hover:bg-green-700"
>
  ⬇ Download Yearly Report (CSV)
</button>

<button
  onClick={downloadYearlyPDF}
  className="mt-5 ml-3 rounded-lg bg-red-600 px-5 py-3 font-medium text-white hover:bg-red-700"
>
  📄 Download Yearly Report (PDF)
</button>

<button
  onClick={downloadMonthlyPDF}
  className="mt-5 rounded-lg bg-red-600 px-5 py-3 font-medium text-white hover:bg-red-700"
>
  📄 Download Monthly Report (PDF)
</button>


        </div>

      </div>
    </div>
  );
}

export default Reports;
