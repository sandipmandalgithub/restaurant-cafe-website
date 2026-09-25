import { useState } from "react";

import {
  deleteEnquiry,
  getEnquiries,
  updateEnquiryStatus,
} from "../../services/enquiryService";

const statusOptions = ["New", "Contacted", "Resolved"];

function AdminEnquiries() {
  const [enquiries, setEnquiries] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const fetchEnquiries = async () => {
    try {
      setIsLoading(true);
      setErrorMessage("");
      setSuccessMessage("");

      const data = await getEnquiries();

      setEnquiries(data);
    } catch (error) {
      console.error("Failed to fetch enquiries:", error);

      setErrorMessage(
        error.message || "Unable to load enquiries."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      setUpdatingId(id);
      setErrorMessage("");
      setSuccessMessage("");

      await updateEnquiryStatus(id, status);

      setSuccessMessage(
        "Enquiry status updated successfully."
      );

      await fetchEnquiries();
    } catch (error) {
      console.error("Failed to update enquiry status:", error);

      setErrorMessage(
        error.message || "Unable to update enquiry status."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this enquiry?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(id);
      setErrorMessage("");
      setSuccessMessage("");

      await deleteEnquiry(id);

      setSuccessMessage(
        "Enquiry deleted successfully."
      );

      await fetchEnquiries();
    } catch (error) {
      console.error("Failed to delete enquiry:", error);

      setErrorMessage(
        error.message || "Unable to delete enquiry."
      );
    } finally {
      setDeletingId(null);
    }
  };

  const getStatusClasses = (status) => {
    if (status === "Contacted") {
      return "bg-blue-100 text-blue-700";
    }

    if (status === "Resolved") {
      return "bg-green-100 text-green-700";
    }

    return "bg-yellow-100 text-yellow-700";
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-green-600">
            Admin Panel
          </p>

          <h1 className="mt-2 text-3xl font-bold text-gray-900">
            Enquiry Management
          </h1>

          <p className="mt-2 text-sm text-gray-600 sm:text-base">
            View and manage customer enquiries.
          </p>
        </div>

        {/* Messages */}
        {errorMessage && (
          <div className="mb-6 rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className="mb-6 rounded-lg bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
            {successMessage}
          </div>
        )}

        {/* Summary */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Total Enquiries
            </p>

            <p className="mt-2 text-3xl font-bold text-gray-900">
              {enquiries.length}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              New
            </p>

            <p className="mt-2 text-3xl font-bold text-yellow-600">
              {
                enquiries.filter(
                  (enquiry) => enquiry.status === "New"
                ).length
              }
            </p>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Contacted
            </p>

            <p className="mt-2 text-3xl font-bold text-blue-600">
              {
                enquiries.filter(
                  (enquiry) => enquiry.status === "Contacted"
                ).length
              }
            </p>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Resolved
            </p>

            <p className="mt-2 text-3xl font-bold text-green-600">
              {
                enquiries.filter(
                  (enquiry) => enquiry.status === "Resolved"
                ).length
              }
            </p>
          </div>
        </div>

        {/* Enquiry Section Header */}
        <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Customer Enquiries
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Manage submitted customer enquiries and their status.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchEnquiries}
            disabled={isLoading}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? "Loading..." : "Refresh"}
          </button>
        </div>

        {/* Enquiry List */}
        {isLoading ? (
          <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
            <p className="text-sm text-gray-500">
              Loading enquiries...
            </p>
          </div>
        ) : enquiries.length === 0 ? (
          <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
            <p className="text-lg font-semibold text-gray-800">
              No enquiries found.
            </p>

            <p className="mt-2 text-sm text-gray-500">
              Customer enquiries will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {enquiries.map((enquiry) => (
              <div
                key={enquiry._id}
                className="rounded-2xl bg-white p-6 shadow-sm sm:p-8"
              >
                {/* Enquiry Header */}
                <div className="flex flex-col justify-between gap-4 border-b border-gray-100 pb-5 lg:flex-row lg:items-start">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-xl font-bold text-gray-900">
                        {enquiry.name}
                      </h2>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(
                          enquiry.status
                        )}`}
                      >
                        {enquiry.status}
                      </span>
                    </div>

                    <p className="mt-2 text-xs text-gray-500">
                      Submitted:{" "}
                      {new Date(
                        enquiry.createdAt
                      ).toLocaleString()}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDelete(enquiry._id)}
                    disabled={deletingId === enquiry._id}
                    className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {deletingId === enquiry._id
                      ? "Deleting..."
                      : "Delete"}
                  </button>
                </div>

                {/* Customer Details */}
                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Email
                    </p>

                    <p className="mt-1 break-all text-sm font-medium text-gray-800">
                      {enquiry.email}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Phone
                    </p>

                    <p className="mt-1 text-sm font-medium text-gray-800">
                      {enquiry.phone}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Status
                    </p>

                    <select
                      value={enquiry.status}
                      onChange={(event) =>
                        handleStatusChange(
                          enquiry._id,
                          event.target.value
                        )
                      }
                      disabled={updatingId === enquiry._id}
                      className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-800 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {statusOptions.map((status) => (
                        <option
                          key={status}
                          value={status}
                        >
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Customer Message */}
                <div className="mt-6 rounded-xl bg-gray-50 p-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Customer Message
                  </p>

                  <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-gray-700">
                    {enquiry.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default AdminEnquiries;