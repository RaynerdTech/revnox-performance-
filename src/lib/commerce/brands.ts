// This file derives storefront brand data from direct Shopify Brand Profile
// references.
import type {
  BrandProfile,
  Product,
} from "@/lib/commerce/types";
import { getProducts } from "@/lib/commerce/catalog";

export type ProductBrand =
  BrandProfile & {
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
    const profile =
      product.brandProfile;

    if (!profile?.active) {
      continue;
    }

    const existingBrand =
      brands.get(profile.id);

    if (existingBrand) {
      existingBrand.productCount += 1;
      continue;
    }

    brands.set(profile.id, {
      ...profile,
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
  const products =
    await getProducts();

  return buildProductBrands(products);
}