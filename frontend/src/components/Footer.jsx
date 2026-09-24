import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-3">
          {/* Brand */}
          <div>
            <h2 className="text-2xl font-bold">
              Café<span className="text-orange-500">Nest</span>
            </h2>

            <p className="mt-4 max-w-sm text-sm leading-6 text-gray-400">
              Fresh food, delicious flavours, and a warm atmosphere for every
              occasion.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold">Quick Links</h3>

            <div className="mt-4 flex flex-col gap-3 text-sm">
              <Link
                to="/"
                className="text-gray-400 transition hover:text-white"
              >
                Home
              </Link>

              <Link
                to="/about"
                className="text-gray-400 transition hover:text-white"
              >
                About
              </Link>

              <Link
                to="/menu"
                className="text-gray-400 transition hover:text-white"
              >
                Menu
              </Link>

              <Link
                to="/gallery"
                className="text-gray-400 transition hover:text-white"
              >
                Gallery
              </Link>

              <Link
                to="/contact"
                className="text-gray-400 transition hover:text-white"
              >
                Contact
              </Link>

              <Link
                to="/location"
                className="text-gray-400 transition hover:text-white"
              >
                Location
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold">Contact Us</h3>

            <div className="mt-4 space-y-3 text-sm text-gray-400">
              <p>Kolkata, West Bengal, India</p>

              <p>+91 98765 43210</p>

              <p>hello@cafenest.com</p>

              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-green-400 transition hover:text-green-300"
              >
                WhatsApp Us
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-10 border-t border-gray-800 pt-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} CaféNest. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;