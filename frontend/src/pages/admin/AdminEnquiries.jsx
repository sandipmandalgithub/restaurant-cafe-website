import { useEffect, useMemo, useState } from "react";

import {
  deleteEnquiry,
  getEnquiries,
  updateEnquiryStatus,
} from "../../services/enquiryService";

const statusOptions = ["New", "Contacted", "Resolved"];

function AdminEnquiries() {
  const [enquiries, setEnquiries] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");

  // Initial data fetch
  useEffect(() => {
    let isMounted = true;

    const loadEnquiries = async () => {
      try {
        const data = await getEnquiries();

        if (isMounted) {
          setEnquiries(data);
          setErrorMessage("");
        }
      } catch (error) {
        console.error("Failed to fetch enquiries:", error);

        if (isMounted) {
          setErrorMessage(
            error.message || "Unable to load enquiries."
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadEnquiries();

    return () => {
      isMounted = false;
    };
  }, []);

  // Manual refresh
  const handleRefresh = async () => {
    try {
      setIsLoading(true);
      setErrorMessage("");
      setSuccessMessage("");

      const data = await getEnquiries();

      setEnquiries(data);
    } catch (error) {
      console.error("Failed to refresh enquiries:", error);

      setErrorMessage(
        error.message || "Unable to refresh enquiries."
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

      const updatedEnquiry = await updateEnquiryStatus(id, status);

      setEnquiries((currentEnquiries) =>
        currentEnquiries.map((enquiry) =>
          enquiry._id === id ? updatedEnquiry : enquiry
        )
      );

      setSuccessMessage(
        "Enquiry status updated successfully."
      );
    } catch (error) {
      console.error(
        "Failed to update enquiry status:",
        error
      );

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

      setEnquiries((currentEnquiries) =>
        currentEnquiries.filter(
          (enquiry) => enquiry._id !== id
        )
      );

      setSuccessMessage(
        "Enquiry deleted successfully."
      );
    } catch (error) {
      console.error("Failed to delete enquiry:", error);

      setErrorMessage(
        error.message || "Unable to delete enquiry."
      );
    } finally {
      setDeletingId(null);
    }
  };

  // ======================================================
  // Reply to Customer on WhatsApp
  // ======================================================
  const handleWhatsAppReply = (enquiry) => {
    if (!enquiry.phone) {
      setErrorMessage(
        "Customer phone number is not available for WhatsApp."
      );
      setSuccessMessage("");
      return;
    }

    // Keep only numbers from the phone value.
    let phoneNumber = enquiry.phone.replace(/\D/g, "");

    // Convert Indian 10-digit number to international format.
    if (phoneNumber.length === 10) {
      phoneNumber = `91${phoneNumber}`;
    }

    // Remove leading 0 if the customer entered 0XXXXXXXXXX.
    if (
      phoneNumber.length === 11 &&
      phoneNumber.startsWith("0")
    ) {
      phoneNumber = `91${phoneNumber.substring(1)}`;
    }

    if (phoneNumber.length < 12) {
      setErrorMessage(
        "Please check the customer's phone number before opening WhatsApp."
      );
      setSuccessMessage("");
      return;
    }

    const message = `Hello ${enquiry.name},

Thank you for contacting CaféNest.

We received your enquiry:

"${enquiry.message}"

Our team would be happy to assist you.

Please let us know if you have any further questions.

Thank you,
CaféNest Team`;

    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message
    )}`;

    window.open(
      whatsappUrl,
      "_blank",
      "noopener,noreferrer"
    );

    setErrorMessage("");
    setSuccessMessage(
      `WhatsApp opened for ${enquiry.name}.`
    );
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

  const filteredEnquiries = useMemo(() => {
    const normalizedSearch = searchTerm
      .trim()
      .toLowerCase();

    return enquiries.filter((enquiry) => {
      const matchesSearch =
        !normalizedSearch ||
        enquiry.name
          ?.toLowerCase()
          .includes(normalizedSearch) ||
        enquiry.email
          ?.toLowerCase()
          .includes(normalizedSearch) ||
        enquiry.phone
          ?.toLowerCase()
          .includes(normalizedSearch) ||
        enquiry.message
          ?.toLowerCase()
          .includes(normalizedSearch);

      const matchesStatus =
        selectedStatus === "All" ||
        enquiry.status === selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }, [enquiries, searchTerm, selectedStatus]);

  const newCount = enquiries.filter(
    (enquiry) => enquiry.status === "New"
  ).length;

  const contactedCount = enquiries.filter(
    (enquiry) => enquiry.status === "Contacted"
  ).length;

  const resolvedCount = enquiries.filter(
    (enquiry) => enquiry.status === "Resolved"
  ).length;

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedStatus("All");
  };

  const hasActiveFilters =
    searchTerm.trim() !== "" ||
    selectedStatus !== "All";

  return (
    <div className="min-h-screen overflow-x-hidden bg-gray-100">
      <main className="mx-auto w-full max-w-7xl px-3 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        {/* Page Header */}
        <div className="mb-6 sm:mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-green-600 sm:text-sm sm:tracking-widest">
            Admin Panel
          </p>

          <div className="mt-2 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
            <div className="min-w-0">
              <h1 className="text-2xl font-bold leading-tight text-gray-900 sm:text-3xl lg:text-4xl">
                Enquiry Management
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600 sm:text-base">
                View, search, filter, and manage customer
                enquiries.
              </p>
            </div>

            <button
              type="button"
              onClick={handleRefresh}
              disabled={isLoading}
              className="min-h-11 w-full shrink-0 rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-200 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              {isLoading ? "Loading..." : "Refresh"}
            </button>
          </div>
        </div>

        {/* Messages */}
        {errorMessage && (
          <div
            role="alert"
            className="mb-5 break-words rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium leading-6 text-red-700 sm:mb-6"
          >
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div
            role="status"
            className="mb-5 break-words rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium leading-6 text-green-700 sm:mb-6"
          >
            {successMessage}
          </div>
        )}

        {/* Summary Cards */}
        <div className="mb-7 grid gap-4 sm:mb-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl bg-white p-4 shadow-sm sm:p-5">
            <p className="text-sm font-medium text-gray-500">
              Total Enquiries
            </p>

            <p className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl">
              {enquiries.length}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-4 shadow-sm sm:p-5">
            <p className="text-sm font-medium text-gray-500">
              New
            </p>

            <p className="mt-2 text-2xl font-bold text-yellow-600 sm:text-3xl">
              {newCount}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-4 shadow-sm sm:p-5">
            <p className="text-sm font-medium text-gray-500">
              Contacted
            </p>

            <p className="mt-2 text-2xl font-bold text-blue-600 sm:text-3xl">
              {contactedCount}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-4 shadow-sm sm:p-5">
            <p className="text-sm font-medium text-gray-500">
              Resolved
            </p>

            <p className="mt-2 text-2xl font-bold text-green-600 sm:text-3xl">
              {resolvedCount}
            </p>
          </div>
        </div>

        {/* Search and Filters */}
        <section className="mb-7 rounded-2xl bg-white p-4 shadow-sm sm:mb-8 sm:p-6">
          <div className="mb-5">
            <h2 className="text-lg font-bold text-gray-900 sm:text-xl">
              Search & Filter
            </h2>

            <p className="mt-1 text-sm leading-6 text-gray-500">
              Find enquiries by customer details or filter
              them by status.
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px_auto]">
            <div className="min-w-0">
              <label
                htmlFor="enquiry-search"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Search
              </label>

              <input
                id="enquiry-search"
                type="text"
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(event.target.value)
                }
                placeholder="Search name, email, phone or message..."
                className="min-h-11 w-full min-w-0 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-green-500 focus:ring-2 focus:ring-green-100"
              />
            </div>

            <div className="min-w-0">
              <label
                htmlFor="status-filter"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Status
              </label>

              <select
                id="status-filter"
                value={selectedStatus}
                onChange={(event) =>
                  setSelectedStatus(event.target.value)
                }
                className="min-h-11 w-full min-w-0 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-800 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
              >
                <option value="All">All Statuses</option>

                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button
                type="button"
                onClick={clearFilters}
                disabled={!hasActiveFilters}
                className="min-h-11 w-full rounded-lg border border-gray-300 bg-gray-50 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-200 disabled:cursor-not-allowed disabled:opacity-50 lg:w-auto"
              >
                Clear Filters
              </button>
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-1 border-t border-gray-100 pt-5 text-sm sm:flex-row sm:items-center sm:justify-between">
            <p className="text-gray-600">
              Showing{" "}
              <span className="font-bold text-gray-900">
                {filteredEnquiries.length}
              </span>{" "}
              of{" "}
              <span className="font-bold text-gray-900">
                {enquiries.length}
              </span>{" "}
              enquiries
            </p>

            {hasActiveFilters && (
              <p className="font-medium text-green-600">
                Filters are active
              </p>
            )}
          </div>
        </section>

        {/* Enquiry List */}
        {isLoading ? (
          <div className="rounded-2xl bg-white px-5 py-10 text-center shadow-sm sm:p-10">
            <p className="text-sm font-medium text-gray-500">
              Loading enquiries...
            </p>
          </div>
        ) : enquiries.length === 0 ? (
          <div className="rounded-2xl bg-white px-5 py-10 text-center shadow-sm sm:p-10">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-2xl">
              ✉️
            </div>

            <p className="mt-5 text-lg font-semibold text-gray-800">
              No enquiries found.
            </p>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
              Customer enquiries will appear here when
              submitted.
            </p>
          </div>
        ) : filteredEnquiries.length === 0 ? (
          <div className="rounded-2xl bg-white px-5 py-10 text-center shadow-sm sm:p-10">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-2xl">
              🔎
            </div>

            <p className="mt-5 text-lg font-semibold text-gray-800">
              No matching enquiries
            </p>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
              Try changing your search term or status
              filter.
            </p>

            <button
              type="button"
              onClick={clearFilters}
              className="mt-5 min-h-11 rounded-lg bg-green-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-300 focus:ring-offset-1"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="space-y-5 sm:space-y-6">
            {filteredEnquiries.map((enquiry) => (
              <article
                key={enquiry._id}
                className="min-w-0 overflow-hidden rounded-2xl bg-white shadow-sm"
              >
                {/* Enquiry Header */}
                <div className="border-b border-gray-100 p-4 sm:p-6">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
                        <h2 className="max-w-full break-words text-lg font-bold text-gray-900 sm:text-xl">
                          {enquiry.name}
                        </h2>

                        <span
                          className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold ${getStatusClasses(
                            enquiry.status
                          )}`}
                        >
                          {enquiry.status}
                        </span>
                      </div>

                      <p className="mt-2 break-words text-xs leading-5 text-gray-500">
                        Submitted:{" "}
                        {new Date(
                          enquiry.createdAt
                        ).toLocaleString()}
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid w-full gap-2 sm:grid-cols-2 lg:flex lg:w-auto">
                      {/* WhatsApp Reply Button */}
                      <button
                        type="button"
                        onClick={() =>
                          handleWhatsAppReply(enquiry)
                        }
                        className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 lg:w-auto"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="h-5 w-5 shrink-0"
                          aria-hidden="true"
                        >
                          <path d="M20.52 3.48A11.82 11.82 0 0 0 12.06 0C5.52 0 .2 5.31.2 11.86c0 2.09.55 4.13 1.59 5.93L.1 24l6.36-1.67a11.85 11.85 0 0 0 5.6 1.43h.01c6.54 0 11.86-5.32 11.86-11.86 0-3.17-1.23-6.14-3.41-8.42ZM12.07 21.72h-.01a9.84 9.84 0 0 1-5.02-1.38l-.36-.21-3.77.99 1.01-3.67-.23-.38a9.85 9.85 0 0 1-1.51-5.21c0-5.43 4.42-9.85 9.86-9.85 2.63 0 5.1 1.03 6.96 2.89a9.79 9.79 0 0 1 2.89 6.97c0 5.43-4.42 9.85-9.82 9.85Zm5.4-7.38c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.47-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.05 1.02-1.05 2.49s1.07 2.89 1.22 3.09c.15.2 2.1 3.2 5.09 4.49.71.31 1.27.49 1.7.63.71.23 1.35.2 1.86.12.57-.08 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35Z" />
                        </svg>

                        <span>Reply on WhatsApp</span>
                      </button>

                      {/* Delete Button */}
                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(enquiry._id)
                        }
                        disabled={
                          deletingId === enquiry._id
                        }
                        className="min-h-11 w-full rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-60 lg:w-auto"
                      >
                        {deletingId === enquiry._id
                          ? "Deleting..."
                          : "Delete"}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Customer Details */}
                <div className="grid gap-5 p-4 sm:grid-cols-2 sm:p-6 lg:grid-cols-3">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Name
                    </p>

                    <p className="mt-1 break-words text-sm font-medium leading-6 text-gray-800">
                      {enquiry.name}
                    </p>
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Email
                    </p>

                    <p className="mt-1 break-all text-sm font-medium leading-6 text-gray-800">
                      {enquiry.email}
                    </p>
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Phone
                    </p>

                    <p className="mt-1 break-words text-sm font-medium leading-6 text-gray-800">
                      {enquiry.phone}
                    </p>
                  </div>

                  {/* Status Update */}
                  <div className="min-w-0 sm:col-span-2 lg:col-span-3">
                    <label
                      htmlFor={`status-${enquiry._id}`}
                      className="text-xs font-semibold uppercase tracking-wide text-gray-400"
                    >
                      Update Status
                    </label>

                    <select
                      id={`status-${enquiry._id}`}
                      value={enquiry.status}
                      onChange={(event) =>
                        handleStatusChange(
                          enquiry._id,
                          event.target.value
                        )
                      }
                      disabled={
                        updatingId === enquiry._id
                      }
                      className="mt-2 min-h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm font-medium text-gray-800 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100 disabled:cursor-not-allowed disabled:opacity-60 sm:max-w-xs"
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

                    {updatingId === enquiry._id && (
                      <p className="mt-2 text-xs text-gray-500">
                        Updating status...
                      </p>
                    )}
                  </div>
                </div>

                {/* Customer Message */}
                <div className="px-4 pb-4 sm:px-6 sm:pb-6">
                  <div className="rounded-xl bg-gray-50 p-4 sm:p-5">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Customer Message
                    </p>

                    <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-gray-700">
                      {enquiry.message}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default AdminEnquiries;
