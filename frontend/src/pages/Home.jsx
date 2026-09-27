import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import menuData from "../data/menuData";

const BUSINESS_SETTINGS_API =
  "http://localhost:5000/api/business-settings";

// WhatsApp Icon Component
function WhatsAppIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-5 w-5 shrink-0"
      aria-hidden="true"
    >
      <path d="M20.52 3.48A11.84 11.84 0 0 0 12.07 0C5.54 0 .23 5.31.23 11.84c0 2.09.55 4.13 1.6 5.93L.13 24l6.38-1.67a11.82 11.82 0 0 0 5.56 1.42h.01c6.53 0 11.84-5.31 11.84-11.84 0-3.17-1.23-6.15-3.4-8.43ZM12.08 21.8h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.79.99 1.01-3.69-.23-.38a9.85 9.85 0 0 1-1.51-5.29C2.16 6.4 6.61 1.96 12.08 1.96c2.65 0 5.14 1.03 7.01 2.91a9.85 9.85 0 0 1 2.9 7.02c0 5.47-4.45 9.91-9.91 9.91Zm5.43-7.42c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.65.07-.3-.15-1.27-.47-2.42-1.49-.9-.8-1.5-1.78-1.67-2.08-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.2-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.05 1.02-1.05 2.49s1.07 2.89 1.22 3.09c.15.2 2.1 3.2 5.08 4.49.71.31 1.27.5 1.7.64.71.23 1.35.2 1.86.12.57-.08 1.76-.72 2.01-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35Z" />
    </svg>
  );
}

