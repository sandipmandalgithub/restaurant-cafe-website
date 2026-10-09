const nodemailer = require("nodemailer");

const createTransporter = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_APP_PASSWORD) {
    throw new Error(
      "Email configuration is missing. Please check EMAIL_USER and EMAIL_APP_PASSWORD."
    );
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_APP_PASSWORD.replace(/\s+/g, ""),
    },
  });
};

const escapeHtml = (value = "") => {
  return String(value).replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };

    return entities[character];
  });
};

const sendEmail = async ({ to, subject, html, text }) => {
  if (!to) {
    console.warn("Email not sent: recipient email address is missing.");
    return false;
  }

  try {
    const transporter = createTransporter();

    await transporter.sendMail({
      from: `"CaféNest" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    });

    console.log(`Email sent successfully to ${to}`);
    return true;
  } catch (error) {
    console.error("Email sending failed:", error.message);
    return false;
  }
};

const sendReservationCreatedEmail = async (reservation) => {
  const customer = reservation.customer || {};
  const customerName = escapeHtml(customer.name || "Customer");
  const reservationDate = reservation.reservationDate
    ? new Date(reservation.reservationDate).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "Asia/Kolkata",
      })
    : "To be confirmed";

  const reservationTime = escapeHtml(
    reservation.reservationTime || "To be confirmed"
  );

  const guests = Number(reservation.guests) || 1;

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;color:#292524;line-height:1.6">
      <h2 style="color:#b45309">CaféNest</h2>
      <h3>Reservation Request Received</h3>
      <p>Dear ${customerName},</p>
      <p>Thank you for choosing CaféNest. We have received your table reservation request.</p>
      <div style="background:#fafaf9;padding:16px;border-radius:8px">
        <p><strong>Date:</strong> ${escapeHtml(reservationDate)}</p>
        <p><strong>Time:</strong> ${reservationTime}</p>
        <p><strong>Guests:</strong> ${guests}</p>
        <p><strong>Status:</strong> Pending</p>
      </div>
      <p>Your reservation is not confirmed yet. We will email you when its status changes.</p>
      <p>Thank you,<br />CaféNest Team</p>
    </div>
  `;

  return sendEmail({
    to: customer.email,
    subject: "CaféNest - Reservation Request Received",
    text: `Dear ${customer.name || "Customer"}, we received your reservation request for ${reservationDate} at ${reservationTime}. Current status: Pending.`,
    html,
  });
};

const sendReservationStatusEmail = async (reservation, newStatus) => {
  const customer = reservation.customer || {};
  const customerName = escapeHtml(customer.name || "Customer");

  const statusMessages = {
    Confirmed: {
      subject: "CaféNest - Your Reservation Is Confirmed",
      heading: "Your Reservation Is Confirmed!",
      message: "Your table reservation has been confirmed. We look forward to welcoming you.",
    },
    Rejected: {
      subject: "CaféNest - Reservation Update",
      heading: "Reservation Update",
      message: "Unfortunately, we are unable to confirm your reservation. Please contact us if you need assistance.",
    },
    Cancelled: {
      subject: "CaféNest - Reservation Cancelled",
      heading: "Reservation Cancelled",
      message: "Your reservation has been cancelled. Please contact us if you have any questions.",
    },
    Completed: {
      subject: "CaféNest - Thank You for Visiting",
      heading: "Thank You for Visiting CaféNest!",
      message: "We hope you enjoyed your visit. We look forward to serving you again.",
    },
  };

  const statusInfo = statusMessages[newStatus];

  if (!statusInfo) {
    return false;
  }

  const reservationDate = reservation.reservationDate
    ? new Date(reservation.reservationDate).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "Asia/Kolkata",
      })
    : "Not available";

  const reservationTime = escapeHtml(
    reservation.reservationTime || "Not available"
  );

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;color:#292524;line-height:1.6">
      <h2 style="color:#b45309">CaféNest</h2>
      <h3>${statusInfo.heading}</h3>
      <p>Dear ${customerName},</p>
      <p>${statusInfo.message}</p>
      <div style="background:#fafaf9;padding:16px;border-radius:8px">
        <p><strong>Date:</strong> ${escapeHtml(reservationDate)}</p>
        <p><strong>Time:</strong> ${reservationTime}</p>
        <p><strong>Guests:</strong> ${Number(reservation.guests) || 1}</p>
        <p><strong>Status:</strong> ${escapeHtml(newStatus)}</p>
      </div>
      <p>Thank you for choosing CaféNest.</p>
      <p>CaféNest Team</p>
    </div>
  `;

  return sendEmail({
    to: customer.email,
    subject: statusInfo.subject,
    text: `Dear ${customer.name || "Customer"}, ${statusInfo.message} Reservation status: ${newStatus}. Date: ${reservationDate}, Time: ${reservationTime}.`,
    html,
  });
};

module.exports = {
  sendEmail,
  sendReservationCreatedEmail,
  sendReservationStatusEmail,
};
