import { Link } from "react-router-dom";

function Footer() {
  const quickLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Menu", path: "/menu" },
    { name: "Gallery", path: "/gallery" },
    { name: "Contact", path: "/contact" },
    { name: "Location", path: "/location" },
  ];

  return (
    <footer className="bg-gray-950 text-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_0.8fr_1fr] lg:gap-16">
          {/* Brand */}
          <div>
            <Link
              to="/"
              className="inline-block text-2xl font-bold tracking-tight transition hover:opacity-80"
            >
              Café<span className="text-orange-500">Nest</span>
            </Link>

            <p className="mt-4 max-w-md text-sm leading-7 text-gray-400">
              Fresh food, delicious flavours, and a warm atmosphere for every
              occasion. Come enjoy great food and create memorable moments with
              us.
            </p>

            {/* CTA Buttons */}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <a
                href="tel:+919876543210"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-700 px-4 py-2.5 text-sm font-semibold text-gray-200 transition hover:border-orange-500 hover:text-orange-400"
              >
                <span aria-hidden="true">📞</span>
                Call Us
              </a>

              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-5 w-5"
                  aria-hidden="true"
                >
                  <path d="M20.52 3.48A11.84 11.84 0 0 0 12.07 0C5.54 0 .23 5.31.23 11.84c0 2.09.55 4.13 1.6 5.93L.13 24l6.38-1.67a11.82 11.82 0 0 0 5.56 1.42h.01c6.53 0 11.84-5.31 11.84-11.84 0-3.17-1.23-6.15-3.4-8.43ZM12.08 21.8h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.79.99 1.01-3.69-.23-.38a9.85 9.85 0 0 1-1.51-5.29C2.16 6.4 6.61 1.96 12.08 1.96c2.65 0 5.14 1.03 7.01 2.91a9.85 9.85 0 0 1 2.9 7.02c0 5.47-4.45 9.91-9.91 9.91Zm5.43-7.42c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.65.07-.3-.15-1.27-.47-2.42-1.49-.9-.8-1.5-1.78-1.67-2.08-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.05 1.02-1.05 2.49s1.07 2.89 1.22 3.09c.15.2 2.1 3.2 5.08 4.49.71.31 1.27.5 1.7.64.71.23 1.35.2 1.86.12.57-.08 1.76-.72 2.01-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35Z" />
                </svg>
                WhatsApp
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-base font-semibold uppercase tracking-wider text-white">
              Quick Links
            </h3>

            <nav className="mt-5" aria-label="Footer navigation">
              <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
                {quickLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="text-gray-400 transition hover:text-orange-400"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </nav>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-base font-semibold uppercase tracking-wider text-white">
              Contact Us
            </h3>

            <div className="mt-5 space-y-4 text-sm">
              {/* Address */}
              <div className="flex items-start gap-3">
                <span
                  className="mt-0.5 text-base"
                  aria-hidden="true"
                >
                  📍
                </span>

                <p className="leading-6 text-gray-400">
                  Kolkata, West Bengal, India
                </p>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-3">
                <span
                  className="mt-0.5 text-base"
                  aria-hidden="true"
                >
                  📞
                </span>

                <a
                  href="tel:+919876543210"
                  className="text-gray-400 transition hover:text-orange-400"
                >
                  +91 98765 43210
                </a>
              </div>

              {/* Email */}
              <div className="flex items-start gap-3">
                <span
                  className="mt-0.5 text-base"
                  aria-hidden="true"
                >
                  ✉️
                </span>

                <a
                  href="mailto:hello@cafenest.com"
                  className="break-all text-gray-400 transition hover:text-orange-400"
                >
                  hello@cafenest.com
                </a>
              </div>

              {/* Opening Hours */}
              <div className="flex items-start gap-3">
                <span
                  className="mt-0.5 text-base"
                  aria-hidden="true"
                >
                  🕒
                </span>

                <div className="text-gray-400">
                  <p>Monday - Sunday</p>
                  <p className="mt-1">10:00 AM - 10:00 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="mt-12 border-t border-gray-800 pt-6">
          <div className="flex flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-left">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} CaféNest. All rights reserved.
            </p>

            <p className="text-xs text-gray-600">
              Fresh food. Warm moments. Great memories.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
