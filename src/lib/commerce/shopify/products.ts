// This file maps Shopify Storefront API product and collection data into storefront commerce types.
import "server-only";

import type {
  Product,
  ProductBadge,
  ProductCategory,
  ProductImage,
  ProductOptionSelection,
  ProductVariant,
} from "@/lib/commerce/types";
import { shopifyFetch } from "@/lib/commerce/shopify/storefront-client";
import {
  COLLECTIONS_QUERY,
  PRODUCT_BY_HANDLE_QUERY,
  PRODUCT_RECOMMENDATIONS_QUERY,
  PRODUCTS_QUERY,
} from "@/lib/commerce/shopify/queries";

type ShopifyMoney = {
  amount: string;
  currencyCode: string;
};

type ShopifyImage = {
  id: string;
  url: string;
  altText: string | null;
  width?: number;
  height?: number;
};

type ShopifySelectedOption = {
  name: string;
  value: string;
};

type ShopifyVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  quantityAvailable: number | null;
  sku?: string | null;
  image?: ShopifyImage | null;
  selectedOptions: ShopifySelectedOption[];
  price: ShopifyMoney;
  compareAtPrice?: ShopifyMoney | null;
};

type ShopifyProduct = {
  id: string;
  title: string;
  handle: string;
  description: string;
  vendor: string;
  tags: string[];
  featuredImage: ShopifyImage | null;

  images: {
    nodes: ShopifyImage[];
  };

  collections: {
    nodes: {
      id: string;
      title: string;
      handle: string;
    }[];
  };

  variants: {
    nodes: ShopifyVariant[];
  };

  priceRange: {
    minVariantPrice: ShopifyMoney;
  };

  compareAtPriceRange: {
    minVariantPrice: ShopifyMoney;
  };
};

type ShopifyCollection = {
  id: string;
  title: string;
  handle: string;
  description: string;
  image: {
    url: string;
    altText: string | null;
    width?: number | null;
    height?: number | null;
  } | null;
  products: {
    nodes: {
      id: string;
    }[];
  };
};

type ProductsQueryResponse = {
  products: {
    nodes: ShopifyProduct[];
  };
};

type CollectionsQueryResponse = {
  collections: {
    nodes: ShopifyCollection[];
  };
};

type ProductByHandleResponse = {
  product: ShopifyProduct | null;
};

type ProductRecommendationsResponse = {
  productRecommendations: ShopifyProduct[] | null;
};

function normalizeTag(tag: string) {
  return tag.trim().toLowerCase();
}

function hasTag(
  product: ShopifyProduct,
  targetTag: string,
) {
  const normalizedTarget =
    normalizeTag(targetTag);

  return product.tags.some(
    (tag) =>
      normalizeTag(tag) === normalizedTarget,
  );
}

function getProductBadge(
  product: ShopifyProduct,
): ProductBadge | undefined {
  if (hasTag(product, "best-seller")) {
    return "Best Seller";
  }

  if (hasTag(product, "featured")) {
    return "Featured";
  }

  if (hasTag(product, "new-arrival")) {
    return "New";
  }

  return undefined;
}

function getCompareAtPrice(
  product: ShopifyProduct,
) {
  const compareAtAmount = Number(
    product.compareAtPriceRange
      .minVariantPrice.amount,
  );

  const priceAmount = Number(
    product.priceRange.minVariantPrice.amount,
  );

  if (
    !Number.isFinite(compareAtAmount) ||
    compareAtAmount <= priceAmount
  ) {
    return undefined;
  }

  return compareAtAmount;
}

function mapImage(
  image: ShopifyImage,
  fallbackAlt: string,
): ProductImage {
  return {
    id: image.id,
    url: image.url,
    altText: image.altText ?? fallbackAlt,
    width: image.width,
    height: image.height,
  };
}

function mapSelectedOption(
  option: ShopifySelectedOption,
): ProductOptionSelection {
  return {
    name: option.name,
    value: option.value,
  };
}

