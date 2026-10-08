const express = require("express");

const {
  registerCustomer,
  loginCustomer,
  getCurrentCustomer,
  updateCustomerProfile,
} = require("../controllers/customerController");

const customerProtect = require("../middleware/customerAuthMiddleware");

const router = express.Router();

// Public Customer Routes
router.post("/register", registerCustomer);
router.post("/login", loginCustomer);

// Protected Customer Routes
router.get("/me", customerProtect, getCurrentCustomer);
router.put("/profile", customerProtect, updateCustomerProfile);

module.exports = router;
