import { useEffect, useState } from "react";

import CustomerAuthContext from "./CustomerAuthContext";

import {
  getCurrentCustomer,
  loginCustomer as loginCustomerApi,
  registerCustomer as registerCustomerApi,
  updateCustomerProfile as updateCustomerProfileApi,
} from "../services/customerAuthService";

const CustomerAuthProvider = ({ children }) => {
  const [customer, setCustomer] = useState(null);

  const [token, setToken] = useState(
    () => localStorage.getItem("customerToken") || null
  );

  const [loading, setLoading] = useState(true);

  // Load current customer when a saved token exists
  useEffect(() => {
    const loadCustomer = async () => {
      const savedToken = localStorage.getItem("customerToken");

      if (!savedToken) {
        setLoading(false);
        return;
      }

      try {
        const response = await getCurrentCustomer(savedToken);

        if (response.success) {
          setCustomer(response.data);
          setToken(savedToken);
        } else {
          localStorage.removeItem("customerToken");
          setCustomer(null);
          setToken(null);
        }
      } catch (error) {
        console.error("Customer authentication error:", error);

        localStorage.removeItem("customerToken");

        setCustomer(null);
        setToken(null);
      } finally {
        setLoading(false);
      }
    };

    loadCustomer();
  }, []);

  // Customer Registration
  const register = async (customerData) => {
    const response = await registerCustomerApi(customerData);

    if (response.success) {
      const newToken = response.data.token;
      const newCustomer = response.data.customer;

      localStorage.setItem("customerToken", newToken);

      setToken(newToken);
      setCustomer(newCustomer);
    }

    return response;
  };

  // Customer Login
  const login = async (loginData) => {
    const response = await loginCustomerApi(loginData);

    if (response.success) {
      const newToken = response.data.token;
      const loggedInCustomer = response.data.customer;

      localStorage.setItem("customerToken", newToken);

      setToken(newToken);
      setCustomer(loggedInCustomer);
    }

    return response;
  };

  // Customer Logout
  const logout = () => {
    localStorage.removeItem("customerToken");

    setToken(null);
    setCustomer(null);
  };

  // Update Customer Profile
  const updateProfile = async (customerData) => {
    if (!token) {
      throw new Error("Customer authentication required.");
    }

    const response = await updateCustomerProfileApi(
      token,
      customerData
    );

    if (response.success) {
      setCustomer(response.data);
    }

    return response;
  };

  const value = {
    customer,
    token,
    loading,
    isAuthenticated: Boolean(customer && token),
    register,
    login,
    logout,
    updateProfile,
  };

  return (
    <CustomerAuthContext.Provider value={value}>
      {children}
    </CustomerAuthContext.Provider>
  );
};

export default CustomerAuthProvider;