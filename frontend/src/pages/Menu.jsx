import { useEffect, useMemo, useState } from "react";

import { getMenus } from "../services/menuService";

function Menu() {
  const [menuItems, setMenuItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getMenus();

        setMenuItems(data);
      } catch (error) {
        console.error("Failed to fetch menu items:", error);
        setError("Unable to load menu items. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchMenus();
  }, []);

  const categories = useMemo(() => {
    return ["All", ...new Set(menuItems.map((item) => item.category))];
  }, [menuItems]);

  const filteredMenu = useMemo(() => {
    if (selectedCategory === "All") {
      return menuItems;
    }

    return menuItems.filter(
      (item) => item.category === selectedCategory
    );
  }, [menuItems, selectedCategory]);

  const handleEnquiry = (itemName) => {
    const message = `Hi CaféNest, I would like to enquire about ${itemName}.`;

    const whatsappUrl = `https://wa.me/919876543210?text=${encodeURIComponent(
      message
    )}`;

    window.open(whatsappUrl, "_blank");
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

      {/* Menu Section */}
      <section className="bg-white px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Category Filter */}
          {!loading && !error && menuItems.length > 0 && (
            <div className="mb-10 flex flex-wrap justify-center gap-3">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  className={`rounded-full px-5 py-2.5 text-sm font-medium transition ${
                    selectedCategory === category
                      ? "bg-orange-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="py-16 text-center">
              <p className="text-base text-gray-600">
                Loading menu...
              </p>
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="rounded-xl bg-red-50 px-6 py-10 text-center">
              <p className="text-base font-medium text-red-600">
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
            <div className="py-16 text-center">
              <p className="text-lg font-medium text-gray-700">
                No menu items available right now.
              </p>

              <p className="mt-2 text-sm text-gray-500">
                Please check again later.
              </p>
            </div>
          )}

          {/* Menu Cards */}
          {!loading && !error && filteredMenu.length > 0 && (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {filteredMenu.map((item) => (
                <article
                  key={item._id}
                  className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover transition duration-500 hover:scale-105"
                    />
                  </div>

                  <div className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <h2 className="text-xl font-bold text-gray-900">
                        {item.name}
                      </h2>

                      <span className="whitespace-nowrap text-lg font-bold text-orange-600">
                        ₹{item.price}
                      </span>
                    </div>

                    <p className="mt-2 text-sm font-medium text-orange-500">
                      {item.category}
                    </p>

                    <p className="mt-4 text-sm leading-6 text-gray-600">
                      {item.description}
                    </p>

                    <button
                      type="button"
                      onClick={() => handleEnquiry(item.name)}
                      className="mt-6 w-full rounded-lg bg-orange-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-700"
                    >
                      Enquire Now
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* No Items in Selected Category */}
          {!loading &&
            !error &&
            menuItems.length > 0 &&
            filteredMenu.length === 0 && (
              <div className="py-16 text-center">
                <p className="text-lg font-medium text-gray-700">
                  No items found in this category.
                </p>
              </div>
            )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-orange-50 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
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
              className="rounded-lg bg-green-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-green-700"
            >
              WhatsApp Us
            </a>

            <a
              href="tel:+919876543210"
              className="rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-800 transition hover:bg-gray-100"
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