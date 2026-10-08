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
    const loadOrders = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await getCustomerOrderHistory(token);

        if (response.success) {
          setOrders(response.data || []);
        } else {
          setError(
            response.message || "Failed to load your orders."
          );
        }
      } catch (error) {
        console.error("Customer order history error:", error);

        setError(
          error.message ||
            "Unable to load your orders. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [token]);

  const formatDate = (date) => {
    if (!date) {
      return "N/A";
    }

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (date) => {
    if (!date) {
      return "";
    }

    return new Date(date).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusClasses = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-700";

      case "Confirmed":
        return "bg-blue-100 text-blue-700";

      case "Preparing":
        return "bg-orange-100 text-orange-700";

      case "Ready":
        return "bg-purple-100 text-purple-700";

      case "Completed":
        return "bg-green-100 text-green-700";

      case "Cancelled":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-orange-500" />

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
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            My Orders
          </h1>

          <p className="mt-2 text-sm text-gray-600 sm:text-base">
            View your CaféNest order history and track your orders.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Empty State */}
        {!error && orders.length === 0 && (
          <div className="rounded-2xl bg-white px-6 py-12 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 text-2xl">
              🛒
            </div>

            <h2 className="mt-5 text-xl font-semibold text-gray-900">
              No orders yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-600">
              You haven't placed any orders yet. Explore our menu
              and place your first order.
            </p>

            <Link
              to="/menu"
              className="mt-6 inline-flex rounded-lg bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
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
                className="overflow-hidden rounded-2xl bg-white shadow-sm"
              >
                {/* Order Header */}
                <div className="border-b border-gray-100 px-4 py-5 sm:px-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                        Order ID
                      </p>

                      <p className="mt-1 break-all text-sm font-semibold text-gray-900">
                        {order._id}
                      </p>

                      <p className="mt-2 text-xs text-gray-500">
                        {formatDate(order.createdAt)}
                        {" • "}
                        {formatTime(order.createdAt)}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700">
                        {order.orderType}
                      </span>

                      <span
                        className={`rounded-full px-3 py-1.5 text-xs font-semibold ${getStatusClasses(
                          order.status
                        )}`}
                      >
                        {order.status}
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
                        key={`${order._id}-${item.menuItemId}-${index}`}
                        className="flex items-start justify-between gap-4 py-3 first:pt-0 last:pb-0"
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-900">
                            {item.name}
                          </p>

                          <p className="mt-1 text-xs text-gray-500">
                            ₹{Number(item.price || 0).toFixed(2)}
                            {" × "}
                            {item.quantity}
                          </p>
                        </div>

                        <p className="shrink-0 text-sm font-semibold text-gray-900">
                          ₹{Number(item.subtotal || 0).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Summary */}
                <div className="border-t border-gray-100 bg-gray-50 px-4 py-5 sm:px-6">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between text-gray-600">
                      <span>Subtotal</span>

                      <span>
                        ₹{Number(order.subtotal || 0).toFixed(2)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-gray-600">
                      <span>Delivery Charge</span>

                      <span>
                        ₹
                        {Number(
                          order.deliveryCharge || 0
                        ).toFixed(2)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between border-t border-gray-200 pt-3 text-base font-bold text-gray-900">
                      <span>Total</span>

                      <span>
                        ₹{Number(order.totalAmount || 0).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Track Order */}
                  <div className="mt-5">
                    <Link
                      to={`/order-tracking?orderId=${order._id}`}
                      className="inline-flex w-full items-center justify-center rounded-lg border border-orange-500 px-4 py-3 text-sm font-semibold text-orange-600 transition hover:bg-orange-50 sm:w-auto"
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
