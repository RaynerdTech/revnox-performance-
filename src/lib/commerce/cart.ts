// This file provides the cart gateway so app routes and actions do not talk directly to Shopify.
import "server-only";
import { cookies } from "next/headers";
import {
  addShopifyCartLine,
  createShopifyCart,
  getShopifyCart,
  removeShopifyCartLine,
  updateShopifyCartLine,
} from "@/lib/commerce/shopify/cart";

const CART_COOKIE_NAME = "revnox_cart_id";

const cartCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: 60 * 60 * 24 * 30,
};

export async function getCartId() {
  const cookieStore = await cookies();

  return cookieStore.get(CART_COOKIE_NAME)?.value;
}

export async function setCartId(cartId: string) {
  const cookieStore = await cookies();

  cookieStore.set(CART_COOKIE_NAME, cartId, cartCookieOptions);
}

export async function getCurrentCart() {
  const cartId = await getCartId();

  if (!cartId) {
    return null;
  }

  return getShopifyCart(cartId);
}

export async function addToCart({
  merchandiseId,
  quantity,
}: {
  merchandiseId: string;
  quantity: number;
}) {
  const existingCartId = await getCartId();

  if (!existingCartId) {
    const cart = await createShopifyCart({ merchandiseId, quantity });
    await setCartId(cart.id);

    return cart;
  }

  try {
    const cart = await addShopifyCartLine({
      cartId: existingCartId,
      merchandiseId,
      quantity,
    });

    await setCartId(cart.id);

    return cart;
  } catch {
    const cart = await createShopifyCart({ merchandiseId, quantity });
    await setCartId(cart.id);

    return cart;
  }
}

export async function updateCartLine({
  lineId,
  quantity,
}: {
  lineId: string;
  quantity: number;
}) {
  const cartId = await getCartId();

  if (!cartId) {
    return null;
  }

  if (quantity <= 0) {
    return removeShopifyCartLine({ cartId, lineId });
  }

  return updateShopifyCartLine({ cartId, lineId, quantity });
}

export async function removeCartLine(lineId: string) {
  const cartId = await getCartId();

  if (!cartId) {
    return null;
  }

  return removeShopifyCartLine({ cartId, lineId });
}