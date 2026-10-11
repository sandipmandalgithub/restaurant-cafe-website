import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import useCustomerAuth from "../context/useCustomerAuth";

const CART_STORAGE_KEY = "cafeNestCart";
const CART_UPDATED_EVENT = "cafeNestCartUpdated";
const BUSINESS_SETTINGS_API = `${import.meta.env.VITE_API_URL}/api/business-settings`;

function CartIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.8"
      stroke="currentColor"
      className="h-5 w-5 shrink-0"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 3h1.386c.51 0 .955.343 1.085.835L5.5 6.75m0 0h14.25l-1.5 8.25H6.75L5.5 6.75Zm0 0L4.72 4.5M8.25 19.5a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm10.5 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
      />
    </svg>
  );
}

function AccountIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.8"
      stroke="currentColor"
      className="h-5 w-5 shrink-0"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 20.25a7.5 7.5 0 0 1 15 0"
      />
    </svg>
  );
}

function ChevronDownIcon({ className = "" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="2"
      stroke="currentColor"
      className={`h-4 w-4 shrink-0 transition-transform ${className}`}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m6 9 6 6 6-6"
      />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.8"
      stroke="currentColor"
      className="h-4 w-4 shrink-0"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6A2.25 2.25 0 0 0 5.25 5.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m-4.5-3h10.5m0 0-3-3m3 3-3 3"
      />
    </svg>
  );
}

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

// Keep CaféNest colours consistent with the Admin Login page.
function BusinessLogo({ businessName }) {
  const normalizedName = businessName.trim();
  const brandName = "CaféNest";

  if (normalizedName.toLowerCase().startsWith(brandName.toLowerCase())) {
    const remainingName = normalizedName.slice(brandName.length);

    return (
      <>
        <span className="text-gray-900">Café</span>
        <span className="text-orange-600">Nest</span>
        {remainingName && (
          <span className="text-inherit">{remainingName}</span>
        )}
      </>
    );
  }

  return <span>{normalizedName}</span>;
}

