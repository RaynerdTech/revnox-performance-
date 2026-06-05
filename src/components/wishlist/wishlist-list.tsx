// This file renders the client-side wishlist page from browser storage.
"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import {
  getWishlistItems,
  removeWishlistItem,
  type WishlistItem,
} from "@/lib/utils/wishlist";
import { formatMoney } from "@/lib/utils/money";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

export function WishlistList() {
  const [items, setItems] = useState<WishlistItem[]>([]);

  useEffect(() => {
    setItems(getWishlistItems());

    function syncWishlist() {
      setItems(getWishlistItems());
    }

    window.addEventListener("revnox:wishlist-updated", syncWishlist);
    window.addEventListener("storage", syncWishlist);

    return () => {
      window.removeEventListener("revnox:wishlist-updated", syncWishlist);
      window.removeEventListener("storage", syncWishlist);
    };
  }, []);

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-xl  border border-border bg-card p-10 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Heart className="h-7 w-7" />
        </div>

        <p className="mt-6 text-xs font-black uppercase tracking-[0.22em] text-primary">
          Wishlist is empty
        </p>

        <h2 className="mt-3 text-4xl font-black uppercase tracking-[-0.06em]">
          Save parts for later.
        </h2>

        <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-muted-foreground">
          Add products to your wishlist while browsing the catalog.
        </p>

        <Link
          href="/products"
          className={cn(buttonVariants({ variant: "primary", size: "lg" }), "mt-7")}
        >
          Shop products
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto grid w-full max-w-7xl gap-4 lg:grid-cols-2">
      {items.map((item) => (
        <article
          key={item.id}
          className="grid grid-cols-[92px_1fr_auto] items-center gap-4 border border-border bg-card p-4  transition-transform duration-200 hover:-translate-y-0.5 sm:grid-cols-[120px_1fr_auto] sm:gap-5  rounded-[1.5rem]"
        >
       <Link
  href={`/products/${item.handle}`}
  className="relative h-[92px] w-[92px] shrink-0 overflow-hidden  border border-border bg-surface sm:h-[120px] sm:w-[120px]  rounded-[1rem]"
>
  {item.image ? (
    <Image
      src={item.image}
      alt={item.imageAlt || item.title}
      fill
      className="object-contain p-3"
      sizes="(max-width: 640px) 92px, 120px"
    />
  ) : (
    <div className="flex h-full w-full items-center justify-center px-3 text-center text-[10px] font-black uppercase tracking-[0.16em] text-muted-foreground">
      No image
    </div>
  )}
</Link>

          <div className="min-w-0">
            <Link
              href={`/products/${item.handle}`}
              className="line-clamp-2 text-base font-black uppercase leading-tight tracking-[-0.04em] transition-colors hover:text-primary sm:text-xl"
            >
              {item.title}
            </Link>

            <p className="mt-2 text-sm font-bold text-muted-foreground">
              {item.category}
            </p>

            <p className="mt-2 text-lg font-black tracking-[-0.04em] sm:text-xl">
              {formatMoney(item.price, item.currencyCode)}
            </p>

            <Link
              href={`/products/${item.handle}`}
              className="mt-3 inline-flex text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-primary"
            >
              View product
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setItems(removeWishlistItem(item.id))}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-danger hover:text-danger sm:h-12 sm:w-12"
            aria-label={`Remove ${item.title} from wishlist`}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </article>
      ))}
    </div>
  );
}