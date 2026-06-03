// This file renders the product detail image gallery using Shopify product images.
import Image from "next/image";
import type { Product } from "@/lib/commerce/types";

type ProductDetailGalleryProps = {
  product: Product;
};

export function ProductDetailGallery({ product }: ProductDetailGalleryProps) {
  const images =
    product.images.length > 0
      ? product.images
      : [
          {
            id: product.id,
            url: product.image,
            altText: product.imageAlt,
          },
        ];

  return (
    <div className="grid gap-4">
      <div className="relative aspect-square overflow-hidden rounded-[2rem] border border-border bg-surface shadow-[var(--shadow-soft)]">
        <Image
          src={images[0].url}
          alt={images[0].altText}
          fill
          priority
          className="object-contain p-8"
          sizes="(min-width: 1024px) 50vw, 100vw"
        />
      </div>

      {images.length > 1 ? (
        <div className="grid grid-cols-4 gap-3">
          {images.slice(0, 4).map((image) => (
            <div
              key={image.id}
              className="relative aspect-square overflow-hidden rounded-2xl border border-border bg-card"
            >
              <Image
                src={image.url}
                alt={image.altText}
                fill
                className="object-contain p-3"
                sizes="120px"
              />
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}