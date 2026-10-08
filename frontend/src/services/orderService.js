const API_URL =
  "https://restaurant-cafe-backend.onrender.com/api/orders";

// Get logged-in customer's order history
export const getCustomerOrderHistory = async (token) => {
  const response = await fetch(`${API_URL}/customer/history`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to fetch customer order history."
    );
  }

  return data;
};
