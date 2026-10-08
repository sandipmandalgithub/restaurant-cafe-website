const API_URL =
  "https://restaurant-cafe-backend.onrender.com/api/coupons";

// Validate coupon for customers
export const validateCoupon = async ({
  code,
  orderAmount,
}) => {
  try {
    const response = await fetch(`${API_URL}/validate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code,
        orderAmount,
      }),
    });

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Validate coupon error:", error);

    return {
      success: false,
      message: "Unable to validate coupon. Please try again.",
    };
  }
};

// Get all coupons for admin
export const getCoupons = async (token) => {
  try {
    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Get coupons error:", error);

    return {
      success: false,
      message: "Unable to fetch coupons.",
    };
  }
};

// Get single coupon for admin
export const getCouponById = async (token, couponId) => {
  try {
    const response = await fetch(`${API_URL}/${couponId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Get coupon error:", error);

    return {
      success: false,
      message: "Unable to fetch coupon details.",
    };
  }
};

// Create coupon for admin
export const createCoupon = async (token, couponData) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(couponData),
    });

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Create coupon error:", error);

    return {
      success: false,
      message: "Unable to create coupon.",
    };
  }
};

// Update coupon for admin
export const updateCoupon = async (token, couponId, couponData) => {
  try {
    const response = await fetch(`${API_URL}/${couponId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(couponData),
    });

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Update coupon error:", error);

    return {
      success: false,
      message: "Unable to update coupon.",
    };
  }
};

// Delete coupon for admin
export const deleteCoupon = async (token, couponId) => {
  try {
    const response = await fetch(`${API_URL}/${couponId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Delete coupon error:", error);

    return {
      success: false,
      message: "Unable to delete coupon.",
    };
  }
};

// Toggle coupon status for admin
export const toggleCouponStatus = async (token, couponId) => {
  try {
    const response = await fetch(`${API_URL}/${couponId}/toggle`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Toggle coupon status error:", error);

    return {
      success: false,
      message: "Unable to update coupon status.",
    };
  }
};
