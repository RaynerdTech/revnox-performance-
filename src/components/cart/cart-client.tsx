// This file renders the cart with stable optimistic updates, inventory limits, and a two-column cart-item grid on wide screens.
"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { Cart } from "@/lib/commerce/types";
import { CartLineItem } from "@/components/cart/cart-line-item";
import { CartSummary } from "@/components/cart/cart-summary";
import {
  removeCartLineAction,
  updateCartLineAction,
} from "@/app/cart/actions";

type CartClientProps = {
  cart: Cart;
};

type TimerMap = Record<string, ReturnType<typeof setTimeout> | undefined>;
type RequestVersionMap = Record<string, number | undefined>;

export function CartClient({ cart }: CartClientProps) {
  const router = useRouter();
  const [optimisticCart, setOptimisticCart] = useState(cart);
  const [pendingLineIds, setPendingLineIds] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();

  const cartRef = useRef(cart);
  const lastSyncedCartRef = useRef(cart);
  const timersRef = useRef<TimerMap>({});
  const requestVersionsRef = useRef<RequestVersionMap>({});

  function setCart(nextCart: Cart) {
    cartRef.current = nextCart;
    setOptimisticCart(nextCart);
  }

  function recalculateCart(cartToUpdate: Cart, lineId: string, quantity: number) {
    const nextLines =
      quantity <= 0
        ? cartToUpdate.lines.filter((line) => line.id !== lineId)
        : cartToUpdate.lines.map((line) =>
            line.id === lineId ? { ...line, quantity } : line,
          );

    const subtotalAmount = nextLines.reduce(
      (total, line) => total + line.price * line.quantity,
      0,
    );

    const totalQuantity = nextLines.reduce(
      (total, line) => total + line.quantity,
      0,
    );

    return {
      ...cartToUpdate,
      lines: nextLines,
      totalQuantity,
      subtotalAmount,
      totalAmount: subtotalAmount,
    };
  }

  function markPending(lineId: string) {
    setPendingLineIds((current) =>
      current.includes(lineId) ? current : [...current, lineId],
    );
  }

  function unmarkPending(lineId: string) {
    setPendingLineIds((current) => current.filter((id) => id !== lineId));
  }

  function scheduleShopifySync(lineId: string, quantity: number) {
    if (timersRef.current[lineId]) {
      clearTimeout(timersRef.current[lineId]);
    }

    const nextVersion = (requestVersionsRef.current[lineId] ?? 0) + 1;
    requestVersionsRef.current[lineId] = nextVersion;

    timersRef.current[lineId] = setTimeout(() => {
      startTransition(async () => {
        try {
          const formData = new FormData();
          formData.set("lineId", lineId);
          formData.set("quantity", String(quantity));

          const updatedCart =
            quantity <= 0
              ? await removeCartLineAction(formData)
              : await updateCartLineAction(formData);

          const isLatestRequest =
            requestVersionsRef.current[lineId] === nextVersion;

          if (updatedCart && isLatestRequest) {
            lastSyncedCartRef.current = updatedCart;
            setCart(updatedCart);
            router.refresh();
          }
        } catch (error) {
          console.error("Cart sync failed:", error);
          setCart(lastSyncedCartRef.current);
        } finally {
          const isLatestRequest =
            requestVersionsRef.current[lineId] === nextVersion;

          if (isLatestRequest) {
            unmarkPending(lineId);
          }
        }
      });
    }, 450);
  }

  function handleIncrease(lineId: string) {
    const line = cartRef.current.lines.find((cartLine) => cartLine.id === lineId);

    if (!line) return;

    const hasKnownLimit = typeof line.quantityAvailable === "number";
    const maxQuantity = hasKnownLimit ? line.quantityAvailable ?? 0 : null;

    if (hasKnownLimit && maxQuantity !== null && line.quantity >= maxQuantity) {
      return;
    }

    const nextQuantity = line.quantity + 1;
    const nextCart = recalculateCart(cartRef.current, lineId, nextQuantity);

    markPending(lineId);
    setCart(nextCart);
    scheduleShopifySync(lineId, nextQuantity);
  }

  function handleDecrease(lineId: string) {
    const line = cartRef.current.lines.find((cartLine) => cartLine.id === lineId);

    if (!line) return;

    const nextQuantity = Math.max(1, line.quantity - 1);
    const nextCart = recalculateCart(cartRef.current, lineId, nextQuantity);

    markPending(lineId);
    setCart(nextCart);
    scheduleShopifySync(lineId, nextQuantity);
  }

  function handleRemove(lineId: string) {
    const nextCart = recalculateCart(cartRef.current, lineId, 0);

    markPending(lineId);
    setCart(nextCart);
    scheduleShopifySync(lineId, 0);
  }

  return (
    <div className="grid gap-8">
      <section className="rounded-[1.75rem] border border-border bg-card p-4 shadow-[var(--shadow-soft)] sm:p-5">
        <div className="border-b border-border pb-4">
          <h2 className="text-2xl font-black tracking-[-0.04em] text-foreground">
            My Cart ({optimisticCart.totalQuantity})
          </h2>
        </div>

<div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
  {optimisticCart.lines.map((line) => (
    <CartLineItem
      key={line.id}
      line={line}
      isPending={pendingLineIds.includes(line.id)}
      onIncrease={handleIncrease}
      onDecrease={handleDecrease}
      onRemove={handleRemove}
    />
  ))}
</div>
      </section>

      <CartSummary cart={optimisticCart} isUpdating={isPending} />
    </div>
  );
}