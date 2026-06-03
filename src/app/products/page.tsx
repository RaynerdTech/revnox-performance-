// This file renders the Shopify-powered product catalog page with server-side category and merchandising filters.
import Link from "next/link";
import { SlidersHorizontal } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/ui/container";
import { ProductGrid } from "@/components/product/product-grid";
import { CatalogSidebar } from "@/components/product/catalog-sidebar";
import { getCategories, getProducts } from "@/lib/commerce/catalog";
import type { Product } from "@/lib/commerce/types";
import { cn } from "@/lib/utils/cn";
import { MobileCatalogFilter } from "@/components/product/mobile-catalog-filter";

type ProductsPageProps = {
  searchParams: Promise<{
    category?: string;
    featured?: string;
    sort?: string;
  }>;
};

export const metadata = {
  title: "Shop Performance Parts",
  description:
    "Browse premium wheels, braking, suspension, exhaust, intake, and engine upgrades from Revnox Performance.",
};

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const params = await searchParams;

  const activeCategory = params.category;
  const activeFeatured = params.featured === "true";
  const activeSort = params.sort;

  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts(),
  ]);

  const filteredProducts = filterProducts(products, {
    activeCategory,
    activeFeatured,
    activeSort,
  });

  const activeCategoryTitle =
    categories.find((category) => category.handle === activeCategory)?.title ??
    null;

  const pageTitle = getPageTitle({
    activeCategoryTitle,
    activeFeatured,
    activeSort,
  });

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="border-b border-border bg-secondary text-secondary-foreground">
        <Container className="flex items-center justify-center py-2 text-center text-[10px] font-semibold uppercase tracking-[0.24em]">
          Premium performance parts for serious builds
        </Container>
      </section>

      <Header />

      <section className="revnox-grid-bg revnox-radial border-b border-border">
        <Container className="py-16 sm:py-20">
          <div className="max-w-3xl">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-primary">
              Product catalog
            </p>
            <h1 className="mt-4 text-5xl font-black uppercase leading-[0.9] tracking-[-0.07em] sm:text-7xl">
              {pageTitle}
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-muted-foreground">
              Browse Shopify-powered performance parts organized for wheels,
              braking, suspension, exhaust, intake, and engine-focused upgrades.
            </p>
          </div>
        </Container>
      </section>

      <section className="border-b border-border bg-card">
        <Container className="flex flex-col gap-4 py-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-bold text-muted-foreground">
              Showing{" "}
              <span className="font-black text-foreground">
                {filteredProducts.length}
              </span>{" "}
              of{" "}
              <span className="font-black text-foreground">
                {products.length}
              </span>{" "}
              products
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-muted-foreground lg:hidden">
            <SlidersHorizontal className="h-4 w-4 text-primary" />
            Tap the filter button
          </div>

          <div className="hidden items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-muted-foreground lg:flex">
            <SlidersHorizontal className="h-4 w-4 text-primary" />
            Server-rendered Shopify catalog
          </div>
        </Container>
      </section>

      <section className="py-12 sm:py-16">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
            <div className="hidden lg:block">
              <CatalogSidebar
                categories={categories}
                activeCategory={activeCategory}
                activeFeatured={activeFeatured}
                activeSort={activeSort}
              />
            </div>

            <div>
              {filteredProducts.length > 0 ? (
                <ProductGrid products={filteredProducts} />
              ) : (
                <EmptyCatalogState />
              )}
            </div>
          </div>
        </Container>
      </section>

      <MobileCatalogFilter
        categories={categories}
        activeCategory={activeCategory}
        activeFeatured={activeFeatured}
        activeSort={activeSort}
      />

      <Footer />
    </main>
  );
}

function filterProducts(
  products: Product[],
  filters: {
    activeCategory?: string;
    activeFeatured?: boolean;
    activeSort?: string;
  },
) {
  let filteredProducts = [...products];

  if (filters.activeCategory) {
    filteredProducts = filteredProducts.filter(
      (product) => product.categoryHandle === filters.activeCategory,
    );
  }

  if (filters.activeFeatured) {
    filteredProducts = filteredProducts.filter((product) => product.isFeatured);
  }

  if (filters.activeSort === "best-selling") {
    filteredProducts = filteredProducts.filter(
      (product) => product.isBestSeller,
    );
  }

  return filteredProducts;
}

function getPageTitle({
  activeCategoryTitle,
  activeFeatured,
  activeSort,
}: {
  activeCategoryTitle: string | null;
  activeFeatured: boolean;
  activeSort?: string;
}) {
  if (activeCategoryTitle) return activeCategoryTitle;
  if (activeFeatured) return "Featured products";
  if (activeSort === "best-selling") return "Best sellers";

  return "Shop performance";
}

function MobileFilterChip({
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
        "rounded-full border border-border bg-background px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:border-primary hover:text-primary",
        active &&
          "border-primary bg-primary text-primary-foreground hover:text-primary-foreground",
      )}
    >
      {children}
    </Link>
  );
}

function EmptyCatalogState() {
  return (
    <div className="rounded-[1.5rem] border border-border bg-card p-10 text-center shadow-[var(--shadow-card)]">
      <p className="text-xs font-black uppercase tracking-[0.22em] text-primary">
        No products found
      </p>
      <h2 className="mt-3 text-3xl font-black uppercase tracking-[-0.06em]">
        Try another catalog filter.
      </h2>
      <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-muted-foreground">
        This filter does not currently match any published Shopify products in
        the storefront catalog.
      </p>
      <Link
        href="/products"
        className="mt-7 inline-flex rounded-full bg-primary px-6 py-3 text-xs font-black uppercase tracking-[0.18em] text-primary-foreground"
      >
        View all products
      </Link>
    </div>
  );
}
