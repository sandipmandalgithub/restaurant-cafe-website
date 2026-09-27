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
        setError(err.message || "Unable to load business settings.");
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
      setError(err.message || "Unable to update business settings.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-gray-900"></div>
          <p className="mt-4 text-sm text-gray-600">
            Loading business settings...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Business Settings
        </h1>

        <p className="mt-1 text-sm text-gray-600">
          Manage your restaurant or café business information.
        </p>
      </div>

      {/* Success Message */}
      {message && (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
          {message}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">
            Basic Information
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Basic contact and business information.
          </p>

          <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
            {/* Business Name */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Business Name *
              </label>

              <input
                type="text"
                name="businessName"
                value={formData.businessName}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
                placeholder="CaféNest"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Phone Number
              </label>

              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
                placeholder="9876543210"
              />
            </div>

            {/* Email */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Email Address
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
                placeholder="hello@cafenest.com"
              />
            </div>

            {/* Address */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Address
              </label>

              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
                placeholder="Kolkata, West Bengal"
              />
            </div>
          </div>
        </section>

        {/* Opening Hours */}
        <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">
            Opening Hours
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Set your regular business opening and closing time.
          </p>

          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {/* Opening Time */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Opening Time
              </label>

              <input
                type="text"
                name="openingTime"
                value={formData.openingTime}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
                placeholder="10:00 AM"
              />
            </div>

            {/* Closing Time */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Closing Time
              </label>

              <input
                type="text"
                name="closingTime"
                value={formData.closingTime}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
                placeholder="10:00 PM"
              />
            </div>
          </div>
        </section>

        {/* Order & Delivery Settings */}
        <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">
            Order & Delivery Settings
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Manage delivery and pickup availability.
          </p>

          <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
            {/* Delivery Charge */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Delivery Charge (₹)
              </label>

              <input
                type="number"
                name="deliveryCharge"
                value={formData.deliveryCharge}
                onChange={handleChange}
                min="0"
                step="1"
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
                placeholder="40"
              />
            </div>

            {/* WhatsApp */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                WhatsApp Number
              </label>

              <input
                type="tel"
                name="whatsappNumber"
                value={formData.whatsappNumber}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
                placeholder="919876543210"
              />

              <p className="mt-1 text-xs text-gray-500">
                Include country code, for example: 919876543210
              </p>
            </div>
          </div>

          {/* Availability */}
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 p-4 transition hover:bg-gray-50">
              <input
                type="checkbox"
                name="deliveryAvailable"
                checked={formData.deliveryAvailable}
                onChange={handleChange}
                className="h-4 w-4 rounded border-gray-300"
              />

              <div>
                <p className="text-sm font-medium text-gray-900">
                  Delivery Available
                </p>

                <p className="text-xs text-gray-500">
                  Customers can place delivery orders.
                </p>
              </div>
            </label>

            <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 p-4 transition hover:bg-gray-50">
              <input
                type="checkbox"
                name="pickupAvailable"
                checked={formData.pickupAvailable}
                onChange={handleChange}
                className="h-4 w-4 rounded border-gray-300"
              />

              <div>
                <p className="text-sm font-medium text-gray-900">
                  Pickup Available
                </p>

                <p className="text-xs text-gray-500">
                  Customers can choose pickup orders.
                </p>
              </div>
            </label>
          </div>
        </section>

        {/* Social Media */}
        <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">
            Social Media Links
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Add your social media profile URLs.
          </p>

          <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
            {/* Facebook */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Facebook URL
              </label>

              <input
                type="url"
                name="facebookUrl"
                value={formData.facebookUrl}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
                placeholder="https://facebook.com/yourpage"
              />
            </div>

            {/* Instagram */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Instagram URL
              </label>

              <input
                type="url"
                name="instagramUrl"
                value={formData.instagramUrl}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
                placeholder="https://instagram.com/yourpage"
              />
            </div>

            {/* YouTube */}
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                YouTube URL
              </label>

              <input
                type="url"
                name="youtubeUrl"
                value={formData.youtubeUrl}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
                placeholder="https://youtube.com/@yourchannel"
              />
            </div>
          </div>
        </section>

        {/* Business Description */}
        <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">
            Business Description
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Add a short description about your restaurant or café.
          </p>

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="5"
            className="mt-5 w-full resize-y rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
            placeholder="Tell customers about your restaurant or café..."
          />
        </section>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-gray-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Business Settings"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminBusinessSettings;
