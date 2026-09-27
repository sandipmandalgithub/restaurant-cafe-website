import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { getDashboardStats } from "../../services/adminDashboardService";

const ORDERS_API_URL = "http://localhost:5000/api/orders";
const ORDER_STATISTICS_API_URL =
  "http://localhost:5000/api/orders/statistics";
const ENQUIRIES_API_URL =
  "http://localhost:5000/api/enquiries";

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
    confirmedOrders: 0,
    preparingOrders: 0,
    readyOrders: 0,
    completedOrders: 0,
    cancelledOrders: 0,
    totalRevenue: 0,
    completedRevenue: 0,
    averageOrderValue: 0,
    deliveryOrders: 0,
    pickupOrders: 0,
  });

  const [bestSellingItems, setBestSellingItems] = useState([]);
  const [revenueByDate, setRevenueByDate] = useState([]);

  const [recentOrders, setRecentOrders] = useState([]);

  const [enquiryStats, setEnquiryStats] = useState({
    total: 0,
    new: 0,
    contacted: 0,
    resolved: 0,
  });

  const [recentEnquiries, setRecentEnquiries] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

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

  const formatShortDate = (date) => {
    if (!date) {
      return "-";
    }

    const parsedDate = new Date(`${date}T00:00:00`);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return new Intl.DateTimeFormat("en-IN", {
      day: "numeric",
      month: "short",
    }).format(parsedDate);
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
    /*
     * Important:
     * Wait for the current call stack to finish before updating state.
     * This prevents React's "Calling setState synchronously within an effect"
     * warning when this function is triggered from useEffect.
     */
    await Promise.resolve();

    try {
      setIsLoading(true);
      setError("");

      const token = localStorage.getItem("adminToken");

      const authHeaders = {
        "Content-Type": "application/json",
        ...(token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {}),
      };

      const [
        dashboardResult,
        ordersResponse,
        orderStatisticsResponse,
        enquiriesResponse,
      ] = await Promise.all([
        getDashboardStats(),

        fetch(ORDERS_API_URL, {
          method: "GET",
          headers: authHeaders,
        }),

        fetch(ORDER_STATISTICS_API_URL, {
          method: "GET",
          headers: authHeaders,
        }),

        fetch(ENQUIRIES_API_URL, {
          method: "GET",
          headers: authHeaders,
        }),
      ]);

      const ordersResult = await ordersResponse.json();

      const orderStatisticsResult =
        await orderStatisticsResponse.json();

      const enquiriesResult = await enquiriesResponse.json();

      if (!ordersResponse.ok) {
        throw new Error(
          ordersResult.message || "Failed to fetch orders."
        );
      }

      if (!orderStatisticsResponse.ok) {
        throw new Error(
          orderStatisticsResult.message ||
            "Failed to fetch order statistics."
        );
      }

      if (!enquiriesResponse.ok) {
        throw new Error(
          enquiriesResult.message ||
            "Failed to fetch enquiry statistics."
        );
      }

      const fetchedOrders = Array.isArray(ordersResult.data)
        ? ordersResult.data
        : [];

      const fetchedEnquiries = Array.isArray(
        enquiriesResult.data
      )
        ? enquiriesResult.data
        : [];

      const statisticsData = orderStatisticsResult?.data || {};

      const statisticsSummary =
        statisticsData?.summary || {};

      const fetchedBestSellingItems = Array.isArray(
        statisticsData?.bestSellingItems
      )
        ? statisticsData.bestSellingItems
        : [];

      const fetchedRevenueByDate = Array.isArray(
        statisticsData?.revenueByDate
      )
        ? statisticsData.revenueByDate
        : [];

      const latestOrders = [...fetchedOrders]
        .sort(
          (a, b) =>
            new Date(b.createdAt) - new Date(a.createdAt)
        )
        .slice(0, 5);

      const calculatedEnquiryStats = {
        total: fetchedEnquiries.length,

        new: fetchedEnquiries.filter(
          (enquiry) => enquiry.status === "New"
        ).length,

        contacted: fetchedEnquiries.filter(
          (enquiry) => enquiry.status === "Contacted"
        ).length,

        resolved: fetchedEnquiries.filter(
          (enquiry) => enquiry.status === "Resolved"
        ).length,
      };

      const latestEnquiries = [...fetchedEnquiries]
        .sort(
          (a, b) =>
            new Date(b.createdAt) - new Date(a.createdAt)
        )
        .slice(0, 5);

      setStats({
        totalMenus: Number(
          dashboardResult?.totalMenus || 0
        ),

        totalGallery: Number(
          dashboardResult?.totalGallery || 0
        ),

        totalEnquiries: calculatedEnquiryStats.total,

        newEnquiries: calculatedEnquiryStats.new,
      });

      setOrders(fetchedOrders);

      setOrderStats({
        totalOrders: Number(
          statisticsSummary.totalOrders || 0
        ),

        pendingOrders: Number(
          statisticsSummary.pendingOrders || 0
        ),

        confirmedOrders: Number(
          statisticsSummary.confirmedOrders || 0
        ),

        preparingOrders: Number(
          statisticsSummary.preparingOrders || 0
        ),

        readyOrders: Number(
          statisticsSummary.readyOrders || 0
        ),

        completedOrders: Number(
          statisticsSummary.completedOrders || 0
        ),

        cancelledOrders: Number(
          statisticsSummary.cancelledOrders || 0
        ),

        totalRevenue: Number(
          statisticsSummary.totalRevenue || 0
        ),

        completedRevenue: Number(
          statisticsSummary.completedRevenue || 0
        ),

        averageOrderValue: Number(
          statisticsSummary.averageOrderValue || 0
        ),

        deliveryOrders: Number(
          statisticsSummary.deliveryOrders || 0
        ),

        pickupOrders: Number(
          statisticsSummary.pickupOrders || 0
        ),
      });

      setBestSellingItems(fetchedBestSellingItems);
      setRevenueByDate(fetchedRevenueByDate);
      setRecentOrders(latestOrders);
      setEnquiryStats(calculatedEnquiryStats);
      setRecentEnquiries(latestEnquiries);
    } catch (error) {
      console.error("Fetch dashboard data error:", error);

      setError(
        error.message || "Failed to load dashboard data."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const initializeDashboard = async () => {
      await Promise.resolve();

      if (!isMounted) {
        return;
      }

      await loadDashboard();
    };

    initializeDashboard();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleRefresh = async () => {
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

  const cancelledOrders = Number(
    orderStats.cancelledOrders || 0
  );

  const nonCancelledOrders = Math.max(
    Number(orderStats.totalOrders || 0) -
      cancelledOrders,
    0
  );

  const completionRate =
    nonCancelledOrders > 0
      ? Math.round(
          (orderStats.completedOrders /
            nonCancelledOrders) *
            100
        )
      : 0;

  const maxRevenue = useMemo(() => {
    if (revenueByDate.length === 0) {
      return 0;
    }

    return Math.max(
      ...revenueByDate.map((item) =>
        Number(item.revenue || 0)
      ),
      0
    );
  }, [revenueByDate]);

  const maxItemQuantity = useMemo(() => {
    if (bestSellingItems.length === 0) {
      return 0;
    }

    return Math.max(
      ...bestSellingItems.map((item) =>
        Number(item.quantity || 0)
      ),
      0
    );
  }, [bestSellingItems]);

  return (
    <div className="min-h-screen overflow-hidden bg-gray-50 px-3 py-5 sm:px-5 sm:py-6 lg:px-8 lg:py-8">
      <div className="mx-auto w-full max-w-7xl min-w-0">
        {/* Header */}
        <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-wider text-amber-600 sm:text-sm">
              CaféNest Admin
            </p>

            <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              Dashboard
            </h1>

            <p className="mt-2 max-w-2xl break-words text-sm leading-6 text-gray-600">
              Manage your cafe website, menu and customer
              orders.
            </p>
          </div>

          <button
            type="button"
            onClick={handleRefresh}
            disabled={isLoading}
            className="min-h-11 w-full shrink-0 rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-800 shadow-sm transition hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-amber-100 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            {isLoading
              ? "Refreshing..."
              : "Refresh Dashboard"}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-6 flex min-w-0 flex-col gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="min-w-0 break-words text-sm font-medium leading-5 text-red-700">
              {error}
            </p>

            <button
              type="button"
              onClick={handleRefresh}
              disabled={isLoading}
              className="min-h-10 w-full shrink-0 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-100 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Loading Skeleton */}
        {isLoading && orders.length === 0 ? (
          <div className="mt-8 space-y-8">
            <div>
              <div className="h-5 w-40 animate-pulse rounded bg-gray-200" />

              <div className="mt-4 grid grid-cols-1 gap-4 min-[375px]:grid-cols-2 lg:grid-cols-4">
                {[1, 2, 3, 4].map((item) => (
                  <div
                    key={item}
                    className="h-36 animate-pulse rounded-xl bg-white shadow-sm"
                  />
                ))}
              </div>
            </div>

            <div>
              <div className="h-5 w-40 animate-pulse rounded bg-gray-200" />

              <div className="mt-4 grid grid-cols-1 gap-4 min-[375px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
                {[1, 2, 3, 4, 5].map((item) => (
                  <div
                    key={item}
                    className="h-36 animate-pulse rounded-xl bg-white shadow-sm"
                  />
                ))}
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Quick Actions */}
            <section className="mt-8 sm:mt-10">
              <div>
                <h2 className="text-lg font-bold text-gray-900 sm:text-xl">
                  Quick Actions
                </h2>

                <p className="mt-1 break-words text-sm leading-6 text-gray-500">
                  Quickly manage important parts of your
                  cafe website.
                </p>
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Link
                  to="/admin/menu"
                  className="group min-w-0 rounded-2xl border border-orange-200 bg-orange-50 p-5 transition hover:-translate-y-0.5 hover:border-orange-300 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-orange-100"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-2xl">🍽️</span>

                    <span className="text-xl transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </div>

                  <h3 className="mt-4 font-bold text-gray-900">
                    Manage Menu
                  </h3>

                  <p className="mt-1 break-words text-sm leading-5 text-gray-600">
                    Add, edit or manage food items.
                  </p>
                </Link>

                <Link
                  to="/admin/orders"
                  className="group min-w-0 rounded-2xl border border-blue-200 bg-blue-50 p-5 transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-blue-100"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-2xl">📦</span>

                    <span className="text-xl transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </div>

                  <h3 className="mt-4 font-bold text-gray-900">
                    Manage Orders
                  </h3>

                  <p className="mt-1 break-words text-sm leading-5 text-gray-600">
                    Review and update customer orders.
                  </p>
                </Link>

                <Link
                  to="/admin/enquiries"
                  className="group min-w-0 rounded-2xl border border-green-200 bg-green-50 p-5 transition hover:-translate-y-0.5 hover:border-green-300 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-green-100"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-2xl">📩</span>

                    <span className="text-xl transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </div>

                  <h3 className="mt-4 font-bold text-gray-900">
                    View Enquiries
                  </h3>

                  <p className="mt-1 break-words text-sm leading-5 text-gray-600">
                    Check customer enquiries and messages.
                  </p>
                </Link>

                <Link
                  to="/admin/gallery"
                  className="group min-w-0 rounded-2xl border border-purple-200 bg-purple-50 p-5 transition hover:-translate-y-0.5 hover:border-purple-300 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-purple-100"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-2xl">🖼️</span>

                    <span className="text-xl transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </div>

                  <h3 className="mt-4 font-bold text-gray-900">
                    Manage Gallery
                  </h3>

                  <p className="mt-1 break-words text-sm leading-5 text-gray-600">
                    Update restaurant gallery images.
                  </p>
                </Link>
              </div>
            </section>

            {/* Website Statistics */}
            <section className="mt-10">
              <h2 className="text-lg font-bold text-gray-900 sm:text-xl">
                Website Overview
              </h2>

              <div className="mt-4 grid grid-cols-1 gap-4 min-[375px]:grid-cols-2 lg:grid-cols-4">
                <Link
                  to="/admin/menu"
                  className="min-w-0 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-gray-100"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-xl">
                      🍽️
                    </div>

                    <span className="text-[10px] font-bold tracking-wide text-gray-400 sm:text-xs">
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

                <Link
                  to="/admin/gallery"
                  className="min-w-0 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-gray-100"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-100 text-xl">
                      🖼️
                    </div>

                    <span className="text-[10px] font-bold tracking-wide text-gray-400 sm:text-xs">
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

                <Link
                  to="/admin/enquiries"
                  className="min-w-0 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-gray-100"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-xl">
                      📩
                    </div>

                    <span className="text-[10px] font-bold tracking-wide text-gray-400 sm:text-xs">
                      ENQUIRIES
                    </span>
                  </div>

                  <p className="mt-5 text-sm text-gray-500">
                    Total Enquiries
                  </p>

                  <p className="mt-1 text-2xl font-bold text-gray-900">
                    {enquiryStats.total}
                  </p>
                </Link>

                <Link
                  to="/admin/enquiries"
                  className="min-w-0 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-gray-100"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-100 text-xl">
                      📨
                    </div>

                    <span className="text-[10px] font-bold tracking-wide text-gray-400 sm:text-xs">
                      NEW
                    </span>
                  </div>

                  <p className="mt-5 text-sm text-gray-500">
                    New Enquiries
                  </p>

                  <p className="mt-1 text-2xl font-bold text-green-600">
                    {enquiryStats.new}
                  </p>
                </Link>
              </div>
            </section>

            {/* Order Statistics */}
            <section className="mt-10">
              <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div className="min-w-0">
                  <h2 className="text-lg font-bold text-gray-900 sm:text-xl">
                    Order Overview
                  </h2>

                  <p className="mt-1 break-words text-sm leading-6 text-gray-500">
                    Live statistics from customer orders.
                  </p>
                </div>

                <Link
                  to="/admin/orders"
                  className="inline-flex min-h-10 w-fit items-center font-semibold text-amber-600 focus:outline-none focus:ring-4 focus:ring-amber-100"
                >
                  <span className="text-sm">
                    View All Orders →
                  </span>
                </Link>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-4 min-[375px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
                <Link
                  to="/admin/orders"
                  className="min-w-0 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-gray-100"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-xl">
                    📦
                  </div>

                  <p className="mt-5 text-sm text-gray-500">
                    Total Orders
                  </p>

                  <p className="mt-1 text-2xl font-bold text-gray-900">
                    {orderStats.totalOrders}
                  </p>
                </Link>

                <Link
                  to="/admin/orders"
                  className="min-w-0 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-gray-100"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-yellow-100 text-xl">
                    ⏳
                  </div>

                  <p className="mt-5 text-sm text-gray-500">
                    Pending Orders
                  </p>

                  <p className="mt-1 text-2xl font-bold text-yellow-600">
                    {orderStats.pendingOrders}
                  </p>
                </Link>

                <Link
                  to="/admin/orders"
                  className="min-w-0 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-gray-100"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-100 text-xl">
                    👨‍🍳
                  </div>

                  <p className="mt-5 text-sm text-gray-500">
                    Preparing
                  </p>

                  <p className="mt-1 text-2xl font-bold text-orange-600">
                    {orderStats.preparingOrders}
                  </p>
                </Link>

                <Link
                  to="/admin/orders"
                  className="min-w-0 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-gray-100"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-xl">
                    ✅
                  </div>

                  <p className="mt-5 text-sm text-gray-500">
                    Completed
                  </p>

                  <p className="mt-1 text-2xl font-bold text-green-600">
                    {orderStats.completedOrders}
                  </p>
                </Link>

                <div className="min-w-0 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm min-[375px]:col-span-2 md:col-span-1">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-xl">
                    💰
                  </div>

                  <p className="mt-5 text-sm text-gray-500">
                    Total Revenue
                  </p>

                  <p className="mt-1 break-words text-2xl font-bold text-emerald-600">
                    ₹{formatPrice(orderStats.totalRevenue)}
                  </p>
                </div>
              </div>
            </section>

            {/* Revenue & Best Selling Analytics */}
            <section className="mt-10">
              <div>
                <h2 className="text-lg font-bold text-gray-900 sm:text-xl">
                  Revenue & Best-Selling Analytics
                </h2>

                <p className="mt-1 break-words text-sm leading-6 text-gray-500">
                  Revenue trends and the most ordered menu
                  items.
                </p>
              </div>

              <div className="mt-4 grid min-w-0 gap-6 xl:grid-cols-3">
                {/* Revenue Overview */}
                <div className="min-w-0 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6 xl:col-span-2">
                  <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <h3 className="font-bold text-gray-900">
                        Revenue Overview
                      </h3>

                      <p className="mt-1 break-words text-xs leading-5 text-gray-500">
                        Revenue from non-cancelled orders.
                      </p>
                    </div>

                    <div className="w-fit shrink-0 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                      ₹{formatPrice(orderStats.totalRevenue)}
                    </div>
                  </div>

                  {revenueByDate.length === 0 ? (
                    <div className="mt-6 flex min-h-[250px] items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-50 px-5 text-center sm:min-h-[280px]">
                      <div className="max-w-sm">
                        <div className="text-4xl">📈</div>

                        <p className="mt-3 font-semibold text-gray-700">
                          No revenue data yet
                        </p>

                        <p className="mt-1 text-sm leading-5 text-gray-500">
                          Revenue data will appear here
                          after orders are placed.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-6 min-w-0 overflow-x-auto pb-2">
                      <div className="flex h-[280px] min-w-max items-end gap-3 px-1 sm:gap-4">
                        {revenueByDate.map((item) => {
                          const revenue = Number(
                            item.revenue || 0
                          );

                          const height =
                            maxRevenue > 0
                              ? Math.max(
                                  (revenue / maxRevenue) *
                                    100,
                                  4
                                )
                              : 4;

                          return (
                            <div
                              key={item.date}
                              className="flex h-full w-14 shrink-0 flex-col justify-end sm:w-16"
                            >
                              <div className="mb-2 text-center">
                                <p className="truncate text-[10px] font-semibold text-gray-600 sm:text-xs">
                                  ₹{formatPrice(revenue)}
                                </p>
                              </div>

                              <div className="flex h-[190px] items-end justify-center">
                                <div
                                  className="w-8 rounded-t-lg bg-emerald-500 transition-all duration-500 hover:bg-emerald-600 sm:w-10"
                                  style={{
                                    height: `${height}%`,
                                  }}
                                  title={`${formatShortDate(
                                    item.date
                                  )}: ₹${formatPrice(
                                    revenue
                                  )}`}
                                />
                              </div>

                              <p className="mt-2 truncate text-center text-[10px] font-medium text-gray-500 sm:text-xs">
                                {formatShortDate(item.date)}
                              </p>

                              <p className="mt-1 text-center text-[10px] text-gray-400">
                                {item.orders}{" "}
                                {Number(item.orders) === 1
                                  ? "order"
                                  : "orders"}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Best Selling */}
                <div className="min-w-0 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
                  <div>
                    <h3 className="font-bold text-gray-900">
                      Best-Selling Items
                    </h3>

                    <p className="mt-1 break-words text-xs leading-5 text-gray-500">
                      Top menu items by quantity sold.
                    </p>
                  </div>

                  {bestSellingItems.length === 0 ? (
                    <div className="mt-6 rounded-xl border border-dashed border-gray-200 bg-gray-50 px-5 py-12 text-center">
                      <div className="text-4xl">🏆</div>

                      <p className="mt-3 font-semibold text-gray-700">
                        No sales data yet
                      </p>

                      <p className="mt-1 text-sm leading-5 text-gray-500">
                        Best-selling items will appear
                        here.
                      </p>
                    </div>
                  ) : (
                    <div className="mt-5 space-y-4">
                      {bestSellingItems
                        .slice(0, 5)
                        .map((item, index) => {
                          const quantity = Number(
                            item.quantity || 0
                          );

                          const percentage =
                            maxItemQuantity > 0
                              ? Math.round(
                                  (quantity /
                                    maxItemQuantity) *
                                    100
                                )
                              : 0;

                          return (
                            <div
                              key={
                                item.menuItemId ||
                                `${item.name}-${index}`
                              }
                            >
                              <div className="flex min-w-0 items-center gap-3">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-sm font-bold text-amber-700">
                                  {index + 1}
                                </div>

                                <div className="min-w-0 flex-1">
                                  <div className="flex min-w-0 items-start justify-between gap-3">
                                    <p className="min-w-0 truncate text-sm font-semibold text-gray-800">
                                      {item.name}
                                    </p>

                                    <p className="shrink-0 text-sm font-bold text-gray-900">
                                      {quantity}
                                    </p>
                                  </div>

                                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100">
                                    <div
                                      className="h-full rounded-full bg-amber-500 transition-all duration-500"
                                      style={{
                                        width: `${percentage}%`,
                                      }}
                                    />
                                  </div>

                                  <div className="mt-1 flex items-center justify-between gap-2">
                                    <span className="text-[10px] text-gray-400">
                                      {quantity}{" "}
                                      {quantity === 1
                                        ? "unit"
                                        : "units"}{" "}
                                      sold
                                    </span>

                                    <span className="shrink-0 text-[10px] font-semibold text-gray-500">
                                      ₹
                                      {formatPrice(
                                        item.revenue
                                      )}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* Order Analytics */}
            <section className="mt-10">
              <div>
                <h2 className="text-lg font-bold text-gray-900 sm:text-xl">
                  Order Analytics
                </h2>

                <p className="mt-1 break-words text-sm leading-6 text-gray-500">
                  Current distribution of customer orders by
                  status.
                </p>
              </div>

              <div className="mt-4 grid min-w-0 gap-6 lg:grid-cols-3">
                {/* Status Distribution */}
                <div className="min-w-0 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6 lg:col-span-2">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="font-bold text-gray-900">
                        Order Status
                      </h3>

                      <p className="mt-1 text-xs text-gray-500">
                        {orders.length} total orders
                      </p>
                    </div>

                    <span className="shrink-0 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-600">
                      Live
                    </span>
                  </div>

                  <div className="mt-6 space-y-5">
                    {statusAnalytics.map((item) => {
                      const statusStyle =
                        getStatusClasses(item.status);

                      return (
                        <div key={item.status}>
                          <div className="mb-2 flex items-center justify-between gap-3">
                            <div className="flex min-w-0 items-center gap-2">
                              <span className="shrink-0">
                                {statusStyle.icon}
                              </span>

                              <span className="truncate text-sm font-semibold text-gray-800">
                                {item.status}
                              </span>
                            </div>

                            <div className="flex shrink-0 items-center gap-2">
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
                <div className="min-w-0 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
                  <h3 className="font-bold text-gray-900">
                    Performance Summary
                  </h3>

                  <p className="mt-1 break-words text-xs leading-5 text-gray-500">
                    Overview of current order performance.
                  </p>

                  <div className="mt-6 space-y-5">
                    {/* Completion Rate */}
                    <div>
                      <div className="flex items-center justify-between gap-3">
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

                      <p className="mt-1 text-xs leading-5 text-amber-700">
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

                      <p className="mt-1 text-xs leading-5 text-red-700">
                        Total cancelled orders
                      </p>
                    </div>

                    {/* Average Order */}
                    <div className="rounded-xl bg-emerald-50 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                        Average Order Value
                      </p>

                      <p className="mt-1 break-words text-2xl font-bold text-emerald-900">
                        ₹
                        {formatPrice(
                          orderStats.averageOrderValue
                        )}
                      </p>

                      <p className="mt-1 text-xs leading-5 text-emerald-700">
                        Based on non-cancelled orders
                      </p>
                    </div>

                    {/* Delivery / Pickup */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-xl bg-blue-50 p-4">
                        <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
                          Delivery
                        </p>

                        <p className="mt-1 text-xl font-bold text-blue-900">
                          {orderStats.deliveryOrders}
                        </p>
                      </div>

                      <div className="rounded-xl bg-purple-50 p-4">
                        <p className="text-xs font-semibold uppercase tracking-wide text-purple-700">
                          Pickup
                        </p>

                        <p className="mt-1 text-xl font-bold text-purple-900">
                          {orderStats.pickupOrders}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Enquiry Statistics */}
            <section className="mt-10">
              <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div className="min-w-0">
                  <h2 className="text-lg font-bold text-gray-900 sm:text-xl">
                    Enquiry Overview
                  </h2>

                  <p className="mt-1 break-words text-sm leading-6 text-gray-500">
                    Current customer enquiry status.
                  </p>
                </div>

                <Link
                  to="/admin/enquiries"
                  className="inline-flex min-h-10 w-fit items-center font-semibold text-amber-600 focus:outline-none focus:ring-4 focus:ring-amber-100"
                >
                  <span className="text-sm">
                    Manage Enquiries →
                  </span>
                </Link>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-4 min-[375px]:grid-cols-2 md:grid-cols-4">
                <Link
                  to="/admin/enquiries"
                  className="min-w-0 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-gray-100"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-xl">
                    📩
                  </div>

                  <p className="mt-5 text-sm text-gray-500">
                    Total
                  </p>

                  <p className="mt-1 text-2xl font-bold text-gray-900">
                    {enquiryStats.total}
                  </p>
                </Link>

                <Link
                  to="/admin/enquiries"
                  className="min-w-0 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-gray-100"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-yellow-100 text-xl">
                    📨
                  </div>

                  <p className="mt-5 text-sm text-gray-500">
                    New
                  </p>

                  <p className="mt-1 text-2xl font-bold text-yellow-600">
                    {enquiryStats.new}
                  </p>
                </Link>

                <Link
                  to="/admin/enquiries"
                  className="min-w-0 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-gray-100"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-xl">
                    📞
                  </div>

                  <p className="mt-5 text-sm text-gray-500">
                    Contacted
                  </p>

                  <p className="mt-1 text-2xl font-bold text-blue-600">
                    {enquiryStats.contacted}
                  </p>
                </Link>

                <Link
                  to="/admin/enquiries"
                  className="min-w-0 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-gray-100"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-xl">
                    ✅
                  </div>

                  <p className="mt-5 text-sm text-gray-500">
                    Resolved
                  </p>

                  <p className="mt-1 text-2xl font-bold text-green-600">
                    {enquiryStats.resolved}
                  </p>
                </Link>
              </div>
            </section>

            {/* Recent Enquiries */}
            <section className="mt-10">
              <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <h2 className="text-lg font-bold text-gray-900 sm:text-xl">
                    Recent Enquiries
                  </h2>

                  <p className="mt-1 break-words text-sm leading-6 text-gray-500">
                    Latest customer enquiries.
                  </p>
                </div>

                <Link
                  to="/admin/enquiries"
                  className="inline-flex min-h-10 w-fit items-center font-semibold text-amber-600 focus:outline-none focus:ring-4 focus:ring-amber-100"
                >
                  <span className="text-sm">
                    Manage Enquiries →
                  </span>
                </Link>
              </div>

              {recentEnquiries.length === 0 ? (
                <div className="mt-4 rounded-2xl border border-gray-200 bg-white px-5 py-12 text-center shadow-sm">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-2xl">
                    📩
                  </div>

                  <h3 className="mt-4 font-bold text-gray-900">
                    No Enquiries Yet
                  </h3>

                  <p className="mt-1 text-sm leading-5 text-gray-500">
                    New customer enquiries will appear here.
                  </p>
                </div>
              ) : (
                <div className="mt-4 grid min-w-0 gap-4 lg:grid-cols-2">
                  {recentEnquiries.map((enquiry) => {
                    const enquiryStatusClasses =
                      enquiry.status === "Contacted"
                        ? "bg-blue-100 text-blue-700"
                        : enquiry.status === "Resolved"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700";

                    return (
                      <div
                        key={enquiry._id}
                        className="min-w-0 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6"
                      >
                        <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div className="min-w-0">
                            <h3 className="break-words font-bold text-gray-900">
                              {enquiry.name}
                            </h3>

                            <p className="mt-1 break-all text-sm text-gray-500">
                              {enquiry.email}
                            </p>
                          </div>

                          <span
                            className={`w-fit shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold ${enquiryStatusClasses}`}
                          >
                            {enquiry.status}
                          </span>
                        </div>

                        <p className="mt-4 line-clamp-2 break-words text-sm leading-6 text-gray-600">
                          {enquiry.message}
                        </p>

                        <div className="mt-4 flex min-w-0 flex-col gap-2 border-t border-gray-100 pt-4 text-xs text-gray-500 sm:flex-row sm:items-center sm:justify-between">
                          <span className="break-all">
                            Phone: {enquiry.phone || "-"}
                          </span>

                          <span className="shrink-0">
                            {formatDate(enquiry.createdAt)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            {/* Recent Orders */}
            <section className="mt-10 pb-4">
              <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <h2 className="text-lg font-bold text-gray-900 sm:text-xl">
                    Recent Orders
                  </h2>

                  <p className="mt-1 break-words text-sm leading-6 text-gray-500">
                    Latest customer orders.
                  </p>
                </div>

                <Link
                  to="/admin/orders"
                  className="inline-flex min-h-10 w-fit items-center font-semibold text-amber-600 focus:outline-none focus:ring-4 focus:ring-amber-100"
                >
                  <span className="text-sm">
                    Manage Orders →
                  </span>
                </Link>
              </div>

              {recentOrders.length === 0 ? (
                <div className="mt-4 rounded-2xl border border-gray-200 bg-white px-5 py-12 text-center shadow-sm">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-2xl">
                    📦
                  </div>

                  <h3 className="mt-4 font-bold text-gray-900">
                    No Orders Yet
                  </h3>

                  <p className="mt-1 text-sm leading-5 text-gray-500">
                    New customer orders will appear here.
                  </p>
                </div>
              ) : (
                <div className="mt-4 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[700px] text-left">
                      <thead className="border-b border-gray-200 bg-gray-50">
                        <tr className="text-xs uppercase tracking-wide text-gray-500">
                          <th className="px-4 py-4 font-semibold sm:px-5">
                            Order
                          </th>

                          <th className="px-4 py-4 font-semibold sm:px-5">
                            Customer
                          </th>

                          <th className="px-4 py-4 font-semibold sm:px-5">
                            Type
                          </th>

                          <th className="px-4 py-4 font-semibold sm:px-5">
                            Status
                          </th>

                          <th className="px-4 py-4 text-right font-semibold sm:px-5">
                            Total
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {recentOrders.map((order) => {
                          const statusStyle =
                            getStatusClasses(order.status);

                          return (
                            <tr
                              key={order._id}
                              className="border-b border-gray-100 last:border-b-0"
                            >
                              <td className="px-4 py-4 sm:px-5">
                                <p className="font-semibold text-gray-900">
                                  #
                                  {String(order._id || "")
                                    .slice(-6)
                                    .toUpperCase()}
                                </p>

                                <p className="mt-1 text-xs text-gray-500">
                                  {formatDate(order.createdAt)}
                                </p>
                              </td>

                              <td className="px-4 py-4 sm:px-5">
                                <p className="font-medium text-gray-900">
                                  {order.customer?.name ||
                                    "-"}
                                </p>

                                <p className="mt-1 text-xs text-gray-500">
                                  {order.customer?.mobile ||
                                    "-"}
                                </p>
                              </td>

                              <td className="px-4 py-4 text-sm text-gray-600 sm:px-5">
                                {order.orderType || "-"}
                              </td>

                              <td className="px-4 py-4 sm:px-5">
                                <span
                                  className={`inline-flex whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold ${statusStyle.badge}`}
                                >
                                  {order.status || "Pending"}
                                </span>
                              </td>

                              <td className="px-4 py-4 text-right font-semibold text-gray-900 sm:px-5">
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
          </>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
