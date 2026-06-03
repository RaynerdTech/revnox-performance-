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

export function HomeCategoryShowcase({ categories }: HomeCategoryShowcaseProps) {
  if (categories.length === 0) {
    return null;
  }

  const marqueeCategories = [...categories, ...categories, ...categories];

  return (
    <section className="relative overflow-hidden border-b border-border bg-background py-18">
      <div className="pointer-events-none absolute inset-0 revnox-grid-bg opacity-15" />

      <Container className="relative">
        <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.24em] text-primary">
              Shop by category
            </p>

            <h2 className="mt-3 text-3xl font-black uppercase leading-none tracking-[-0.06em] text-foreground sm:text-5xl">
              Choose your system.
            </h2>
          </div>

          <Link
            href="/products"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "w-fit",
            )}
          >
            View all parts
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Container>

      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-16  sm:w-28" />
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-16  sm:w-28" />

        <div className="revnox-category-marquee-track flex w-max gap-4 px-4 sm:gap-5">
          {marqueeCategories.map((category, index) => (
            <Link
              key={`${category.id}-${index}`}
              href={`/products?category=${category.handle}`}
              className="group relative flex w-[84vw] max-w-[370px] shrink-0 overflow-hidden border border-border  transition-transform duration-200 hover:-translate-y-1 sm:w-[370px]"
            >
              <div className="relative h-[150px] w-[38%] shrink-0 overflow-hidden bg-background sm:h-[170px]">
                {category.image ? (
                  <img
                    src={category.image.url}
                    alt={category.image.altText}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-background px-4 text-center">
                    <span className="text-xs font-black uppercase leading-5 tracking-[0.16em] text-primary">
                      Category image
                    </span>
                  </div>
                )}

                <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-card to-transparent" />
              </div>

              <div className="flex min-w-0 flex-1 flex-col justify-between border-l border-border p-4 sm:p-5">
                <div className="flex justify-end">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-foreground/65">
                    {category.productCount} parts
                  </p>
                </div>

                <div>
                  <p className="mb-2 text-xs font-black uppercase tracking-[0.18em] text-primary">
                    {category.productCount} available parts
                  </p>

                  <h3 className="line-clamp-2 text-[1.45rem] font-black uppercase leading-none tracking-[-0.045em] text-foreground sm:text-[1.65rem]">
                    {category.title}
                  </h3>

                  {category.description ? (
                    <p className="mt-3 text-sm font-medium leading-6 text-foreground/72">
                      <span className="sm:hidden">
                        {truncateText(category.description, 42)}
                      </span>

                      <span className="hidden sm:inline">
                        {truncateText(category.description, 96)}
                      </span>
                    </p>
                  ) : null}

                  <div className="mt-4 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-foreground/65 transition-colors group-hover:text-primary">
                    Shop category
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <style>
        {`
          @keyframes revnox-category-marquee-scroll {
            0% {
              transform: translate3d(0, 0, 0);
            }

            100% {
              transform: translate3d(-33.333%, 0, 0);
            }
          }

          .revnox-category-marquee-track {
            animation: revnox-category-marquee-scroll 28s linear infinite;
            will-change: transform;
          }

          .revnox-category-marquee-track:hover {
            animation-play-state: paused;
          }

          @media (prefers-reduced-motion: reduce) {
            .revnox-category-marquee-track {
              animation: none;
            }
          }
        `}
      </style>
    </section>
  );
}