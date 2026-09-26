import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { getMenus } from "../services/menuService";

const CART_STORAGE_KEY = "cafeNestCart";
const CART_UPDATED_EVENT = "cafeNestCartUpdated";

function Cart() {
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);

      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error("Failed to load cart:", error);
      return [];
    }
  });

  const [checkingAvailability, setCheckingAvailability] =
    useState(false);

  // Check current menu availability from backend
  useEffect(() => {
    const checkMenuAvailability = async () => {
      if (cart.length === 0) {
        return;
      }

      try {
        setCheckingAvailability(true);

        const menuItems = await getMenus();

        const menuMap = new Map(
          menuItems.map((menuItem) => [
            menuItem._id,
            menuItem,
          ])
        );

        setCart((previousCart) =>
          previousCart.map((cartItem) => {
            const currentMenuItem = menuMap.get(cartItem._id);

            // If item no longer exists in the menu,
            // keep it in cart but mark it unavailable.
            if (!currentMenuItem) {
              return {
                ...cartItem,
                isAvailable: false,
              };
            }

            return {
              ...cartItem,
              name: currentMenuItem.name,
              description: currentMenuItem.description,
              price: Number(currentMenuItem.price),
              image: currentMenuItem.image,
              category: currentMenuItem.category,
              isAvailable:
                currentMenuItem.isAvailable !== false,
            };
          })
        );
      } catch (error) {
        console.error(
          "Failed to check menu availability:",
          error
        );
      } finally {
        setCheckingAvailability(false);
      }
    };

    checkMenuAvailability();
  }, []);

  // Save cart to localStorage and notify Navbar
  useEffect(() => {
    try {
      localStorage.setItem(
        CART_STORAGE_KEY,
        JSON.stringify(cart)
      );

      const cartItemCount = cart.reduce(
        (total, item) =>
          total + Number(item.quantity || 0),
        0
      );

      window.dispatchEvent(
        new CustomEvent(CART_UPDATED_EVENT, {
          detail: {
            count: cartItemCount,
          },
        })
      );
    } catch (error) {
      console.error("Failed to save cart:", error);
    }
  }, [cart]);

  const cartItemCount = useMemo(() => {
    return cart.reduce(
      (total, item) =>
        total + Number(item.quantity || 0),
      0
    );
  }, [cart]);

  const cartSubtotal = useMemo(() => {
    return cart.reduce((total, item) => {
      return (
        total +
        Number(item.price || 0) *
          Number(item.quantity || 0)
      );
    }, 0);
  }, [cart]);

  // Check whether any cart item is unavailable
  const unavailableItems = useMemo(() => {
    return cart.filter(
      (item) => item.isAvailable === false
    );
  }, [cart]);

  const hasUnavailableItems =
    unavailableItems.length > 0;

  const handleIncrease = (id) => {
    setCart((previousCart) =>
      previousCart.map((item) => {
        if (item._id !== id) {
          return item;
        }

        // Do not increase quantity of unavailable items
        if (item.isAvailable === false) {
          return item;
        }

        return {
          ...item,
          quantity: Number(item.quantity || 0) + 1,
        };
      })
    );
  };

  const handleDecrease = (id) => {
    setCart((previousCart) =>
      previousCart
        .map((item) =>
          item._id === id
            ? {
                ...item,
                quantity:
                  Number(item.quantity || 0) - 1,
              }
            : item
        )
        .filter(
          (item) => Number(item.quantity || 0) > 0
        )
    );
  };

  const handleRemove = (id) => {
    setCart((previousCart) =>
      previousCart.filter(
        (item) => item._id !== id
      )
    );
  };

  const handleImageError = (event) => {
    event.currentTarget.onerror = null;

    event.currentTarget.src =
      "https://placehold.co/300x220?text=Image+Unavailable";
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN").format(price);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gray-900 px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-orange-400">
            Your Cart
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
            Review Your Order
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-gray-300 sm:text-base">
            Check your selected items, update quantities, and review your
            order total.
          </p>
        </div>
      </section>

      {/* Cart Section */}
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Availability Check */}
          {checkingAvailability && cart.length > 0 && (
            <div className="mb-6 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-medium text-blue-700">
              Checking current menu availability...
            </div>
          )}

          {/* Out of Stock Warning */}
          {!checkingAvailability &&
            hasUnavailableItems && (
              <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-5">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-100 text-lg">
                    !
                  </div>

                  <div>
                    <h2 className="text-base font-bold text-red-800">
                      Some items are currently out of stock
                    </h2>

                    <p className="mt-1 text-sm leading-6 text-red-700">
                      Please remove the unavailable item
                      {unavailableItems.length > 1
                        ? "s"
                        : ""}{" "}
                      from your cart before proceeding to
                      checkout.
                    </p>
                  </div>
                </div>
              </div>
            )}

          {/* Empty Cart */}
          {cart.length === 0 && (
            <div className="rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center shadow-sm">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-orange-50">
                <span className="text-2xl">🛒</span>
              </div>

              <h2 className="mt-6 text-2xl font-bold text-gray-900">
                Your cart is empty
              </h2>

              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-gray-600">
                You haven't added any items to your cart yet.
                Explore our menu and choose your favourite
                dishes.
              </p>

              <Link
                to="/menu"
                className="mt-7 inline-flex rounded-lg bg-orange-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:ring-offset-2"
              >
                Browse Menu
              </Link>
            </div>
          )}

          {/* Cart Content */}
          {cart.length > 0 && (
            <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
              {/* Cart Items */}
              <div>
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Cart Items
                    </h2>

                    <p className="mt-1 text-sm text-gray-600">
                      {cartItemCount} item
                      {cartItemCount > 1 ? "s" : ""} in your
                      cart
                    </p>
                  </div>

                  <Link
                    to="/menu"
                    className="text-sm font-semibold text-orange-600 transition hover:text-orange-700"
                  >
                    Continue Shopping
                  </Link>
                </div>

                <div className="space-y-5">
                  {cart.map((item) => {
                    const itemQuantity = Number(
                      item.quantity || 0
                    );

                    const itemPrice = Number(
                      item.price || 0
                    );

                    const itemSubtotal =
                      itemPrice * itemQuantity;

                    const isAvailable =
                      item.isAvailable !== false;

                    return (
                      <article
                        key={item._id}
                        className={`rounded-2xl border bg-white p-4 shadow-sm sm:p-6 ${
                          isAvailable
                            ? "border-gray-200"
                            : "border-red-200 ring-1 ring-red-100"
                        }`}
                      >
                        {/* Out of Stock Header */}
                        {!isAvailable && (
                          <div className="mb-4 flex items-center justify-between gap-3 rounded-lg bg-red-50 px-4 py-3">
                            <div>
                              <p className="text-sm font-bold text-red-700">
                                Out of Stock
                              </p>

                              <p className="mt-1 text-xs text-red-600">
                                This item is currently
                                unavailable.
                              </p>
                            </div>

                            <span className="shrink-0 rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700">
                              Unavailable
                            </span>
                          </div>
                        )}

                        <div className="flex flex-col gap-5 sm:flex-row">
                          {/* Image */}
                          <div className="relative h-48 w-full shrink-0 overflow-hidden rounded-xl bg-gray-100 sm:h-32 sm:w-40">
                            <img
                              src={item.image}
                              alt={item.name}
                              onError={handleImageError}
                              className={`h-full w-full object-cover ${
                                !isAvailable
                                  ? "grayscale opacity-60"
                                  : ""
                              }`}
                            />

                            {!isAvailable && (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <span className="rounded-md bg-black/60 px-3 py-1.5 text-xs font-bold text-white">
                                  OUT OF STOCK
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Content */}
                          <div className="flex flex-1 flex-col">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                              <div>
                                <h3
                                  className={`text-lg font-bold ${
                                    isAvailable
                                      ? "text-gray-900"
                                      : "text-gray-600"
                                  }`}
                                >
                                  {item.name}
                                </h3>

                                <span className="mt-2 inline-block rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700">
                                  {item.category}
                                </span>
                              </div>

                              <p
                                className={`text-lg font-bold ${
                                  isAvailable
                                    ? "text-orange-600"
                                    : "text-gray-500"
                                }`}
                              >
                                ₹{formatPrice(itemPrice)}
                              </p>
                            </div>

                            <p className="mt-3 line-clamp-2 text-sm leading-6 text-gray-600">
                              {item.description}
                            </p>

                            <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                              {/* Quantity */}
                              <div className="flex items-center gap-3">
                                <span className="text-sm font-semibold text-gray-700">
                                  Quantity
                                </span>

                                <div
                                  className={`flex items-center overflow-hidden rounded-lg border ${
                                    isAvailable
                                      ? "border-gray-300"
                                      : "border-red-200"
                                  }`}
                                >
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleDecrease(
                                        item._id
                                      )
                                    }
                                    className="flex h-9 w-9 items-center justify-center text-lg font-bold text-gray-700 transition hover:bg-gray-100"
                                    aria-label={`Decrease quantity of ${item.name}`}
                                  >
                                    −
                                  </button>

                                  <span className="flex h-9 min-w-10 items-center justify-center border-x border-gray-300 px-3 text-sm font-semibold text-gray-900">
                                    {itemQuantity}
                                  </span>

                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleIncrease(
                                        item._id
                                      )
                                    }
                                    disabled={!isAvailable}
                                    className="flex h-9 w-9 items-center justify-center text-lg font-bold text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-300"
                                    aria-label={`Increase quantity of ${item.name}`}
                                  >
                                    +
                                  </button>
                                </div>
                              </div>

                              {/* Subtotal + Remove */}
                              <div className="flex items-center justify-between gap-5 sm:justify-end">
                                <div className="text-right">
                                  <p className="text-xs text-gray-500">
                                    Subtotal
                                  </p>

                                  <p className="text-base font-bold text-gray-900">
                                    ₹{formatPrice(itemSubtotal)}
                                  </p>
                                </div>

                                <button
                                  type="button"
                                  onClick={() =>
                                    handleRemove(
                                      item._id
                                    )
                                  }
                                  className="text-sm font-semibold text-red-600 transition hover:text-red-700"
                                >
                                  Remove
                                </button>
                              </div>
                            </div>

                            {!isAvailable && (
                              <p className="mt-4 text-xs font-medium text-red-600">
                                Remove this item to continue
                                to checkout.
                              </p>
                            )}
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>

              {/* Order Summary */}
              <aside className="h-fit rounded-2xl border border-gray-200 bg-white p-6 shadow-sm lg:sticky lg:top-24">
                <h2 className="text-xl font-bold text-gray-900">
                  Order Summary
                </h2>

                <div className="mt-6 space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">
                      Items ({cartItemCount})
                    </span>

                    <span className="font-semibold text-gray-900">
                      ₹{formatPrice(cartSubtotal)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">
                      Delivery
                    </span>

                    <span className="font-semibold text-green-600">
                      Free
                    </span>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-base font-bold text-gray-900">
                        Total
                      </span>

                      <span className="text-2xl font-bold text-orange-600">
                        ₹{formatPrice(cartSubtotal)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Checkout Warning */}
                {hasUnavailableItems && (
                  <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-3">
                    <p className="text-xs font-semibold leading-5 text-red-700">
                      Remove all out-of-stock items before
                      proceeding to checkout.
                    </p>
                  </div>
                )}

                {/* Proceed to Checkout */}
                {hasUnavailableItems ? (
                  <button
                    type="button"
                    disabled
                    className="mt-7 block w-full cursor-not-allowed rounded-lg bg-gray-300 px-5 py-3 text-center text-sm font-semibold text-gray-500"
                  >
                    Checkout Unavailable
                  </button>
                ) : (
                  <Link
                    to="/checkout"
                    className="mt-7 block w-full rounded-lg bg-orange-600 px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:ring-offset-2"
                  >
                    Proceed to Checkout
                  </Link>
                )}

                <p className="mt-3 text-center text-xs leading-5 text-gray-500">
                  Review your details and order before placing
                  it.
                </p>

                <Link
                  to="/menu"
                  className="mt-4 block w-full rounded-lg border border-gray-300 bg-white px-5 py-3 text-center text-sm font-semibold text-gray-800 transition hover:bg-gray-50"
                >
                  Continue Shopping
                </Link>
              </aside>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default Cart;
