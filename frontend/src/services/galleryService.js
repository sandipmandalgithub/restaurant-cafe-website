const API_URL = "http://localhost:5000/api/gallery";

const getAuthHeaders = () => {
  const token = localStorage.getItem("adminToken");

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export const getGallery = async () => {
  const response = await fetch(API_URL);

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to fetch gallery items.");
  }

  return result.data;
};

export const createGallery = async (galleryData) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(galleryData),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to create gallery item.");
  }

  return result.data;
};

export const updateGallery = async (id, galleryData) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(galleryData),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to update gallery item.");
  }

  return result.data;
};

export const deleteGallery = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to delete gallery item.");
  }

  return result.data;
};