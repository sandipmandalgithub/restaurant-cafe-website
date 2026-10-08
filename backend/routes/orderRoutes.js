const express = require("express");

const {
  createOrder,
  getOrders,
  getOrderById,
  trackOrder,
  updateOrderStatus,
  deleteOrder,
  getOrderStatistics,
  getCustomerOrderHistory,
} = require("../controllers/orderController");

const protect = require("../middleware/authMiddleware");
const customerProtect = require("../middleware/customerAuthMiddleware");
const customerOptionalAuth = require("../middleware/customerOptionalAuthMiddleware");

const router = express.Router();

// ======================================================
// Customer - Public
// ======================================================

// Place new order
// Guest checkout is allowed.
// Logged-in customers are also supported.
router.post("/", customerOptionalAuth, createOrder);

// Track customer order
// Example:
// GET /api/orders/track/ORDER_ID?mobile=9876543210
router.get("/track/:id", trackOrder);

// ======================================================
// Customer - Protected
// ======================================================

// Get logged-in customer's order history
router.get(
  "/customer/history",
  customerProtect,
  getCustomerOrderHistory
);

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
