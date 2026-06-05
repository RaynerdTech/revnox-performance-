// This file renders an interactive, keyboard-accessible Shopify product gallery
// without blank flashes between images.
"use client";

import Image from "next/image";
import {
  type KeyboardEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type {
  Product,
  ProductImage,
  ProductVariant,
} from "@/lib/commerce/types";
import { cn } from "@/lib/utils/cn";

type ProductDetailGalleryProps = {
  product: Product;
  selectedVariant?: ProductVariant | null;
};

export function ProductDetailGallery({
  product,
  selectedVariant,
}: ProductDetailGalleryProps) {
  const thumbnailRefs = useRef<
    Record<string, HTMLButtonElement | null>
  >({});

  const images = useMemo(() => {
    const uniqueImages = new Map<string, ProductImage>();

    for (const image of product.images) {
      uniqueImages.set(image.id, image);
    }

    if (product.images.length === 0 && product.image) {
      uniqueImages.set(product.id, {
        id: product.id,
        url: product.image,
        altText: product.imageAlt,
      });
    }

    for (const variant of product.variants) {
      if (variant.image) {
        uniqueImages.set(variant.image.id, variant.image);
      }
    }

    return Array.from(uniqueImages.values());
  }, [product]);

  const initialImageId =
    selectedVariant?.image?.id ??
    images[0]?.id ??
    "";

  const [displayedImageId, setDisplayedImageId] =
    useState(initialImageId);

  const [pendingImageId, setPendingImageId] =
    useState<string | null>(null);

  const [failedImageIds, setFailedImageIds] =
    useState<Set<string>>(() => new Set());

  const displayedImageIdRef = useRef(initialImageId);

  useEffect(() => {
    displayedImageIdRef.current = displayedImageId;
  }, [displayedImageId]);

  useEffect(() => {
    const variantImageId = selectedVariant?.image?.id;

    if (
      !variantImageId ||
      variantImageId === displayedImageIdRef.current ||
      failedImageIds.has(variantImageId)
    ) {
      return;
    }

    setPendingImageId(variantImageId);
  }, [selectedVariant?.image?.id, failedImageIds]);

  useEffect(() => {
    const displayedImageStillExists = images.some(
      (image) => image.id === displayedImageId,
    );

    if (!displayedImageStillExists && images[0]) {
      displayedImageIdRef.current = images[0].id;
      setDisplayedImageId(images[0].id);
      setPendingImageId(null);
    }
  }, [displayedImageId, images]);

  const displayedImage =
    images.find((image) => image.id === displayedImageId) ??
    images[0];

  const pendingImage = pendingImageId
    ? images.find((image) => image.id === pendingImageId)
    : undefined;

  const activeThumbnailId =
    pendingImage?.id ??
    displayedImage?.id ??
    "";

  function requestImage(image: ProductImage) {
    if (
      image.id === displayedImageIdRef.current ||
      image.id === pendingImageId ||
      failedImageIds.has(image.id)
    ) {
      return;
    }

    setPendingImageId(image.id);
  }

  function handlePendingImageLoad(imageId: string) {
    displayedImageIdRef.current = imageId;
    setDisplayedImageId(imageId);
    setPendingImageId(null);
  }

  function handlePendingImageError(imageId: string) {
    setFailedImageIds((current) => {
      const next = new Set(current);
      next.add(imageId);
      return next;
    });

    setPendingImageId(null);
  }

  function navigateToImage(index: number) {
    const image = images[index];

    if (!image || failedImageIds.has(image.id)) {
      return;
    }

    requestImage(image);

    window.requestAnimationFrame(() => {
      thumbnailRefs.current[image.id]?.focus();
      thumbnailRefs.current[image.id]?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    });
  }

  function handleGalleryKeyDown(
    event: KeyboardEvent<HTMLDivElement>,
  ) {
    if (images.length <= 1) {
      return;
    }

    const currentIndex = images.findIndex(
      (image) => image.id === activeThumbnailId,
    );

    const safeCurrentIndex =
      currentIndex >= 0 ? currentIndex : 0;

    let nextIndex: number | null = null;

    switch (event.key) {
      case "ArrowRight":
        nextIndex =
          (safeCurrentIndex + 1) % images.length;
        break;

      case "ArrowLeft":
        nextIndex =
          (safeCurrentIndex - 1 + images.length) %
          images.length;
        break;

      case "Home":
        nextIndex = 0;
        break;

      case "End":
        nextIndex = images.length - 1;
        break;

      default:
        return;
    }

    event.preventDefault();
    navigateToImage(nextIndex);
  }

  if (!displayedImage) {
    return null;
  }

  const displayedPosition =
    Math.max(
      images.findIndex(
        (image) => image.id === activeThumbnailId,
      ),
      0,
    ) + 1;

  return (
    <div
      className="grid min-w-0 gap-4"
      onKeyDown={handleGalleryKeyDown}
      aria-label={`${product.title} image gallery`}
      aria-roledescription="carousel"
    >
      <div className="relative aspect-square overflow-hidden rounded-[2rem] border border-border bg-surface shadow-[var(--shadow-soft)]">
        <Image
          src={displayedImage.url}
          alt={displayedImage.altText}
          fill
          priority
          className="object-contain p-6 transition-opacity duration-300 sm:p-8"
          sizes="(min-width: 1024px) 50vw, 100vw"
        />

        {pendingImage ? (
          <Image
            src={pendingImage.url}
            alt=""
            fill
            aria-hidden="true"
            className="pointer-events-none object-contain p-6 opacity-0 sm:p-8"
            sizes="(min-width: 1024px) 50vw, 100vw"
            onLoad={() =>
              handlePendingImageLoad(pendingImage.id)
            }
            onError={() =>
              handlePendingImageError(pendingImage.id)
            }
          />
        ) : null}

        {pendingImage ? (
          <div
            className="absolute right-4 top-4 flex items-center gap-2 rounded-full border border-border bg-background/90 px-3 py-2 shadow-[var(--shadow-card)] backdrop-blur"
            role="status"
            aria-live="polite"
          >
            <span className="h-3 w-3 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />

            <span className="text-[10px] font-black uppercase tracking-[0.16em] text-foreground/70">
              Loading image
            </span>
          </div>
        ) : null}

        {images.length > 1 ? (
          <div className="absolute bottom-4 right-4 rounded-full border border-border bg-background/90 px-3 py-2 text-[10px] font-black uppercase tracking-[0.14em] text-foreground/70 shadow-[var(--shadow-card)] backdrop-blur">
            {displayedPosition} / {images.length}
          </div>
        ) : null}
      </div>

      {images.length > 1 ? (
        <>
          <div
            className="scrollbar-hide flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1"
            aria-label="Product image thumbnails"
            role="group"
          >
            {images.map((image, index) => {
              const isSelected =
                image.id === activeThumbnailId;

              const hasFailed =
                failedImageIds.has(image.id);

              return (
                <button
                  key={image.id}
                  ref={(element) => {
                    thumbnailRefs.current[image.id] =
                      element;
                  }}
                  type="button"
                  onClick={() => requestImage(image)}
                  disabled={hasFailed}
                  className={cn(
                    "relative aspect-square w-[88px] shrink-0 snap-start overflow-hidden rounded-2xl border bg-card transition-colors sm:w-[104px]",
                    isSelected
                      ? "border-primary ring-2 ring-primary/20"
                      : "border-border hover:border-primary",
                    hasFailed &&
                      "cursor-not-allowed opacity-40",
                  )}
                  aria-label={
                    hasFailed
                      ? `${image.altText} could not be loaded`
                      : `View image ${index + 1} of ${images.length}: ${image.altText}`
                  }
                  aria-pressed={isSelected}
                >
                  <Image
                    src={image.url}
                    alt={image.altText}
                    fill
                    className="object-contain p-3"
                    sizes="104px"
                  />
                </button>
              );
            })}
          </div>

          <p className="text-center text-[10px] font-black uppercase tracking-[0.16em] text-foreground/45">
            Use left and right arrow keys to browse
          </p>
        </>
      ) : null}
    </div>
  );
}