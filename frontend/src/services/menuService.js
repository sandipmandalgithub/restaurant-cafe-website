const API_URL = "http://localhost:5000/api/menu";

const getAuthHeaders = () => {
  const token = localStorage.getItem("adminToken");

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export const getMenus = async () => {
  const response = await fetch(API_URL);

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to fetch menu items.");
  }

  return result.data;
};

export const createMenu = async (menuData) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(menuData),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to create menu item.");
  }

  return result.data;
};

export const updateMenu = async (id, menuData) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(menuData),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to update menu item.");
  }

  return result.data;
};

export const deleteMenu = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to delete menu item.");
  }

  return result.data;
};