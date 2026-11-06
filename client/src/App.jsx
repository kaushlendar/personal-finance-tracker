import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import "./App.css";
import Transactions from "./pages/Transactions";
import Analytics from "./pages/Analytics";
import Reports from "./pages/Reports";
import Profile from "./pages/Profile";
import ChangePassword from "./pages/ChangePassword";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Settings from "./pages/Settings";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";
function App() {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("financeUser")) || null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(
    () => localStorage.getItem("financeToken") || ""
  );

  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [transactions, setTransactions] = useState([]);
  const [activePage, setActivePage] = useState("dashboard");
  // Transaction Type Filter

const [budgetHistory, setBudgetHistory] = useState(() => {
  try {
    const savedHistory = localStorage.getItem("budgetHistory");
    return savedHistory ? JSON.parse(savedHistory) : {};
  } catch {
    return {};
  }
});

const [budgetInput, setBudgetInput] = useState("");
const [budgetAlertDismissed, setBudgetAlertDismissed] = useState(false);
const [lastBudgetAlert, setLastBudgetAlert] = useState("normal");
const [editingBudgetMonth, setEditingBudgetMonth] = useState(null);
const [editBudgetAmount, setEditBudgetAmount] = useState("");
const [savingsGoal, setSavingsGoal] = useState(() => {
  const savedGoal = localStorage.getItem("savingsGoal");
  return savedGoal ? Number(savedGoal) : 50000;
});

const [savingsGoalInput, setSavingsGoalInput] = useState("");
const [editingGoalId, setEditingGoalId] = useState(null);
const [editGoalAmount, setEditGoalAmount] = useState("");

const [savingsGoalHistory, setSavingsGoalHistory] = useState(() => {
  try {
    const savedHistory = localStorage.getItem("savingsGoalHistory");
    return savedHistory ? JSON.parse(savedHistory) : [];
  } catch {
    return [];
  }
});

const currentMonthKey = (() => {
  const today = new Date();
  return `${today.getFullYear()}-${String(
    today.getMonth() + 1
  ).padStart(2, "0")}`;
})();

const monthlyBudget = Number(budgetHistory[currentMonthKey]) || 0;

const monthlyExpenses = transactions
  .filter((transaction) => {
    if (transaction.type !== "expense" || !transaction.date) {
      return false;
    }

    const transactionDate = new Date(transaction.date);

    return (
      transactionDate.getFullYear() === Number(currentMonthKey.split("-")[0]) &&
      transactionDate.getMonth() + 1 === Number(currentMonthKey.split("-")[1])
    );
  })
  .reduce(
    (total, transaction) => total + (Number(transaction.amount) || 0),
    0
  );

  const monthlyBudgetComparisonData = Object.entries(budgetHistory)
  .map(([month, budget]) => {
    const [year, monthNumber] = month.split("-").map(Number);

    const actualExpenses = transactions
      .filter((transaction) => {
        if (transaction.type !== "expense" || !transaction.date) {
          return false;
        }

        const transactionDate = new Date(transaction.date);

        return (
          transactionDate.getFullYear() === year &&
          transactionDate.getMonth() + 1 === monthNumber
        );
      })
      .reduce(
        (total, transaction) =>
          total + (Number(transaction.amount) || 0),
        0
      );

    return {
      month: new Date(year, monthNumber - 1).toLocaleString("en-US", {
        month: "short",
        year: "numeric",
      }),
      budget: Number(budget) || 0,
      expenses: actualExpenses,
    };
  })
  .sort((a, b) => {
    return new Date(a.month) - new Date(b.month);
  });

const budgetUsagePercentage =
  monthlyBudget > 0
    ? (monthlyExpenses / monthlyBudget) * 100
    : 0;

const budgetAlert =
  monthlyBudget > 0 && monthlyExpenses > monthlyBudget
    ? "exceeded"
    : monthlyBudget > 0 && budgetUsagePercentage >= 80
    ? "warning"
    : "normal";
    useEffect(() => {
  if (budgetAlert !== lastBudgetAlert) {
    setBudgetAlertDismissed(false);
    setLastBudgetAlert(budgetAlert);
  }
}, [budgetAlert, lastBudgetAlert]);
  const [filterType, setFilterType] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 5;
  const [transactionsLoading, setTransactionsLoading] = useState(false);
  const [transactionError, setTransactionError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense");
  const [category, setCategory] = useState("Food");
  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  // Calculate total income
  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((total, t) => total + Number(t.amount), 0);

  // Calculate total expenses
  const expenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((total, t) => total + Number(t.amount), 0);

  // Calculate balance
  const balance = income - expenses;

  // Savings Goal Progress
const currentSavings = balance;

const savingsGoalPercentage =
  savingsGoal > 0
    ? Math.min(100, Math.max(0, (currentSavings / savingsGoal) * 100))
    : 0;

const remainingSavingsGoal = Math.max(
  0,
  savingsGoal - currentSavings
);

  // Filter and search transactions
  const filteredTransactions = transactions.filter((transaction) => {
    const matchesType =
      filterType === "all" || transaction.type === filterType;

    const matchesCategory =
      filterCategory === "all" ||
      transaction.category === filterCategory;

    const matchesSearch =
      String(transaction.title || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      String(transaction.category || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    return matchesType && matchesCategory && matchesSearch;
  });

  const totalPages = Math.ceil(
  filteredTransactions.length / transactionsPerPage
);

const startIndex = (currentPage - 1) * transactionsPerPage;

const paginatedTransactions = filteredTransactions.slice(
  startIndex,
  startIndex + transactionsPerPage
);

  // Prepare data for the monthly chart
  const monthlyData = Array.from({ length: 6 }, (_, index) => {
    const currentDate = new Date();

    const monthDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - (5 - index),
      1
    );

    const month = monthDate.getMonth();
    const year = monthDate.getFullYear();

    const monthTransactions = transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.date);

      return (
        transactionDate.getMonth() === month &&
        transactionDate.getFullYear() === year
      );
    });

    const monthlyIncome = monthTransactions
      .filter((transaction) => transaction.type === "income")
      .reduce(
        (total, transaction) => total + Number(transaction.amount),
        0
      );

    const monthlyExpenses = monthTransactions
      .filter((transaction) => transaction.type === "expense")
      .reduce(
        (total, transaction) => total + Number(transaction.amount),
        0
      );

    return {
      month: monthDate.toLocaleDateString("en-IN", {
        month: "short",
      }),
      Income: monthlyIncome,
      Expenses: monthlyExpenses,
    };
  });
  const monthlySummaryData = Array.from({ length: 6 }, (_, index) => {
  const today = new Date();

  const monthDate = new Date(
    today.getFullYear(),
    today.getMonth() - (5 - index),
    1
  );

  const monthTransactions = transactions.filter((transaction) => {
    if (!transaction.date) return false;

    const transactionDate = new Date(transaction.date);

    return (
      transactionDate.getMonth() === monthDate.getMonth() &&
      transactionDate.getFullYear() === monthDate.getFullYear()
    );
  });

  const income = monthTransactions
    .filter((transaction) => transaction.type === "income")
    .reduce((total, transaction) => total + Number(transaction.amount), 0);

  const expenses = monthTransactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((total, transaction) => total + Number(transaction.amount), 0);

  return {
    month: monthDate.toLocaleDateString("en-IN", {
      month: "short",
      year: "numeric",
    }),
    income,
    expenses,
    savings: income - expenses,
  };
});

  const expenseCategoryData = Object.values(
  transactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((categories, transaction) => {
      const category = transaction.category || "Other";

      if (!categories[category]) {
        categories[category] = {
          name: category,
          value: 0,
        };
      }

      categories[category].value += Number(transaction.amount) || 0;

      return categories;
    }, {})
);
const topSpendingCategory = [...expenseCategoryData].sort(
  (a, b) => b.value - a.value
)[0];

