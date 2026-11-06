const express = require("express");

const {
  registerUser,
  loginUser,
  updateUserProfile,
  changePassword,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Register API
router.post("/register", registerUser);

// Login API
router.post("/login", loginUser);

// Update Profile API (Protected)
router.put("/profile", protect, updateUserProfile);

// Change Password API (Protected)
router.put("/change-password", protect, changePassword);

// Forgot Password API
router.post("/forgot-password", forgotPassword);

// Reset Password API
router.post("/reset-password/:token", resetPassword);

module.exports = router;