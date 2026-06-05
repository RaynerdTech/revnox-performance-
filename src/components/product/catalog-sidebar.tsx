// This file renders the sticky desktop product catalog filter sidebar.
import Link from "next/link";
import type { ProductCategory } from "@/lib/commerce/types";
import { cn } from "@/lib/utils/cn";

type CatalogSidebarProps = {
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

export function CatalogSidebar({
  categories,
  activeSearch,
  activeCategory,
  activeFeatured,
  activeBestSeller,
  activeAvailable,
  activeSort,
}: CatalogSidebarProps) {
  const currentFilters: CatalogFilterState = {
    q: activeSearch,
    category: activeCategory,
    featured: activeFeatured,
    bestSeller: activeBestSeller,
    available: activeAvailable,
    sort: activeSort,
  };

  return (
    <aside className="revnox-sidebar-scroll sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto rounded-[1.5rem] border border-border bg-card p-5 shadow-[var(--shadow-card)]">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.22em] text-primary">
          Filters
        </p>

        <h2 className="mt-2 text-2xl font-black uppercase tracking-[-0.05em]">
          Refine catalog
        </h2>
      </div>

      {activeSearch ? (
        <div className="mt-5 border border-border bg-background p-4">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-foreground/60">
            Search
          </p>

          <p className="mt-2 line-clamp-2 text-sm font-black text-foreground">
            “{activeSearch}”
          </p>

          <Link
            href={buildFilterHref({
              ...currentFilters,
              q: undefined,
            })}
            className="mt-3 inline-flex text-xs font-black uppercase tracking-[0.16em] text-primary transition-colors hover:text-foreground"
          >
            Clear search
          </Link>
        </div>
      ) : null}

      <div className="mt-6 border-t border-border pt-6">
        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">
          Categories
        </h3>

        <div className="mt-4 grid gap-2">
          <FilterLink
            href="/products"
            active={
              !activeSearch &&
              !activeCategory &&
              !activeFeatured &&
              !activeBestSeller &&
              !activeAvailable &&
              !activeSort
            }
          >
            All products
          </FilterLink>

          {categories.map((category) => (
            <FilterLink
              key={category.id}
              href={buildFilterHref({
                ...currentFilters,
                category: category.handle,
              })}
              active={
                activeCategory ===
                category.handle
              }
            >
              <span>{category.title}</span>

              <span className="text-xs opacity-75">
                {category.productCount}
              </span>
            </FilterLink>
          ))}
        </div>
      </div>

      <div className="mt-6 border-t border-border pt-6">
        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">
          Availability
        </h3>

        <div className="mt-4 grid gap-2">
          <FilterLink
            href={buildFilterHref({
              ...currentFilters,
              available: activeAvailable
                ? undefined
                : true,
            })}
            active={activeAvailable}
          >
            In stock
          </FilterLink>
        </div>
      </div>

      <div className="mt-6 border-t border-border pt-6">
        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">
          Merchandising
        </h3>

        <div className="mt-4 grid gap-2">
          <FilterLink
            href={buildFilterHref({
              ...currentFilters,
              featured: activeFeatured
                ? undefined
                : true,
            })}
            active={activeFeatured}
          >
            Featured
          </FilterLink>

          <FilterLink
            href={buildFilterHref({
              ...currentFilters,
              bestSeller: activeBestSeller
                ? undefined
                : true,
            })}
            active={activeBestSeller}
          >
            Best sellers
          </FilterLink>
        </div>
      </div>

      <div className="mt-6 border-t border-border pt-6">
        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">
          Sort
        </h3>

        <div className="mt-4 grid gap-2">
          <FilterLink
            href={buildFilterHref({
              ...currentFilters,
              sort: undefined,
            })}
            active={!activeSort}
          >
            Latest
          </FilterLink>

          <FilterLink
            href={buildFilterHref({
              ...currentFilters,
              sort: "price-asc",
            })}
            active={
              activeSort === "price-asc"
            }
          >
            Price: low to high
          </FilterLink>

          <FilterLink
            href={buildFilterHref({
              ...currentFilters,
              sort: "price-desc",
            })}
            active={
              activeSort === "price-desc"
            }
          >
            Price: high to low
          </FilterLink>
        </div>
      </div>

      <Link
        href="/products"
        className="mt-6 inline-flex w-full items-center justify-center border border-border px-4 py-3 text-xs font-black uppercase tracking-[0.18em] text-foreground/65 transition-colors hover:border-primary hover:text-primary"
      >
        Clear all filters
      </Link>
    </aside>
  );
}

function buildFilterHref(
  filters: CatalogFilterState,
) {
  const searchParams = new URLSearchParams();

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

function FilterLink({
  href,
  active,
  children,
}: {
  href: string;
  active?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center justify-between rounded-2xl border border-border px-4 py-3 text-sm font-bold text-muted-foreground transition-colors hover:border-primary hover:text-primary",
        active &&
          "border-primary bg-primary text-primary-foreground hover:text-primary-foreground",
      )}
    >
      {children}
    </Link>
  );
}