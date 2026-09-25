const mongoose = require("mongoose");

const Gallery = require("../models/Gallery");

// Create Gallery Item
const createGallery = async (req, res) => {
  try {
    const { image, title, description, category } = req.body;

    if (!image || !title || !category) {
      return res.status(400).json({
        success: false,
        message: "Image, title, and category are required.",
      });
    }

    const galleryItem = await Gallery.create({
      image,
      title,
      description,
      category,
    });

    res.status(201).json({
      success: true,
      message: "Gallery item created successfully!",
      data: galleryItem,
    });
  } catch (error) {
    console.error("Create gallery error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create gallery item.",
    });
  }
};

// Get All Gallery Items
const getGallery = async (req, res) => {
  try {
    const galleryItems = await Gallery.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: galleryItems.length,
      data: galleryItems,
    });
  } catch (error) {
    console.error("Get gallery error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch gallery items.",
    });
  }
};

// Update Gallery Item
const updateGallery = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid gallery item ID.",
      });
    }

    const { image, title, description, category } = req.body;

    if (!image || !title || !category) {
      return res.status(400).json({
        success: false,
        message: "Image, title, and category are required.",
      });
    }

    const updatedGalleryItem = await Gallery.findByIdAndUpdate(
      id,
      {
        image,
        title,
        description,
        category,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedGalleryItem) {
      return res.status(404).json({
        success: false,
        message: "Gallery item not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Gallery item updated successfully!",
      data: updatedGalleryItem,
    });
  } catch (error) {
    console.error("Update gallery error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update gallery item.",
    });
  }
};

// Delete Gallery Item
const deleteGallery = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid gallery item ID.",
      });
    }

    const deletedGalleryItem = await Gallery.findByIdAndDelete(id);

    if (!deletedGalleryItem) {
      return res.status(404).json({
        success: false,
        message: "Gallery item not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Gallery item deleted successfully!",
      data: deletedGalleryItem,
    });
  } catch (error) {
    console.error("Delete gallery error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete gallery item.",
    });
  }
};

module.exports = {
  createGallery,
  getGallery,
  updateGallery,
  deleteGallery,
};