const express = require("express");

const {
  createReservation,
  getCustomerReservations,
  getReservations,
  getReservationById,
  updateReservationStatus,
  deleteReservation,
} = require("../controllers/reservationController");

const protect = require("../middleware/authMiddleware");
const customerProtect = require(
  "../middleware/customerAuthMiddleware"
);
const customerOptionalAuth = require(
  "../middleware/customerOptionalAuthMiddleware"
);

const router = express.Router();

// ==========================================
// Customer / Guest Reservation
// ==========================================

// Create reservation
// Guest users can reserve.
// Logged-in customers will have customerId attached.
router.post(
  "/",
  customerOptionalAuth,
  createReservation
);

// ==========================================
// Customer Protected Routes
// ==========================================

// Get logged-in customer's reservations
router.get(
  "/customer",
  customerProtect,
  getCustomerReservations
);

// ==========================================
// Admin Protected Routes
// ==========================================

// Get all reservations
router.get(
  "/",
  protect,
  getReservations
);

// Get single reservation
router.get(
  "/:id",
  protect,
  getReservationById
);

// Update reservation status
router.patch(
  "/:id/status",
  protect,
  updateReservationStatus
);

// Delete reservation
router.delete(
  "/:id",
  protect,
  deleteReservation
);

module.exports = router;
