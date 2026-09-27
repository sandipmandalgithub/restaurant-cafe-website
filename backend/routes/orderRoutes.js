const express = require("express");

const {
  createOrder,
  getOrders,
  getOrderById,
  trackOrder,
  updateOrderStatus,
  deleteOrder,
  getOrderStatistics,
} = require("../controllers/orderController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// ======================================================
// Customer - Public
// ======================================================

// Place new order
router.post("/", createOrder);

// Track customer order
// Example:
// GET /api/orders/track/ORDER_ID?mobile=9876543210
router.get("/track/:id", trackOrder);

// ======================================================
// Admin - Protected
// ======================================================

// Get order statistics
router.get("/statistics", protect, getOrderStatistics);

// Get all orders
router.get("/", protect, getOrders);

// Get single order
router.get("/:id", protect, getOrderById);

// Update order status
router.put("/:id/status", protect, updateOrderStatus);

// Delete order
router.delete("/:id", protect, deleteOrder);

module.exports = router;
