import { useEffect, useState } from "react";

import { getGallery } from "../services/galleryService";

function Gallery() {
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getGallery();

        setGalleryItems(data);
      } catch (error) {
        console.error("Failed to fetch gallery items:", error);

        setError("Unable to load gallery. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gray-900 px-4 py-20 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-orange-400">
            Gallery
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
            A Glimpse of CaféNest
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-gray-300 sm:text-lg">
            Take a look at our food, café atmosphere, and memorable moments.
          </p>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="bg-white px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Loading */}
          {loading && (
            <div className="py-16 text-center">
              <p className="text-base text-gray-600">
                Loading gallery...
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
          {!loading && !error && galleryItems.length === 0 && (
            <div className="py-16 text-center">
              <p className="text-lg font-medium text-gray-700">
                No gallery items available right now.
              </p>

              <p className="mt-2 text-sm text-gray-500">
                Please check again later.
              </p>
            </div>
          )}

          {/* Gallery Grid */}
          {!loading && !error && galleryItems.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {galleryItems.map((item) => (
                <article
                  key={item._id}
                  className="group overflow-hidden rounded-2xl bg-gray-100 shadow-sm"
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>

                  <div className="p-5">
                    <p className="text-xs font-semibold uppercase tracking-wider text-orange-600">
                      {item.category}
                    </p>

                    <h2 className="mt-2 text-xl font-bold text-gray-900">
                      {item.title}
                    </h2>

                    {item.description && (
                      <p className="mt-2 text-sm leading-6 text-gray-600">
                        {item.description}
                      </p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Experience Section */}
      <section className="bg-gray-50 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-orange-600">
            The CaféNest Experience
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Good Food. Great Moments.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl leading-7 text-gray-600">
            From freshly prepared dishes to a welcoming atmosphere, every
            visit to CaféNest is designed to create a memorable experience.
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
              href="/contact"
              className="rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-800 transition hover:bg-gray-100"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Gallery;