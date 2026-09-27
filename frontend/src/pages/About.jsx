import { Link } from "react-router-dom";

function About() {
  return (
    <>
      {/* Page Hero */}
      <section className="overflow-hidden bg-orange-50 px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-7xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-600 sm:text-sm sm:tracking-[0.2em]">
            About CaféNest
          </p>

          <h1 className="mx-auto mt-3 max-w-4xl text-4xl font-bold leading-[1.1] tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
            Good Food. Warm Moments.
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-6 text-gray-600 sm:text-base sm:leading-7 lg:text-lg">
            We believe great food brings people together. At CaféNest, we
            combine fresh ingredients, delicious flavours, and a welcoming
            atmosphere to create memorable dining experiences.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="overflow-hidden bg-white px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-8 md:grid-cols-2 md:gap-10 lg:gap-16">
          <div className="overflow-hidden rounded-2xl shadow-lg sm:rounded-3xl">
            <img
              src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=80"
              alt="CaféNest restaurant interior"
              loading="lazy"
              className="h-[300px] w-full object-cover sm:h-[400px] lg:h-[450px]"
            />
          </div>

          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-600 sm:text-sm sm:tracking-[0.2em]">
              Our Story
            </p>

            <h2 className="mt-3 text-3xl font-bold leading-tight text-gray-900 sm:text-4xl">
              A Place Made for Food & People
            </h2>

            <p className="mt-5 text-sm leading-6 text-gray-600 sm:text-base sm:leading-7">
              CaféNest started with a simple idea — create a place where
              delicious food and meaningful moments come together. From casual
              meals to special gatherings, we want every visit to feel
              comfortable and memorable.
            </p>

            <p className="mt-4 text-sm leading-6 text-gray-600 sm:text-base sm:leading-7">
              Our menu brings together comforting favourites and carefully
              prepared dishes using quality ingredients. We focus on flavour,
              freshness, presentation, and consistency in everything we serve.
            </p>

            <p className="mt-4 text-sm leading-6 text-gray-600 sm:text-base sm:leading-7">
              More than a restaurant, CaféNest is a place where friends meet,
              families gather, and customers can simply relax and enjoy good
              food.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="overflow-hidden bg-gray-50 px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-600 sm:text-sm sm:tracking-[0.2em]">
              What We Believe
            </p>

            <h2 className="mt-3 text-3xl font-bold leading-tight text-gray-900 sm:text-4xl">
              Our Mission & Values
            </h2>

            <p className="mt-4 text-sm leading-6 text-gray-600 sm:text-base sm:leading-7">
              Everything we do is guided by a few simple principles that help
              us create a better experience for our customers.
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:mt-12 md:grid-cols-3 md:gap-6">
            <div className="flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg sm:p-7">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-orange-100 text-2xl">
                🌱
              </div>

              <h3 className="mt-5 text-lg font-semibold text-gray-900 sm:text-xl">
                Quality First
              </h3>

              <p className="mt-3 text-sm leading-6 text-gray-600">
                We carefully select ingredients and focus on quality at every
                stage of preparation.
              </p>
            </div>

            <div className="flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg sm:p-7">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-orange-100 text-2xl">
                🍽️
              </div>

              <h3 className="mt-5 text-lg font-semibold text-gray-900 sm:text-xl">
                Great Taste
              </h3>

              <p className="mt-3 text-sm leading-6 text-gray-600">
                Every dish is prepared with attention to flavour, freshness,
                presentation, and consistency.
              </p>
            </div>

            <div className="flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg sm:p-7">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-orange-100 text-2xl">
                ❤️
              </div>

              <h3 className="mt-5 text-lg font-semibold text-gray-900 sm:text-xl">
                Customer Care
              </h3>

              <p className="mt-3 text-sm leading-6 text-gray-600">
                We want every customer to feel welcomed, comfortable, and
                valued whenever they visit us.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Customers Choose Us */}
      <section className="overflow-hidden bg-white px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-8 md:grid-cols-2 md:gap-10 lg:gap-16">
          <div className="order-2 md:order-1">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-600 sm:text-sm sm:tracking-[0.2em]">
              Why CaféNest
            </p>

            <h2 className="mt-3 text-3xl font-bold leading-tight text-gray-900 sm:text-4xl">
              An Experience You Will Want to Come Back To
            </h2>

            <p className="mt-5 text-sm leading-6 text-gray-600 sm:text-base sm:leading-7">
              We keep things simple: good food, friendly service, and a
              comfortable environment. Our goal is to make every visit
              enjoyable, whether you are here for a quick bite or a relaxed
              meal.
            </p>

            <div className="mt-7 space-y-5 sm:mt-8">
              <div className="flex gap-3 sm:gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                  ✓
                </div>

                <div className="min-w-0">
                  <h3 className="font-semibold text-gray-900">
                    Freshly Prepared Food
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-gray-600">
                    Dishes are prepared with care using quality ingredients.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 sm:gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                  ✓
                </div>

                <div className="min-w-0">
                  <h3 className="font-semibold text-gray-900">
                    Comfortable Atmosphere
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-gray-600">
                    A welcoming space for family meals, friends, and casual
                    conversations.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 sm:gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                  ✓
                </div>

                <div className="min-w-0">
                  <h3 className="font-semibold text-gray-900">
                    Friendly Service
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-gray-600">
                    We care about making every customer feel welcome and
                    appreciated.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 sm:gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                  ✓
                </div>

                <div className="min-w-0">
                  <h3 className="font-semibold text-gray-900">
                    Something for Everyone
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-gray-600">
                    From snacks and burgers to pasta, pizza, salads, and
                    desserts, there is something to enjoy.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="order-1 overflow-hidden rounded-2xl shadow-lg sm:rounded-3xl md:order-2">
            <img
              src="https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1000&q=80"
              alt="CaféNest dining area"
              loading="lazy"
              className="h-[320px] w-full object-cover sm:h-[420px] lg:h-[500px]"
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="overflow-hidden bg-orange-600 px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-100 sm:text-sm sm:tracking-[0.2em]">
            Visit CaféNest
          </p>

          <h2 className="mt-3 text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
            Come In, Sit Back & Enjoy
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-6 text-orange-50 sm:text-base sm:leading-7 lg:text-lg">
            Ready to discover your next favourite dish? Explore our menu or
            get in touch with us today.
          </p>

          <div className="mx-auto mt-7 flex w-full max-w-md flex-col justify-center gap-3 sm:mt-8 sm:max-w-none sm:flex-row">
            <Link
              to="/menu"
              className="inline-flex min-h-11 items-center justify-center rounded-lg bg-white px-6 py-3 text-sm font-semibold text-orange-600 transition hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-orange-600"
            >
              Explore Menu
            </Link>

            <Link
              to="/contact"
              className="inline-flex min-h-11 items-center justify-center rounded-lg border border-white/50 bg-transparent px-6 py-3 text-sm font-semibold text-white transition hover:bg-white hover:text-orange-600 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-orange-600"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

export default About;
 