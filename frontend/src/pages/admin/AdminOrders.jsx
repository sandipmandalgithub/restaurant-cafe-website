import { useEffect, useMemo, useState } from "react";

const API_URL = "http://localhost:5000/api/orders";

const STATUS_OPTIONS = [
  "Pending",
  "Confirmed",
  "Preparing",
  "Ready",
  "Completed",
  "Cancelled",
];

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const [deletingOrderId, setDeletingOrderId] = useState(null);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("adminToken");

    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN").format(
      Number(price || 0)
    );
  };

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    return new Intl.DateTimeFormat("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(date));
  };

  const getStatusClasses = (status) => {
    switch (status) {
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

      case "Pending":
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  useEffect(() => {
    let isMounted = true;

    const loadOrders = async () => {
      try {
        const token = localStorage.getItem("adminToken");

        const response = await fetch(API_URL, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.message || "Failed to fetch orders."
          );
        }

        if (isMounted) {
          setOrders(result.data || []);
          setError("");
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Fetch orders error:", error);

        if (isMounted) {
          setError(
            error.message ||
              "Something went wrong while loading orders."
          );
          setIsLoading(false);
        }
      }
    };

    loadOrders();

    return () => {
      isMounted = false;
    };
  }, []);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      setError("");

      const response = await fetch(API_URL, {
        method: "GET",
        headers: getAuthHeaders(),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to fetch orders."
        );
      }

      setOrders(result.data || []);
    } catch (error) {
      console.error("Fetch orders error:", error);

      setError(
        error.message ||
          "Something went wrong while loading orders."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (orderId, status) => {
    try {
      setUpdatingOrderId(orderId);
      setError("");

      const response = await fetch(
        `${API_URL}/${orderId}/status`,
        {
          method: "PUT",
          headers: getAuthHeaders(),
          body: JSON.stringify({
            status,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to update order status."
        );
      }

      setOrders((previousOrders) =>
        previousOrders.map((order) =>
          order._id === orderId
            ? {
                ...order,
                status: result.data.status,
              }
            : order
        )
      );
    } catch (error) {
      console.error("Update order status error:", error);

      setError(
        error.message ||
          "Failed to update order status."
      );
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    const shouldDelete = window.confirm(
      "Are you sure you want to delete this order?"
    );

    if (!shouldDelete) {
      return;
    }

    try {
      setDeletingOrderId(orderId);
      setError("");

      const response = await fetch(
        `${API_URL}/${orderId}`,
        {
          method: "DELETE",
          headers: getAuthHeaders(),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to delete order."
        );
      }

      setOrders((previousOrders) =>
        previousOrders.filter(
          (order) => order._id !== orderId
        )
      );
    } catch (error) {
      console.error("Delete order error:", error);

      setError(
        error.message ||
          "Failed to delete order."
      );
    } finally {
      setDeletingOrderId(null);
    }
  };

  const orderStats = useMemo(() => {
    return {
      total: orders.length,

      pending: orders.filter(
        (order) => order.status === "Pending"
      ).length,

      preparing: orders.filter(
        (order) => order.status === "Preparing"
      ).length,

      completed: orders.filter(
        (order) => order.status === "Completed"
      ).length,
    };
  }, [orders]);

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-amber-600">
              Admin Panel
            </p>

            <h1 className="mt-1 text-2xl font-bold text-gray-900 sm:text-3xl">
              Orders
            </h1>

            <p className="mt-2 text-sm text-gray-600">
              Manage customer orders and update their status.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchOrders}
            disabled={isLoading}
            className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-800 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? "Refreshing..." : "Refresh Orders"}
          </button>
        </div>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">
              Total Orders
            </p>

            <p className="mt-2 text-2xl font-bold text-gray-900">
              {orderStats.total}
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">
              Pending
            </p>

            <p className="mt-2 text-2xl font-bold text-yellow-600">
              {orderStats.pending}
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">
              Preparing
            </p>

            <p className="mt-2 text-2xl font-bold text-orange-600">
              {orderStats.preparing}
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">
              Completed
            </p>

            <p className="mt-2 text-2xl font-bold text-green-600">
              {orderStats.completed}
            </p>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-6 flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-medium text-red-700">
              {error}
            </p>

            <button
              type="button"
              onClick={fetchOrders}
              className="w-fit rounded-lg bg-red-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Loading */}
        {isLoading && (
          <div className="mt-8 rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-amber-600" />

            <p className="mt-5 text-sm font-medium text-gray-600">
              Loading orders...
            </p>
          </div>
        )}

        {/* Empty */}
        {!isLoading && !error && orders.length === 0 && (
          <div className="mt-8 rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-50 text-3xl">
              📦
            </div>

            <h2 className="mt-5 text-xl font-bold text-gray-900">
              No Orders Yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-600">
              Customer orders will appear here after they place
              an order from the website.
            </p>
          </div>
        )}

        {/* Orders */}
        {!isLoading && orders.length > 0 && (
          <div className="mt-8 space-y-6">
            {orders.map((order) => (
              <article
                key={order._id}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
              >
                {/* Order Header */}
                <div className="border-b border-gray-200 bg-gray-50 px-5 py-5 sm:px-6">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="text-lg font-bold text-gray-900">
                          Order #{order._id.slice(-6).toUpperCase()}
                        </h2>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>
                      </div>

                      <p className="mt-2 text-xs text-gray-500">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>

                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                      <select
                        value={order.status}
                        onChange={(event) =>
                          handleStatusChange(
                            order._id,
                            event.target.value
                          )
                        }
                        disabled={
                          updatingOrderId === order._id
                        }
                        className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-800 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100 disabled:cursor-not-allowed disabled:bg-gray-100"
                      >
                        {STATUS_OPTIONS.map((status) => (
                          <option
                            key={status}
                            value={status}
                          >
                            {status}
                          </option>
                        ))}
                      </select>

                      <button
                        type="button"
                        onClick={() =>
                          handleDeleteOrder(order._id)
                        }
                        disabled={
                          deletingOrderId === order._id
                        }
                        className="rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {deletingOrderId === order._id
                          ? "Deleting..."
                          : "Delete"}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Order Content */}
                <div className="p-5 sm:p-6">
                  <div className="grid gap-6 lg:grid-cols-3">
                    {/* Customer */}
                    <div>
                      <h3 className="text-sm font-bold uppercase tracking-wide text-gray-500">
                        Customer
                      </h3>

                      <div className="mt-3 space-y-2">
                        <p className="font-semibold text-gray-900">
                          {order.customer?.name || "-"}
                        </p>

                        <p className="text-sm text-gray-600">
                          📞 {order.customer?.mobile || "-"}
                        </p>

                        <p className="text-sm text-gray-600">
                          {order.orderType === "Delivery"
                            ? "🚚 Delivery"
                            : "🏪 Pickup"}
                        </p>
                      </div>
                    </div>

                    {/* Address */}
                    <div>
                      <h3 className="text-sm font-bold uppercase tracking-wide text-gray-500">
                        {order.orderType === "Delivery"
                          ? "Delivery Address"
                          : "Pickup"}
                      </h3>

                      <div className="mt-3">
                        {order.orderType === "Delivery" ? (
                          <p className="text-sm leading-6 text-gray-700">
                            {order.address || "-"}
                          </p>
                        ) : (
                          <p className="text-sm leading-6 text-gray-700">
                            Customer will collect the order
                            from the cafe.
                          </p>
                        )}
                      </div>

                      {order.note && (
                        <div className="mt-4 rounded-lg bg-yellow-50 p-3">
                          <p className="text-xs font-semibold text-yellow-800">
                            Customer Note
                          </p>

                          <p className="mt-1 text-sm leading-5 text-yellow-900">
                            {order.note}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Payment Summary */}
                    <div>
                      <h3 className="text-sm font-bold uppercase tracking-wide text-gray-500">
                        Payment Summary
                      </h3>

                      <div className="mt-3 space-y-2 text-sm">
                        <div className="flex justify-between gap-4">
                          <span className="text-gray-600">
                            Subtotal
                          </span>

                          <span className="font-medium text-gray-900">
                            ₹{formatPrice(order.subtotal)}
                          </span>
                        </div>

                        <div className="flex justify-between gap-4">
                          <span className="text-gray-600">
                            Delivery
                          </span>

                          <span className="font-medium text-gray-900">
                            {order.deliveryCharge === 0
                              ? "Free"
                              : `₹${formatPrice(
                                  order.deliveryCharge
                                )}`}
                          </span>
                        </div>

                        <div className="border-t border-gray-200 pt-3">
                          <div className="flex justify-between gap-4">
                            <span className="font-bold text-gray-900">
                              Total
                            </span>

                            <span className="text-xl font-bold text-amber-600">
                              ₹{formatPrice(
                                order.totalAmount
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="mt-7 border-t border-gray-200 pt-6">
                    <h3 className="text-sm font-bold uppercase tracking-wide text-gray-500">
                      Ordered Items
                    </h3>

                    <div className="mt-4 overflow-x-auto">
                      <table className="w-full min-w-[620px] text-left">
                        <thead>
                          <tr className="border-b border-gray-200 text-xs uppercase tracking-wide text-gray-500">
                            <th className="pb-3 pr-4 font-semibold">
                              Item
                            </th>

                            <th className="pb-3 pr-4 font-semibold">
                              Price
                            </th>

                            <th className="pb-3 pr-4 font-semibold">
                              Quantity
                            </th>

                            <th className="pb-3 text-right font-semibold">
                              Subtotal
                            </th>
                          </tr>
                        </thead>

                        <tbody>
                          {order.items?.map((item, index) => (
                            <tr
                              key={`${order._id}-${item.menuItemId}-${index}`}
                              className="border-b border-gray-100 last:border-b-0"
                            >
                              <td className="py-4 pr-4">
                                <p className="font-semibold text-gray-900">
                                  {item.name}
                                </p>
                              </td>

                              <td className="py-4 pr-4 text-sm text-gray-600">
                                ₹{formatPrice(item.price)}
                              </td>

                              <td className="py-4 pr-4 text-sm text-gray-600">
                                {item.quantity}
                              </td>

                              <td className="py-4 text-right text-sm font-semibold text-gray-900">
                                ₹{formatPrice(item.subtotal)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminOrders;
