import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { validateCoupon } from "../services/couponService";

const CART_STORAGE_KEY = "cafeNestCart";
const CART_UPDATED_EVENT = "cafeNestCartUpdated";

const API_URL = `${import.meta.env.VITE_API_URL}/api/orders`;

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

  // ======================================================
  // Coupon State
  // ======================================================
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");

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

  // ======================================================
  // Coupon Discount
  // ======================================================
  const discountAmount = useMemo(() => {
    if (!appliedCoupon) {
      return 0;
    }

    return Number(appliedCoupon.discountAmount || 0);
  }, [appliedCoupon]);

  const total = Math.max(
    0,
    subtotal + deliveryCharge - discountAmount
  );

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN").format(
      Number(price || 0)
    );
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

  // ======================================================
  // Apply Coupon
  // ======================================================
  const handleApplyCoupon = async () => {
    const code = couponCode.trim().toUpperCase();

    setCouponError("");
    setCouponSuccess("");

    if (!code) {
      setCouponError("Please enter a coupon code.");
      return;
    }

    if (subtotal <= 0) {
      setCouponError(
        "Your cart total must be greater than ₹0."
      );
      return;
    }

    setCouponLoading(true);

    try {
      const response = await validateCoupon({
        code,
        orderAmount: subtotal,
      });

      if (!response.success) {
        setAppliedCoupon(null);
        setCouponError(
          response.message || "Invalid coupon code."
        );
        return;
      }

      setAppliedCoupon(response.data);

      setCouponCode(response.data.code || code);

      setCouponSuccess(
        `${response.data.code || code} applied successfully. You saved ₹${formatPrice(
          response.data.discountAmount || 0
        )}.`
      );
    } catch (error) {
      console.error("Apply coupon error:", error);

      setAppliedCoupon(null);

      setCouponError(
        error.message ||
          "Unable to validate coupon. Please try again."
      );
    } finally {
      setCouponLoading(false);
    }
  };

  // ======================================================
  // Remove Coupon
  // ======================================================
  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponError("");
    setCouponSuccess("");
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

    const couponText = orderSuccess.couponCode
      ? `\nCoupon: ${orderSuccess.couponCode}`
      : "";

    const discountText =
      Number(orderSuccess.discountAmount || 0) > 0
        ? `\nDiscount: ₹${formatPrice(
            Number(orderSuccess.discountAmount || 0)
          )}`
        : "";

    const message = `Hello CaféNest,

I have placed an order.

Order ID: ${orderSuccess._id}

Customer Name: ${orderSuccess.customer?.name || ""}
Mobile: ${orderSuccess.customer?.mobile || ""}
Order Type: ${orderSuccess.orderType || ""}${addressText}${noteText}${couponText}${discountText}

Order Items:
${itemsText}

Subtotal: ₹${formatPrice(
      Number(orderSuccess.subtotal || 0)
    )}
Discount: ${
      Number(orderSuccess.discountAmount || 0) > 0
        ? `₹${formatPrice(
            Number(orderSuccess.discountAmount || 0)
          )}`
        : "₹0"
    }
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

        // Coupon information
        couponCode: appliedCoupon?.code || "",
        discountAmount,
        deliveryCharge,
        subtotal,
        totalAmount: total,
      };

      const customerToken =
        localStorage.getItem("customerToken");

      const headers = {
        "Content-Type": "application/json",
      };

      if (customerToken) {
        headers.Authorization = `Bearer ${customerToken}`;
      }

      const response = await fetch(API_URL, {
        method: "POST",
        headers,
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
      setAppliedCoupon(null);
      setCouponCode("");
      setCouponError("");
      setCouponSuccess("");
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

  // ======================================================
  // Empty Cart
  // ======================================================
  if (cart.length === 0 && !orderSuccess) {
    return (
      <section className="min-h-[70vh] overflow-hidden bg-gray-50 px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-2xl rounded-2xl border border-gray-200 bg-white px-4 py-12 text-center shadow-sm sm:px-8 sm:py-16">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-amber-100 text-4xl">
            🛒
          </div>

          <h1 className="mt-6 text-3xl font-bold leading-tight text-gray-900 sm:text-4xl">
            Your Cart is Empty
          </h1>

          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-gray-600 sm:text-base">
            Please add some delicious items before proceeding to
            checkout.
          </p>

          <Link
            to="/menu"
            className="mt-7 inline-flex min-h-11 items-center justify-center rounded-lg bg-amber-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:ring-offset-2"
          >
            Browse Menu
          </Link>
        </div>
      </section>
    );
  }

  // ======================================================
  // Order Success
  // ======================================================
  if (orderSuccess) {
    return (
      <section className="min-h-[70vh] overflow-hidden bg-gray-50 px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-2xl rounded-2xl border border-gray-200 bg-white px-4 py-8 text-center shadow-sm sm:px-8 sm:py-10">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-4xl text-green-700">
            ✓
          </div>

          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-green-600 sm:text-sm sm:tracking-wider">
            Order Confirmed
          </p>

          <h1 className="mt-2 text-3xl font-bold leading-tight text-gray-900 sm:text-4xl">
            Thank You for Your Order!
          </h1>

          <p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-gray-600 sm:text-base sm:leading-7">
            Your order has been placed successfully. Our team will
            process your order shortly.
          </p>

          {/* Order Information */}
          <div className="mt-8 rounded-xl border border-gray-200 bg-gray-50 p-4 text-left sm:p-5">
            <div className="flex flex-col gap-2 border-b border-gray-200 pb-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
              <span className="text-sm text-gray-600">
                Order ID
              </span>

              <span className="break-all text-sm font-semibold text-gray-900 sm:text-right">
                {orderSuccess._id}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4 py-4">
              <span className="text-sm text-gray-600">
                Order Type
              </span>

              <span className="text-right text-sm font-semibold text-gray-900">
                {orderSuccess.orderType}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4 border-t border-gray-200 py-4">
              <span className="text-sm text-gray-600">
                Status
              </span>

              <span className="shrink-0 rounded-full bg-yellow-100 px-3 py-1 text-xs font-bold text-yellow-800">
                {orderSuccess.status}
              </span>
            </div>

            {Number(orderSuccess.discountAmount || 0) > 0 && (
              <div className="flex items-center justify-between gap-4 border-t border-gray-200 py-4">
                <span className="text-sm text-gray-600">
                  Discount
                </span>

                <span className="shrink-0 text-sm font-bold text-green-600">
                  -₹
                  {formatPrice(
                    Number(orderSuccess.discountAmount || 0)
                  )}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between gap-4 border-t border-gray-200 pt-4">
              <span className="text-sm text-gray-600">
                Total Amount
              </span>

              <span className="shrink-0 text-lg font-bold text-amber-600">
                ₹{formatPrice(orderSuccess.totalAmount)}
              </span>
            </div>
          </div>

          {/* WhatsApp Order Section */}
          <div className="mt-7 rounded-xl border border-green-200 bg-green-50 p-4 sm:mt-8 sm:p-5">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-8 w-8"
                aria-hidden="true"
              >
                <path d="M20.52 3.48A11.82 11.82 0 0 0 12.06 0C5.52 0 .2 5.31.2 11.86c0 2.09.55 4.13 1.59 5.93L.1 24l6.36-1.67a11.85 11.85 0 0 0 5.6 1.43h.01c6.54 0 11.86-5.32 11.86-11.86 0-3.17-1.23-6.14-3.41-8.42ZM12.07 21.72h-.01a9.84 9.84 0 0 1-5.02-1.38l-.36-.21-3.77.99 1.01-3.67-.23-.38a9.85 9.85 0 0 1-1.51-5.21c0-5.43 4.42-9.85 9.86-9.85 2.63 0 5.1 1.03 6.96 2.89a9.79 9.79 0 0 1 2.89 6.97c0 5.43-4.42 9.85-9.82 9.85Zm5.4-7.38c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.47-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.2-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.05 1.02-1.05 2.49s1.07 2.89 1.22 3.09c.15.2 2.1 3.2 5.09 4.49.71.31 1.27.49 1.7.63.71.23 1.35.2 1.86.12.57-.08 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35Z" />
              </svg>
            </div>

            <h2 className="mt-4 text-lg font-bold text-gray-900">
              Send Order on WhatsApp
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-600">
              Send your order details directly to CaféNest on
              WhatsApp for easy communication.
            </p>

            <button
              type="button"
              onClick={handleWhatsAppOrder}
              className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-green-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 sm:w-auto"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-5 w-5"
                aria-hidden="true"
              >
                <path d="M20.52 3.48A11.82 11.82 0 0 0 12.06 0C5.52 0 .2 5.31.2 11.86c0 2.09.55 4.13 1.59 5.93L.1 24l6.36-1.67a11.85 11.85 0 0 0 5.6 1.43h.01c6.54 0 11.86-5.32 11.86-11.86 0-3.17-1.23-6.14-3.41-8.42Zm-8.45 18.24h-.01a9.84 9.84 0 0 1-5.02-1.38l-.36-.21-3.77.99 1.01-3.67-.23-.38a9.85 9.85 0 0 1-1.51-5.21c0-5.43 4.42-9.85 9.86-9.85 2.63 0 5.1 1.03 6.96 2.89a9.79 9.79 0 0 1 2.89 6.97c0 5.43-4.42 9.85-9.82 9.85Zm5.4-7.38c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.47-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.2-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.05 1.02-1.05 2.49s1.07 2.89 1.22 3.09c.15.2 2.1 3.2 5.09 4.49.71.31 1.27.49 1.7.63.71.23 1.35.2 1.86.12.57-.08 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35Z" />
              </svg>

              Send Order on WhatsApp
            </button>
          </div>

          {/* Track Order Section */}
          <div className="mt-7 rounded-xl border border-amber-200 bg-amber-50 p-4 sm:mt-8 sm:p-5">
            <div className="text-3xl" aria-hidden="true">
              📦
            </div>

            <h2 className="mt-3 text-lg font-bold text-gray-900">
              Track Your Order
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-600">
              You can track the current status of your order using
              your Order ID and mobile number.
            </p>

            <button
              type="button"
              onClick={handleTrackOrder}
              className="mt-5 inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-amber-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 sm:w-auto"
            >
              Track My Order
            </button>
          </div>

          {/* Bottom Actions */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              to="/menu"
              className="inline-flex min-h-11 items-center justify-center rounded-lg bg-gray-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
            >
              Order More
            </Link>

            <Link
              to="/"
              className="inline-flex min-h-11 items-center justify-center rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-800 transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </section>
    );
  }

  // ======================================================
  // Checkout Form
  // ======================================================
  return (
    <section className="overflow-hidden bg-gray-50 px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 sm:mb-10">
          <Link
            to="/cart"
            className="inline-flex min-h-10 items-center text-sm font-medium text-amber-600 transition hover:text-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:ring-offset-2"
          >
            ← Back to Cart
          </Link>

          <h1 className="mt-4 text-3xl font-bold leading-tight text-gray-900 sm:text-4xl">
            Checkout
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600 sm:text-base">
            Enter your details and review your order before placing
            it.
          </p>
        </div>

        <div className="grid min-w-0 gap-7 lg:grid-cols-3 lg:gap-8">
          {/* Checkout Form */}
          <div className="min-w-0 lg:col-span-2">
            <form
              onSubmit={handleSubmit}
              className="min-w-0 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6 lg:p-7"
            >
              <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
                Customer Details
              </h2>

              <p className="mt-1 text-sm leading-6 text-gray-500">
                Please provide your contact and order details.
              </p>

              {/* Submit Error */}
              {submitError && (
                <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                  <p className="text-sm font-medium leading-5 text-red-700">
                    {submitError}
                  </p>
                </div>
              )}

              {/* Full Name */}
              <div className="mt-7">
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Full Name <span className="text-red-500">*</span>
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  disabled={isSubmitting}
                  autoComplete="name"
                  className={`min-h-11 w-full rounded-lg border px-4 py-3 text-sm outline-none transition focus:ring-2 ${
                    errors.name
                      ? "border-red-400 focus:ring-red-100"
                      : "border-gray-300 focus:border-amber-500 focus:ring-amber-100"
                  } disabled:cursor-not-allowed disabled:bg-gray-100`}
                />

                {errors.name && (
                  <p className="mt-1.5 text-xs leading-5 text-red-500">
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Mobile */}
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
                  autoComplete="tel"
                  className={`min-h-11 w-full rounded-lg border px-4 py-3 text-sm outline-none transition focus:ring-2 ${
                    errors.mobile
                      ? "border-red-400 focus:ring-red-100"
                      : "border-gray-300 focus:border-amber-500 focus:ring-amber-100"
                  } disabled:cursor-not-allowed disabled:bg-gray-100`}
                />

                {errors.mobile && (
                  <p className="mt-1.5 text-xs leading-5 text-red-500">
                    {errors.mobile}
                  </p>
                )}
              </div>

              {/* Order Type */}
              <div className="mt-5">
                <label className="mb-3 block text-sm font-semibold text-gray-700">
                  Order Type
                </label>

                <div className="grid gap-3 sm:grid-cols-2">
                  <label
                    className={`flex min-w-0 cursor-pointer items-start gap-3 rounded-xl border p-4 transition ${
                      formData.orderType === "Delivery"
                        ? "border-amber-500 bg-amber-50"
                        : "border-gray-300 hover:border-amber-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="orderType"
                      value="Delivery"
                      checked={formData.orderType === "Delivery"}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      className="mt-0.5 h-4 w-4 shrink-0 accent-amber-600"
                    />

                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900">
                        Delivery
                      </p>

                      <p className="mt-0.5 text-xs leading-5 text-gray-500">
                        Delivered to your address
                      </p>
                    </div>
                  </label>

                  <label
                    className={`flex min-w-0 cursor-pointer items-start gap-3 rounded-xl border p-4 transition ${
                      formData.orderType === "Pickup"
                        ? "border-amber-500 bg-amber-50"
                        : "border-gray-300 hover:border-amber-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="orderType"
                      value="Pickup"
                      checked={formData.orderType === "Pickup"}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      className="mt-0.5 h-4 w-4 shrink-0 accent-amber-600"
                    />

                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900">
                        Pickup
                      </p>

                      <p className="mt-0.5 text-xs leading-5 text-gray-500">
                        Collect from the cafe
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Delivery Address */}
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
                    autoComplete="street-address"
                    className={`min-h-28 w-full resize-none rounded-lg border px-4 py-3 text-sm leading-6 outline-none transition focus:ring-2 ${
                      errors.address
                        ? "border-red-400 focus:ring-red-100"
                        : "border-gray-300 focus:border-amber-500 focus:ring-amber-100"
                    } disabled:cursor-not-allowed disabled:bg-gray-100`}
                  />

                  {errors.address && (
                    <p className="mt-1.5 text-xs leading-5 text-red-500">
                      {errors.address}
                    </p>
                  )}
                </div>
              )}

              {/* Order Note */}
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
                  className="min-h-24 w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm leading-6 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100 disabled:cursor-not-allowed disabled:bg-gray-100"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-7 flex min-h-12 w-full items-center justify-center rounded-lg bg-amber-600 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting
                  ? "Placing Order..."
                  : "Continue to Place Order"}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="min-w-0 lg:col-span-1">
            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6 lg:sticky lg:top-24">
              <div className="flex min-w-0 items-start justify-between gap-3">
                <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
                  Order Summary
                </h2>

                <span className="shrink-0 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                  {cartItemCount}{" "}
                  {cartItemCount === 1 ? "item" : "items"}
                </span>
              </div>

              {/* Cart Items */}
              <div className="mt-6 space-y-4">
                {cart.map((item) => {
                  const itemTotal =
                    Number(item.price || 0) *
                    Number(item.quantity || 0);

                  return (
                    <div
                      key={item._id}
                      className="flex min-w-0 gap-3 border-b border-gray-100 pb-4"
                    >
                      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            loading="lazy"
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
                        <h3 className="break-words text-sm font-semibold leading-5 text-gray-900">
                          {item.name}
                        </h3>

                        <p className="mt-1 text-xs leading-5 text-gray-500">
                          ₹{formatPrice(Number(item.price || 0))} ×{" "}
                          {item.quantity}
                        </p>
                      </div>

                      <p className="shrink-0 text-right text-sm font-semibold text-gray-900">
                        ₹{formatPrice(itemTotal)}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Coupon */}
              <div className="mt-6 rounded-xl border border-gray-200 bg-gray-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">
                      Have a Coupon?
                    </h3>

                    <p className="mt-1 text-xs text-gray-500">
                      Apply a valid coupon to save on your order.
                    </p>
                  </div>

                  {appliedCoupon && (
                    <span className="shrink-0 text-lg">
                      🎟️
                    </span>
                  )}
                </div>

                {!appliedCoupon ? (
                  <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(event) => {
                        setCouponCode(
                          event.target.value.toUpperCase()
                        );
                        setCouponError("");
                        setCouponSuccess("");
                      }}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          event.preventDefault();
                          handleApplyCoupon();
                        }
                      }}
                      placeholder="Enter coupon code"
                      disabled={couponLoading || isSubmitting}
                      className="min-h-11 min-w-0 flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium uppercase outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100 disabled:cursor-not-allowed disabled:bg-gray-100"
                    />

                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      disabled={
                        couponLoading ||
                        isSubmitting ||
                        !couponCode.trim()
                      }
                      className="min-h-11 rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {couponLoading ? "Applying..." : "Apply"}
                    </button>
                  </div>
                ) : (
                  <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="break-all text-sm font-bold text-green-800">
                          {appliedCoupon.code}
                        </p>

                        <p className="mt-1 text-xs text-green-700">
                          {appliedCoupon.description ||
                            "Coupon applied successfully."}
                        </p>

                        <p className="mt-2 text-sm font-bold text-green-700">
                          You save ₹
                          {formatPrice(discountAmount)}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={handleRemoveCoupon}
                        disabled={isSubmitting}
                        className="shrink-0 rounded-md px-2 py-1 text-xs font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                )}

                {couponError && (
                  <p className="mt-2 text-xs font-medium leading-5 text-red-600">
                    {couponError}
                  </p>
                )}

                {couponSuccess && !couponError && (
                  <p className="mt-2 text-xs font-medium leading-5 text-green-600">
                    {couponSuccess}
                  </p>
                )}
              </div>

              {/* Pricing */}
              <div className="mt-5 space-y-3 text-sm">
                <div className="flex items-center justify-between gap-4 text-gray-600">
                  <span>Subtotal</span>

                  <span className="shrink-0">
                    ₹{formatPrice(subtotal)}
                  </span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex items-center justify-between gap-4 text-green-600">
                    <span>
                      Discount
                      {appliedCoupon?.code
                        ? ` (${appliedCoupon.code})`
                        : ""}
                    </span>

                    <span className="shrink-0 font-semibold">
                      -₹{formatPrice(discountAmount)}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between gap-4 text-gray-600">
                  <span>Delivery Charge</span>

                  <span className="shrink-0">
                    {deliveryCharge === 0
                      ? "Free"
                      : `₹${formatPrice(deliveryCharge)}`}
                  </span>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-center justify-between gap-4 text-base font-bold text-gray-900">
                    <span>Total</span>

                    <span className="shrink-0 text-lg text-amber-600 sm:text-xl">
                      ₹{formatPrice(total)}
                    </span>
                  </div>
                </div>
              </div>

              <Link
                to="/cart"
                className="mt-6 flex min-h-10 items-center justify-center text-center text-sm font-semibold text-amber-600 transition hover:text-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:ring-offset-2"
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