import { Navigate, Outlet, useLocation } from "react-router-dom";

import useCustomerAuth from "../../context/useCustomerAuth";

function CustomerProtectedRoute() {
  const location = useLocation();

  const { isAuthenticated, loading } = useCustomerAuth();

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center px-4">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-orange-500" />

          <p className="mt-4 text-sm text-gray-600">
            Checking authentication...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/customer/login"
        replace
        state={{ from: location }}
      />
    );
  }

  return <Outlet />;
}

export default CustomerProtectedRoute;