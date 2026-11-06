const Transaction = require("../models/Transaction");

// Add a new transaction
const addTransaction = async (req, res) => {
  try {
    const { title, category, amount, type, date } = req.body;

    if (
      !title ||
      !category ||
      amount === undefined ||
      !Number.isFinite(Number(amount)) ||
      Number(amount) <= 0 ||
      !["income", "expense"].includes(type)
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide valid transaction details.",
      });
    }

    const transaction = await Transaction.create({
      user: req.user.id,
      title: title.trim(),
      category: category.trim(),
      amount: Number(amount),
      type,
      ...(date && { date }),
    });

    res.status(201).json({
      success: true,
      message: "Transaction added successfully.",
      transaction,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to add transaction.",
    });
  }
};

// Get logged-in user's transactions
const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({
      user: req.user.id,
    }).sort({ date: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      transactions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch transactions.",
    });
  }
};

const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Transaction deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete transaction.",
    });
  }
};
// Update Transaction
const updateTransaction = async (req, res) => {
  try {
    const { title, category, amount, type, date } = req.body;

    const transaction = await Transaction.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user.id,
      },
      {
        ...(title !== undefined && { title }),
        ...(category !== undefined && { category }),
        ...(amount !== undefined && { amount }),
        ...(type !== undefined && { type }),
        ...(date !== undefined && { date }),
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Transaction updated successfully.",
      transaction,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update transaction.",
    });
  }
};

module.exports = {
  addTransaction,
  getTransactions,
  deleteTransaction,
  updateTransaction,
};