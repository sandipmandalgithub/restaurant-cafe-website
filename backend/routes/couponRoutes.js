const express = require("express");

const {
  createCoupon,
  getCoupons,
  getCouponById,
  updateCoupon,
  deleteCoupon,
  toggleCouponStatus,
  validateCoupon,
} = require("../controllers/couponController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Customer - Public
router.post("/validate", validateCoupon);

// Admin - Protected
router.post("/", protect, createCoupon);
router.get("/", protect, getCoupons);
router.get("/:id", protect, getCouponById);
router.put("/:id", protect, updateCoupon);
router.delete("/:id", protect, deleteCoupon);
router.patch("/:id/toggle", protect, toggleCouponStatus);

module.exports = router;
