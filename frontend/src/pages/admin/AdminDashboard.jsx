import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getDashboardStats } from "../../services/adminDashboardService";

const ORDERS_API_URL = "http://localhost:5000/api/orders";

const STATUS_OPTIONS = [
  "Pending",
  "Confirmed",
  "Preparing",
  "Ready",
  "Completed",
  "Cancelled",
];

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalMenus: 0,
    totalGallery: 0,
    totalEnquiries: 0,
    newEnquiries: 0,
  });

  const [orders, setOrders] = useState([]);

  const [orderStats, setOrderStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    preparingOrders: 0,
    completedOrders: 0,
    totalRevenue: 0,
  });

  const [recentOrders, setRecentOrders] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

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
        return {
          badge: "bg-blue-100 text-blue-700",
          bar: "bg-blue-500",
          icon: "🔵",
        };

      case "Preparing":
        return {
          badge: "bg-orange-100 text-orange-700",
          bar: "bg-orange-500",
          icon: "🟠",
        };

      case "Ready":
        return {
          badge: "bg-purple-100 text-purple-700",
          bar: "bg-purple-500",
          icon: "🟣",
        };

      case "Completed":
        return {
          badge: "bg-green-100 text-green-700",
          bar: "bg-green-500",
          icon: "🟢",
        };

      case "Cancelled":
        return {
          badge: "bg-red-100 text-red-700",
          bar: "bg-red-500",
          icon: "🔴",
        };

      case "Pending":
      default:
        return {
          badge: "bg-yellow-100 text-yellow-700",
          bar: "bg-yellow-500",
          icon: "🟡",
        };
    }
  };

  const loadDashboard = async () => {
    try {
      setError("");

      const token = localStorage.getItem("adminToken");

      const [dashboardResult, ordersResponse] =
        await Promise.all([
          getDashboardStats(),

          fetch(ORDERS_API_URL, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

      const ordersResult = await ordersResponse.json();

      if (!ordersResponse.ok) {
        throw new Error(
          ordersResult.message ||
            "Failed to fetch order statistics."
        );
      }

      const fetchedOrders = ordersResult.data || [];

      const activeOrders = fetchedOrders.filter(
        (order) => order.status !== "Cancelled"
      );

      const totalRevenue = activeOrders.reduce(
        (total, order) =>
          total + Number(order.totalAmount || 0),
        0
      );

      const calculatedOrderStats = {
        totalOrders: fetchedOrders.length,

        pendingOrders: fetchedOrders.filter(
          (order) => order.status === "Pending"
        ).length,

        preparingOrders: fetchedOrders.filter(
          (order) => order.status === "Preparing"
        ).length,

        completedOrders: fetchedOrders.filter(
          (order) => order.status === "Completed"
        ).length,

        totalRevenue,
      };

      const latestOrders = [...fetchedOrders]
        .sort(
          (a, b) =>
            new Date(b.createdAt) -
            new Date(a.createdAt)
        )
        .slice(0, 5);

      setStats(dashboardResult);
      setOrders(fetchedOrders);
      setOrderStats(calculatedOrderStats);
      setRecentOrders(latestOrders);
    } catch (error) {
      console.error(
        "Fetch dashboard data error:",
        error
      );

      setError(
        error.message ||
          "Failed to load dashboard data."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const initializeDashboard = async () => {
      try {
        setError("");

        const token = localStorage.getItem("adminToken");

        const [dashboardResult, ordersResponse] =
          await Promise.all([
            getDashboardStats(),

            fetch(ORDERS_API_URL, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }),
          ]);

        const ordersResult = await ordersResponse.json();

        if (!ordersResponse.ok) {
          throw new Error(
            ordersResult.message ||
              "Failed to fetch order statistics."
          );
        }

        const fetchedOrders = ordersResult.data || [];

        const activeOrders = fetchedOrders.filter(
          (order) => order.status !== "Cancelled"
        );

        const totalRevenue = activeOrders.reduce(
          (total, order) =>
            total + Number(order.totalAmount || 0),
          0
        );

        const calculatedOrderStats = {
          totalOrders: fetchedOrders.length,

          pendingOrders: fetchedOrders.filter(
            (order) => order.status === "Pending"
          ).length,

          preparingOrders: fetchedOrders.filter(
            (order) => order.status === "Preparing"
          ).length,

          completedOrders: fetchedOrders.filter(
            (order) => order.status === "Completed"
          ).length,

          totalRevenue,
        };

        const latestOrders = [...fetchedOrders]
          .sort(
            (a, b) =>
              new Date(b.createdAt) -
              new Date(a.createdAt)
          )
          .slice(0, 5);

        if (isMounted) {
          setStats(dashboardResult);
          setOrders(fetchedOrders);
          setOrderStats(calculatedOrderStats);
          setRecentOrders(latestOrders);
          setIsLoading(false);
        }
      } catch (error) {
        console.error(
          "Fetch dashboard data error:",
          error
        );

        if (isMounted) {
          setError(
            error.message ||
              "Failed to load dashboard data."
          );
          setIsLoading(false);
        }
      }
    };

    initializeDashboard();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleRefresh = async () => {
    setIsLoading(true);
    await loadDashboard();
  };

  const statusAnalytics = useMemo(() => {
    return STATUS_OPTIONS.map((status) => {
      const count = orders.filter(
        (order) => order.status === status
      ).length;

      const percentage =
        orders.length > 0
          ? Math.round((count / orders.length) * 100)
          : 0;

      return {
        status,
        count,
        percentage,
      };
    });
  }, [orders]);

  const cancelledOrders = orders.filter(
    (order) => order.status === "Cancelled"
  ).length;

  const nonCancelledOrders = orders.filter(
    (order) => order.status !== "Cancelled"
  ).length;

  const completionRate =
    nonCancelledOrders > 0
      ? Math.round(
          (orderStats.completedOrders /
            nonCancelledOrders) *
            100
        )
      : 0;

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-amber-600">
              CaféNest Admin
            </p>

            <h1 className="mt-1 text-2xl font-bold text-gray-900 sm:text-3xl">
              Dashboard
            </h1>

            <p className="mt-2 text-sm text-gray-600">
              Manage your cafe website, menu and customer
              orders.
            </p>
          </div>

          <button
            type="button"
            onClick={handleRefresh}
            disabled={isLoading}
            className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-800 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading
              ? "Refreshing..."
              : "Refresh Dashboard"}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-6 flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-medium text-red-700">
              {error}
            </p>

            <button
              type="button"
              onClick={handleRefresh}
              className="w-fit rounded-lg bg-red-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Website Statistics */}
        <section className="mt-8">
          <h2 className="text-lg font-bold text-gray-900">
            Website Overview
          </h2>

          <div className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {/* Menu */}
            <Link
              to="/admin/menu"
              className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-orange-100 text-xl">
                  🍽️
                </div>

                <span className="text-xs font-semibold text-gray-400">
                  MENU
                </span>
              </div>

              <p className="mt-5 text-sm text-gray-500">
                Total Menu Items
              </p>

              <p className="mt-1 text-2xl font-bold text-gray-900">
                {stats.totalMenus}
              </p>
            </Link>

            {/* Gallery */}
            <Link
              to="/admin/gallery"
              className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-purple-100 text-xl">
                  🖼️
                </div>

                <span className="text-xs font-semibold text-gray-400">
                  GALLERY
                </span>
              </div>

              <p className="mt-5 text-sm text-gray-500">
                Gallery Items
              </p>

              <p className="mt-1 text-2xl font-bold text-gray-900">
                {stats.totalGallery}
              </p>
            </Link>

            {/* Enquiries */}
            <Link
              to="/admin/enquiries"
              className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-100 text-xl">
                  📩
                </div>

                <span className="text-xs font-semibold text-gray-400">
                  ENQUIRIES
                </span>
              </div>

              <p className="mt-5 text-sm text-gray-500">
                Total Enquiries
              </p>

              <p className="mt-1 text-2xl font-bold text-gray-900">
                {stats.totalEnquiries}
              </p>
            </Link>

            {/* New Enquiries */}
            <Link
              to="/admin/enquiries"
              className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-green-100 text-xl">
                  📨
                </div>

                <span className="text-xs font-semibold text-gray-400">
                  NEW
                </span>
              </div>

              <p className="mt-5 text-sm text-gray-500">
                New Enquiries
              </p>

              <p className="mt-1 text-2xl font-bold text-gray-900">
                {stats.newEnquiries}
              </p>
            </Link>
          </div>
        </section>

        {/* Order Statistics */}
        <section className="mt-10">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Order Overview
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Live statistics from customer orders.
              </p>
            </div>

            <Link
              to="/admin/orders"
              className="text-sm font-semibold text-amber-600 hover:text-amber-700"
            >
              View All Orders →
            </Link>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
            {/* Total Orders */}
            <Link
              to="/admin/orders"
              className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-100 text-xl">
                📦
              </div>

              <p className="mt-5 text-sm text-gray-500">
                Total Orders
              </p>

              <p className="mt-1 text-2xl font-bold text-gray-900">
                {orderStats.totalOrders}
              </p>
            </Link>

            {/* Pending */}
            <Link
              to="/admin/orders"
              className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-yellow-100 text-xl">
                ⏳
              </div>

              <p className="mt-5 text-sm text-gray-500">
                Pending Orders
              </p>

              <p className="mt-1 text-2xl font-bold text-yellow-600">
                {orderStats.pendingOrders}
              </p>
            </Link>

            {/* Preparing */}
            <Link
              to="/admin/orders"
              className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-orange-100 text-xl">
                👨‍🍳
              </div>

              <p className="mt-5 text-sm text-gray-500">
                Preparing
              </p>

              <p className="mt-1 text-2xl font-bold text-orange-600">
                {orderStats.preparingOrders}
              </p>
            </Link>

            {/* Completed */}
            <Link
              to="/admin/orders"
              className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-green-100 text-xl">
                ✅
              </div>

              <p className="mt-5 text-sm text-gray-500">
                Completed
              </p>

              <p className="mt-1 text-2xl font-bold text-green-600">
                {orderStats.completedOrders}
              </p>
            </Link>

            {/* Revenue */}
            <div className="col-span-2 rounded-xl border border-gray-200 bg-white p-5 shadow-sm md:col-span-1">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-100 text-xl">
                💰
              </div>

              <p className="mt-5 text-sm text-gray-500">
                Total Revenue
              </p>

              <p className="mt-1 text-2xl font-bold text-emerald-600">
                ₹{formatPrice(orderStats.totalRevenue)}
              </p>
            </div>
          </div>
        </section>

        {/* Order Analytics */}
        <section className="mt-10">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Order Analytics
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Current distribution of customer orders by
              status.
            </p>
          </div>

          <div className="mt-4 grid gap-6 lg:grid-cols-3">
            {/* Status Distribution */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6 lg:col-span-2">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-gray-900">
                    Order Status
                  </h3>

                  <p className="mt-1 text-xs text-gray-500">
                    {orders.length} total orders
                  </p>
                </div>

                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
                  Live
                </span>
              </div>

              <div className="mt-6 space-y-5">
                {statusAnalytics.map((item) => {
                  const statusStyle =
                    getStatusClasses(item.status);

                  return (
                    <div key={item.status}>
                      <div className="mb-2 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                          <span>
                            {statusStyle.icon}
                          </span>

                          <span className="text-sm font-semibold text-gray-800">
                            {item.status}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-gray-900">
                            {item.count}
                          </span>

                          <span className="text-xs text-gray-500">
                            ({item.percentage}%)
                          </span>
                        </div>
                      </div>

                      <div className="h-2.5 overflow-hidden rounded-full bg-gray-100">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${statusStyle.bar}`}
                          style={{
                            width: `${item.percentage}%`,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Performance Summary */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
              <h3 className="font-bold text-gray-900">
                Performance Summary
              </h3>

              <p className="mt-1 text-xs text-gray-500">
                Overview of current order performance.
              </p>

              <div className="mt-6 space-y-5">
                {/* Completion Rate */}
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      Completion Rate
                    </span>

                    <span className="font-bold text-green-600">
                      {completionRate}%
                    </span>
                  </div>

                  <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="h-full rounded-full bg-green-500 transition-all duration-500"
                      style={{
                        width: `${completionRate}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Active Orders */}
                <div className="rounded-xl bg-amber-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">
                    Active Orders
                  </p>

                  <p className="mt-1 text-2xl font-bold text-amber-900">
                    {nonCancelledOrders}
                  </p>

                  <p className="mt-1 text-xs text-amber-700">
                    Orders excluding cancelled orders
                  </p>
                </div>

                {/* Cancelled */}
                <div className="rounded-xl bg-red-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-red-700">
                    Cancelled Orders
                  </p>

                  <p className="mt-1 text-2xl font-bold text-red-900">
                    {cancelledOrders}
                  </p>

                  <p className="mt-1 text-xs text-red-700">
                    Total cancelled orders
                  </p>
                </div>

                {/* Average Order */}
                <div className="rounded-xl bg-emerald-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                    Average Order Value
                  </p>

                  <p className="mt-1 text-2xl font-bold text-emerald-900">
                    ₹
                    {formatPrice(
                      nonCancelledOrders > 0
                        ? orderStats.totalRevenue /
                            nonCancelledOrders
                        : 0
                    )}
                  </p>

                  <p className="mt-1 text-xs text-emerald-700">
                    Based on active orders
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Recent Orders */}
        <section className="mt-10">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Recent Orders
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Latest customer orders.
              </p>
            </div>

            <Link
              to="/admin/orders"
              className="text-sm font-semibold text-amber-600 hover:text-amber-700"
            >
              Manage Orders →
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div className="mt-4 rounded-xl border border-gray-200 bg-white px-6 py-12 text-center shadow-sm">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-2xl">
                📦
              </div>

              <h3 className="mt-4 font-bold text-gray-900">
                No Orders Yet
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                New customer orders will appear here.
              </p>
            </div>
          ) : (
            <div className="mt-4 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[700px] text-left">
                  <thead className="border-b border-gray-200 bg-gray-50">
                    <tr className="text-xs uppercase tracking-wide text-gray-500">
                      <th className="px-5 py-4 font-semibold">
                        Order
                      </th>

                      <th className="px-5 py-4 font-semibold">
                        Customer
                      </th>

                      <th className="px-5 py-4 font-semibold">
                        Type
                      </th>

                      <th className="px-5 py-4 font-semibold">
                        Status
                      </th>

                      <th className="px-5 py-4 text-right font-semibold">
                        Total
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {recentOrders.map((order) => {
                      const statusStyle =
                        getStatusClasses(
                          order.status
                        );

                      return (
                        <tr
                          key={order._id}
                          className="border-b border-gray-100 last:border-b-0"
                        >
                          <td className="px-5 py-4">
                            <p className="font-semibold text-gray-900">
                              #
                              {order._id
                                .slice(-6)
                                .toUpperCase()}
                            </p>

                            <p className="mt-1 text-xs text-gray-500">
                              {formatDate(
                                order.createdAt
                              )}
                            </p>
                          </td>

                          <td className="px-5 py-4">
                            <p className="font-medium text-gray-900">
                              {order.customer?.name ||
                                "-"}
                            </p>

                            <p className="mt-1 text-xs text-gray-500">
                              {order.customer?.mobile ||
                                "-"}
                            </p>
                          </td>

                          <td className="px-5 py-4 text-sm text-gray-600">
                            {order.orderType}
                          </td>

                          <td className="px-5 py-4">
                            <span
                              className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusStyle.badge}`}
                            >
                              {order.status}
                            </span>
                          </td>

                          <td className="px-5 py-4 text-right font-semibold text-gray-900">
                            ₹
                            {formatPrice(
                              order.totalAmount
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default AdminDashboard;