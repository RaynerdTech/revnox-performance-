// This file provides the storefront catalog gateway so pages do not talk directly to Shopify.
import "server-only";

import type {
  CategoryProductSection,
  HomepageCatalog,
  Product,
} from "@/lib/commerce/types";
import {
  getShopifyBestSellingProducts,
  getShopifyCategories,
  getShopifyFeaturedProducts,
  getShopifyProductByHandle,
  getShopifyProductRecommendations,
  getShopifyProducts,
} from "@/lib/commerce/shopify/products";

export async function getCategories() {
  return getShopifyCategories(10);
}

export async function getProducts() {
  return getShopifyProducts(40);
}

export async function getFeaturedProducts() {
  return getShopifyFeaturedProducts();
}

export async function getBestSellingProducts() {
  return getShopifyBestSellingProducts();
}

export async function getProductByHandle(
  handle: string,
) {
  return getShopifyProductByHandle(
    handle,
  );
}

export async function getRelatedProducts(
  product: Product,
  limit = 8,
) {
  const relatedProducts: Product[] = [];
  const usedProductIds = new Set<string>([
    product.id,
  ]);

  try {
    const recommendations =
      await getShopifyProductRecommendations(
        product.id,
      );

    for (const recommendation of recommendations) {
      if (
        usedProductIds.has(
          recommendation.id,
        ) ||
        !recommendation.availableForSale
      ) {
        continue;
      }

      usedProductIds.add(
        recommendation.id,
      );

      relatedProducts.push(
        recommendation,
      );

      if (
        relatedProducts.length >= limit
      ) {
        return relatedProducts;
      }
    }
  } catch (error) {
    console.error(
      "Could not load Shopify product recommendations:",
      error,
    );
  }

  if (
    relatedProducts.length < limit &&
    product.categoryHandle
  ) {
    const catalogProducts =
      await getProducts();

    for (const candidate of catalogProducts) {
      if (
        usedProductIds.has(candidate.id) ||
        !candidate.availableForSale ||
        candidate.categoryHandle !==
          product.categoryHandle
      ) {
        continue;
      }

      usedProductIds.add(candidate.id);
      relatedProducts.push(candidate);

      if (
        relatedProducts.length >= limit
      ) {
        break;
      }
    }
  }

  return relatedProducts;
}

export async function getHomepageCatalog(): Promise<HomepageCatalog> {
  const [
    categories,
    products,
    featuredProducts,
    bestSellingProducts,
  ] = await Promise.all([
    getCategories(),
    getProducts(),
    getFeaturedProducts(),
    getBestSellingProducts(),
  ]);

  const categoryProductSections: CategoryProductSection[] =
    categories
      .map((category) => ({
        category,
        products: products
          .filter(
            (product) =>
              product.categoryHandle ===
              category.handle,
          )
          .slice(0, 4),
      }))
      .filter(
        (section) =>
          section.products.length > 0,
      );

  return {
    categories,
    featuredProducts,
    bestSellingProducts,
    categoryProductSections,
  };
}