const API_URL = `${import.meta.env.VITE_API_URL}/api/reviews`;

// Submit a new customer review
export const createReview = async (reviewData) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(reviewData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Unable to submit review.");
  }

  return data;
};

// Get approved reviews for public website
export const getApprovedReviews = async () => {
  const response = await fetch(`${API_URL}/approved`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Unable to load reviews.");
  }

  return data;
};