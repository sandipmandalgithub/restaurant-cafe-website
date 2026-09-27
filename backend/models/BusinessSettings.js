const mongoose = require("mongoose");

const businessSettingsSchema = new mongoose.Schema(
  {
    businessName: {
      type: String,
      required: true,
      trim: true,
      default: "CaféNest",
    },

    phone: {
      type: String,
      trim: true,
      default: "",
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: "",
    },

    address: {
      type: String,
      trim: true,
      default: "",
    },

    openingTime: {
      type: String,
      trim: true,
      default: "10:00 AM",
    },

    closingTime: {
      type: String,
      trim: true,
      default: "10:00 PM",
    },

    deliveryCharge: {
      type: Number,
      min: 0,
      default: 40,
    },

    deliveryAvailable: {
      type: Boolean,
      default: true,
    },

    pickupAvailable: {
      type: Boolean,
      default: true,
    },

    whatsappNumber: {
      type: String,
      trim: true,
      default: "",
    },

    facebookUrl: {
      type: String,
      trim: true,
      default: "",
    },

    instagramUrl: {
      type: String,
      trim: true,
      default: "",
    },

    youtubeUrl: {
      type: String,
      trim: true,
      default: "",
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const BusinessSettings = mongoose.model(
  "BusinessSettings",
  businessSettingsSchema
);

module.exports = BusinessSettings;