const recentTransactions = [...transactions]
  .sort((a, b) => new Date(b.date) - new Date(a.date))
  .slice(0, 5);

const filteredRecentTransactions = recentTransactions
  .filter((transaction) => {
    const matchesType =
      filterType === "all" || transaction.type === filterType;

    const matchesDate =
      dateFilter === "" || transaction.date === dateFilter;

    return matchesType && matchesDate;
  })
  .sort((a, b) => {
    if (sortOrder === "newest") {
      return new Date(b.date) - new Date(a.date);
    }

    if (sortOrder === "oldest") {
      return new Date(a.date) - new Date(b.date);
    }

    if (sortOrder === "highest") {
      return b.amount - a.amount;
    }

    if (sortOrder === "lowest") {
      return a.amount - b.amount;
    }

    return 0;
  });
  

const topCategoryName = topSpendingCategory
  ? topSpendingCategory.name
  : "No Expenses";

const topCategoryAmount = topSpendingCategory
  ? topSpendingCategory.value
  : 0;

// Transaction Summary
const totalTransactions = transactions.length;

const incomeTransactionsCount = transactions.filter(
  (transaction) => transaction.type === "income"
).length;

const expenseTransactionsCount = transactions.filter(
  (transaction) => transaction.type === "expense"
).length;

const PIE_COLORS = [
  "#3B82F6",
  "#EF4444",
  "#10B981",
  "#F59E0B",
  "#8B5CF6",
  "#EC4899",
  "#06B6D4",
  "#84CC16",
];
const currentMonthExpenses = transactions
  .filter((transaction) => {
    if (transaction.type !== "expense" || !transaction.date) {
      return false;
    }

    const transactionDate = new Date(transaction.date);
    const today = new Date();

    return (
      transactionDate.getMonth() === today.getMonth() &&
      transactionDate.getFullYear() === today.getFullYear()
    );
  })
  .reduce(
    (total, transaction) => total + (Number(transaction.amount) || 0),
    0
  );

const remainingBudget = monthlyBudget - currentMonthExpenses;
const previousMonthDate = new Date();
previousMonthDate.setMonth(previousMonthDate.getMonth() - 1);

const previousMonthExpenses = transactions
  .filter((transaction) => {
    if (transaction.type !== "expense" || !transaction.date) {
      return false;
    }

    const transactionDate = new Date(transaction.date);

    return (
      transactionDate.getMonth() === previousMonthDate.getMonth() &&
      transactionDate.getFullYear() === previousMonthDate.getFullYear()
    );
  })
  .reduce(
    (total, transaction) =>
      total + (Number(transaction.amount) || 0),
    0
  );
  const spendingDifference =
  currentMonthExpenses - previousMonthExpenses;

const spendingChangePercentage =
  previousMonthExpenses > 0
    ? (spendingDifference / previousMonthExpenses) * 100
    : 0;

const spendingInsight =
  previousMonthExpenses === 0
    ? "No previous month data"
    : spendingDifference > 0
    ? "Expenses Increased"
    : spendingDifference < 0
    ? "Expenses Decreased"
    : "No Change";

const budgetPercentage =
  monthlyBudget > 0
    ? (currentMonthExpenses / monthlyBudget) * 100
    : 0;

    const budgetStatus =
  monthlyBudget <= 0
    ? "No Budget"
    : budgetPercentage >= 100
    ? "Exceeded"
    : budgetPercentage >= 80
    ? "Near Limit"
    : "Safe";

const saveMonthlyBudget = (e) => {
  e.preventDefault();

  const budget = Number(budgetInput);

  if (!Number.isFinite(budget) || budget <= 0) {
    alert("Please enter a valid budget greater than 0.");
    return;
  }

  const updatedHistory = {
    ...budgetHistory,
    [currentMonthKey]: budget,
  };

  setBudgetHistory(updatedHistory);

  localStorage.setItem(
    "budgetHistory",
    JSON.stringify(updatedHistory)
  );

  setBudgetInput("");

  alert("Monthly budget saved successfully!");
};


const startEditBudget = (month, budget) => {
  setEditingBudgetMonth(month);
  setEditBudgetAmount(String(budget));
};

const updateBudgetHistory = (month) => {
  const newAmount = Number(editBudgetAmount);

  if (
    !editBudgetAmount.trim() ||
    !Number.isFinite(newAmount) ||
    newAmount <= 0
  ) {
    alert("Please enter a valid budget greater than 0.");
    return;
  }

  const updatedHistory = {
    ...budgetHistory,
    [month]: newAmount,
  };

  setBudgetHistory(updatedHistory);

  localStorage.setItem(
    "budgetHistory",
    JSON.stringify(updatedHistory)
  );

  setEditingBudgetMonth(null);
  setEditBudgetAmount("");

  alert("Monthly budget updated successfully!");
};

const deleteBudgetHistory = (month) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this budget history?"
  );

  if (!confirmDelete) return;

  const updatedHistory = { ...budgetHistory };
  delete updatedHistory[month];

  setBudgetHistory(updatedHistory);

  localStorage.setItem(
    "budgetHistory",
    JSON.stringify(updatedHistory)
  );
};

const saveSavingsGoal = () => {
  const goal = Number(savingsGoalInput);

  if (
    !savingsGoalInput.trim() ||
    !Number.isFinite(goal) ||
    goal <= 0
  ) {
    alert("Please enter a valid savings goal.");
    return;
  }

  const historyEntry = {
    id: Date.now(),
    oldGoal: savingsGoal,
    newGoal: goal,
    date: new Date().toLocaleDateString("en-IN"),
    status: currentSavings >= goal ? "Completed" : "In Progress",
  };

  const updatedHistory = [
    historyEntry,
    ...savingsGoalHistory,
  ];

  setSavingsGoalHistory(updatedHistory);

  localStorage.setItem(
    "savingsGoalHistory",
    JSON.stringify(updatedHistory)
  );

  setSavingsGoal(goal);
  localStorage.setItem("savingsGoal", String(goal));

  setSavingsGoalInput("");

  alert("Savings Goal saved successfully!");
};

