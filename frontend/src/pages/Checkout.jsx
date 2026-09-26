import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

const CART_STORAGE_KEY = "cafeNestCart";
const CART_UPDATED_EVENT = "cafeNestCartUpdated";

const API_URL = "http://localhost:5000/api/orders";

function Checkout() {
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

  const cartItemCount = useMemo(() => {
    return cart.reduce(
      (total, item) => total + Number(item.quantity || 0),
      0
    );
  }, [cart]);

  const subtotal = useMemo(() => {
    return cart.reduce(
      (total, item) =>
        total + Number(item.price || 0) * Number(item.quantity || 0),
      0
    );
  }, [cart]);

  const deliveryCharge = formData.orderType === "Delivery" ? 40 : 0;

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
      newErrors.mobile = "Please enter a valid 10-digit mobile number.";
    }

    if (formData.orderType === "Delivery" && !formData.address.trim()) {
      newErrors.address = "Please enter your delivery address.";
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
      const orderData = {
        name: formData.name.trim(),

        mobile: formData.mobile.trim(),

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

  // Empty cart
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
            Please add some delicious items before proceeding to checkout.
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

  // Order success
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
            Your order has been placed successfully. Our team will process
            your order shortly.
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

            <div className="flex items-center justify-between gap-4 border-t border-gray-200 pt-4">
              <span className="text-sm text-gray-600">
                Total Amount
              </span>

              <span className="text-lg font-bold text-amber-600">
                ₹{formatPrice(orderSuccess.totalAmount)}
              </span>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              to="/menu"
              className="rounded-lg bg-amber-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-amber-700"
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
        {/* Page Header */}
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
            Enter your details and review your order before placing it.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Customer Details */}
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

              {/* General Submit Error */}
              {submitError && (
                <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                  <p className="text-sm font-medium text-red-700">
                    {submitError}
                  </p>
                </div>
              )}

              {/* Name */}
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

              {/* Mobile */}
              <div className="mt-5">
                <label
                  htmlFor="mobile"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Mobile Number <span className="text-red-500">*</span>
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

              {/* Order Type */}
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
                      checked={formData.orderType === "Delivery"}
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
                      checked={formData.orderType === "Pickup"}
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

              {/* Address */}
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

              {/* Note */}
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

              {/* Submit */}
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

          {/* Order Summary */}
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

              {/* Items */}
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

              {/* Price Breakdown */}
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
