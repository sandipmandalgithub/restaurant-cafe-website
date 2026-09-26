const mongoose = require("mongoose");

const Order = require("../models/Order");

// Create Order - Public
const createOrder = async (req, res) => {
  try {
    const {
      name,
      mobile,
      orderType,
      address,
      note,
      items,
    } = req.body;

    // Validate customer name
    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Customer name is required.",
      });
    }

    // Validate mobile number
    if (!mobile || !mobile.trim()) {
      return res.status(400).json({
        success: false,
        message: "Mobile number is required.",
      });
    }

    if (!/^[6-9]\d{9}$/.test(mobile.trim())) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid 10-digit mobile number.",
      });
    }

    // Validate order type
    if (!["Delivery", "Pickup"].includes(orderType)) {
      return res.status(400).json({
        success: false,
        message: "Order type must be Delivery or Pickup.",
      });
    }

    // Delivery address required
    if (orderType === "Delivery" && (!address || !address.trim())) {
      return res.status(400).json({
        success: false,
        message: "Delivery address is required.",
      });
    }

    // Validate items
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Order must contain at least one item.",
      });
    }

    // Prepare order items
    const orderItems = [];

    for (const item of items) {
      if (!mongoose.Types.ObjectId.isValid(item.menuItemId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid menu item ID.",
        });
      }

      if (!item.name || !item.name.trim()) {
        return res.status(400).json({
          success: false,
          message: "Menu item name is required.",
        });
      }

      const price = Number(item.price);
      const quantity = Number(item.quantity);

      if (!Number.isFinite(price) || price < 0) {
        return res.status(400).json({
          success: false,
          message: `Invalid price for ${item.name}.`,
        });
      }

      if (!Number.isInteger(quantity) || quantity < 1) {
        return res.status(400).json({
          success: false,
          message: `Invalid quantity for ${item.name}.`,
        });
      }

      const itemSubtotal = price * quantity;

      orderItems.push({
        menuItemId: item.menuItemId,
        name: item.name.trim(),
        price,
        quantity,
        subtotal: itemSubtotal,
      });
    }

    // Calculate subtotal
    const subtotal = orderItems.reduce(
      (total, item) => total + item.subtotal,
      0
    );

    // Delivery charge
    const deliveryCharge = orderType === "Delivery" ? 40 : 0;

    // Final total
    const totalAmount = subtotal + deliveryCharge;

    // Create order
    const order = await Order.create({
      customer: {
        name: name.trim(),
        mobile: mobile.trim(),
      },

      orderType,

      address:
        orderType === "Delivery"
          ? address.trim()
          : "",

      note: note ? note.trim() : "",

      items: orderItems,

      subtotal,

      deliveryCharge,

      totalAmount,

      status: "Pending",
    });

    res.status(201).json({
      success: true,
      message: "Order placed successfully!",
      data: order,
    });
  } catch (error) {
    console.error("Create order error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create order.",
    });
  }
};

// Get All Orders - Admin Only
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    console.error("Get orders error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch orders.",
    });
  }
};

// Get Single Order - Admin Only
const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID.",
      });
    }

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error("Get order error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch order.",
    });
  }
};

// Update Order Status - Admin Only
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID.",
      });
    }

    const allowedStatuses = [
      "Pending",
      "Confirmed",
      "Preparing",
      "Ready",
      "Completed",
      "Cancelled",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status.",
      });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      {
        status,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedOrder) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Order status updated successfully!",
      data: updatedOrder,
    });
  } catch (error) {
    console.error("Update order status error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update order status.",
    });
  }
};

// Delete Order - Admin Only
const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID.",
      });
    }

    const deletedOrder = await Order.findByIdAndDelete(id);

    if (!deletedOrder) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Order deleted successfully!",
      data: deletedOrder,
    });
  } catch (error) {
    console.error("Delete order error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete order.",
    });
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
};
