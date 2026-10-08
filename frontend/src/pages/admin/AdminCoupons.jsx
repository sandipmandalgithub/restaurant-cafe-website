import { useEffect, useState } from "react";

import {
  createCoupon,
  deleteCoupon,
  getCoupons,
  toggleCouponStatus,
  updateCoupon,
} from "../../services/couponService";

function AdminCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);

  const [formData, setFormData] = useState({
    code: "",
    description: "",
    discountType: "percentage",
    discountValue: "",
    minimumOrderAmount: "",
    maximumDiscountAmount: "",
    expiryDate: "",
    isActive: true,
  });

  const token = localStorage.getItem("adminToken");

  const loadCoupons = async () => {
    if (!token) {
      setError("Admin authentication required.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await getCoupons(token);

      if (response.success) {
        setCoupons(response.data || []);
      } else {
        setError(response.message || "Unable to load coupons.");
      }
    } catch (error) {
      console.error("Load coupons error:", error);
      setError("Unable to load coupons.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const fetchCoupons = async () => {
      if (!token) {
        if (isMounted) {
          setError("Admin authentication required.");
          setLoading(false);
        }

        return;
      }

      try {
        if (isMounted) {
          setLoading(true);
          setError("");
        }

        const response = await getCoupons(token);

        if (!isMounted) {
          return;
        }

        if (response.success) {
          setCoupons(response.data || []);
        } else {
          setError(response.message || "Unable to load coupons.");
        }
      } catch (error) {
        if (isMounted) {
          console.error("Load coupons error:", error);
          setError("Unable to load coupons.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchCoupons();

    return () => {
      isMounted = false;
    };
  }, [token]);

  const resetForm = () => {
    setFormData({
      code: "",
      description: "",
      discountType: "percentage",
      discountValue: "",
      minimumOrderAmount: "",
      maximumDiscountAmount: "",
      expiryDate: "",
      isActive: true,
    });

    setEditingCoupon(null);
  };

  const handleOpenCreate = () => {
    resetForm();
    setError("");
    setSuccess("");
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    if (saving) {
      return;
    }

    setIsFormOpen(false);
    resetForm();
  };

  const handleEdit = (coupon) => {
    const expiryDate = coupon.expiryDate
      ? new Date(coupon.expiryDate)
      : null;

    const formattedExpiryDate = expiryDate
      ? `${expiryDate.getFullYear()}-${String(
          expiryDate.getMonth() + 1
        ).padStart(2, "0")}-${String(expiryDate.getDate()).padStart(
          2,
          "0"
        )}`
      : "";

    setEditingCoupon(coupon);

    setFormData({
      code: coupon.code || "",
      description: coupon.description || "",
      discountType: coupon.discountType || "percentage",
      discountValue: coupon.discountValue ?? "",
      minimumOrderAmount: coupon.minimumOrderAmount ?? "",
      maximumDiscountAmount: coupon.maximumDiscountAmount ?? "",
      expiryDate: formattedExpiryDate,
      isActive: coupon.isActive !== false,
    });

    setError("");
    setSuccess("");
    setIsFormOpen(true);
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!token) {
      setError("Admin authentication required.");
      return;
    }

    setError("");
    setSuccess("");

    const code = formData.code.trim().toUpperCase();
    const discountValue = Number(formData.discountValue);
    const minimumOrderAmount = Number(
      formData.minimumOrderAmount || 0
    );

    const maximumDiscountAmount =
      formData.maximumDiscountAmount === ""
        ? null
        : Number(formData.maximumDiscountAmount);

    if (!code) {
      setError("Coupon code is required.");
      return;
    }

    if (!formData.expiryDate) {
      setError("Expiry date is required.");
      return;
    }

    if (!Number.isFinite(discountValue) || discountValue < 0) {
      setError("Please enter a valid discount value.");
      return;
    }

    if (
      formData.discountType === "percentage" &&
      discountValue > 100
    ) {
      setError("Percentage discount cannot be greater than 100.");
      return;
    }

    if (
      !Number.isFinite(minimumOrderAmount) ||
      minimumOrderAmount < 0
    ) {
      setError("Please enter a valid minimum order amount.");
      return;
    }

    if (
      maximumDiscountAmount !== null &&
      (!Number.isFinite(maximumDiscountAmount) ||
        maximumDiscountAmount < 0)
    ) {
      setError("Please enter a valid maximum discount amount.");
      return;
    }

    const expiryDate = new Date(
      `${formData.expiryDate}T23:59:59`
    );

    if (Number.isNaN(expiryDate.getTime())) {
      setError("Please enter a valid expiry date.");
      return;
    }

    if (expiryDate <= new Date()) {
      setError("Expiry date must be in the future.");
      return;
    }

    const couponData = {
      code,
      description: formData.description.trim(),
      discountType: formData.discountType,
      discountValue,
      minimumOrderAmount,
      maximumDiscountAmount,
      expiryDate: expiryDate.toISOString(),
      isActive: formData.isActive,
    };

    try {
      setSaving(true);

      let response;

      if (editingCoupon) {
        response = await updateCoupon(
          token,
          editingCoupon._id,
          couponData
        );
      } else {
        response = await createCoupon(token, couponData);
      }

      if (!response.success) {
        setError(
          response.message ||
            `Unable to ${
              editingCoupon ? "update" : "create"
            } coupon.`
        );
        return;
      }

      setSuccess(
        editingCoupon
          ? "Coupon updated successfully."
          : "Coupon created successfully."
      );

      setIsFormOpen(false);
      resetForm();

      await loadCoupons();
    } catch (error) {
      console.error("Save coupon error:", error);
      setError("Unable to save coupon.");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (coupon) => {
    if (!token) {
      setError("Admin authentication required.");
      return;
    }

    try {
      setError("");
      setSuccess("");

      const response = await toggleCouponStatus(
        token,
        coupon._id
      );

      if (!response.success) {
        setError(
          response.message || "Unable to update coupon status."
        );
        return;
      }

      setSuccess("Coupon status updated successfully.");

      await loadCoupons();
    } catch (error) {
      console.error("Toggle coupon status error:", error);
      setError("Unable to update coupon status.");
    }
  };

  const handleDelete = async (coupon) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete coupon "${coupon.code}"?`
    );

    if (!confirmed) {
      return;
    }

    if (!token) {
      setError("Admin authentication required.");
      return;
    }

    try {
      setError("");
      setSuccess("");

      const response = await deleteCoupon(
        token,
        coupon._id
      );

      if (!response.success) {
        setError(
          response.message || "Unable to delete coupon."
        );
        return;
      }

      setSuccess("Coupon deleted successfully.");

      await loadCoupons();
    } catch (error) {
      console.error("Delete coupon error:", error);
      setError("Unable to delete coupon.");
    }
  };

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatDiscount = (coupon) => {
    if (coupon.discountType === "percentage") {
      return `${coupon.discountValue}%`;
    }

    return `₹${Number(coupon.discountValue).toFixed(2)}`;
  };

  const isExpired = (expiryDate) => {
    return new Date(expiryDate) <= new Date();
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Coupons
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Create and manage discount coupons for customers.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="rounded-lg bg-orange-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-700"
        >
          + Add Coupon
        </button>
      </div>

      {/* Messages */}
      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
          {success}
        </div>
      )}

      {/* Coupon Form */}
      {isFormOpen && (
        <div className="mb-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                {editingCoupon
                  ? "Edit Coupon"
                  : "Create New Coupon"}
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Configure the discount and coupon validity.
              </p>
            </div>

            <button
              type="button"
              onClick={handleCloseForm}
              className="rounded-lg px-3 py-2 text-sm font-semibold text-gray-500 transition hover:bg-gray-100 hover:text-gray-800"
            >
              Close
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {/* Code */}
              <div>
                <label
                  htmlFor="code"
                  className="mb-1.5 block text-sm font-semibold text-gray-700"
                >
                  Coupon Code
                </label>

                <input
                  id="code"
                  name="code"
                  type="text"
                  value={formData.code}
                  onChange={handleChange}
                  placeholder="WELCOME10"
                  disabled={saving}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm uppercase outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100 disabled:bg-gray-100"
                />
              </div>

              {/* Discount Type */}
              <div>
                <label
                  htmlFor="discountType"
                  className="mb-1.5 block text-sm font-semibold text-gray-700"
                >
                  Discount Type
                </label>

                <select
                  id="discountType"
                  name="discountType"
                  value={formData.discountType}
                  onChange={handleChange}
                  disabled={saving}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100 disabled:bg-gray-100"
                >
                  <option value="percentage">
                    Percentage
                  </option>

                  <option value="fixed">
                    Fixed Amount
                  </option>
                </select>
              </div>

              {/* Discount Value */}
              <div>
                <label
                  htmlFor="discountValue"
                  className="mb-1.5 block text-sm font-semibold text-gray-700"
                >
                  Discount Value
                </label>

                <input
                  id="discountValue"
                  name="discountValue"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.discountValue}
                  onChange={handleChange}
                  placeholder={
                    formData.discountType === "percentage"
                      ? "10"
                      : "100"
                  }
                  disabled={saving}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100 disabled:bg-gray-100"
                />

                <p className="mt-1 text-xs text-gray-500">
                  {formData.discountType === "percentage"
                    ? "Enter a percentage between 0 and 100."
                    : "Enter the fixed discount amount in INR."}
                </p>
              </div>

              {/* Minimum Order */}
              <div>
                <label
                  htmlFor="minimumOrderAmount"
                  className="mb-1.5 block text-sm font-semibold text-gray-700"
                >
                  Minimum Order Amount
                </label>

                <input
                  id="minimumOrderAmount"
                  name="minimumOrderAmount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.minimumOrderAmount}
                  onChange={handleChange}
                  placeholder="500"
                  disabled={saving}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100 disabled:bg-gray-100"
                />
              </div>

              {/* Maximum Discount */}
              <div>
                <label
                  htmlFor="maximumDiscountAmount"
                  className="mb-1.5 block text-sm font-semibold text-gray-700"
                >
                  Maximum Discount Amount
                </label>

                <input
                  id="maximumDiscountAmount"
                  name="maximumDiscountAmount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.maximumDiscountAmount}
                  onChange={handleChange}
                  placeholder="100"
                  disabled={saving}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100 disabled:bg-gray-100"
                />

                <p className="mt-1 text-xs text-gray-500">
                  Optional. Mainly useful for percentage coupons.
                </p>
              </div>

              {/* Expiry Date */}
              <div>
                <label
                  htmlFor="expiryDate"
                  className="mb-1.5 block text-sm font-semibold text-gray-700"
                >
                  Expiry Date
                </label>

                <input
                  id="expiryDate"
                  name="expiryDate"
                  type="date"
                  value={formData.expiryDate}
                  onChange={handleChange}
                  disabled={saving}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100 disabled:bg-gray-100"
                />
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label
                  htmlFor="description"
                  className="mb-1.5 block text-sm font-semibold text-gray-700"
                >
                  Description
                </label>

                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="10% discount on orders above ₹500"
                  rows="3"
                  disabled={saving}
                  className="w-full resize-none rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100 disabled:bg-gray-100"
                />
              </div>

              {/* Active */}
              <div className="md:col-span-2">
                <label className="flex cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                    disabled={saving}
                    className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                  />

                  <span className="text-sm font-semibold text-gray-700">
                    Coupon is active
                  </span>
                </label>
              </div>
            </div>

            {/* Form Actions */}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={handleCloseForm}
                disabled={saving}
                className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-orange-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving
                  ? "Saving..."
                  : editingCoupon
                  ? "Update Coupon"
                  : "Create Coupon"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Coupons Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 px-5 py-4">
          <h3 className="font-bold text-gray-900">
            All Coupons
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            {coupons.length} coupon
            {coupons.length !== 1 ? "s" : ""} available.
          </p>
        </div>

        {loading ? (
          <div className="px-5 py-12 text-center text-sm text-gray-500">
            Loading coupons...
          </div>
        ) : coupons.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <p className="text-sm font-medium text-gray-700">
              No coupons found.
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Create your first coupon using the Add Coupon button.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-[1000px] w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                    Coupon
                  </th>

                  <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                    Discount
                  </th>

                  <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                    Minimum Order
                  </th>

                  <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                    Max Discount
                  </th>

                  <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                    Expiry
                  </th>

                  <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                    Status
                  </th>

                  <th className="px-5 py-3 text-right text-xs font-bold uppercase tracking-wide text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {coupons.map((coupon) => {
                  const expired = isExpired(coupon.expiryDate);

                  return (
                    <tr
                      key={coupon._id}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-5 py-4">
                        <p className="font-bold text-gray-900">
                          {coupon.code}
                        </p>

                        {coupon.description && (
                          <p className="mt-1 max-w-xs text-xs text-gray-500">
                            {coupon.description}
                          </p>
                        )}
                      </td>

                      <td className="px-5 py-4">
                        <span className="font-semibold text-gray-800">
                          {formatDiscount(coupon)}
                        </span>

                        <p className="mt-1 text-xs capitalize text-gray-500">
                          {coupon.discountType}
                        </p>
                      </td>

                      <td className="px-5 py-4 text-sm text-gray-700">
                        ₹
                        {Number(
                          coupon.minimumOrderAmount || 0
                        ).toFixed(2)}
                      </td>

                      <td className="px-5 py-4 text-sm text-gray-700">
                        {coupon.maximumDiscountAmount === null ||
                        coupon.maximumDiscountAmount ===
                          undefined
                          ? "No limit"
                          : `₹${Number(
                              coupon.maximumDiscountAmount
                            ).toFixed(2)}`}
                      </td>

                      <td className="px-5 py-4">
                        <p
                          className={`text-sm font-medium ${
                            expired
                              ? "text-red-600"
                              : "text-gray-700"
                          }`}
                        >
                          {formatDate(coupon.expiryDate)}
                        </p>

                        {expired && (
                          <p className="mt-1 text-xs font-semibold text-red-500">
                            Expired
                          </p>
                        )}
                      </td>

                      <td className="px-5 py-4">
                        {expired ? (
                          <span className="inline-flex rounded-full bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-700">
                            Expired
                          </span>
                        ) : coupon.isActive ? (
                          <span className="inline-flex rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700">
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600">
                            Inactive
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleEdit(coupon)}
                            className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 transition hover:bg-blue-100"
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleToggleStatus(coupon)
                            }
                            className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${
                              coupon.isActive
                                ? "border border-yellow-200 bg-yellow-50 text-yellow-700 hover:bg-yellow-100"
                                : "border border-green-200 bg-green-50 text-green-700 hover:bg-green-100"
                            }`}
                          >
                            {coupon.isActive
                              ? "Disable"
                              : "Enable"}
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(coupon)
                            }
                            className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-100"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminCoupons;