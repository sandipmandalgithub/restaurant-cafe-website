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
        error.message ||
          "Unable to submit your review. Please try again."
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
    <section className="min-h-screen bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Page Header */}
        <div className="mb-10 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-orange-600">
            Customer Reviews
          </p>

          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Share Your Experience
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-gray-600 sm:text-base">
            We would love to hear about your experience at CaféNest.
            Your feedback helps us serve you better.
          </p>
        </div>

        {/* Approved Reviews */}
        <div className="mb-12">
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold text-gray-900">
              What Our Customers Say
            </h2>

            <p className="mt-2 text-sm text-gray-600">
              Read experiences shared by our customers.
            </p>
          </div>

          {reviewsLoading ? (
            <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
              <p className="text-sm text-gray-500">
                Loading reviews...
              </p>
            </div>
          ) : reviews.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center">
              <div className="mb-3 text-4xl">⭐</div>

              <h3 className="text-lg font-semibold text-gray-800">
                No reviews yet
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                Be the first customer to share your experience!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {reviews.map((review) => (
                <div
                  key={review._id}
                  className="
                    rounded-2xl
                    bg-white
                    p-5
                    shadow-sm
                    transition
                    duration-300
                    hover:-translate-y-1
                    hover:shadow-lg
                  "
                >
                  {/* Rating */}
                  <div
                    className="mb-3 flex items-center gap-1"
                    aria-label={`${review.rating} out of 5 stars`}
                  >
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={
                          star <= review.rating
                            ? "text-lg text-yellow-400"
                            : "text-lg text-gray-300"
                        }
                      >
                        ★
                      </span>
                    ))}
                  </div>

                  {/* Review Message */}
                  <p className="min-h-[90px] text-sm leading-6 text-gray-600">
                    “{review.message}”
                  </p>

                  {/* Customer */}
                  <div className="mt-5 border-t border-gray-100 pt-4">
                    <p className="font-semibold text-gray-900">
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
        <div className="mx-auto max-w-3xl">
          <div className="rounded-2xl bg-white p-5 shadow-lg sm:p-8">
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold text-gray-900">
                Leave a Review
              </h2>

              <p className="mt-2 text-sm text-gray-600">
                Tell us about your CaféNest experience.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
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
                  onChange={(event) =>
                    setCustomerName(event.target.value)
                  }
                  placeholder="Enter your name"
                  maxLength={100}
                  disabled={loading}
                  className="
                    w-full
                    rounded-lg
                    border
                    border-gray-300
                    px-4
                    py-3
                    text-sm
                    text-gray-900
                    outline-none
                    transition
                    focus:border-orange-500
                    focus:ring-2
                    focus:ring-orange-200
                    disabled:cursor-not-allowed
                    disabled:bg-gray-100
                  "
                />
              </div>

              {/* Rating */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Your Rating
                </label>

                <div className="flex items-center gap-1 sm:gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      disabled={loading}
                      aria-label={`Give ${star} star${
                        star > 1 ? "s" : ""
                      }`}
                      className="
                        text-3xl
                        transition
                        hover:scale-110
                        disabled:cursor-not-allowed
                        sm:text-4xl
                      "
                    >
                      <span
                        className={
                          star <= rating
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }
                      >
                        ★
                      </span>
                    </button>
                  ))}

                  <span className="ml-2 text-sm text-gray-600">
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
                  onChange={(event) => setMessage(event.target.value)}
                  placeholder="Tell us about your experience..."
                  rows={6}
                  maxLength={1000}
                  disabled={loading}
                  className="
                    w-full
                    resize-none
                    rounded-lg
                    border
                    border-gray-300
                    px-4
                    py-3
                    text-sm
                    text-gray-900
                    outline-none
                    transition
                    focus:border-orange-500
                    focus:ring-2
                    focus:ring-orange-200
                    disabled:cursor-not-allowed
                    disabled:bg-gray-100
                  "
                />

                <p className="mt-1 text-right text-xs text-gray-500">
                  {message.length}/1000
                </p>
              </div>

              {/* Success Message */}
              {successMessage && (
                <div
                  className="
                    rounded-lg
                    border
                    border-green-200
                    bg-green-50
                    px-4
                    py-3
                    text-sm
                    text-green-700
                  "
                >
                  {successMessage}
                </div>
              )}

              {/* Error Message */}
              {errorMessage && (
                <div
                  className="
                    rounded-lg
                    border
                    border-red-200
                    bg-red-50
                    px-4
                    py-3
                    text-sm
                    text-red-700
                  "
                >
                  {errorMessage}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="
                  w-full
                  rounded-lg
                  bg-orange-600
                  px-6
                  py-3
                  text-sm
                  font-semibold
                  text-white
                  shadow
                  transition
                  hover:bg-orange-700
                  focus:outline-none
                  focus:ring-4
                  focus:ring-orange-200
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >
                {loading ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          </div>

          {/* Approval Notice */}
          <p className="mt-5 text-center text-xs leading-5 text-gray-500 sm:text-sm">
            Reviews are checked by our team before appearing publicly.
            Thank you for your valuable feedback!
          </p>
        </div>
      </div>
    </section>
  );
}

export default Reviews;
