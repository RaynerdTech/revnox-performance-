// This file derives dynamic parts-brand data from normalized Shopify products.
import type { Product } from "@/lib/commerce/types";
import { getProducts } from "@/lib/commerce/catalog";

export type ProductBrand = {
  name: string;
  productCount: number;
};

export function buildProductBrands(
  products: Product[],
): ProductBrand[] {
  const brands = new Map<
    string,
    ProductBrand
  >();

  for (const product of products) {
    const brandName =
      product.brand?.trim();

    if (!brandName) {
      continue;
    }

    const normalizedName =
      brandName.toLowerCase();

    const existingBrand =
      brands.get(normalizedName);

    if (existingBrand) {
      existingBrand.productCount += 1;
      continue;
    }

    brands.set(normalizedName, {
      name: brandName,
      productCount: 1,
    });
  }

  return Array.from(
    brands.values(),
  ).sort((firstBrand, secondBrand) =>
    firstBrand.name.localeCompare(
      secondBrand.name,
      undefined,
      {
        sensitivity: "base",
      },
    ),
  );
}

export async function getBrands() {
  const products = await getProducts();

  return buildProductBrands(products);
}