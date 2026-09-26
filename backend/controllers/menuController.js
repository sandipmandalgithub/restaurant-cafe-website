const mongoose = require("mongoose");

const Menu = require("../models/Menu");

// Create Menu Item
const createMenu = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      image,
      category,
      isAvailable,
    } = req.body;

    if (
      !name ||
      !description ||
      price === undefined ||
      !image ||
      !category
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Name, description, price, image, and category are required.",
      });
    }

    if (Number(price) < 0) {
      return res.status(400).json({
        success: false,
        message: "Price cannot be negative.",
      });
    }

    const menuItem = await Menu.create({
      name,
      description,
      price,
      image,
      category,
      isAvailable:
        isAvailable === undefined ? true : Boolean(isAvailable),
    });

    res.status(201).json({
      success: true,
      message: "Menu item created successfully!",
      data: menuItem,
    });
  } catch (error) {
    console.error("Create menu error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create menu item.",
    });
  }
};

// Get All Menu Items
const getMenus = async (req, res) => {
  try {
    const menuItems = await Menu.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: menuItems.length,
      data: menuItems,
    });
  } catch (error) {
    console.error("Get menus error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch menu items.",
    });
  }
};

// Update Menu Item
const updateMenu = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid menu item ID.",
      });
    }

    const {
      name,
      description,
      price,
      image,
      category,
      isAvailable,
    } = req.body;

    if (
      !name ||
      !description ||
      price === undefined ||
      !image ||
      !category
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Name, description, price, image, and category are required.",
      });
    }

    if (Number(price) < 0) {
      return res.status(400).json({
        success: false,
        message: "Price cannot be negative.",
      });
    }

    const updateData = {
      name,
      description,
      price,
      image,
      category,
    };

    if (isAvailable !== undefined) {
      updateData.isAvailable = Boolean(isAvailable);
    }

    const updatedMenuItem = await Menu.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedMenuItem) {
      return res.status(404).json({
        success: false,
        message: "Menu item not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Menu item updated successfully!",
      data: updatedMenuItem,
    });
  } catch (error) {
    console.error("Update menu error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update menu item.",
    });
  }
};

// Delete Menu Item
const deleteMenu = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid menu item ID.",
      });
    }

    const deletedMenuItem = await Menu.findByIdAndDelete(id);

    if (!deletedMenuItem) {
      return res.status(404).json({
        success: false,
        message: "Menu item not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Menu item deleted successfully!",
      data: deletedMenuItem,
    });
  } catch (error) {
    console.error("Delete menu error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete menu item.",
    });
  }
};

module.exports = {
  createMenu,
  getMenus,
  updateMenu,
  deleteMenu,
};
