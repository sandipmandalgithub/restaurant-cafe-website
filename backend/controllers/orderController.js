const mongoose = require("mongoose");

const Order = require("../models/Order");

// ======================================================
// Create Order - Public / Optional Customer Authentication
// ======================================================
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

    // Prepare order data
    const orderData = {
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
    };

    // Attach logged-in customer ID when available.
    // Guest orders will not have customerId.
    if (
      req.customer &&
      req.customer.id &&
      mongoose.Types.ObjectId.isValid(req.customer.id)
    ) {
      orderData.customerId = req.customer.id;
    }

    // Create order
    const order = await Order.create(orderData);

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

// ======================================================
// Get Customer Order History - Customer Only
// ======================================================
const getCustomerOrderHistory = async (req, res) => {
  try {
    if (!req.customer || !req.customer.id) {
      return res.status(401).json({
        success: false,
        message: "Customer authentication required.",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(req.customer.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid customer ID.",
      });
    }

    const orders = await Order.find({
      customerId: req.customer.id,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    console.error("Get customer order history error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch customer order history.",
    });
  }
};

// ======================================================
// Get All Orders - Admin Only
// ======================================================
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

// ======================================================
// Get Single Order - Admin Only
// ======================================================
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

// ======================================================
// Track Order - Customer Public
// ======================================================
const trackOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { mobile } = req.query;

    // Validate order ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID.",
      });
    }

    // Validate mobile number
    if (!mobile || !mobile.trim()) {
      return res.status(400).json({
        success: false,
        message: "Mobile number is required.",
      });
    }

    const normalizedMobile = mobile.trim();

    if (!/^[6-9]\d{9}$/.test(normalizedMobile)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid 10-digit mobile number.",
      });
    }

    // Find order using both Order ID and customer mobile
    const order = await Order.findOne({
      _id: id,
      "customer.mobile": normalizedMobile,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message:
          "Order not found. Please check your Order ID and mobile number.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Order found successfully.",
      data: order,
    });
  } catch (error) {
    console.error("Track order error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to track order.",
    });
  }
};

// ======================================================
// Update Order Status - Admin Only
// ======================================================
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

// ======================================================
// Delete Order - Admin Only
// ======================================================
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

// ======================================================
// Get Order Statistics - Admin Only
// ======================================================
const getOrderStatistics = async (req, res) => {
  try {
    // Get all orders
    const orders = await Order.find().lean();

    // Basic order statistics
    const totalOrders = orders.length;

    const completedOrders = orders.filter(
      (order) => order.status === "Completed"
    ).length;

    const cancelledOrders = orders.filter(
      (order) => order.status === "Cancelled"
    ).length;

    const pendingOrders = orders.filter(
      (order) => order.status === "Pending"
    ).length;

    const confirmedOrders = orders.filter(
      (order) => order.status === "Confirmed"
    ).length;

    const preparingOrders = orders.filter(
      (order) => order.status === "Preparing"
    ).length;

    const readyOrders = orders.filter(
      (order) => order.status === "Ready"
    ).length;

    // Revenue
    // Cancelled orders are excluded from revenue.
    const validOrders = orders.filter(
      (order) => order.status !== "Cancelled"
    );

    const totalRevenue = validOrders.reduce(
      (total, order) => total + Number(order.totalAmount || 0),
      0
    );

    // Completed revenue
    const completedRevenue = orders
      .filter((order) => order.status === "Completed")
      .reduce(
        (total, order) => total + Number(order.totalAmount || 0),
        0
      );

    // Average order value
    const averageOrderValue =
      validOrders.length > 0
        ? totalRevenue / validOrders.length
        : 0;

    // Delivery vs Pickup
    const deliveryOrders = orders.filter(
      (order) => order.orderType === "Delivery"
    ).length;

    const pickupOrders = orders.filter(
      (order) => order.orderType === "Pickup"
    ).length;

    // Best Selling Items
    const itemSalesMap = {};

    validOrders.forEach((order) => {
      if (!Array.isArray(order.items)) {
        return;
      }

      order.items.forEach((item) => {
        const itemId = String(item.menuItemId);

        if (!itemSalesMap[itemId]) {
          itemSalesMap[itemId] = {
            menuItemId: item.menuItemId,
            name: item.name,
            quantity: 0,
            revenue: 0,
          };
        }

        itemSalesMap[itemId].quantity += Number(
          item.quantity || 0
        );

        itemSalesMap[itemId].revenue += Number(
          item.subtotal || 0
        );
      });
    });

    const bestSellingItems = Object.values(itemSalesMap)
      .sort((a, b) => {
        if (b.quantity !== a.quantity) {
          return b.quantity - a.quantity;
        }

        return b.revenue - a.revenue;
      })
      .slice(0, 10);

    // Revenue by Date
    const revenueByDateMap = {};

    validOrders.forEach((order) => {
      if (!order.createdAt) {
        return;
      }

      const date = new Date(order.createdAt)
        .toISOString()
        .split("T")[0];

      if (!revenueByDateMap[date]) {
        revenueByDateMap[date] = {
          date,
          revenue: 0,
          orders: 0,
        };
      }

      revenueByDateMap[date].revenue += Number(
        order.totalAmount || 0
      );

      revenueByDateMap[date].orders += 1;
    });

    const revenueByDate = Object.values(revenueByDateMap)
      .sort((a, b) => a.date.localeCompare(b.date));

    res.status(200).json({
      success: true,

      data: {
        summary: {
          totalOrders,
          completedOrders,
          cancelledOrders,
          pendingOrders,
          confirmedOrders,
          preparingOrders,
          readyOrders,
          totalRevenue: Number(totalRevenue.toFixed(2)),
          completedRevenue: Number(
            completedRevenue.toFixed(2)
          ),
          averageOrderValue: Number(
            averageOrderValue.toFixed(2)
          ),
          deliveryOrders,
          pickupOrders,
        },

        bestSellingItems,

        revenueByDate,
      },
    });
  } catch (error) {
    console.error("Get order statistics error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch order statistics.",
    });
  }
};

module.exports = {
  createOrder,
  getCustomerOrderHistory,
  getOrders,
  getOrderById,
  trackOrder,
  updateOrderStatus,
  deleteOrder,
  getOrderStatistics,
};
