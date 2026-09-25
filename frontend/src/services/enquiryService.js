const API_URL = "http://localhost:5000/api/enquiries";

const getAuthHeaders = () => {
  const token = localStorage.getItem("adminToken");

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

// Public - Customer enquiry
export const createEnquiry = async (enquiryData) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(enquiryData),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to submit enquiry.");
  }

  return result.data;
};

// Admin - Get all enquiries
export const getEnquiries = async () => {
  const response = await fetch(API_URL, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to fetch enquiries.");
  }

  return result.data;
};

// Admin - Update enquiry status
export const updateEnquiryStatus = async (id, status) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify({ status }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Failed to update enquiry status."
    );
  }

  return result.data;
};

// Admin - Delete enquiry
export const deleteEnquiry = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to delete enquiry.");
  }

  return result.data;
};