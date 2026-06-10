// This file renders the dynamic Shopify Brand Profile directory.
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ExternalLink,
  Tags,
} from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/ui/container";
import type { ProductBrand } from "@/lib/commerce/brands";
import { getBrands } from "@/lib/commerce/brands";

export const metadata: Metadata = {
  title: "Shop Parts Brands",
  description:
    "Browse performance parts by manufacturer at Revnox Performance.",
};

export default async function BrandsPage() {
  const brands = await getBrands();

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="border-b border-border bg-secondary text-secondary-foreground">
        <Container className="flex items-center justify-center py-2 text-center text-[10px] font-semibold uppercase tracking-[0.24em]">
          Premium performance parts for serious builds
        </Container>
      </section>

      <Header />

      <section className="relative overflow-hidden border-b border-border bg-background">
        <div className="pointer-events-none absolute inset-0 revnox-grid-bg opacity-20" />

        <div className="pointer-events-none absolute left-0 top-0 h-full w-1/2 bg-gradient-to-r from-primary/10 via-transparent to-transparent" />

        <Container className="relative py-14 sm:py-20">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-full border border-primary/25 bg-primary/10 text-primary">
                <Tags className="h-5 w-5" />
              </span>

              <p className="text-sm font-black uppercase tracking-[0.24em] text-primary">
                Parts brands
              </p>
            </div>

            <h1 className="mt-6 text-5xl font-black uppercase leading-[0.9] tracking-[-0.07em] sm:text-7xl">
              Shop by manufacturer.
            </h1>

            <p className="mt-6 max-w-2xl text-base font-medium leading-8 text-foreground/72">
              Browse active manufacturers connected directly to products in the
              Shopify catalog.
            </p>
          </div>
        </Container>
      </section>

      <section className="py-10 sm:py-14">
        <Container>
          {brands.length > 0 ? (
            <>
              <div className="mb-6 flex items-center justify-between gap-4">
                <p className="text-sm font-bold text-foreground/65">
                  <span className="font-black text-foreground">
                    {brands.length}
                  </span>{" "}
                  {brands.length === 1 ? "brand" : "brands"} available
                </p>
              </div>

              <div className="grid grid-cols-2 items-stretch gap-3 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
                {brands.map((brand) => (
                  <BrandCard
                    key={brand.id}
                    brand={brand}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="border border-border bg-card p-8 text-center shadow-[var(--shadow-card)] sm:p-10">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-primary">
                No active brands available
              </p>

              <h2 className="mt-3 text-3xl font-black uppercase tracking-[-0.06em]">
                Connect Brand Profiles to products.
              </h2>
            </div>
          )}
        </Container>
      </section>

      <Footer />
    </main>
  );
}

function BrandCard({
  brand,
}: {
  brand: ProductBrand;
}) {
  const productsHref = `/products?${new URLSearchParams({
    brand: brand.name,
  }).toString()}`;

  return (
    <article className="group flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-card)] transition-transform duration-200 hover:-translate-y-1 hover:border-primary sm:rounded-[1.5rem]">
      <Link
        href={productsHref}
        className="relative flex h-20 w-full shrink-0 items-center justify-center overflow-hidden border-b border-border bg-surface sm:h-24 lg:h-28"
        aria-label={`Browse ${brand.name} products`}
      >
        {brand.logo ? (
          <Image
            src={brand.logo.url}
            alt={brand.logo.altText}
            fill
            className="object-contain p-2 sm:p-3"
            sizes="(max-width: 639px) 46vw, (max-width: 1023px) 31vw, 24vw"
          />
        ) : (
          <span className="flex h-12 w-12 items-center justify-center rounded-full border border-primary/25 bg-primary/10 text-base font-black uppercase tracking-[-0.04em] text-primary sm:h-14 sm:w-14 sm:text-lg">
            {getBrandInitials(brand.name)}
          </span>
        )}
      </Link>

      <div className="flex min-w-0 flex-1 flex-col p-3 sm:p-5">
        <Link
          href={productsHref}
          className="min-w-0"
        >
          <h2 className="line-clamp-2 break-words text-sm font-black uppercase leading-tight tracking-[-0.04em] transition-colors hover:text-primary sm:text-xl">
            {brand.name}
          </h2>
        </Link>

        {brand.description ? (
          <p className="mt-2 line-clamp-3 text-xs font-medium leading-5 text-foreground/68 sm:text-sm sm:leading-6">
            {brand.description}
          </p>
        ) : null}

        <p className="mt-3 text-[9px] font-black uppercase tracking-[0.12em] text-foreground/55 sm:text-xs sm:tracking-[0.18em]">
          {brand.productCount}{" "}
          {brand.productCount === 1 ? "product" : "products"}
        </p>

        <div className="mt-auto grid gap-2 pt-4">
          <Link
            href={productsHref}
            className="inline-flex min-h-10 items-center justify-between gap-2 border border-border px-3 py-2.5 text-[9px] font-black uppercase tracking-[0.1em] text-foreground transition-colors hover:border-primary hover:text-primary sm:min-h-11 sm:px-4 sm:text-xs sm:tracking-[0.14em]"
          >
            <span className="truncate">
              View products
            </span>

            <ArrowRight className="h-4 w-4 shrink-0" />
          </Link>

          {brand.website ? (
            <a
              href={brand.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-10 items-center justify-between gap-2 border border-border px-3 py-2.5 text-[9px] font-black uppercase tracking-[0.1em] text-foreground/65 transition-colors hover:border-primary hover:text-primary sm:min-h-11 sm:px-4 sm:text-xs sm:tracking-[0.14em]"
            >
              <span className="truncate">
                Official website
              </span>

              <ExternalLink className="h-4 w-4 shrink-0" />
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}

function getBrandInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase();
}