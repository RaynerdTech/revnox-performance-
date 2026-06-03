// This file renders a controlled product carousel using the existing ProductCard and button system.
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Product } from "@/lib/commerce/types";
import { ProductCard } from "@/components/product/product-card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

type ProductCarouselProps = {
  products: Product[];
  ariaLabel: string;
};

export function ProductCarousel({ products, ariaLabel }: ProductCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollBackward, setCanScrollBackward] = useState(false);
  const [canScrollForward, setCanScrollForward] = useState(false);

  const updateScrollState = useCallback(() => {
    const element = scrollRef.current;

    if (!element) return;

    const maxScrollLeft = element.scrollWidth - element.clientWidth;

    setCanScrollBackward(element.scrollLeft > 8);
    setCanScrollForward(element.scrollLeft < maxScrollLeft - 8);
  }, []);

  function scrollByDirection(direction: "backward" | "forward") {
    const element = scrollRef.current;

    if (!element) return;

    const scrollAmount = Math.round(element.clientWidth * 0.9);

    element.scrollBy({
      left: direction === "forward" ? scrollAmount : -scrollAmount,
      behavior: "smooth",
    });
  }

  useEffect(() => {
    const element = scrollRef.current;

    if (!element) return;

    const frame = requestAnimationFrame(updateScrollState);

    element.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);

    return () => {
      cancelAnimationFrame(frame);
      element.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [products.length, updateScrollState]);

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="group relative overflow-hidden">
      <div
        ref={scrollRef}
        aria-label={ariaLabel}
        className="scrollbar-hide flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-2"
      >
        {products.map((product) => (
          <div
            key={product.id}
            className="shrink-0 snap-start basis-[82%] sm:basis-[48%] lg:basis-[31.5%] xl:basis-[23.5%]"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => scrollByDirection("backward")}
        disabled={!canScrollBackward}
        className={cn(
          buttonVariants({ variant: "outline", size: "icon" }),
          "absolute left-2 top-1/2 z-20 hidden -translate-y-1/2 bg-background/90 shadow-[var(--shadow-card)] backdrop-blur-md transition-opacity disabled:pointer-events-none disabled:opacity-0 sm:inline-flex",
        )}
        aria-label={`Scroll ${ariaLabel} backward`}
      >
        <ArrowLeft className="h-4 w-4" />
      </button>

      <button
        type="button"
        onClick={() => scrollByDirection("forward")}
        disabled={!canScrollForward}
        className={cn(
          buttonVariants({ variant: "outline", size: "icon" }),
          "absolute right-2 top-1/2 z-20 hidden -translate-y-1/2 bg-background/90 shadow-[var(--shadow-card)] backdrop-blur-md transition-opacity disabled:pointer-events-none disabled:opacity-0 sm:inline-flex",
        )}
        aria-label={`Scroll ${ariaLabel} forward`}
      >
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
}