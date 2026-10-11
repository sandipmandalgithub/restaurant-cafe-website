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

// Format order amount
const formatAmount = (amount) => {
  return `₹${(Number(amount) || 0).toFixed(2)}`;
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

// Order Placed Confirmation Email
const sendOrderConfirmationEmail = async (order) => {
  if (!order) {
    console.warn("Order confirmation email skipped: order is missing.");
    return false;
  }

  const customer = order.customer || {};
  const customerName = customer.name || "Customer";
  const safeName = escapeHtml(customerName);
  const orderId = String(order._id || "");
  const shortOrderId = orderId
    ? escapeHtml(orderId.slice(-8).toUpperCase())
    : "Not available";

  const orderType = order.orderType || "Delivery";
  const status = order.status || "Pending";
  const items = Array.isArray(order.items) ? order.items : [];

  const itemsHtml = items
    .map((item) => {
      const itemName = escapeHtml(item.name || "Menu item");
      const quantity = Math.max(0, Number(item.quantity) || 0);
      const subtotal =
        Number(item.subtotal) ||
        (Number(item.price) || 0) * quantity;

      return `
        <tr>
          <td style="padding:10px;border-bottom:1px solid #e7e5e4">
            ${itemName}
          </td>
          <td style="padding:10px;border-bottom:1px solid #e7e5e4;text-align:center">
            ${quantity}
          </td>
          <td style="padding:10px;border-bottom:1px solid #e7e5e4;text-align:right">
            ${formatAmount(subtotal)}
          </td>
        </tr>
      `;
    })
    .join("");

  const addressHtml =
    orderType === "Delivery" && order.address
      ? `<p><strong>Delivery Address:</strong> ${escapeHtml(order.address)}</p>`
      : "";

  const subtotal = Number(order.subtotal) || 0;
  const discountAmount = Number(order.discountAmount) || 0;
  const deliveryCharge = Number(order.deliveryCharge) || 0;
  const totalAmount = Number(order.totalAmount) || 0;

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:20px auto;color:#292524;line-height:1.6;border:1px solid #e7e5e4;border-radius:10px;overflow:hidden">
      <div style="background:#292524;padding:20px">
        <h2 style="color:#fbbf24;margin:0">CaféNest</h2>
        <p style="color:#ffffff;margin:6px 0 0">Fresh food, made with care.</p>
      </div>

      <div style="padding:24px">
        <h2 style="margin-top:0">Order Placed Successfully!</h2>

        <p>Dear ${safeName},</p>

        <p>
          Thank you for ordering from CaféNest.
          We have received your order and will process it shortly.
        </p>

        <div style="background:#fafaf9;padding:16px;border-radius:8px;margin:20px 0">
          <p><strong>Order ID:</strong> #${shortOrderId}</p>
          <p><strong>Order Type:</strong> ${escapeHtml(orderType)}</p>
          <p><strong>Order Status:</strong> ${escapeHtml(status)}</p>
          ${addressHtml}
        </div>

        <h3>Order Summary</h3>

        <table style="width:100%;border-collapse:collapse;font-size:14px">
          <thead>
            <tr style="background:#f5f5f4">
              <th style="padding:10px;text-align:left">Item</th>
              <th style="padding:10px;text-align:center">Qty</th>
              <th style="padding:10px;text-align:right">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <div style="margin-top:20px">
          <p style="text-align:right">
            Subtotal: ${formatAmount(subtotal)}
          </p>
          ${
            discountAmount > 0
              ? `<p style="text-align:right">Discount: -${formatAmount(discountAmount)}</p>`
              : ""
          }
          <p style="text-align:right">
            Delivery Charge: ${formatAmount(deliveryCharge)}
          </p>
          <p style="text-align:right;font-size:18px;font-weight:bold;border-top:1px solid #e7e5e4;padding-top:12px">
            Total: ${formatAmount(totalAmount)}
          </p>
        </div>

        <p>
          We will keep you informed when your order status changes.
        </p>

        <p>
          Thank you for choosing CaféNest!
        </p>

        <p>
          Warm regards,<br />
          <strong>CaféNest Team</strong>
        </p>
      </div>
    </div>
  `;

  const itemsText = items
    .map((item) => {
      const quantity = Math.max(0, Number(item.quantity) || 0);
      const itemSubtotal =
        Number(item.subtotal) ||
        (Number(item.price) || 0) * quantity;

      return `- ${item.name || "Menu item"} x ${quantity}: ${formatAmount(itemSubtotal)}`;
    })
    .join("\n");

  const text = [
    `Dear ${customerName},`,
    "",
    "Thank you for ordering from CaféNest. Your order has been received successfully.",
    "",
    `Order ID: #${shortOrderId}`,
    `Order Type: ${orderType}`,
    `Order Status: ${status}`,
    orderType === "Delivery" && order.address
      ? `Delivery Address: ${order.address}`
      : "",
    "",
    "Order Summary:",
    itemsText,
    "",
    `Subtotal: ${formatAmount(subtotal)}`,
    `Discount: ${formatAmount(discountAmount)}`,
    `Delivery Charge: ${formatAmount(deliveryCharge)}`,
    `Total: ${formatAmount(totalAmount)}`,
    "",
    "We will keep you informed when your order status changes.",
    "Thank you for choosing CaféNest!",
    "CaféNest Team",
  ]
    .filter((line) => line !== "")
    .join("\n");

  return sendEmail({
    to: customer.email,
    subject: `CaféNest - Order Confirmation #${shortOrderId}`,
    text,
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
  sendOrderConfirmationEmail,
  sendReservationCreatedEmail,
  sendReservationStatusEmail,
};
