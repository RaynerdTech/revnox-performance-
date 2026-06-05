// This file coordinates product gallery, selected variant, pricing, inventory, and add-to-cart state.
"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type {
  Product,
  ProductVariant,
} from "@/lib/commerce/types";
import type { AddToCartActionState } from "@/app/cart/actions";
import { ProductDetailGallery } from "@/components/product/product-detail-gallery";
import { ProductVariantList } from "@/components/product/product-variant-list";
import { AddToCartForm } from "@/components/cart/add-to-cart-form";
import { formatMoney } from "@/lib/utils/money";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

type ProductPurchaseExperienceProps = {
  product: Product;
  action: (
    previousState: AddToCartActionState,
    formData: FormData,
  ) => Promise<AddToCartActionState>;
};

function getDefaultVariant(
  variants: ProductVariant[],
) {
  return (
    variants.find(
      (variant) =>
        variant.availableForSale &&
        variant.quantityAvailable !== 0,
    ) ??
    variants.find(
      (variant) =>
        variant.availableForSale,
    ) ??
    variants[0] ??
    null
  );
}

export function ProductPurchaseExperience({
  product,
  action,
}: ProductPurchaseExperienceProps) {
  const defaultVariant =
    getDefaultVariant(product.variants);

  const [
    selectedVariantId,
    setSelectedVariantId,
  ] = useState(
    defaultVariant?.id ?? "",
  );

  const selectedVariant = useMemo(
    () =>
      product.variants.find(
        (variant) =>
          variant.id ===
          selectedVariantId,
      ) ??
      defaultVariant,
    [
      defaultVariant,
      product.variants,
      selectedVariantId,
    ],
  );

  const displayedPrice =
    selectedVariant?.price ??
    product.price;

  const displayedCompareAtPrice =
    selectedVariant?.compareAtPrice ??
    product.compareAtPrice;

  const displayedCurrency =
    selectedVariant?.currencyCode ??
    product.currencyCode;

  const categoryHref =
    product.categoryHandle
      ? `/products?category=${encodeURIComponent(
          product.categoryHandle,
        )}`
      : "/products";

  return (
    <div className="grid gap-12 lg:grid-cols-[1fr_0.9fr] lg:items-start">
      <ProductDetailGallery
        product={product}
        selectedVariant={selectedVariant}
      />

      <div className="lg:sticky lg:top-28">
        <div className="rounded-[2rem] border border-border bg-card p-6 shadow-[var(--shadow-card)] sm:p-8">
          <div className="mb-5 flex flex-wrap gap-2">
            {product.category ? (
              <span className="rounded-full bg-primary px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-primary-foreground">
                {product.category}
              </span>
            ) : null}

            {product.badge ? (
              <span className="rounded-full border border-border px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-foreground/65">
                {product.badge}
              </span>
            ) : null}
          </div>

          {product.brand ? (
            <p className="text-xs font-black uppercase tracking-[0.22em] text-foreground/60">
              {product.brand}
            </p>
          ) : null}

          <h1 className="mt-3 text-4xl font-black uppercase leading-[0.95] tracking-[-0.07em] text-foreground sm:text-5xl">
            {product.title}
          </h1>

          <div className="mt-6 flex flex-wrap items-end gap-3">
            <p className="text-4xl font-black tracking-[-0.06em] text-foreground">
              {formatMoney(
                displayedPrice,
                displayedCurrency,
              )}
            </p>

            {displayedCompareAtPrice ? (
              <p className="text-lg font-bold text-foreground/55 line-through">
                {formatMoney(
                  displayedCompareAtPrice,
                  displayedCurrency,
                )}
              </p>
            ) : null}
          </div>

          {product.description ? (
            <p className="mt-6 whitespace-pre-line text-base font-medium leading-8 text-foreground/72">
              {product.description}
            </p>
          ) : null}

          <ProductVariantList
            variant={selectedVariant}
          />

          <AddToCartForm
            variants={product.variants}
            selectedVariantId={
              selectedVariant?.id ?? ""
            }
            onVariantChange={
              setSelectedVariantId
            }
            action={action}
          />

          <Link
            href={categoryHref}
            className={cn(
              buttonVariants({
                variant: "outline",
                size: "lg",
              }),
              "mt-3 w-full",
            )}
          >
            View category
          </Link>
        </div>
      </div>
    </div>
  );
}