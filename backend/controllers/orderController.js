const mongoose = require("mongoose");

const Order = require("../models/Order");
const Coupon = require("../models/Coupon");
const Customer = require("../models/Customer");
const Menu = require("../models/Menu");
const {
  sendOrderConfirmationEmail,
} = require("../config/emailService");

// ======================================================
// Create Order - Public / Optional Customer Authentication
// ======================================================
const createOrder = async (req, res) => {
  try {
    const {
      name,
      mobile,
      email,
      orderType,
      address,
      note,
      items,
      couponCode,
    } = req.body;

    // Validate customer name
    if (typeof name !== "string" || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Customer name is required.",
      });
    }

    // Validate mobile number
    if (typeof mobile !== "string" || !mobile.trim()) {
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

    // Validate guest email format when provided.
    let customerEmail =
      typeof email === "string" ? email.trim().toLowerCase() : "";

    if (
      customerEmail &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)
    ) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address.",
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
    if (
      orderType === "Delivery" &&
      (typeof address !== "string" || !address.trim())
    ) {
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

    // ======================================================
    // Resolve Logged-in Customer
    // ======================================================
    let authenticatedCustomerId = null;

    if (
      req.customer &&
      req.customer.id &&
      mongoose.Types.ObjectId.isValid(req.customer.id)
    ) {
      const authenticatedCustomer = await Customer.findById(
        req.customer.id
      ).select("email isActive");

      if (authenticatedCustomer && authenticatedCustomer.isActive) {
        authenticatedCustomerId = authenticatedCustomer._id;
        customerEmail = authenticatedCustomer.email;
      } else {
        return res.status(401).json({
          success: false,
          message:
            "Your customer account could not be verified. Please log in again.",
        });
      }
    }

    // ======================================================
    // Prepare Order Items
    // Use the actual menu data from the database.
    // Never trust the client-provided name or price.
    // ======================================================
    const orderItems = [];

    for (const item of items) {
      if (
        !item ||
        typeof item.menuItemId !== "string" ||
        !mongoose.Types.ObjectId.isValid(item.menuItemId)
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid menu item ID.",
        });
      }

      const quantity = Number(item.quantity);

      if (!Number.isInteger(quantity) || quantity < 1) {
        return res.status(400).json({
          success: false,
          message: "Invalid item quantity.",
        });
      }

      const menuItem = await Menu.findById(item.menuItemId).select(
        "name price isAvailable"
      );

      if (!menuItem) {
        return res.status(400).json({
          success: false,
          message: "One or more menu items no longer exist.",
        });
      }

      if (menuItem.isAvailable !== true) {
        return res.status(400).json({
          success: false,
          message: `${menuItem.name} is currently unavailable.`,
        });
      }

      const price = Number(menuItem.price);

      if (!Number.isFinite(price) || price < 0) {
        return res.status(400).json({
          success: false,
          message: `Invalid database price for ${menuItem.name}.`,
        });
      }

      // Calculate item subtotal using the database price.
      const itemSubtotal = Number((price * quantity).toFixed(2));

      orderItems.push({
        menuItemId: menuItem._id,
        name: menuItem.name,
        price,
        quantity,
        subtotal: itemSubtotal,
      });
    }

    // ======================================================
    // Server-side Subtotal Calculation
    // ======================================================
    const subtotal = Number(
      orderItems
        .reduce((total, item) => total + item.subtotal, 0)
        .toFixed(2)
    );

    // ======================================================
    // Server-side Delivery Charge
    // ======================================================
    const deliveryCharge = orderType === "Delivery" ? 40 : 0;

    // ======================================================
    // Server-side Coupon Validation
    // ======================================================
    let appliedCouponCode = "";
    let discountAmount = 0;

    if (typeof couponCode === "string" && couponCode.trim()) {
      const normalizedCouponCode = couponCode.trim().toUpperCase();

      const coupon = await Coupon.findOne({
        code: normalizedCouponCode,
      });

      if (!coupon) {
        return res.status(400).json({
          success: false,
          message: "Invalid coupon code.",
        });
      }

      // Check active status
      if (!coupon.isActive) {
        return res.status(400).json({
          success: false,
          message: "This coupon is currently inactive.",
        });
      }

      // Check expiry
      const currentDate = new Date();

      if (new Date(coupon.expiryDate) <= currentDate) {
        return res.status(400).json({
          success: false,
          message: "This coupon has expired.",
        });
      }

      // Check minimum order amount
      if (subtotal < Number(coupon.minimumOrderAmount || 0)) {
        return res.status(400).json({
          success: false,
          message: `Minimum order amount for this coupon is ₹${Number(
            coupon.minimumOrderAmount || 0
          ).toFixed(2)}.`,
        });
      }

      // Calculate discount
      if (coupon.discountType === "percentage") {
        discountAmount =
          subtotal * (Number(coupon.discountValue) / 100);
      } else if (coupon.discountType === "fixed") {
        discountAmount = Number(coupon.discountValue);
      } else {
        return res.status(400).json({
          success: false,
          message: "Invalid coupon discount type.",
        });
      }

      // Maximum discount limit
      if (
        coupon.maximumDiscountAmount !== null &&
        coupon.maximumDiscountAmount !== undefined
      ) {
        discountAmount = Math.min(
          discountAmount,
          Number(coupon.maximumDiscountAmount)
        );
      }

      // Discount cannot exceed subtotal
      discountAmount = Math.min(discountAmount, subtotal);

      // Round discount
      discountAmount = Number(discountAmount.toFixed(2));

      appliedCouponCode = coupon.code;
    }

    // ======================================================
    // Server-side Final Total Calculation
    // ======================================================
    const totalAmount = Number(
      Math.max(
        0,
        subtotal + deliveryCharge - discountAmount
      ).toFixed(2)
    );

    // ======================================================
    // Prepare Order Data
    // ======================================================
    const orderData = {
      customer: {
        name: name.trim(),
        mobile: normalizedMobile,
        email: customerEmail,
      },

      orderType,

      address:
        orderType === "Delivery"
          ? address.trim()
          : "",

      note: typeof note === "string" ? note.trim() : "",

      items: orderItems,
      subtotal,
      couponCode: appliedCouponCode,
      discountAmount,
      deliveryCharge,
      totalAmount,
      status: "Pending",
    };

    // Attach verified logged-in Customer ID when available.
    if (authenticatedCustomerId) {
      orderData.customerId = authenticatedCustomerId;
    }

    // ======================================================
    // Create Order
    // ======================================================
    const order = await Order.create(orderData);

    // ======================================================
    // Send Order Confirmation Email
    // Non-blocking: email failure must not fail the order.
    // ======================================================
    if (order.customer && order.customer.email) {
      Promise.resolve()
        .then(() => sendOrderConfirmationEmail(order))
        .catch((error) => {
          console.error(
            "Order confirmation email error:",
            error.message
          );
        });
    }

    return res.status(201).json({
      success: true,
      message: "Order placed successfully!",
      data: order,
    });
  } catch (error) {
    console.error("Create order error:", error);

    return res.status(500).json({
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

    return res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    console.error("Get customer order history error:", error);

    return res.status(500).json({
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
    const orders = await Order.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    console.error("Get orders error:", error);

    return res.status(500).json({
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

    return res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error("Get order error:", error);

    return res.status(500).json({
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

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID.",
      });
    }

    if (typeof mobile !== "string" || !mobile.trim()) {
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

    return res.status(200).json({
      success: true,
      message: "Order found successfully.",
      data: order,
    });
  } catch (error) {
    console.error("Track order error:", error);

    return res.status(500).json({
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
      { status },
      {
        returnDocument: "after",
        runValidators: true,
      }
    );

    if (!updatedOrder) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Order status updated successfully!",
      data: updatedOrder,
    });
  } catch (error) {
    console.error("Update order status error:", error);

    return res.status(500).json({
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

    return res.status(200).json({
      success: true,
      message: "Order deleted successfully!",
      data: deletedOrder,
    });
  } catch (error) {
    console.error("Delete order error:", error);

    return res.status(500).json({
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
    const orders = await Order.find().lean();

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

    // Revenue: cancelled orders are excluded.
    const validOrders = orders.filter(
      (order) => order.status !== "Cancelled"
    );

    const totalRevenue = validOrders.reduce(
      (total, order) => total + Number(order.totalAmount || 0),
      0
    );

    const completedRevenue = orders
      .filter((order) => order.status === "Completed")
      .reduce(
        (total, order) => total + Number(order.totalAmount || 0),
        0
      );

    const averageOrderValue =
      validOrders.length > 0
        ? totalRevenue / validOrders.length
        : 0;

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

    const revenueByDate = Object.values(revenueByDateMap).sort(
      (a, b) => a.date.localeCompare(b.date)
    );

    return res.status(200).json({
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

    return res.status(500).json({
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
