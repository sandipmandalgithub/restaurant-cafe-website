import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import useCustomerAuth from "../context/useCustomerAuth";
import { getCustomerReservations } from "../services/reservationService";

function CustomerReservations() {
  const { token } = useCustomerAuth();

  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadReservations = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await getCustomerReservations(token);

        if (response.success) {
          setReservations(response.data || []);
        } else {
          setError(
            response.message ||
              "Failed to load your reservations."
          );
        }
      } catch (error) {
        console.error(
          "Customer reservation history error:",
          error
        );

        setError(
          error.message ||
            "Unable to load your reservations. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    loadReservations();
  }, [token]);

  const formatDate = (date) => {
    if (!date) {
      return "N/A";
    }

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusClasses = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-700";

      case "Confirmed":
        return "bg-blue-100 text-blue-700";

      case "Rejected":
        return "bg-red-100 text-red-700";

      case "Completed":
        return "bg-green-100 text-green-700";

      case "Cancelled":
        return "bg-gray-100 text-gray-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-orange-500" />

          <p className="mt-4 text-sm text-gray-600">
            Loading your reservations...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-160px)] bg-gray-50 px-4 py-10 sm:py-14">
      <div className="mx-auto w-full max-w-5xl">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            My Reservations
          </h1>

          <p className="mt-2 text-sm text-gray-600 sm:text-base">
            View your CaféNest table reservation history and
            reservation status.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Empty State */}
        {!error && reservations.length === 0 && (
          <div className="rounded-2xl bg-white px-6 py-12 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 text-2xl">
              🍽️
            </div>

            <h2 className="mt-5 text-xl font-semibold text-gray-900">
              No reservations yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-600">
              You haven't made any table reservations yet.
              Reserve a table at CaféNest for your next visit.
            </p>

            <Link
              to="/reservation"
              className="mt-6 inline-flex rounded-lg bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
            >
              Reserve a Table
            </Link>
          </div>
        )}

        {/* Reservations */}
        {reservations.length > 0 && (
          <div className="space-y-6">
            {reservations.map((reservation) => (
              <div
                key={reservation._id}
                className="overflow-hidden rounded-2xl bg-white shadow-sm"
              >
                {/* Reservation Header */}
                <div className="border-b border-gray-100 px-4 py-5 sm:px-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                        Reservation ID
                      </p>

                      <p className="mt-1 break-all text-sm font-semibold text-gray-900">
                        {reservation._id}
                      </p>
                    </div>

                    <span
                      className={`w-fit rounded-full px-3 py-1.5 text-xs font-semibold ${getStatusClasses(
                        reservation.status
                      )}`}
                    >
                      {reservation.status}
                    </span>
                  </div>
                </div>

                {/* Reservation Details */}
                <div className="px-4 py-5 sm:px-6">
                  <div className="grid gap-5 sm:grid-cols-2">
                    {/* Date */}
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                        Reservation Date
                      </p>

                      <p className="mt-1 text-sm font-semibold text-gray-900">
                        {formatDate(
                          reservation.reservationDate
                        )}
                      </p>
                    </div>

                    {/* Time */}
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                        Reservation Time
                      </p>

                      <p className="mt-1 text-sm font-semibold text-gray-900">
                        {reservation.reservationTime || "N/A"}
                      </p>
                    </div>

                    {/* Guests */}
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                        Guests
                      </p>

                      <p className="mt-1 text-sm font-semibold text-gray-900">
                        {reservation.guests || 0}{" "}
                        {Number(reservation.guests) === 1
                          ? "Guest"
                          : "Guests"}
                      </p>
                    </div>

                    {/* Mobile */}
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                        Mobile
                      </p>

                      <p className="mt-1 break-all text-sm font-semibold text-gray-900">
                        {reservation.customer?.mobile ||
                          "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Special Request */}
                {reservation.specialRequest && (
                  <div className="border-t border-gray-100 px-4 py-5 sm:px-6">
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                      Special Request
                    </p>

                    <p className="mt-2 text-sm leading-6 text-gray-700">
                      {reservation.specialRequest}
                    </p>
                  </div>
                )}

                {/* Admin Note */}
                {reservation.adminNote && (
                  <div className="border-t border-gray-100 bg-orange-50 px-4 py-5 sm:px-6">
                    <p className="text-xs font-semibold uppercase tracking-wide text-orange-700">
                      CaféNest Note
                    </p>

                    <p className="mt-2 text-sm leading-6 text-orange-800">
                      {reservation.adminNote}
                    </p>
                  </div>
                )}

                {/* Footer */}
                <div className="border-t border-gray-100 bg-gray-50 px-4 py-4 sm:px-6">
                  <div className="flex flex-col gap-2 text-xs text-gray-500 sm:flex-row sm:items-center sm:justify-between">
                    <span>
                      Requested on{" "}
                      {formatDate(reservation.createdAt)}
                    </span>

                    {reservation.updatedAt &&
                      reservation.updatedAt !==
                        reservation.createdAt && (
                        <span>
                          Last updated{" "}
                          {formatDate(reservation.updatedAt)}
                        </span>
                      )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bottom CTA */}
        {reservations.length > 0 && (
          <div className="mt-8 text-center">
            <Link
              to="/reservation"
              className="inline-flex rounded-lg bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
            >
              Reserve Another Table
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default CustomerReservations;
