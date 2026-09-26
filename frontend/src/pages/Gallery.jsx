import { useEffect, useState } from "react";

import { getGallery } from "../services/galleryService";

function Gallery() {
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    getGallery()
      .then((data) => {
        if (!cancelled) {
          setGalleryItems(data);
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error("Failed to fetch gallery items:", error);

        if (!cancelled) {
          setError(
            "Unable to load gallery. Please check your connection and try again."
          );
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const handleRetry = () => {
    window.location.reload();
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
            Take a look at our food, ambience, and memorable moments.
          </p>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="bg-white px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Loading State */}
          {loading && (
            <div className="py-16 text-center">
              <p className="text-base font-medium text-gray-600">
                Loading gallery...
              </p>
            </div>
          )}

          {/* Error State */}
          {!loading && error && (
            <div className="rounded-2xl bg-red-50 px-6 py-10 text-center">
              <p className="text-base font-medium text-red-600">{error}</p>

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
                  className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  {/* Image */}
                  <div className="aspect-[4/3] overflow-hidden bg-gray-100">
                    <img
                      src={item.image}
                      alt={item.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <h2 className="text-xl font-bold text-gray-900">
                        {item.title}
                      </h2>

                      <span className="shrink-0 rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-600">
                        {item.category}
                      </span>
                    </div>

                    {item.description && (
                      <p className="mt-3 text-sm leading-6 text-gray-600">
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

      {/* CTA Section */}
      <section className="bg-orange-50 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Come Visit Us
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-gray-600">
            Enjoy delicious food, a welcoming atmosphere, and a memorable
            experience at CaféNest.
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
