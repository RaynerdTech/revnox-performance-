// This file renders real Shopify details for the currently selected product variant.
import type { ProductVariant } from "@/lib/commerce/types";

type ProductVariantListProps = {
  variant?: ProductVariant | null;
};

export function ProductVariantList({
  variant,
}: ProductVariantListProps) {
  if (!variant) {
    return null;
  }

  const selectedOptions =
    variant.selectedOptions.filter(
      (option) =>
        !(
          option.name === "Title" &&
          option.value === "Default Title"
        ),
    );

  const inventoryLabel =
    typeof variant.quantityAvailable ===
    "number"
      ? variant.quantityAvailable > 0
        ? `${variant.quantityAvailable} available`
        : "Unavailable"
      : variant.availableForSale
        ? "In stock"
        : "Unavailable";

  return (
    <div className="mt-6 border-y border-border py-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-foreground/55">
            Selected option
          </p>

          <p className="mt-2 font-black uppercase tracking-[-0.03em] text-foreground">
            {variant.title}
          </p>

          {selectedOptions.length > 0 ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {selectedOptions.map(
                (option) => (
                  <span
                    key={`${option.name}-${option.value}`}
                    className="border border-border bg-background px-3 py-2 text-xs font-bold text-foreground/70"
                  >
                    {option.name}:{" "}
                    {option.value}
                  </span>
                ),
              )}
            </div>
          ) : null}
        </div>

        <div className="grid grid-cols-2 gap-4 sm:text-right">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-foreground/55">
              Availability
            </p>

            <p
              className={
                variant.availableForSale
                  ? "mt-2 text-sm font-black uppercase tracking-[0.12em] text-primary"
                  : "mt-2 text-sm font-black uppercase tracking-[0.12em] text-foreground/50"
              }
            >
              {inventoryLabel}
            </p>
          </div>

          {variant.sku ? (
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-foreground/55">
                SKU
              </p>

              <p className="mt-2 break-all text-sm font-black text-foreground">
                {variant.sku}
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}