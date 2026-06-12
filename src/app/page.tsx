// This file renders the Revnox Performance homepage using Shopify-powered category, brand, featured, and best-selling product data.
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Truck, Wrench, Zap } from "lucide-react";
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
    description:
      "Browse braking, suspension, exhaust, intake, wheels, and more.",
    href: "/products",
  },
  {
    title: "Shop by brand",
    description: "Find products from connected parts manufacturers.",
    href: "/brands",
  },
  {
    title: "Search by part",
    description:
      "Use product names, SKUs, brands, and common automotive terms.",
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
    description: "Find intake and engine airflow upgrades for better response.",
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
    <main className="min-h-screen bg-background text-foreground">
      <section className="border-b border-border bg-secondary text-secondary-foreground">
        <Container className="flex items-center justify-center py-2 text-center text-[11px] font-semibold uppercase tracking-[0.24em]">
          Premium performance parts for serious builds
        </Container>
      </section>

      <Header />

      <Marquee />

      <section className="relative overflow-hidden border-b border-border bg-background">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[560px] overflow-hidden lg:h-[640px]">
          <img
            src="/car-parts.png"
            alt="Performance car hero image"
            className="absolute inset-y-0 right-[-1px] h-full w-[112%] object-cover object-right opacity-90 sm:w-[82%] lg:w-[74%]"
            style={{
              WebkitMaskImage:
                "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.25) 14%, black 34%)",
              maskImage:
                "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.25) 14%, black 34%)",
            }}
          />

          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/78 to-transparent" />
          <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background/10 to-transparent" />
        </div>

        <Container className="relative">
          <div className="relative min-h-[560px] overflow-hidden lg:min-h-[640px]">
            <div className="relative z-10 flex min-h-[560px] max-w-[720px] flex-col justify-center py-12 lg:min-h-[640px]">
              <h1 className="text-6xl font-black uppercase leading-[0.82] tracking-[-0.08em] text-foreground sm:text-7xl lg:text-8xl xl:text-[8.5rem]">
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
                    buttonVariants({ variant: "primary", size: "lg" }),
                  )}
                >
                  Shop now
                </Link>

                <Link
                  href="/brands"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "lg" }),
                    "border-border bg-background/90 text-foreground shadow-[var(--shadow-card)] backdrop-blur-md hover:border-primary hover:text-primary sm:bg-transparent sm:shadow-none sm:backdrop-blur-0",
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
                    <h2 className="text-xs font-black uppercase tracking-[0.16em] text-foreground">
                      {signal.title}
                    </h2>

                    <p className="mt-1 line-clamp-2 text-sm leading-5 text-muted-foreground">
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
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                  Shop
                </p>

                <h2 className="mt-3 text-2xl font-black uppercase leading-none tracking-[-0.05em] transition-colors group-hover:text-primary">
                  {item.title}
                </h2>

                <p className="mt-3 text-sm font-medium leading-6 text-foreground/68">
                  {item.description}
                </p>

                <span className="mt-5 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-foreground/55 transition-colors group-hover:text-primary">
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
                <BrandPreviewCard key={brand.id} brand={brand} />
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      <section className="border-y border-border bg-surface py-20">
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

      <section className="py-20">
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

      <section className="border-y border-border bg-footer text-footer-foreground">
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
                className="group rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-6 shadow-[var(--shadow-card)] transition-colors hover:border-primary"
              >
                <p className="text-[10px] font-black uppercase tracking-[0.24em] text-primary">
                  Goal
                </p>

                <h3 className="mt-4 text-2xl font-black uppercase tracking-[-0.04em]">
                  {build.title}
                </h3>

                <p className="mt-3 text-sm font-medium leading-6 text-footer-muted">
                  {build.description}
                </p>

                <span className="mt-5 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-footer-muted transition-colors group-hover:text-primary">
                  Start here
                  <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-y border-border bg-surface py-20">
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
                  <h3 className="text-3xl font-black uppercase tracking-[-0.06em]">
                    {section.category.title}
                  </h3>

                  <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
                    {section.category.description}
                  </p>
                </div>

                <Link
                  href={`/products?category=${section.category.handle}`}
                  className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-primary"
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

function BrandPreviewCard({ brand }: { brand: ProductBrand }) {
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
          <span className="flex h-12 w-12 items-center justify-center rounded-full border border-primary/25 bg-primary/10 text-base font-black uppercase tracking-[-0.04em] text-primary sm:h-14 sm:w-14 sm:text-lg">
            {getBrandInitials(brand.name)}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-3 sm:p-5">
        <p className="line-clamp-1 text-sm font-black uppercase tracking-[-0.03em] text-foreground transition-colors group-hover:text-primary sm:text-xl">
          {brand.name}
        </p>

        <p className="mt-2 text-[10px] font-black uppercase tracking-[0.14em] text-foreground/55 sm:text-xs">
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
        <p className="text-xs font-black uppercase tracking-[0.22em] text-primary">
          {eyebrow}
        </p>

        <h2 className="mt-3 text-4xl font-black uppercase tracking-[-0.06em] sm:text-5xl">
          {title}
        </h2>
      </div>

      <Link
        href={href}
        className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-primary"
      >
        {linkLabel}
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
