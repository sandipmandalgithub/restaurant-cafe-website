const mongoose = require("mongoose");

const Coupon = require("../models/Coupon");

// Create Coupon
const createCoupon = async (req, res) => {
  try {
    const {
      code,
      description,
      discountType,
      discountValue,
      minimumOrderAmount,
      maximumDiscountAmount,
      expiryDate,
      isActive,
    } = req.body;

    if (!code || !discountType || discountValue === undefined || !expiryDate) {
      return res.status(400).json({
        success: false,
        message:
          "Code, discount type, discount value, and expiry date are required.",
      });
    }

    if (!["percentage", "fixed"].includes(discountType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid discount type.",
      });
    }

    const numericDiscountValue = Number(discountValue);

    if (
      Number.isNaN(numericDiscountValue) ||
      numericDiscountValue <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Discount value must be greater than 0.",
      });
    }

    if (
      discountType === "percentage" &&
      numericDiscountValue > 100
    ) {
      return res.status(400).json({
        success: false,
        message: "Percentage discount cannot be greater than 100%.",
      });
    }

    const parsedExpiryDate = new Date(expiryDate);

    if (Number.isNaN(parsedExpiryDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid expiry date.",
      });
    }

    if (parsedExpiryDate <= new Date()) {
      return res.status(400).json({
        success: false,
        message: "Expiry date must be in the future.",
      });
    }

    const normalizedCode = code.trim().toUpperCase();

    const existingCoupon = await Coupon.findOne({
      code: normalizedCode,
    });

    if (existingCoupon) {
      return res.status(409).json({
        success: false,
        message: "A coupon with this code already exists.",
      });
    }

    const coupon = await Coupon.create({
      code: normalizedCode,
      description: description?.trim() || "",
      discountType,
      discountValue: numericDiscountValue,
      minimumOrderAmount: Math.max(
        0,
        Number(minimumOrderAmount) || 0
      ),
      maximumDiscountAmount:
        maximumDiscountAmount === null ||
        maximumDiscountAmount === undefined ||
        maximumDiscountAmount === ""
          ? null
          : Math.max(0, Number(maximumDiscountAmount)),
      expiryDate: parsedExpiryDate,
      isActive: isActive !== undefined ? Boolean(isActive) : true,
    });

    res.status(201).json({
      success: true,
      message: "Coupon created successfully.",
      data: coupon,
    });
  } catch (error) {
    console.error("Create coupon error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "A coupon with this code already exists.",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to create coupon.",
    });
  }
};

// Get All Coupons
const getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: coupons.length,
      data: coupons,
    });
  } catch (error) {
    console.error("Get coupons error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch coupons.",
    });
  }
};

// Get Single Coupon
const getCouponById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid coupon ID.",
      });
    }

    const coupon = await Coupon.findById(id);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found.",
      });
    }

    res.status(200).json({
      success: true,
      data: coupon,
    });
  } catch (error) {
    console.error("Get coupon error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch coupon.",
    });
  }
};

// Update Coupon
const updateCoupon = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid coupon ID.",
      });
    }

    const coupon = await Coupon.findById(id);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found.",
      });
    }

    const {
      code,
      description,
      discountType,
      discountValue,
      minimumOrderAmount,
      maximumDiscountAmount,
      expiryDate,
      isActive,
    } = req.body;

    if (code !== undefined) {
      const normalizedCode = code.trim().toUpperCase();

      const existingCoupon = await Coupon.findOne({
        code: normalizedCode,
        _id: { $ne: id },
      });

      if (existingCoupon) {
        return res.status(409).json({
          success: false,
          message: "A coupon with this code already exists.",
        });
      }

      coupon.code = normalizedCode;
    }

    if (description !== undefined) {
      coupon.description = description.trim();
    }

    if (discountType !== undefined) {
      if (!["percentage", "fixed"].includes(discountType)) {
        return res.status(400).json({
          success: false,
          message: "Invalid discount type.",
        });
      }

      coupon.discountType = discountType;
    }

    if (discountValue !== undefined) {
      const numericDiscountValue = Number(discountValue);

      if (
        Number.isNaN(numericDiscountValue) ||
        numericDiscountValue <= 0
      ) {
        return res.status(400).json({
          success: false,
          message: "Discount value must be greater than 0.",
        });
      }

      if (
        coupon.discountType === "percentage" &&
        numericDiscountValue > 100
      ) {
        return res.status(400).json({
          success: false,
          message: "Percentage discount cannot be greater than 100%.",
        });
      }

      coupon.discountValue = numericDiscountValue;
    }

    if (minimumOrderAmount !== undefined) {
      const numericMinimumOrder = Number(minimumOrderAmount);

      if (
        Number.isNaN(numericMinimumOrder) ||
        numericMinimumOrder < 0
      ) {
        return res.status(400).json({
          success: false,
          message: "Minimum order amount cannot be negative.",
        });
      }

      coupon.minimumOrderAmount = numericMinimumOrder;
    }

    if (maximumDiscountAmount !== undefined) {
      if (
        maximumDiscountAmount === null ||
        maximumDiscountAmount === ""
      ) {
        coupon.maximumDiscountAmount = null;
      } else {
        const numericMaximumDiscount = Number(
          maximumDiscountAmount
        );

        if (
          Number.isNaN(numericMaximumDiscount) ||
          numericMaximumDiscount < 0
        ) {
          return res.status(400).json({
            success: false,
            message: "Maximum discount amount cannot be negative.",
          });
        }

        coupon.maximumDiscountAmount = numericMaximumDiscount;
      }
    }

    if (expiryDate !== undefined) {
      const parsedExpiryDate = new Date(expiryDate);

      if (Number.isNaN(parsedExpiryDate.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Invalid expiry date.",
        });
      }

      if (parsedExpiryDate <= new Date()) {
        return res.status(400).json({
          success: false,
          message: "Expiry date must be in the future.",
        });
      }

      coupon.expiryDate = parsedExpiryDate;
    }

    if (isActive !== undefined) {
      coupon.isActive = Boolean(isActive);
    }

    await coupon.save();

    res.status(200).json({
      success: true,
      message: "Coupon updated successfully.",
      data: coupon,
    });
  } catch (error) {
    console.error("Update coupon error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "A coupon with this code already exists.",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to update coupon.",
    });
  }
};

