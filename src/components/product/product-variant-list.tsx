// This file renders available Shopify product variants on the product detail page.
import type { ProductVariant } from "@/lib/commerce/types";
import { formatMoney } from "@/lib/utils/money";

type ProductVariantListProps = {
  variants: ProductVariant[];
};

export function ProductVariantList({ variants }: ProductVariantListProps) {
  if (variants.length === 0) {
    return null;
  }

  return (
    <div className="rounded-[1.5rem] border border-border bg-card p-5">
      <h2 className="text-xs font-black uppercase tracking-[0.22em] text-muted-foreground">
        Available options
      </h2>

      <div className="mt-4 grid gap-3">
        {variants.map((variant) => (
          <div
            key={variant.id}
            className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-background p-4"
          >
            <div>
              <p className="font-black uppercase tracking-[-0.03em]">
                {variant.title}
              </p>
              {variant.sku ? (
                <p className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  SKU: {variant.sku}
                </p>
              ) : null}
            </div>

            <div className="text-right">
              <p className="font-black">
                {formatMoney(variant.price, variant.currencyCode)}
              </p>
              <p className="mt-1 text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
                {variant.availableForSale ? "Available" : "Unavailable"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}