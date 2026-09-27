import { Outlet } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function MainLayout() {
  // Replace this with your WhatsApp number.
  // Example: 9876543210 -> 919876543210
  const whatsappNumber = "919XXXXXXXXX";

  const whatsappMessage = encodeURIComponent(
    "Hello CaféNest, I would like to know more about your menu and services."
  );

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />

      {/* Floating WhatsApp Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        title="Chat with us on WhatsApp"
        className="
          fixed
          bottom-5
          right-5
          z-50
          flex
          h-14
          w-14
          items-center
          justify-center
          rounded-full
          bg-green-500
          text-white
          shadow-lg
          transition-all
          duration-300
          hover:scale-110
          hover:bg-green-600
          focus:outline-none
          focus:ring-4
          focus:ring-green-300
          sm:bottom-6
          sm:right-6
          sm:h-16
          sm:w-16
        "
      >
        {/* WhatsApp Icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-8 w-8 sm:h-9 sm:w-9"
          aria-hidden="true"
        >
          <path d="M20.52 3.48A11.82 11.82 0 0 0 12.06 0C5.52 0 .2 5.31.2 11.86c0 2.09.55 4.13 1.59 5.93L.1 24l6.36-1.67a11.85 11.85 0 0 0 5.6 1.43h.01c6.54 0 11.86-5.32 11.86-11.86 0-3.17-1.23-6.14-3.41-8.42ZM12.07 21.72h-.01a9.84 9.84 0 0 1-5.02-1.38l-.36-.21-3.77.99 1.01-3.67-.23-.38a9.85 9.85 0 0 1-1.51-5.21c0-5.43 4.42-9.85 9.86-9.85 2.63 0 5.1 1.03 6.96 2.89a9.79 9.79 0 0 1 2.89 6.97c0 5.43-4.42 9.85-9.82 9.85Zm5.4-7.38c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.47-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.05 1.02-1.05 2.49s1.07 2.89 1.22 3.09c.15.2 2.1 3.2 5.09 4.49.71.31 1.27.49 1.7.63.71.23 1.35.2 1.86.12.57-.08 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35Z" />
        </svg>
      </a>
    </div>
  );
}

export default MainLayout;
