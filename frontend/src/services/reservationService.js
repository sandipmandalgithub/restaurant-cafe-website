const API_URL =
  "https://restaurant-cafe-backend.onrender.com/api/reservations";

// Create reservation
// Guest users can create reservations.
// Logged-in customers can send their customer token.
export const createReservation = async (
  reservationData,
  token = null
) => {
  try {
    const headers = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(API_URL, {
      method: "POST",
      headers,
      body: JSON.stringify(reservationData),
    });

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Create reservation error:", error);

    return {
      success: false,
      message: "Unable to create reservation. Please try again.",
    };
  }
};

// Get logged-in customer's reservations
export const getCustomerReservations = async (token) => {
  try {
    const response = await fetch(`${API_URL}/customer`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Get customer reservations error:", error);

    return {
      success: false,
      message: "Unable to fetch your reservations.",
    };
  }
};

export default {
  createReservation,
  getCustomerReservations,
};