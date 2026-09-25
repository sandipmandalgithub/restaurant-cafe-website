const mongoose = require("mongoose");

const Enquiry = require("../models/Enquiry");

// Create Enquiry
const createEnquiry = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !phone || !message) {
      return res.status(400).json({
        success: false,
        message: "Name, email, phone, and message are required.",
      });
    }

    const enquiry = await Enquiry.create({
      name,
      email,
      phone,
      message,
    });

    res.status(201).json({
      success: true,
      message: "Enquiry submitted successfully!",
      data: enquiry,
    });
  } catch (error) {
    console.error("Create enquiry error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to submit enquiry.",
    });
  }
};

// Get All Enquiries
const getEnquiries = async (req, res) => {
  try {
    const enquiries = await Enquiry.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: enquiries.length,
      data: enquiries,
    });
  } catch (error) {
    console.error("Get enquiries error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch enquiries.",
    });
  }
};

// Update Enquiry Status
const updateEnquiryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid enquiry ID.",
      });
    }

    const allowedStatuses = ["New", "Contacted", "Resolved"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid enquiry status.",
      });
    }

    const updatedEnquiry = await Enquiry.findByIdAndUpdate(
      id,
      { status },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedEnquiry) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Enquiry status updated successfully!",
      data: updatedEnquiry,
    });
  } catch (error) {
    console.error("Update enquiry error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update enquiry status.",
    });
  }
};

// Delete Enquiry
const deleteEnquiry = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid enquiry ID.",
      });
    }

    const deletedEnquiry = await Enquiry.findByIdAndDelete(id);

    if (!deletedEnquiry) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Enquiry deleted successfully!",
      data: deletedEnquiry,
    });
  } catch (error) {
    console.error("Delete enquiry error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete enquiry.",
    });
  }
};

module.exports = {
  createEnquiry,
  getEnquiries,
  updateEnquiryStatus,
  deleteEnquiry,
};