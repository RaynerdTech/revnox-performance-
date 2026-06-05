// This file defines the fixed mobile filter drawer for the Shopify product catalog.
"use client";

import Link from "next/link";
import {
  SlidersHorizontal,
  X,
} from "lucide-react";
import {
  useEffect,
  useState,
} from "react";
import type { ProductCategory } from "@/lib/commerce/types";
import { cn } from "@/lib/utils/cn";

type MobileCatalogFilterProps = {
  categories: ProductCategory[];
  activeSearch?: string;
  activeCategory?: string;
  activeFeatured?: boolean;
  activeBestSeller?: boolean;
  activeAvailable?: boolean;
  activeSort?: string;
};

type CatalogFilterState = {
  q?: string;
  category?: string;
  featured?: boolean;
  bestSeller?: boolean;
  available?: boolean;
  sort?: string;
};

export function MobileCatalogFilter({
  categories,
  activeSearch,
  activeCategory,
  activeFeatured,
  activeBestSeller,
  activeAvailable,
  activeSort,
}: MobileCatalogFilterProps) {
  const [isOpen, setIsOpen] =
    useState(false);

  const currentFilters: CatalogFilterState = {
    q: activeSearch,
    category: activeCategory,
    featured: activeFeatured,
    bestSeller: activeBestSeller,
    available: activeAvailable,
    sort: activeSort,
  };

  useEffect(() => {
    document.body.style.overflow = isOpen
      ? "hidden"
      : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-5 right-5 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[var(--shadow-soft)] transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:hidden"
        aria-label="Open product filters"
        aria-expanded={isOpen}
      >
        <SlidersHorizontal className="h-5 w-5" />
      </button>

      <div
        className={cn(
          "fixed inset-0 z-50 bg-black/55 backdrop-blur-sm transition-opacity duration-200 lg:hidden",
          isOpen
            ? "visible opacity-100"
            : "invisible opacity-0",
        )}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      <aside
        className={cn(
          "revnox-sidebar-scroll fixed bottom-0 left-0 right-0 z-[60] max-h-[86vh] overflow-y-auto rounded-t-[2rem] border border-border bg-background p-5 shadow-[var(--shadow-soft)] transition-transform duration-300 lg:hidden",
          isOpen
            ? "translate-y-0"
            : "translate-y-full",
        )}
        aria-label="Product filters"
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

        {activeSearch ? (
          <div className="mb-5 border border-border bg-card p-4">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-foreground/60">
              Search
            </p>

            <p className="mt-2 text-sm font-black text-foreground">
              “{activeSearch}”
            </p>

            <Link
              href={buildFilterHref({
                ...currentFilters,
                q: undefined,
              })}
              onClick={() => setIsOpen(false)}
              className="mt-3 inline-flex text-xs font-black uppercase tracking-[0.16em] text-primary"
            >
              Clear search
            </Link>
          </div>
        ) : null}

        <FilterSection title="Categories">
          <MobileFilterLink
            href="/products"
            active={
              !activeSearch &&
              !activeCategory &&
              !activeFeatured &&
              !activeBestSeller &&
              !activeAvailable &&
              !activeSort
            }
            onClick={() =>
              setIsOpen(false)
            }
          >
            All products
          </MobileFilterLink>

          {categories.map((category) => (
            <MobileFilterLink
              key={category.id}
              href={buildFilterHref({
                ...currentFilters,
                category:
                  category.handle,
              })}
              active={
                activeCategory ===
                category.handle
              }
              onClick={() =>
                setIsOpen(false)
              }
            >
              <span>
                {category.title}
              </span>

              <span className="text-xs opacity-75">
                {category.productCount}
              </span>
            </MobileFilterLink>
          ))}
        </FilterSection>

        <FilterSection title="Availability">
          <MobileFilterLink
            href={buildFilterHref({
              ...currentFilters,
              available: activeAvailable
                ? undefined
                : true,
            })}
            active={activeAvailable}
            onClick={() =>
              setIsOpen(false)
            }
          >
            In stock
          </MobileFilterLink>
        </FilterSection>

        <FilterSection title="Merchandising">
          <MobileFilterLink
            href={buildFilterHref({
              ...currentFilters,
              featured: activeFeatured
                ? undefined
                : true,
            })}
            active={activeFeatured}
            onClick={() =>
              setIsOpen(false)
            }
          >
            Featured
          </MobileFilterLink>

          <MobileFilterLink
            href={buildFilterHref({
              ...currentFilters,
              bestSeller:
                activeBestSeller
                  ? undefined
                  : true,
            })}
            active={activeBestSeller}
            onClick={() =>
              setIsOpen(false)
            }
          >
            Best sellers
          </MobileFilterLink>
        </FilterSection>

        <FilterSection title="Sort">
          <MobileFilterLink
            href={buildFilterHref({
              ...currentFilters,
              sort: undefined,
            })}
            active={!activeSort}
            onClick={() =>
              setIsOpen(false)
            }
          >
            Latest
          </MobileFilterLink>

          <MobileFilterLink
            href={buildFilterHref({
              ...currentFilters,
              sort: "price-asc",
            })}
            active={
              activeSort === "price-asc"
            }
            onClick={() =>
              setIsOpen(false)
            }
          >
            Price: low to high
          </MobileFilterLink>

          <MobileFilterLink
            href={buildFilterHref({
              ...currentFilters,
              sort: "price-desc",
            })}
            active={
              activeSort ===
              "price-desc"
            }
            onClick={() =>
              setIsOpen(false)
            }
          >
            Price: high to low
          </MobileFilterLink>
        </FilterSection>

        <Link
          href="/products"
          onClick={() =>
            setIsOpen(false)
          }
          className="mt-6 inline-flex w-full items-center justify-center border border-border bg-card px-5 py-4 text-sm font-black uppercase tracking-[0.14em] text-card-foreground transition-colors hover:border-primary hover:text-primary"
        >
          Clear all filters
        </Link>
      </aside>
    </>
  );
}

function buildFilterHref(
  filters: CatalogFilterState,
) {
  const searchParams =
    new URLSearchParams();

  if (filters.q) {
    searchParams.set("q", filters.q);
  }

  if (filters.category) {
    searchParams.set(
      "category",
      filters.category,
    );
  }

  if (filters.featured) {
    searchParams.set("featured", "true");
  }

  if (filters.bestSeller) {
    searchParams.set(
      "bestSeller",
      "true",
    );
  }

  if (filters.available) {
    searchParams.set(
      "available",
      "true",
    );
  }

  if (filters.sort) {
    searchParams.set("sort", filters.sort);
  }

  const queryString =
    searchParams.toString();

  return queryString
    ? `/products?${queryString}`
    : "/products";
}

function FilterSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-6 border-t border-border pt-6">
      <h3 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">
        {title}
      </h3>

      <div className="mt-4 grid gap-3">
        {children}
      </div>
    </section>
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