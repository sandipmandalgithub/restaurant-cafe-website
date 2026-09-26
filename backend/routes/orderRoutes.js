const express = require("express");

const {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
} = require("../controllers/orderController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// ==============================
// Customer - Public
// ==============================

// Place new order
router.post("/", createOrder);


// ==============================
// Admin - Protected
// ==============================

// Get all orders
router.get("/", protect, getOrders);

// Get single order
router.get("/:id", protect, getOrderById);

// Update order status
router.put("/:id/status", protect, updateOrderStatus);

// Delete order
router.delete("/:id", protect, deleteOrder);

module.exports = router;