function Navbar() {
  const navigate = useNavigate();

  const { customer, isAuthenticated, logout } = useCustomerAuth();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);

  const [cartItemCount, setCartItemCount] = useState(() =>
    getCartItemCount()
  );

  const [businessSettings, setBusinessSettings] = useState({
    businessName: "CaféNest Restaurant",
  });

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Menu", path: "/menu" },
    { name: "Gallery", path: "/gallery" },
    { name: "Reviews", path: "/reviews" },
    { name: "Contact", path: "/contact" },
    { name: "Location", path: "/location" },
  ];

  const accountLinks = [
    { name: "My Profile", path: "/customer/profile" },
    { name: "My Orders", path: "/customer/orders" },
    { name: "My Reservations", path: "/customer/reservations" },
  ];

  const handleLinkClick = () => {
    setIsMenuOpen(false);
    setIsAccountMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    handleLinkClick();
    navigate("/customer/login");
  };

  // Load business settings.
  useEffect(() => {
    const loadBusinessSettings = async () => {
      if (!import.meta.env.VITE_API_URL) {
        return;
      }

      try {
        const response = await fetch(BUSINESS_SETTINGS_API);

        if (!response.ok) {
          throw new Error("Unable to load business settings.");
        }

        const result = await response.json();

        if (result.success && result.data) {
          setBusinessSettings((previousSettings) => ({
            ...previousSettings,
            businessName:
              result.data.businessName?.trim() ||
              previousSettings.businessName,
          }));
        }
      } catch (error) {
        console.error("Failed to load business settings:", error);
      }
    };

    loadBusinessSettings();
  }, []);

  // Listen for cart updates.
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

    window.addEventListener(CART_UPDATED_EVENT, handleCartUpdate);
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener(CART_UPDATED_EVENT, handleCartUpdate);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Close mobile menu when desktop navigation becomes visible.
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1280) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Close the account dropdown when clicking outside it.
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        isAccountMenuOpen &&
        !event.target.closest("[data-account-menu]")
      ) {
        setIsAccountMenuOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsAccountMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isAccountMenuOpen]);

  const businessName =
    businessSettings.businessName?.trim() || "CaféNest Restaurant";

  const customerName =
    customer?.name?.trim() ||
    customer?.fullName?.trim() ||
    customer?.email?.trim() ||
    "My Account";

  const desktopLinkClass = ({ isActive }) =>
    `relative whitespace-nowrap rounded-lg px-2 py-2 text-xs font-semibold transition xl:px-2.5 xl:text-sm ${
      isActive
        ? "text-orange-600"
        : "text-gray-700 hover:bg-gray-50 hover:text-orange-600"
    }`;

  const mobileLinkClass = ({ isActive }) =>
    `block rounded-lg px-4 py-3 text-sm font-semibold transition ${
      isActive
        ? "bg-orange-50 text-orange-600"
        : "text-gray-700 hover:bg-gray-50 hover:text-orange-600"
    }`;

  const accountMenuLinkClass = ({ isActive }) =>
    `flex w-full items-center rounded-lg px-3 py-2.5 text-sm font-medium transition ${
      isActive
        ? "bg-orange-50 text-orange-700"
        : "text-gray-700 hover:bg-orange-50 hover:text-orange-700"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200/80 bg-white/95 shadow-sm backdrop-blur">
      <nav
        className="relative mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-2 px-3 sm:gap-3 sm:px-6 lg:px-8"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <NavLink
          to="/"
          onClick={handleLinkClick}
          className="min-w-0 shrink-0 whitespace-nowrap text-base font-bold tracking-tight text-gray-900 transition hover:opacity-80 sm:text-xl"
          aria-label={`${businessName} home`}
        >
          <span className="whitespace-nowrap">
            <BusinessLogo businessName={businessName} />
          </span>
        </NavLink>

        {/* Desktop Navigation */}
        <div className="hidden min-w-0 flex-1 items-center justify-center gap-0.5 xl:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={desktopLinkClass}
            >
              {({ isActive }) => (
                <>
                  {link.name}
                  {isActive && (
                    <span className="absolute inset-x-2 -bottom-0.5 h-0.5 rounded-full bg-orange-600" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>

        {/* Desktop Actions: Reservation → Cart → Account */}
        <div className="hidden shrink-0 items-center gap-1 xl:flex">
          {/* Reserve a Table */}
          <NavLink
            to="/reservation"
            className={({ isActive }) =>
              `inline-flex shrink-0 items-center whitespace-nowrap rounded-lg px-2 py-2.5 text-xs font-semibold transition ${
                isActive
                  ? "bg-orange-600 text-white"
                  : "bg-orange-50 text-orange-600 hover:bg-orange-100"
              }`
            }
          >
            Reserve a Table
          </NavLink>

          {/* Cart */}
          <NavLink
            to="/cart"
            className={({ isActive }) =>
              `relative inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg px-2 py-2.5 text-xs font-semibold transition ${
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

          {/* Customer Account Dropdown */}
          {isAuthenticated && (
            <div className="relative" data-account-menu>
              <button
                type="button"
                onClick={() =>
                  setIsAccountMenuOpen((previousState) => !previousState)
                }
                className={`inline-flex max-w-40 items-center gap-1.5 rounded-lg px-2 py-2.5 text-xs font-semibold transition ${
                  isAccountMenuOpen
                    ? "bg-orange-50 text-orange-700"
                    : "text-gray-700 hover:bg-gray-50 hover:text-orange-600"
                }`}
                aria-expanded={isAccountMenuOpen}
                aria-haspopup="menu"
              >
                <AccountIcon />
                <span className="max-w-24 truncate">{customerName}</span>
                <ChevronDownIcon
                  className={isAccountMenuOpen ? "rotate-180" : ""}
                />
              </button>

              {isAccountMenuOpen && (
                <div
                  className="absolute right-0 top-full z-[60] mt-2 w-64 overflow-hidden rounded-xl border border-gray-200 bg-white p-2 shadow-xl"
                  role="menu"
                >
                  <div className="border-b border-gray-100 px-3 py-3">
                    <p className="truncate text-sm font-semibold text-gray-900">
                      {customerName}
                    </p>
                    <p className="mt-1 flex items-center gap-1.5 text-xs text-green-700">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                      Customer logged in
                    </p>
                  </div>

                  <div className="space-y-1 py-2">
                    {accountLinks.map((link) => (
                      <NavLink
                        key={link.path}
                        to={link.path}
                        role="menuitem"
                        onClick={() => setIsAccountMenuOpen(false)}
                        className={accountMenuLinkClass}
                      >
                        {link.name}
                      </NavLink>
                    ))}
                  </div>

                  <div className="border-t border-gray-100 pt-2">
                    <button
                      type="button"
                      role="menuitem"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                    >
                      <LogoutIcon />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Tablet / Mobile Actions: Cart → Account → Menu */}
        <div className="flex shrink-0 items-center gap-1.5 xl:hidden">
          {/* Cart */}
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

          {/* Account shortcut for logged-in customers */}
          {isAuthenticated && (
            <NavLink
              to="/customer/profile"
              onClick={handleLinkClick}
              className="inline-flex h-10 max-w-28 items-center gap-1.5 rounded-lg px-2 text-xs font-semibold text-gray-700 transition hover:bg-orange-50 hover:text-orange-600 sm:max-w-36"
              aria-label="My Account"
            >
              <AccountIcon />
              <span className="truncate">My Account</span>
            </NavLink>
          )}

          {/* Mobile menu toggle */}
          <button
            type="button"
            onClick={() =>
              setIsMenuOpen((previousState) => !previousState)
            }
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-gray-700 transition hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
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

        {/* Tablet / Mobile Navigation */}
        <div
          id="mobile-navigation"
          className={`absolute left-0 right-0 top-full z-50 overflow-y-auto border-t border-gray-200 bg-white shadow-lg transition-all duration-300 xl:hidden ${
            isMenuOpen
              ? "max-h-[calc(100dvh-4rem)] opacity-100"
              : "pointer-events-none max-h-0 opacity-0"
          }`}
          aria-hidden={!isMenuOpen}
        >
          <div className="mx-auto max-w-7xl px-3 py-3 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={handleLinkClick}
                  className={mobileLinkClass}
                >
                  {link.name}
                </NavLink>
              ))}

              {/* Reserve a Table */}
              <NavLink
                to="/reservation"
                onClick={handleLinkClick}
                className={({ isActive }) =>
                  `mt-1 block rounded-lg px-4 py-3 text-sm font-semibold transition ${
                    isActive
                      ? "bg-orange-600 text-white"
                      : "bg-orange-50 text-orange-600 hover:bg-orange-100"
                  }`
                }
              >
                Reserve a Table
              </NavLink>

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

              {/* Mobile Customer Account */}
              {isAuthenticated && (
                <div className="mt-2 rounded-xl border border-gray-200 bg-gray-50 p-3">
                  <div className="flex items-center gap-3 px-2 py-2">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-700">
                      <AccountIcon />
                    </span>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-gray-900">
                        {customerName}
                      </p>
                      <p className="mt-0.5 flex items-center gap-1.5 text-xs text-green-700">
                        <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                        Customer logged in
                      </p>
                    </div>
                  </div>

                  <div className="mt-2 space-y-1">
                    {accountLinks.map((link) => (
                      <NavLink
                        key={link.path}
                        to={link.path}
                        onClick={handleLinkClick}
                        className={mobileLinkClass}
                      >
                        {link.name}
                      </NavLink>
                    ))}

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 rounded-lg px-4 py-3 text-left text-sm font-semibold text-red-600 transition hover:bg-red-50"
                    >
                      <LogoutIcon />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
