const express = require("express");

const {
  createGallery,
  getGallery,
  updateGallery,
  deleteGallery,
} = require("../controllers/galleryController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Public
router.get("/", getGallery);

// Admin only
router.post("/", protect, createGallery);
router.put("/:id", protect, updateGallery);
router.delete("/:id", protect, deleteGallery);

module.exports = router;