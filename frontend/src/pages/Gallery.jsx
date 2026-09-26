import { useEffect, useMemo, useState } from "react";

import { getGallery } from "../services/galleryService";

function Gallery() {
  const [galleryItems, setGalleryItems] = useState([]);
  const [selectedCategory, setSelectedCategory] =
    useState("All");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchGallery = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getGallery();

      setGalleryItems(data);
    } catch (error) {
      console.error(
        "Failed to fetch gallery items:",
        error
      );

      setError(
        "Unable to load gallery. Please check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    const loadGallery = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getGallery();

        if (!cancelled) {
          setGalleryItems(data);
        }
      } catch (error) {
        console.error(
          "Failed to fetch gallery items:",
          error
        );

        if (!cancelled) {
          setError(
            "Unable to load gallery. Please check your connection and try again."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadGallery();

    return () => {
      cancelled = true;
    };
  }, []);

  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(
        galleryItems
          .map((item) => item.category?.trim())
          .filter(Boolean)
      ),
    ];

    return uniqueCategories.sort((a, b) =>
      a.localeCompare(b)
    );
  }, [galleryItems]);

  const filteredGallery = useMemo(() => {
    if (selectedCategory === "All") {
      return galleryItems;
    }

    return galleryItems.filter(
      (item) => item.category === selectedCategory
    );
  }, [galleryItems, selectedCategory]);

  const handleImageError = (event) => {
    event.currentTarget.onerror = null;

    event.currentTarget.src =
      "https://placehold.co/800x600?text=Image+Unavailable";
  };

  const handleRetry = async () => {
    setSelectedCategory("All");
    await fetchGallery();
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gray-900 px-4 py-20 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-orange-400">
            Our Gallery
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
            A Taste of CaféNest
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-gray-300 sm:text-lg">
            Take a look at our food, ambience, and memorable
            moments.
          </p>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="bg-white px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Loading State */}
          {loading && (
            <div className="py-16 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-orange-50">
                <span className="text-xl">🖼️</span>
              </div>

              <p className="mt-4 text-base font-medium text-gray-600">
                Loading gallery...
              </p>
            </div>
          )}

          {/* Error State */}
          {!loading && error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-10 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-xl">
                !
              </div>

              <h2 className="mt-4 text-lg font-bold text-red-800">
                Unable to Load Gallery
              </h2>

              <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-red-600">
                {error}
              </p>

              <button
                type="button"
                onClick={handleRetry}
                className="mt-5 rounded-lg bg-orange-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-700"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Empty State */}
          {!loading &&
            !error &&
            galleryItems.length === 0 && (
              <div className="rounded-2xl border border-gray-200 bg-gray-50 px-6 py-16 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-orange-50 text-2xl">
                  🖼️
                </div>

                <h2 className="mt-5 text-2xl font-bold text-gray-900">
                  Gallery Coming Soon
                </h2>

                <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-gray-600">
                  We are currently updating our gallery.
                  Please check back soon to see our food and
                  café moments.
                </p>
              </div>
            )}

          {/* Gallery Content */}
          {!loading &&
            !error &&
            galleryItems.length > 0 && (
              <>
                {/* Filter */}
                <div className="mb-8 rounded-2xl border border-gray-200 bg-gray-50 p-5 sm:p-6">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <h2 className="text-lg font-bold text-gray-900">
                        Explore Our Gallery
                      </h2>

                      <p className="mt-1 text-sm text-gray-500">
                        Showing{" "}
                        <span className="font-semibold text-gray-900">
                          {filteredGallery.length}
                        </span>{" "}
                        of{" "}
                        <span className="font-semibold text-gray-900">
                          {galleryItems.length}
                        </span>{" "}
                        images
                      </p>
                    </div>

                    {categories.length > 0 && (
                      <div className="w-full lg:max-w-xs">
                        <label
                          htmlFor="galleryCategory"
                          className="mb-2 block text-sm font-medium text-gray-700"
                        >
                          Filter by Category
                        </label>

                        <select
                          id="galleryCategory"
                          value={selectedCategory}
                          onChange={(event) =>
                            setSelectedCategory(
                              event.target.value
                            )
                          }
                          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                        >
                          <option value="All">
                            All Categories
                          </option>

                          {categories.map((category) => (
                            <option
                              key={category}
                              value={category}
                            >
                              {category}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                </div>

                {/* No Filter Results */}
                {filteredGallery.length === 0 ? (
                  <div className="rounded-2xl border border-gray-200 bg-gray-50 px-6 py-16 text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-orange-50 text-xl">
                      🔎
                    </div>

                    <h2 className="mt-4 text-xl font-bold text-gray-900">
                      No Gallery Images Found
                    </h2>

                    <p className="mt-2 text-sm text-gray-500">
                      Try selecting a different category.
                    </p>

                    <button
                      type="button"
                      onClick={() =>
                        setSelectedCategory("All")
                      }
                      className="mt-5 rounded-lg bg-orange-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-700"
                    >
                      Show All Images
                    </button>
                  </div>
                ) : (
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredGallery.map((item) => (
                      <article
                        key={item._id}
                        className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                      >
                        {/* Image */}
                        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                          <img
                            src={item.image}
                            alt={item.title}
                            loading="lazy"
                            onError={handleImageError}
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                          />

                          <span className="absolute right-3 top-3 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-orange-700 shadow-sm">
                            {item.category}
                          </span>
                        </div>

                        {/* Content */}
                        <div className="p-5">
                          <h2 className="text-xl font-bold text-gray-900">
                            {item.title}
                          </h2>

                          {item.description && (
                            <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-600">
                              {item.description}
                            </p>
                          )}
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </>
            )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-orange-50 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Come Visit Us
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-gray-600">
            Enjoy delicious food, a welcoming atmosphere, and
            a memorable experience at CaféNest.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-green-700"
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

              WhatsApp Us
            </a>

            <a
              href="tel:+919876543210"
              className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-800 transition hover:bg-gray-100"
            >
              📞 Call Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Gallery;
