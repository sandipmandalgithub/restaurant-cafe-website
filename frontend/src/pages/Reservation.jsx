import { useState } from "react";

import useCustomerAuth from "../context/useCustomerAuth";

import { createReservation } from "../services/reservationService";

const Reservation = () => {
  const { customer, token, isAuthenticated } = useCustomerAuth();

  const [formData, setFormData] = useState({
    name: customer?.name || "",
    mobile: customer?.phone || "",
    email: customer?.email || "",
    reservationDate: "",
    reservationTime: "",
    guests: "2",
    specialRequest: "",
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const today = new Date().toISOString().split("T")[0];

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));

    setSuccessMessage("");
    setErrorMessage("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSuccessMessage("");
    setErrorMessage("");

    if (!formData.name.trim()) {
      setErrorMessage("Please enter your name.");
      return;
    }

    if (!formData.mobile.trim()) {
      setErrorMessage("Please enter your mobile number.");
      return;
    }

    if (!formData.reservationDate) {
      setErrorMessage("Please select a reservation date.");
      return;
    }

    if (!formData.reservationTime) {
      setErrorMessage("Please select a reservation time.");
      return;
    }

    if (!formData.guests) {
      setErrorMessage("Please select the number of guests.");
      return;
    }

    const guestCount = Number(formData.guests);

    if (!Number.isInteger(guestCount) || guestCount < 1) {
      setErrorMessage("Number of guests must be at least 1.");
      return;
    }

    if (guestCount > 20) {
      setErrorMessage("Maximum 20 guests are allowed.");
      return;
    }

    try {
      setLoading(true);

      const response = await createReservation(
        {
          name: formData.name.trim(),
          mobile: formData.mobile.trim(),
          email: formData.email.trim(),
          reservationDate: formData.reservationDate,
          reservationTime: formData.reservationTime,
          guests: guestCount,
          specialRequest: formData.specialRequest.trim(),
        },
        isAuthenticated ? token : null
      );

      if (!response.success) {
        setErrorMessage(
          response.message ||
            "Unable to create reservation. Please try again."
        );

        return;
      }

      setSuccessMessage(
        "Your table reservation request has been submitted successfully!"
      );

      setFormData({
        name: customer?.name || "",
        mobile: customer?.phone || "",
        email: customer?.email || "",
        reservationDate: "",
        reservationTime: "",
        guests: "2",
        specialRequest: "",
      });
    } catch (error) {
      console.error("Reservation submission error:", error);

      setErrorMessage(
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-orange-600">
            Book a Table
          </p>

          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Reserve Your Table
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-gray-600 sm:text-base">
            Plan your visit to CaféNest and reserve a table in advance.
            Guests and registered customers can both make reservations.
          </p>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-md sm:p-8">
          {successMessage && (
            <div
              className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700"
              role="alert"
            >
              {successMessage}
            </div>
          )}

          {errorMessage && (
            <div
              className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
              role="alert"
            >
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Full Name
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  autoComplete="name"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                />
              </div>

              <div>
                <label
                  htmlFor="mobile"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Mobile Number
                </label>

                <input
                  id="mobile"
                  name="mobile"
                  type="tel"
                  value={formData.mobile}
                  onChange={handleChange}
                  placeholder="Enter your mobile number"
                  autoComplete="tel"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Email Address
                  <span className="ml-1 text-xs text-gray-400">
                    (Optional)
                  </span>
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email address"
                  autoComplete="email"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                />
              </div>

              <div>
                <label
                  htmlFor="guests"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Number of Guests
                </label>

                <select
                  id="guests"
                  name="guests"
                  value={formData.guests}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                >
                  {Array.from({ length: 20 }, (_, index) => {
                    const guestNumber = index + 1;

                    return (
                      <option
                        key={guestNumber}
                        value={guestNumber}
                      >
                        {guestNumber}{" "}
                        {guestNumber === 1 ? "Guest" : "Guests"}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div>
                <label
                  htmlFor="reservationDate"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Reservation Date
                </label>

                <input
                  id="reservationDate"
                  name="reservationDate"
                  type="date"
                  min={today}
                  value={formData.reservationDate}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                />
              </div>

              <div>
                <label
                  htmlFor="reservationTime"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Reservation Time
                </label>

                <input
                  id="reservationTime"
                  name="reservationTime"
                  type="time"
                  value={formData.reservationTime}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="specialRequest"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Special Request
                <span className="ml-1 text-xs text-gray-400">
                  (Optional)
                </span>
              </label>

              <textarea
                id="specialRequest"
                name="specialRequest"
                rows="4"
                maxLength="500"
                value={formData.specialRequest}
                onChange={handleChange}
                placeholder="Birthday celebration, window-side table, special occasion, etc."
                className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              />

              <p className="mt-1 text-right text-xs text-gray-400">
                {formData.specialRequest.length}/500
              </p>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-orange-600 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                {loading
                  ? "Submitting Reservation..."
                  : "Reserve My Table"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default Reservation;