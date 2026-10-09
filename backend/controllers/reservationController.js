const mongoose = require("mongoose");

const Reservation = require("../models/Reservation");

const {
  sendReservationCreatedEmail,
  sendReservationStatusEmail,
} = require("../config/emailService");

// Send an email without interrupting the reservation operation.
const sendEmailSafely = async (emailTask, reservation, status = null) => {
  try {
    if (status) {
      await emailTask(reservation, status);
    } else {
      await emailTask(reservation);
    }
  } catch (error) {
    console.error("Reservation email notification error:", error.message);
  }
};

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

    // Validate customer name.
    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Customer name is required.",
      });
    }

    // Validate mobile.
    if (!mobile || !mobile.trim()) {
      return res.status(400).json({
        success: false,
        message: "Mobile number is required.",
      });
    }

    // Validate email when provided.
    const normalizedEmail = email
      ? email.trim().toLowerCase()
      : "";

    if (
      normalizedEmail &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address.",
      });
    }

    // Validate reservation date.
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

    // Validate reservation date is not in the past.
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    parsedDate.setHours(0, 0, 0, 0);

    if (parsedDate < today) {
      return res.status(400).json({
        success: false,
        message: "Reservation date cannot be in the past.",
      });
    }

    // Validate reservation time.
    if (!reservationTime || !reservationTime.trim()) {
      return res.status(400).json({
        success: false,
        message: "Reservation time is required.",
      });
    }

    // Validate guest count.
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

    // Validate special request length.
    const normalizedSpecialRequest = specialRequest
      ? specialRequest.trim()
      : "";

    if (normalizedSpecialRequest.length > 500) {
      return res.status(400).json({
        success: false,
        message: "Special request cannot exceed 500 characters.",
      });
    }

    const reservationData = {
      customer: {
        name: name.trim(),
        mobile: mobile.trim(),
        email: normalizedEmail,
      },
      reservationDate: parsedDate,
      reservationTime: reservationTime.trim(),
      guests: guestCount,
      specialRequest: normalizedSpecialRequest,
    };

    // Attach the authenticated customer when available.
    if (req.customer?.id) {
      reservationData.customerId = req.customer.id;
    }

    const reservation = await Reservation.create(reservationData);

    // Email notification is best-effort and does not block the response.
    if (reservation.customer.email) {
      void sendEmailSafely(
        sendReservationCreatedEmail,
        reservation
      );
    }

    return res.status(201).json({
      success: true,
      message: "Table reservation request submitted successfully.",
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
    console.error("Get customer reservations error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch your reservations.",
    });
  }
};

const getReservations = async (req, res) => {
  try {
    const { status, date, search } = req.query;
    const filter = {};

    const allowedStatuses = [
      "Pending",
      "Confirmed",
      "Rejected",
      "Completed",
      "Cancelled",
    ];

    if (status) {
      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid reservation status filter.",
        });
      }

      filter.status = status;
    }

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

    if (search && search.trim()) {
      const searchValue = search.trim();

      // Escape regex special characters in the search value.
      const escapedSearch = searchValue.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
      );

      filter.$or = [
        {
          "customer.name": {
            $regex: escapedSearch,
            $options: "i",
          },
        },
        {
          "customer.mobile": {
            $regex: escapedSearch,
            $options: "i",
          },
        },
        {
          "customer.email": {
            $regex: escapedSearch,
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
    console.error("Get reservation by ID error:", error);

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

    const previousStatus = reservation.status;

    reservation.status = status;

    if (adminNote !== undefined) {
      const normalizedAdminNote = adminNote
        ? adminNote.trim()
        : "";

      if (normalizedAdminNote.length > 500) {
        return res.status(400).json({
          success: false,
          message: "Admin note cannot exceed 500 characters.",
        });
      }

      reservation.adminNote = normalizedAdminNote;
    }

    await reservation.save();

    // Send status email only when the status actually changes.
    if (
      previousStatus !== status &&
      ["Confirmed", "Rejected", "Cancelled", "Completed"].includes(status) &&
      reservation.customer?.email
    ) {
      void sendEmailSafely(
        sendReservationStatusEmail,
        reservation,
        status
      );
    }

    return res.status(200).json({
      success: true,
      message: "Reservation status updated successfully.",
      data: reservation,
    });
  } catch (error) {
    console.error("Update reservation status error:", error);

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

    const reservation = await Reservation.findByIdAndDelete(id);

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
    console.error("Delete reservation error:", error);

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
