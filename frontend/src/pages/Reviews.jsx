import { useEffect, useState } from "react";

import {
  createReview,
  getApprovedReviews,
} from "../services/reviewService";

function Reviews() {
  const [customerName, setCustomerName] = useState("");
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState("");

  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Load approved reviews
  useEffect(() => {
    const loadReviews = async () => {
      try {
        setReviewsLoading(true);

        const data = await getApprovedReviews();

        setReviews(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to load reviews:", error);
      } finally {
        setReviewsLoading(false);
      }
    };

    loadReviews();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSuccessMessage("");
    setErrorMessage("");

    if (!customerName.trim()) {
      setErrorMessage("Please enter your name.");
      return;
    }

    if (rating === 0) {
      setErrorMessage("Please select a rating.");
      return;
    }

    if (!message.trim()) {
      setErrorMessage("Please write your review.");
      return;
    }

    try {
      setLoading(true);

      await createReview({
        customerName: customerName.trim(),
        rating,
        message: message.trim(),
      });

      setSuccessMessage(
        "Thank you! Your review has been submitted and is awaiting approval."
      );

      setCustomerName("");
      setRating(0);
      setMessage("");
    } catch (error) {
      setErrorMessage(
        error.message || "Unable to submit your review. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) {
      return "";
    }

    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <section className="min-h-screen overflow-hidden bg-gray-50 px-3 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
      <div className="mx-auto w-full max-w-6xl min-w-0">
        {/* Page Header */}
        <div className="mb-8 text-center sm:mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-600 sm:text-sm sm:tracking-widest">
            Customer Reviews
          </p>

          <h1 className="mt-2 text-2xl font-bold leading-tight text-gray-900 sm:mt-3 sm:text-4xl">
            Share Your Experience
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-gray-600 sm:text-base">
            We would love to hear about your experience at CaféNest. Your
            feedback helps us serve you better.
          </p>
        </div>

        {/* Approved Reviews */}
        <div className="mb-10 sm:mb-12">
          <div className="mb-5 text-center sm:mb-6">
            <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
              What Our Customers Say
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-600">
              Read experiences shared by our customers.
            </p>
          </div>

          {/* Loading */}
          {reviewsLoading ? (
            <div className="rounded-2xl bg-white p-6 text-center shadow-sm sm:p-8">
              <div
                className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-orange-600"
                aria-label="Loading reviews"
              />

              <p className="mt-3 text-sm text-gray-500">
                Loading reviews...
              </p>
            </div>
          ) : reviews.length === 0 ? (
            /* Empty State */
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-6 text-center sm:p-8">
              <div className="mb-3 text-4xl" aria-hidden="true">
                ⭐
              </div>

              <h3 className="text-lg font-semibold text-gray-800">
                No reviews yet
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
                Be the first customer to share your experience!
              </p>
            </div>
          ) : (
            /* Review Cards */
            <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
              {reviews.map((review) => (
                <div
                  key={review._id}
                  className="flex h-full min-w-0 flex-col rounded-2xl bg-white p-4 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg sm:p-5"
                >
                  {/* Rating */}
                  <div
                    className="mb-3 flex items-center gap-0.5"
                    aria-label={`${review.rating} out of 5 stars`}
                  >
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={
                          star <= review.rating
                            ? "text-base text-yellow-400 sm:text-lg"
                            : "text-base text-gray-300 sm:text-lg"
                        }
                        aria-hidden="true"
                      >
                        ★
                      </span>
                    ))}
                  </div>

                  {/* Review Message */}
                  <p className="min-h-0 flex-1 break-words text-sm leading-6 text-gray-600 sm:min-h-[90px]">
                    “{review.message}”
                  </p>

                  {/* Customer */}
                  <div className="mt-5 border-t border-gray-100 pt-4">
                    <p className="break-words text-sm font-semibold text-gray-900">
                      {review.customerName}
                    </p>

                    {review.createdAt && (
                      <p className="mt-1 text-xs text-gray-500">
                        {formatDate(review.createdAt)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Review Form */}
        <div className="mx-auto w-full max-w-3xl">
          <div className="rounded-2xl bg-white p-4 shadow-lg sm:p-8">
            <div className="mb-5 text-center sm:mb-6">
              <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
                Leave a Review
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                Tell us about your CaféNest experience.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
              {/* Customer Name */}
              <div>
                <label
                  htmlFor="customerName"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Your Name
                </label>

                <input
                  id="customerName"
                  type="text"
                  value={customerName}
                  onChange={(event) => {
                    setCustomerName(event.target.value);
                    setErrorMessage("");
                    setSuccessMessage("");
                  }}
                  placeholder="Enter your name"
                  maxLength={100}
                  disabled={loading}
                  autoComplete="name"
                  className="min-h-12 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 disabled:cursor-not-allowed disabled:bg-gray-100"
                />
              </div>

              {/* Rating */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Your Rating
                </label>

                <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                  <div className="flex items-center gap-0.5 sm:gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => {
                          setRating(star);
                          setErrorMessage("");
                          setSuccessMessage("");
                        }}
                        disabled={loading}
                        aria-label={`Give ${star} star${
                          star > 1 ? "s" : ""
                        }`}
                        aria-pressed={rating === star}
                        className="flex min-h-10 min-w-8 items-center justify-center rounded-lg text-2xl transition hover:scale-110 focus:outline-none focus:ring-2 focus:ring-orange-300 disabled:cursor-not-allowed sm:min-h-11 sm:min-w-9 sm:text-3xl"
                      >
                        <span
                          className={
                            star <= rating
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }
                          aria-hidden="true"
                        >
                          ★
                        </span>
                      </button>
                    ))}
                  </div>

                  <span className="ml-1 text-xs text-gray-600 sm:ml-2 sm:text-sm">
                    {rating > 0 ? `${rating}/5` : "Select rating"}
                  </span>
                </div>
              </div>

              {/* Review Message */}
              <div>
                <label
                  htmlFor="reviewMessage"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Your Review
                </label>

                <textarea
                  id="reviewMessage"
                  value={message}
                  onChange={(event) => {
                    setMessage(event.target.value);
                    setErrorMessage("");
                    setSuccessMessage("");
                  }}
                  placeholder="Tell us about your experience..."
                  rows={6}
                  maxLength={1000}
                  disabled={loading}
                  className="min-h-[150px] w-full resize-none rounded-xl border border-gray-300 px-4 py-3 text-sm leading-6 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 disabled:cursor-not-allowed disabled:bg-gray-100 sm:min-h-[160px]"
                />

                <div className="mt-1 flex justify-end">
                  <p className="text-xs text-gray-500">
                    {message.length}/1000
                  </p>
                </div>
              </div>

              {/* Success Message */}
              {successMessage && (
                <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3">
                  <p className="text-sm leading-6 text-green-700">
                    {successMessage}
                  </p>
                </div>
              )}

              {/* Error Message */}
              {errorMessage && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                  <p className="text-sm leading-6 text-red-700">
                    {errorMessage}
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="min-h-12 w-full rounded-xl bg-orange-600 px-6 py-3 text-sm font-semibold text-white shadow transition hover:bg-orange-700 focus:outline-none focus:ring-4 focus:ring-orange-200 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          </div>

          {/* Approval Notice */}
          <p className="mt-4 px-2 text-center text-xs leading-5 text-gray-500 sm:mt-5 sm:text-sm">
            Reviews are checked by our team before appearing publicly. Thank
            you for your valuable feedback!
          </p>
        </div>
      </div>
    </section>
  );
}

export default Reviews;
