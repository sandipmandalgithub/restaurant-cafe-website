
const { Resend } = require("resend");

// Escape HTML to prevent unsafe user input in emails
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

// Common email sender using Resend API
const sendEmail = async ({ to, subject, html, text }) => {
  if (!to) {
    console.warn("Email not sent: recipient email address is missing.");
    return false;
  }

  if (!process.env.RESEND_API_KEY) {
    console.error("Email sending failed: RESEND_API_KEY is missing.");
    return false;
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);

    const { data, error } = await resend.emails.send({
      from: "CaféNest <onboarding@resend.dev>",
      to: [to],
      subject,
      html,
      text,
    });

    if (error) {
      console.error("Email sending failed:", error.message);
      return false;
    }

    console.log("Email sent successfully. Resend ID:", data?.id);
    return true;
  } catch (error) {
    console.error("Email sending failed:", error.message);
    return false;
  }
};

// Format reservation date using Indian locale
const formatReservationDate = (date) => {
  if (!date) return "To be confirmed";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  });
};

// Customer Registration Welcome Email
const sendCustomerWelcomeEmail = async (customer) => {
  const customerName = customer?.name || "Customer";
  const safeName = escapeHtml(customerName);

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;color:#292524;line-height:1.6">
      <div style="background:#292524;padding:20px;border-radius:10px 10px 0 0">
        <h2 style="color:#fbbf24;margin:0">CaféNest</h2>
      </div>

      <div style="padding:24px;border:1px solid #e7e5e4;border-radius:0 0 10px 10px">
        <h3>Welcome to CaféNest!</h3>

        <p>Dear ${safeName},</p>

        <p>
          Your CaféNest customer account has been created successfully.
          We are delighted to have you with us!
        </p>

        <p>You can now log in to your account to:</p>

        <ul>
          <li>Explore our menu</li>
          <li>Place food orders</li>
          <li>View your order history</li>
          <li>Manage your customer profile</li>
        </ul>

        <p>Thank you for choosing CaféNest.</p>

        <p>
          Warm regards,<br />
          <strong>CaféNest Team</strong>
        </p>
      </div>
    </div>
  `;

  return sendEmail({
    to: customer?.email,
    subject: "Welcome to CaféNest!",
    text: `Dear ${customerName}, your CaféNest customer account has been created successfully. Welcome to CaféNest! You can now log in to explore our menu, place orders, and manage your account.`,
    html,
  });
};

// Reservation Creation Email
const sendReservationCreatedEmail = async (reservation) => {
  const customer = reservation.customer || {};
  const customerName = customer.name || "Customer";
  const safeName = escapeHtml(customerName);
  const date = formatReservationDate(reservation.reservationDate);
  const time = reservation.reservationTime || "To be confirmed";
  const guests = Number(reservation.guests) || 1;

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;color:#292524;line-height:1.6">
      <h2 style="color:#b45309">CaféNest</h2>
      <h3>Reservation Request Received</h3>

      <p>Dear ${safeName},</p>

      <p>
        Thank you for choosing CaféNest.
        We have received your table reservation request.
      </p>

      <div style="background:#fafaf9;padding:16px;border-radius:8px">
        <p><strong>Date:</strong> ${escapeHtml(date)}</p>
        <p><strong>Time:</strong> ${escapeHtml(time)}</p>
        <p><strong>Guests:</strong> ${guests}</p>
        <p><strong>Status:</strong> Pending</p>
      </div>

      <p>
        Your reservation is not confirmed yet.
        We will email you when its status changes.
      </p>

      <p>Thank you,<br />CaféNest Team</p>
    </div>
  `;

  return sendEmail({
    to: customer.email,
    subject: "CaféNest - Reservation Request Received",
    text: `Dear ${customerName}, we received your reservation request for ${date} at ${time}. Current status: Pending.`,
    html,
  });
};

// Reservation Status Update Email
const sendReservationStatusEmail = async (reservation, newStatus) => {
  const customer = reservation.customer || {};
  const customerName = customer.name || "Customer";
  const safeName = escapeHtml(customerName);

  const statusMessages = {
    Confirmed: {
      subject: "CaféNest - Your Reservation Is Confirmed",
      heading: "Your Reservation Is Confirmed!",
      message:
        "Your table reservation has been confirmed. We look forward to welcoming you.",
    },
    Rejected: {
      subject: "CaféNest - Reservation Update",
      heading: "Reservation Update",
      message:
        "Unfortunately, we are unable to confirm your reservation. Please contact us if you need assistance.",
    },
    Cancelled: {
      subject: "CaféNest - Reservation Cancelled",
      heading: "Reservation Cancelled",
      message:
        "Your reservation has been cancelled. Please contact us if you have any questions.",
    },
    Completed: {
      subject: "CaféNest - Thank You for Visiting",
      heading: "Thank You for Visiting CaféNest!",
      message:
        "We hope you enjoyed your visit. We look forward to serving you again.",
    },
  };

  const statusInfo = statusMessages[newStatus];

  if (!statusInfo) return false;

  const date = formatReservationDate(reservation.reservationDate);
  const time = reservation.reservationTime || "Not available";
  const guests = Number(reservation.guests) || 1;

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;color:#292524;line-height:1.6">
      <h2 style="color:#b45309">CaféNest</h2>
      <h3>${escapeHtml(statusInfo.heading)}</h3>

      <p>Dear ${safeName},</p>
      <p>${escapeHtml(statusInfo.message)}</p>

      <div style="background:#fafaf9;padding:16px;border-radius:8px">
        <p><strong>Date:</strong> ${escapeHtml(date)}</p>
        <p><strong>Time:</strong> ${escapeHtml(time)}</p>
        <p><strong>Guests:</strong> ${guests}</p>
        <p><strong>Status:</strong> ${escapeHtml(newStatus)}</p>
      </div>

      <p>Thank you for choosing CaféNest.</p>
      <p>CaféNest Team</p>
    </div>
  `;

  return sendEmail({
    to: customer.email,
    subject: statusInfo.subject,
    text: `Dear ${customerName}, ${statusInfo.message} Reservation status: ${newStatus}. Date: ${date}, Time: ${time}.`,
    html,
  });
};

module.exports = {
  sendEmail,
  sendCustomerWelcomeEmail,
  sendReservationCreatedEmail,
  sendReservationStatusEmail,
};
