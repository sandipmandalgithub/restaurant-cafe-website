import { Link } from "react-router-dom";
import menuData from "../data/menuData";

function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-orange-50">
        <div className="mx-auto grid min-h-[calc(100vh-73px)] max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 lg:px-8 lg:py-20">
          <div className="max-w-xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-orange-600">
              Welcome to CaféNest
            </p>

            <h1 className="text-4xl font-bold leading-tight text-gray-900 sm:text-5xl lg:text-6xl">
              Fresh Flavours,
              <span className="block text-orange-600">Warm Moments.</span>
            </h1>

            <p className="mt-6 max-w-lg text-base leading-7 text-gray-600 sm:text-lg">
              Discover delicious food, freshly prepared with quality
              ingredients and served in a warm and welcoming atmosphere.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/menu"
                className="inline-flex items-center justify-center rounded-lg bg-orange-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-700"
              >
                View Menu
              </Link>

              <Link
                to="/contact"
                className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-800 transition hover:border-orange-600 hover:text-orange-600"
              >
                Contact Us
              </Link>
            </div>

            <div className="mt-10 grid max-w-md grid-cols-3 gap-4 border-t border-orange-200 pt-6">
              <div>
                <p className="text-xl font-bold text-gray-900">4.9★</p>
                <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                  Customer Rating
                </p>
              </div>

              <div>
                <p className="text-xl font-bold text-gray-900">50+</p>
                <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                  Menu Items
                </p>
              </div>

              <div>
                <p className="text-xl font-bold text-gray-900">5+</p>
                <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                  Years Experience
                </p>
              </div>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-xl">
            <div className="overflow-hidden rounded-3xl shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=80"
                alt="Restaurant interior"
                className="h-[380px] w-full object-cover sm:h-[480px]"
              />
            </div>

            <div className="absolute -bottom-5 left-4 rounded-2xl bg-white px-5 py-4 shadow-xl sm:left-8">
              <p className="text-sm font-semibold text-gray-900">
                Freshly Prepared
              </p>

              <p className="mt-1 text-xs text-gray-500">
                Made with quality ingredients
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="bg-white px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-600">
              Why Choose Us
            </p>

            <h2 className="mt-3 text-3xl font-bold text-gray-900 sm:text-4xl">
              Good Food, Great Experience
            </h2>

            <p className="mt-4 text-base leading-7 text-gray-600">
              We focus on quality ingredients, delicious flavours, and a
              comfortable experience for every guest.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-gray-200 bg-white p-7 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-orange-100 text-2xl">
                🥗
              </div>

              <h3 className="mt-5 text-xl font-semibold text-gray-900">
                Fresh Ingredients
              </h3>

              <p className="mt-3 text-sm leading-6 text-gray-600">
                We use carefully selected ingredients to prepare fresh and
                flavourful dishes every day.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-7 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-orange-100 text-2xl">
                👨‍🍳
              </div>

              <h3 className="mt-5 text-xl font-semibold text-gray-900">
                Expertly Prepared
              </h3>

              <p className="mt-3 text-sm leading-6 text-gray-600">
                Our dishes are prepared with attention to flavour, quality,
                presentation, and consistency.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-7 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-orange-100 text-2xl">
                ❤️
              </div>

              <h3 className="mt-5 text-xl font-semibold text-gray-900">
                Made With Care
              </h3>

              <p className="mt-3 text-sm leading-6 text-gray-600">
                From preparation to service, we care about creating a pleasant
                experience for every customer.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Menu Section */}
      <section className="bg-gray-50 px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-600">
              Our Menu
            </p>

            <h2 className="mt-3 text-3xl font-bold text-gray-900 sm:text-4xl">
              Popular Dishes
            </h2>

            <p className="mt-4 text-base leading-7 text-gray-600">
              A selection of customer favourites prepared fresh for you.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {menuData.map((item) => (
              <article
                key={item.id}
                className="overflow-hidden rounded-2xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-56 w-full object-cover transition duration-300 hover:scale-105"
                  />
                </div>

                <div className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {item.name}
                      </h3>

                      <p className="mt-1 text-xs font-medium uppercase tracking-wide text-orange-600">
                        {item.category}
                      </p>
                    </div>

                    <p className="whitespace-nowrap text-lg font-bold text-orange-600">
                      ₹{item.price}
                    </p>
                  </div>

                  <p className="mt-3 text-sm leading-6 text-gray-600">
                    {item.description}
                  </p>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              to="/menu"
              className="inline-flex items-center justify-center rounded-lg bg-orange-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-700"
            >
              View Full Menu
            </Link>
          </div>
        </div>
      </section>

      {/* About Preview Section */}
      <section className="bg-white px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-10 md:grid-cols-2 lg:gap-16">
          <div className="overflow-hidden rounded-3xl">
            <img
              src="https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1000&q=80"
              alt="CaféNest restaurant"
              className="h-[360px] w-full object-cover sm:h-[450px]"
            />
          </div>

          <div className="max-w-xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-600">
              Our Story
            </p>

            <h2 className="mt-3 text-3xl font-bold leading-tight text-gray-900 sm:text-4xl">
              More Than Just a Place to Eat
            </h2>

            <p className="mt-5 text-base leading-7 text-gray-600">
              CaféNest was created with a simple idea — bring people together
              through delicious food and a welcoming atmosphere. Every dish is
              prepared with carefully selected ingredients and attention to
              detail.
            </p>

            <p className="mt-4 text-base leading-7 text-gray-600">
              Whether you are meeting friends, enjoying a family meal, or
              simply taking a break from a busy day, we want every visit to
              feel special.
            </p>

            <Link
              to="/about"
              className="mt-7 inline-flex items-center justify-center rounded-lg bg-gray-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
            >
              Learn More About Us
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-orange-600 px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-100">
            Come Visit Us
          </p>

          <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            Ready for a Delicious Experience?
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-orange-50 sm:text-lg">
            Whether you are planning a meal with family, meeting friends, or
            simply craving something delicious, we would love to welcome you.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              to="/menu"
              className="inline-flex items-center justify-center rounded-lg bg-white px-6 py-3 text-sm font-semibold text-orange-600 transition hover:bg-orange-50"
            >
              Explore Our Menu
            </Link>

            <a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-lg border border-white/50 bg-transparent px-6 py-3 text-sm font-semibold text-white transition hover:bg-white hover:text-orange-600"
            >
              WhatsApp Us
            </a>
          </div>

          <p className="mt-6 text-sm text-orange-100">
            Call us at{" "}
            <a
              href="tel:+919876543210"
              className="font-semibold text-white underline underline-offset-4"
            >
              +91 98765 43210
            </a>
          </p>
        </div>
      </section>
    </>
  );
}

export default Home;