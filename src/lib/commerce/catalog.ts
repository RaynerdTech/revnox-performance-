// This file provides the storefront catalog gateway so pages do not talk directly to Shopify.
import "server-only";
import type { CategoryProductSection, HomepageCatalog } from "@/lib/commerce/types";
import {
  getShopifyBestSellingProducts,
  getShopifyCategories,
  getShopifyFeaturedProducts,
  getShopifyProductByHandle,
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

export async function getProductByHandle(handle: string) {
  return getShopifyProductByHandle(handle);
}

export async function getHomepageCatalog(): Promise<HomepageCatalog> {
  const [categories, products, featuredProducts, bestSellingProducts] =
    await Promise.all([
      getCategories(),
      getProducts(),
      getFeaturedProducts(),
      getBestSellingProducts(),
    ]);

  const categoryProductSections: CategoryProductSection[] = categories
    .map((category) => ({
      category,
      products: products
        .filter((product) => product.categoryHandle === category.handle)
        .slice(0, 4),
    }))
    .filter((section) => section.products.length > 0);

  return {
    categories,
    featuredProducts,
    bestSellingProducts,
    categoryProductSections,
  };
}