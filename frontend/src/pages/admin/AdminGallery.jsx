import { useMemo, useState } from "react";

import {
  createGallery,
  deleteGallery,
  getGallery,
  updateGallery,
} from "../../services/galleryService";

const initialFormData = {
  image: "",
  title: "",
  description: "",
  category: "",
};

function AdminGallery() {
  const [gallery, setGallery] = useState([]);
  const [formData, setFormData] = useState(initialFormData);

  const [editingId, setEditingId] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const fetchGallery = async () => {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const data = await getGallery();

      setGallery(data);
    } catch (error) {
      console.error("Failed to fetch gallery:", error);

      setErrorMessage(
        error.message || "Unable to load gallery items."
      );
    } finally {
      setIsLoading(false);
    }
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

      const galleryData = {
        image: formData.image.trim(),
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category.trim(),
      };

      if (editingId) {
        await updateGallery(editingId, galleryData);

        setSuccessMessage(
          "Gallery item updated successfully."
        );
      } else {
        await createGallery(galleryData);

        setSuccessMessage(
          "Gallery item added successfully."
        );
      }

      setFormData(initialFormData);
      setEditingId(null);

      await fetchGallery();
    } catch (error) {
      console.error("Gallery operation failed:", error);

      setErrorMessage(
        error.message || "Unable to save gallery item."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item._id);

    setFormData({
      image: item.image || "",
      title: item.title || "",
      description: item.description || "",
      category: item.category || "",
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
      "Are you sure you want to delete this gallery item?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setErrorMessage("");
      setSuccessMessage("");

      await deleteGallery(id);

      setSuccessMessage(
        "Gallery item deleted successfully."
      );

      if (editingId === id) {
        setFormData(initialFormData);
        setEditingId(null);
      }

      await fetchGallery();
    } catch (error) {
      console.error(
        "Failed to delete gallery item:",
        error
      );

      setErrorMessage(
        error.message || "Unable to delete gallery item."
      );
    }
  };

  const handleImageError = (event) => {
    event.currentTarget.onerror = null;

    event.currentTarget.src =
      "https://placehold.co/600x400?text=Image+Unavailable";
  };

  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(
        gallery
          .map((item) => item.category?.trim())
          .filter(Boolean)
      ),
    ];

    return uniqueCategories.sort((a, b) =>
      a.localeCompare(b)
    );
  }, [gallery]);

  const filteredGallery = useMemo(() => {
    const normalizedSearchTerm = searchTerm
      .trim()
      .toLowerCase();

    return gallery.filter((item) => {
      const matchesSearch =
        !normalizedSearchTerm ||
        item.title
          ?.toLowerCase()
          .includes(normalizedSearchTerm);

      const matchesCategory =
        selectedCategory === "All" ||
        item.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [gallery, searchTerm, selectedCategory]);

  const hasActiveFilters =
    searchTerm.trim() !== "" ||
    selectedCategory !== "All";

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("All");
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-gray-100">
      <main className="mx-auto w-full max-w-7xl px-3 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        {/* Page Header */}
        <div className="mb-6 sm:mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-600 sm:text-sm sm:tracking-widest">
            Admin Panel
          </p>

          <h1 className="mt-2 text-2xl font-bold leading-tight text-gray-900 sm:text-3xl">
            Gallery Management
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600 sm:text-base">
            Add, edit, delete, search, and filter restaurant
            gallery images.
          </p>
        </div>

        {/* Messages */}
        {errorMessage && (
          <div
            role="alert"
            className="mb-5 break-words rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium leading-6 text-red-700 sm:mb-6"
          >
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div
            role="status"
            className="mb-5 break-words rounded-xl border border-green-100 bg-green-50 px-4 py-3 text-sm font-medium leading-6 text-green-700 sm:mb-6"
          >
            {successMessage}
          </div>
        )}

        {/* Form */}
        <section className="rounded-2xl bg-white p-4 shadow-sm sm:p-6 lg:p-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div className="min-w-0">
              <h2 className="text-lg font-bold text-gray-900 sm:text-xl">
                {editingId
                  ? "Edit Gallery Item"
                  : "Add Gallery Item"}
              </h2>

              <p className="mt-1 text-sm leading-6 text-gray-500">
                {editingId
                  ? "Update the selected gallery item."
                  : "Add a new image to your gallery."}
              </p>
            </div>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="min-h-11 w-full shrink-0 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-200 sm:w-auto"
              >
                Cancel Edit
              </button>
            )}
          </div>

          <form
            onSubmit={handleSubmit}
            className="mt-6 grid gap-5 md:grid-cols-2"
          >
            {/* Image URL */}
            <div className="min-w-0 md:col-span-2">
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
                placeholder="https://example.com/image.jpg"
                className="min-h-11 w-full min-w-0 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              />

              {formData.image && (
                <div className="mt-4 overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
                  <p className="border-b border-gray-200 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Image Preview
                  </p>

                  <img
                    src={formData.image}
                    alt="Gallery preview"
                    onError={handleImageError}
                    className="aspect-[4/3] w-full object-cover sm:aspect-[16/8] sm:max-h-80"
                  />
                </div>
              )}
            </div>

            {/* Title */}
            <div className="min-w-0">
              <label
                htmlFor="title"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Title
              </label>

              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="e.g. Special Biryani"
                className="min-h-11 w-full min-w-0 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
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
                placeholder="e.g. Food"
                className="min-h-11 w-full min-w-0 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
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
                rows="4"
                placeholder="Describe this gallery image..."
                className="w-full min-w-0 resize-none rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm leading-6 outline-none transition placeholder:text-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              />
            </div>

            {/* Submit */}
            <div className="flex flex-col gap-3 md:col-span-2 sm:flex-row">
              <button
                type="submit"
                disabled={isSubmitting}
                className="min-h-11 w-full rounded-lg bg-orange-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                {isSubmitting
                  ? "Saving..."
                  : editingId
                    ? "Update Gallery Item"
                    : "Add Gallery Item"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  disabled={isSubmitting}
                  className="min-h-11 w-full rounded-lg border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-200 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        {/* Gallery List */}
        <section className="mt-7 sm:mt-8">
          <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div className="min-w-0">
              <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
                Existing Gallery Items
              </h2>

              <p className="mt-1 break-words text-sm leading-6 text-gray-500">
                Total items: {gallery.length}
                {hasActiveFilters &&
                  ` • Showing: ${filteredGallery.length}`}
              </p>
            </div>

            <button
              type="button"
              onClick={fetchGallery}
              disabled={isLoading}
              className="min-h-11 w-full shrink-0 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-200 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              {isLoading ? "Loading..." : "Refresh"}
            </button>
          </div>

          {/* Search & Filters */}
          {!isLoading && gallery.length > 0 && (
            <div className="mb-6 rounded-2xl bg-white p-4 shadow-sm sm:p-6">
              <div className="mb-5">
                <h3 className="text-base font-bold text-gray-900 sm:text-lg">
                  Search & Filters
                </h3>

                <p className="mt-1 text-sm leading-6 text-gray-500">
                  Find gallery images quickly by title or
                  category.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="min-w-0">
                  <label
                    htmlFor="gallerySearch"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Search by Title
                  </label>

                  <div className="relative">
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      🔎
                    </span>

                    <input
                      id="gallerySearch"
                      type="text"
                      value={searchTerm}
                      onChange={(event) =>
                        setSearchTerm(event.target.value)
                      }
                      placeholder="Search gallery title..."
                      className="min-h-11 w-full min-w-0 rounded-lg border border-gray-300 bg-white py-3 pl-11 pr-4 text-sm outline-none transition placeholder:text-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                    />
                  </div>
                </div>

                <div className="min-w-0">
                  <label
                    htmlFor="galleryCategoryFilter"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Category
                  </label>

                  <select
                    id="galleryCategoryFilter"
                    value={selectedCategory}
                    onChange={(event) =>
                      setSelectedCategory(event.target.value)
                    }
                    className="min-h-11 w-full min-w-0 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  >
                    <option value="All">
                      All Categories
                    </option>

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
              </div>

              <div className="mt-5 flex flex-col gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm leading-6 text-gray-600">
                  Showing{" "}
                  <span className="font-bold text-gray-900">
                    {filteredGallery.length}
                  </span>{" "}
                  of{" "}
                  <span className="font-bold text-gray-900">
                    {gallery.length}
                  </span>{" "}
                  gallery items
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

          {/* Gallery States */}
          {isLoading ? (
            <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
              <p className="text-sm text-gray-500">
                Loading gallery items...
              </p>
            </div>
          ) : gallery.length === 0 ? (
            <div className="rounded-2xl bg-white px-5 py-10 text-center shadow-sm sm:p-10">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-orange-50 text-2xl">
                🖼️
              </div>

              <h3 className="mt-4 text-lg font-bold text-gray-900">
                No Gallery Items
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
                Add your first gallery image using the form
                above.
              </p>
            </div>
          ) : filteredGallery.length === 0 ? (
            <div className="rounded-2xl bg-white px-5 py-10 text-center shadow-sm sm:p-10">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-orange-50 text-2xl">
                🔎
              </div>

              <h3 className="mt-4 text-lg font-bold text-gray-900">
                No Matching Gallery Items
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
                Try changing your search term or category
                filter.
              </p>

              <button
                type="button"
                onClick={handleClearFilters}
                className="mt-5 min-h-11 rounded-lg bg-orange-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:ring-offset-1"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filteredGallery.map((item) => (
                <article
                  key={item._id}
                  className="min-w-0 overflow-hidden rounded-2xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="relative">
                    <img
                      src={item.image}
                      alt={item.title}
                      onError={handleImageError}
                      loading="lazy"
                      className="aspect-[4/3] w-full object-cover"
                    />

                    <span className="absolute right-3 top-3 max-w-[calc(100%-1.5rem)] truncate rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-orange-700 shadow-sm">
                      {item.category}
                    </span>
                  </div>

                  <div className="min-w-0 p-4 sm:p-5">
                    <h3 className="break-words text-base font-bold text-gray-900 sm:text-lg">
                      {item.title}
                    </h3>

                    {item.description && (
                      <p className="mt-3 line-clamp-3 break-words text-sm leading-6 text-gray-600">
                        {item.description}
                      </p>
                    )}

                    <div className="mt-5 grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => handleEdit(item)}
                        className="min-h-11 rounded-lg border border-blue-600 px-3 py-2.5 text-sm font-semibold text-blue-600 transition hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-200"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(item._id)
                        }
                        className="min-h-11 rounded-lg bg-red-600 px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default AdminGallery;
