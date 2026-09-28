import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { loginAdmin } from "../../services/adminAuthService";

function AdminLogin() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));

    if (errorMessage) {
      setErrorMessage("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setErrorMessage("");

    try {
      setIsSubmitting(true);

      const data = await loginAdmin(formData);

      localStorage.setItem("adminToken", data.token);
      localStorage.setItem("adminData", JSON.stringify(data.admin));

      navigate("/admin/dashboard");
    } catch (error) {
      console.error("Admin login failed:", error);

      setErrorMessage(
        error.message || "Unable to login. Please check your credentials."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-orange-50 via-white to-amber-50 px-4 py-8 sm:px-6 sm:py-10">
      <div className="w-full max-w-md">
        {/* Login Card */}
        <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-xl shadow-gray-200/60">
          {/* Top Branding Section */}
          <div className="border-b border-orange-100 bg-gradient-to-br from-orange-50 to-amber-50 px-5 py-7 text-center sm:px-8 sm:py-8">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-600 text-3xl shadow-md shadow-orange-200 sm:h-[72px] sm:w-[72px] sm:text-4xl">
              ☕
            </div>

            <h1 className="mt-4 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              Café<span className="text-orange-600">Nest</span>
            </h1>

            <p className="mt-1.5 text-sm font-medium text-gray-500 sm:text-base">
              Admin Panel
            </p>

            <p className="mt-1 text-xs text-gray-400 sm:text-sm">
              Sign in to manage your café
            </p>
          </div>

          {/* Form Section */}
          <div className="px-5 py-6 sm:px-8 sm:py-8">
            {/* Error Message */}
            {errorMessage && (
              <div
                role="alert"
                className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-5 font-medium text-red-700"
              >
                <div className="flex items-start gap-2">
                  <span className="mt-0.5 shrink-0">⚠️</span>

                  <p>{errorMessage}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Email Address
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                  placeholder="Enter admin email"
                  className="min-h-12 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition duration-200 placeholder:text-gray-400 hover:border-gray-400 focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
                />
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Password
                </label>

                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  autoComplete="current-password"
                  placeholder="Enter admin password"
                  className="min-h-12 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition duration-200 placeholder:text-gray-400 hover:border-gray-400 focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-2 flex min-h-12 w-full items-center justify-center rounded-xl bg-orange-600 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-orange-200 transition duration-200 hover:bg-orange-700 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-orange-200 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-orange-600 disabled:hover:shadow-md"
              >
                {isSubmitting ? (
                  <>
                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-100 bg-gray-50 px-5 py-4 text-center">
            <p className="text-xs text-gray-400 sm:text-sm">
              CaféNest Admin Panel
            </p>
          </div>
        </div>

        {/* Bottom Note */}
        <p className="mt-5 px-4 text-center text-xs leading-5 text-gray-400">
          Secure access for authorized administrators only.
        </p>
      </div>
    </div>
  );
}

export default AdminLogin;