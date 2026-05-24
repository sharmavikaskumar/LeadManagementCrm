const express = require("express");

const {
  registerUser,
  loginUser,
} = require("../controllers/authController");

const {
  getCurrentUser,
} = require("../controllers/me");

const { protect } = require("../middleware/authmiddleware");

const router = express.Router();

// Auth Routes
router.post("/register", registerUser);

router.post("/login", loginUser);

// Current Logged In User
router.get("/me", protect, getCurrentUser);

module.exports = router;