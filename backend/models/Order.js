const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    menuItemId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    _id: false,
  }
);

const orderSchema = new mongoose.Schema(
  {
    // Logged-in customer reference.
    // Optional for guest orders and existing orders.
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      default: null,
      index: true,
    },

    customer: {
      name: {
        type: String,
        required: true,
        trim: true,
      },

      mobile: {
        type: String,
        required: true,
        trim: true,
      },

      // Optional to keep older orders compatible.
      email: {
        type: String,
        trim: true,
        lowercase: true,
        default: "",
      },
    },

    orderType: {
      type: String,
      enum: ["Delivery", "Pickup"],
      required: true,
    },

    address: {
      type: String,
      trim: true,
      default: "",
    },

    note: {
      type: String,
      trim: true,
      default: "",
    },

    items: {
      type: [orderItemSchema],
      required: true,
      validate: {
        validator: function (items) {
          return items.length > 0;
        },
        message: "Order must contain at least one item.",
      },
    },

    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },

    couponCode: {
      type: String,
      trim: true,
      uppercase: true,
      default: "",
    },

    discountAmount: {
      type: Number,
      min: 0,
      default: 0,
    },

    deliveryCharge: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    status: {
      type: String,
      enum: [
        "Pending",
        "Confirmed",
        "Preparing",
        "Ready",
        "Completed",
        "Cancelled",
      ],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
