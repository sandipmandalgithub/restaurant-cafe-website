const API_URL ="https://restaurant-cafe-backend.onrender.com/api/customers";

// Customer Registration
export const registerCustomer = async (customerData) => {
  const response = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(customerData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to register customer.");
  }

  return data;
};

// Customer Login
export const loginCustomer = async (loginData) => {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(loginData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to login customer.");
  }

  return data;
};

// Get Current Customer
export const getCurrentCustomer = async (token) => {
  const response = await fetch(`${API_URL}/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch customer details.");
  }

  return data;
};

// Update Customer Profile
export const updateCustomerProfile = async (token, customerData) => {
  const response = await fetch(`${API_URL}/profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(customerData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update customer profile.");
  }

  return data;
};
