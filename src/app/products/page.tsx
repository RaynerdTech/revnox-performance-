// This file renders the Shopify-powered product catalog page with search, brand filtering, category filtering, availability, merchandising, and sorting.
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/ui/container";
import { ProductGrid } from "@/components/product/product-grid";
import { CatalogSidebar } from "@/components/product/catalog-sidebar";
import {
  getCategories,
  getProducts,
} from "@/lib/commerce/catalog";
import { buildProductBrands } from "@/lib/commerce/brands";
import type { Product } from "@/lib/commerce/types";
import { MobileCatalogFilter } from "@/components/product/mobile-catalog-filter";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

type CatalogSort =
  | "price-asc"
  | "price-desc";

type ProductsPageProps = {
  searchParams: Promise<{
    q?: string;
    category?: string;
    brand?: string;
    featured?: string;
    bestSeller?: string;
    available?: string;
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

  const activeSearch =
    params.q?.trim() || "";

  const activeCategory =
    params.category;

  const requestedBrand =
    params.brand?.trim() || "";

  const activeFeatured =
    params.featured === "true";

  const activeAvailable =
    params.available === "true";

  const activeBestSeller =
    params.bestSeller === "true" ||
    params.sort === "best-selling";

  const activeSort =
    getCatalogSort(params.sort);

  const [categories, products] =
    await Promise.all([
      getCategories(),
      getProducts(),
    ]);

  const brands =
    buildProductBrands(products);

  const activeCategoryData =
    categories.find(
      (category) =>
        category.handle ===
        activeCategory,
    ) ?? null;

  const activeBrandData =
    brands.find(
      (brand) =>
        normalizeValue(brand.name) ===
        normalizeValue(requestedBrand),
    ) ?? null;

  const activeBrand =
    activeBrandData?.name ??
    requestedBrand;

  const filteredProducts =
    filterProducts(products, {
      activeSearch,
      activeCategory,
      activeBrand,
      activeFeatured,
      activeBestSeller,
      activeAvailable,
      activeSort,
    });

  const pageTitle = getPageTitle({
    activeSearch,
    activeCategoryTitle:
      activeCategoryData?.title ?? null,
    activeBrandName:
      activeBrandData?.name ?? null,
    activeFeatured,
    activeBestSeller,
  });

  const pageDescription =
    getPageDescription({
      activeSearch,
      activeCategoryTitle:
        activeCategoryData?.title ?? null,
      activeCategoryDescription:
        activeCategoryData?.description ??
        "",
      activeBrandName:
        activeBrandData?.name ?? null,
    });

  const hasCategoryImage = Boolean(
    activeCategoryData?.image?.url,
  );

  const hasActiveFilters = Boolean(
    activeSearch ||
      activeCategory ||
      activeBrand ||
      activeFeatured ||
      activeBestSeller ||
      activeAvailable ||
      activeSort,
  );

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="border-b border-border bg-secondary text-secondary-foreground">
        <Container className="flex items-center justify-center py-2 text-center text-[10px] font-semibold uppercase tracking-[0.24em]">
          Premium performance parts for
          serious builds
        </Container>
      </section>

      <Header />

      <section className="relative overflow-hidden border-b border-border bg-background">
        <div className="pointer-events-none absolute inset-0 revnox-grid-bg opacity-20" />

        <div className="pointer-events-none absolute left-0 top-0 h-full w-1/2 bg-gradient-to-r from-primary/10 via-transparent to-transparent" />

        <Container className="relative py-14 sm:py-18">
          <div
            className={cn(
              "grid gap-8",
              hasCategoryImage &&
                "lg:grid-cols-[1fr_440px] lg:items-center",
            )}
          >
            <div className="max-w-3xl">
              <p className="text-sm font-black uppercase tracking-[0.24em] text-primary">
                Product catalog
              </p>

              <h1 className="mt-4 text-5xl font-black uppercase leading-[0.9] tracking-[-0.07em] text-foreground sm:text-7xl">
                {pageTitle}
              </h1>

              {pageDescription ? (
                <p className="mt-6 max-w-2xl text-base font-medium leading-8 text-foreground/75">
                  {pageDescription}
                </p>
              ) : null}

              <form
                action="/products"
                className="mt-8 w-full max-w-2xl"
              >
                <div className="grid w-full gap-3 border border-border bg-card px-4 py-3 shadow-[var(--shadow-card)] sm:grid-cols-[1fr_auto] sm:items-center">
                  <div className="flex min-w-0 items-center gap-3">
                    <Search className="h-5 w-5 shrink-0 text-primary" />

                    <input
                      type="search"
                      name="q"
                      defaultValue={
                        activeSearch
                      }
                      placeholder="Search products..."
                      className="h-11 min-w-0 flex-1 bg-transparent text-base font-bold text-foreground outline-none placeholder:text-foreground/45"
                    />
                  </div>

                  {activeCategory ? (
                    <input
                      type="hidden"
                      name="category"
                      value={
                        activeCategory
                      }
                    />
                  ) : null}

                  {activeBrand ? (
                    <input
                      type="hidden"
                      name="brand"
                      value={activeBrand}
                    />
                  ) : null}

                  {activeFeatured ? (
                    <input
                      type="hidden"
                      name="featured"
                      value="true"
                    />
                  ) : null}

                  {activeBestSeller ? (
                    <input
                      type="hidden"
                      name="bestSeller"
                      value="true"
                    />
                  ) : null}

                  {activeAvailable ? (
                    <input
                      type="hidden"
                      name="available"
                      value="true"
                    />
                  ) : null}

                  {activeSort ? (
                    <input
                      type="hidden"
                      name="sort"
                      value={activeSort}
                    />
                  ) : null}

                  <button
                    type="submit"
                    className={cn(
                      buttonVariants({
                        variant: "primary",
                        size: "md",
                      }),
                      "w-full sm:w-auto",
                    )}
                  >
                    Search
                  </button>
                </div>
              </form>

              {hasActiveFilters ? (
                <div className="mt-8 grid w-full gap-3 sm:flex sm:flex-wrap sm:items-center">
                  {activeCategoryData ? (
                    <FilterSummary
                      label="Category products"
                      value={
                        activeCategoryData.productCount
                      }
                    />
                  ) : null}

                  {activeBrandData ? (
                    <FilterSummary
                      label="Brand products"
                      value={
                        activeBrandData.productCount
                      }
                    />
                  ) : null}

                  <Link
                    href="/products"
                    className="inline-flex h-12 w-full items-center justify-center gap-2 border border-border bg-background px-5 text-xs font-black uppercase tracking-[0.18em] text-foreground/70 transition-colors hover:border-primary hover:text-primary sm:w-auto"
                  >
                    Clear filters

                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              ) : null}
            </div>

            {activeCategoryData?.image ? (
              <div className="relative min-h-[260px] overflow-hidden border border-border bg-card shadow-[var(--shadow-soft)] sm:min-h-[340px] lg:min-h-[360px]">
                <Image
                  src={
                    activeCategoryData.image
                      .url
                  }
                  alt={
                    activeCategoryData.image
                      .altText ||
                    activeCategoryData.title
                  }
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 440px"
                />

                <div className="absolute inset-0 bg-gradient-to-r from-background/70 via-background/15 to-transparent lg:bg-gradient-to-t lg:from-background/75 lg:via-transparent lg:to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 border-t border-border bg-background/85 p-5 backdrop-blur-md">
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-primary">
                    {
                      activeCategoryData.productCount
                    }{" "}
                    products
                  </p>

                  <h2 className="mt-2 text-2xl font-black uppercase leading-none tracking-[-0.05em] text-foreground">
                    {
                      activeCategoryData.title
                    }
                  </h2>
                </div>
              </div>
            ) : null}
          </div>
        </Container>
      </section>

      <section className="border-b border-border bg-card">
        <Container className="flex flex-col gap-4 py-5 lg:flex-row lg:items-center lg:justify-between">
          <p className="text-sm font-bold text-foreground/70">
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

          <div className="flex w-fit items-center gap-2 border border-border bg-background px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-foreground/65 lg:hidden">
            <SlidersHorizontal className="h-4 w-4 text-primary" />

            Tap the filter button
          </div>

          <div className="hidden items-center gap-2 border border-border bg-background px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-foreground/65 lg:flex">
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
                brands={brands}
                activeSearch={
                  activeSearch
                }
                activeCategory={
                  activeCategory
                }
                activeBrand={activeBrand}
                activeFeatured={
                  activeFeatured
                }
                activeBestSeller={
                  activeBestSeller
                }
                activeAvailable={
                  activeAvailable
                }
                activeSort={activeSort}
              />
            </div>

            <div>
              {filteredProducts.length >
              0 ? (
                <ProductGrid
                  products={
                    filteredProducts
                  }
                />
              ) : (
                <EmptyCatalogState
                  activeSearch={
                    activeSearch
                  }
                />
              )}
            </div>
          </div>
        </Container>
      </section>

      <MobileCatalogFilter
        categories={categories}
        brands={brands}
        activeSearch={activeSearch}
        activeCategory={activeCategory}
        activeBrand={activeBrand}
        activeFeatured={activeFeatured}
        activeBestSeller={
          activeBestSeller
        }
        activeAvailable={activeAvailable}
        activeSort={activeSort}
      />

      <Footer />
    </main>
  );
}