function mapVariant(
  variant: ShopifyVariant,
  productTitle: string,
): ProductVariant {
  const price = Number(variant.price.amount);

  const compareAtPrice =
    variant.compareAtPrice
      ? Number(variant.compareAtPrice.amount)
      : undefined;

  return {
    id: variant.id,
    title: variant.title,
    availableForSale:
      variant.availableForSale,
    quantityAvailable:
      variant.quantityAvailable,
    sku: variant.sku ?? undefined,
    price,
    compareAtPrice:
      compareAtPrice &&
      compareAtPrice > price
        ? compareAtPrice
        : undefined,
    currencyCode:
      variant.price.currencyCode,
    image: variant.image
      ? mapImage(
          variant.image,
          `${productTitle} — ${variant.title}`,
        )
      : undefined,
    selectedOptions:
      variant.selectedOptions.map(
        mapSelectedOption,
      ),
  };
}

function mapShopifyProduct(
  product: ShopifyProduct,
): Product {
  const primaryCollection =
    product.collections.nodes[0];

  const variants =
    product.variants.nodes.map(
      (variant) =>
        mapVariant(variant, product.title),
    );

  const images =
    product.images.nodes.length > 0
      ? product.images.nodes.map((image) =>
          mapImage(image, product.title),
        )
      : product.featuredImage
        ? [
            mapImage(
              product.featuredImage,
              product.title,
            ),
          ]
        : [];

  return {
    id: product.id,
    title: product.title,
    handle: product.handle,
    category:
      primaryCollection?.title ?? "",
    categoryHandle:
      primaryCollection?.handle ?? "",
    brand: product.vendor,
    description: product.description,
    price: Number(
      product.priceRange.minVariantPrice
        .amount,
    ),
    compareAtPrice:
      getCompareAtPrice(product),
    currencyCode:
      product.priceRange.minVariantPrice
        .currencyCode,
    image:
      product.featuredImage?.url ??
      images[0]?.url ??
      "/images/product-wheel-dark.svg",
    imageAlt:
      product.featuredImage?.altText ??
      product.title,
    images,
    variants,
    availableForSale: variants.some(
      (variant) =>
        variant.availableForSale,
    ),
    badge: getProductBadge(product),
    tags: product.tags,
    isBestSeller: hasTag(
      product,
      "best-seller",
    ),
    isFeatured: hasTag(
      product,
      "featured",
    ),
  };
}

export async function getShopifyProducts(
  first = 40,
) {
  const data = await shopifyFetch<
    ProductsQueryResponse,
    { first: number }
  >({
    query: PRODUCTS_QUERY,
    variables: { first },
    revalidate: 300,
  });

  return data.products.nodes.map(
    mapShopifyProduct,
  );
}

export async function getShopifyFeaturedProducts() {
  const products =
    await getShopifyProducts(40);

  return products
    .filter(
      (product) => product.isFeatured,
    )
    .slice(0, 8);
}

export async function getShopifyBestSellingProducts() {
  const products =
    await getShopifyProducts(40);

  return products
    .filter(
      (product) => product.isBestSeller,
    )
    .slice(0, 8);
}

export async function getShopifyProductByHandle(
  handle: string,
) {
  const data = await shopifyFetch<
    ProductByHandleResponse,
    { handle: string }
  >({
    query: PRODUCT_BY_HANDLE_QUERY,
    variables: { handle },
    revalidate: 300,
  });

  return data.product
    ? mapShopifyProduct(data.product)
    : null;
}

export async function getShopifyProductRecommendations(
  productId: string,
) {
  const data = await shopifyFetch<
    ProductRecommendationsResponse,
    { productId: string }
  >({
    query:
      PRODUCT_RECOMMENDATIONS_QUERY,
    variables: { productId },
    revalidate: 300,
  });

  return (
    data.productRecommendations ?? []
  ).map(mapShopifyProduct);
}

export async function getShopifyCategories(
  first = 10,
): Promise<ProductCategory[]> {
  const data = await shopifyFetch<
    CollectionsQueryResponse,
    { first: number }
  >({
    query: COLLECTIONS_QUERY,
    variables: { first },
    revalidate: 300,
  });

  return data.collections.nodes.map(
    (collection) => ({
      id: collection.id,
      title: collection.title,
      handle: collection.handle,
      description:
        collection.description,
      productCount:
        collection.products.nodes.length,
      image: collection.image
        ? {
            url: collection.image.url,
            altText:
              collection.image.altText ??
              collection.title,
            width:
              collection.image.width ??
              undefined,
            height:
              collection.image.height ??
              undefined,
          }
        : undefined,
    }),
  );
}