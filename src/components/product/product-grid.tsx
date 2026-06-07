// This file defines a responsive Shopify product grid with two cards per mobile row.
import type { Product } from "@/lib/commerce/types";
import { ProductCard } from "@/components/product/product-card";

type ProductGridProps = {
  products: Product[];
};

export function ProductGrid({ products }: ProductGridProps) {
  return (
    <div className="grid grid-cols-2 items-stretch gap-3 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}