const deleteSavingsGoalHistory = (id) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this history?"
  );

  if (!confirmDelete) return;

  const updatedHistory = savingsGoalHistory.filter(
    (item) => item.id !== id
  );

  setSavingsGoalHistory(updatedHistory);

  localStorage.setItem(
    "savingsGoalHistory",
    JSON.stringify(updatedHistory)
  );
};

const startEditSavingsGoal = (item) => {
  setEditingGoalId(item.id);
  setEditGoalAmount(String(item.newGoal));
};

const updateSavingsGoalHistory = (id) => {
  const newAmount = Number(editGoalAmount);

  if (
    !editGoalAmount.trim() ||
    !Number.isFinite(newAmount) ||
    newAmount <= 0
  ) {
    alert("Please enter a valid savings goal.");
    return;
  }

  const updatedHistory = savingsGoalHistory.map((item) =>
    item.id === id
      ? {
          ...item,
          newGoal: newAmount,
          status: currentSavings >= newAmount
            ? "Completed"
            : "In Progress",
        }
      : item
  );

  setSavingsGoalHistory(updatedHistory);

  localStorage.setItem(
    "savingsGoalHistory",
    JSON.stringify(updatedHistory)
  );

  if (
    savingsGoalHistory.find((item) => item.id === id)?.id ===
    savingsGoalHistory[0]?.id
  ) {
    setSavingsGoal(newAmount);
    localStorage.setItem("savingsGoal", String(newAmount));
  }

  setEditingGoalId(null);
  setEditGoalAmount("");

  alert("Savings Goal updated successfully!");
};

  // Export filtered transactions to CSV
  const exportToCSV = () => {
    const headers = ["Title", "Category", "Type", "Date", "Amount"];

    const rows = filteredTransactions.map((transaction) => [
      transaction.title,
      transaction.category,
      transaction.type,
      transaction.date
        ? new Date(transaction.date).toLocaleDateString("en-IN")
        : "",
      transaction.amount,
    ]);

    const csvContent = [headers, ...rows]
      .map((row) =>
        row
          .map(
            (value) =>
              `"${String(value ?? "").replace(/"/g, '""')}"`
          )
          .join(",")
      )
      .join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "personal-finance-transactions.csv";

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
  };

  // Download Transactions Backup
const downloadBackup = () => {
  const backupData = {
    backupDate: new Date().toISOString(),
    transactions: transactions,
  };

  const blob = new Blob(
    [JSON.stringify(backupData, null, 2)],
    { type: "application/json" }
  );

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "Personal-Finance-Backup.json";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
};

// Restore Transactions Backup
const restoreBackup = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  try {
    const text = await file.text();
    const backupData = JSON.parse(text);

    if (
      !backupData ||
      !Array.isArray(backupData.transactions)
    ) {
      throw new Error("Invalid backup file format.");
    }

    if (backupData.transactions.length === 0) {
      throw new Error("Backup file has no transactions.");
    }

    const confirmRestore = window.confirm(
      `Restore ${backupData.transactions.length} transactions?`
    );

    if (!confirmRestore) {
      event.target.value = "";
      return;
    }

    for (const item of backupData.transactions) {
      if (
        !item.title ||
        !item.category ||
        !["income", "expense"].includes(item.type) ||
        !Number.isFinite(Number(item.amount)) ||
        Number(item.amount) <= 0 ||
        !item.date
      ) {
        throw new Error("Backup contains invalid transaction data.");
      }

      const response = await fetch(`${API_URL}/api/transactions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: item.title,
          category: item.category,
          amount: Number(item.amount),
          type: item.type,
          date: item.date,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to restore transaction.");
      }
    }

    const response = await fetch(`${API_URL}/api/transactions`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error("Transactions restored, but refresh failed.");
    }

    setTransactions(data.transactions);
    alert("Backup restored successfully!");
  } catch (error) {
    alert(error.message || "Could not restore backup.");
  } finally {
    event.target.value = "";
  }
};
  // Fetch transactions from the backend
  useEffect(() => {
    if (!user || !token) return;

    const fetchTransactions = async () => {
      setTransactionsLoading(true);
      setTransactionError("");

      try {
        const response = await fetch(`${API_URL}/api/transactions`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "Failed to load transactions."
          );
        }

        setTransactions(data.transactions);
      } catch (error) {
        setTransactionError(
          error.message || "Could not load transactions."
        );
      } finally {
        setTransactionsLoading(false);
      }
    };

    fetchTransactions();
  }, [user, token]);

  // Format amounts as Indian Rupees
  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(value);

  // Login and registration
  const handleAuth = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!email.trim() || !password) {
      setMessage("Please enter your email and password.");
      return;
    }

    if (isRegister && !name.trim()) {
      setMessage("Please enter your name.");
      return;
    }

    setLoading(true);

    try {
      const endpoint = isRegister
        ? "/api/auth/register"
        : "/api/auth/login";

      const response = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          isRegister
            ? {
                name: name.trim(),
                email: email.trim(),
                password,
              }
            : {
                email: email.trim(),
                password,
              }
        ),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setMessage(data.message || "Authentication failed.");
        return;
      }

      localStorage.setItem("financeToken", data.token);
      localStorage.setItem("financeUser", JSON.stringify(data.user));

      setToken(data.token);
      setUser(data.user);
      setPassword("");
      setMessage("");
    } catch {
      setMessage(
        "Cannot connect to the server. Please make sure your backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("financeToken");
    localStorage.removeItem("financeUser");

    setToken("");
    setUser(null);
    setMessage("");
    setPassword("");
  };

  // Add transaction
  const addTransaction = async (e) => {
    e.preventDefault();

    const value = Number(amount);

    if (!title.trim() || !Number.isFinite(value) || value <= 0) {
      setTransactionError("Please enter a valid title and amount.");
      return;
    }

    setTransactionsLoading(true);
    setTransactionError("");

    try {
      const response = await fetch(`${API_URL}/api/transactions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: title.trim(),
          category,
          amount: value,
          type,
          date,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to save transaction."
        );
      }

      setTransactions((prev) => [data.transaction, ...prev]);

      setTitle("");
      setAmount("");
      setType("expense");
      setCategory("Food");
      setDate(new Date().toISOString().split("T")[0]);
      setShowForm(false);
    } catch (error) {
      setTransactionError(
        error.message || "Could not save transaction."
      );
    } finally {
      setTransactionsLoading(false);
    }
  };

  // Delete transaction
  const deleteTransaction = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this transaction?"
    );

    if (!confirmed) return;

    setTransactionError("");

    try {
      const response = await fetch(
        `${API_URL}/api/transactions/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to delete transaction."
        );
      }

      setTransactions((prev) =>
        prev.filter((transaction) => transaction._id !== id)
      );
    } catch (error) {
      setTransactionError(
        error.message || "Could not delete transaction."
      );
    }
  };

// Edit Transaction
const editTransaction = async (transaction) => {
  const newTitle = window.prompt(
    "Enter transaction title:",
    transaction.title
  );

  if (newTitle === null || !newTitle.trim()) return;

  const newAmount = window.prompt(
    "Enter transaction amount:",
    String(transaction.amount)
  );

  if (newAmount === null) return;

  const amountValue = Number(newAmount);

  if (!Number.isFinite(amountValue) || amountValue <= 0) {
    setTransactionError("Please enter a valid amount.");
    return;
  }

  const newCategory = window.prompt(
    "Enter category (Food, Travel, Shopping, Salary, Education, Bills, Health, Other):",
    transaction.category
  );

  if (newCategory === null || !newCategory.trim()) return;

  const newType = window.prompt(
    "Enter type (income or expense):",
    transaction.type
  );

  if (newType === null) return;

  const validType = newType.trim().toLowerCase();

  if (!["income", "expense"].includes(validType)) {
    setTransactionError("Type must be income or expense.");
    return;
  }

  const currentDate = transaction.date
    ? new Date(transaction.date).toISOString().split("T")[0]
    : new Date().toISOString().split("T")[0];

  const newDate = window.prompt(
    "Enter date (YYYY-MM-DD):",
    currentDate
  );

  if (newDate === null) return;

  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(newDate) ||
    Number.isNaN(Date.parse(newDate))
  ) {
    setTransactionError("Please enter a valid date.");
    return;
  }

  setTransactionError("");

  try {
    const response = await fetch(
      `${API_URL}/api/transactions/${transaction._id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: newTitle.trim(),
          amount: amountValue,
          category: newCategory.trim(),
          type: validType,
          date: newDate,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Failed to update transaction.");
    }

    setTransactions((prev) =>
      prev.map((item) =>
        item._id === transaction._id ? data.transaction : item
      )
    );

  } catch (error) {
    setTransactionError(
      error.message || "Could not update transaction."
    );
  }
};
if (activePage === "forgot-password") {
  return (
    <ForgotPassword
      onBack={() => setActivePage("login")}
    />
  );
}

