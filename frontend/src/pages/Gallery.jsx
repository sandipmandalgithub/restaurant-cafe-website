const galleryImages = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
    title: "Our Restaurant",
    category: "Restaurant",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1200&q=80",
    title: "Dining Area",
    category: "Restaurant",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=1000&q=80",
    title: "Creamy Pasta",
    category: "Food",
  },
  {
    id: 4,
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1000&q=80",
    title: "Classic Burger",
    category: "Food",
  },
  {
    id: 5,
    image:
      "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=1000&q=80",
    title: "Margherita Pizza",
    category: "Food",
  },
  {
    id: 6,
    image:
      "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=1000&q=80",
    title: "Grilled Sandwich",
    category: "Food",
  },
  {
    id: 7,
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1000&q=80",
    title: "Fresh Salad",
    category: "Food",
  },
  {
    id: 8,
    image:
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1000&q=80",
    title: "Chocolate Dessert",
    category: "Dessert",
  },
];

function Gallery() {
  return (
    <>
      {/* Page Hero */}
      <section className="bg-orange-50 px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-7xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-600">
            Our Gallery
          </p>

          <h1 className="mt-3 text-4xl font-bold leading-tight text-gray-900 sm:text-5xl lg:text-6xl">
            A Taste of CaféNest
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-gray-600 sm:text-lg">
            Take a look at our food, dining space, and the atmosphere that
            makes CaféNest special.
          </p>
        </div>
      </section>

      {/* Gallery */}
      <section className="bg-white px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {galleryImages.map((item, index) => (
              <article
                key={item.id}
                className={`group relative overflow-hidden rounded-2xl ${
                  index === 0 || index === 5
                    ? "sm:row-span-2"
                    : ""
                }`}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  loading={index > 1 ? "lazy" : "eager"}
                  className={`w-full object-cover transition duration-500 group-hover:scale-105 ${
                    index === 0 || index === 5
                      ? "h-[500px] sm:h-full"
                      : "h-[260px]"
                  }`}
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/0 transition duration-300 group-hover:bg-black/45" />

                <div className="absolute inset-x-0 bottom-0 translate-y-2 p-5 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  <span className="inline-block rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-orange-600">
                    {item.category}
                  </span>

                  <h2 className="mt-2 text-xl font-semibold text-white">
                    {item.title}
                  </h2>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="bg-gray-50 px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-10 md:grid-cols-2 lg:gap-16">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-600">
              The CaféNest Experience
            </p>

            <h2 className="mt-3 text-3xl font-bold leading-tight text-gray-900 sm:text-4xl">
              Come for the Food, Stay for the Atmosphere
            </h2>

            <p className="mt-5 text-base leading-7 text-gray-600">
              We believe dining is about more than just the food. From the
              moment you walk through our doors, we want you to feel
              comfortable, relaxed, and welcome.
            </p>

            <p className="mt-4 text-base leading-7 text-gray-600">
              Whether you are enjoying a quick coffee, having lunch with
              friends, or sharing dinner with family, CaféNest is designed to
              make every moment enjoyable.
            </p>

            <div className="mt-7 grid grid-cols-2 gap-4 sm:max-w-md">
              <div className="rounded-xl border border-gray-200 bg-white p-5">
                <p className="text-2xl font-bold text-orange-600">50+</p>
                <p className="mt-1 text-sm text-gray-600">Menu Items</p>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-5">
                <p className="text-2xl font-bold text-orange-600">5+</p>
                <p className="mt-1 text-sm text-gray-600">Years Experience</p>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-3xl shadow-lg">
            <img
              src="https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=1200&q=80"
              alt="CaféNest dining experience"
              loading="lazy"
              className="h-[360px] w-full object-cover sm:h-[450px]"
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-orange-600 px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-100">
            Visit Us
          </p>

          <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            See It. Taste It. Enjoy It.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-orange-50 sm:text-lg">
            Pictures can only show you so much. Come visit CaféNest and
            experience our food and atmosphere for yourself.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-lg bg-white px-6 py-3 text-sm font-semibold text-orange-600 transition hover:bg-orange-50"
            >
              WhatsApp Us
            </a>

            <a
              href="tel:+919876543210"
              className="inline-flex items-center justify-center rounded-lg border border-white/50 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white hover:text-orange-600"
            >
              Call Us
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

export default Gallery;
