// This file renders the dynamic Shopify parts-brand directory.
import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Tags,
} from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/ui/container";
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
          Premium performance parts for
          serious builds
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
              Browse the parts manufacturers
              currently available in the
              Shopify catalog.
            </p>
          </div>
        </Container>
      </section>

      <section className="py-12 sm:py-16">
        <Container>
          {brands.length > 0 ? (
            <>
              <div className="mb-7 flex items-center justify-between gap-4">
                <p className="text-sm font-bold text-foreground/65">
                  <span className="font-black text-foreground">
                    {brands.length}
                  </span>{" "}
                  {brands.length === 1
                    ? "brand"
                    : "brands"}{" "}
                  available
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
                {brands.map((brand) => (
                  <BrandCard
                    key={brand.name}
                    name={brand.name}
                    productCount={
                      brand.productCount
                    }
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="border border-border bg-card p-10 text-center shadow-[var(--shadow-card)]">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-primary">
                No brands available
              </p>

              <h2 className="mt-3 text-3xl font-black uppercase tracking-[-0.06em]">
                Add product vendors in
                Shopify.
              </h2>

              <p className="mx-auto mt-4 max-w-md text-sm font-medium leading-6 text-foreground/70">
                Brands will appear here
                automatically when published
                Shopify products contain vendor
                information.
              </p>
            </div>
          )}
        </Container>
      </section>

      <Footer />
    </main>
  );
}

function BrandCard({
  name,
  productCount,
}: {
  name: string;
  productCount: number;
}) {
  const searchParams =
    new URLSearchParams({
      brand: name,
    });

  return (
    <Link
      href={`/products?${searchParams.toString()}`}
      className="group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-card)] transition-transform duration-200 hover:-translate-y-1 hover:border-primary sm:rounded-[1.5rem]"
    >
      <div className="flex aspect-[4/3] items-center justify-center border-b border-border bg-surface p-5">
        <span className="flex h-20 w-20 items-center justify-center rounded-full border border-primary/25 bg-primary/10 text-2xl font-black uppercase tracking-[-0.05em] text-primary sm:h-24 sm:w-24 sm:text-3xl">
          {getBrandInitials(name)}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-6">
        <p className="line-clamp-2 break-words text-base font-black uppercase leading-tight tracking-[-0.04em] sm:text-2xl">
          {name}
        </p>

        <div className="mt-auto flex items-center justify-between gap-3 pt-5">
          <p className="text-[10px] font-black uppercase tracking-[0.14em] text-foreground/55 sm:text-xs sm:tracking-[0.18em]">
            {productCount}{" "}
            {productCount === 1
              ? "product"
              : "products"}
          </p>

          <ArrowRight className="h-4 w-4 shrink-0 text-primary transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}

function getBrandInitials(
  name: string,
) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}