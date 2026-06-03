// This file defines browser-side wishlist storage helpers for the storefront.
import type { Product } from "@/lib/commerce/types";

export type WishlistItem = {
  id: string;
  title: string;
  handle: string;
  image: string;
  imageAlt: string;
  price: number;
  currencyCode: string;
  category: string;
};

const WISHLIST_STORAGE_KEY = "revnox_wishlist";

export function getWishlistItems(): WishlistItem[] {
  if (typeof window === "undefined") return [];

  const storedWishlist = window.localStorage.getItem(WISHLIST_STORAGE_KEY);

  if (!storedWishlist) return [];

  try {
    return JSON.parse(storedWishlist) as WishlistItem[];
  } catch {
    return [];
  }
}

export function isProductWishlisted(productId: string) {
  return getWishlistItems().some((item) => item.id === productId);
}

export function toggleWishlistItem(product: Product) {
  const currentItems = getWishlistItems();
  const existingItem = currentItems.find((item) => item.id === product.id);

  const nextItems = existingItem
    ? currentItems.filter((item) => item.id !== product.id)
    : [
        ...currentItems,
        {
          id: product.id,
          title: product.title,
          handle: product.handle,
          image: product.image,
          imageAlt: product.imageAlt,
          price: product.price,
          currencyCode: product.currencyCode,
          category: product.category,
        },
      ];

  window.localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(nextItems));
  window.dispatchEvent(new Event("revnox:wishlist-updated"));

  return nextItems;
}

export function removeWishlistItem(productId: string) {
  const nextItems = getWishlistItems().filter((item) => item.id !== productId);

  window.localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(nextItems));
  window.dispatchEvent(new Event("revnox:wishlist-updated"));

  return nextItems;
}