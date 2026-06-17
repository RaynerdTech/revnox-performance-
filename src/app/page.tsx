// This file renders the Revnox Performance homepage using Shopify-powered category, brand, featured, and best-selling product data.
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  Truck,
  Wrench,
  Zap,
} from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/ui/container";
import { Marquee } from "@/components/ui/marquee";
import { buttonVariants } from "@/components/ui/button";
import { ProductGrid } from "@/components/product/product-grid";
import { ProductCarousel } from "@/components/product/product-carousel";
import { HomeCategoryShowcase } from "@/components/home/home-category-showcase";
import { getHomepageCatalog } from "@/lib/commerce/catalog";
import { getBrands, type ProductBrand } from "@/lib/commerce/brands";
import { cn } from "@/lib/utils/cn";

const trustSignals = [
  {
    title: "Premium brands",
    description: "Curated performance parts for uncompromising builds.",
    icon: ShieldCheck,
  },
  {
    title: "Expert support",
    description: "Real automotive support for informed product decisions.",
    icon: Wrench,
  },
  {
    title: "Fast shipping",
    description: "Orders ship with speed and reliable handling.",
    icon: Truck,
  },
  {
    title: "Hassle-free returns",
    description: "Simple returns on eligible parts and accessories.",
    icon: Zap,
  },
];

const shopWays = [
  {
    title: "Shop by category",
    description: "Browse braking, suspension, exhaust, intake, wheels, and more.",
    href: "/products",
  },
  {
    title: "Shop by brand",
    description: "Find products from connected parts manufacturers.",
    href: "/brands",
  },
  {
    title: "Search by part",
    description: "Use product names, SKUs, brands, and common automotive terms.",
    href: "/products",
  },
];

const buildPaths = [
  {
    title: "Stop better",
    description:
      "Start with braking upgrades for stronger, more confident control.",
    href: "/products?q=brake",
  },
  {
    title: "Improve handling",
    description:
      "Explore suspension parts built for sharper road feel and stability.",
    href: "/products?q=suspension",
  },
  {
    title: "Upgrade sound",
    description:
      "Browse exhaust-focused parts for a stronger performance tone.",
    href: "/products?q=exhaust",
  },
  {
    title: "Improve airflow",
    description:
      "Find intake and engine airflow upgrades for better response.",
    href: "/products?q=intake",
  },
];