// Delete Coupon
const deleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid coupon ID.",
      });
    }

    const coupon = await Coupon.findById(id);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found.",
      });
    }

    await Coupon.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Coupon deleted successfully.",
    });
  } catch (error) {
    console.error("Delete coupon error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete coupon.",
    });
  }
};

// Toggle Coupon Status
const toggleCouponStatus = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid coupon ID.",
      });
    }

    const coupon = await Coupon.findById(id);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found.",
      });
    }

    coupon.isActive = !coupon.isActive;

    await coupon.save();

    res.status(200).json({
      success: true,
      message: `Coupon ${
        coupon.isActive ? "activated" : "deactivated"
      } successfully.`,
      data: coupon,
    });
  } catch (error) {
    console.error("Toggle coupon status error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update coupon status.",
    });
  }
};

// Validate Coupon for Customer
const validateCoupon = async (req, res) => {
  try {
    const { code, orderAmount } = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        message: "Coupon code is required.",
      });
    }

    const numericOrderAmount = Number(orderAmount);

    if (
      Number.isNaN(numericOrderAmount) ||
      numericOrderAmount < 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid order amount.",
      });
    }

    const normalizedCode = code.trim().toUpperCase();

    const coupon = await Coupon.findOne({
      code: normalizedCode,
    });

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Invalid coupon code.",
      });
    }

    if (!coupon.isActive) {
      return res.status(400).json({
        success: false,
        message: "This coupon is currently inactive.",
      });
    }

    if (new Date() > coupon.expiryDate) {
      return res.status(400).json({
        success: false,
        message: "This coupon has expired.",
      });
    }

    if (
      numericOrderAmount < coupon.minimumOrderAmount
    ) {
      return res.status(400).json({
        success: false,
        message: `Minimum order amount of ₹${coupon.minimumOrderAmount} is required for this coupon.`,
      });
    }

    let discountAmount = 0;

    if (coupon.discountType === "percentage") {
      discountAmount =
        (numericOrderAmount * coupon.discountValue) / 100;
    } else {
      discountAmount = coupon.discountValue;
    }

    if (
      coupon.maximumDiscountAmount !== null &&
      coupon.maximumDiscountAmount !== undefined
    ) {
      discountAmount = Math.min(
        discountAmount,
        coupon.maximumDiscountAmount
      );
    }

    discountAmount = Math.min(
      discountAmount,
      numericOrderAmount
    );

    discountAmount = Number(discountAmount.toFixed(2));

    const finalAmount = Number(
      (numericOrderAmount - discountAmount).toFixed(2)
    );

    res.status(200).json({
      success: true,
      message: "Coupon applied successfully.",
      data: {
        couponId: coupon._id,
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        discountAmount,
        orderAmount: numericOrderAmount,
        finalAmount,
      },
    });
  } catch (error) {
    console.error("Validate coupon error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to validate coupon.",
    });
  }
};

module.exports = {
  createCoupon,
  getCoupons,
  getCouponById,
  updateCoupon,
  deleteCoupon,
  toggleCouponStatus,
  validateCoupon,
};
