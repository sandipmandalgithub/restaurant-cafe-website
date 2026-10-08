const mongoose = require("mongoose");

const Reservation = require("../models/Reservation");

const createReservation = async (req, res) => {
  try {
    const {
      name,
      mobile,
      email,
      reservationDate,
      reservationTime,
      guests,
      specialRequest,
    } = req.body;

    // Validate customer name
    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Customer name is required.",
      });
    }

    // Validate mobile
    if (!mobile || !mobile.trim()) {
      return res.status(400).json({
        success: false,
        message: "Mobile number is required.",
      });
    }

    // Validate reservation date
    if (!reservationDate) {
      return res.status(400).json({
        success: false,
        message: "Reservation date is required.",
      });
    }

    const parsedDate = new Date(reservationDate);

    if (Number.isNaN(parsedDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid reservation date.",
      });
    }

    // Validate reservation date is not in the past
    const today = new Date();

    today.setHours(0, 0, 0, 0);
    parsedDate.setHours(0, 0, 0, 0);

    if (parsedDate < today) {
      return res.status(400).json({
        success: false,
        message: "Reservation date cannot be in the past.",
      });
    }

    // Validate reservation time
    if (!reservationTime || !reservationTime.trim()) {
      return res.status(400).json({
        success: false,
        message: "Reservation time is required.",
      });
    }

    // Validate guests
    const guestCount = Number(guests);

    if (!Number.isInteger(guestCount) || guestCount < 1) {
      return res.status(400).json({
        success: false,
        message: "Number of guests must be at least 1.",
      });
    }

    if (guestCount > 20) {
      return res.status(400).json({
        success: false,
        message: "Maximum 20 guests are allowed per reservation.",
      });
    }

    // Create reservation data
    const reservationData = {
      customer: {
        name: name.trim(),
        mobile: mobile.trim(),
        email: email ? email.trim().toLowerCase() : "",
      },

      reservationDate: parsedDate,

      reservationTime: reservationTime.trim(),

      guests: guestCount,

      specialRequest: specialRequest
        ? specialRequest.trim()
        : "",
    };

    // Attach logged-in customer if customer authentication exists
    if (req.customer?.id) {
      reservationData.customerId = req.customer.id;
    }

    const reservation = await Reservation.create(
      reservationData
    );

    return res.status(201).json({
      success: true,
      message:
        "Table reservation request submitted successfully.",
      data: reservation,
    });
  } catch (error) {
    console.error("Create reservation error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to create reservation.",
    });
  }
};

const getCustomerReservations = async (req, res) => {
  try {
    const customerId = req.customer?.id;

    if (!customerId) {
      return res.status(401).json({
        success: false,
        message: "Customer authentication required.",
      });
    }

    const reservations = await Reservation.find({
      customerId,
    }).sort({
      reservationDate: -1,
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: reservations.length,
      data: reservations,
    });
  } catch (error) {
    console.error(
      "Get customer reservations error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to fetch your reservations.",
    });
  }
};

const getReservations = async (req, res) => {
  try {
    const {
      status,
      date,
      search,
    } = req.query;

    const filter = {};

    // Filter by status
    if (status) {
      filter.status = status;
    }

    // Filter by reservation date
    if (date) {
      const startDate = new Date(date);

      if (Number.isNaN(startDate.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Invalid reservation date filter.",
        });
      }

      startDate.setHours(0, 0, 0, 0);

      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 1);

      filter.reservationDate = {
        $gte: startDate,
        $lt: endDate,
      };
    }

    // Search by customer name, mobile or email
    if (search && search.trim()) {
      const searchValue = search.trim();

      filter.$or = [
        {
          "customer.name": {
            $regex: searchValue,
            $options: "i",
          },
        },
        {
          "customer.mobile": {
            $regex: searchValue,
            $options: "i",
          },
        },
        {
          "customer.email": {
            $regex: searchValue,
            $options: "i",
          },
        },
      ];
    }

    const reservations = await Reservation.find(filter)
      .populate("customerId", "name email phone")
      .sort({
        reservationDate: 1,
        reservationTime: 1,
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      count: reservations.length,
      data: reservations,
    });
  } catch (error) {
    console.error("Get reservations error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch reservations.",
    });
  }
};

const getReservationById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid reservation ID.",
      });
    }

    const reservation = await Reservation.findById(id).populate(
      "customerId",
      "name email phone"
    );

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: "Reservation not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: reservation,
    });
  } catch (error) {
    console.error(
      "Get reservation by ID error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to fetch reservation.",
    });
  }
};

const updateReservationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminNote } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid reservation ID.",
      });
    }

    const allowedStatuses = [
      "Pending",
      "Confirmed",
      "Rejected",
      "Completed",
      "Cancelled",
    ];

    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid reservation status.",
      });
    }

    const reservation = await Reservation.findById(id);

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: "Reservation not found.",
      });
    }

    reservation.status = status;

    if (adminNote !== undefined) {
      reservation.adminNote = adminNote
        ? adminNote.trim()
        : "";
    }

    await reservation.save();

    return res.status(200).json({
      success: true,
      message: "Reservation status updated successfully.",
      data: reservation,
    });
  } catch (error) {
    console.error(
      "Update reservation status error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to update reservation status.",
    });
  }
};

const deleteReservation = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid reservation ID.",
      });
    }

    const reservation = await Reservation.findByIdAndDelete(
      id
    );

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: "Reservation not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Reservation deleted successfully.",
    });
  } catch (error) {
    console.error(
      "Delete reservation error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to delete reservation.",
    });
  }
};

module.exports = {
  createReservation,
  getCustomerReservations,
  getReservations,
  getReservationById,
  updateReservationStatus,
  deleteReservation,
};