export default async function Home() {
  const [homepageCatalog, brands] = await Promise.all([
    getHomepageCatalog(),
    getBrands(),
  ]);

  const {
    categories,
    featuredProducts,
    bestSellingProducts,
    categoryProductSections,
  } = homepageCatalog;

  return (
    <main className="revnox-home min-h-screen bg-background text-foreground">
      <section className="border-b border-border bg-secondary text-secondary-foreground">
        <Container className="revnox-announcement flex items-center justify-center py-2 text-center">
          Premium performance parts for serious builds
        </Container>
      </section>

      <Header />

      <Marquee />

      <section className="relative overflow-hidden border-b border-border bg-background">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[560px] overflow-hidden lg:h-[640px]">
          <img
            src="/practiceimage.png"
            alt="Performance car hero image"
            className="absolute inset-y-0 -right-[48%] h-full w-[128%] max-w-none object-cover object-right opacity-90 sm:right-0 sm:w-[88%] lg:w-[74%]"
            style={{
              WebkitMaskImage:
                "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.22) 12%, black 32%)",
              maskImage:
                "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.22) 12%, black 32%)",
            }}
          />

          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/55 to-transparent sm:via-background/78" />

          <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-background/5 to-transparent sm:w-24 sm:from-background/10" />
        </div>

        <Container className="relative">
          <div className="relative min-h-[560px] overflow-hidden lg:min-h-[640px]">
            <div className="relative z-10 flex min-h-[560px] max-w-[720px] flex-col justify-center py-12 lg:min-h-[640px]">
              <h1 className="revnox-display max-w-[12ch] text-[clamp(2.75rem,12vw,4rem)] text-foreground sm:text-6xl lg:text-7xl xl:text-[5.5rem]">
                Engineered
                <br />
                for <span className="text-primary">more</span>
              </h1>

              <p className="mt-7 w-[300px] px-3 py-2 text-[18px] font-medium leading-8 text-foreground sm:w-auto sm:max-w-lg sm:bg-transparent sm:px-0 sm:py-0 sm:text-muted-foreground">
                Premium performance parts for enthusiasts who demand more from
                every drive.
              </p>

              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/products"
                  className={cn(
                    buttonVariants({
                      variant: "primary",
                      size: "lg",
                    }),
                    "revnox-nav-text",
                  )}
                >
                  Shop now
                </Link>

                <Link
                  href="/brands"
                  className={cn(
                    buttonVariants({
                      variant: "outline",
                      size: "lg",
                    }),
                    "revnox-nav-text border-border bg-background/90 text-foreground shadow-[var(--shadow-card)] backdrop-blur-md hover:border-primary hover:text-primary sm:bg-transparent sm:shadow-none sm:backdrop-blur-0",
                  )}
                >
                  View brands
                </Link>
              </div>
            </div>
          </div>

          <div className="grid border-t border-border bg-background/70 backdrop-blur-sm sm:grid-cols-2 lg:grid-cols-4">
            {trustSignals.map((signal) => {
              const Icon = signal.icon;

              return (
                <div
                  key={signal.title}
                  className="flex items-center gap-4 border-b border-border px-4 py-5 last:border-b-0 sm:px-6 sm:last:border-b lg:border-b-0 lg:border-r lg:last:border-r-0"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-primary/25 bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>

                  <div>
                    <h2 className="revnox-label text-xs text-foreground">
                      {signal.title}
                    </h2>

                    <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">
                      {signal.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      <section className="border-b border-border bg-background py-14 sm:py-16">
        <Container>
          <SectionHeader
            eyebrow="Ways to shop"
            title="Start where it makes sense."
            href="/products"
            linkLabel="Open catalog"
          />

          <div className="grid gap-3 sm:grid-cols-3 sm:gap-5">
            {shopWays.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="group border border-border bg-card p-5 shadow-[var(--shadow-card)] transition-colors hover:border-primary sm:p-6"
              >
                <p className="revnox-label text-xs text-primary">
                  Shop
                </p>

                <h2 className="revnox-heading mt-3 text-xl transition-colors group-hover:text-primary sm:text-2xl">
                  {item.title}
                </h2>

                <p className="mt-3 text-sm font-medium leading-6 text-foreground/68">
                  {item.description}
                </p>

                <span className="revnox-nav-text mt-5 inline-flex items-center gap-2 text-xs text-foreground/55 transition-colors group-hover:text-primary">
                  Continue
                  <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <HomeCategoryShowcase categories={categories} />

      {brands.length > 0 ? (
        <section className="border-b border-border bg-background py-14 sm:py-16">
          <Container>
            <SectionHeader
              eyebrow="Parts brands"
              title="Shop trusted manufacturers."
              href="/brands"
              linkLabel="View all brands"
            />

            <div className="grid grid-cols-2 items-stretch gap-3 sm:gap-5 lg:grid-cols-4">
              {brands.slice(0, 8).map((brand) => (
                <BrandPreviewCard
                  key={brand.id}
                  brand={brand}
                />
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      <section className="border-b border-border bg-background py-20">
        <Container>
          <SectionHeader
            eyebrow="Featured products"
            title="Selected for serious builds."
            href="/products?featured=true"
            linkLabel="View featured"
          />

          <ProductCarousel
            products={featuredProducts}
            ariaLabel="Featured products"
          />
        </Container>
      </section>

      <section className="border-b border-border bg-background py-20">
        <Container>
          <SectionHeader
            eyebrow="Best sellers"
            title="Proven upgrade paths."
            href="/products?sort=best-selling"
            linkLabel="View best sellers"
          />

          <ProductCarousel
            products={bestSellingProducts}
            ariaLabel="Best-selling products"
          />
        </Container>
      </section>

      <section className="border-b border-border bg-background text-foreground">
        <Container className="py-16">
          <SectionHeader
            eyebrow="Goal based shopping"
            title="Shop by what you want to improve."
            href="/products"
            linkLabel="Browse all products"
          />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {buildPaths.map((build) => (
              <Link
                key={build.title}
                href={build.href}
                className="group border border-border bg-card p-6 shadow-[var(--shadow-card)] transition-colors hover:border-primary"
              >
                <p className="revnox-label text-xs text-primary">
                  Goal
                </p>

                <h3 className="revnox-heading mt-4 text-xl sm:text-2xl">
                  {build.title}
                </h3>

                <p className="mt-3 text-sm font-medium leading-6 text-muted-foreground">
                  {build.description}
                </p>

                <span className="revnox-nav-text mt-5 inline-flex items-center gap-2 text-xs text-muted-foreground transition-colors group-hover:text-primary">
                  Start here
                  <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-b border-border bg-background py-20">
        <Container className="space-y-16">
          <SectionHeader
            eyebrow="Category products"
            title="Browse by performance system."
            href="/products"
            linkLabel="Open catalog"
          />

          {categoryProductSections.map((section) => (
            <div key={section.category.id}>
              <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                  <h3 className="revnox-heading text-2xl sm:text-3xl">
                    {section.category.title}
                  </h3>

                  <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
                    {section.category.description}
                  </p>
                </div>

                <Link
                  href={`/products?category=${section.category.handle}`}
                  className="revnox-nav-text inline-flex items-center gap-2 text-xs text-muted-foreground transition-colors hover:text-primary"
                >
                  View {section.category.title}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <ProductGrid products={section.products} />
            </div>
          ))}
        </Container>
      </section>

      <Footer />
    </main>
  );
}

function BrandPreviewCard({
  brand,
}: {
  brand: ProductBrand;
}) {
  const href = `/products?${new URLSearchParams({
    brand: brand.name,
  }).toString()}`;

  return (
    <Link
      href={href}
      className="group flex min-w-0 flex-col overflow-hidden border border-border bg-card shadow-[var(--shadow-card)] transition-colors hover:border-primary"
    >
      <div className="relative flex h-20 items-center justify-center border-b border-border bg-surface sm:h-24 lg:h-28">
        {brand.logo ? (
          <Image
            src={brand.logo.url}
            alt={brand.logo.altText}
            fill
            className="object-contain p-2 sm:p-3"
            sizes="(max-width: 639px) 46vw, (max-width: 1023px) 31vw, 24vw"
          />
        ) : (
          <span className="revnox-heading flex h-12 w-12 items-center justify-center rounded-full border border-primary/25 bg-primary/10 text-sm text-primary sm:h-14 sm:w-14 sm:text-base">
            {getBrandInitials(brand.name)}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-3 sm:p-5">
        <p className="line-clamp-1 text-sm font-extrabold uppercase tracking-[-0.025em] text-foreground transition-colors group-hover:text-primary sm:text-xl">
          {brand.name}
        </p>

        <p className="revnox-label mt-2 text-xs text-foreground/55">
          {brand.productCount}{" "}
          {brand.productCount === 1 ? "product" : "products"}
        </p>
      </div>
    </Link>
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

function SectionHeader({
  eyebrow,
  title,
  href,
  linkLabel,
}: {
  eyebrow: string;
  title: string;
  href: string;
  linkLabel: string;
}) {
  return (
    <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        <p className="revnox-label text-xs text-primary">
          {eyebrow}
        </p>

        <h2 className="revnox-heading mt-3 text-3xl sm:text-5xl">
          {title}
        </h2>
      </div>

      <Link
        href={href}
        className="revnox-nav-text inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
      >
        {linkLabel}
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}