// This file renders the storefront wishlist page backed by browser-side saved products.
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/ui/container";
import { WishlistList } from "@/components/wishlist/wishlist-list";

export const metadata = {
  title: "Wishlist",
  description: "View saved Revnox Performance products.",
};

export default function WishlistPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="border-b border-border bg-secondary text-secondary-foreground">
        <Container className="flex items-center justify-center py-2 text-center text-[10px] font-semibold uppercase tracking-[0.24em]">
          Premium performance parts for serious builds
        </Container>
      </section>

      <Header />

      <section className="revnox-grid-bg revnox-radial border-b border-border">
        <Container className="py-16">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-primary">
            Saved products
          </p>
          <h1 className="mt-4 text-5xl font-black uppercase leading-[0.9] tracking-[-0.07em] sm:text-7xl">
            Wishlist.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-muted-foreground">
            Keep performance parts saved while planning your build.
          </p>
        </Container>
      </section>

      <section className="py-12 sm:py-16">
        <Container>
          <WishlistList />
        </Container>
      </section>

      <Footer />
    </main>
  );
}
