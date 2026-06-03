// This file renders a reusable Shopify product card with readable token-based text and wishlist support.
"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Star } from "lucide-react";
import { useEffect, useState } from "react";
import type { Product } from "@/lib/commerce/types";
import { formatMoney } from "@/lib/utils/money";
import { cn } from "@/lib/utils/cn";

const WISHLIST_STORAGE_KEY = "revnox-wishlist";

type ProductCardProps = {
  product: Product;
};

type StoredWishlistItem = {
  id: string;
  handle: string;
  title: string;
  category: string;
  image: string;
  imageAlt: string;
  price: number;
  currencyCode: string;
};

function getStoredWishlistItems(): StoredWishlistItem[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const storedItems = window.localStorage.getItem(WISHLIST_STORAGE_KEY);

    if (!storedItems) {
      return [];
    }

    const parsedItems = JSON.parse(storedItems);

    return Array.isArray(parsedItems) ? parsedItems : [];
  } catch {
    return [];
  }
}

function saveStoredWishlistItems(items: StoredWishlistItem[]) {
  window.localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event("revnox:wishlist-updated"));
}

export function ProductCard({ product }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);

  const productHref = `/products/${product.handle}`;

  useEffect(() => {
    const items = getStoredWishlistItems();

    setIsWishlisted(items.some((item) => item.id === product.id));
  }, [product.id]);

  function toggleWishlist() {
    const currentItems = getStoredWishlistItems();
    const productIsSaved = currentItems.some((item) => item.id === product.id);

    if (productIsSaved) {
      const nextItems = currentItems.filter((item) => item.id !== product.id);
      saveStoredWishlistItems(nextItems);
      setIsWishlisted(false);
      return;
    }

    const nextItems = [
      ...currentItems,
      {
        id: product.id,
        handle: product.handle,
        title: product.title,
        category: product.category,
        image: product.image,
        imageAlt: product.imageAlt,
        price: product.price,
        currencyCode: product.currencyCode,
      },
    ];

    saveStoredWishlistItems(nextItems);
    setIsWishlisted(true);
  }

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-border bg-card  transition-transform duration-200 hover:-translate-y-1">
      <div className="relative border-b border-border bg-surface">
        {product.badge ? (
          <div className="absolute left-4 top-4 z-10 rounded-full bg-primary px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-primary-foreground">
            {product.badge}
          </div>
        ) : null}

        <button
          type="button"
          onClick={toggleWishlist}
          className={cn(
            "absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card/90 text-foreground/70 shadow-[var(--shadow-card)] backdrop-blur transition-colors hover:border-primary hover:text-primary",
            isWishlisted && "border-primary bg-primary text-primary-foreground",
          )}
          aria-label={
            isWishlisted
              ? `Remove ${product.title} from wishlist`
              : `Add ${product.title} to wishlist`
          }
          aria-pressed={isWishlisted}
        >
          <Heart
            className={cn("h-4 w-4", isWishlisted && "fill-current")}
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
            className="object-contain p-8 transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 82vw, (max-width: 1024px) 44vw, 25vw"
          />
        </Link>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="mb-4 flex items-start justify-between gap-4">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-foreground/65">
            {product.brand}
          </p>

          <div className="flex shrink-0 items-center gap-1.5 text-sm font-black text-foreground/80">
            <Star className="h-4 w-4 fill-primary text-primary" />
            {product.rating.toFixed(1)}
          </div>
        </div>

        <Link
          href={productHref}
          className="line-clamp-2 text-2xl font-black uppercase leading-tight tracking-[-0.05em] text-foreground transition-colors hover:text-primary"
        >
          {product.title}
        </Link>

        {product.description ? (
          <p className="mt-4 line-clamp-4 text-base font-medium leading-7 text-foreground/72">
            {product.description}
          </p>
        ) : null}

        <div className="mt-auto flex items-end justify-between gap-4 pt-8">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-foreground/60">
              From
            </p>

            <div className="mt-1 flex flex-wrap items-baseline gap-2">
              <p className="text-2xl font-black tracking-[-0.05em] text-foreground">
                {formatMoney(product.price, product.currencyCode)}
              </p>

              {product.compareAtPrice ? (
                <p className="text-sm font-bold text-foreground/55 line-through">
                  {formatMoney(product.compareAtPrice, product.currencyCode)}
                </p>
              ) : null}
            </div>
          </div>

          <Link
            href={productHref}
            className="inline-flex h-10 shrink-0 items-center justify-center rounded-full border border-border bg-card px-5 text-xs font-black uppercase tracking-[0.16em] text-foreground transition-colors hover:border-primary hover:text-primary"
          >
            View
          </Link>
        </div>
      </div>
    </article>
  );
}