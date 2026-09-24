import { useMemo, useState } from "react";
import menuData from "../data/menuData";

function Menu() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = [
    "All",
    ...new Set(menuData.map((item) => item.category)),
  ];

  const filteredMenu = useMemo(() => {
    if (selectedCategory === "All") {
      return menuData;
    }

    return menuData.filter((item) => item.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <>
      {/* Page Hero */}
      <section className="bg-orange-50 px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-7xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-600">
            Our Menu
          </p>

          <h1 className="mt-3 text-4xl font-bold leading-tight text-gray-900 sm:text-5xl lg:text-6xl">
            Delicious Food for Every Mood
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-gray-600 sm:text-lg">
            Explore our selection of freshly prepared dishes made with quality
            ingredients and plenty of flavour.
          </p>
        </div>
      </section>

      {/* Menu Section */}
      <section className="bg-white px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-7xl">
          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => {
              const isActive = selectedCategory === category;

              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                    isActive
                      ? "bg-orange-600 text-white shadow-sm"
                      : "border border-gray-200 bg-white text-gray-700 hover:border-orange-600 hover:text-orange-600"
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>

          {/* Menu Count */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              Showing{" "}
              <span className="font-semibold text-gray-900">
                {filteredMenu.length}
              </span>{" "}
              {filteredMenu.length === 1 ? "dish" : "dishes"}
            </p>
          </div>

          {/* Food Cards */}
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredMenu.map((item) => (
              <article
                key={item.id}
                className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                {/* Image */}
                <div className="relative overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                    className="h-60 w-full object-cover transition duration-500 group-hover:scale-105"
                  />

                  <div className="absolute left-4 top-4">
                    <span className="rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-orange-600 shadow-sm">
                      {item.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <h2 className="text-xl font-semibold text-gray-900">
                      {item.name}
                    </h2>

                    <p className="whitespace-nowrap text-lg font-bold text-orange-600">
                      ₹{item.price}
                    </p>
                  </div>

                  <p className="mt-3 text-sm leading-6 text-gray-600">
                    {item.description}
                  </p>

                  <button
                    type="button"
                    className="mt-5 w-full rounded-lg border border-orange-600 px-4 py-2.5 text-sm font-semibold text-orange-600 transition hover:bg-orange-600 hover:text-white"
                  >
                    Enquire Now
                  </button>
                </div>
              </article>
            ))}
          </div>

          {/* Empty State */}
          {filteredMenu.length === 0 && (
            <div className="mt-12 rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-6 py-12 text-center">
              <h2 className="text-xl font-semibold text-gray-900">
                No dishes found
              </h2>

              <p className="mt-2 text-sm text-gray-600">
                Please select another menu category.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-gray-900 px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-400">
            Have a Question?
          </p>

          <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
            Want to Know More About Our Menu?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-gray-400">
            Get in touch with us for menu details, availability, special
            requests, or general enquiries.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-lg bg-green-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-green-600"
            >
              WhatsApp Us
            </a>

            <a
              href="tel:+919876543210"
              className="inline-flex items-center justify-center rounded-lg border border-gray-600 px-6 py-3 text-sm font-semibold text-white transition hover:border-white"
            >
              Call Us
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

export default Menu;
