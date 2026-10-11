import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import useCustomerAuth from "../context/useCustomerAuth";

function CustomerLogin() {
  const navigate = useNavigate();
  const { login } = useCustomerAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!formData.email.trim() || !formData.password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await login({
        email: formData.email.trim(),
        password: formData.password,
      });

      if (response.success) {
        navigate("/");
      } else {
        setError(response.message || "Login failed.");
      }
    } catch (error) {
      setError(error.message || "Unable to login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-160px)] bg-gray-50 px-4 py-10 sm:py-14">
      <div className="mx-auto w-full max-w-md">
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-lg sm:p-8">
          {/* CaféNest Brand */}
          <div className="mb-7 text-center">
            <Link
              to="/"
              aria-label="CaféNest Home"
              className="inline-block text-2xl font-bold tracking-tight transition-opacity hover:opacity-80 sm:text-3xl"
            >
              <span className="text-gray-900">Café</span>
              <span className="text-orange-600">Nest</span>
            </Link>

            <h1 className="mt-5 text-2xl font-bold text-gray-900 sm:text-3xl">
              Customer Login
            </h1>

            <p className="mt-2 text-sm leading-6 text-gray-600">
              Login to manage your CaféNest account and orders.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div
              role="alert"
              className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700"
            >
              {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
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
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                autoComplete="email"
                required
                className="min-h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Password
              </label>

              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                autoComplete="current-password"
                required
                className="min-h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-orange-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* Register Link */}
          <div className="mt-6 text-center text-sm text-gray-600">
            <span>Don't have an account? </span>

            <Link
              to="/customer/register"
              className="font-semibold text-orange-600 transition hover:text-orange-700 focus:outline-none focus:underline"
            >
              Create Account
            </Link>
          </div>

          {/* Back to Home */}
          <div className="mt-5 border-t border-gray-100 pt-5 text-center">
            <Link
              to="/"
              className="text-sm font-medium text-gray-500 transition hover:text-orange-600"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomerLogin;
