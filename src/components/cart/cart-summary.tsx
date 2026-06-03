// This file renders the Shopify cart summary and checkout action inside the cart list panel.
import type { Cart } from "@/lib/commerce/types";
import { checkoutAction } from "@/app/cart/actions";
import { formatMoney } from "@/lib/utils/money";

type CartSummaryProps = {
  cart: Cart;
  isUpdating?: boolean;
};

export function CartSummary({ cart, isUpdating = false }: CartSummaryProps) {
  return (
    <footer className="grid gap-5 border-t border-border pt-6 sm:grid-cols-[1fr_280px] sm:items-end">
      <div>
        {isUpdating ? (
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
            Updating cart
          </p>
        ) : (
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
            Ready for checkout
          </p>
        )}

        <p className="mt-2 text-xs leading-6 text-muted-foreground">
          Taxes, shipping, and final totals are calculated in Shopify checkout.
        </p>
      </div>

      <div className="grid gap-4">
        <div className="grid gap-2 text-sm">
          <SummaryRow
            label="Items"
            value={`${cart.totalQuantity} ${
              cart.totalQuantity === 1 ? "item" : "items"
            }`}
          />
          <SummaryRow
            label="Subtotal"
            value={formatMoney(cart.subtotalAmount, cart.currencyCode)}
          />
        </div>

        <form action={checkoutAction}>
          <button
            type="submit"
            disabled={cart.lines.length === 0}
            className="w-full rounded-full bg-primary px-6 py-4 text-sm font-black uppercase tracking-[0.18em] text-primary-foreground shadow-[var(--shadow-card)] transition-transform duration-200 hover:-translate-y-0.5 disabled:pointer-events-none disabled:opacity-50"
          >
            Checkout
          </button>
        </form>
      </div>
    </footer>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <p className="text-muted-foreground">{label}</p>
      <p className="font-black text-foreground">{value}</p>
    </div>
  );
}