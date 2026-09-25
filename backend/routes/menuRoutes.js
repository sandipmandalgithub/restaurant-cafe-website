const express = require("express");

const {
  createMenu,
  getMenus,
  updateMenu,
  deleteMenu,
} = require("../controllers/menuController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Public
router.get("/", getMenus);

// Admin only
router.post("/", protect, createMenu);
router.put("/:id", protect, updateMenu);
router.delete("/:id", protect, deleteMenu);

module.exports = router;