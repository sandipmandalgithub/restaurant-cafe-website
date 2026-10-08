import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import AdminLayout from "./layouts/AdminLayout";

import Home from "./pages/Home";
import About from "./pages/About";
import Menu from "./pages/Menu";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderTracking from "./pages/OrderTracking";
import Reviews from "./pages/Reviews";
import Gallery from "./pages/Gallery";
import Contact from "./pages/Contact";
import Location from "./pages/Location";
import Reservation from "./pages/Reservation";
import CustomerLogin from "./pages/CustomerLogin";
import CustomerRegister from "./pages/CustomerRegister";
import CustomerProfile from "./pages/CustomerProfile";
import CustomerOrders from "./pages/CustomerOrders";
import CustomerReservations from "./pages/CustomerReservations";

import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminMenu from "./pages/admin/AdminMenu";
import AdminGallery from "./pages/admin/AdminGallery";
import AdminEnquiries from "./pages/admin/AdminEnquiries";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminBusinessSettings from "./pages/admin/AdminBusinessSettings";
import AdminCoupons from "./pages/admin/AdminCoupons";
import AdminReservations from "./pages/admin/AdminReservations";

import AdminProtectedRoute from "./components/admin/AdminProtectedRoute";
import CustomerProtectedRoute from "./components/customer/CustomerProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ================================
            Customer Website
        ================================= */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route
            path="/order-tracking"
            element={<OrderTracking />}
          />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/location" element={<Location />} />

          {/* Table Reservation */}
          <Route
            path="/reservation"
            element={<Reservation />}
          />

          {/* Customer Authentication */}
          <Route
            path="/customer/login"
            element={<CustomerLogin />}
          />

          <Route
            path="/customer/register"
            element={<CustomerRegister />}
          />

          {/* Protected Customer Routes */}
          <Route element={<CustomerProtectedRoute />}>
            <Route
              path="/customer/profile"
              element={<CustomerProfile />}
            />

            <Route
              path="/customer/orders"
              element={<CustomerOrders />}
            />

            <Route
              path="/customer/reservations"
              element={<CustomerReservations />}
            />
          </Route>
        </Route>

        {/* ================================
            Admin Login
        ================================= */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* ================================
            Protected Admin Routes
        ================================= */}
        <Route element={<AdminProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route
              path="/admin/dashboard"
              element={<AdminDashboard />}
            />

            <Route
              path="/admin/menu"
              element={<AdminMenu />}
            />

            <Route
              path="/admin/orders"
              element={<AdminOrders />}
            />

            <Route
              path="/admin/reservations"
              element={<AdminReservations />}
            />

            <Route
              path="/admin/coupons"
              element={<AdminCoupons />}
            />

            <Route
              path="/admin/gallery"
              element={<AdminGallery />}
            />

            <Route
              path="/admin/enquiries"
              element={<AdminEnquiries />}
            />

            <Route
              path="/admin/business-settings"
              element={<AdminBusinessSettings />}
            />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
