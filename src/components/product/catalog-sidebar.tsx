// This file renders the sticky desktop product catalog filter sidebar for Shopify-powered product browsing.
import Link from "next/link";
import type { ProductCategory } from "@/lib/commerce/types";
import { cn } from "@/lib/utils/cn";

type CatalogSidebarProps = {
  categories: ProductCategory[];
  activeCategory?: string;
  activeFeatured?: boolean;
  activeSort?: string;
};

export function CatalogSidebar({
  categories,
  activeCategory,
  activeFeatured,
  activeSort,
}: CatalogSidebarProps) {
  return (
    <aside className="sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto rounded-[1.5rem] border border-border bg-card p-5 shadow-[var(--shadow-card)]">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.22em] text-primary">
          Filters
        </p>
        <h2 className="mt-2 text-2xl font-black uppercase tracking-[-0.05em]">
          Refine catalog
        </h2>
      </div>

      <div className="mt-6 border-t border-border pt-6">
        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">
          Categories
        </h3>

        <div className="mt-4 grid gap-2">
          <FilterLink
            href="/products"
            active={!activeCategory && !activeFeatured && !activeSort}
          >
            All products
          </FilterLink>

          {categories.map((category) => (
            <FilterLink
              key={category.id}
              href={`/products?category=${category.handle}`}
              active={activeCategory === category.handle}
            >
              <span>{category.title}</span>
              <span className="text-xs opacity-75">{category.productCount}</span>
            </FilterLink>
          ))}
        </div>
      </div>

      <div className="mt-6 border-t border-border pt-6">
        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">
          Merchandising
        </h3>

        <div className="mt-4 grid gap-2">
          <FilterLink href="/products?featured=true" active={activeFeatured}>
            Featured
          </FilterLink>

          <FilterLink
            href="/products?sort=best-selling"
            active={activeSort === "best-selling"}
          >
            Best sellers
          </FilterLink>
        </div>
      </div>
    </aside>
  );
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