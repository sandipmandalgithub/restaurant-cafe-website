import { NavLink, Outlet, useNavigate } from "react-router-dom";

function AdminLayout() {
  const navigate = useNavigate();

  const adminData = JSON.parse(
    localStorage.getItem("adminData") || "{}"
  );

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminData");

    navigate("/admin/login", { replace: true });
  };

  const navItems = [
    {
      label: "Dashboard",
      path: "/admin/dashboard",
      icon: "📊",
    },
    {
      label: "Menu",
      path: "/admin/menu",
      icon: "🍽️",
    },
    {
      label: "Orders",
      path: "/admin/orders",
      icon: "📦",
    },
    {
      label: "Gallery",
      path: "/admin/gallery",
      icon: "🖼️",
    },
    {
      label: "Enquiries",
      path: "/admin/enquiries",
      icon: "📩",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
              Café<span className="text-orange-600">Nest</span>
            </h1>

            <p className="mt-1 text-xs text-gray-500 sm:text-sm">
              Admin Panel
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-gray-800">
                {adminData.name || "Admin"}
              </p>

              <p className="text-xs text-gray-500">
                {adminData.email || ""}
              </p>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Admin Navigation */}
      <nav className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-3 sm:px-6 lg:px-8">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex shrink-0 items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
                  isActive
                    ? "bg-orange-600 text-white"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`
              }
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Page Content */}
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
