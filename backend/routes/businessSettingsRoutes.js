const express = require("express");

const {
  getBusinessSettings,
  getAdminBusinessSettings,
  updateBusinessSettings,
} = require("../controllers/businessSettingsController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Public - Customer website
router.get("/", getBusinessSettings);

// Admin - Protected
router.get("/admin", protect, getAdminBusinessSettings);
router.put("/", protect, updateBusinessSettings);

module.exports = router;
