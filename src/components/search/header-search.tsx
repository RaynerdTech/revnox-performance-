// This file renders the global header search overlay using the shared
// intent-aware and typo-tolerant product search engine.
"use client";

import Image from "next/image";
import Link from "next/link";
import { Search, X } from "lucide-react";
import {
  type FormEvent,
  useMemo,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import type { Product } from "@/lib/commerce/types";
import {
  searchProducts,
  type SearchInterpretation,
} from "@/lib/search/product-search";
import { formatMoney } from "@/lib/utils/money";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

type HeaderSearchProps = {
  products: Product[];
};

const MAX_VISIBLE_RESULTS = 12;

export function HeaderSearch({
  products,
}: HeaderSearchProps) {
  const router = useRouter();

  const inputRef =
    useRef<HTMLInputElement>(null);

  const [isOpen, setIsOpen] =
    useState(false);

  const [query, setQuery] =
    useState("");

  const cleanQuery = query.trim();

  const searchResponse =
    useMemo(() => {
      if (cleanQuery.length < 2) {
        return null;
      }

      return searchProducts(
        products,
        cleanQuery,
      );
    }, [products, cleanQuery]);

  const results =
    searchResponse?.results
      .slice(
        0,
        MAX_VISIBLE_RESULTS,
      )
      .map(
        (result) =>
          result.product,
      ) ?? [];

  const totalMatches =
    searchResponse?.results.length ??
    0;

  const interpretation =
    searchResponse?.interpretation;

  function openSearch() {
    setIsOpen(true);

    window.setTimeout(() => {
      inputRef.current?.focus();
    }, 80);
  }

  function closeSearch() {
    setIsOpen(false);
    setQuery("");
  }

  function goToSearchResults() {
    if (!cleanQuery) {
      return;
    }

    const params =
      new URLSearchParams();

    params.set("q", cleanQuery);

    closeSearch();

    router.push(
      `/products?${params.toString()}`,
    );
  }

  function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
    goToSearchResults();
  }

  return (
    <>
      <button
        type="button"
        onClick={openSearch}
        className={cn(
          buttonVariants({
            variant: "outline",
            size: "md",
          }),
          "h-10 w-10 px-0 sm:h-11 sm:w-auto sm:px-4",
        )}
        aria-label="Search products"
      >
        <Search className="h-4 w-4" />

        <span className="hidden sm:inline">
          Search
        </span>
      </button>

      <div
        className={cn(
          "fixed inset-0 z-[80] transition-opacity duration-200",
          isOpen
            ? "visible opacity-100"
            : "invisible opacity-0",
        )}
      >
        <div className="absolute inset-0 revnox-glass-overlay" />

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background/35 via-transparent to-background/65" />

        <div className="pointer-events-none absolute left-1/2 top-0 h-80 w-[70vw] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />

        <div className="relative mx-auto flex h-dvh w-full max-w-4xl flex-col overflow-hidden px-4 py-5 sm:px-6 sm:py-8">
          <div className="revnox-glass shrink-0 p-4 sm:p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.24em] text-primary">
                  Search catalog
                </p>

                <h2 className="mt-2 text-3xl font-black uppercase tracking-[-0.06em] text-foreground sm:text-5xl">
                  Find parts fast.
                </h2>
              </div>

              <button
                type="button"
                onClick={closeSearch}
                className="flex h-11 w-11 shrink-0 items-center justify-center border border-border bg-card/90 text-card-foreground backdrop-blur transition-colors hover:border-primary hover:text-primary"
                aria-label="Close search"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="mt-4 shrink-0 sm:mt-5"
          >
            <div className="revnox-glass-strong flex items-center gap-3 px-4 py-3">
              <Search className="h-5 w-5 shrink-0 text-primary" />

              <input
                ref={inputRef}
                value={query}
                onChange={(event) =>
                  setQuery(
                    event.target.value,
                  )
                }
                onKeyDown={(event) => {
                  if (
                    event.key ===
                    "Escape"
                  ) {
                    closeSearch();
                  }
                }}
                placeholder="Search products, categories, brands, SKU..."
                className="h-12 min-w-0 flex-1 bg-transparent text-base font-bold text-foreground outline-none placeholder:text-foreground/45"
              />

              {query ? (
                <button
                  type="button"
                  onClick={() =>
                    setQuery("")
                  }
                  className="text-xs font-black uppercase tracking-[0.16em] text-foreground/60 transition-colors hover:text-primary"
                >
                  Clear
                </button>
              ) : null}
            </div>
          </form>

          {interpretation &&
          hasSearchInsight(
            interpretation,
          ) ? (
            <SearchInsight
              interpretation={
                interpretation
              }
            />
          ) : null}

          <div className="mt-4 flex min-h-0 flex-1 flex-col overflow-hidden sm:mt-5">
            {cleanQuery.length === 0 ? (
              <div className="revnox-glass flex min-h-0 flex-1 items-center justify-center p-8 text-center">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-primary">
                    Start typing
                  </p>

                  <p className="mx-auto mt-3 max-w-md text-sm font-medium leading-7 text-foreground/72">
                    Search by product name,
                    category, brand, tag,
                    option, or SKU.
                  </p>
                </div>
              </div>
            ) : cleanQuery.length < 2 ? (
              <div className="revnox-glass flex min-h-0 flex-1 items-center justify-center p-8 text-center">
                <p className="text-sm font-black uppercase tracking-[0.18em] text-foreground/68">
                  Type at least 2
                  characters.
                </p>
              </div>
            ) : results.length > 0 ? (
              <div className="revnox-glass-strong flex min-h-0 flex-1 flex-col overflow-hidden p-4 sm:p-5">
                <div className="mb-4 flex shrink-0 items-center justify-between gap-4">
                  <p className="text-sm font-bold text-foreground/72">
                    <span className="font-black text-foreground">
                      {totalMatches}
                    </span>{" "}
                    result
                    {totalMatches === 1
                      ? ""
                      : "s"}{" "}
                    for{" "}
                    <span className="font-black text-foreground">
                      “{cleanQuery}”
                    </span>
                  </p>

                  <button
                    type="button"
                    onClick={
                      goToSearchResults
                    }
                    className="text-xs font-black uppercase tracking-[0.18em] text-primary transition-colors hover:text-foreground"
                  >
                    View all
                  </button>
                </div>

                <div className="revnox-search-results-scroll grid min-h-0 flex-1 gap-3 overflow-y-auto pr-1">
                  {results.map(
                    (product) => (
                      <Link
                        key={product.id}
                        href={`/products/${product.handle}`}
                        onClick={
                          closeSearch
                        }
                        className="group grid grid-cols-[82px_1fr] gap-4 border border-border bg-background/92 p-3 backdrop-blur-md transition-colors hover:border-primary sm:grid-cols-[104px_1fr_auto] sm:items-center"
                      >
                        <div className="relative h-[82px] w-[82px] overflow-hidden border border-border bg-card/90 sm:h-[104px] sm:w-[104px]">
                          <Image
                            src={
                              product.image
                            }
                            alt={
                              product.imageAlt
                            }
                            fill
                            className="object-contain p-3 transition-transform duration-300 group-hover:scale-105"
                            sizes="104px"
                          />
                        </div>

                        <div className="min-w-0">
                          {product.category ? (
                            <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">
                              {
                                product.category
                              }
                            </p>
                          ) : null}

                          <h3 className="mt-2 line-clamp-2 text-lg font-black uppercase leading-tight tracking-[-0.04em] text-foreground transition-colors group-hover:text-primary sm:text-xl">
                            {product.title}
                          </h3>

                          {product.brand ? (
                            <p className="mt-2 line-clamp-1 text-sm font-medium text-foreground/68">
                              {
                                product.brand
                              }
                            </p>
                          ) : null}
                        </div>

                        <div className="hidden text-right sm:block">
                          <p className="text-xs font-black uppercase tracking-[0.18em] text-foreground/58">
                            From
                          </p>

                          <p className="mt-1 text-xl font-black text-foreground">
                            {formatMoney(
                              product.price,
                              product.currencyCode,
                            )}
                          </p>
                        </div>
                      </Link>
                    ),
                  )}
                </div>

                <button
                  type="button"
                  onClick={
                    goToSearchResults
                  }
                  className={cn(
                    buttonVariants({
                      variant:
                        "primary",
                      size: "lg",
                    }),
                    "mt-5 w-full shrink-0",
                  )}
                >
                  View all results
                </button>
              </div>
            ) : (
              <div className="revnox-glass flex min-h-0 flex-1 items-center justify-center p-8 text-center">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-primary">
                    No results
                  </p>

                  <h3 className="mt-3 text-3xl font-black uppercase tracking-[-0.06em] text-foreground">
                    Try another search.
                  </h3>

                  <p className="mx-auto mt-4 max-w-md text-sm font-medium leading-7 text-foreground/72">
                    {interpretation &&
                    interpretation
                      .searchableTerms
                      .length === 0
                      ? "Add a product, category, brand, or part number to the vehicle search."
                      : `No products matched “${cleanQuery}” in the current storefront catalog.`}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function hasSearchInsight(
  interpretation: SearchInterpretation,
) {
  return Boolean(
    interpretation.year ||
      interpretation.vehicleMake ||
      interpretation.correctedTerms
        .length,
  );
}

function SearchInsight({
  interpretation,
}: {
  interpretation: SearchInterpretation;
}) {
  const vehicleText = [
    interpretation.year,
    interpretation.vehicleMake,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="revnox-glass mt-4 shrink-0 px-4 py-3 text-xs font-bold leading-5 text-foreground/72 sm:mt-5">
      {interpretation.correctedTerms
        .length > 0 ? (
        <p>
          Interpreted{" "}
          {interpretation.correctedTerms
            .map(
              (correction) =>
                `“${correction.from}” as “${correction.to}”`,
            )
            .join(", ")}
          .
        </p>
      ) : null}

      {vehicleText ? (
        <p>
          Vehicle intent detected:{" "}
          <span className="font-black text-foreground">
            {vehicleText}
          </span>
          . Compatibility is not yet
          verified.
        </p>
      ) : null}
    </div>
  );
}