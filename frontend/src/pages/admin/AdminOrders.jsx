import { useEffect, useMemo, useState } from "react";

const API_URL = `${import.meta.env.VITE_API_URL}/api/orders`;

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
    return new Intl.NumberFormat("en-IN").format(Number(price || 0));
  };

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "-";
    }

    return new Intl.DateTimeFormat("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(parsedDate);
  };

  const getStatusClasses = (status) => {
    switch (status) {
      case "Confirmed":
        return "border border-blue-200 bg-blue-50 text-blue-700";

      case "Preparing":
        return "border border-orange-200 bg-orange-50 text-orange-700";

      case "Ready":
        return "border border-purple-200 bg-purple-50 text-purple-700";

      case "Completed":
        return "border border-green-200 bg-green-50 text-green-700";

      case "Cancelled":
        return "border border-red-200 bg-red-50 text-red-700";

      case "Pending":
      default:
        return "border border-yellow-200 bg-yellow-50 text-yellow-700";
    }
  };

  const getStatusDotClasses = (status) => {
    switch (status) {
      case "Confirmed":
        return "bg-blue-500";

      case "Preparing":
        return "bg-orange-500";

      case "Ready":
        return "bg-purple-500";

      case "Completed":
        return "bg-green-500";

      case "Cancelled":
        return "bg-red-500";

      case "Pending":
      default:
        return "bg-yellow-500";
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

  const stats = [
    {
      label: "Total Orders",
      value: orderStats.total,
      icon: "📦",
      iconBg: "bg-gray-100",
      valueColor: "text-gray-900",
    },
    {
      label: "Pending",
      value: orderStats.pending,
      icon: "⏳",
      iconBg: "bg-yellow-50",
      valueColor: "text-yellow-600",
    },
    {
      label: "Preparing",
      value: orderStats.preparing,
      icon: "🍳",
      iconBg: "bg-orange-50",
      valueColor: "text-orange-600",
    },
    {
      label: "Completed",
      value: orderStats.completed,
      icon: "✓",
      iconBg: "bg-green-50",
      valueColor: "text-green-600",
    },
  ];

  return (
    <div className="min-h-screen overflow-x-hidden bg-gray-50">
      <main className="mx-auto w-full max-w-7xl px-3 py-5 sm:px-5 sm:py-7 lg:px-8 lg:py-9">
        {/* Page Header */}
        <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6 lg:p-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-amber-500" />

                <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-600 sm:text-sm">
                  Admin Panel
                </p>
              </div>

              <h1 className="mt-2 break-words text-2xl font-bold leading-tight text-gray-900 sm:text-3xl lg:text-4xl">
                Orders
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600 sm:text-base">
                Manage customer orders, monitor progress, and
                update order status.
              </p>
            </div>

            <button
              type="button"
              onClick={fetchOrders}
              disabled={isLoading}
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-800 shadow-sm transition hover:border-gray-400 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-amber-200 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              <span aria-hidden="true">↻</span>

              {isLoading ? "Refreshing..." : "Refresh Orders"}
            </button>
          </div>
        </section>

        {/* Stats */}
        <section className="mt-5 grid grid-cols-2 gap-3 sm:mt-6 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="group rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-medium text-gray-500 sm:text-sm">
                    {stat.label}
                  </p>

                  <p
                    className={`mt-2 text-2xl font-bold sm:text-3xl ${stat.valueColor}`}
                  >
                    {stat.value}
                  </p>
                </div>

                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-base sm:h-10 sm:w-10 ${stat.iconBg}`}
                >
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Error */}
        {error && (
          <div
            role="alert"
            className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4 sm:mt-6 sm:p-5"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="text-sm font-bold text-red-800">
                  Something went wrong
                </p>

                <p className="mt-1 break-words text-sm leading-6 text-red-700">
                  {error}
                </p>
              </div>

              <button
                type="button"
                onClick={fetchOrders}
                className="min-h-10 w-full shrink-0 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-1 sm:w-auto"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Loading */}
        {isLoading && (
          <div className="mt-5 rounded-2xl border border-gray-200 bg-white px-5 py-14 text-center shadow-sm sm:mt-6 sm:px-6 sm:py-16">
            <div
              className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-amber-600"
              aria-hidden="true"
            />

            <p className="mt-5 text-sm font-semibold text-gray-700">
              Loading orders...
            </p>

            <p className="mt-1 text-xs text-gray-500">
              Please wait while we fetch the latest orders.
            </p>
          </div>
        )}

        {/* Empty */}
        {!isLoading && !error && orders.length === 0 && (
          <div className="mt-5 rounded-2xl border border-gray-200 bg-white px-5 py-14 text-center shadow-sm sm:mt-6 sm:px-6 sm:py-16">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 text-3xl">
              📦
            </div>

            <h2 className="mt-5 text-xl font-bold text-gray-900 sm:text-2xl">
              No Orders Yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-600">
              Customer orders will appear here after they
              place an order from the website.
            </p>

            <button
              type="button"
              onClick={fetchOrders}
              className="mt-6 min-h-10 rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-800 transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-amber-200"
            >
              Refresh Orders
            </button>
          </div>
        )}

        {/* Orders */}
        {!isLoading && orders.length > 0 && (
          <section className="mt-5 space-y-5 sm:mt-6 sm:space-y-6">
            {orders.map((order) => (
              <article
                key={order._id}
                className="min-w-0 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
              >
                {/* Order Header */}
                <div className="border-b border-gray-200 bg-gray-50/80 px-4 py-5 sm:px-6 sm:py-6">
                  <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <h2 className="break-words text-lg font-bold text-gray-900 sm:text-xl">
                          Order #
                          {order._id
                            .slice(-6)
                            .toUpperCase()}
                        </h2>

                        <span
                          className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${getStatusClasses(
                            order.status
                          )}`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${getStatusDotClasses(
                              order.status
                            )}`}
                          />

                          {order.status}
                        </span>
                      </div>

                      <p className="mt-2 break-words text-xs leading-5 text-gray-500 sm:text-sm">
                        Placed on {formatDate(order.createdAt)}
                      </p>
                    </div>

                    <div className="grid w-full gap-2.5 sm:grid-cols-[minmax(0,1fr)_auto] xl:flex xl:w-auto">
                      <div className="relative min-w-0">
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
                          aria-label={`Update status for order ${order._id}`}
                          className="min-h-11 w-full min-w-0 appearance-none rounded-xl border border-gray-300 bg-white px-3 py-2.5 pr-9 text-sm font-semibold text-gray-800 outline-none transition hover:border-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-100 disabled:cursor-not-allowed disabled:bg-gray-100 sm:min-w-[180px]"
                        >
                          {STATUS_OPTIONS.map((status) => (
                            <option
                              key={status}
                              value={status}
                            >
                              {updatingOrderId === order._id &&
                              status === order.status
                                ? "Updating..."
                                : status}
                            </option>
                          ))}
                        </select>

                        <span
                          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500"
                          aria-hidden="true"
                        >
                          ▼
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          handleDeleteOrder(order._id)
                        }
                        disabled={
                          deletingOrderId === order._id
                        }
                        className="min-h-11 w-full rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:border-red-300 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-200 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-60 xl:w-auto"
                      >
                        {deletingOrderId === order._id
                          ? "Deleting..."
                          : "Delete Order"}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Order Content */}
                <div className="p-4 sm:p-6 lg:p-7">
                  <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
                    {/* Customer */}
                    <div className="min-w-0 rounded-xl border border-gray-100 bg-gray-50/70 p-4 sm:p-5">
                      <div className="flex items-center gap-2">
                        <span className="text-base" aria-hidden="true">
                          👤
                        </span>

                        <h3 className="text-xs font-bold uppercase tracking-wide text-gray-500 sm:text-sm">
                          Customer
                        </h3>
                      </div>

                      <div className="mt-4 space-y-2.5">
                        <p className="break-words font-semibold text-gray-900">
                          {order.customer?.name || "-"}
                        </p>

                        <p className="break-words text-sm leading-6 text-gray-600">
                          📞 {order.customer?.mobile || "-"}
                        </p>

                        <p className="text-sm leading-6 text-gray-600">
                          {order.orderType === "Delivery"
                            ? "🚚 Delivery"
                            : "🏪 Pickup"}
                        </p>
                      </div>
                    </div>

                    {/* Address */}
                    <div className="min-w-0 rounded-xl border border-gray-100 bg-gray-50/70 p-4 sm:p-5">
                      <div className="flex items-center gap-2">
                        <span className="text-base" aria-hidden="true">
                          {order.orderType === "Delivery"
                            ? "📍"
                            : "🏪"}
                        </span>

                        <h3 className="text-xs font-bold uppercase tracking-wide text-gray-500 sm:text-sm">
                          {order.orderType === "Delivery"
                            ? "Delivery Address"
                            : "Pickup"}
                        </h3>
                      </div>

                      <div className="mt-4">
                        {order.orderType === "Delivery" ? (
                          <p className="break-words text-sm leading-6 text-gray-700">
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
                        <div className="mt-4 rounded-xl border border-yellow-100 bg-yellow-50 p-3.5">
                          <p className="text-xs font-bold text-yellow-800">
                            Customer Note
                          </p>

                          <p className="mt-1 break-words text-sm leading-6 text-yellow-900">
                            {order.note}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Payment Summary */}
                    <div className="min-w-0 rounded-xl border border-gray-100 bg-gray-50/70 p-4 sm:p-5">
                      <div className="flex items-center gap-2">
                        <span className="text-base" aria-hidden="true">
                          💳
                        </span>

                        <h3 className="text-xs font-bold uppercase tracking-wide text-gray-500 sm:text-sm">
                          Payment Summary
                        </h3>
                      </div>

                      <div className="mt-4 space-y-3 text-sm">
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-gray-600">
                            Subtotal
                          </span>

                          <span className="shrink-0 font-semibold text-gray-900">
                            ₹{formatPrice(order.subtotal)}
                          </span>
                        </div>

                        <div className="flex items-center justify-between gap-4">
                          <span className="text-gray-600">
                            Delivery
                          </span>

                          <span className="shrink-0 font-semibold text-gray-900">
                            {order.deliveryCharge === 0
                              ? "Free"
                              : `₹${formatPrice(
                                  order.deliveryCharge
                                )}`}
                          </span>
                        </div>

                        <div className="border-t border-gray-200 pt-3">
                          <div className="flex items-center justify-between gap-4">
                            <span className="font-bold text-gray-900">
                              Total
                            </span>

                            <span className="shrink-0 text-xl font-bold text-amber-600">
                              ₹
                              {formatPrice(
                                order.totalAmount
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Ordered Items */}
                  <div className="mt-6 border-t border-gray-200 pt-6 sm:mt-7 sm:pt-7">
                    <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h3 className="text-xs font-bold uppercase tracking-wide text-gray-500 sm:text-sm">
                          Ordered Items
                        </h3>

                        <p className="mt-1 text-xs text-gray-400 sm:hidden">
                          Swipe left or right to view the
                          complete table.
                        </p>
                      </div>

                      <p className="hidden text-xs text-gray-400 sm:block">
                        Scroll horizontally if needed
                      </p>
                    </div>

                    <div className="mt-4 overflow-x-auto rounded-xl border border-gray-200">
                      <table className="w-full min-w-[620px] text-left">
                        <thead className="bg-gray-50">
                          <tr className="border-b border-gray-200 text-xs uppercase tracking-wide text-gray-500">
                            <th className="px-4 py-3.5 font-semibold">
                              Item
                            </th>

                            <th className="px-4 py-3.5 font-semibold">
                              Price
                            </th>

                            <th className="px-4 py-3.5 font-semibold">
                              Quantity
                            </th>

                            <th className="px-4 py-3.5 text-right font-semibold">
                              Subtotal
                            </th>
                          </tr>
                        </thead>

                        <tbody>
                          {order.items?.map((item, index) => (
                            <tr
                              key={`${order._id}-${item.menuItemId}-${index}`}
                              className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50/70"
                            >
                              <td className="max-w-[280px] px-4 py-4">
                                <p className="break-words font-semibold text-gray-900">
                                  {item.name}
                                </p>
                              </td>

                              <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-600">
                                ₹{formatPrice(item.price)}
                              </td>

                              <td className="px-4 py-4 text-sm font-medium text-gray-700">
                                {item.quantity}
                              </td>

                              <td className="whitespace-nowrap px-4 py-4 text-right text-sm font-bold text-gray-900">
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
          </section>
        )}
      </main>
    </div>
  );
}

export default AdminOrders;