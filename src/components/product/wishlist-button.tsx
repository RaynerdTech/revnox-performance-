// This file defines a client-side wishlist toggle button for Shopify products.
"use client";

import { Heart } from "lucide-react";
import { useEffect, useState } from "react";
import type { Product } from "@/lib/commerce/types";
import { isProductWishlisted, toggleWishlistItem } from "@/lib/utils/wishlist";
import { cn } from "@/lib/utils/cn";

type WishlistButtonProps = {
  product: Product;
  className?: string;
};

export function WishlistButton({ product, className }: WishlistButtonProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    setIsWishlisted(isProductWishlisted(product.id));
  }, [product.id]);

  return (
    <button
      type="button"
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();

        toggleWishlistItem(product);
        setIsWishlisted((current) => !current);
      }}
      className={cn(
        "inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background/90 text-muted-foreground shadow-[var(--shadow-card)] backdrop-blur transition-colors hover:border-primary hover:text-primary",
        isWishlisted && "border-primary bg-primary text-primary-foreground hover:text-primary-foreground",
        className,
      )}
      aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
    >
      <Heart className={cn("h-4 w-4", isWishlisted && "fill-current")} />
    </button>
  );
}