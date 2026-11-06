const express = require("express");

const {
  addTransaction,
  getTransactions,
  deleteTransaction,
  updateTransaction,
} = require("../controllers/transactionController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Add Transaction
router.post("/", protect, addTransaction);

// Get All Transactions
router.get("/", protect, getTransactions);

// Delete Transaction
router.delete("/:id", protect, deleteTransaction);
// Update Transaction
router.put("/:id", protect, updateTransaction);

module.exports = router;