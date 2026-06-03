// This file renders the Revnox Performance homepage using Shopify-powered category, featured, and best-selling product data.
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
import { getHomepageCatalog } from "@/lib/commerce/catalog";
import { cn } from "@/lib/utils/cn";
import { ProductCarousel } from "@/components/product/product-carousel";
import { HomeCategoryShowcase } from "@/components/home/home-category-showcase";

const trustSignals = [
  {
    title: "Premium brands",
    description: "Curated performance parts for uncompromising builds.",
    icon: ShieldCheck,
  },
  {
    title: "Expert support",
    description: "Real automotive support. Real fitment confidence.",
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

const buildPaths = [
  {
    title: "Street Performance",
    description:
      "Daily-ready upgrades with sharper response, cleaner fitment, and durable component choices.",
  },
  {
    title: "Track Intent",
    description:
      "Focused parts for braking confidence, wheel control, airflow, and repeatable performance.",
  },
  {
    title: "Luxury OEM+",
    description:
      "Refined upgrades that preserve a clean factory feel while improving presence and capability.",
  },
];

export default async function Home() {
  const {
    categories,
    featuredProducts,
    bestSellingProducts,
    categoryProductSections,
  } = await getHomepageCatalog();

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="border-b border-border bg-secondary text-secondary-foreground">
        <Container className="flex items-center justify-center py-2 text-center text-[10px] font-semibold uppercase tracking-[0.24em]">
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
                  className={cn(buttonVariants({ variant: "primary", size: "lg" }))}
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

          <div className="grid border-t border-border bg-background/85 backdrop-blur-md sm:grid-cols-2 lg:grid-cols-4">
            {trustSignals.map((signal) => {
              const Icon = signal.icon;

              return (
                <div
                  key={signal.title}
                  className="flex items-center gap-5 border-b border-border px-5 py-6 last:border-b-0 sm:px-7 sm:py-7 sm:last:border-b lg:border-b-0 lg:border-r lg:last:border-r-0"
                >
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-primary sm:h-15 sm:w-15">
                    <Icon className="h-6 w-6" />
                  </div>

                  <div>
                    <h2 className="text-sm font-black uppercase leading-tight tracking-[0.16em] text-foreground">
                      {signal.title}
                    </h2>
                    <p className="mt-2 line-clamp-2 text-sm font-medium leading-6 text-foreground/75">
                      {signal.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      <HomeCategoryShowcase categories={categories} />

      <section className="border-y border-border bg-surface py-20">
        <Container>
          <SectionHeader
            eyebrow="Featured products"
            title="Selected for serious builds."
            href="/products?featured=true"
            linkLabel="View featured"
          />

          <ProductCarousel products={featuredProducts} ariaLabel="Featured products" />
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

          <ProductCarousel products={bestSellingProducts} ariaLabel="Best-selling products" />
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
                  <h3 className="text-3xl font-black uppercase tracking-[-0.06em] text-foreground">
                    {section.category.title}
                  </h3>
                  <p className="mt-3 max-w-xl text-base font-medium leading-7 text-foreground/75">
                    {section.category.description}
                  </p>
                </div>

                <Link
                  href={`/products?category=${section.category.handle}`}
                  className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.18em] text-foreground/70 transition-colors hover:text-primary"
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

      <section className="border-y border-border bg-footer text-footer-foreground">
        <Container className="grid gap-8 py-16 lg:grid-cols-3">
          {buildPaths.map((build) => (
            <article
              key={build.title}
              className="rounded-[1.5rem] border border-border bg-background/5 p-6 shadow-[var(--shadow-card)]"
            >
              <p className="text-xs font-black uppercase tracking-[0.24em] text-primary">
                Build path
              </p>
              <h3 className="mt-4 text-2xl font-black uppercase tracking-[-0.04em] text-footer-foreground">
                {build.title}
              </h3>
              <p className="mt-4 text-base font-medium leading-7 text-footer-muted">
                {build.description}
              </p>
            </article>
          ))}
        </Container>
      </section>

      <Footer />
    </main>
  );
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
        <p className="text-sm font-black uppercase tracking-[0.22em] text-primary">
          {eyebrow}
        </p>
        <h2 className="mt-3 text-4xl font-black uppercase tracking-[-0.06em] text-foreground sm:text-5xl">
          {title}
        </h2>
      </div>
      <Link
        href={href}
        className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.18em] text-foreground/70 transition-colors hover:text-primary"
      >
        {linkLabel} <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}