import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import useCustomerAuth from "../context/useCustomerAuth";

function CustomerProfileForm({ customer, updateProfile, logout }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState(() => ({
    name: customer?.name || "",
    phone: customer?.phone || "",
    address: customer?.address || "",
  }));

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));

    setMessage("");
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage("");
    setError("");

    const trimmedName = formData.name.trim();

    if (!trimmedName) {
      setError("Name cannot be empty.");
      return;
    }

    try {
      setLoading(true);

      const response = await updateProfile({
        name: trimmedName,
        phone: formData.phone.trim(),
        address: formData.address.trim(),
      });

      if (response.success) {
        setMessage(
          response.message || "Profile updated successfully!"
        );
      } else {
        setError(response.message || "Failed to update profile.");
      }
    } catch (error) {
      setError(
        error.message || "Unable to update profile. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/customer/login");
  };

  return (
    <div className="min-h-[calc(100vh-160px)] bg-gray-50 px-4 py-10 sm:py-14">
      <div className="mx-auto w-full max-w-2xl">
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-lg sm:p-8">
          {/* CaféNest Brand */}
          <div className="mb-7">
            <Link
              to="/"
              aria-label="CaféNest Home"
              className="inline-block text-2xl font-bold tracking-tight transition-opacity hover:opacity-80"
            >
              <span className="text-gray-900">Café</span>
              <span className="text-orange-600">Nest</span>
            </Link>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              My Profile
            </h1>

            <p className="mt-2 text-sm leading-6 text-gray-600 sm:text-base">
              Manage your CaféNest customer account information.
            </p>
          </div>

          {/* Success Message */}
          {message && (
            <div
              role="status"
              className="mb-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm leading-6 text-green-700"
            >
              {message}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div
              role="alert"
              className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700"
            >
              {error}
            </div>
          )}

          {/* Profile Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Full Name
              </label>

              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                autoComplete="name"
                required
                maxLength={100}
                className="min-h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Email Address
              </label>

              <input
                id="email"
                name="email"
                type="email"
                value={customer.email || ""}
                disabled
                autoComplete="email"
                className="min-h-11 w-full cursor-not-allowed rounded-lg border border-gray-200 bg-gray-100 px-4 py-3 text-sm text-gray-500"
              />

              <p className="mt-1 text-xs leading-5 text-gray-500">
                Your email address cannot be changed here.
              </p>
            </div>

            {/* Phone */}
            <div>
              <label
                htmlFor="phone"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Phone Number
              </label>

              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                autoComplete="tel"
                maxLength={20}
                className="min-h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              />
            </div>

            {/* Address */}
            <div>
              <label
                htmlFor="address"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Address
              </label>

              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter your address"
                rows={4}
                maxLength={500}
                autoComplete="street-address"
                className="w-full resize-y rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm leading-6 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              />
            </div>

            {/* Update Button */}
            <button
              type="submit"
              disabled={loading}
              className="inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-orange-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Updating Profile..." : "Update Profile"}
            </button>
          </form>

          {/* Logout Section */}
          <div className="mt-8 border-t border-gray-200 pt-6">
            <h2 className="text-base font-semibold text-gray-900">
              Account Actions
            </h2>

            <p className="mt-1 text-sm leading-6 text-gray-600">
              Log out of your CaféNest customer account on this device.
            </p>

            <button
              type="button"
              onClick={handleLogout}
              className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-lg border border-red-300 px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function CustomerProfile() {
  const { customer, updateProfile, logout } = useCustomerAuth();

  if (!customer) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-sm">
          <h1 className="text-xl font-bold text-gray-900">
            Please log in
          </h1>

          <p className="mt-2 text-sm leading-6 text-gray-600">
            Log in to view and manage your CaféNest customer profile.
          </p>

          <Link
            to="/customer/login"
            className="mt-6 inline-flex min-h-11 items-center justify-center rounded-lg bg-orange-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
          >
            Customer Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <CustomerProfileForm
      key={customer._id || customer.email}
      customer={customer}
      updateProfile={updateProfile}
      logout={logout}
    />
  );
}

export default CustomerProfile;
