// This file defines the fixed mobile filter drawer for the Shopify product catalog.
"use client";

import Link from "next/link";
import { SlidersHorizontal, X } from "lucide-react";
import { useState } from "react";
import type { ProductCategory } from "@/lib/commerce/types";
import { cn } from "@/lib/utils/cn";

type MobileCatalogFilterProps = {
  categories: ProductCategory[];
  activeCategory?: string;
  activeFeatured?: boolean;
  activeSort?: string;
};

export function MobileCatalogFilter({
  categories,
  activeCategory,
  activeFeatured,
  activeSort,
}: MobileCatalogFilterProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-5 right-5 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[var(--shadow-soft)] transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:hidden"
        aria-label="Open product filters"
      >
        <SlidersHorizontal className="h-5 w-5" />
      </button>

      <div
        className={cn(
          "fixed inset-0 z-50 bg-black/55 backdrop-blur-sm transition-opacity duration-200 lg:hidden",
          isOpen ? "visible opacity-100" : "invisible opacity-0",
        )}
        onClick={() => setIsOpen(false)}
      />

      <aside
        className={cn(
          "fixed bottom-0 left-0 right-0 z-[60] max-h-[82vh] overflow-y-auto rounded-t-[2rem] border border-border bg-background p-5 shadow-[var(--shadow-soft)] transition-transform duration-300 lg:hidden",
          isOpen ? "translate-y-0" : "translate-y-full",
        )}
      >
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-primary">
              Filters
            </p>
            <h2 className="mt-1 text-2xl font-black uppercase tracking-[-0.05em]">
              Refine catalog
            </h2>
          </div>

          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card text-card-foreground"
            aria-label="Close product filters"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid gap-3">
          <MobileFilterLink
            href="/products"
            active={!activeCategory && !activeFeatured && !activeSort}
            onClick={() => setIsOpen(false)}
          >
            All products
          </MobileFilterLink>

          {categories.map((category) => (
            <MobileFilterLink
              key={category.id}
              href={`/products?category=${category.handle}`}
              active={activeCategory === category.handle}
              onClick={() => setIsOpen(false)}
            >
              <span>{category.title}</span>
              <span className="text-xs opacity-75">{category.productCount}</span>
            </MobileFilterLink>
          ))}

          <MobileFilterLink
            href="/products?featured=true"
            active={activeFeatured}
            onClick={() => setIsOpen(false)}
          >
            Featured
          </MobileFilterLink>

          <MobileFilterLink
            href="/products?sort=best-selling"
            active={activeSort === "best-selling"}
            onClick={() => setIsOpen(false)}
          >
            Best sellers
          </MobileFilterLink>
        </div>
      </aside>
    </>
  );
}

function MobileFilterLink({
  href,
  active,
  onClick,
  children,
}: {
  href: string;
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "flex items-center justify-between rounded-2xl border border-border bg-card px-5 py-4 text-sm font-black uppercase tracking-[0.14em] text-card-foreground transition-colors hover:border-primary hover:text-primary",
        active &&
          "border-primary bg-primary text-primary-foreground hover:text-primary-foreground",
      )}
    >
      {children}
    </Link>
  );
}