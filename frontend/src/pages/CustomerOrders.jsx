import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import useCustomerAuth from "../context/useCustomerAuth";
import { getCustomerOrderHistory } from "../services/orderService";

function CustomerOrders() {
  const { token } = useCustomerAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isActive = true;

    const loadOrders = async () => {
      if (!token) {
        setLoading(false);
        setOrders([]);
        setError("");
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await getCustomerOrderHistory(token);

        if (!isActive) return;

        if (response.success) {
          setOrders(response.data || []);
        } else {
          setError(response.message || "Failed to load your orders.");
        }
      } catch (error) {
        if (!isActive) return;

        console.error("Customer order history error:", error);

        setError(
          error.message || "Unable to load your orders. Please try again."
        );
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    loadOrders();

    return () => {
      isActive = false;
    };
  }, [token]);

  const formatDate = (date) => {
    if (!date) return "N/A";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return "N/A";

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (date) => {
    if (!date) return "";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return "";

    return parsedDate.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatPrice = (amount) => {
    const value = Number(amount);

    return `₹${(Number.isFinite(value) ? value : 0).toFixed(2)}`;
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
        return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <div
            className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-orange-600"
            role="status"
            aria-label="Loading orders"
          />

          <p className="mt-4 text-sm text-gray-600">
            Loading your orders...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-160px)] bg-gray-50 px-4 py-10 sm:py-14">
      <div className="mx-auto w-full max-w-5xl">
        {/* Page Header */}
        <div className="mb-8">
          {/* CaféNest Brand */}
          <Link
            to="/"
            aria-label="CaféNest Home"
            className="inline-block text-xl font-bold tracking-tight transition-opacity hover:opacity-80 sm:text-2xl"
          >
            <span className="text-gray-900">Café</span>
            <span className="text-orange-600">Nest</span>
          </Link>

          <h1 className="mt-4 text-2xl font-bold text-gray-900 sm:text-3xl">
            My Orders
          </h1>

          <p className="mt-2 text-sm leading-6 text-gray-600 sm:text-base">
            View your CaféNest order history and track your orders.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div
            role="alert"
            className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-4 text-sm leading-6 text-red-700"
          >
            {error}
          </div>
        )}

        {/* Empty State */}
        {!error && orders.length === 0 && (
          <div className="rounded-2xl border border-gray-100 bg-white px-5 py-12 text-center shadow-sm sm:px-6">
            <div
              className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 text-2xl"
              aria-hidden="true"
            >
              🛒
            </div>

            <h2 className="mt-5 text-xl font-semibold text-gray-900">
              No orders yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-600">
              You haven't placed any orders yet. Explore our menu and place
              your first order.
            </p>

            <Link
              to="/menu"
              className="mt-6 inline-flex min-h-11 items-center justify-center rounded-lg bg-orange-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
            >
              Browse Menu
            </Link>
          </div>
        )}

        {/* Orders */}
        {orders.length > 0 && (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-md"
              >
                {/* Order Header */}
                <div className="border-b border-gray-100 px-4 py-5 sm:px-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                        Order ID
                      </p>

                      <p className="mt-1 break-all text-sm font-semibold text-gray-900">
                        {order._id}
                      </p>

                      <p className="mt-2 text-xs text-gray-500">
                        {formatDate(order.createdAt)}
                        {formatTime(order.createdAt) && (
                          <>
                            {" • "}
                            {formatTime(order.createdAt)}
                          </>
                        )}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700">
                        {order.orderType || "Order"}
                      </span>

                      <span
                        className={`rounded-full px-3 py-1.5 text-xs font-semibold ${getStatusClasses(
                          order.status
                        )}`}
                      >
                        {order.status || "Unknown"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="px-4 py-5 sm:px-6">
                  <h2 className="text-sm font-semibold text-gray-900">
                    Items
                  </h2>

                  <div className="mt-4 divide-y divide-gray-100">
                    {order.items?.map((item, index) => (
                      <div
                        key={`${order._id}-${item.menuItemId || item.name || "item"}-${index}`}
                        className="flex items-start justify-between gap-4 py-3 first:pt-0 last:pb-0"
                      >
                        <div className="min-w-0">
                          <p className="break-words text-sm font-medium text-gray-900">
                            {item.name || "Menu item"}
                          </p>

                          <p className="mt-1 text-xs text-gray-500">
                            {formatPrice(item.price)}
                            {" × "}
                            {item.quantity || 0}
                          </p>
                        </div>

                        <p className="shrink-0 text-sm font-semibold text-gray-900">
                          {formatPrice(item.subtotal)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Summary */}
                <div className="border-t border-gray-100 bg-gray-50 px-4 py-5 sm:px-6">
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between gap-4 text-gray-600">
                      <span>Subtotal</span>
                      <span className="shrink-0">
                        {formatPrice(order.subtotal)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-4 text-gray-600">
                      <span>Delivery Charge</span>
                      <span className="shrink-0">
                        {formatPrice(order.deliveryCharge)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-4 border-t border-gray-200 pt-3 text-base font-bold text-gray-900">
                      <span>Total</span>
                      <span className="shrink-0">
                        {formatPrice(order.totalAmount)}
                      </span>
                    </div>
                  </div>

                  {/* Track Order */}
                  <div className="mt-5">
                    <Link
                      to={`/order-tracking?orderId=${encodeURIComponent(
                        order._id
                      )}`}
                      className="inline-flex min-h-11 w-full items-center justify-center rounded-lg border border-orange-600 px-4 py-3 text-sm font-semibold text-orange-700 transition hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 sm:w-auto"
                    >
                      Track Order
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default CustomerOrders;
