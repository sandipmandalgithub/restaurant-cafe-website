import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

import { getCurrentAdmin } from "../../services/adminAuthService";

function AdminProtectedRoute() {
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const validateAdmin = async () => {
      const token = localStorage.getItem("adminToken");

      if (!token) {
        setIsAuthenticated(false);
        setIsCheckingAuth(false);
        return;
      }

      try {
        const admin = await getCurrentAdmin(token);

        localStorage.setItem("adminData", JSON.stringify(admin));

        setIsAuthenticated(true);
      } catch (error) {
        console.error("Admin authentication failed:", error);

        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminData");

        setIsAuthenticated(false);
      } finally {
        setIsCheckingAuth(false);
      }
    };

    validateAdmin();
  }, []);

  if (isCheckingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
        <div className="rounded-2xl bg-white px-8 py-6 text-center shadow-sm">
          <p className="text-sm font-medium text-gray-600">
            Checking authentication...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
}

export default AdminProtectedRoute;