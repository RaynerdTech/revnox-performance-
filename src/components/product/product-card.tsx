// This file renders a responsive Shopify product card with a compact mobile layout.
"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { useEffect, useState } from "react";
import type { Product } from "@/lib/commerce/types";
import { formatMoney } from "@/lib/utils/money";
import { cn } from "@/lib/utils/cn";
import {
  isProductWishlisted,
  toggleWishlistItem,
} from "@/lib/utils/wishlist";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);

  const productHref = `/products/${product.handle}`;

  useEffect(() => {
    function syncWishlist() {
      setIsWishlisted(isProductWishlisted(product.id));
    }

    syncWishlist();

    window.addEventListener("revnox:wishlist-updated", syncWishlist);
    window.addEventListener("storage", syncWishlist);

    return () => {
      window.removeEventListener("revnox:wishlist-updated", syncWishlist);
      window.removeEventListener("storage", syncWishlist);
    };
  }, [product.id]);

  function toggleWishlist() {
    const nextItems = toggleWishlistItem(product);

    setIsWishlisted(
      nextItems.some((item) => item.id === product.id),
    );
  }

  return (
    <article className="group flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-border bg-card sm:rounded-[1.5rem] sm:transition-transform sm:duration-200 sm:hover:-translate-y-1">
      <div className="relative border-b border-border bg-surface">
        {product.badge ? (
          <div className="absolute left-2 top-2 z-10 max-w-[calc(100%-3rem)] truncate rounded-full bg-primary px-2.5 py-1.5 text-[8px] font-black uppercase tracking-[0.12em] text-primary-foreground sm:left-4 sm:top-4 sm:px-4 sm:py-2 sm:text-[11px] sm:tracking-[0.18em]">
            {product.badge}
          </div>
        ) : null}

        <button
          type="button"
          onClick={toggleWishlist}
          className={cn(
            "absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-border bg-card/90 text-foreground/70 shadow-[var(--shadow-card)] backdrop-blur transition-colors hover:border-primary hover:text-primary sm:right-4 sm:top-4 sm:h-10 sm:w-10",
            isWishlisted &&
              "border-primary bg-primary text-primary-foreground hover:text-primary-foreground",
          )}
          aria-label={
            isWishlisted
              ? `Remove ${product.title} from wishlist`
              : `Add ${product.title} to wishlist`
          }
          aria-pressed={isWishlisted}
        >
          <Heart
            className={cn(
              "h-3.5 w-3.5 sm:h-4 sm:w-4",
              isWishlisted && "fill-current",
            )}
          />
        </button>

        <Link
          href={productHref}
          className="relative block aspect-square overflow-hidden"
        >
          <Image
            src={product.image}
            alt={product.imageAlt}
            fill
            className="object-contain p-3 transition-transform duration-300 group-hover:scale-105 sm:p-8"
            sizes="(max-width: 639px) 46vw, (max-width: 1023px) 48vw, (max-width: 1279px) 32vw, 24vw"
          />
        </Link>
      </div>

      <div className="flex min-w-0 flex-1 flex-col p-3 sm:p-6">
        <div className="mb-2 grid min-w-0 gap-1 sm:mb-4 sm:flex sm:items-start sm:justify-between sm:gap-4">
          {product.brand ? (
            <p className="truncate text-[8px] font-black uppercase tracking-[0.12em] text-foreground/60 sm:text-xs sm:tracking-[0.18em] sm:text-foreground/65">
              {product.brand}
            </p>
          ) : null}

          <p
            className={cn(
              "text-[8px] font-black uppercase tracking-[0.12em] sm:shrink-0 sm:text-[11px] sm:tracking-[0.16em]",
              product.availableForSale
                ? "text-primary"
                : "text-foreground/50",
            )}
          >
            {product.availableForSale ? "In stock" : "Unavailable"}
          </p>
        </div>

        <Link
          href={productHref}
          className="line-clamp-2 break-words text-[13px] font-black uppercase leading-[1.15] tracking-[-0.035em] text-foreground transition-colors hover:text-primary sm:text-2xl sm:leading-tight sm:tracking-[-0.05em]"
        >
          {product.title}
        </Link>

        {product.description ? (
          <p className="mt-4 hidden text-base font-medium leading-7 text-foreground/72 sm:line-clamp-4">
            {product.description}
          </p>
        ) : null}

        <div className="mt-auto flex min-w-0 items-end justify-between gap-2 pt-4 sm:gap-4 sm:pt-8">
          <div className="min-w-0">
            <p className="text-[8px] font-black uppercase tracking-[0.14em] text-foreground/55 sm:text-xs sm:tracking-[0.18em] sm:text-foreground/60">
              From
            </p>

            <div className="mt-1 flex min-w-0 flex-wrap items-baseline gap-1 sm:gap-2">
              <p className="truncate text-base font-black tracking-[-0.04em] text-foreground sm:text-2xl sm:tracking-[-0.05em]">
                {formatMoney(product.price, product.currencyCode)}
              </p>

              {product.compareAtPrice ? (
                <p className="hidden text-sm font-bold text-foreground/55 line-through sm:block">
                  {formatMoney(
                    product.compareAtPrice,
                    product.currencyCode,
                  )}
                </p>
              ) : null}
            </div>
          </div>

          <Link
            href={productHref}
            className="hidden h-10 shrink-0 items-center justify-center rounded-full border border-border bg-card px-5 text-xs font-black uppercase tracking-[0.16em] text-foreground transition-colors hover:border-primary hover:text-primary sm:inline-flex"
          >
            View
          </Link>
        </div>
      </div>
    </article>
  );
}