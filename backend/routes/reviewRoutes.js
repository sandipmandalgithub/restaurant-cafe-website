const express = require("express");

const {
  createReview,
  getApprovedReviews,
  getReviews,
  updateReviewStatus,
  deleteReview,
} = require("../controllers/reviewController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// ======================================================
// Public Routes
// ======================================================

// Customer submits review
router.post("/", createReview);

// Website displays approved reviews
router.get("/approved", getApprovedReviews);

// ======================================================
// Admin Routes
// ======================================================

// Get all reviews
router.get("/", protect, getReviews);

// Update review status
router.put("/:id/status", protect, updateReviewStatus);

// Delete review
router.delete("/:id", protect, deleteReview);

module.exports = router;
