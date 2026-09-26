import { useEffect, useMemo, useState } from "react";

import { getMenus } from "../services/menuService";

const CART_STORAGE_KEY = "cafeNestCart";
const CART_UPDATED_EVENT = "cafeNestCartUpdated";

function Menu() {
  const [menuItems, setMenuItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);

      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error("Failed to load cart:", error);
      return [];
    }
  });

  // Fetch menu items
  useEffect(() => {
    const fetchMenus = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getMenus();

        setMenuItems(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch menu items:", error);

        setError(
          "Unable to load menu items. Please check your connection and try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMenus();
  }, []);

  // Save cart to localStorage and notify Navbar
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));

      const cartItemCount = cart.reduce(
        (total, item) => total + Number(item.quantity || 0),
        0
      );

      window.dispatchEvent(
        new CustomEvent(CART_UPDATED_EVENT, {
          detail: {
            count: cartItemCount,
          },
        })
      );
    } catch (error) {
      console.error("Failed to save cart:", error);
    }
  }, [cart]);

  // Create categories
  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(
        menuItems
          .map((item) => item.category?.trim())
          .filter(Boolean)
      ),
    ];

    return ["All", ...uniqueCategories];
  }, [menuItems]);

  // Filter menu items
  const filteredMenu = useMemo(() => {
    if (selectedCategory === "All") {
      return menuItems;
    }

    return menuItems.filter(
      (item) => item.category?.trim() === selectedCategory
    );
  }, [menuItems, selectedCategory]);

  // Calculate total cart quantity
  const cartItemCount = useMemo(() => {
    return cart.reduce(
      (total, item) => total + Number(item.quantity || 0),
      0
    );
  }, [cart]);

  // Category change
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  // Add item to cart
  const handleAddToCart = (item) => {
    // Prevent adding unavailable items
    if (item.isAvailable === false) {
      return;
    }

    setCart((previousCart) => {
      const existingItem = previousCart.find(
        (cartItem) => cartItem._id === item._id
      );

      if (existingItem) {
        return previousCart.map((cartItem) =>
          cartItem._id === item._id
            ? {
                ...cartItem,
                quantity: Number(cartItem.quantity || 0) + 1,
              }
            : cartItem
        );
      }

      return [
        ...previousCart,
        {
          _id: item._id,
          name: item.name,
          description: item.description,
          price: Number(item.price),
          image: item.image,
          category: item.category,
          isAvailable: item.isAvailable !== false,
          quantity: 1,
        },
      ];
    });
  };

  // WhatsApp enquiry
  const handleEnquiry = (itemName) => {
    const message = `Hi CaféNest, I would like to enquire about ${itemName}.`;

    const whatsappUrl = `https://wa.me/919876543210?text=${encodeURIComponent(
      message
    )}`;

    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  // Image fallback
  const handleImageError = (event) => {
    event.currentTarget.onerror = null;

    event.currentTarget.src =
      "https://placehold.co/800x600?text=Image+Unavailable";
  };

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN").format(price);
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gray-900 px-4 py-20 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-orange-400">
            Our Menu
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
            Delicious Food, Made Fresh
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-gray-300 sm:text-lg">
            Explore our selection of delicious dishes prepared with fresh
            ingredients and served with care.
          </p>
        </div>
      </section>

      {/* Cart Summary */}
      <section className="border-b border-orange-100 bg-orange-50 px-4 py-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-gray-900">
              Your Cart
            </p>

            <p className="text-xs text-gray-600">
              {cartItemCount === 0
                ? "Your cart is empty."
                : `${cartItemCount} item${
                    cartItemCount > 1 ? "s" : ""
                  } added`}
            </p>
          </div>

          <div className="rounded-full bg-orange-600 px-4 py-2 text-sm font-bold text-white">
            Cart: {cartItemCount}
          </div>
        </div>
      </section>

      {/* Menu Section */}
      <section className="bg-white px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Section Header */}
          <div className="mb-10 text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-orange-600">
              Explore
            </p>

            <h2 className="mt-2 text-3xl font-bold text-gray-900 sm:text-4xl">
              Our Food Selection
            </h2>

            <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-gray-600 sm:text-base">
              Choose from our freshly prepared dishes and add your
              favourite items to the cart.
            </p>
          </div>

          {/* Category Filter */}
          {!loading && !error && menuItems.length > 0 && (
            <div className="mb-10">
              <div className="flex flex-wrap justify-center gap-3">
                {categories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => handleCategoryChange(category)}
                    className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                      selectedCategory === category
                        ? "bg-orange-600 text-white shadow-sm"
                        : "bg-gray-100 text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="py-16 text-center">
              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-orange-600" />

              <p className="mt-4 text-sm font-medium text-gray-600">
                Loading menu...
              </p>
            </div>
          )}

          {/* Error State */}
          {!loading && error && (
            <div className="rounded-2xl bg-red-50 px-6 py-10 text-center">
              <p className="text-base font-semibold text-red-700">
                {error}
              </p>

              <button
                type="button"
                onClick={() => window.location.reload()}
                className="mt-5 rounded-lg bg-orange-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-700"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && menuItems.length === 0 && (
            <div className="rounded-2xl bg-gray-50 px-6 py-16 text-center">
              <p className="text-lg font-semibold text-gray-700">
                No menu items available right now.
              </p>

              <p className="mt-2 text-sm text-gray-500">
                Please check again later.
              </p>

              <button
                type="button"
                onClick={() => window.location.reload()}
                className="mt-5 rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
              >
                Refresh Menu
              </button>
            </div>
          )}

          {/* Menu Cards */}
          {!loading && !error && filteredMenu.length > 0 && (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {filteredMenu.map((item) => {
                const isAvailable = item.isAvailable !== false;

                return (
                  <article
                    key={item._id}
                    className={`group flex h-full flex-col overflow-hidden rounded-2xl border bg-white shadow-sm transition duration-300 ${
                      isAvailable
                        ? "border-gray-200 hover:-translate-y-1 hover:shadow-lg"
                        : "border-red-100"
                    }`}
                  >
                    {/* Image */}
                    <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                      <img
                        src={item.image}
                        alt={item.name}
                        onError={handleImageError}
                        loading="lazy"
                        className={`h-full w-full object-cover transition duration-500 ${
                          isAvailable
                            ? "group-hover:scale-105"
                            : "grayscale opacity-60"
                        }`}
                      />

                      {/* Availability Badge */}
                      <div className="absolute right-3 top-3">
                        <span
                          className={`rounded-full px-3 py-1.5 text-xs font-bold shadow-sm ${
                            isAvailable
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {isAvailable
                            ? "Available"
                            : "Out of Stock"}
                        </span>
                      </div>

                      {/* Out of Stock Overlay */}
                      {!isAvailable && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="rounded-lg bg-black/65 px-5 py-2.5 text-sm font-bold tracking-wide text-white shadow-lg">
                            OUT OF STOCK
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex flex-1 flex-col p-6">
                      {/* Name and Price */}
                      <div className="flex items-start justify-between gap-4">
                        <h2
                          className={`text-xl font-bold ${
                            isAvailable
                              ? "text-gray-900"
                              : "text-gray-600"
                          }`}
                        >
                          {item.name}
                        </h2>

                        <span
                          className={`whitespace-nowrap text-lg font-bold ${
                            isAvailable
                              ? "text-orange-600"
                              : "text-gray-500"
                          }`}
                        >
                          ₹{formatPrice(item.price)}
                        </span>
                      </div>

                      {/* Category */}
                      <span className="mt-3 inline-block w-fit rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700">
                        {item.category}
                      </span>

                      {/* Description */}
                      <p className="mt-4 text-sm leading-6 text-gray-600">
                        {item.description}
                      </p>

                      {/* Buttons */}
                      <div className="mt-auto pt-6">
                        {isAvailable ? (
                          <button
                            type="button"
                            onClick={() => handleAddToCart(item)}
                            className="block w-full rounded-lg bg-orange-600 px-5 py-3 text-center text-sm font-semibold text-white shadow-sm transition hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:ring-offset-2"
                          >
                            Add to Cart
                          </button>
                        ) : (
                          <button
                            type="button"
                            disabled
                            className="block w-full cursor-not-allowed rounded-lg bg-gray-200 px-5 py-3 text-center text-sm font-semibold text-gray-500"
                          >
                            Out of Stock
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => handleEnquiry(item.name)}
                          className="mt-3 block w-full rounded-lg border border-green-600 px-5 py-3 text-center text-sm font-semibold text-green-700 transition hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-300 focus:ring-offset-2"
                        >
                          Enquire Now
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          {/* No Items in Selected Category */}
          {!loading &&
            !error &&
            menuItems.length > 0 &&
            filteredMenu.length === 0 && (
              <div className="rounded-2xl bg-gray-50 py-16 text-center">
                <p className="text-lg font-semibold text-gray-700">
                  No items found in this category.
                </p>

                <p className="mt-2 text-sm text-gray-500">
                  Please select another category.
                </p>
              </div>
            )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-orange-50 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-orange-600">
            Get In Touch
          </p>

          <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Want to Know More?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-gray-600">
            Contact us for menu details, availability, special requests, or
            table enquiries.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-green-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-300 focus:ring-offset-2"
            >
              WhatsApp Us
            </a>

            <a
              href="tel:+919876543210"
              className="rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-800 transition hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
            >
              Call Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Menu;
