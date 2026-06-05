// This file renders the product detail add-to-cart form connected to Shopify cart server actions with inventory limits.
"use client";

import Link from "next/link";
import { useActionState, useEffect, useMemo, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import type { ProductVariant } from "@/lib/commerce/types";
import { formatMoney } from "@/lib/utils/money";
import type { AddToCartActionState } from "@/app/cart/actions";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

type AddToCartFormProps = {
  variants: ProductVariant[];
  action: (
    previousState: AddToCartActionState,
    formData: FormData,
  ) => Promise<AddToCartActionState>;
};

const initialAddToCartActionState: AddToCartActionState = {
  status: "idle",
  message: "",
  submittedAt: null,
};

export function AddToCartForm({ variants, action }: AddToCartFormProps) {
  const router = useRouter();
  const confirmationRef = useRef<HTMLDivElement>(null);

  const availableVariants = variants.filter((variant) => variant.availableForSale);
  const defaultVariant = availableVariants[0] ?? variants[0];

  const [state, formAction] = useActionState(
    action,
    initialAddToCartActionState,
  );

  const [selectedVariantId, setSelectedVariantId] = useState(
    defaultVariant?.id ?? "",
  );
  const [quantity, setQuantity] = useState(1);

  const selectedVariant = useMemo(
    () =>
      variants.find((variant) => variant.id === selectedVariantId) ??
      defaultVariant,
    [variants, selectedVariantId, defaultVariant],
  );

  const hasKnownLimit =
    typeof selectedVariant?.quantityAvailable === "number";

  const maxQuantity = hasKnownLimit
    ? selectedVariant?.quantityAvailable ?? 0
    : null;

  const canAddToCart =
    Boolean(selectedVariant?.availableForSale) &&
    (!hasKnownLimit || (maxQuantity !== null && maxQuantity > 0));

  const isAtLimit =
    hasKnownLimit && maxQuantity !== null && quantity >= maxQuantity;

  useEffect(() => {
    if (state.status === "success") {
      router.refresh();

      window.setTimeout(() => {
        confirmationRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 120);
    }
  }, [router, state.status, state.submittedAt]);

  function handleVariantChange(variantId: string) {
    const nextVariant = variants.find((variant) => variant.id === variantId);

    setSelectedVariantId(variantId);

    if (typeof nextVariant?.quantityAvailable === "number") {
      setQuantity(nextVariant.quantityAvailable > 0 ? 1 : 0);
    } else {
      setQuantity(1);
    }
  }

  return (
    <form action={formAction} className="mt-8 grid gap-4">
      <input type="hidden" name="variantId" value={selectedVariant?.id ?? ""} />
      <input type="hidden" name="quantity" value={quantity} />

      {variants.length > 1 ? (
        <label className="grid gap-2">
          <span className="text-xs font-black uppercase tracking-[0.2em] text-foreground/65">
            Select option
          </span>

          <select
            value={selectedVariantId}
            onChange={(event) => handleVariantChange(event.target.value)}
            className="h-12 rounded-2xl border border-border bg-background px-4 text-sm font-bold text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-ring"
          >
            {variants.map((variant) => (
              <option
                key={variant.id}
                value={variant.id}
                disabled={!variant.availableForSale}
              >
                {variant.title} {variant.availableForSale ? "" : "— unavailable"}
              </option>
            ))}
          </select>
        </label>
      ) : null}

      {selectedVariant ? (
        <div className="rounded-2xl border border-border bg-background p-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-foreground/65">
                Selected option
              </p>

              <p className="mt-1 font-black uppercase tracking-[-0.03em] text-foreground">
                {selectedVariant.title}
              </p>

              <p className="mt-1 text-xs font-bold uppercase tracking-[0.14em] text-foreground/65">
                {hasKnownLimit
                  ? `${selectedVariant.quantityAvailable} available`
                  : selectedVariant.availableForSale
                    ? "Available"
                    : "Unavailable"}
              </p>
            </div>

            <div className="text-right">
              <p className="text-lg font-black text-foreground">
                {formatMoney(selectedVariant.price, selectedVariant.currencyCode)}
              </p>

              <p className="mt-1 text-xs font-bold uppercase tracking-[0.14em] text-foreground/65">
                {selectedVariant.availableForSale ? "In stock" : "Unavailable"}
              </p>
            </div>
          </div>
        </div>
      ) : null}

      <div className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-background p-3">
        <p className="pl-2 text-xs font-black uppercase tracking-[0.18em] text-foreground/65">
          Quantity
        </p>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setQuantity((current) => Math.max(1, current - 1))}
            disabled={quantity <= 1}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-lg font-black text-foreground transition-colors hover:border-primary hover:text-primary disabled:pointer-events-none disabled:opacity-40"
            aria-label="Decrease quantity"
          >
            -
          </button>

          <span className="flex h-10 min-w-12 items-center justify-center rounded-full border border-border px-4 text-sm font-black text-foreground">
            {quantity}
          </span>

          <button
            type="button"
            onClick={() =>
              setQuantity((current) =>
                hasKnownLimit && maxQuantity !== null
                  ? Math.min(maxQuantity, current + 1)
                  : current + 1,
              )
            }
            disabled={!canAddToCart || isAtLimit}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-lg font-black text-foreground transition-colors hover:border-primary hover:text-primary disabled:pointer-events-none disabled:opacity-40"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
      </div>

      {isAtLimit ? (
        <p className="text-xs font-bold text-primary">
          Maximum available quantity reached.
        </p>
      ) : null}

      <SubmitButton disabled={!canAddToCart} />

      {state.status !== "idle" ? (
        <div
          ref={confirmationRef}
          className={cn(
            "scroll-mt-28 rounded-2xl border p-4",
            state.status === "success"
              ? "border-primary/30 bg-primary/10"
              : "border-danger/30 bg-danger/10",
          )}
          role="status"
          aria-live="polite"
        >
          <p
            className={cn(
              "text-sm font-black uppercase tracking-[0.14em]",
              state.status === "success" ? "text-primary" : "text-danger",
            )}
          >
            {state.message}
          </p>

          {state.status === "success" ? (
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/products"
                className={cn(buttonVariants({ variant: "outline", size: "md" }))}
              >
                Continue shopping
              </Link>

              <Link
                href="/cart"
                className={cn(buttonVariants({ variant: "primary", size: "md" }))}
              >
                View cart
              </Link>
            </div>
          ) : null}
        </div>
      ) : null}
    </form>
  );
}

function SubmitButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={disabled || pending}
      className={cn(buttonVariants({ variant: "primary", size: "lg" }), "w-full")}
    >
      {pending ? "Adding..." : disabled ? "Unavailable" : "Add to cart"}
    </button>
  );
}