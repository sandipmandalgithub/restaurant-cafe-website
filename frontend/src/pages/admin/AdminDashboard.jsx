import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { getDashboardStats } from "../../services/adminDashboardService";

function AdminDashboard() {
  const navigate = useNavigate();

  const adminData = JSON.parse(
    localStorage.getItem("adminData") || "{}"
  );

  const [stats, setStats] = useState({
    totalMenus: 0,
    totalGallery: 0,
    totalEnquiries: 0,
    newEnquiries: 0,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [hasLoadedStats, setHasLoadedStats] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLoadStats = async () => {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const data = await getDashboardStats();

      setStats(data);
      setHasLoadedStats(true);
    } catch (error) {
      console.error("Failed to load dashboard stats:", error);

      setErrorMessage(
        error.message || "Unable to load dashboard statistics."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminData");

    navigate("/admin/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
              Café<span className="text-orange-600">Nest</span>
            </h1>

            <p className="mt-1 text-xs text-gray-500 sm:text-sm">
              Admin Panel
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-orange-600">
                Admin Dashboard
              </p>

              <h2 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl">
                Welcome, {adminData.name || "Admin"}
              </h2>

              <p className="mt-2 text-sm text-gray-600 sm:text-base">
                Manage your CaféNest website from here.
              </p>

              {adminData.email && (
                <p className="mt-2 text-sm text-gray-500">
                  {adminData.email}
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={handleLoadStats}
              disabled={isLoading}
              className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading
                ? "Loading..."
                : hasLoadedStats
                  ? "Refresh Stats"
                  : "Load Stats"}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {errorMessage}
          </div>
        )}

        {/* Statistics */}
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {/* Total Menu */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Total Menu Items
                </p>

                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {stats.totalMenus}
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-xl">
                🍽️
              </div>
            </div>
          </div>

          {/* Total Gallery */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Gallery Items
                </p>

                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {stats.totalGallery}
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-xl">
                🖼️
              </div>
            </div>
          </div>

          {/* Total Enquiries */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Total Enquiries
                </p>

                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {stats.totalEnquiries}
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-xl">
                📩
              </div>
            </div>
          </div>

          {/* New Enquiries */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  New Enquiries
                </p>

                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {stats.newEnquiries}
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-100 text-xl">
                🆕
              </div>
            </div>
          </div>
        </div>

        {/* Management Cards */}
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Menu */}
          <div className="rounded-2xl bg-white p-6 shadow-sm transition hover:shadow-md">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-xl">
              🍽️
            </div>

            <h3 className="mt-5 text-xl font-bold text-gray-900">
              Menu Management
            </h3>

            <p className="mt-2 text-sm leading-6 text-gray-600">
              Add, update, and delete menu items.
            </p>

            <button
              type="button"
              onClick={() => navigate("/admin/menu")}
              className="mt-5 rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-700"
            >
              Manage Menu
            </button>
          </div>

          {/* Gallery */}
          <div className="rounded-2xl bg-white p-6 shadow-sm transition hover:shadow-md">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-xl">
              🖼️
            </div>

            <h3 className="mt-5 text-xl font-bold text-gray-900">
              Gallery Management
            </h3>

            <p className="mt-2 text-sm leading-6 text-gray-600">
              Manage café and food gallery images.
            </p>

            <button
              type="button"
              onClick={() => navigate("/admin/gallery")}
              className="mt-5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Manage Gallery
            </button>
          </div>

          {/* Enquiries */}
          <div className="rounded-2xl bg-white p-6 shadow-sm transition hover:shadow-md">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-xl">
              📩
            </div>

            <h3 className="mt-5 text-xl font-bold text-gray-900">
              Enquiry Management
            </h3>

            <p className="mt-2 text-sm leading-6 text-gray-600">
              View and manage customer enquiries.
            </p>

            <button
              type="button"
              onClick={() => navigate("/admin/enquiries")}
              className="mt-5 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700"
            >
              Manage Enquiries
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;