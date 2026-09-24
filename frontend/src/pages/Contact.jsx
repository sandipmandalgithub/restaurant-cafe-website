import { useState } from "react";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));

    setSubmitted(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    setSubmitted(true);

    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    });
  };

  return (
    <>
      {/* Page Hero */}
      <section className="bg-orange-50 px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-7xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-600">
            Contact Us
          </p>

          <h1 className="mt-3 text-4xl font-bold leading-tight text-gray-900 sm:text-5xl lg:text-6xl">
            We Would Love to Hear From You
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-gray-600 sm:text-lg">
            Have a question, special request, or want to know more about our
            menu? Get in touch with the CaféNest team.
          </p>
        </div>
      </section>

      {/* Contact Information + Form */}
      <section className="bg-white px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          {/* Contact Information */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-600">
              Get In Touch
            </p>

            <h2 className="mt-3 text-3xl font-bold leading-tight text-gray-900 sm:text-4xl">
              Let's Start a Conversation
            </h2>

            <p className="mt-5 max-w-lg text-base leading-7 text-gray-600">
              Whether you want to make an enquiry, ask about our menu, or
              simply say hello, you can reach us through any of the options
              below.
            </p>

            {/* Contact Cards */}
            <div className="mt-8 space-y-4">
              <a
                href="tel:+919876543210"
                className="flex items-start gap-4 rounded-2xl border border-gray-200 p-5 transition hover:border-orange-300 hover:shadow-md"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-orange-100 text-xl">
                  📞
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-500">
                    Call Us
                  </p>

                  <p className="mt-1 font-semibold text-gray-900">
                    +91 98765 43210
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    Available during business hours
                  </p>
                </div>
              </a>

              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-4 rounded-2xl border border-gray-200 p-5 transition hover:border-green-300 hover:shadow-md"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-green-100 text-xl">
                  💬
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-500">
                    WhatsApp
                  </p>

                  <p className="mt-1 font-semibold text-gray-900">
                    Chat With Us
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    Quick enquiries and messages
                  </p>
                </div>
              </a>

              <a
                href="mailto:hello@cafenest.com"
                className="flex items-start gap-4 rounded-2xl border border-gray-200 p-5 transition hover:border-orange-300 hover:shadow-md"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-orange-100 text-xl">
                  ✉️
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-500">
                    Email
                  </p>

                  <p className="mt-1 font-semibold text-gray-900">
                    hello@cafenest.com
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    Send us your enquiry anytime
                  </p>
                </div>
              </a>

              <div className="flex items-start gap-4 rounded-2xl border border-gray-200 p-5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-orange-100 text-xl">
                  🕒
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-500">
                    Opening Hours
                  </p>

                  <p className="mt-1 font-semibold text-gray-900">
                    Monday - Sunday
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    10:00 AM - 10:00 PM
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="rounded-3xl border border-gray-200 bg-gray-50 p-6 sm:p-8 lg:p-10">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-600">
                Send an Enquiry
              </p>

              <h2 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl">
                How Can We Help?
              </h2>

              <p className="mt-3 text-sm leading-6 text-gray-600">
                Fill out the form below and our team will get back to you.
              </p>
            </div>

            {submitted && (
              <div
                className="mt-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
                role="alert"
              >
                Thank you! Your enquiry has been submitted successfully.
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              {/* Name + Email */}
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Full Name
                  </label>

                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    required
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Email Address
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    required
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  />
                </div>
              </div>

              {/* Phone + Subject */}
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="phone"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Phone Number
                  </label>

                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                    required
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Subject
                  </label>

                  <input
                    id="subject"
                    name="subject"
                    type="text"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="What is this about?"
                    required
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  />
                </div>
              </div>

              {/* Message */}
              <div>
                <label
                  htmlFor="message"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Message
                </label>

                <textarea
                  id="message"
                  name="message"
                  rows="6"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Write your message here..."
                  required
                  className="w-full resize-none rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full rounded-xl bg-orange-600 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:ring-offset-2"
              >
                Send Enquiry
              </button>

              <p className="text-center text-xs leading-5 text-gray-500">
                Your information will only be used to respond to your enquiry.
              </p>
            </form>
          </div>
        </div>
      </section>

      {/* Quick Contact CTA */}
      <section className="bg-gray-900 px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-400">
            Need a Quick Response?
          </p>

          <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
            Message Us Directly on WhatsApp
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-gray-400">
            For quick questions, menu enquiries, or general information, send
            us a WhatsApp message.
          </p>

          <div className="mt-8">
            <a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-lg bg-green-500 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-green-600"
            >
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

export default Contact;
