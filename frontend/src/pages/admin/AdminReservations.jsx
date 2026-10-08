import { useEffect, useMemo, useState } from "react";

const API_URL = `${import.meta.env.VITE_API_URL}/api/reservations`;

const STATUS_OPTIONS = [
  "Pending",
  "Confirmed",
  "Rejected",
  "Completed",
  "Cancelled",
];

function AdminReservations() {
  const [reservations, setReservations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingReservationId, setUpdatingReservationId] =
    useState(null);
  const [deletingReservationId, setDeletingReservationId] =
    useState(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [reservationDate, setReservationDate] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const getAuthHeaders = () => {
    const token = localStorage.getItem("adminToken");

    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "-";
    }

    return new Intl.DateTimeFormat("en-IN", {
      dateStyle: "medium",
    }).format(parsedDate);
  };

  const formatDateTime = (date) => {
    if (!date) {
      return "-";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "-";
    }

    return new Intl.DateTimeFormat("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(parsedDate);
  };

  const getStatusClasses = (status) => {
    switch (status) {
      case "Confirmed":
        return "border border-blue-200 bg-blue-50 text-blue-700";

      case "Rejected":
        return "border border-red-200 bg-red-50 text-red-700";

      case "Completed":
        return "border border-green-200 bg-green-50 text-green-700";

      case "Cancelled":
        return "border border-gray-200 bg-gray-100 text-gray-700";

      case "Pending":
      default:
        return "border border-yellow-200 bg-yellow-50 text-yellow-700";
    }
  };

  const getStatusDotClasses = (status) => {
    switch (status) {
      case "Confirmed":
        return "bg-blue-500";

      case "Rejected":
        return "bg-red-500";

      case "Completed":
        return "bg-green-500";

      case "Cancelled":
        return "bg-gray-500";

      case "Pending":
      default:
        return "bg-yellow-500";
    }
  };

  const fetchReservations = async () => {
    try {
      setIsLoading(true);
      setError("");

      const response = await fetch(API_URL, {
        method: "GET",
        headers: getAuthHeaders(),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to fetch reservations."
        );
      }

      setReservations(result.data || []);
    } catch (error) {
      console.error(
        "Fetch reservations error:",
        error
      );

      setError(
        error.message ||
          "Something went wrong while loading reservations."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const loadReservations = async () => {
      try {
        const token = localStorage.getItem("adminToken");

        const response = await fetch(API_URL, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.message ||
              "Failed to fetch reservations."
          );
        }

        if (isMounted) {
          setReservations(result.data || []);
          setError("");
          setIsLoading(false);
        }
      } catch (error) {
        console.error(
          "Fetch reservations error:",
          error
        );

        if (isMounted) {
          setError(
            error.message ||
              "Something went wrong while loading reservations."
          );
          setIsLoading(false);
        }
      }
    };

    loadReservations();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleStatusChange = async (
    reservationId,
    status
  ) => {
    try {
      setUpdatingReservationId(reservationId);
      setError("");

      const response = await fetch(
        `${API_URL}/${reservationId}/status`,
        {
          method: "PATCH",
          headers: getAuthHeaders(),
          body: JSON.stringify({
            status,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Failed to update reservation status."
        );
      }

      setReservations((previousReservations) =>
        previousReservations.map((reservation) =>
          reservation._id === reservationId
            ? {
                ...reservation,
                status: result.data.status,
                adminNote:
                  result.data.adminNote ??
                  reservation.adminNote,
                updatedAt:
                  result.data.updatedAt ??
                  reservation.updatedAt,
              }
            : reservation
        )
      );
    } catch (error) {
      console.error(
        "Update reservation status error:",
        error
      );

      setError(
        error.message ||
          "Failed to update reservation status."
      );
    } finally {
      setUpdatingReservationId(null);
    }
  };

  const handleDeleteReservation = async (
    reservationId
  ) => {
    const shouldDelete = window.confirm(
      "Are you sure you want to delete this reservation?"
    );

    if (!shouldDelete) {
      return;
    }

    try {
      setDeletingReservationId(reservationId);
      setError("");

      const response = await fetch(
        `${API_URL}/${reservationId}`,
        {
          method: "DELETE",
          headers: getAuthHeaders(),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Failed to delete reservation."
        );
      }

      setReservations((previousReservations) =>
        previousReservations.filter(
          (reservation) =>
            reservation._id !== reservationId
        )
      );
    } catch (error) {
      console.error(
        "Delete reservation error:",
        error
      );

      setError(
        error.message ||
          "Failed to delete reservation."
      );
    } finally {
      setDeletingReservationId(null);
    }
  };

  const reservationStats = useMemo(() => {
    return {
      total: reservations.length,

      pending: reservations.filter(
        (reservation) =>
          reservation.status === "Pending"
      ).length,

      confirmed: reservations.filter(
        (reservation) =>
          reservation.status === "Confirmed"
      ).length,

      completed: reservations.filter(
        (reservation) =>
          reservation.status === "Completed"
      ).length,
    };
  }, [reservations]);

  // Filtered reservations
  const filteredReservations = useMemo(() => {
    const normalizedSearch = searchTerm
      .trim()
      .toLowerCase();

    return reservations.filter((reservation) => {
      const customerName =
        reservation.customer?.name?.toLowerCase() || "";

      const customerMobile =
        reservation.customer?.mobile?.toLowerCase() || "";

      const customerEmail =
        reservation.customer?.email?.toLowerCase() || "";

      const matchesSearch =
        !normalizedSearch ||
        customerName.includes(normalizedSearch) ||
        customerMobile.includes(normalizedSearch) ||
        customerEmail.includes(normalizedSearch);

      const matchesDate =
        !reservationDate ||
        (() => {
          if (!reservation.reservationDate) {
            return false;
          }

          const parsedDate = new Date(
            reservation.reservationDate
          );

          if (Number.isNaN(parsedDate.getTime())) {
            return false;
          }

          const year = parsedDate.getFullYear();
          const month = String(
            parsedDate.getMonth() + 1
          ).padStart(2, "0");
          const day = String(
            parsedDate.getDate()
          ).padStart(2, "0");

          return `${year}-${month}-${day}` ===
            reservationDate;
        })();

      const matchesStatus =
        statusFilter === "All" ||
        reservation.status === statusFilter;

      return (
        matchesSearch &&
        matchesDate &&
        matchesStatus
      );
    });
  }, [
    reservations,
    searchTerm,
    reservationDate,
    statusFilter,
  ]);

  const hasActiveFilters =
    searchTerm.trim() !== "" ||
    reservationDate !== "" ||
    statusFilter !== "All";

  const clearFilters = () => {
    setSearchTerm("");
    setReservationDate("");
    setStatusFilter("All");
  };

  const stats = [
    {
      label: "Total Reservations",
      value: reservationStats.total,
      icon: "🍽️",
      iconBg: "bg-gray-100",
      valueColor: "text-gray-900",
    },
    {
      label: "Pending",
      value: reservationStats.pending,
      icon: "⏳",
      iconBg: "bg-yellow-50",
      valueColor: "text-yellow-600",
    },
    {
      label: "Confirmed",
      value: reservationStats.confirmed,
      icon: "✓",
      iconBg: "bg-blue-50",
      valueColor: "text-blue-600",
    },
    {
      label: "Completed",
      value: reservationStats.completed,
      icon: "✓",
      iconBg: "bg-green-50",
      valueColor: "text-green-600",
    },
  ];

  return (
    <div className="min-h-screen overflow-x-hidden bg-gray-50">
      <main className="mx-auto w-full max-w-7xl px-3 py-5 sm:px-5 sm:py-7 lg:px-8 lg:py-9">
        {/* Page Header */}
        <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6 lg:p-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-amber-500" />

                <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-600 sm:text-sm">
                  Admin Panel
                </p>
              </div>

              <h1 className="mt-2 break-words text-2xl font-bold leading-tight text-gray-900 sm:text-3xl lg:text-4xl">
                Reservations
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600 sm:text-base">
                Manage table reservations, review customer
                requests, and update reservation status.
              </p>
            </div>

            <button
              type="button"
              onClick={fetchReservations}
              disabled={isLoading}
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-800 shadow-sm transition hover:border-gray-400 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-amber-200 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              <span aria-hidden="true">↻</span>

              {isLoading
                ? "Refreshing..."
                : "Refresh Reservations"}
            </button>
          </div>
        </section>

        {/* Stats */}
        <section className="mt-5 grid grid-cols-2 gap-3 sm:mt-6 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="group rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-medium text-gray-500 sm:text-sm">
                    {stat.label}
                  </p>

                  <p
                    className={`mt-2 text-2xl font-bold sm:text-3xl ${stat.valueColor}`}
                  >
                    {stat.value}
                  </p>
                </div>

                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-base sm:h-10 sm:w-10 ${stat.iconBg}`}
                >
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Search & Filters */}
        {!isLoading &&
          !error &&
          reservations.length > 0 && (
            <section className="mt-5 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:mt-6 sm:p-5 lg:p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
                {/* Search */}
                <div className="min-w-0 flex-1">
                  <label
                    htmlFor="reservation-search"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Search Customer
                  </label>

                  <div className="relative">
                    <span
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      aria-hidden="true"
                    >
                      🔍
                    </span>

                    <input
                      id="reservation-search"
                      type="search"
                      value={searchTerm}
                      onChange={(event) =>
                        setSearchTerm(event.target.value)
                      }
                      placeholder="Name, mobile, or email..."
                      className="min-h-11 w-full rounded-xl border border-gray-300 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 hover:border-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                    />
                  </div>
                </div>

                {/* Date */}
                <div className="w-full lg:w-56">
                  <label
                    htmlFor="reservation-date"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Reservation Date
                  </label>

                  <input
                    id="reservation-date"
                    type="date"
                    value={reservationDate}
                    onChange={(event) =>
                      setReservationDate(
                        event.target.value
                      )
                    }
                    className="min-h-11 w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-800 outline-none transition hover:border-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                  />
                </div>

                {/* Status */}
                <div className="w-full lg:w-52">
                  <label
                    htmlFor="reservation-status"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Status
                  </label>

                  <select
                    id="reservation-status"
                    value={statusFilter}
                    onChange={(event) =>
                      setStatusFilter(
                        event.target.value
                      )
                    }
                    className="min-h-11 w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm font-medium text-gray-800 outline-none transition hover:border-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                  >
                    <option value="All">
                      All Statuses
                    </option>

                    {STATUS_OPTIONS.map((status) => (
                      <option
                        key={status}
                        value={status}
                      >
                        {status}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Clear */}
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="min-h-11 w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-gray-400 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-amber-200 lg:w-auto"
                  >
                    Clear Filters
                  </button>
                )}
              </div>

              <div className="mt-4 flex flex-col gap-1 border-t border-gray-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-gray-600">
                  Showing{" "}
                  <span className="font-bold text-gray-900">
                    {filteredReservations.length}
                  </span>{" "}
                  of{" "}
                  <span className="font-bold text-gray-900">
                    {reservations.length}
                  </span>{" "}
                  reservations
                </p>

                {hasActiveFilters && (
                  <p className="text-xs font-medium text-amber-600">
                    Filters are active
                  </p>
                )}
              </div>
            </section>
          )}

        {/* Error */}
        {error && (
          <div
            role="alert"
            className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4 sm:mt-6 sm:p-5"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="text-sm font-bold text-red-800">
                  Something went wrong
                </p>

                <p className="mt-1 break-words text-sm leading-6 text-red-700">
                  {error}
                </p>
              </div>

              <button
                type="button"
                onClick={fetchReservations}
                className="min-h-10 w-full shrink-0 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-1 sm:w-auto"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Loading */}
        {isLoading && (
          <div className="mt-5 rounded-2xl border border-gray-200 bg-white px-5 py-14 text-center shadow-sm sm:mt-6 sm:px-6 sm:py-16">
            <div
              className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-amber-600"
              aria-hidden="true"
            />

            <p className="mt-5 text-sm font-semibold text-gray-700">
              Loading reservations...
            </p>

            <p className="mt-1 text-xs text-gray-500">
              Please wait while we fetch the latest
              reservations.
            </p>
          </div>
        )}

        {/* Empty - No reservations */}
        {!isLoading &&
          !error &&
          reservations.length === 0 && (
            <div className="mt-5 rounded-2xl border border-gray-200 bg-white px-5 py-14 text-center shadow-sm sm:mt-6 sm:px-6 sm:py-16">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 text-3xl">
                🍽️
              </div>

              <h2 className="mt-5 text-xl font-bold text-gray-900 sm:text-2xl">
                No Reservations Yet
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-600">
                Customer table reservations will appear
                here after they submit a reservation request.
              </p>

              <button
                type="button"
                onClick={fetchReservations}
                className="mt-6 min-h-10 rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-800 transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-amber-200"
              >
                Refresh Reservations
              </button>
            </div>
          )}

        {/* No Filter Results */}
        {!isLoading &&
          !error &&
          reservations.length > 0 &&
          filteredReservations.length === 0 && (
            <div className="mt-5 rounded-2xl border border-gray-200 bg-white px-5 py-14 text-center shadow-sm sm:mt-6 sm:px-6 sm:py-16">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 text-3xl">
                🔍
              </div>

              <h2 className="mt-5 text-xl font-bold text-gray-900 sm:text-2xl">
                No Matching Reservations
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-600">
                No reservations match your current search
                or filter criteria.
              </p>

              <button
                type="button"
                onClick={clearFilters}
                className="mt-6 min-h-10 rounded-xl bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-200 focus:ring-offset-1"
              >
                Clear Filters
              </button>
            </div>
          )}

        {/* Reservations */}
        {!isLoading &&
          filteredReservations.length > 0 && (
            <section className="mt-5 space-y-5 sm:mt-6 sm:space-y-6">
              {filteredReservations.map(
                (reservation) => (
                  <article
                    key={reservation._id}
                    className="min-w-0 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
                  >
                    {/* Reservation Header */}
                    <div className="border-b border-gray-200 bg-gray-50/80 px-4 py-5 sm:px-6 sm:py-6">
                      <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2.5">
                            <h2 className="break-words text-lg font-bold text-gray-900 sm:text-xl">
                              Reservation #
                              {reservation._id
                                .slice(-6)
                                .toUpperCase()}
                            </h2>

                            <span
                              className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${getStatusClasses(
                                reservation.status
                              )}`}
                            >
                              <span
                                className={`h-1.5 w-1.5 rounded-full ${getStatusDotClasses(
                                  reservation.status
                                )}`}
                              />

                              {reservation.status}
                            </span>
                          </div>

                          <p className="mt-2 break-words text-xs leading-5 text-gray-500 sm:text-sm">
                            Requested on{" "}
                            {formatDateTime(
                              reservation.createdAt
                            )}
                          </p>
                        </div>

                        <div className="grid w-full gap-2.5 sm:grid-cols-[minmax(0,1fr)_auto] xl:flex xl:w-auto">
                          <div className="relative min-w-0">
                            <select
                              value={reservation.status}
                              onChange={(event) =>
                                handleStatusChange(
                                  reservation._id,
                                  event.target.value
                                )
                              }
                              disabled={
                                updatingReservationId ===
                                reservation._id
                              }
                              aria-label={`Update status for reservation ${reservation._id}`}
                              className="min-h-11 w-full min-w-0 appearance-none rounded-xl border border-gray-300 bg-white px-3 py-2.5 pr-9 text-sm font-semibold text-gray-800 outline-none transition hover:border-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-100 disabled:cursor-not-allowed disabled:bg-gray-100 sm:min-w-[180px]"
                            >
                              {STATUS_OPTIONS.map(
                                (status) => (
                                  <option
                                    key={status}
                                    value={status}
                                  >
                                    {updatingReservationId ===
                                      reservation._id &&
                                    status ===
                                      reservation.status
                                      ? "Updating..."
                                      : status}
                                  </option>
                                )
                              )}
                            </select>

                            <span
                              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500"
                              aria-hidden="true"
                            >
                              ▼
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              handleDeleteReservation(
                                reservation._id
                              )
                            }
                            disabled={
                              deletingReservationId ===
                              reservation._id
                            }
                            className="min-h-11 w-full rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:border-red-300 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-200 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-60 xl:w-auto"
                          >
                            {deletingReservationId ===
                            reservation._id
                              ? "Deleting..."
                              : "Delete Reservation"}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Reservation Content */}
                    <div className="p-4 sm:p-6 lg:p-7">
                      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
                        {/* Customer */}
                        <div className="min-w-0 rounded-xl border border-gray-100 bg-gray-50/70 p-4 sm:p-5">
                          <div className="flex items-center gap-2">
                            <span
                              className="text-base"
                              aria-hidden="true"
                            >
                              👤
                            </span>

                            <h3 className="text-xs font-bold uppercase tracking-wide text-gray-500 sm:text-sm">
                              Customer
                            </h3>
                          </div>

                          <div className="mt-4 space-y-2.5">
                            <p className="break-words font-semibold text-gray-900">
                              {reservation.customer
                                ?.name || "-"}
                            </p>

                            <p className="break-words text-sm leading-6 text-gray-600">
                              📞{" "}
                              {reservation.customer
                                ?.mobile || "-"}
                            </p>

                            {reservation.customer
                              ?.email && (
                              <p className="break-words text-sm leading-6 text-gray-600">
                                ✉️{" "}
                                {
                                  reservation.customer
                                    .email
                                }
                              </p>
                            )}

                            <p className="text-xs font-medium text-gray-500">
                              {reservation.customerId
                                ? "Registered Customer"
                                : "Guest Reservation"}
                            </p>
                          </div>
                        </div>

                        {/* Reservation Details */}
                        <div className="min-w-0 rounded-xl border border-gray-100 bg-gray-50/70 p-4 sm:p-5">
                          <div className="flex items-center gap-2">
                            <span
                              className="text-base"
                              aria-hidden="true"
                            >
                              📅
                            </span>

                            <h3 className="text-xs font-bold uppercase tracking-wide text-gray-500 sm:text-sm">
                              Reservation Details
                            </h3>
                          </div>

                          <div className="mt-4 space-y-3">
                            <div>
                              <p className="text-xs text-gray-500">
                                Date
                              </p>

                              <p className="mt-1 text-sm font-semibold text-gray-900">
                                {formatDate(
                                  reservation.reservationDate
                                )}
                              </p>
                            </div>

                            <div>
                              <p className="text-xs text-gray-500">
                                Time
                              </p>

                              <p className="mt-1 text-sm font-semibold text-gray-900">
                                {reservation.reservationTime ||
                                  "-"}
                              </p>
                            </div>

                            <div>
                              <p className="text-xs text-gray-500">
                                Guests
                              </p>

                              <p className="mt-1 text-sm font-semibold text-gray-900">
                                {reservation.guests ||
                                  0}{" "}
                                {Number(
                                  reservation.guests
                                ) === 1
                                  ? "Guest"
                                  : "Guests"}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Status */}
                        <div className="min-w-0 rounded-xl border border-gray-100 bg-gray-50/70 p-4 sm:p-5">
                          <div className="flex items-center gap-2">
                            <span
                              className="text-base"
                              aria-hidden="true"
                            >
                              🔔
                            </span>

                            <h3 className="text-xs font-bold uppercase tracking-wide text-gray-500 sm:text-sm">
                              Reservation Status
                            </h3>
                          </div>

                          <div className="mt-4">
                            <span
                              className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-bold ${getStatusClasses(
                                reservation.status
                              )}`}
                            >
                              <span
                                className={`h-2 w-2 rounded-full ${getStatusDotClasses(
                                  reservation.status
                                )}`}
                              />

                              {reservation.status}
                            </span>

                            <p className="mt-4 text-sm leading-6 text-gray-600">
                              Use the status selector above
                              to confirm, reject, complete,
                              or cancel this reservation.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Special Request */}
                      <div className="mt-6 border-t border-gray-200 pt-6 sm:mt-7 sm:pt-7">
                        <div className="flex items-center gap-2">
                          <span
                            className="text-base"
                            aria-hidden="true"
                          >
                            📝
                          </span>

                          <h3 className="text-xs font-bold uppercase tracking-wide text-gray-500 sm:text-sm">
                            Special Request
                          </h3>
                        </div>

                        <div className="mt-4 rounded-xl border border-gray-100 bg-gray-50/70 p-4 sm:p-5">
                          {reservation.specialRequest ? (
                            <p className="break-words text-sm leading-6 text-gray-700">
                              {
                                reservation.specialRequest
                              }
                            </p>
                          ) : (
                            <p className="text-sm leading-6 text-gray-400">
                              No special request provided.
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Admin Note */}
                      <div className="mt-6 border-t border-gray-200 pt-6 sm:mt-7 sm:pt-7">
                        <div className="flex items-center gap-2">
                          <span
                            className="text-base"
                            aria-hidden="true"
                          >
                            💬
                          </span>

                          <h3 className="text-xs font-bold uppercase tracking-wide text-gray-500 sm:text-sm">
                            Admin Note
                          </h3>
                        </div>

                        <div className="mt-4 rounded-xl border border-amber-100 bg-amber-50 p-4 sm:p-5">
                          {reservation.adminNote ? (
                            <p className="break-words text-sm leading-6 text-amber-900">
                              {reservation.adminNote}
                            </p>
                          ) : (
                            <p className="text-sm leading-6 text-amber-700">
                              No admin note added.
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Reservation Meta */}
                      <div className="mt-6 border-t border-gray-200 pt-6 sm:mt-7 sm:pt-7">
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="rounded-xl border border-gray-100 bg-gray-50/70 p-4">
                            <p className="text-xs font-bold uppercase tracking-wide text-gray-500">
                              Reservation ID
                            </p>

                            <p className="mt-2 break-all text-sm font-semibold text-gray-900">
                              {reservation._id}
                            </p>
                          </div>

                          <div className="rounded-xl border border-gray-100 bg-gray-50/70 p-4">
                            <p className="text-xs font-bold uppercase tracking-wide text-gray-500">
                              Last Updated
                            </p>

                            <p className="mt-2 text-sm font-semibold text-gray-900">
                              {formatDateTime(
                                reservation.updatedAt
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                )
              )}
            </section>
          )}
      </main>
    </div>
  );
}

export default AdminReservations;