if (activePage === "reset-password") {
  return (
    <ResetPassword
      token={localStorage.getItem("resetPasswordToken")}
      onBack={() => setActivePage("login")}
    />
  );
}

  if (!user || !token) {
    return (
      <div className="auth-page">
        <form className="auth-card" onSubmit={handleAuth}>
          <div className="auth-logo">💰</div>
          <h1>Finance Tracker</h1>
          <p className="auth-subtitle">
            {isRegister
              ? "Create your account to get started"
              : "Welcome back! Please log in."}
          </p>

          {isRegister && (
            <label>
              Full Name
              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </label>
          )}

          <label>
            Email Address
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              required
            />
          </label>

          {message && <div className="auth-message">{message}</div>}

          <button className="auth-button" type="submit" disabled={loading}>
            {loading
              ? "Please wait..."
              : isRegister
                ? "Create Account"
                : "Login"}
          </button>

          <p className="auth-switch">
            {isRegister
              ? "Already have an account?"
              : "Don't have an account?"}{" "}
            <button
              type="button"
              onClick={() => {
                setIsRegister(!isRegister);
                setMessage("");
              }}
            >
              {isRegister ? "Login" : "Register"}
            </button>
            <button
  type="button"
  onClick={() => setActivePage("forgot-password")}
  className="mt-3 w-full text-sm text-blue-600 hover:underline"
>
  Forgot Password?
</button>
          </p>
        </form>
      </div>
    );
  }

if (activePage === "transactions") {
  return (
    <Transactions
      transactions={transactions}
      onBack={() => setActivePage("dashboard")}
      onEdit={editTransaction}
      onDelete={deleteTransaction}
      formatCurrency={formatCurrency}
      loading={transactionsLoading}
    />
  );
}
if (activePage === "analytics") {
  return (
    <Analytics
      transactions={transactions}
      onBack={() => setActivePage("dashboard")}
    />
  );
}
if (activePage === "reports") {
  return (
    <Reports
      transactions={transactions}
      onBack={() => setActivePage("dashboard")}
    />
  );
}

if (activePage === "profile") {
  return (
    <Profile
  user={user}
  onBack={() => setActivePage("dashboard")}
  onUpdate={(updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem(
      "financeUser",
      JSON.stringify(updatedUser)
    );
  }}
/>
  );
}

if (activePage === "settings") {
  return (
    <Settings
      user={user}
      onBack={() => setActivePage("dashboard")}
      onLogout={handleLogout}
    />
  );
}

if (activePage === "change-password") {
  return (
    <ChangePassword
      onBack={() => setActivePage("dashboard")}
    />
  );
}

if (activePage === "forgot-password") {
  return (
    <ForgotPassword
      onBack={() => setActivePage("login")}
    />
  );
}

if (activePage === "reset-password") {
  return (
    <ResetPassword
      token={localStorage.getItem("resetPasswordToken")}
      onBack={() => setActivePage("login")}
    />
  );
}

