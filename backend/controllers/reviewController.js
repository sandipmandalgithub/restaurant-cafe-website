const mongoose = require("mongoose");

const Review = require("../models/Review");

// ======================================================
// Create Review - Public
// ======================================================
const createReview = async (req, res) => {
  try {
    const { customerName, rating, message } = req.body;

    if (!customerName || !customerName.trim()) {
      return res.status(400).json({
        message: "Customer name is required.",
      });
    }

    if (!rating) {
      return res.status(400).json({
        message: "Rating is required.",
      });
    }

    const numericRating = Number(rating);

    if (
      !Number.isInteger(numericRating) ||
      numericRating < 1 ||
      numericRating > 5
    ) {
      return res.status(400).json({
        message: "Rating must be between 1 and 5.",
      });
    }

    if (!message || !message.trim()) {
      return res.status(400).json({
        message: "Review message is required.",
      });
    }

    const review = await Review.create({
      customerName: customerName.trim(),
      rating: numericRating,
      message: message.trim(),
      status: "Pending",
    });

    return res.status(201).json({
      message:
        "Thank you! Your review has been submitted and is awaiting approval.",
      review,
    });
  } catch (error) {
    console.error("Failed to create review:", error);

    return res.status(500).json({
      message: "Unable to submit review.",
    });
  }
};

// ======================================================
// Get Approved Reviews - Public
// ======================================================
const getApprovedReviews = async (req, res) => {
  try {
    const reviews = await Review.find({
      status: "Approved",
    }).sort({
      createdAt: -1,
    });

    return res.status(200).json(reviews);
  } catch (error) {
    console.error("Failed to fetch approved reviews:", error);

    return res.status(500).json({
      message: "Unable to load reviews.",
    });
  }
};

// ======================================================
// Get All Reviews - Admin
// ======================================================
const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find().sort({
      createdAt: -1,
    });

    return res.status(200).json(reviews);
  } catch (error) {
    console.error("Failed to fetch reviews:", error);

    return res.status(500).json({
      message: "Unable to load reviews.",
    });
  }
};

// ======================================================
// Update Review Status - Admin
// ======================================================
const updateReviewStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid review ID.",
      });
    }

    const allowedStatuses = [
      "Pending",
      "Approved",
      "Rejected",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid review status.",
      });
    }

    const review = await Review.findByIdAndUpdate(
      id,
      {
        status,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!review) {
      return res.status(404).json({
        message: "Review not found.",
      });
    }

    return res.status(200).json({
      message: "Review status updated successfully.",
      review,
    });
  } catch (error) {
    console.error(
      "Failed to update review status:",
      error
    );

    return res.status(500).json({
      message: "Unable to update review status.",
    });
  }
};

// ======================================================
// Delete Review - Admin
// ======================================================
const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid review ID.",
      });
    }

    const review = await Review.findByIdAndDelete(id);

    if (!review) {
      return res.status(404).json({
        message: "Review not found.",
      });
    }

    return res.status(200).json({
      message: "Review deleted successfully.",
    });
  } catch (error) {
    console.error("Failed to delete review:", error);

    return res.status(500).json({
      message: "Unable to delete review.",
    });
  }
};

module.exports = {
  createReview,
  getApprovedReviews,
  getReviews,
  updateReviewStatus,
  deleteReview,
};
