import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const API_URL = "http://localhost:5000/api/orders";

function OrderTracking() {
  const location = useLocation();

  const passedOrderId = location.state?.orderId || "";
  const passedMobile = location.state?.mobile || "";

  const [orderId, setOrderId] = useState(passedOrderId);
  const [mobile, setMobile] = useState(passedMobile);

  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN").format(
      Number(price || 0)
    );
  };

  const getStatusClasses = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800";

      case "Confirmed":
        return "bg-blue-100 text-blue-800";

      case "Preparing":
        return "bg-orange-100 text-orange-800";

      case "Ready":
        return "bg-purple-100 text-purple-800";

      case "Completed":
        return "bg-green-100 text-green-800";

      case "Cancelled":
        return "bg-red-100 text-red-800";

      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusMessage = (status) => {
    switch (status) {
      case "Pending":
        return "Your order has been received and is waiting for confirmation.";

      case "Confirmed":
        return "Your order has been confirmed by the cafe.";

      case "Preparing":
        return "Our team is currently preparing your order.";

      case "Ready":
        return "Your order is ready for pickup or delivery.";

      case "Completed":
        return "Your order has been completed. Thank you for ordering!";

      case "Cancelled":
        return "This order has been cancelled.";

      default:
        return "Your order status is currently being processed.";
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setOrder(null);

    const trimmedOrderId = orderId.trim();
    const trimmedMobile = mobile.trim();

    if (!trimmedOrderId) {
      setError("Please enter your Order ID.");
      return;
    }

    if (!trimmedMobile) {
      setError("Please enter your mobile number.");
      return;
    }

    if (!/^[6-9]\d{9}$/.test(trimmedMobile)) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/track/${trimmedOrderId}?mobile=${encodeURIComponent(
          trimmedMobile
        )}`
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Unable to find your order."
        );
      }

      setOrder(result.data);
    } catch (error) {
      console.error("Track order error:", error);

      setError(
        error.message ||
          "Something went wrong while tracking your order."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="min-h-[70vh] bg-gray-50 px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Page Header */}
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-amber-600">
            Order Tracking
          </p>

          <h1 className="mt-3 text-3xl font-bold text-gray-900 sm:text-4xl">
            Track Your Order
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-gray-600 sm:text-base">
            Enter your Order ID and mobile number to check the
            current status of your order.
          </p>
        </div>

        {/* Tracking Form */}
        <div className="mx-auto mt-10 max-w-2xl rounded-2xl bg-white p-6 shadow-sm sm:p-8">
          <form onSubmit={handleSubmit}>
            {/* Error */}
            {error && (
              <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                <p className="text-sm font-medium text-red-700">
                  {error}
                </p>
              </div>
            )}

            {/* Order ID */}
            <div>
              <label
                htmlFor="orderId"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Order ID
              </label>

              <input
                id="orderId"
                type="text"
                value={orderId}
                onChange={(event) => {
                  setOrderId(event.target.value);
                  setError("");
                }}
                placeholder="Enter your Order ID"
                disabled={isLoading}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100 disabled:cursor-not-allowed disabled:bg-gray-100"
              />

              <p className="mt-1.5 text-xs text-gray-500">
                You can find your Order ID on the order confirmation
                page.
              </p>
            </div>

            {/* Mobile */}
            <div className="mt-5">
              <label
                htmlFor="trackingMobile"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Mobile Number
              </label>

              <input
                id="trackingMobile"
                type="tel"
                inputMode="numeric"
                maxLength="10"
                value={mobile}
                onChange={(event) => {
                  setMobile(event.target.value);
                  setError("");
                }}
                placeholder="Enter the mobile number used for the order"
                disabled={isLoading}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100 disabled:cursor-not-allowed disabled:bg-gray-100"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="mt-6 w-full rounded-lg bg-amber-600 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading
                ? "Checking Order..."
                : "Track Order"}
            </button>
          </form>
        </div>

        {/* Order Result */}
        {order && (
          <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm sm:p-8">
            {/* Order Header */}
            <div className="flex flex-col gap-4 border-b border-gray-200 pb-6 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Order ID
                </p>

                <p className="mt-1 break-all text-sm font-bold text-gray-900">
                  {order._id}
                </p>
              </div>

              <span
                className={`w-fit rounded-full px-4 py-2 text-sm font-bold ${getStatusClasses(
                  order.status
                )}`}
              >
                {order.status}
              </span>
            </div>

            {/* Status Message */}
            <div className="mt-6 rounded-xl border border-amber-100 bg-amber-50 p-5">
              <h2 className="text-base font-bold text-gray-900">
                Current Status
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-700">
                {getStatusMessage(order.status)}
              </p>
            </div>

            {/* Order Progress */}
            <div className="mt-8">
              <h2 className="text-lg font-bold text-gray-900">
                Order Progress
              </h2>

              <div className="mt-5 grid gap-3 sm:grid-cols-5">
                {[
                  "Pending",
                  "Confirmed",
                  "Preparing",
                  "Ready",
                  "Completed",
                ].map((status) => {
                  const statusOrder = [
                    "Pending",
                    "Confirmed",
                    "Preparing",
                    "Ready",
                    "Completed",
                  ];

                  const currentIndex =
                    statusOrder.indexOf(order.status);

                  const statusIndex =
                    statusOrder.indexOf(status);

                  const isCompleted =
                    order.status !== "Cancelled" &&
                    currentIndex >= statusIndex;

                  const isCurrent =
                    order.status === status;

                  return (
                    <div
                      key={status}
                      className={`rounded-xl border p-3 text-center ${
                        isCompleted
                          ? "border-amber-300 bg-amber-50"
                          : "border-gray-200 bg-gray-50"
                      }`}
                    >
                      <div
                        className={`mx-auto flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                          isCompleted
                            ? "bg-amber-600 text-white"
                            : "bg-gray-200 text-gray-500"
                        }`}
                      >
                        {isCompleted ? "✓" : statusIndex + 1}
                      </div>

                      <p
                        className={`mt-2 text-xs font-semibold ${
                          isCurrent
                            ? "text-amber-700"
                            : "text-gray-600"
                        }`}
                      >
                        {status}
                      </p>
                    </div>
                  );
                })}
              </div>

              {order.status === "Cancelled" && (
                <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4">
                  <p className="text-sm font-semibold text-red-700">
                    This order has been cancelled.
                  </p>
                </div>
              )}
            </div>

            {/* Customer / Order Information */}
            <div className="mt-8 grid gap-5 border-t border-gray-200 pt-8 sm:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Customer
                </p>

                <p className="mt-1 text-sm font-semibold text-gray-900">
                  {order.customer?.name}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Order Type
                </p>

                <p className="mt-1 text-sm font-semibold text-gray-900">
                  {order.orderType}
                </p>
              </div>

              {order.orderType === "Delivery" &&
                order.address && (
                  <div className="sm:col-span-2">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Delivery Address
                    </p>

                    <p className="mt-1 text-sm leading-6 text-gray-700">
                      {order.address}
                    </p>
                  </div>
                )}

              {order.note && (
                <div className="sm:col-span-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Order Note
                  </p>

                  <p className="mt-1 text-sm leading-6 text-gray-700">
                    {order.note}
                  </p>
                </div>
              )}
            </div>

            {/* Ordered Items */}
            <div className="mt-8 border-t border-gray-200 pt-8">
              <h2 className="text-lg font-bold text-gray-900">
                Ordered Items
              </h2>

              <div className="mt-4 divide-y divide-gray-100">
                {order.items?.map((item) => (
                  <div
                    key={`${item.menuItemId}-${item.name}`}
                    className="flex items-center justify-between gap-4 py-4"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-gray-900">
                        {item.name}
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        ₹{formatPrice(item.price)} ×{" "}
                        {item.quantity}
                      </p>
                    </div>

                    <p className="shrink-0 text-sm font-bold text-gray-900">
                      ₹{formatPrice(item.subtotal)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Price Summary */}
            <div className="mt-5 border-t border-gray-200 pt-5">
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>

                  <span>
                    ₹{formatPrice(order.subtotal)}
                  </span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Delivery Charge</span>

                  <span>
                    {Number(order.deliveryCharge || 0) === 0
                      ? "Free"
                      : `₹${formatPrice(
                          order.deliveryCharge
                        )}`}
                  </span>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-base font-bold text-gray-900">
                    <span>Total Amount</span>

                    <span className="text-xl text-amber-600">
                      ₹{formatPrice(order.totalAmount)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => {
                  setOrder(null);
                  setError("");
                }}
                className="rounded-lg border border-gray-300 bg-white px-5 py-3 text-center text-sm font-semibold text-gray-800 transition hover:bg-gray-50"
              >
                Track Another Order
              </button>

              <Link
                to="/menu"
                className="rounded-lg bg-amber-600 px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-amber-700"
              >
                Order More
              </Link>
            </div>
          </div>
        )}

        {/* Bottom Link */}
        <div className="mt-8 text-center">
          <Link
            to="/"
            className="text-sm font-semibold text-amber-600 transition hover:text-amber-700"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </section>
  );
}

export default OrderTracking;