return (
  <div className="min-h-screen bg-gray-100 md:flex">
      <aside className="bg-slate-900 p-6 text-white md:min-h-screen md:w-64">
        <h1 className="mb-8 text-2xl font-bold">💰 Finance Tracker</h1>

        <nav className="space-y-4">
          <div className="rounded-lg bg-blue-600 p-3">📊 Dashboard</div>
          <button
  onClick={() => setActivePage("transactions")}
  className={`w-full rounded-lg p-3 text-left ${
    activePage === "transactions"
      ? "bg-blue-600"
      : "hover:bg-slate-700"
  }`}
>
  💳 Transactions
</button>
          <button
  onClick={() => setActivePage("analytics")}
  className={`w-full rounded-lg p-3 text-left ${
    activePage === "analytics"
      ? "bg-blue-600"
      : "hover:bg-slate-700"
  }`}
>
  📈 Analytics
</button>

<button
  onClick={() => setActivePage("reports")}
  className={`w-full rounded-lg p-3 text-left ${
    activePage === "reports"
      ? "bg-blue-600"
      : "hover:bg-slate-700"
  }`}
>
  📑 Reports
</button>


<button
  onClick={() => setActivePage("profile")}
  className={`w-full rounded-lg p-3 text-left ${
    activePage === "profile"
      ? "bg-blue-600"
      : "hover:bg-slate-700"
  }`}
>
  👤 My Profile
</button>




<button
  onClick={() => setActivePage("change-password")}
  className="w-full rounded-lg p-3 text-left hover:bg-slate-700"
>
  🔐 Change Password
</button>

  <button
  type="button"
  onClick={() => setActivePage("settings")}
  className="w-full rounded-lg p-3 text-left hover:bg-slate-700"
>
  ⚙️ Settings
</button>
        </nav>

        <button
          onClick={handleLogout}
          className="mt-8 rounded-lg bg-red-600 px-5 py-3 text-white hover:bg-red-700"
        >
          Logout
        </button>
      </aside>

      <main className="flex-1 p-4 md:p-8">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Dashboard</h2>
            <p className="text-gray-500">
              Welcome, {user.name}! Here's your finance overview.
            </p>
          </div>

          <button
            onClick={() => setShowForm(!showForm)}
            className="rounded-lg bg-blue-600 px-5 py-3 text-white hover:bg-blue-700"
          >
            + Add Transaction
          </button>
        </div>

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

                {/* Transaction Summary */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl bg-white p-5 shadow">
            <p className="text-sm text-gray-500">Total Transactions</p>
            <h3 className="mt-2 text-2xl font-bold text-blue-600">
              {totalTransactions}
            </h3>
          </div>

          <div className="rounded-xl bg-white p-5 shadow">
            <p className="text-sm text-gray-500">Income Transactions</p>
            <h3 className="mt-2 text-2xl font-bold text-green-600">
              {incomeTransactionsCount}
            </h3>
          </div>

          <div className="rounded-xl bg-white p-5 shadow">
            <p className="text-sm text-gray-500">Expense Transactions</p>
            <h3 className="mt-2 text-2xl font-bold text-red-600">
              {expenseTransactionsCount}
            </h3>
          </div>
        </div>

        {/* Monthly Spending Insights */}
        <div className="mt-8 rounded-xl bg-white p-6 shadow">
          <h3 className="mb-4 text-xl font-bold">
            📊 Monthly Spending Insights
          </h3>

          <div className="rounded-lg bg-blue-50 p-5">
            <p className="text-sm text-gray-600">
              Current Month Expenses
            </p>

            <h4 className="mt-2 text-2xl font-bold text-blue-700">
              ₹{currentMonthExpenses.toLocaleString("en-IN")}
            </h4>

            <p className="mt-4 text-sm text-gray-600">
              Previous Month Expenses
            </p>

            <h4 className="mt-1 text-xl font-semibold text-gray-800">
              ₹{previousMonthExpenses.toLocaleString("en-IN")}
            </h4>

            <p className="mt-4 font-semibold">
              {spendingInsight}
            </p>

            {previousMonthExpenses > 0 && (
              <p className="mt-2 text-sm text-gray-700">
                Difference: ₹
                {Math.abs(spendingDifference).toLocaleString("en-IN")}
                {" "}({Math.abs(spendingChangePercentage).toFixed(1)}%)
              </p>
            )}
          </div>
        </div>
        {/* Recent Transactions */}
<div className="mt-8 rounded-xl bg-white p-6 shadow">
  <h3 className="mb-4 text-xl font-bold">
    🧾 Recent Transactions
  </h3>
  <select
  value={filterType}
  onChange={(e) => setFilterType(e.target.value)}
  className="mb-4 rounded-lg border p-3"
>
  <option value="all">All Types</option>
  <option value="income">Income</option>
  <option value="expense">Expense</option>
</select>

<input
  type="date"
  value={dateFilter}
  onChange={(e) => setDateFilter(e.target.value)}
  className="mb-4 ml-2 rounded-lg border p-3"
/>

<select
  value={sortOrder}
  onChange={(e) => setSortOrder(e.target.value)}
  className="mb-4 ml-2 rounded-lg border p-3"
>
  <option value="newest">Newest First</option>
  <option value="oldest">Oldest First</option>
  <option value="highest">Highest Amount</option>
  <option value="lowest">Lowest Amount</option>
</select>

  {filteredRecentTransactions.length > 0 ? (
    <div className="space-y-3">
      {filteredRecentTransactions.map((transaction) => (
        <div
          key={transaction._id || transaction.id}
          className="flex items-center justify-between rounded-lg bg-gray-50 p-4"
        >
          <div>
            <p className="font-semibold text-gray-800">
              {transaction.title || transaction.description || transaction.category}
            </p>
            <p className="text-sm text-gray-500">
              {transaction.category} • {transaction.date}
            </p>
          </div>

          <p
            className={`font-bold ${
              transaction.type === "income"
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {transaction.type === "income" ? "+" : "-"}
            ₹{Number(transaction.amount).toLocaleString("en-IN")}
          </p>
        </div>
      ))}
    </div>
  ) : (
    <p className="py-4 text-center text-gray-500">
      No transactions available.
    </p>
  )}
</div>

        {/* Monthly Income & Expense Chart */}
        <div className="mt-8 rounded-xl bg-white p-6 shadow">
          <h3 className="mb-6 text-xl font-bold text-gray-800">
            📊 Monthly Income & Expense
          </h3>

          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Legend />

                <Bar
                  dataKey="Income"
                  fill="#16a34a"
                  radius={[4, 4, 0, 0]}
                />

                <Bar
                  dataKey="Expenses"
                  fill="#dc2626"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        {transactionError && (
  <div className="mt-6 rounded-lg bg-red-100 p-4 text-red-700">
    {transactionError}
  </div>
)}

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

              <select
  value={category}
  onChange={(e) => setCategory(e.target.value)}
  className="rounded-lg border p-3"
>
  <option value="Food">Food</option>
  <option value="Travel">Travel</option>
  <option value="Shopping">Shopping</option>
  <option value="Salary">Salary</option>
  <option value="Education">Education</option>
  <option value="Bills">Bills</option>
  <option value="Health">Health</option>
  <option value="Other">Other</option>
</select>

<input
  type="date"
  value={date}
  onChange={(e) => setDate(e.target.value)}
  required
  className="rounded-lg border p-3"
/>

            </div>

            <button
                type="submit"
                disabled={transactionsLoading}
                className="mt-4 rounded-lg bg-green-600 px-6 py-3 text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {transactionsLoading ? "Saving..." : "Save Transaction"}
              </button>
          </form>
        )}

        <div className="mt-8">

          <div className="mt-8 rounded-xl bg-white p-6 shadow">
  <h3 className="mb-4 text-xl font-bold">
    Expense by Category
  </h3>

  {expenseCategoryData.length === 0 ? (
    <p className="py-8 text-center text-gray-500">
      No expense data available. Add an expense to see the chart.
    </p>
  ) : (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={expenseCategoryData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={100}
          label
        >
          {expenseCategoryData.map((entry, index) => (
            <Cell
              key={entry.name}
              fill={PIE_COLORS[index % PIE_COLORS.length]}
            />
          ))}
        </Pie>

        <Tooltip
          formatter={(value) => `₹${Number(value).toLocaleString("en-IN")}`}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )}
</div>

<div className="mt-8 rounded-xl bg-white p-6 shadow">
  <h3 className="mb-4 text-xl font-bold">
    🏆 Top Spending Category
  </h3>

  {topSpendingCategory ? (
    <div className="rounded-lg bg-blue-50 p-5">
      <p className="text-sm text-gray-600">
        Your Highest Expense Category
      </p>

      <h4 className="mt-2 text-2xl font-bold text-blue-700">
        {topCategoryName}
      </h4>

      <p className="mt-2 text-xl font-semibold text-gray-800">
        ₹{topCategoryAmount.toLocaleString("en-IN")}
      </p>
    </div>
  ) : (
    <p className="py-4 text-center text-gray-500">
      No expense data available.
    </p>
  )}
</div>
<div className="mt-8 rounded-xl bg-white p-6 shadow">
  <h3 className="mb-4 text-xl font-bold">Monthly Budget</h3>
  <div className="mb-5">
  <div className="mb-2 flex justify-between text-sm font-semibold">
    <span>Budget Usage</span>
    <span>{Math.min(100, Math.max(0, budgetPercentage)).toFixed(1)}%</span>
    <span
  className={`rounded-full px-3 py-1 text-xs font-bold ${
    budgetStatus === "Exceeded"
      ? "bg-red-100 text-red-700"
      : budgetStatus === "Near Limit"
      ? "bg-yellow-100 text-yellow-700"
      : budgetStatus === "Safe"
      ? "bg-green-100 text-green-700"
      : "bg-gray-100 text-gray-700"
  }`}
>
  {budgetStatus}
</span>
  </div>

  <div className="h-4 w-full overflow-hidden rounded-full bg-gray-200">
    <div
      className={`h-4 rounded-full transition-all duration-500 ${
        budgetPercentage >= 100
          ? "bg-red-600"
          : budgetPercentage >= 80
          ? "bg-yellow-500"
          : "bg-green-500"
      }`}
      style={{
        width: `${Math.min(100, Math.max(0, budgetPercentage))}%`,
      }}
    ></div>
  </div>
</div>

<div className="mt-6">
  <h4 className="mb-3 text-lg font-semibold">
    Monthly Budget vs Actual Expenses
  </h4>

  {monthlyBudgetComparisonData.length === 0 ? (
    <p className="py-6 text-center text-gray-500">
      No budget history available.
    </p>
  ) : (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={monthlyBudgetComparisonData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip
          formatter={(value) =>
            `₹${Number(value).toLocaleString("en-IN")}`
          }
        />
        <Legend />
        <Bar dataKey="budget" name="Budget" fill="#3B82F6" />
        <Bar dataKey="expenses" name="Actual Expenses" fill="#F59E0B" />
      </BarChart>
    </ResponsiveContainer>
  )}
</div>

  {!budgetAlertDismissed && budgetAlert === "exceeded" && (
  <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-lg bg-red-100 p-4 text-red-800">
    <p className="font-semibold">
      ⚠️ Alert! You have exceeded your monthly budget.
    </p>

    <button
      onClick={() => setBudgetAlertDismissed(true)}
      className="rounded bg-red-600 px-3 py-1 text-white"
    >
      Dismiss
    </button>
  </div>
)}

{!budgetAlertDismissed && budgetAlert === "warning" && (
  <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-lg bg-yellow-100 p-4 text-yellow-800">
    <p className="font-semibold">
      ⚠️ Warning! You have used 80% or more of your monthly budget.
    </p>

    <button
      onClick={() => setBudgetAlertDismissed(true)}
      className="rounded bg-yellow-600 px-3 py-1 text-white"
    >
      Dismiss
    </button>
  </div>
)}

  <form
    onSubmit={saveMonthlyBudget}
    className="flex flex-wrap gap-3"
  >
    <input
      type="number"
      min="1"
      step="0.01"
      placeholder="Enter monthly budget (₹)"
      value={budgetInput}
      onChange={(e) => setBudgetInput(e.target.value)}
      className="min-w-[200px] flex-1 rounded-lg border p-3"
      required
    />

    <button
      type="submit"
      className="rounded-lg bg-blue-600 px-5 py-3 text-white hover:bg-blue-700"
    >
      Save Budget
    </button>
  </form>

  <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
  <div className="rounded-lg bg-blue-50 p-4">
    <p className="text-sm text-gray-600">Monthly Budget</p>
    <h4 className="mt-2 text-2xl font-bold text-blue-700">
      ₹{monthlyBudget.toLocaleString("en-IN")}
    </h4>
  </div>

  <div className="rounded-lg bg-red-50 p-4">
    <p className="text-sm text-gray-600">This Month's Expenses</p>
    <h4 className="mt-2 text-2xl font-bold text-red-600">
      ₹{currentMonthExpenses.toLocaleString("en-IN")}
    </h4>
  </div>

  <div className="rounded-lg bg-green-50 p-4">
    <p className="text-sm text-gray-600">Remaining Budget</p>
    <h4
      className={`mt-2 text-2xl font-bold ${
        remainingBudget < 0 ? "text-red-600" : "text-green-600"
      }`}
    >
      ₹{remainingBudget.toLocaleString("en-IN")}
    </h4>
  </div>
</div>


</div>

{/* Savings Goal Section */}
<div className="mt-8 rounded-xl bg-white p-6 shadow">

  <h3 className="mb-4 text-xl font-bold">
    🎯 Savings Goal
  </h3>

  <div className="mb-4">

    <label className="mb-2 block font-medium">
      Set Your Savings Goal (₹)
    </label>

    <div className="flex flex-wrap gap-3">

      <input
        type="number"
        min="1"
        value={savingsGoalInput}
        onChange={(e) =>
          setSavingsGoalInput(e.target.value)
        }
        placeholder="Enter savings goal"
        className="min-w-0 flex-1 rounded-lg border p-3"
      />

      <button
        type="button"
        onClick={saveSavingsGoal}
        className="rounded-lg bg-green-600 px-5 py-3 font-semibold text-white hover:bg-green-700"
      >
        Save Goal
      </button>

    </div>
  </div>

  <div className="rounded-lg bg-green-50 p-4">

    <p className="text-gray-600">
      Your Savings Goal
    </p>

    <p className="mt-1 text-2xl font-bold text-green-700">
      ₹{savingsGoal.toLocaleString("en-IN")}
    </p>

  </div>

  {currentSavings >= savingsGoal && (
  <div className="mb-4 rounded-lg bg-green-100 p-4 text-green-800">
    <h4 className="text-lg font-bold">
      🎉 Congratulations!
    </h4>
    <p>
      You have successfully achieved your savings goal!
    </p>
  </div>
)}

  {/* Savings Goal Progress */}
<div className="mt-4 rounded-lg bg-blue-50 p-4">

  <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
    <p className="font-medium text-gray-700">
      Current Savings
    </p>

    <p className="font-bold text-blue-700">
      ₹{currentSavings.toLocaleString("en-IN")}
    </p>
  </div>

  <div className="h-4 w-full overflow-hidden rounded-full bg-gray-200">
    <div
      className="h-full rounded-full bg-green-500 transition-all duration-500"
      style={{ width: `${savingsGoalPercentage}%` }}
    />
  </div>

  <div className="mt-2 flex flex-wrap justify-between gap-2 text-sm">
    <span className="font-semibold text-green-700">
      {savingsGoalPercentage.toFixed(1)}% Completed
    </span>

    <span className="text-gray-600">
      ₹{remainingSavingsGoal.toLocaleString("en-IN")} Remaining
    </span>
  </div>

</div>

</div>

<div className="mt-8 rounded-xl bg-white p-6 shadow">
  <h3 className="mb-4 text-xl font-bold">
    Monthly Budget History
  </h3>

  {Object.keys(budgetHistory).length === 0 ? (
    <p className="text-gray-500">
      No budget history available. Set your monthly budget first.
    </p>
  ) : (
    <div className="overflow-x-auto">
<table className="w-full min-w-[650px] text-left">
  <thead>
    <tr className="border-b bg-gray-50">
      <th className="p-3">Month</th>
      <th className="p-3">Budget</th>
      <th className="p-3">Expenses</th>
      <th className="p-3">Remaining</th>
      <th className="p-3">Status</th>
      <th className="p-3">Action</th>
    </tr>
  </thead>

  <tbody>
    {Object.entries(budgetHistory)
      .sort(([monthA], [monthB]) =>
        monthB.localeCompare(monthA)
      )
      .map(([month, budget]) => {
        const [year, monthNumber] = month.split("-").map(Number);

        const monthlyExpenses = transactions
          .filter((transaction) => {
            if (transaction.type !== "expense" || !transaction.date) {
              return false;
            }

            const transactionDate = new Date(transaction.date);

            return (
              transactionDate.getFullYear() === year &&
              transactionDate.getMonth() + 1 === monthNumber
            );
          })
          .reduce(
            (total, transaction) =>
              total + (Number(transaction.amount) || 0),
            0
          );

        const remaining = Number(budget) - monthlyExpenses;

        const status =
          monthlyExpenses > Number(budget)
            ? "Over Budget"
            : monthlyExpenses >= Number(budget) * 0.8
            ? "Near Limit"
            : "Within Budget";

        return (
          <tr key={month} className="border-b">
            <td className="p-3">
              {new Date(`${month}-01T12:00:00`).toLocaleDateString(
                "en-IN",
                {
                  month: "long",
                  year: "numeric",
                }
              )}
            </td>

              <td className="p-3">
                {editingBudgetMonth === month ? (
                  <input
                    type="number"
                    min="1"
                    step="0.01"
                    value={editBudgetAmount}
                    onChange={(e) => setEditBudgetAmount(e.target.value)}
                    className="w-32 rounded-lg border p-2"
                  />
                ) : (
                  `₹${Number(budget).toLocaleString("en-IN")}`
                )}
              </td>

            <td className="p-3 text-red-600">
              ₹{monthlyExpenses.toLocaleString("en-IN")}
            </td>

            <td
              className={`p-3 font-semibold ${
                remaining < 0 ? "text-red-600" : "text-green-600"
              }`}
            >
              ₹{remaining.toLocaleString("en-IN")}
            </td>

            <td className="p-3">
              <span
                className={`rounded-full px-3 py-1 text-sm ${
                  status === "Over Budget"
                    ? "bg-red-100 text-red-700"
                    : status === "Near Limit"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {status}
              </span>
          </td>

          {/* Action Buttons */}
          <td className="p-3">
            {editingBudgetMonth === month ? (
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => updateBudgetHistory(month)}
                  className="rounded bg-green-600 px-3 py-1 text-white"
                >
                  Update
                </button>

                <button
                  onClick={() => {
                    setEditingBudgetMonth(null);
                    setEditBudgetAmount("");
                  }}
                  className="rounded bg-gray-500 px-3 py-1 text-white"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => startEditBudget(month, budget)}
                  className="rounded bg-blue-600 px-3 py-1 text-white"
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteBudgetHistory(month)}
                  className="rounded bg-red-600 px-3 py-1 text-white"
                >
                  Delete
                </button>
              </div>
            )}
          </td>
          </tr>
        );
      })}
  </tbody>
</table>
    </div>
  )}
