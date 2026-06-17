// This file renders a compact premium category marquee using Shopify collection data only.
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ProductCategory } from "@/lib/commerce/types";
import { Container } from "@/components/ui/container";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

type HomeCategoryShowcaseProps = {
  categories: ProductCategory[];
};

function truncateText(text: string, limit: number) {
  if (text.length <= limit) {
    return text;
  }

  return `${text.slice(0, limit).trim().replace(/[.,;:!?-]+$/, "")}...`;
}

export function HomeCategoryShowcase({
  categories,
}: HomeCategoryShowcaseProps) {
  if (categories.length === 0) {
    return null;
  }

  const marqueeCategories = [...categories, ...categories, ...categories];

  return (
    <section className="relative overflow-hidden border-b border-border bg-background py-18">
      <div className="revnox-grid-bg pointer-events-none absolute inset-0 opacity-15" />

      <Container className="relative">
        <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="revnox-label text-sm text-primary">
              Shop by category
            </p>

            <h2 className="revnox-heading mt-3 max-w-[18ch] text-3xl text-foreground sm:text-4xl lg:text-5xl">
              Choose your system.
            </h2>
          </div>

          <Link
            href="/products"
            className={cn(
              buttonVariants({
                variant: "outline",
                size: "lg",
              }),
              "revnox-nav-text w-fit",
            )}
          >
            View all parts
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Container>

      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-16 sm:w-28" />
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-16 sm:w-28" />

        <div className="revnox-category-marquee-track flex w-max gap-4 px-4 sm:gap-5">
          {marqueeCategories.map((category, index) => (
            <Link
              key={`${category.id}-${index}`}
              href={`/products?category=${category.handle}`}
              className="group relative flex w-[88vw] max-w-[430px] shrink-0 overflow-hidden border border-border transition-transform duration-200 hover:-translate-y-1 sm:w-[430px]"
            >
              <div className="relative h-[160px] w-[34%] shrink-0 overflow-hidden bg-background sm:h-[180px]">
                {category.image ? (
                  <img
                    src={category.image.url}
                    alt={category.image.altText}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-background px-3 text-center">
                    <span className="revnox-label text-[10px] leading-5 text-primary">
                      Category image
                    </span>
                  </div>
                )}

                <div className="absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-card to-transparent" />
              </div>

              <div className="flex min-w-0 flex-1 flex-col justify-between border-l border-border p-4">
                <div className="flex justify-end">
                  <p className="revnox-label text-[10px] text-foreground/65">
                    {category.productCount} parts
                  </p>
                </div>

                <div className="min-w-0">
                  <p className="revnox-label mb-2 text-[10px] text-primary">
                    {category.productCount} available parts
                  </p>

                  <h3 className="revnox-heading max-w-full whitespace-normal text-[1rem] text-foreground [overflow-wrap:anywhere] sm:text-[1.2rem]">
                    {category.title}
                  </h3>

                  {category.description ? (
                    <p className="mt-3 text-sm font-medium leading-6 text-foreground/72">
                      <span className="sm:hidden">
                        {truncateText(category.description, 42)}
                      </span>

                      <span className="hidden sm:inline">
                        {truncateText(category.description, 82)}
                      </span>
                    </p>
                  ) : null}

                  <div className="revnox-nav-text mt-4 inline-flex items-center gap-2 text-[10px] text-foreground/65 transition-colors group-hover:text-primary">
                    Shop category

                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}