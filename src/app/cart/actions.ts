// This file defines server actions for Shopify cart updates and checkout redirects.
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  addToCart,
  getCurrentCart,
  removeCartLine,
  updateCartLine,
} from "@/lib/commerce/cart";

export type AddToCartActionState = {
  status: "idle" | "success" | "error";
  message: string;
  submittedAt: number | null;
};

export async function addToCartAction(
  _previousState: AddToCartActionState,
  formData: FormData,
): Promise<AddToCartActionState> {
  const merchandiseId = String(formData.get("variantId") ?? "");
  const quantity = Number(formData.get("quantity") ?? 1);

  if (!merchandiseId) {
    return {
      status: "error",
      message: "Select an available product option before adding to cart.",
      submittedAt: Date.now(),
    };
  }

  try {
    await addToCart({
      merchandiseId,
      quantity: Number.isFinite(quantity) && quantity > 0 ? quantity : 1,
    });

    revalidatePath("/cart");
    revalidatePath("/", "layout");

    return {
      status: "success",
      message: "Added to cart.",
      submittedAt: Date.now(),
    };
  } catch {
    return {
      status: "error",
      message: "Could not add this product to cart. Try again.",
      submittedAt: Date.now(),
    };
  }
}

export async function updateCartLineAction(formData: FormData) {
  const lineId = String(formData.get("lineId") ?? "");
  const quantity = Number(formData.get("quantity") ?? 1);

  if (!lineId) {
    throw new Error("Missing cart line ID.");
  }

  await updateCartLine({
    lineId,
    quantity: Number.isFinite(quantity) ? quantity : 1,
  });

  revalidatePath("/cart");

  return getCurrentCart();
}

export async function removeCartLineAction(formData: FormData) {
  const lineId = String(formData.get("lineId") ?? "");

  if (!lineId) {
    throw new Error("Missing cart line ID.");
  }

  await removeCartLine(lineId);

  revalidatePath("/cart");

  return getCurrentCart();
}

export async function checkoutAction() {
  const cart = await getCurrentCart();

  if (!cart || cart.lines.length === 0) {
    redirect("/products");
  }

  redirect(cart.checkoutUrl);
}