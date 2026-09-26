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
    <div className="min-h-screen bg-gray-100">
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-green-600">
            Admin Panel
          </p>

          <div className="mt-2 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                Enquiry Management
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600 sm:text-base">
                View, search, filter, and manage customer enquiries.
              </p>
            </div>

            <button
              type="button"
              onClick={handleRefresh}
              disabled={isLoading}
              className="w-full rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              {isLoading ? "Loading..." : "Refresh"}
            </button>
          </div>
        </div>

        {/* Messages */}
        {errorMessage && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
            {successMessage}
          </div>
        )}

        {/* Summary Cards */}
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
              {newCount}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Contacted
            </p>

            <p className="mt-2 text-3xl font-bold text-blue-600">
              {contactedCount}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Resolved
            </p>

            <p className="mt-2 text-3xl font-bold text-green-600">
              {resolvedCount}
            </p>
          </div>
        </div>

        {/* Search and Filters */}
        <section className="mb-8 rounded-2xl bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-5">
            <h2 className="text-xl font-bold text-gray-900">
              Search & Filter
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Find enquiries by customer details or filter them by status.
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-[1fr_220px_auto]">
            <div>
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
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-green-500 focus:ring-2 focus:ring-green-100"
              />
            </div>

            <div>
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
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-800 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
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
                className="w-full rounded-lg border border-gray-300 bg-gray-50 px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 lg:w-auto"
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
              <p className="text-green-600">
                Filters are active
              </p>
            )}
          </div>
        </section>

        {/* Enquiry List */}
        {isLoading ? (
          <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Loading enquiries...
            </p>
          </div>
        ) : enquiries.length === 0 ? (
          <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-2xl">
              ✉️
            </div>

            <p className="mt-5 text-lg font-semibold text-gray-800">
              No enquiries found.
            </p>

            <p className="mt-2 text-sm text-gray-500">
              Customer enquiries will appear here when submitted.
            </p>
          </div>
        ) : filteredEnquiries.length === 0 ? (
          <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-2xl">
              🔎
            </div>

            <p className="mt-5 text-lg font-semibold text-gray-800">
              No matching enquiries
            </p>

            <p className="mt-2 text-sm text-gray-500">
              Try changing your search term or status filter.
            </p>

            <button
              type="button"
              onClick={clearFilters}
              className="mt-5 rounded-lg bg-green-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredEnquiries.map((enquiry) => (
              <article
                key={enquiry._id}
                className="overflow-hidden rounded-2xl bg-white shadow-sm"
              >
                <div className="border-b border-gray-100 p-5 sm:p-6">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="break-words text-xl font-bold text-gray-900">
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
                      onClick={() =>
                        handleDelete(enquiry._id)
                      }
                      disabled={
                        deletingId === enquiry._id
                      }
                      className="w-full rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                    >
                      {deletingId === enquiry._id
                        ? "Deleting..."
                        : "Delete"}
                    </button>
                  </div>
                </div>

                <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6 lg:grid-cols-3">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Name
                    </p>

                    <p className="mt-1 break-words text-sm font-medium text-gray-800">
                      {enquiry.name}
                    </p>
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Email
                    </p>

                    <p className="mt-1 break-all text-sm font-medium text-gray-800">
                      {enquiry.email}
                    </p>
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Phone
                    </p>

                    <p className="mt-1 break-words text-sm font-medium text-gray-800">
                      {enquiry.phone}
                    </p>
                  </div>

                  <div className="sm:col-span-2 lg:col-span-3">
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
                      className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm font-medium text-gray-800 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100 disabled:cursor-not-allowed disabled:opacity-60 sm:max-w-xs"
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

                <div className="px-5 pb-5 sm:px-6 sm:pb-6">
                  <div className="rounded-xl bg-gray-50 p-5">
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
