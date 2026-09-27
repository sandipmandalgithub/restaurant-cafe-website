import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const CART_STORAGE_KEY = "cafeNestCart";
const CART_UPDATED_EVENT = "cafeNestCartUpdated";

const API_URL = "http://localhost:5000/api/orders";

// Replace with your CaféNest WhatsApp number.
// Example: 9876543210 -> 919876543210
const WHATSAPP_NUMBER = "919XXXXXXXXX";

function Checkout() {
  const navigate = useNavigate();

  const [cart] = useState(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);

      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error("Failed to load cart:", error);
      return [];
    }
  });

  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    orderType: "Delivery",
    address: "",
    note: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [orderSuccess, setOrderSuccess] = useState(null);
  const [trackingMobile, setTrackingMobile] = useState("");

  const cartItemCount = useMemo(() => {
    return cart.reduce(
      (total, item) => total + Number(item.quantity || 0),
      0
    );
  }, [cart]);

  const subtotal = useMemo(() => {
    return cart.reduce(
      (total, item) =>
        total +
        Number(item.price || 0) * Number(item.quantity || 0),
      0
    );
  }, [cart]);

  const deliveryCharge =
    formData.orderType === "Delivery" ? 40 : 0;

  const total = subtotal + deliveryCharge;

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN").format(price);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));

    setSubmitError("");
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Please enter your name.";
    }

    if (!formData.mobile.trim()) {
      newErrors.mobile = "Please enter your mobile number.";
    } else if (!/^[6-9]\d{9}$/.test(formData.mobile.trim())) {
      newErrors.mobile =
        "Please enter a valid 10-digit mobile number.";
    }

    if (
      formData.orderType === "Delivery" &&
      !formData.address.trim()
    ) {
      newErrors.address =
        "Please enter your delivery address.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const clearCart = () => {
    try {
      localStorage.removeItem(CART_STORAGE_KEY);

      window.dispatchEvent(
        new CustomEvent(CART_UPDATED_EVENT, {
          detail: {
            count: 0,
          },
        })
      );
    } catch (error) {
      console.error("Failed to clear cart:", error);
    }
  };

  const handleTrackOrder = () => {
    if (!orderSuccess?._id || !trackingMobile) {
      return;
    }

    navigate("/order-tracking", {
      state: {
        orderId: orderSuccess._id,
        mobile: trackingMobile,
      },
    });
  };

  // ======================================================
  // Send Order Details on WhatsApp
  // ======================================================
  const handleWhatsAppOrder = () => {
    if (!orderSuccess) {
      return;
    }

    const orderItems = Array.isArray(orderSuccess.items)
      ? orderSuccess.items
      : [];

    const itemsText = orderItems
      .map((item) => {
        const itemTotal =
          Number(item.price || 0) * Number(item.quantity || 0);

        return `• ${item.name} x ${item.quantity} - ₹${formatPrice(
          itemTotal
        )}`;
      })
      .join("\n");

    const addressText =
      orderSuccess.orderType === "Delivery" &&
      orderSuccess.address
        ? `\nDelivery Address: ${orderSuccess.address}`
        : "";

    const noteText = orderSuccess.note
      ? `\nOrder Note: ${orderSuccess.note}`
      : "";

    const message = `Hello CaféNest,

I have placed an order.

Order ID: ${orderSuccess._id}

Customer Name: ${orderSuccess.customer?.name || ""}
Mobile: ${orderSuccess.customer?.mobile || ""}
Order Type: ${orderSuccess.orderType || ""}${addressText}${noteText}

Order Items:
${itemsText}

Subtotal: ₹${formatPrice(
      Number(orderSuccess.subtotal || 0)
    )}
Delivery Charge: ${
      Number(orderSuccess.deliveryCharge || 0) === 0
        ? "Free"
        : `₹${formatPrice(
            Number(orderSuccess.deliveryCharge || 0)
          )}`
    }
Total Amount: ₹${formatPrice(
      Number(orderSuccess.totalAmount || 0)
    )}

Thank you!`;

    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      message
    )}`;

    window.open(
      whatsappUrl,
      "_blank",
      "noopener,noreferrer"
    );
  };

  // ======================================================
  // Submit Order
  // ======================================================
  const handleSubmit = async (event) => {
    event.preventDefault();

    setSubmitError("");

    if (!validateForm()) {
      return;
    }

    if (cart.length === 0) {
      setSubmitError(
        "Your cart is empty. Please add items before placing an order."
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const customerMobile = formData.mobile.trim();

      const orderData = {
        name: formData.name.trim(),
        mobile: customerMobile,
        orderType: formData.orderType,
        address:
          formData.orderType === "Delivery"
            ? formData.address.trim()
            : "",
        note: formData.note.trim(),
        items: cart.map((item) => ({
          menuItemId: item._id,
          name: item.name,
          price: Number(item.price),
          quantity: Number(item.quantity),
        })),
      };

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to place your order."
        );
      }

      clearCart();

      setOrderSuccess(result.data);

      setTrackingMobile(customerMobile);

      setFormData({
        name: "",
        mobile: "",
        orderType: "Delivery",
        address: "",
        note: "",
      });

      setErrors({});
    } catch (error) {
      console.error("Place order error:", error);

      setSubmitError(
        error.message ||
          "Something went wrong while placing your order. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0 && !orderSuccess) {
    return (
      <section className="min-h-[70vh] bg-gray-50 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl rounded-2xl bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-amber-100 text-4xl">
            🛒
          </div>

          <h1 className="mt-6 text-3xl font-bold text-gray-900">
            Your Cart is Empty
          </h1>

          <p className="mt-3 text-gray-600">
            Please add some delicious items before proceeding
            to checkout.
          </p>

          <Link
            to="/menu"
            className="mt-7 inline-flex rounded-lg bg-amber-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-amber-700"
          >
            Browse Menu
          </Link>
        </div>
      </section>
    );
  }

  if (orderSuccess) {
    return (
      <section className="min-h-[70vh] bg-gray-50 px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-2xl rounded-2xl bg-white p-6 text-center shadow-sm sm:p-10">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-4xl">
            ✓
          </div>

          <p className="mt-6 text-sm font-semibold uppercase tracking-wider text-green-600">
            Order Confirmed
          </p>

          <h1 className="mt-2 text-3xl font-bold text-gray-900 sm:text-4xl">
            Thank You for Your Order!
          </h1>

          <p className="mx-auto mt-4 max-w-lg leading-7 text-gray-600">
            Your order has been placed successfully. Our team
            will process your order shortly.
          </p>

          <div className="mt-8 rounded-xl border border-gray-200 bg-gray-50 p-5 text-left">
            <div className="flex items-center justify-between gap-4 border-b border-gray-200 pb-4">
              <span className="text-sm text-gray-600">
                Order ID
              </span>

              <span className="max-w-[220px] truncate text-sm font-semibold text-gray-900">
                {orderSuccess._id}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4 py-4">
              <span className="text-sm text-gray-600">
                Order Type
              </span>

              <span className="text-sm font-semibold text-gray-900">
                {orderSuccess.orderType}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4 border-t border-gray-200 py-4">
              <span className="text-sm text-gray-600">
                Status
              </span>

              <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-bold text-yellow-800">
                {orderSuccess.status}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4 border-t border-gray-200 pt-4">
              <span className="text-sm text-gray-600">
                Total Amount
              </span>

              <span className="text-lg font-bold text-amber-600">
                ₹{formatPrice(orderSuccess.totalAmount)}
              </span>
            </div>
          </div>

          {/* WhatsApp Order Section */}
          <div className="mt-8 rounded-xl border border-green-200 bg-green-50 p-5">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-8 w-8"
                aria-hidden="true"
              >
                <path d="M20.52 3.48A11.82 11.82 0 0 0 12.06 0C5.52 0 .2 5.31.2 11.86c0 2.09.55 4.13 1.59 5.93L.1 24l6.36-1.67a11.85 11.85 0 0 0 5.6 1.43h.01c6.54 0 11.86-5.32 11.86-11.86 0-3.17-1.23-6.14-3.41-8.42ZM12.07 21.72h-.01a9.84 9.84 0 0 1-5.02-1.38l-.36-.21-3.77.99 1.01-3.67-.23-.38a9.85 9.85 0 0 1-1.51-5.21c0-5.43 4.42-9.85 9.86-9.85 2.63 0 5.1 1.03 6.96 2.89a9.79 9.79 0 0 1 2.89 6.97c0 5.43-4.42 9.85-9.82 9.85Zm5.4-7.38c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.47-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.05 1.02-1.05 2.49s1.07 2.89 1.22 3.09c.15.2 2.1 3.2 5.09 4.49.71.31 1.27.49 1.7.63.71.23 1.35.2 1.86.12.57-.08 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35Z" />
              </svg>
            </div>

            <h2 className="mt-4 text-lg font-bold text-gray-900">
              Send Order on WhatsApp
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-600">
              Send your order details directly to CaféNest on
              WhatsApp for easy communication.
            </p>

            <button
              type="button"
              onClick={handleWhatsAppOrder}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-green-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 sm:w-auto"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-5 w-5"
                aria-hidden="true"
              >
                <path d="M20.52 3.48A11.82 11.82 0 0 0 12.06 0C5.52 0 .2 5.31.2 11.86c0 2.09.55 4.13 1.59 5.93L.1 24l6.36-1.67a11.85 11.85 0 0 0 5.6 1.43h.01c6.54 0 11.86-5.32 11.86-11.86 0-3.17-1.23-6.14-3.41-8.42ZM12.07 21.72h-.01a9.84 9.84 0 0 1-5.02-1.38l-.36-.21-3.77.99 1.01-3.67-.23-.38a9.85 9.85 0 0 1-1.51-5.21c0-5.43 4.42-9.85 9.86-9.85 2.63 0 5.1 1.03 6.96 2.89a9.79 9.79 0 0 1 2.89 6.97c0 5.43-4.42 9.85-9.82 9.85Zm5.4-7.38c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.47-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.05 1.02-1.05 2.49s1.07 2.89 1.22 3.09c.15.2 2.1 3.2 5.09 4.49.71.31 1.27.49 1.7.63.71.23 1.35.2 1.86.12.57-.08 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35Z" />
              </svg>

              Send Order on WhatsApp
            </button>
          </div>

          {/* Track Order Section */}
          <div className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-5">
            <div className="text-3xl">📦</div>

            <h2 className="mt-3 text-lg font-bold text-gray-900">
              Track Your Order
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-600">
              You can track the current status of your order
              using your Order ID and mobile number.
            </p>

            <button
              type="button"
              onClick={handleTrackOrder}
              className="mt-5 w-full rounded-lg bg-amber-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 sm:w-auto"
            >
              Track My Order
            </button>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              to="/menu"
              className="rounded-lg bg-gray-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
            >
              Order More
            </Link>

            <Link
              to="/"
              className="rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-800 transition hover:bg-gray-50"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gray-50 px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10">
          <Link
            to="/cart"
            className="inline-flex items-center text-sm font-medium text-amber-600 transition hover:text-amber-700"
          >
            ← Back to Cart
          </Link>

          <h1 className="mt-4 text-3xl font-bold text-gray-900 sm:text-4xl">
            Checkout
          </h1>

          <p className="mt-2 text-gray-600">
            Enter your details and review your order before
            placing it.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <form
              onSubmit={handleSubmit}
              className="rounded-2xl bg-white p-5 shadow-sm sm:p-7"
            >
              <h2 className="text-xl font-bold text-gray-900">
                Customer Details
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Please provide your contact and order details.
              </p>

              {submitError && (
                <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                  <p className="text-sm font-medium text-red-700">
                    {submitError}
                  </p>
                </div>
              )}

              <div className="mt-7">
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Full Name{" "}
                  <span className="text-red-500">*</span>
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  disabled={isSubmitting}
                  className={`w-full rounded-lg border px-4 py-3 text-sm outline-none transition focus:ring-2 ${
                    errors.name
                      ? "border-red-400 focus:ring-red-100"
                      : "border-gray-300 focus:border-amber-500 focus:ring-amber-100"
                  } disabled:cursor-not-allowed disabled:bg-gray-100`}
                />

                {errors.name && (
                  <p className="mt-1.5 text-xs text-red-500">
                    {errors.name}
                  </p>
                )}
              </div>

              <div className="mt-5">
                <label
                  htmlFor="mobile"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Mobile Number{" "}
                  <span className="text-red-500">*</span>
                </label>

                <input
                  id="mobile"
                  name="mobile"
                  type="tel"
                  inputMode="numeric"
                  maxLength="10"
                  value={formData.mobile}
                  onChange={handleChange}
                  placeholder="Enter 10-digit mobile number"
                  disabled={isSubmitting}
                  className={`w-full rounded-lg border px-4 py-3 text-sm outline-none transition focus:ring-2 ${
                    errors.mobile
                      ? "border-red-400 focus:ring-red-100"
                      : "border-gray-300 focus:border-amber-500 focus:ring-amber-100"
                  } disabled:cursor-not-allowed disabled:bg-gray-100`}
                />

                {errors.mobile && (
                  <p className="mt-1.5 text-xs text-red-500">
                    {errors.mobile}
                  </p>
                )}
              </div>

              <div className="mt-5">
                <label className="mb-3 block text-sm font-semibold text-gray-700">
                  Order Type
                </label>

                <div className="grid gap-3 sm:grid-cols-2">
                  <label
                    className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition ${
                      formData.orderType === "Delivery"
                        ? "border-amber-500 bg-amber-50"
                        : "border-gray-300 hover:border-amber-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="orderType"
                      value="Delivery"
                      checked={
                        formData.orderType === "Delivery"
                      }
                      onChange={handleChange}
                      disabled={isSubmitting}
                      className="h-4 w-4 accent-amber-600"
                    />

                    <div>
                      <p className="font-semibold text-gray-900">
                        Delivery
                      </p>

                      <p className="text-xs text-gray-500">
                        Delivered to your address
                      </p>
                    </div>
                  </label>

                  <label
                    className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition ${
                      formData.orderType === "Pickup"
                        ? "border-amber-500 bg-amber-50"
                        : "border-gray-300 hover:border-amber-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="orderType"
                      value="Pickup"
                      checked={
                        formData.orderType === "Pickup"
                      }
                      onChange={handleChange}
                      disabled={isSubmitting}
                      className="h-4 w-4 accent-amber-600"
                    />

                    <div>
                      <p className="font-semibold text-gray-900">
                        Pickup
                      </p>

                      <p className="text-xs text-gray-500">
                        Collect from the cafe
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {formData.orderType === "Delivery" && (
                <div className="mt-5">
                  <label
                    htmlFor="address"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Delivery Address{" "}
                    <span className="text-red-500">*</span>
                  </label>

                  <textarea
                    id="address"
                    name="address"
                    rows="4"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter your complete delivery address"
                    disabled={isSubmitting}
                    className={`w-full resize-none rounded-lg border px-4 py-3 text-sm outline-none transition focus:ring-2 ${
                      errors.address
                        ? "border-red-400 focus:ring-red-100"
                        : "border-gray-300 focus:border-amber-500 focus:ring-amber-100"
                    } disabled:cursor-not-allowed disabled:bg-gray-100`}
                  />

                  {errors.address && (
                    <p className="mt-1.5 text-xs text-red-500">
                      {errors.address}
                    </p>
                  )}
                </div>
              )}

              <div className="mt-5">
                <label
                  htmlFor="note"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Order Note{" "}
                  <span className="font-normal text-gray-400">
                    (Optional)
                  </span>
                </label>

                <textarea
                  id="note"
                  name="note"
                  rows="3"
                  value={formData.note}
                  onChange={handleChange}
                  placeholder="Any special instructions?"
                  disabled={isSubmitting}
                  className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100 disabled:cursor-not-allowed disabled:bg-gray-100"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-7 w-full rounded-lg bg-amber-600 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting
                  ? "Placing Order..."
                  : "Continue to Place Order"}
              </button>
            </form>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  Order Summary
                </h2>

                <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                  {cartItemCount}{" "}
                  {cartItemCount === 1 ? "item" : "items"}
                </span>
              </div>

              <div className="mt-6 space-y-4">
                {cart.map((item) => {
                  const itemTotal =
                    Number(item.price || 0) *
                    Number(item.quantity || 0);

                  return (
                    <div
                      key={item._id}
                      className="flex gap-3 border-b border-gray-100 pb-4"
                    >
                      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-full w-full object-cover"
                            onError={(event) => {
                              event.currentTarget.onerror = null;
                              event.currentTarget.src =
                                "https://placehold.co/100x100?text=Image";
                            }}
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-xl">
                            ☕
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="truncate text-sm font-semibold text-gray-900">
                          {item.name}
                        </h3>

                        <p className="mt-1 text-xs text-gray-500">
                          ₹{formatPrice(Number(item.price || 0))} ×{" "}
                          {item.quantity}
                        </p>
                      </div>

                      <p className="shrink-0 text-sm font-semibold text-gray-900">
                        ₹{formatPrice(itemTotal)}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="mt-5 space-y-3 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{formatPrice(subtotal)}</span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Delivery Charge</span>

                  <span>
                    {deliveryCharge === 0
                      ? "Free"
                      : `₹${formatPrice(deliveryCharge)}`}
                  </span>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-base font-bold text-gray-900">
                    <span>Total</span>
                    <span>₹{formatPrice(total)}</span>
                  </div>
                </div>
              </div>

              <Link
                to="/cart"
                className="mt-6 block text-center text-sm font-semibold text-amber-600 transition hover:text-amber-700"
              >
                Edit Cart
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Checkout;
