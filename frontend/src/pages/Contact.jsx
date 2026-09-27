import { useState } from "react";

import { createEnquiry } from "../services/enquiryService";

// Replace with your CaféNest WhatsApp number.
// Example: 9876543210 -> 919876543210
const WHATSAPP_NUMBER = "919876543210";

const initialFormData = {
  name: "",
  email: "",
  phone: "",
  message: "",
};

function Contact() {
  const [formData, setFormData] = useState(initialFormData);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Stores the enquiry details after successful submission
  // so they can also be sent through WhatsApp.
  const [submittedEnquiry, setSubmittedEnquiry] = useState(null);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));

    if (successMessage) {
      setSuccessMessage("");
    }

    if (errorMessage) {
      setErrorMessage("");
    }

    if (submittedEnquiry) {
      setSubmittedEnquiry(null);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSuccessMessage("");
    setErrorMessage("");
    setSubmittedEnquiry(null);

    try {
      setIsSubmitting(true);

      const enquiryData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        message: formData.message.trim(),
      };

      await createEnquiry(enquiryData);

      // Keep a copy of the submitted details for WhatsApp.
      setSubmittedEnquiry(enquiryData);

      setSuccessMessage(
        "Thank you! Your enquiry has been submitted successfully. We will get back to you soon."
      );

      setFormData(initialFormData);
    } catch (error) {
      console.error("Failed to submit enquiry:", error);

      setErrorMessage(
        error.message ||
          "Unable to submit your enquiry. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // ======================================================
  // Send Submitted Enquiry on WhatsApp
  // ======================================================
  const handleWhatsAppEnquiry = () => {
    if (!submittedEnquiry) {
      return;
    }

    const message = `Hello CaféNest,

I have submitted an enquiry through your website.

Name: ${submittedEnquiry.name}
Email: ${submittedEnquiry.email}
Phone: ${submittedEnquiry.phone}

Message:
${submittedEnquiry.message}

Thank you!`;

    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      message
    )}`;

    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="overflow-hidden">
      {/* ==================================================
          Hero Section
      ================================================== */}
      <section className="bg-gray-900 px-4 py-16 text-white sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-400 sm:text-sm sm:tracking-widest">
            Contact Us
          </p>

          <h1 className="mx-auto mt-3 max-w-3xl text-3xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            We'd Love to Hear From You
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-6 text-gray-300 sm:text-lg sm:leading-8">
            Have a question, special request, or table enquiry? Get in touch
            with our team.
          </p>
        </div>
      </section>

      {/* ==================================================
          Contact Section
      ================================================== */}
      <section className="bg-white px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2 lg:gap-14 xl:gap-20">
          {/* ==================================================
              Contact Information
          ================================================== */}
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-600 sm:text-sm sm:tracking-widest">
              Get in Touch
            </p>

            <h2 className="mt-3 text-2xl font-bold leading-tight tracking-tight text-gray-900 sm:text-4xl">
              Contact CaféNest
            </h2>

            <p className="mt-4 max-w-xl text-sm leading-6 text-gray-600 sm:mt-5 sm:text-base sm:leading-7">
              Whether you want to know more about our menu, make a table
              enquiry, plan a celebration, or simply say hello, we're here to
              help.
            </p>

            {/* ==================================================
                Contact Cards
            ================================================== */}
            <div className="mt-7 grid gap-4 sm:mt-8 sm:grid-cols-2 lg:grid-cols-1">
              {/* Address */}
              <div className="min-w-0 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition duration-200 hover:shadow-md sm:p-5">
                <div className="flex min-w-0 items-start gap-3 sm:gap-4">
                  <div
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-xl"
                    aria-hidden="true"
                  >
                    📍
                  </div>

                  <div className="min-w-0">
                    <h3 className="font-semibold text-gray-900">
                      Address
                    </h3>

                    <p className="mt-2 break-words text-sm leading-6 text-gray-600">
                      Kolkata, West Bengal, India
                    </p>
                  </div>
                </div>
              </div>

              {/* Phone */}
              <div className="min-w-0 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition duration-200 hover:shadow-md sm:p-5">
                <div className="flex min-w-0 items-start gap-3 sm:gap-4">
                  <div
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-xl"
                    aria-hidden="true"
                  >
                    📞
                  </div>

                  <div className="min-w-0">
                    <h3 className="font-semibold text-gray-900">
                      Phone
                    </h3>

                    <a
                      href="tel:+919876543210"
                      className="mt-2 inline-flex min-h-10 max-w-full items-center break-all text-sm font-medium text-orange-600 transition hover:text-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                    >
                      +91 98765 43210
                    </a>
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="min-w-0 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition duration-200 hover:shadow-md sm:p-5">
                <div className="flex min-w-0 items-start gap-3 sm:gap-4">
                  <div
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-xl"
                    aria-hidden="true"
                  >
                    ✉️
                  </div>

                  <div className="min-w-0">
                    <h3 className="font-semibold text-gray-900">
                      Email
                    </h3>

                    <a
                      href="mailto:hello@cafenest.com"
                      className="mt-2 inline-flex min-h-10 max-w-full items-center break-all text-sm font-medium text-orange-600 transition hover:text-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                    >
                      hello@cafenest.com
                    </a>
                  </div>
                </div>
              </div>

              {/* Opening Hours */}
              <div className="min-w-0 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition duration-200 hover:shadow-md sm:p-5">
                <div className="flex min-w-0 items-start gap-3 sm:gap-4">
                  <div
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-xl"
                    aria-hidden="true"
                  >
                    🕐
                  </div>

                  <div className="min-w-0">
                    <h3 className="font-semibold text-gray-900">
                      Opening Hours
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-gray-600">
                      Monday - Sunday
                      <br />
                      10:00 AM - 10:00 PM
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* ==================================================
                Quick Actions
            ================================================== */}
            <div className="mt-7 grid gap-3 sm:mt-8 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              <a
                href="tel:+919876543210"
                className="inline-flex min-h-11 items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-800 transition hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
              >
                📞 Call Us
              </a>

              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-green-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-5 w-5 shrink-0"
                  aria-hidden="true"
                >
                  <path d="M20.52 3.48A11.84 11.84 0 0 0 12.07 0C5.54 0 .23 5.31.23 11.84c0 2.09.55 4.13 1.6 5.93L.13 24l6.38-1.67a11.82 11.82 0 0 0 5.56 1.42h.01c6.53 0 11.84-5.31 11.84-11.84 0-3.17-1.23-6.15-3.4-8.43ZM12.08 21.8h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.79.99 1.01-3.69-.23-.38a9.85 9.85 0 0 1-1.51-5.29C2.16 6.4 6.61 1.96 12.08 1.96c2.65 0 5.14 1.03 7.01 2.91a9.85 9.85 0 0 1 2.9 7.02c0 5.47-4.45 9.91-9.91 9.91Zm5.43-7.42c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.65.07-.3-.15-1.27-.47-2.42-1.49-.9-.8-1.5-1.78-1.67-2.08-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.05 1.02-1.05 2.49s1.07 2.89 1.22 3.09c.15.2 2.1 3.2 5.08 4.49.71.31 1.27.5 1.7.64.71.23 1.35.2 1.86.12.57-.08 1.76-.72 2.01-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35Z" />
                </svg>

                WhatsApp Us
              </a>
            </div>
          </div>

          {/* ==================================================
              Contact Form
          ================================================== */}
          <div className="min-w-0 rounded-2xl border border-gray-200 bg-gray-50 p-5 shadow-sm sm:p-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-600 sm:text-sm sm:tracking-widest">
                Send an Enquiry
              </p>

              <h2 className="mt-2 text-2xl font-bold leading-tight text-gray-900 sm:text-3xl">
                Send Us a Message
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                Fill out the form below and our team will get back to you.
              </p>
            </div>

            {/* ==================================================
                Success Message
            ================================================== */}
            {successMessage && (
              <div
                role="alert"
                className="mt-6 break-words rounded-xl border border-green-200 bg-green-50 px-4 py-4 text-sm font-medium leading-6 text-green-700"
              >
                {successMessage}
              </div>
            )}

            {/* ==================================================
                WhatsApp Enquiry Button
            ================================================== */}
            {submittedEnquiry && (
              <div className="mt-5 rounded-xl border border-green-200 bg-white p-4 shadow-sm sm:p-5">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-sm">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-8 w-8"
                    aria-hidden="true"
                  >
                    <path d="M20.52 3.48A11.84 11.84 0 0 0 12.07 0C5.54 0 .23 5.31.23 11.84c0 2.09.55 4.13 1.6 5.93L.13 24l6.38-1.67a11.82 11.82 0 0 0 5.56 1.42h.01c6.53 0 11.84-5.31 11.84-11.84 0-3.17-1.23-6.15-3.4-8.43ZM12.08 21.8h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.79.99 1.01-3.69-.23-.38a9.85 9.85 0 0 1-1.51-5.29C2.16 6.4 6.61 1.96 12.08 1.96c2.65 0 5.14 1.03 7.01 2.91a9.85 9.85 0 0 1 2.9 7.02c0 5.47-4.45 9.91-9.91 9.91Zm5.43-7.42c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.65.07-.3-.15-1.27-.47-2.42-1.49-.9-.8-1.5-1.78-1.67-2.08-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.05 1.02-1.05 2.49s1.07 2.89 1.22 3.09c.15.2 2.1 3.2 5.08 4.49.71.31 1.27.5 1.7.64.71.23 1.35.2 1.86.12.57-.08 1.76-.72 2.01-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35Z" />
                  </svg>
                </div>

                <h3 className="mt-4 text-center text-base font-bold leading-6 text-gray-900 sm:text-lg">
                  Send This Enquiry on WhatsApp
                </h3>

                <p className="mt-2 text-center text-sm leading-6 text-gray-600">
                  Your enquiry was submitted successfully. You can also send
                  the same details directly to CaféNest on WhatsApp.
                </p>

                <button
                  type="button"
                  onClick={handleWhatsAppEnquiry}
                  className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-green-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-5 w-5 shrink-0"
                    aria-hidden="true"
                  >
                    <path d="M20.52 3.48A11.84 11.84 0 0 0 12.07 0C5.54 0 .23 5.31.23 11.84c0 2.09.55 4.13 1.6 5.93L.13 24l6.38-1.67a11.82 11.82 0 0 0 5.56 1.42h.01c6.53 0 11.84-5.31 11.84-11.84 0-3.17-1.23-6.15-3.4-8.43ZM12.08 21.8h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.79.99 1.01-3.69-.23-.38a9.85 9.85 0 0 1-1.51-5.29C2.16 6.4 6.61 1.96 12.08 1.96c2.65 0 5.14 1.03 7.01 2.91a9.85 9.85 0 0 1 2.9 7.02c0 5.47-4.45 9.91-9.91 9.91Zm5.43-7.42c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.65.07-.3-.15-1.27-.47-2.42-1.49-.9-.8-1.5-1.78-1.67-2.08-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.05 1.02-1.05 2.49s1.07 2.89 1.22 3.09c.15.2 2.1 3.2 5.08 4.49.71.31 1.27.5 1.7.64.71.23 1.35.2 1.86.12.57-.08 1.76-.72 2.01-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35Z" />
                  </svg>

                  Send Enquiry on WhatsApp
                </button>
              </div>
            )}

            {/* ==================================================
                Error Message
            ================================================== */}
            {errorMessage && (
              <div
                role="alert"
                className="mt-6 break-words rounded-xl border border-red-200 bg-red-50 px-4 py-4 text-sm font-medium leading-6 text-red-700"
              >
                {errorMessage}
              </div>
            )}

            {/* ==================================================
                Enquiry Form
            ================================================== */}
            <form onSubmit={handleSubmit} className="mt-7 space-y-5 sm:mt-8">
              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Name
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  minLength="2"
                  maxLength="100"
                  autoComplete="name"
                  placeholder="Enter your name"
                  className="min-h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                />
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Email
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  maxLength="150"
                  autoComplete="email"
                  placeholder="Enter your email"
                  className="min-h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                />
              </div>

              {/* Phone */}
              <div>
                <label
                  htmlFor="phone"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Phone
                </label>

                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  minLength="10"
                  maxLength="15"
                  autoComplete="tel"
                  inputMode="tel"
                  placeholder="Enter your phone number"
                  className="min-h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                />
              </div>

              {/* Message */}
              <div>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Message
                  </label>

                  <span
                    className="shrink-0 text-xs text-gray-500"
                    aria-live="polite"
                  >
                    {formData.message.length}/1000
                  </span>
                </div>

                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  minLength="5"
                  maxLength="1000"
                  rows="6"
                  placeholder="Write your message..."
                  className="w-full resize-none rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm leading-6 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-orange-600 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Submitting..." : "Send Message"}
              </button>

              <p className="text-center text-xs leading-5 text-gray-500">
                Your enquiry will be securely submitted to our team.
              </p>
            </form>
          </div>
        </div>
      </section>

      {/* ==================================================
          WhatsApp CTA
      ================================================== */}
      <section className="bg-orange-50 px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-600 sm:text-sm sm:tracking-widest">
            Quick Response
          </p>

          <h2 className="mt-3 text-2xl font-bold leading-tight tracking-tight text-gray-900 sm:text-4xl">
            Prefer WhatsApp?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-gray-600 sm:text-base sm:leading-7">
            Send us a message directly on WhatsApp for a quick response from
            our team.
          </p>

          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-7 inline-flex min-h-11 w-full max-w-xs items-center justify-center gap-2 rounded-lg bg-green-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 sm:mt-8 sm:w-auto"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-5 w-5 shrink-0"
              aria-hidden="true"
            >
              <path d="M20.52 3.48A11.84 11.84 0 0 0 12.07 0C5.54 0 .23 5.31.23 11.84c0 2.09.55 4.13 1.6 5.93L.13 24l6.38-1.67a11.82 11.82 0 0 0 5.56 1.42h.01c6.53 0 11.84-5.31 11.84-11.84 0-3.17-1.23-6.15-3.4-8.43ZM12.08 21.8h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.79.99 1.01-3.69-.23-.38a9.85 9.85 0 0 1-1.51-5.29C2.16 6.4 6.61 1.96 12.08 1.96c2.65 0 5.14 1.03 7.01 2.91a9.85 9.85 0 0 1 2.9 7.02c0 5.47-4.45 9.91-9.91 9.91Zm5.43-7.42c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.65.07-.3-.15-1.27-.47-2.42-1.49-.9-.8-1.5-1.78-1.67-2.08-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.05 1.02-1.05 2.49s1.07 2.89 1.22 3.09c.15.2 2.1 3.2 5.08 4.49.71.31 1.27.5 1.7.64.71.23 1.35.2 1.86.12.57-.08 1.76-.72 2.01-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35Z" />
            </svg>

            Chat on WhatsApp
          </a>
        </div>
      </section>
    </div>
  );
}

export default Contact;
