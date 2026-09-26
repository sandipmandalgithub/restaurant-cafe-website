import { useMemo, useState } from "react";

import {
  createMenu,
  deleteMenu,
  getMenus,
  updateMenu,
} from "../../services/menuService";

const initialFormData = {
  name: "",
  description: "",
  price: "",
  image: "",
  category: "",
};

function AdminMenu() {
  const [menus, setMenus] = useState([]);
  const [formData, setFormData] = useState(initialFormData);

  const [editingId, setEditingId] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [priceSort, setPriceSort] = useState("default");

  const fetchMenus = async () => {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const data = await getMenus();
      setMenus(data);
    } catch (error) {
      console.error("Failed to fetch menus:", error);

      setErrorMessage(
        error.message || "Unable to load menu items."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadMenus = async () => {
    await fetchMenus();
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setEditingId(null);
    setErrorMessage("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    try {
      setIsSubmitting(true);

      const menuData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: Number(formData.price),
        image: formData.image.trim(),
        category: formData.category.trim(),
      };

      if (editingId) {
        await updateMenu(editingId, menuData);

        setSuccessMessage("Menu item updated successfully.");
      } else {
        await createMenu(menuData);

        setSuccessMessage("Menu item added successfully.");
      }

      setFormData(initialFormData);
      setEditingId(null);

      await fetchMenus();
    } catch (error) {
      console.error("Menu operation failed:", error);

      setErrorMessage(
        error.message || "Unable to save menu item."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (menu) => {
    setEditingId(menu._id);

    setFormData({
      name: menu.name || "",
      description: menu.description || "",
      price: menu.price ?? "",
      image: menu.image || "",
      category: menu.category || "",
    });

    setErrorMessage("");
    setSuccessMessage("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this menu item?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setErrorMessage("");
      setSuccessMessage("");

      await deleteMenu(id);

      setSuccessMessage("Menu item deleted successfully.");

      if (editingId === id) {
        setFormData(initialFormData);
        setEditingId(null);
      }

      await fetchMenus();
    } catch (error) {
      console.error("Failed to delete menu item:", error);

      setErrorMessage(
        error.message || "Unable to delete menu item."
      );
    }
  };

  // Get unique categories
  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(
        menus
          .map((menu) => menu.category?.trim())
          .filter(Boolean)
      ),
    ];

    return uniqueCategories.sort((a, b) =>
      a.localeCompare(b)
    );
  }, [menus]);

  // Search, category filter and price sorting
  const filteredMenus = useMemo(() => {
    const normalizedSearchTerm = searchTerm
      .trim()
      .toLowerCase();

    const filtered = menus.filter((menu) => {
      const matchesSearch =
        !normalizedSearchTerm ||
        menu.name
          ?.toLowerCase()
          .includes(normalizedSearchTerm);

      const matchesCategory =
        selectedCategory === "All" ||
        menu.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });

    if (priceSort === "lowToHigh") {
      return [...filtered].sort(
        (a, b) => Number(a.price) - Number(b.price)
      );
    }

    if (priceSort === "highToLow") {
      return [...filtered].sort(
        (a, b) => Number(b.price) - Number(a.price)
      );
    }

    return filtered;
  }, [
    menus,
    searchTerm,
    selectedCategory,
    priceSort,
  ]);

  const hasActiveFilters =
    searchTerm.trim() !== "" ||
    selectedCategory !== "All" ||
    priceSort !== "default";

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("All");
    setPriceSort("default");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-orange-600">
            Admin Panel
          </p>

          <h1 className="mt-2 text-3xl font-bold text-gray-900">
            Menu Management
          </h1>

          <p className="mt-2 text-sm text-gray-600 sm:text-base">
            Add, edit, delete, search, and filter restaurant menu
            items.
          </p>
        </div>

        {/* Messages */}
        {errorMessage && (
          <div className="mb-6 rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className="mb-6 rounded-lg bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
            {successMessage}
          </div>
        )}

        {/* Form */}
        <div className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {editingId ? "Edit Menu Item" : "Add Menu Item"}
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                {editingId
                  ? "Update the selected menu item."
                  : "Create a new menu item for your restaurant."}
              </p>
            </div>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                Cancel Edit
              </button>
            )}
          </div>

          <form
            onSubmit={handleSubmit}
            className="mt-6 grid gap-5 md:grid-cols-2"
          >
            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Food Name
              </label>

              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="e.g. Chicken Biryani"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              />
            </div>

            {/* Category */}
            <div>
              <label
                htmlFor="category"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Category
              </label>

              <input
                id="category"
                name="category"
                type="text"
                value={formData.category}
                onChange={handleChange}
                required
                placeholder="e.g. Main Course"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              />
            </div>

            {/* Price */}
            <div>
              <label
                htmlFor="price"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Price
              </label>

              <input
                id="price"
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                required
                placeholder="e.g. 250"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              />
            </div>

            {/* Image */}
            <div>
              <label
                htmlFor="image"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Image URL
              </label>

              <input
                id="image"
                name="image"
                type="url"
                value={formData.image}
                onChange={handleChange}
                required
                placeholder="https://example.com/food.jpg"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label
                htmlFor="description"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Description
              </label>

              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="4"
                placeholder="Describe the food item..."
                className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              />
            </div>

            {/* Submit */}
            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-lg bg-orange-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                {isSubmitting
                  ? "Saving..."
                  : editingId
                    ? "Update Menu Item"
                    : "Add Menu Item"}
              </button>
            </div>
          </form>
        </div>

        {/* Menu List */}
        <div className="mt-8">
          <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Existing Menu Items
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Total items: {menus.length}
                {hasActiveFilters &&
                  ` • Showing: ${filteredMenus.length}`}
              </p>
            </div>

            <button
              type="button"
              onClick={handleLoadMenus}
              disabled={isLoading}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? "Loading..." : "Refresh"}
            </button>
          </div>

          {/* Search & Filters */}
          {!isLoading && menus.length > 0 && (
            <div className="mb-6 rounded-2xl bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-5">
                <h3 className="text-lg font-bold text-gray-900">
                  Search & Filters
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Find menu items quickly by name, category, or
                  price.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {/* Search */}
                <div className="lg:col-span-2">
                  <label
                    htmlFor="menuSearch"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Search by Food Name
                  </label>

                  <div className="relative">
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      🔎
                    </span>

                    <input
                      id="menuSearch"
                      type="text"
                      value={searchTerm}
                      onChange={(event) =>
                        setSearchTerm(event.target.value)
                      }
                      placeholder="Search food name..."
                      className="w-full rounded-lg border border-gray-300 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                    />
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label
                    htmlFor="categoryFilter"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Category
                  </label>

                  <select
                    id="categoryFilter"
                    value={selectedCategory}
                    onChange={(event) =>
                      setSelectedCategory(event.target.value)
                    }
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  >
                    <option value="All">All Categories</option>

                    {categories.map((category) => (
                      <option
                        key={category}
                        value={category}
                      >
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Sort */}
                <div>
                  <label
                    htmlFor="priceSort"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Sort by Price
                  </label>

                  <select
                    id="priceSort"
                    value={priceSort}
                    onChange={(event) =>
                      setPriceSort(event.target.value)
                    }
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  >
                    <option value="default">
                      Default Order
                    </option>

                    <option value="lowToHigh">
                      Price: Low to High
                    </option>

                    <option value="highToLow">
                      Price: High to Low
                    </option>
                  </select>
                </div>
              </div>

              {/* Filter Summary */}
              <div className="mt-5 flex flex-col gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-gray-600">
                  Showing{" "}
                  <span className="font-bold text-gray-900">
                    {filteredMenus.length}
                  </span>{" "}
                  of{" "}
                  <span className="font-bold text-gray-900">
                    {menus.length}
                  </span>{" "}
                  menu items
                </p>

                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={handleClearFilters}
                    className="w-full rounded-lg border border-orange-200 bg-orange-50 px-4 py-2.5 text-sm font-semibold text-orange-700 transition hover:bg-orange-100 sm:w-auto"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            </div>
          )}

          {isLoading ? (
            <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
              <p className="text-sm text-gray-500">
                Loading menu items...
              </p>
            </div>
          ) : menus.length === 0 ? (
            <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
              <p className="text-sm text-gray-500">
                No menu items found.
              </p>
            </div>
          ) : filteredMenus.length === 0 ? (
            <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-orange-50 text-2xl">
                🔎
              </div>

              <h3 className="mt-4 text-lg font-bold text-gray-900">
                No Matching Menu Items
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                Try changing your search term or filters.
              </p>

              <button
                type="button"
                onClick={handleClearFilters}
                className="mt-5 rounded-lg bg-orange-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-700"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredMenus.map((menu) => (
                <div
                  key={menu._id}
                  className="overflow-hidden rounded-2xl bg-white shadow-sm"
                >
                  <img
                    src={menu.image}
                    alt={menu.name}
                    className="h-48 w-full object-cover"
                  />

                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-lg font-bold text-gray-900">
                        {menu.name}
                      </h3>

                      <span className="whitespace-nowrap text-lg font-bold text-orange-600">
                        ₹{menu.price}
                      </span>
                    </div>

                    <p className="mt-2 inline-block rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
                      {menu.category}
                    </p>

                    <p className="mt-4 text-sm leading-6 text-gray-600">
                      {menu.description}
                    </p>

                    <div className="mt-5 flex gap-3">
                      <button
                        type="button"
                        onClick={() => handleEdit(menu)}
                        className="flex-1 rounded-lg border border-blue-600 px-4 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(menu._id)}
                        className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default AdminMenu;