function normalizeValue(
  value: string,
) {
  return value.trim().toLowerCase();
}

function getCatalogSort(
  sort?: string,
): CatalogSort | undefined {
  if (
    sort === "price-asc" ||
    sort === "price-desc"
  ) {
    return sort;
  }

  return undefined;
}

function filterProducts(
  products: Product[],
  filters: {
    activeSearch?: string;
    activeCategory?: string;
    activeBrand?: string;
    activeFeatured?: boolean;
    activeBestSeller?: boolean;
    activeAvailable?: boolean;
    activeSort?: CatalogSort;
  },
) {
  let filteredProducts = [...products];

  if (filters.activeSearch) {
    filteredProducts =
      filteredProducts.filter((product) =>
        productMatchesSearch(
          product,
          filters.activeSearch ?? "",
        ),
      );
  }

  if (filters.activeCategory) {
    filteredProducts =
      filteredProducts.filter(
        (product) =>
          product.categoryHandle ===
          filters.activeCategory,
      );
  }

  if (filters.activeBrand) {
    const normalizedBrand =
      normalizeValue(
        filters.activeBrand,
      );

    filteredProducts =
      filteredProducts.filter(
        (product) =>
          normalizeValue(
            product.brand ?? "",
          ) === normalizedBrand,
      );
  }

  if (filters.activeFeatured) {
    filteredProducts =
      filteredProducts.filter(
        (product) =>
          product.isFeatured,
      );
  }

  if (filters.activeBestSeller) {
    filteredProducts =
      filteredProducts.filter(
        (product) =>
          product.isBestSeller,
      );
  }

  if (filters.activeAvailable) {
    filteredProducts =
      filteredProducts.filter(
        (product) =>
          product.availableForSale,
      );
  }

  if (
    filters.activeSort === "price-asc"
  ) {
    filteredProducts.sort(
      (firstProduct, secondProduct) =>
        firstProduct.price -
        secondProduct.price,
    );
  }

  if (
    filters.activeSort === "price-desc"
  ) {
    filteredProducts.sort(
      (firstProduct, secondProduct) =>
        secondProduct.price -
        firstProduct.price,
    );
  }

  return filteredProducts;
}

