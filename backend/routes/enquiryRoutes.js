const express = require("express");

const {
  createEnquiry,
  getEnquiries,
  updateEnquiryStatus,
  deleteEnquiry,
} = require("../controllers/enquiryController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Public
router.post("/", createEnquiry);

// Admin only
router.get("/", protect, getEnquiries);
router.put("/:id", protect, updateEnquiryStatus);
router.delete("/:id", protect, deleteEnquiry);

module.exports = router;