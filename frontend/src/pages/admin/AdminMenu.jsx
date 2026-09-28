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
  isAvailable: true,
};

function AdminMenu() {
  const [menus, setMenus] = useState([]);
  const [formData, setFormData] = useState(initialFormData);

  const [editingId, setEditingId] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [updatingAvailabilityId, setUpdatingAvailabilityId] =
    useState(null);

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

      setMenus(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch menus:", error);

      setErrorMessage(error.message || "Unable to load menu items.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadMenus = async () => {
    await fetchMenus();
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errorMessage) {
      setErrorMessage("");
    }

    if (successMessage) {
      setSuccessMessage("");
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setEditingId(null);
    setErrorMessage("");
    setSuccessMessage("");
  };

  const validateForm = () => {
    const name = formData.name.trim();
    const description = formData.description.trim();
    const category = formData.category.trim();
    const image = formData.image.trim();
    const price = Number(formData.price);

    if (!name) {
      return "Food name is required.";
    }

    if (name.length < 2) {
      return "Food name must contain at least 2 characters.";
    }

    if (!category) {
      return "Category is required.";
    }

    if (!description) {
      return "Description is required.";
    }

    if (description.length < 10) {
      return "Description must contain at least 10 characters.";
    }

    if (!formData.price || Number.isNaN(price)) {
      return "Please enter a valid price.";
    }

    if (price < 0) {
      return "Price cannot be negative.";
    }

    if (!image) {
      return "Image URL is required.";
    }

    try {
      new URL(image);
    } catch {
      return "Please enter a valid image URL.";
    }

    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    const validationError = validateForm();

    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    try {
      setIsSubmitting(true);

      const menuData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: Number(formData.price),
        image: formData.image.trim(),
        category: formData.category.trim(),
        isAvailable: formData.isAvailable,
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

      setErrorMessage(error.message || "Unable to save menu item.");
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
      isAvailable: menu.isAvailable !== false,
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

      setErrorMessage(error.message || "Unable to delete menu item.");
    }
  };

  const handleAvailabilityToggle = async (menu) => {
    const newAvailability = menu.isAvailable === false;

    try {
      setUpdatingAvailabilityId(menu._id);
      setErrorMessage("");
      setSuccessMessage("");

      const updatedMenu = await updateMenu(menu._id, {
        name: menu.name,
        description: menu.description,
        price: Number(menu.price),
        image: menu.image,
        category: menu.category,
        isAvailable: newAvailability,
      });

      setMenus((previousMenus) =>
        previousMenus.map((item) =>
          item._id === menu._id ? updatedMenu : item
        )
      );

      setSuccessMessage(
        newAvailability
          ? `${menu.name} is now available.`
          : `${menu.name} is now out of stock.`
      );
    } catch (error) {
      console.error("Failed to update menu availability:", error);

      setErrorMessage(
        error.message || "Unable to update menu availability."
      );
    } finally {
      setUpdatingAvailabilityId(null);
    }
  };

  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(
        menus
          .map((menu) => menu.category?.trim())
          .filter(Boolean)
      ),
    ];

    return uniqueCategories.sort((a, b) => a.localeCompare(b));
  }, [menus]);

  const filteredMenus = useMemo(() => {
    const normalizedSearchTerm = searchTerm.trim().toLowerCase();

    const filtered = menus.filter((menu) => {
      const menuName = menu.name?.toLowerCase() || "";

      const matchesSearch =
        !normalizedSearchTerm ||
        menuName.includes(normalizedSearchTerm);

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
  }, [menus, searchTerm, selectedCategory, priceSort]);

  const hasActiveFilters =
    searchTerm.trim() !== "" ||
    selectedCategory !== "All" ||
    priceSort !== "default";

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("All");
    setPriceSort("default");
  };

  const handleImageError = (event) => {
    event.currentTarget.onerror = null;
    event.currentTarget.src =
      "https://placehold.co/800x500?text=Food+Image";
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-gray-100">
      <main className="mx-auto w-full max-w-7xl px-3 py-5 sm:px-5 sm:py-7 lg:px-8 lg:py-8">
        {/* Page Header */}
        <div className="mb-6 sm:mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-600 sm:text-sm">
            Admin Panel
          </p>

          <h1 className="mt-2 text-2xl font-bold leading-tight text-gray-900 sm:text-3xl">
            Menu Management
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600 sm:text-base">
            Add, edit, delete, search, filter, and manage menu availability.
          </p>
        </div>

        {/* Messages */}
        {errorMessage && (
          <div
            role="alert"
            className="mb-5 break-words rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium leading-5 text-red-700 sm:mb-6"
          >
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div
            role="status"
            className="mb-5 break-words rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium leading-5 text-green-700 sm:mb-6"
          >
            {successMessage}
          </div>
        )}

        {/* Form */}
        <section className="rounded-2xl bg-white p-4 shadow-sm sm:p-6 lg:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
                {editingId ? "Edit Menu Item" : "Add Menu Item"}
              </h2>

              <p className="mt-1 text-sm leading-5 text-gray-500">
                {editingId
                  ? "Update the selected menu item."
                  : "Create a new menu item for your restaurant."}
              </p>
            </div>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="min-h-11 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-200 sm:w-auto"
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
            <div className="min-w-0">
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
                maxLength={100}
                placeholder="e.g. Chicken Biryani"
                className="min-h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              />
            </div>

            {/* Category */}
            <div className="min-w-0">
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
                maxLength={50}
                placeholder="e.g. Main Course"
                className="min-h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              />
            </div>

            {/* Price */}
            <div className="min-w-0">
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
                className="min-h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              />
            </div>

            {/* Image */}
            <div className="min-w-0">
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
                className="min-h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              />
            </div>

            {/* Description */}
            <div className="min-w-0 md:col-span-2">
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
                maxLength={500}
                rows="4"
                placeholder="Describe the food item..."
                className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm leading-6 outline-none transition placeholder:text-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              />

              <p className="mt-1 text-right text-xs text-gray-400">
                {formData.description.length}/500
              </p>
            </div>

            {/* Availability */}
            <div className="min-w-0 rounded-xl border border-gray-200 bg-gray-50 p-4 md:col-span-2 sm:p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900">
                    Menu Availability
                  </p>

                  <p className="mt-1 text-xs leading-5 text-gray-500">
                    Control whether customers can order this item.
                  </p>
                </div>

                <label className="inline-flex min-h-11 cursor-pointer items-center gap-3 self-start sm:self-auto">
                  <input
                    type="checkbox"
                    name="isAvailable"
                    checked={formData.isAvailable}
                    onChange={handleChange}
                    className="peer sr-only"
                  />

                  <span
                    className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                      formData.isAvailable
                        ? "bg-green-500"
                        : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${
                        formData.isAvailable ? "left-6" : "left-1"
                      }`}
                    />
                  </span>

                  <span
                    className={`text-sm font-semibold ${
                      formData.isAvailable
                        ? "text-green-700"
                        : "text-red-600"
                    }`}
                  >
                    {formData.isAvailable ? "Available" : "Out of Stock"}
                  </span>
                </label>
              </div>
            </div>

            {/* Submit */}
            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="min-h-11 w-full rounded-lg bg-orange-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-200 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                {isSubmitting
                  ? "Saving..."
                  : editingId
                    ? "Update Menu Item"
                    : "Add Menu Item"}
              </button>
            </div>
          </form>
        </section>

        {/* Menu List */}
        <section className="mt-7 sm:mt-8">
          <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
              <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
                Existing Menu Items
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Total items: {menus.length}
                {hasActiveFilters && ` • Showing: ${filteredMenus.length}`}
              </p>
            </div>

            <button
              type="button"
              onClick={handleLoadMenus}
              disabled={isLoading}
              className="min-h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-200 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              {isLoading ? "Loading..." : "Refresh"}
            </button>
          </div>

          {/* Search & Filters */}
          {!isLoading && menus.length > 0 && (
            <div className="mb-6 rounded-2xl bg-white p-4 shadow-sm sm:p-6">
              <div className="mb-5">
                <h3 className="text-lg font-bold text-gray-900">
                  Search & Filters
                </h3>

                <p className="mt-1 text-sm leading-5 text-gray-500">
                  Find menu items quickly by name, category, or price.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {/* Search */}
                <div className="min-w-0 lg:col-span-2">
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
                      className="min-h-11 w-full rounded-lg border border-gray-300 py-3 pl-11 pr-4 text-sm outline-none transition placeholder:text-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                    />
                  </div>
                </div>

                {/* Category */}
                <div className="min-w-0">
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
                    className="min-h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  >
                    <option value="All">All Categories</option>

                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Sort */}
                <div className="min-w-0">
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
                    className="min-h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  >
                    <option value="default">Default Order</option>
                    <option value="lowToHigh">Price: Low to High</option>
                    <option value="highToLow">Price: High to Low</option>
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
                    className="min-h-11 w-full rounded-lg border border-orange-200 bg-orange-50 px-4 py-2.5 text-sm font-semibold text-orange-700 transition hover:bg-orange-100 focus:outline-none focus:ring-2 focus:ring-orange-200 sm:w-auto"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Loading */}
          {isLoading ? (
            <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-orange-100 border-t-orange-600" />
              <p className="mt-4 text-sm text-gray-500">
                Loading menu items...
              </p>
            </div>
          ) : menus.length === 0 ? (
            <div className="rounded-2xl bg-white p-8 text-center shadow-sm sm:p-10">
              <p className="text-sm text-gray-500">
                No menu items found.
              </p>
            </div>
          ) : filteredMenus.length === 0 ? (
            <div className="rounded-2xl bg-white p-8 text-center shadow-sm sm:p-10">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-orange-50 text-2xl">
                🔎
              </div>

              <h3 className="mt-4 text-lg font-bold text-gray-900">
                No Matching Menu Items
              </h3>

              <p className="mt-2 text-sm leading-5 text-gray-500">
                Try changing your search term or filters.
              </p>

              <button
                type="button"
                onClick={handleClearFilters}
                className="mt-5 min-h-11 rounded-lg bg-orange-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-200"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filteredMenus.map((menu) => {
                const isAvailable = menu.isAvailable !== false;
                const isUpdating =
                  updatingAvailabilityId === menu._id;

                return (
                  <article
                    key={menu._id}
                    className={`min-w-0 overflow-hidden rounded-2xl bg-white shadow-sm ${
                      !isAvailable ? "ring-2 ring-red-100" : ""
                    }`}
                  >
                    {/* Image */}
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
                      <img
                        src={menu.image}
                        alt={menu.name}
                        onError={handleImageError}
                        loading="lazy"
                        className={`h-full w-full object-cover transition ${
                          !isAvailable
                            ? "opacity-60 grayscale"
                            : ""
                        }`}
                      />

                      <div className="absolute right-3 top-3">
                        <span
                          className={`rounded-full px-3 py-1.5 text-xs font-bold shadow-sm ${
                            isAvailable
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {isAvailable
                            ? "Available"
                            : "Out of Stock"}
                        </span>
                      </div>

                      {!isAvailable && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="rounded-lg bg-black/60 px-4 py-2 text-center text-xs font-bold tracking-wide text-white sm:text-sm">
                            OUT OF STOCK
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex h-full min-w-0 flex-col p-4 sm:p-5">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="min-w-0 break-words text-lg font-bold leading-6 text-gray-900">
                          {menu.name}
                        </h3>

                        <span className="shrink-0 whitespace-nowrap text-base font-bold text-orange-600 sm:text-lg">
                          ₹{menu.price}
                        </span>
                      </div>

                      <p className="mt-2 inline-flex w-fit max-w-full rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
                        <span className="break-words">
                          {menu.category}
                        </span>
                      </p>

                      <p className="mt-4 min-w-0 break-words text-sm leading-6 text-gray-600">
                        {menu.description}
                      </p>

                      {/* Availability Toggle */}
                      <button
                        type="button"
                        onClick={() =>
                          handleAvailabilityToggle(menu)
                        }
                        disabled={isUpdating}
                        className={`mt-5 min-h-11 flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-orange-200 disabled:cursor-not-allowed disabled:opacity-60 ${
                          isAvailable
                            ? "border border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
                            : "border border-green-200 bg-green-50 text-green-700 hover:bg-green-100"
                        }`}
                      >
                        {isUpdating ? (
                          "Updating..."
                        ) : isAvailable ? (
                          <>
                            <span aria-hidden="true">✕</span>
                            Mark as Out of Stock
                          </>
                        ) : (
                          <>
                            <span aria-hidden="true">✓</span>
                            Mark as Available
                          </>
                        )}
                      </button>

                      {/* Edit / Delete */}
                      <div className="mt-3 grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => handleEdit(menu)}
                          className="min-h-11 rounded-lg border border-blue-600 px-3 py-2.5 text-sm font-semibold text-blue-600 transition hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-100"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(menu._id)}
                          className="min-h-11 rounded-lg bg-red-600 px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-200"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default AdminMenu;
