// This file renders an individual Shopify cart line with stable optimistic quantity, inventory limits, and removal controls.
import Image from "next/image";
import Link from "next/link";
import type { CartLine } from "@/lib/commerce/types";
import { formatMoney } from "@/lib/utils/money";
import { cn } from "@/lib/utils/cn";

type CartLineItemProps = {
  line: CartLine;
  isPending?: boolean;
  onIncrease: (lineId: string) => void;
  onDecrease: (lineId: string) => void;
  onRemove: (lineId: string) => void;
};

export function CartLineItem({
  line,
  isPending = false,
  onIncrease,
  onDecrease,
  onRemove,
}: CartLineItemProps) {
  const hasKnownLimit = typeof line.quantityAvailable === "number";
  const isAtLimit = hasKnownLimit && line.quantity >= (line.quantityAvailable ?? 0);

  return (
    <div
    className={cn(
  "grid gap-5 rounded-[1.5rem] border border-border bg-card p-4 transition-opacity sm:grid-cols-1 lg:grid-cols-2 lg:items-center",
  isPending && "opacity-80",
)}
    >
      <Link
        href={`/products/${line.productHandle}`}
        className="relative aspect-square overflow-hidden rounded-2xl bg-surface"
      >
       <Image
  src={line.productImage}
  alt={line.productImageAlt}
  fill
  className="object-contain p-3"
  sizes="(max-width: 640px) 96px, 120px"
/>
      </Link>

      <div className="grid gap-4">
        <div className="flex flex-col justify-between gap-3 sm:flex-row">
          <div>
            <Link
              href={`/products/${line.productHandle}`}
              className="text-xl font-black uppercase leading-tight tracking-[-0.04em] transition-colors hover:text-primary"
            >
              {line.productTitle}
            </Link>
            <p className="mt-2 text-sm font-bold text-muted-foreground">
              {line.variantTitle}
            </p>

            <p className="mt-2 text-xs font-black uppercase tracking-[0.16em] text-muted-foreground">
              {hasKnownLimit
                ? `${line.quantityAvailable} available`
                : "Available"}
            </p>
          </div>

          <p className="text-xl font-black">
            {formatMoney(line.price * line.quantity, line.currencyCode)}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onDecrease(line.id)}
              disabled={line.quantity <= 1}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-lg font-black transition-colors hover:border-primary hover:text-primary disabled:pointer-events-none disabled:opacity-40"
              aria-label="Decrease quantity"
            >
              -
            </button>

            <span className="flex h-10 min-w-12 items-center justify-center rounded-full border border-border px-4 text-sm font-black">
              {line.quantity}
            </span>

            <button
              type="button"
              onClick={() => onIncrease(line.id)}
              disabled={isAtLimit}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-lg font-black transition-colors hover:border-primary hover:text-primary disabled:pointer-events-none disabled:opacity-40"
              aria-label="Increase quantity"
              title={isAtLimit ? "Maximum available quantity reached" : "Increase quantity"}
            >
              +
            </button>
          </div>

          <button
            type="button"
            onClick={() => onRemove(line.id)}
            className="text-xs font-black uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-danger"
          >
            Remove
          </button>
        </div>

        {isAtLimit ? (
          <p className="text-xs font-bold text-primary">
            Maximum available quantity reached.
          </p>
        ) : null}
      </div>
    </div>
  );
}