function productMatchesSearch(
  product: Product,
  query: string,
) {
  const terms = query
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);

  if (terms.length === 0) {
    return true;
  }

  const searchableText = [
    product.title,
    product.description,
    product.category,
    product.categoryHandle,
    product.brand,
    product.tags.join(" "),
    product.variants
      .map(
        (variant) =>
          `${variant.title} ${
            variant.sku ?? ""
          }`,
      )
      .join(" "),
  ]
    .join(" ")
    .toLowerCase();

  return terms.every((term) =>
    searchableText.includes(term),
  );
}

function getPageTitle({
  activeSearch,
  activeCategoryTitle,
  activeBrandName,
  activeFeatured,
  activeBestSeller,
}: {
  activeSearch: string;
  activeCategoryTitle: string | null;
  activeBrandName: string | null;
  activeFeatured: boolean;
  activeBestSeller: boolean;
}) {
  if (activeSearch) {
    return "Search results";
  }

  if (
    activeBrandName &&
    activeCategoryTitle
  ) {
    return `${activeBrandName} ${activeCategoryTitle}`;
  }

  if (activeBrandName) {
    return activeBrandName;
  }

  if (activeCategoryTitle) {
    return activeCategoryTitle;
  }

  if (activeFeatured) {
    return "Featured products";
  }

  if (activeBestSeller) {
    return "Best sellers";
  }

  return "Shop performance";
}

function getPageDescription({
  activeSearch,
  activeCategoryTitle,
  activeCategoryDescription,
  activeBrandName,
}: {
  activeSearch: string;
  activeCategoryTitle: string | null;
  activeCategoryDescription: string;
  activeBrandName: string | null;
}) {
  if (activeSearch) {
    return `Showing catalog results for “${activeSearch}”.`;
  }

  if (
    activeBrandName &&
    activeCategoryTitle
  ) {
    return `Browse ${activeBrandName} products in the ${activeCategoryTitle} category.`;
  }

  if (activeBrandName) {
    return `Browse published ${activeBrandName} products currently available in the storefront catalog.`;
  }

  if (activeCategoryDescription) {
    return activeCategoryDescription;
  }

  return "Browse Shopify-powered performance parts organized for wheels, braking, suspension, exhaust, intake, and engine-focused upgrades.";
}

function FilterSummary({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="w-full border border-border bg-card px-4 py-3 shadow-[var(--shadow-card)] sm:w-auto">
      <p className="text-[11px] font-black uppercase tracking-[0.2em] text-foreground/60">
        {label}
      </p>

      <p className="mt-1 text-2xl font-black tracking-[-0.05em] text-foreground">
        {value}
      </p>
    </div>
  );
}

function EmptyCatalogState({
  activeSearch,
}: {
  activeSearch: string;
}) {
  return (
    <div className="border border-border bg-card p-10 text-center shadow-[var(--shadow-card)]">
      <p className="text-xs font-black uppercase tracking-[0.22em] text-primary">
        No products found
      </p>

      <h2 className="mt-3 text-3xl font-black uppercase tracking-[-0.06em] text-foreground">
        Try another catalog filter.
      </h2>

      <p className="mx-auto mt-4 max-w-md text-sm font-medium leading-6 text-foreground/70">
        {activeSearch
          ? `No published storefront products matched “${activeSearch}”.`
          : "This filter does not currently match any published Shopify products in the storefront catalog."}
      </p>

      <Link
        href="/products"
        className={cn(
          buttonVariants({
            variant: "primary",
            size: "lg",
          }),
          "mt-7",
        )}
      >
        View all products
      </Link>
    </div>
  );
}