</div>

{/* Savings Goal History */}
<div className="mt-8 rounded-xl bg-white p-6 shadow">
  <h3 className="mb-4 text-xl font-bold">
    🎯 Savings Goal History
  </h3>

  {savingsGoalHistory.length === 0 ? (
    <p className="text-gray-500">
      No savings goal history available. Set your savings goal first.
    </p>
  ) : (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[650px] text-left">
        <thead>
          <tr className="border-b bg-gray-50">
            <th className="p-3">Date</th>
            <th className="p-3">Previous Goal</th>
            <th className="p-3">New Goal</th>
            <th className="p-3">Status</th>
          </tr>
        </thead>

        <tbody>
          {savingsGoalHistory.map((item) => (
            <tr key={item.id} className="border-b">
              <td className="p-3">{item.date}</td>
              <td className="p-3">
                ₹{Number(item.oldGoal).toLocaleString("en-IN")}
              </td>
                <td className="p-3 font-semibold">
                  {editingGoalId === item.id ? (
                    <input
                      type="number"
                      min="1"
                      value={editGoalAmount}
                      onChange={(e) => setEditGoalAmount(e.target.value)}
                      className="w-32 rounded border p-2"
                    />
                  ) : (
                    `₹${Number(item.newGoal).toLocaleString("en-IN")}`
                  )}
                </td>

<td className="p-3">
  <div className="flex flex-wrap items-center gap-2">
    <span
      className={
        item.status === "Completed"
          ? "font-semibold text-green-600"
          : "font-semibold text-blue-600"
      }
    >
      {item.status}
    </span>

    {editingGoalId === item.id ? (
      <>
        <button
          type="button"
          onClick={() => updateSavingsGoalHistory(item.id)}
          className="rounded bg-green-100 px-3 py-1 text-sm text-green-700"
        >
          Update
        </button>

        <button
          type="button"
          onClick={() => {
            setEditingGoalId(null);
            setEditGoalAmount("");
          }}
          className="rounded bg-gray-100 px-3 py-1 text-sm text-gray-700"
        >
          Cancel
        </button>
      </>
    ) : (
      <button
        type="button"
        onClick={() => startEditSavingsGoal(item)}
        className="rounded bg-blue-100 px-3 py-1 text-sm text-blue-700"
      >
        Edit ✏️
      </button>
    )}

    <button
      type="button"
      onClick={() => deleteSavingsGoalHistory(item.id)}
      className="rounded bg-red-100 px-3 py-1 text-sm text-red-600"
    >
      Delete 🗑️
    </button>
  </div>
</td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )}
</div>

<div className="mt-8 rounded-xl bg-white p-6 shadow">
  <h3 className="mb-4 text-xl font-bold">
    📈 Monthly Financial Analytics
  </h3>
  <div className="mb-6">
  <h4 className="mb-3 text-lg font-semibold">
    💰 Monthly Savings Trend
  </h4>

  <div className="h-72 w-full">
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={monthlySummaryData}>
        <CartesianGrid strokeDasharray="3 3" />

        <XAxis dataKey="month" />

        <YAxis />

        <Tooltip
          formatter={(value) =>
            `₹${Number(value).toLocaleString("en-IN")}`
          }
        />

        <Legend />

        <Line
          type="monotone"
          dataKey="savings"
          name="Savings"
          stroke="#16a34a"
          strokeWidth={3}
          dot={{ r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
</div>

  <div className="overflow-x-auto">
    <table className="w-full min-w-[500px] text-left">
      <thead>
        <tr className="border-b bg-gray-50">
          <th className="p-3">Month</th>
          <th className="p-3">Income</th>
          <th className="p-3">Expenses</th>
          <th className="p-3">Savings</th>
        </tr>
      </thead>

      <tbody>
        {monthlySummaryData.map((data) => (
          <tr key={data.month} className="border-b">
            <td className="p-3">{data.month}</td>

            <td className="p-3 text-green-600">
              ₹{data.income.toLocaleString("en-IN")}
            </td>

            <td className="p-3 text-red-600">
              ₹{data.expenses.toLocaleString("en-IN")}
            </td>

            <td className="p-3 font-semibold">
              ₹{data.savings.toLocaleString("en-IN")}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
  
</div>
</div>

<div className="mt-8 overflow-x-auto rounded-xl bg-white p-6 shadow">
          <h3 className="mb-6 text-xl font-bold">Recent Transactions</h3>
          <input
  type="text"
  placeholder="Search by title or category..."
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
  className="mb-4 w-full rounded-lg border p-3"
/>
<button
  onClick={exportToCSV}
  disabled={filteredTransactions.length === 0}
  className="mb-4 rounded-lg bg-green-600 px-5 py-3 text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
>
  📥 Export CSV
</button>

<button
  onClick={downloadBackup}
  disabled={transactions.length === 0}
  className="mb-4 ml-2 rounded-lg bg-blue-600 px-5 py-3 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
>
  📦 Download Backup
</button>

<label className="mb-4 ml-2 inline-block cursor-pointer rounded-lg bg-purple-600 px-5 py-3 text-white hover:bg-purple-700">
  📂 Restore Backup
  <input
    type="file"
    accept=".json,application/json"
    onChange={restoreBackup}
    className="hidden"
  />
</label>

  <div className="mb-4 flex flex-wrap gap-4">
  <select
    value={filterType}
    onChange={(e) => setFilterType(e.target.value)}
    className="rounded-lg border p-3"
  >
    <option value="all">All Types</option>
    <option value="income">Income</option>
    <option value="expense">Expense</option>
  </select>

  <select
    value={filterCategory}
    onChange={(e) => setFilterCategory(e.target.value)}
    className="rounded-lg border p-3"
  >
    <option value="all">All Categories</option>
    {[...new Set(transactions.map((t) => t.category))].map((category) => (
      <option key={category} value={category}>
        {category}
      </option>
    ))}
  </select>
</div>
          {transactionsLoading && (
  <p className="mb-4 text-blue-600">
    Loading transactions...
  </p>
)}

          <table className="w-full min-w-[450px] text-left">
            <thead>
              <tr className="border-b text-gray-500">
                <th className="p-3">Title</th>
                <th className="p-3">Category</th>
                <th className="p-3">Type</th>
                <th className="p-3">Date</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>

<tbody>
  {filteredTransactions.length === 0 ? (
    <tr>
      <td colSpan="6" className="p-6 text-center">
        {transactions.length === 0 ? (
          <div className="text-gray-500">
            <p className="text-3xl mb-2">💳</p>
            <p className="font-semibold">No Transactions Yet</p>
            <p className="text-sm">
              Add your first transaction to get started.
            </p>
          </div>
        ) : (
          <div className="text-gray-500">
            <p className="text-3xl mb-2">🔍</p>
            <p className="font-semibold">No Results Found</p>
            <p className="text-sm">
              Try changing your search or filters.
            </p>
          </div>
        )}
      </td>
    </tr>
  ) : (
    paginatedTransactions.map((transaction) => (
      <tr
        key={transaction._id || transaction.id}
        className="border-b"
      >
        <td className="p-3">{transaction.title}</td>
        <td className="p-3">{transaction.category}</td>
        <td className="p-3 capitalize">{transaction.type}</td>
        <td className="p-3">
          {transaction.date
            ? new Date(transaction.date).toLocaleDateString("en-IN")
            : "-"}
        </td>
        <td
          className={`p-3 font-semibold ${
            transaction.type === "income"
              ? "text-green-600"
              : "text-red-600"
          }`}
        >
          {transaction.type === "income" ? "+" : "-"}
          {formatCurrency(Number(transaction.amount))}
        </td>
        <td className="p-3">
          <button
            onClick={() => editTransaction(transaction)}
            className="mr-2 rounded-lg bg-blue-600 px-3 py-2 text-white hover:bg-blue-700"
          >
            Edit ✏️
          </button>

          <button
            onClick={() => deleteTransaction(transaction._id)}
            className="rounded-lg bg-red-600 px-3 py-2 text-white hover:bg-red-700"
          >
            Delete 🗑️
          </button>
        </td>
      </tr>
    ))
  )}
</tbody>
</table>

{/* Pagination Buttons */}
<div className="mt-4 flex items-center justify-between">
  <button
    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
    disabled={currentPage === 1}
    className="rounded-lg bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
  >
    Previous
  </button>

  <span className="font-semibold">
    Page {currentPage} of {totalPages || 1}
  </span>

  <button
    onClick={() =>
      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
    }
    disabled={currentPage >= totalPages}
    className="rounded-lg bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
  >
    Next
  </button>
</div>

</div>
</main>
    </div>
  );
}

export default App;