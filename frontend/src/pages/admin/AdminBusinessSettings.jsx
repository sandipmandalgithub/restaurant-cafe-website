import { useEffect, useState } from "react";

const API_URL = "http://localhost:5000/api/business-settings";

const getAuthHeaders = () => {
  const token = localStorage.getItem("adminToken");

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

const AdminBusinessSettings = () => {
  const [formData, setFormData] = useState({
    businessName: "",
    phone: "",
    email: "",
    address: "",
    openingTime: "",
    closingTime: "",
    deliveryCharge: "",
    deliveryAvailable: true,
    pickupAvailable: true,
    whatsappNumber: "",
    facebookUrl: "",
    instagramUrl: "",
    youtubeUrl: "",
    description: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadSettings = async () => {
      try {
        await Promise.resolve();

        setLoading(true);
        setError("");

        const response = await fetch(`${API_URL}/admin`, {
          method: "GET",
          headers: getAuthHeaders(),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Unable to load business settings."
          );
        }

        const settings = data.data;

        setFormData({
          businessName: settings.businessName || "",
          phone: settings.phone || "",
          email: settings.email || "",
          address: settings.address || "",
          openingTime: settings.openingTime || "",
          closingTime: settings.closingTime || "",
          deliveryCharge:
            settings.deliveryCharge !== undefined
              ? settings.deliveryCharge
              : "",
          deliveryAvailable:
            settings.deliveryAvailable !== undefined
              ? settings.deliveryAvailable
              : true,
          pickupAvailable:
            settings.pickupAvailable !== undefined
              ? settings.pickupAvailable
              : true,
          whatsappNumber: settings.whatsappNumber || "",
          facebookUrl: settings.facebookUrl || "",
          instagramUrl: settings.instagramUrl || "",
          youtubeUrl: settings.youtubeUrl || "",
          description: settings.description || "",
        });
      } catch (err) {
        setError(
          err.message || "Unable to load business settings."
        );
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: type === "checkbox" ? checked : value,
    }));

    setMessage("");
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setMessage("");
      setError("");

      const response = await fetch(API_URL, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to update business settings."
        );
      }

      const settings = data.data;

      setFormData({
        businessName: settings.businessName || "",
        phone: settings.phone || "",
        email: settings.email || "",
        address: settings.address || "",
        openingTime: settings.openingTime || "",
        closingTime: settings.closingTime || "",
        deliveryCharge:
          settings.deliveryCharge !== undefined
            ? settings.deliveryCharge
            : "",
        deliveryAvailable:
          settings.deliveryAvailable !== undefined
            ? settings.deliveryAvailable
            : true,
        pickupAvailable:
          settings.pickupAvailable !== undefined
            ? settings.pickupAvailable
            : true,
        whatsappNumber: settings.whatsappNumber || "",
        facebookUrl: settings.facebookUrl || "",
        instagramUrl: settings.instagramUrl || "",
        youtubeUrl: settings.youtubeUrl || "",
        description: settings.description || "",
      });

      setMessage("Business settings updated successfully.");
    } catch (err) {
      setError(
        err.message || "Unable to update business settings."
      );
    } finally {
      setSaving(false);
    }
  };

  const inputClasses =
    "w-full min-h-11 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 hover:border-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-100";

  const sectionClasses =
    "overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm";

  if (loading) {
    return (
      <div className="flex min-h-[420px] items-center justify-center px-4">
        <div className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-amber-600" />

          <p className="mt-4 text-sm font-semibold text-gray-700">
            Loading business settings...
          </p>

          <p className="mt-1 text-xs leading-5 text-gray-500">
            Please wait while your business information is
            loaded.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-w-0 space-y-5 overflow-x-hidden sm:space-y-6">
      {/* Page Header */}
      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6 lg:p-7">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 shrink-0 rounded-full bg-amber-500" />

              <p className="text-xs font-bold uppercase tracking-[0.16em] text-amber-600 sm:text-sm">
                Admin Panel
              </p>
            </div>

            <h1 className="mt-2 break-words text-2xl font-bold leading-tight text-gray-900 sm:text-3xl">
              Business Settings
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600 sm:text-base">
              Manage your restaurant or café business
              information and ordering options.
            </p>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {message && (
        <div
          role="status"
          className="rounded-2xl border border-green-200 bg-green-50 p-4 sm:px-5 sm:py-4"
        >
          <div className="flex items-start gap-3">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-green-100 text-sm font-bold text-green-700">
              ✓
            </div>

            <div className="min-w-0">
              <p className="text-sm font-bold text-green-800">
                Settings saved
              </p>

              <p className="mt-0.5 break-words text-sm leading-6 text-green-700">
                {message}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div
          role="alert"
          className="rounded-2xl border border-red-200 bg-red-50 p-4 sm:px-5 sm:py-4"
        >
          <div className="flex items-start gap-3">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-100 text-sm font-bold text-red-700">
              !
            </div>

            <div className="min-w-0">
              <p className="text-sm font-bold text-red-800">
                Unable to save settings
              </p>

              <p className="mt-0.5 break-words text-sm leading-6 text-red-700">
                {error}
              </p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
        {/* Basic Information */}
        <section className={sectionClasses}>
          <div className="border-b border-gray-100 bg-gray-50/70 px-4 py-4 sm:px-6 sm:py-5">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-base">
                🏪
              </div>

              <div className="min-w-0">
                <h2 className="text-base font-bold text-gray-900 sm:text-lg">
                  Basic Information
                </h2>

                <p className="mt-1 text-xs leading-5 text-gray-500 sm:text-sm">
                  Basic contact and business information.
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-6">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {/* Business Name */}
              <div>
                <label
                  htmlFor="businessName"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Business Name *
                </label>

                <input
                  id="businessName"
                  type="text"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleChange}
                  required
                  className={inputClasses}
                  placeholder="CaféNest"
                />
              </div>

              {/* Phone */}
              <div>
                <label
                  htmlFor="phone"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Phone Number
                </label>

                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={inputClasses}
                  placeholder="9876543210"
                />
              </div>

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
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={inputClasses}
                  placeholder="hello@cafenest.com"
                />
              </div>

              {/* Address */}
              <div>
                <label
                  htmlFor="address"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Address
                </label>

                <input
                  id="address"
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className={inputClasses}
                  placeholder="Kolkata, West Bengal"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Opening Hours */}
        <section className={sectionClasses}>
          <div className="border-b border-gray-100 bg-gray-50/70 px-4 py-4 sm:px-6 sm:py-5">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-base">
                🕐
              </div>

              <div className="min-w-0">
                <h2 className="text-base font-bold text-gray-900 sm:text-lg">
                  Opening Hours
                </h2>

                <p className="mt-1 text-xs leading-5 text-gray-500 sm:text-sm">
                  Set your regular business opening and
                  closing time.
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-6">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {/* Opening Time */}
              <div>
                <label
                  htmlFor="openingTime"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Opening Time
                </label>

                <input
                  id="openingTime"
                  type="text"
                  name="openingTime"
                  value={formData.openingTime}
                  onChange={handleChange}
                  className={inputClasses}
                  placeholder="10:00 AM"
                />
              </div>

              {/* Closing Time */}
              <div>
                <label
                  htmlFor="closingTime"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Closing Time
                </label>

                <input
                  id="closingTime"
                  type="text"
                  name="closingTime"
                  value={formData.closingTime}
                  onChange={handleChange}
                  className={inputClasses}
                  placeholder="10:00 PM"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Order & Delivery Settings */}
        <section className={sectionClasses}>
          <div className="border-b border-gray-100 bg-gray-50/70 px-4 py-4 sm:px-6 sm:py-5">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-green-50 text-base">
                🚚
              </div>

              <div className="min-w-0">
                <h2 className="text-base font-bold text-gray-900 sm:text-lg">
                  Order & Delivery Settings
                </h2>

                <p className="mt-1 text-xs leading-5 text-gray-500 sm:text-sm">
                  Manage delivery, pickup, and WhatsApp
                  ordering options.
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-6">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {/* Delivery Charge */}
              <div>
                <label
                  htmlFor="deliveryCharge"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Delivery Charge (₹)
                </label>

                <input
                  id="deliveryCharge"
                  type="number"
                  name="deliveryCharge"
                  value={formData.deliveryCharge}
                  onChange={handleChange}
                  min="0"
                  step="1"
                  className={inputClasses}
                  placeholder="40"
                />
              </div>

              {/* WhatsApp */}
              <div>
                <label
                  htmlFor="whatsappNumber"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  WhatsApp Number
                </label>

                <input
                  id="whatsappNumber"
                  type="tel"
                  name="whatsappNumber"
                  value={formData.whatsappNumber}
                  onChange={handleChange}
                  className={inputClasses}
                  placeholder="919876543210"
                />

                <p className="mt-1.5 break-words text-xs leading-5 text-gray-500">
                  Include country code, for example:
                  919876543210
                </p>
              </div>
            </div>

            {/* Availability */}
            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label className="flex min-w-0 cursor-pointer items-start gap-3 rounded-xl border border-gray-200 bg-white p-4 transition hover:border-gray-300 hover:bg-gray-50">
                <input
                  type="checkbox"
                  name="deliveryAvailable"
                  checked={formData.deliveryAvailable}
                  onChange={handleChange}
                  className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded border-gray-300 accent-amber-600"
                />

                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900">
                    Delivery Available
                  </p>

                  <p className="mt-1 text-xs leading-5 text-gray-500">
                    Customers can place delivery orders.
                  </p>
                </div>
              </label>

              <label className="flex min-w-0 cursor-pointer items-start gap-3 rounded-xl border border-gray-200 bg-white p-4 transition hover:border-gray-300 hover:bg-gray-50">
                <input
                  type="checkbox"
                  name="pickupAvailable"
                  checked={formData.pickupAvailable}
                  onChange={handleChange}
                  className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded border-gray-300 accent-amber-600"
                />

                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900">
                    Pickup Available
                  </p>

                  <p className="mt-1 text-xs leading-5 text-gray-500">
                    Customers can choose pickup orders.
                  </p>
                </div>
              </label>
            </div>
          </div>
        </section>

        {/* Social Media */}
        <section className={sectionClasses}>
          <div className="border-b border-gray-100 bg-gray-50/70 px-4 py-4 sm:px-6 sm:py-5">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-base">
                🔗
              </div>

              <div className="min-w-0">
                <h2 className="text-base font-bold text-gray-900 sm:text-lg">
                  Social Media Links
                </h2>

                <p className="mt-1 text-xs leading-5 text-gray-500 sm:text-sm">
                  Add your social media profile URLs.
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-6">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {/* Facebook */}
              <div className="min-w-0">
                <label
                  htmlFor="facebookUrl"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Facebook URL
                </label>

                <input
                  id="facebookUrl"
                  type="url"
                  name="facebookUrl"
                  value={formData.facebookUrl}
                  onChange={handleChange}
                  className={inputClasses}
                  placeholder="https://facebook.com/yourpage"
                />
              </div>

              {/* Instagram */}
              <div className="min-w-0">
                <label
                  htmlFor="instagramUrl"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Instagram URL
                </label>

                <input
                  id="instagramUrl"
                  type="url"
                  name="instagramUrl"
                  value={formData.instagramUrl}
                  onChange={handleChange}
                  className={inputClasses}
                  placeholder="https://instagram.com/yourpage"
                />
              </div>

              {/* YouTube */}
              <div className="min-w-0 md:col-span-2">
                <label
                  htmlFor="youtubeUrl"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  YouTube URL
                </label>

                <input
                  id="youtubeUrl"
                  type="url"
                  name="youtubeUrl"
                  value={formData.youtubeUrl}
                  onChange={handleChange}
                  className={inputClasses}
                  placeholder="https://youtube.com/@yourchannel"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Business Description */}
        <section className={sectionClasses}>
          <div className="border-b border-gray-100 bg-gray-50/70 px-4 py-4 sm:px-6 sm:py-5">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-base">
                📝
              </div>

              <div className="min-w-0">
                <h2 className="text-base font-bold text-gray-900 sm:text-lg">
                  Business Description
                </h2>

                <p className="mt-1 text-xs leading-5 text-gray-500 sm:text-sm">
                  Add a short description about your
                  restaurant or café.
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-6">
            <label
              htmlFor="description"
              className="sr-only"
            >
              Business Description
            </label>

            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="5"
              className={`${inputClasses} min-h-[140px] resize-y py-3`}
              placeholder="Tell customers about your restaurant or café..."
            />

            <p className="mt-1.5 text-xs text-gray-400">
              Keep the description clear and customer-friendly.
            </p>
          </div>
        </section>

        {/* Save Button */}
        <div className="sticky bottom-0 z-10 -mx-3 border-t border-gray-200 bg-gray-50/95 px-3 py-3 backdrop-blur sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:px-0 sm:py-0 sm:backdrop-blur-none">
          <button
            type="submit"
            disabled={saving}
            className="min-h-11 w-full rounded-xl bg-gray-900 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:min-w-[220px]"
          >
            {saving ? "Saving..." : "Save Business Settings"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminBusinessSettings;