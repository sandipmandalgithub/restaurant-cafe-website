const express = require("express");

const {
  loginAdmin,
  getCurrentAdmin,
} = require("../controllers/adminController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Public
router.post("/login", loginAdmin);

// Admin only
router.get("/me", protect, getCurrentAdmin);

module.exports = router;