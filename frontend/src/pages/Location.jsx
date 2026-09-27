function Location() {
  const address = "CaféNest, Kolkata, West Bengal, India";

  const mapUrl =
    "https://www.google.com/maps?q=Kolkata,+West+Bengal,+India&output=embed";

  const directionsUrl =
    "https://www.google.com/maps/dir/?api=1&destination=Kolkata,+West+Bengal,+India";

  return (
    <div className="overflow-hidden">
      {/* ==================================================
          Hero Section
      ================================================== */}
      <section className="bg-orange-50 px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-7xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-600 sm:text-sm sm:tracking-widest">
            Find Us
          </p>

          <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
            Visit CaféNest
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-gray-600 sm:mt-5 sm:text-lg sm:leading-8">
            Come enjoy delicious food, warm hospitality, and a comfortable
            dining experience at CaféNest.
          </p>
        </div>
      </section>

      {/* ==================================================
          Location Section
      ================================================== */}
      <section className="bg-white px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start lg:gap-14 xl:gap-16">
          {/* ==================================================
              Location Information
          ================================================== */}
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-600 sm:text-sm sm:tracking-widest">
              Our Location
            </p>

            <h2 className="mt-3 text-2xl font-bold leading-tight tracking-tight text-gray-900 sm:text-4xl">
              We Are Easy to Find
            </h2>

            <p className="mt-4 text-sm leading-6 text-gray-600 sm:mt-5 sm:text-base sm:leading-7">
              Planning a visit? Find our location, check our opening hours, or
              contact us directly before you arrive.
            </p>

            {/* ==================================================
                Information Cards
            ================================================== */}
            <div className="mt-7 space-y-4 sm:mt-8">
              {/* Address */}
              <div className="min-w-0 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition duration-200 hover:shadow-md sm:p-5">
                <div className="flex min-w-0 items-start gap-3 sm:gap-4">
                  <div
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-orange-100 text-xl sm:h-12 sm:w-12"
                    aria-hidden="true"
                  >
                    📍
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-500">
                      Address
                    </p>

                    <p className="mt-1 break-words font-semibold leading-6 text-gray-900">
                      {address}
                    </p>
                  </div>
                </div>
              </div>

              {/* Phone */}
              <a
                href="tel:+919876543210"
                className="block min-w-0 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition duration-200 hover:border-orange-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 sm:p-5"
              >
                <div className="flex min-w-0 items-start gap-3 sm:gap-4">
                  <div
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-orange-100 text-xl sm:h-12 sm:w-12"
                    aria-hidden="true"
                  >
                    📞
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-500">
                      Phone
                    </p>

                    <p className="mt-1 break-all font-semibold text-gray-900">
                      +91 98765 43210
                    </p>
                  </div>
                </div>
              </a>

              {/* Opening Hours */}
              <div className="min-w-0 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition duration-200 hover:shadow-md sm:p-5">
                <div className="flex min-w-0 items-start gap-3 sm:gap-4">
                  <div
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-orange-100 text-xl sm:h-12 sm:w-12"
                    aria-hidden="true"
                  >
                    🕒
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-500">
                      Opening Hours
                    </p>

                    <p className="mt-1 font-semibold text-gray-900">
                      Monday - Sunday
                    </p>

                    <p className="mt-1 text-sm leading-6 text-gray-500">
                      10:00 AM - 10:00 PM
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* ==================================================
                Action Buttons
            ================================================== */}
            <div className="mt-7 grid gap-3 sm:mt-8 sm:grid-cols-2">
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center justify-center rounded-lg bg-orange-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
              >
                🗺️ Get Directions
              </a>

              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-green-500 px-5 py-3 text-sm font-semibold text-green-600 transition hover:bg-green-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-5 w-5 shrink-0"
                  aria-hidden="true"
                >
                  <path d="M20.52 3.48A11.84 11.84 0 0 0 12.07 0C5.54 0 .23 5.31.23 11.84c0 2.09.55 4.13 1.6 5.93L.13 24l6.38-1.67a11.82 11.82 0 0 0 5.56 1.42h.01c6.53 0 11.84-5.31 11.84-11.84 0-3.17-1.23-6.15-3.4-8.43ZM12.08 21.8h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.79.99 1.01-3.69-.23-.38a9.85 9.85 0 0 1-1.51-5.29C2.16 6.4 6.61 1.96 12.08 1.96c2.65 0 5.14 1.03 7.01 2.91a9.85 9.85 0 0 1 2.9 7.02c0 5.47-4.45 9.91-9.91 9.91Zm5.43-7.42c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.65.07-.3-.15-1.27-.47-2.42-1.49-.9-.8-1.5-1.78-1.67-2.08-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.05 1.02-1.05 2.49s1.07 2.89 1.22 3.09c.15.2 2.1 3.2 5.08 4.49.71.31 1.27.5 1.7.64.71.23 1.35.2 1.86.12.57-.08 1.76-.72 2.01-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35Z" />
                </svg>

                WhatsApp Us
              </a>
            </div>
          </div>

          {/* ==================================================
              Google Maps
          ================================================== */}
          <div className="min-w-0 overflow-hidden rounded-2xl border border-gray-200 bg-gray-100 shadow-lg sm:rounded-3xl">
            <iframe
              title="CaféNest location on Google Maps"
              src={mapUrl}
              className="block h-[300px] w-full sm:h-[400px] lg:h-[550px]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      {/* ==================================================
          Visit Information
      ================================================== */}
      <section className="bg-gray-50 px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-600 sm:text-sm sm:tracking-widest">
              Before You Visit
            </p>

            <h2 className="mt-3 text-2xl font-bold leading-tight tracking-tight text-gray-900 sm:text-4xl">
              Everything You Need to Know
            </h2>

            <p className="mt-4 text-sm leading-6 text-gray-600 sm:text-base sm:leading-7">
              Here are a few useful details to help you plan your visit.
            </p>
          </div>

          <div className="mt-9 grid gap-5 sm:mt-12 md:grid-cols-3">
            {/* Opening Hours */}
            <div className="flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md sm:p-7">
              <div
                className="mx-auto flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-orange-100 text-2xl"
                aria-hidden="true"
              >
                🕒
              </div>

              <h3 className="mt-5 text-xl font-semibold text-gray-900">
                Opening Hours
              </h3>

              <p className="mt-3 text-sm leading-6 text-gray-600">
                Open every day from 10:00 AM to 10:00 PM.
              </p>
            </div>

            {/* Easy to Reach */}
            <div className="flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md sm:p-7">
              <div
                className="mx-auto flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-orange-100 text-2xl"
                aria-hidden="true"
              >
                🚗
              </div>

              <h3 className="mt-5 text-xl font-semibold text-gray-900">
                Easy to Reach
              </h3>

              <p className="mt-3 text-sm leading-6 text-gray-600">
                Use Google Maps to find the best route from your current
                location.
              </p>
            </div>

            {/* Need Help */}
            <div className="flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md sm:p-7">
              <div className="mx-auto flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-orange-100">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-7 w-7 text-green-600"
                  aria-hidden="true"
                >
                  <path d="M20.52 3.48A11.84 11.84 0 0 0 12.07 0C5.54 0 .23 5.31.23 11.84c0 2.09.55 4.13 1.6 5.93L.13 24l6.38-1.67a11.82 11.82 0 0 0 5.56 1.42h.01c6.53 0 11.84-5.31 11.84-11.84 0-3.17-1.23-6.15-3.4-8.43ZM12.08 21.8h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.79.99 1.01-3.69-.23-.38a9.85 9.85 0 0 1-1.51-5.29C2.16 6.4 6.61 1.96 12.08 1.96c2.65 0 5.14 1.03 7.01 2.91a9.85 9.85 0 0 1 2.9 7.02c0 5.47-4.45 9.91-9.91 9.91Zm5.43-7.42c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.65.07-.3-.15-1.27-.47-2.42-1.49-.9-.8-1.5-1.78-1.67-2.08-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.05 1.02-1.05 2.49s1.07 2.89 1.22 3.09c.15.2 2.1 3.2 5.08 4.49.71.31 1.27.5 1.7.64.71.23 1.35.2 1.86.12.57-.08 1.76-.72 2.01-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35Z" />
                </svg>
              </div>

              <h3 className="mt-5 text-xl font-semibold text-gray-900">
                Need Help?
              </h3>

              <p className="mt-3 text-sm leading-6 text-gray-600">
                Call or WhatsApp us if you need directions or have any
                questions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================
          CTA
      ================================================== */}
      <section className="bg-orange-600 px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-100 sm:text-sm sm:tracking-widest">
            We Are Waiting for You
          </p>

          <h2 className="mt-3 text-2xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
            Your Table Is Waiting
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-orange-50 sm:mt-5 sm:text-lg sm:leading-8">
            Come enjoy your favourite dishes and spend some quality time at
            CaféNest.
          </p>

          <div className="mx-auto mt-7 grid w-full max-w-sm gap-3 sm:mt-8 sm:max-w-none sm:grid-cols-2 sm:flex sm:justify-center">
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center justify-center rounded-lg bg-white px-6 py-3 text-sm font-semibold text-orange-600 transition hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-orange-600"
            >
              🗺️ Get Directions
            </a>

            <a
              href="tel:+919876543210"
              className="inline-flex min-h-11 items-center justify-center rounded-lg border border-white/50 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white hover:text-orange-600 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-orange-600"
            >
              📞 Call Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Location;
