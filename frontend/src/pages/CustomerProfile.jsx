import { useState } from "react";
import { useNavigate } from "react-router-dom";

import useCustomerAuth from "../context/useCustomerAuth";

function CustomerProfile() {
  const navigate = useNavigate();

  const {
    customer,
    updateProfile,
    logout,
  } = useCustomerAuth();

  const [formData, setFormData] = useState({
    name: customer?.name || "",
    phone: customer?.phone || "",
    address: customer?.address || "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage("");
    setError("");

    if (!formData.name.trim()) {
      setError("Name cannot be empty.");
      return;
    }

    try {
      setLoading(true);

      const response = await updateProfile({
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
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

  if (!customer) {
    return null;
  }

  return (
    <div className="min-h-[calc(100vh-160px)] bg-gray-50 px-4 py-10 sm:py-14">
      <div className="mx-auto w-full max-w-2xl">
        <div className="rounded-2xl bg-white p-6 shadow-lg sm:p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              My Profile
            </h1>

            <p className="mt-2 text-sm text-gray-600">
              Manage your CaféNest customer account information.
            </p>
          </div>

          {/* Success Message */}
          {message && (
            <div className="mb-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              {message}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
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
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
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
                value={customer.email}
                disabled
                className="w-full cursor-not-allowed rounded-lg border border-gray-200 bg-gray-100 px-4 py-3 text-sm text-gray-500"
              />

              <p className="mt-1 text-xs text-gray-500">
                Email address cannot be changed.
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
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
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
                rows="4"
                autoComplete="street-address"
                className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              />
            </div>

            {/* Update Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-orange-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Updating Profile..." : "Update Profile"}
            </button>
          </form>

          {/* Logout Section */}
          <div className="mt-8 border-t border-gray-200 pt-6">
            <button
              type="button"
              onClick={handleLogout}
              className="w-full rounded-lg border border-red-300 px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomerProfile;