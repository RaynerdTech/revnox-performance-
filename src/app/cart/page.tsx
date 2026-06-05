// This file renders the Shopify-powered cart page using the saved cart session cookie.
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/ui/container";
import { CartClient } from "@/components/cart/cart-client";
import { getCurrentCart } from "@/lib/commerce/cart";

export const metadata = {
  title: "Cart",
  description: "Review your Revnox Performance cart before Shopify checkout.",
};

export default async function CartPage() {
  const cart = await getCurrentCart();

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="border-b border-border bg-secondary text-secondary-foreground">
        <Container className="flex items-center justify-center py-2 text-center text-[10px] font-semibold uppercase tracking-[0.24em]">
          Premium performance parts for serious builds
        </Container>
      </section>

      <Header />

      <section className="bg-background py-8 sm:py-12">
        <Container>
          {!cart || cart.lines.length === 0 ? (
            <EmptyCart />
          ) : (
            <CartClient cart={cart} />
          )}
        </Container>
      </section>

      <Footer />
    </main>
  );
}

function EmptyCart() {
  return (
    <div className="mx-auto max-w-xl rounded-[2rem] border border-border bg-card p-10 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
        <ShoppingBag className="h-7 w-7" />
      </div>

      <p className="mt-6 text-xs font-black uppercase tracking-[0.22em] text-primary">
        Cart is empty
      </p>

      <h2 className="mt-3 text-4xl font-black uppercase tracking-[-0.06em]">
        Start with the catalog.
      </h2>

      <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-muted-foreground">
        Add performance parts to your cart and return here before continuing to
        checkout.
      </p>

      <Link
        href="/products"
        className="mt-7 inline-flex rounded-full bg-primary px-6 py-3 text-xs font-black uppercase tracking-[0.18em] text-primary-foreground"
      >
        Shop products
      </Link>
    </div>
  );
}
