import { useState } from "react";

import { createEnquiry } from "../services/enquiryService";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSuccessMessage("");
    setErrorMessage("");

    try {
      setIsSubmitting(true);

      await createEnquiry(formData);

      setSuccessMessage(
        "Thank you! Your enquiry has been submitted successfully."
      );

      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
      });
    } catch (error) {
      console.error("Failed to submit enquiry:", error);

      setErrorMessage(
        "Unable to submit your enquiry. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gray-900 px-4 py-20 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-orange-400">
            Contact Us
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
            We'd Love to Hear From You
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-gray-300 sm:text-lg">
            Have a question, special request, or table enquiry? Get in touch
            with our team.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-white px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2">
          {/* Contact Information */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-orange-600">
              Get in Touch
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Contact CaféNest
            </h2>

            <p className="mt-5 max-w-xl leading-7 text-gray-600">
              Whether you want to know more about our menu, make a table
              enquiry, plan a celebration, or simply say hello, we're here to
              help.
            </p>

            <div className="mt-8 space-y-6">
              <div className="rounded-xl border border-gray-200 p-5">
                <h3 className="font-semibold text-gray-900">
                  Address
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-600">
                  Kolkata, West Bengal, India
                </p>
              </div>

              <div className="rounded-xl border border-gray-200 p-5">
                <h3 className="font-semibold text-gray-900">
                  Phone
                </h3>

                <a
                  href="tel:+919876543210"
                  className="mt-2 inline-block text-sm text-orange-600 hover:text-orange-700"
                >
                  +91 98765 43210
                </a>
              </div>

              <div className="rounded-xl border border-gray-200 p-5">
                <h3 className="font-semibold text-gray-900">
                  Email
                </h3>

                <a
                  href="mailto:hello@cafenest.com"
                  className="mt-2 inline-block text-sm text-orange-600 hover:text-orange-700"
                >
                  hello@cafenest.com
                </a>
              </div>

              <div className="rounded-xl border border-gray-200 p-5">
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

          {/* Contact Form */}
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6 shadow-sm sm:p-8">
            <h2 className="text-2xl font-bold text-gray-900">
              Send Us a Message
            </h2>

            <p className="mt-2 text-sm text-gray-600">
              Fill out the form and our team will get back to you.
            </p>

            {successMessage && (
              <div className="mt-6 rounded-lg bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
                {successMessage}
              </div>
            )}

            {errorMessage && (
              <div className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
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
                  placeholder="Enter your name"
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
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
                  placeholder="Enter your email"
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
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
                  placeholder="Enter your phone number"
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                />
              </div>

              {/* Message */}
              <div>
                <label
                  htmlFor="message"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Message
                </label>

                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="5"
                  placeholder="Write your message..."
                  className="w-full resize-none rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-lg bg-orange-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Submitting..." : "Send Message"}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* WhatsApp CTA */}
      <section className="bg-orange-50 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            Prefer WhatsApp?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-gray-600">
            Send us a message directly on WhatsApp for a quick response.
          </p>

          <a
            href="https://wa.me/919876543210"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-block rounded-lg bg-green-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-green-700"
          >
            Chat on WhatsApp
          </a>
        </div>
      </section>
    </div>
  );
}

export default Contact;