import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

const CART_STORAGE_KEY = "cafeNestCart";
const CART_UPDATED_EVENT = "cafeNestCartUpdated";

// Cart Icon Component
function CartIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.8"
      stroke="currentColor"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 3h1.386c.51 0 .955.343 1.085.835L5.5 6.75m0 0h14.25l-1.5 8.25H6.75L5.5 6.75Zm0 0L4.72 4.5M8.25 19.5a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm10.5 0a.75.75 0 1 1-1.5 0 .75.75 0 1 1 1.5 0Z"
      />
    </svg>
  );
}

// Get cart quantity
function getCartItemCount() {
  try {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    const cart = savedCart ? JSON.parse(savedCart) : [];

    if (!Array.isArray(cart)) {
      return 0;
    }

    return cart.reduce(
      (total, item) => total + Number(item.quantity || 0),
      0
    );
  } catch (error) {
    console.error("Failed to read cart:", error);
    return 0;
  }
}

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [cartItemCount, setCartItemCount] = useState(() =>
    getCartItemCount()
  );

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Menu", path: "/menu" },
    { name: "Gallery", path: "/gallery" },
    { name: "Contact", path: "/contact" },
    { name: "Location", path: "/location" },
  ];

  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  // Listen for cart updates
  useEffect(() => {
    const handleCartUpdate = (event) => {
      const updatedCount =
        typeof event.detail?.count === "number"
          ? event.detail.count
          : getCartItemCount();

      setCartItemCount(updatedCount);
    };

    const handleStorageChange = (event) => {
      if (event.key === CART_STORAGE_KEY) {
        setCartItemCount(getCartItemCount());
      }
    };

    window.addEventListener(
      CART_UPDATED_EVENT,
      handleCartUpdate
    );

    window.addEventListener(
      "storage",
      handleStorageChange
    );

    return () => {
      window.removeEventListener(
        CART_UPDATED_EVENT,
        handleCartUpdate
      );

      window.removeEventListener(
        "storage",
        handleStorageChange
      );
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200/80 bg-white/95 shadow-sm backdrop-blur">
      <nav
        className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:gap-6 sm:px-6 lg:px-8"
        aria-label="Main navigation"
      >
        {/* Logo / Brand */}
        <NavLink
          to="/"
          onClick={handleLinkClick}
          className="shrink-0 text-2xl font-bold tracking-tight text-gray-900 transition hover:opacity-80"
          aria-label="CaféNest home"
        >
          Café<span className="text-orange-600">Nest</span>
        </NavLink>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `relative rounded-lg px-3 py-2 text-sm font-semibold transition ${
                  isActive
                    ? "text-orange-600"
                    : "text-gray-700 hover:bg-gray-50 hover:text-orange-600"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {link.name}

                  {isActive && (
                    <span className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-orange-600" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>

        {/* Desktop Right Actions */}
        <div className="hidden items-center gap-3 lg:flex">
          {/* Cart */}
          <NavLink
            to="/cart"
            className={({ isActive }) =>
              `relative inline-flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold transition ${
                isActive
                  ? "bg-orange-50 text-orange-600"
                  : "text-gray-700 hover:bg-gray-50 hover:text-orange-600"
              }`
            }
            aria-label={`Shopping cart with ${cartItemCount} items`}
          >
            <CartIcon />

            <span>Cart</span>

            {cartItemCount > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-orange-600 px-1 text-[10px] font-bold leading-none text-white">
                {cartItemCount > 99 ? "99+" : cartItemCount}
              </span>
            )}
          </NavLink>

          {/* WhatsApp */}
          <a
            href="https://wa.me/919876543210"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700"
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

        {/* Mobile Actions */}
        <div className="flex items-center gap-2 md:hidden">
          {/* Mobile Cart */}
          <NavLink
            to="/cart"
            onClick={handleLinkClick}
            className={({ isActive }) =>
              `relative inline-flex h-10 w-10 items-center justify-center rounded-lg transition ${
                isActive
                  ? "bg-orange-50 text-orange-600"
                  : "text-gray-700 hover:bg-gray-100 hover:text-orange-600"
              }`
            }
            aria-label={`Shopping cart with ${cartItemCount} items`}
          >
            <CartIcon />

            {cartItemCount > 0 && (
              <span className="absolute -right-1 -top-1 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-orange-600 px-1 text-[10px] font-bold leading-none text-white">
                {cartItemCount > 99 ? "99+" : cartItemCount}
              </span>
            )}
          </NavLink>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() =>
              setIsMenuOpen((previousState) => !previousState)
            }
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-gray-700 transition hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
            aria-label={
              isMenuOpen
                ? "Close navigation menu"
                : "Open navigation menu"
            }
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation"
          >
            {isMenuOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className="h-6 w-6"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className="h-6 w-6"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div
        id="mobile-navigation"
        className={`overflow-hidden border-t border-gray-200 bg-white transition-all duration-300 md:hidden ${
          isMenuOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={handleLinkClick}
                className={({ isActive }) =>
                  `rounded-lg px-4 py-3 text-sm font-semibold transition ${
                    isActive
                      ? "bg-orange-50 text-orange-600"
                      : "text-gray-700 hover:bg-gray-50 hover:text-orange-600"
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}

            {/* Mobile Cart */}
            <NavLink
              to="/cart"
              onClick={handleLinkClick}
              className={({ isActive }) =>
                `mt-1 flex items-center justify-between rounded-lg px-4 py-3 text-sm font-semibold transition ${
                  isActive
                    ? "bg-orange-50 text-orange-600"
                    : "text-gray-700 hover:bg-gray-50 hover:text-orange-600"
                }`
              }
            >
              <span className="flex items-center gap-3">
                <CartIcon />
                Cart
              </span>

              <span
                className={`flex min-h-6 min-w-6 items-center justify-center rounded-full px-1.5 text-xs font-bold ${
                  cartItemCount > 0
                    ? "bg-orange-600 text-white"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {cartItemCount > 99 ? "99+" : cartItemCount}
              </span>
            </NavLink>

            {/* Mobile WhatsApp */}
            <a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleLinkClick}
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-green-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-5 w-5"
                aria-hidden="true"
              >
                <path d="M20.52 3.48A11.84 11.84 0 0 0 12.07 0C5.54 0 .23 5.31.23 11.84c0 2.09.55 4.13 1.6 5.93L.13 24l6.38-1.67a11.82 11.82 0 0 0 5.56 1.42h.01c6.53 0 11.84-5.31 11.84-11.84 0-3.17-1.23-6.15-3.4-8.43ZM12.08 21.8h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.79.99 1.01-3.69-.23-.38-3.79.99 1.01-3.69-.23-.38a9.85 9.85 0 0 1-1.51-5.29C2.16 6.4 6.61 1.96 12.08 1.96c2.65 0 5.14 1.03 7.01 2.91a9.85 9.85 0 0 1 2.9 7.02c0 5.47-4.45 9.91-9.91 9.91Zm5.43-7.42c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.65.07-.3-.15-1.27-.47-2.42-1.49-.9-.8-1.5-1.78-1.67-2.08-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.05 1.02-1.05 2.49s1.07 2.89 1.22 3.09c.15.2 2.1 3.2 5.08 4.49.71.31 1.27.5 1.7.64.71.23 1.35.2 1.86.12.57-.08 1.76-.72 2.01-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35Z" />
              </svg>

              WhatsApp Us
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