function Home() {
  const [businessSettings, setBusinessSettings] = useState({
    businessName: "CaféNest",
    phone: "+919876543210",
    address: "Kolkata, West Bengal, India",
    openingTime: "10:00 AM",
    closingTime: "10:00 PM",
    whatsappNumber: "919876543210",
    description:
      "Fresh food, delicious flavours, and a warm atmosphere for every occasion.",
  });

  useEffect(() => {
    const loadBusinessSettings = async () => {
      try {
        const response = await fetch(BUSINESS_SETTINGS_API);
        const result = await response.json();

        if (response.ok && result.success && result.data) {
          setBusinessSettings((previousSettings) => ({
            ...previousSettings,
            ...result.data,
          }));
        }
      } catch (error) {
        console.error(
          "Failed to load business settings:",
          error
        );
      }
    };

    loadBusinessSettings();
  }, []);

  const cleanPhoneNumber = (phone = "") => {
    return phone.replace(/\D/g, "");
  };

  const phoneNumber = cleanPhoneNumber(
    businessSettings.phone
  );

  const whatsappNumber = cleanPhoneNumber(
    businessSettings.whatsappNumber ||
      businessSettings.phone
  );

  const whatsappUrl = whatsappNumber
    ? `https://wa.me/${whatsappNumber}`
    : "#";

  const businessName =
    businessSettings.businessName || "CaféNest";

  const phoneDisplay =
    businessSettings.phone || "+91 98765 43210";

  const openingTime =
    businessSettings.openingTime || "10:00 AM";

  const closingTime =
    businessSettings.closingTime || "10:00 PM";

  const address =
    businessSettings.address ||
    "Kolkata, West Bengal, India";

  const businessDescription =
    businessSettings.description ||
    "Fresh food, delicious flavours, and a warm atmosphere for every occasion.";

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-orange-50">
        <div className="mx-auto grid min-h-[calc(100vh-64px)] max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 sm:py-16 md:grid-cols-2 md:gap-8 lg:px-8 lg:gap-12 lg:py-20">
          <div className="mx-auto w-full max-w-xl text-center md:mx-0 md:text-left">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-orange-600 sm:text-sm sm:tracking-[0.2em]">
              Welcome to {businessName}
            </p>

            <h1 className="text-4xl font-bold leading-[1.1] tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              Fresh Flavours,
              <span className="block text-orange-600">
                Warm Moments.
              </span>
            </h1>

            <p className="mx-auto mt-5 max-w-lg text-sm leading-6 text-gray-600 sm:mt-6 sm:text-base sm:leading-7 lg:text-lg">
              {businessDescription}
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:justify-center md:justify-start">
              <Link
                to="/menu"
                className="inline-flex min-h-11 items-center justify-center rounded-lg bg-orange-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
              >
                View Menu
              </Link>

              <Link
                to="/contact"
                className="inline-flex min-h-11 items-center justify-center rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-800 transition hover:border-orange-600 hover:text-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
              >
                Contact Us
              </Link>
            </div>

            <div className="mx-auto mt-9 grid max-w-md grid-cols-3 gap-2 border-t border-orange-200 pt-5 sm:mt-10 sm:gap-4 sm:pt-6 md:mx-0">
              <div className="min-w-0">
                <p className="text-lg font-bold text-gray-900 sm:text-xl">
                  4.9★
                </p>

                <p className="mt-1 text-[11px] leading-4 text-gray-500 sm:text-sm sm:leading-5">
                  Customer Rating
                </p>
              </div>

              <div className="min-w-0">
                <p className="text-lg font-bold text-gray-900 sm:text-xl">
                  50+
                </p>

                <p className="mt-1 text-[11px] leading-4 text-gray-500 sm:text-sm sm:leading-5">
                  Menu Items
                </p>
              </div>

              <div className="min-w-0">
                <p className="text-lg font-bold text-gray-900 sm:text-xl">
                  5+
                </p>

                <p className="mt-1 text-[11px] leading-4 text-gray-500 sm:text-sm sm:leading-5">
                  Years Experience
                </p>
              </div>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-xl pb-5 md:pb-0">
            <div className="overflow-hidden rounded-2xl shadow-xl sm:rounded-3xl sm:shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=80"
                alt={`${businessName} restaurant interior`}
                className="h-[300px] w-full object-cover sm:h-[400px] md:h-[430px] lg:h-[500px]"
              />
            </div>

            <div className="absolute bottom-0 left-3 max-w-[calc(100%-24px)] rounded-xl bg-white px-4 py-3 shadow-lg sm:bottom-3 sm:left-6 sm:rounded-2xl sm:px-5 sm:py-4">
              <p className="text-xs font-semibold text-gray-900 sm:text-sm">
                Freshly Prepared
              </p>

              <p className="mt-1 text-[11px] text-gray-500 sm:text-xs">
                Made with quality ingredients
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="bg-white px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-600 sm:text-sm sm:tracking-[0.2em]">
              Why Choose Us
            </p>

            <h2 className="mt-3 text-3xl font-bold leading-tight text-gray-900 sm:text-4xl">
              Good Food, Great Experience
            </h2>

            <p className="mt-4 text-sm leading-6 text-gray-600 sm:text-base sm:leading-7">
              We focus on quality ingredients, delicious flavours,
              and a comfortable experience for every guest.
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:mt-12 md:grid-cols-3 md:gap-6">
            <div className="flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-lg sm:p-7">
              <div className="mx-auto flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-orange-100 text-2xl">
                🥗
              </div>

              <h3 className="mt-5 text-lg font-semibold text-gray-900 sm:text-xl">
                Fresh Ingredients
              </h3>

              <p className="mt-3 text-sm leading-6 text-gray-600">
                We use carefully selected ingredients to prepare
                fresh and flavourful dishes every day.
              </p>
            </div>

            <div className="flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-lg sm:p-7">
              <div className="mx-auto flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-orange-100 text-2xl">
                👨‍🍳
              </div>

              <h3 className="mt-5 text-lg font-semibold text-gray-900 sm:text-xl">
                Expertly Prepared
              </h3>

              <p className="mt-3 text-sm leading-6 text-gray-600">
                Our dishes are prepared with attention to flavour,
                quality, presentation, and consistency.
              </p>
            </div>

            <div className="flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-lg sm:p-7">
              <div className="mx-auto flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-orange-100 text-2xl">
                ❤️
              </div>

              <h3 className="mt-5 text-lg font-semibold text-gray-900 sm:text-xl">
                Made With Care
              </h3>

              <p className="mt-3 text-sm leading-6 text-gray-600">
                From preparation to service, we care about creating
                a pleasant experience for every customer.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Menu Section */}
      <section className="overflow-hidden bg-gray-50 px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-600 sm:text-sm sm:tracking-[0.2em]">
              Our Menu
            </p>

            <h2 className="mt-3 text-3xl font-bold leading-tight text-gray-900 sm:text-4xl">
              Popular Dishes
            </h2>

            <p className="mt-4 text-sm leading-6 text-gray-600 sm:text-base sm:leading-7">
              A selection of customer favourites prepared fresh for you.
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:mt-12 sm:grid-cols-2 lg:grid-cols-3">
            {menuData.map((item) => (
              <article
                key={item.id}
                className="flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                    className="h-52 w-full object-cover transition duration-300 hover:scale-105 sm:h-56"
                  />
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="break-words text-lg font-semibold text-gray-900">
                        {item.name}
                      </h3>

                      <p className="mt-1 text-xs font-medium uppercase tracking-wide text-orange-600">
                        {item.category}
                      </p>
                    </div>

                    <p className="shrink-0 whitespace-nowrap text-base font-bold text-orange-600 sm:text-lg">
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

          <div className="mt-9 text-center sm:mt-10">
            <Link
              to="/menu"
              className="inline-flex min-h-11 items-center justify-center rounded-lg bg-orange-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
            >
              View Full Menu
            </Link>
          </div>
        </div>
      </section>

      {/* About Preview Section */}
      <section className="overflow-hidden bg-white px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-8 md:grid-cols-2 md:gap-10 lg:gap-16">
          <div className="overflow-hidden rounded-2xl sm:rounded-3xl">
            <img
              src="https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1000&q=80"
              alt={`${businessName} restaurant`}
              loading="lazy"
              className="h-[300px] w-full object-cover sm:h-[400px] lg:h-[450px]"
            />
          </div>

          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-600 sm:text-sm sm:tracking-[0.2em]">
              Our Story
            </p>

            <h2 className="mt-3 text-3xl font-bold leading-tight text-gray-900 sm:text-4xl">
              More Than Just a Place to Eat
            </h2>

            <p className="mt-5 text-sm leading-6 text-gray-600 sm:text-base sm:leading-7">
              {businessName} was created with a simple idea — bring
              people together through delicious food and a welcoming
              atmosphere. Every dish is prepared with carefully selected
              ingredients and attention to detail.
            </p>

            <p className="mt-4 text-sm leading-6 text-gray-600 sm:text-base sm:leading-7">
              Whether you are meeting friends, enjoying a family meal,
              or simply taking a break from a busy day, we want every
              visit to feel special.
            </p>

            <Link
              to="/about"
              className="mt-6 inline-flex min-h-11 items-center justify-center rounded-lg bg-gray-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 sm:mt-7"
            >
              Learn More About Us
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="overflow-hidden bg-orange-600 px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-100 sm:text-sm sm:tracking-[0.2em]">
            Come Visit Us
          </p>

          <h2 className="mt-3 text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
            Ready for a Delicious Experience?
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-6 text-orange-50 sm:text-base sm:leading-7">
            Whether you are planning a meal with family, meeting
            friends, or simply craving something delicious, we would
            love to welcome you.
          </p>

          <div className="mx-auto mt-7 flex w-full max-w-md flex-col justify-center gap-3 sm:mt-8 sm:max-w-none sm:flex-row">
            <Link
              to="/menu"
              className="inline-flex min-h-11 items-center justify-center rounded-lg bg-white px-6 py-3 text-sm font-semibold text-orange-600 transition hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-orange-600"
            >
              Explore Our Menu
            </Link>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-white/50 bg-transparent px-6 py-3 text-sm font-semibold text-white transition hover:bg-white hover:text-orange-600 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-orange-600"
            >
              <WhatsAppIcon />
              WhatsApp Us
            </a>
          </div>

          <div className="mt-6 space-y-3 text-sm text-orange-100">
            <p className="break-words">
              Call us at{" "}
              <a
                href={`tel:${phoneNumber}`}
                className="font-semibold text-white underline underline-offset-4"
              >
                {phoneDisplay}
              </a>
            </p>

            <p className="break-words">
              <span aria-hidden="true">📍 </span>
              <span className="font-medium text-white">
                {address}
              </span>
            </p>

            <p>
              <span aria-hidden="true">🕒 </span>
              Open{" "}
              <span className="font-medium text-white">
                {openingTime} - {closingTime}
              </span>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;
