const BusinessSettings = require("../models/BusinessSettings");

// Get public business settings
const getBusinessSettings = async (req, res) => {
  try {
    let settings = await BusinessSettings.findOne();

    // Create default settings if none exists
    if (!settings) {
      settings = await BusinessSettings.create({
        businessName: "CaféNest",
        phone: "",
        email: "",
        address: "",
        openingTime: "10:00 AM",
        closingTime: "10:00 PM",
        deliveryCharge: 40,
        deliveryAvailable: true,
        pickupAvailable: true,
        whatsappNumber: "",
        facebookUrl: "",
        instagramUrl: "",
        youtubeUrl: "",
        description: "",
      });
    }

    return res.status(200).json({
      success: true,
      data: settings,
    });
  } catch (error) {
    console.error("Get business settings error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load business settings.",
    });
  }
};

// Get business settings for admin
const getAdminBusinessSettings = async (req, res) => {
  try {
    let settings = await BusinessSettings.findOne();

    // Create default settings if none exists
    if (!settings) {
      settings = await BusinessSettings.create({
        businessName: "CaféNest",
        phone: "",
        email: "",
        address: "",
        openingTime: "10:00 AM",
        closingTime: "10:00 PM",
        deliveryCharge: 40,
        deliveryAvailable: true,
        pickupAvailable: true,
        whatsappNumber: "",
        facebookUrl: "",
        instagramUrl: "",
        youtubeUrl: "",
        description: "",
      });
    }

    return res.status(200).json({
      success: true,
      data: settings,
    });
  } catch (error) {
    console.error("Get admin business settings error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load business settings.",
    });
  }
};

// Create or update business settings
const updateBusinessSettings = async (req, res) => {
  try {
    const {
      businessName,
      phone,
      email,
      address,
      openingTime,
      closingTime,
      deliveryCharge,
      deliveryAvailable,
      pickupAvailable,
      whatsappNumber,
      facebookUrl,
      instagramUrl,
      youtubeUrl,
      description,
    } = req.body;

    if (!businessName || !businessName.trim()) {
      return res.status(400).json({
        success: false,
        message: "Business name is required.",
      });
    }

    if (
      deliveryCharge !== undefined &&
      (Number.isNaN(Number(deliveryCharge)) || Number(deliveryCharge) < 0)
    ) {
      return res.status(400).json({
        success: false,
        message: "Delivery charge must be a valid non-negative number.",
      });
    }

    let settings = await BusinessSettings.findOne();

    const settingsData = {
      businessName: businessName.trim(),
      phone: phone ? phone.trim() : "",
      email: email ? email.trim().toLowerCase() : "",
      address: address ? address.trim() : "",
      openingTime: openingTime ? openingTime.trim() : "",
      closingTime: closingTime ? closingTime.trim() : "",
      deliveryCharge:
        deliveryCharge !== undefined && deliveryCharge !== ""
          ? Number(deliveryCharge)
          : 0,
      deliveryAvailable:
        deliveryAvailable !== undefined
          ? Boolean(deliveryAvailable)
          : true,
      pickupAvailable:
        pickupAvailable !== undefined ? Boolean(pickupAvailable) : true,
      whatsappNumber: whatsappNumber ? whatsappNumber.trim() : "",
      facebookUrl: facebookUrl ? facebookUrl.trim() : "",
      instagramUrl: instagramUrl ? instagramUrl.trim() : "",
      youtubeUrl: youtubeUrl ? youtubeUrl.trim() : "",
      description: description ? description.trim() : "",
    };

    if (!settings) {
      settings = await BusinessSettings.create(settingsData);
    } else {
      settings = await BusinessSettings.findByIdAndUpdate(
        settings._id,
        settingsData,
        {
          new: true,
          runValidators: true,
        }
      );
    }

    return res.status(200).json({
      success: true,
      message: "Business settings updated successfully.",
      data: settings,
    });
  } catch (error) {
    console.error("Update business settings error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update business settings.",
    });
  }
};

module.exports = {
  getBusinessSettings,
  getAdminBusinessSettings,
  updateBusinessSettings,
};
