function Location() {
  const address =
    "CaféNest, Kolkata, West Bengal, India";

  const mapUrl =
    "https://www.google.com/maps?q=Kolkata,+West+Bengal,+India&output=embed";

  const directionsUrl =
    "https://www.google.com/maps/dir/?api=1&destination=Kolkata,+West+Bengal,+India";

  return (
    <>
      {/* Page Hero */}
      <section className="bg-orange-50 px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-7xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-600">
            Find Us
          </p>

          <h1 className="mt-3 text-4xl font-bold leading-tight text-gray-900 sm:text-5xl lg:text-6xl">
            Visit CaféNest
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-gray-600 sm:text-lg">
            Come enjoy delicious food, warm hospitality, and a comfortable
            dining experience at CaféNest.
          </p>
        </div>
      </section>

      {/* Location Information */}
      <section className="bg-white px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          {/* Information */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-600">
              Our Location
            </p>

            <h2 className="mt-3 text-3xl font-bold leading-tight text-gray-900 sm:text-4xl">
              We Are Easy to Find
            </h2>

            <p className="mt-5 text-base leading-7 text-gray-600">
              Planning a visit? Find our location, check our opening hours, or
              contact us directly before you arrive.
            </p>

            <div className="mt-8 space-y-4">
              {/* Address */}
              <div className="flex items-start gap-4 rounded-2xl border border-gray-200 p-5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-orange-100 text-xl">
                  📍
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-500">
                    Address
                  </p>

                  <p className="mt-1 font-semibold leading-6 text-gray-900">
                    {address}
                  </p>
                </div>
              </div>

              {/* Phone */}
              <a
                href="tel:+919876543210"
                className="flex items-start gap-4 rounded-2xl border border-gray-200 p-5 transition hover:border-orange-300 hover:shadow-md"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-orange-100 text-xl">
                  📞
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-500">
                    Phone
                  </p>

                  <p className="mt-1 font-semibold text-gray-900">
                    +91 98765 43210
                  </p>
                </div>
              </a>

              {/* Opening Hours */}
              <div className="flex items-start gap-4 rounded-2xl border border-gray-200 p-5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-orange-100 text-xl">
                  🕒
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-500">
                    Opening Hours
                  </p>

                  <p className="mt-1 font-semibold text-gray-900">
                    Monday - Sunday
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    10:00 AM - 10:00 PM
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-lg bg-orange-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-700"
              >
                Get Directions
              </a>

              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-lg border border-green-500 px-6 py-3 text-sm font-semibold text-green-600 transition hover:bg-green-500 hover:text-white"
              >
                WhatsApp Us
              </a>
            </div>
          </div>

          {/* Google Maps */}
          <div className="overflow-hidden rounded-3xl border border-gray-200 bg-gray-100 shadow-lg">
            <iframe
              title="CaféNest location on Google Maps"
              src={mapUrl}
              className="h-[400px] w-full sm:h-[500px]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      {/* Visit Information */}
      <section className="bg-gray-50 px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-600">
              Before You Visit
            </p>

            <h2 className="mt-3 text-3xl font-bold text-gray-900 sm:text-4xl">
              Everything You Need to Know
            </h2>

            <p className="mt-4 text-base leading-7 text-gray-600">
              Here are a few useful details to help you plan your visit.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-gray-200 bg-white p-7 text-center shadow-sm">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-orange-100 text-2xl">
                🕒
              </div>

              <h3 className="mt-5 text-xl font-semibold text-gray-900">
                Opening Hours
              </h3>

              <p className="mt-3 text-sm leading-6 text-gray-600">
                Open every day from 10:00 AM to 10:00 PM.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-7 text-center shadow-sm">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-orange-100 text-2xl">
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

            <div className="rounded-2xl border border-gray-200 bg-white p-7 text-center shadow-sm">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-orange-100 text-2xl">
                💬
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

      {/* CTA */}
      <section className="bg-orange-600 px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-100">
            We Are Waiting for You
          </p>

          <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            Your Table Is Waiting
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-orange-50 sm:text-lg">
            Come enjoy your favourite dishes and spend some quality time at
            CaféNest.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-lg bg-white px-6 py-3 text-sm font-semibold text-orange-600 transition hover:bg-orange-50"
            >
              Get Directions
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

export default Location;
