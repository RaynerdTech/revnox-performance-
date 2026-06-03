// This file defines the main storefront header with responsive image branding, navigation, inline cart count, mobile controls, and theme controls.
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { MobileMenu } from "@/components/layout/mobile-menu";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Container } from "@/components/ui/container";
import { buttonVariants } from "@/components/ui/button";
import { getCurrentCart } from "@/lib/commerce/cart";
import { cn } from "@/lib/utils/cn";

const navItems = [
  { label: "Shop", href: "/products" },
  { label: "Wishlist", href: "/wishlist" },
  { label: "Brands", href: "/brands" },
  { label: "Fitment", href: "/fitment" },
  { label: "Journal", href: "/journal" },
  { label: "Contact", href: "/contact" },
];

export async function Header() {
  const cart = await getCurrentCart();
  const cartQuantity = cart?.totalQuantity ?? 0;

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-xl">
      <Container className="relative flex h-20 items-center justify-between gap-4">
        <Link
          href="/"
          className="flex shrink-0 items-center"
          aria-label="Go to Revnox Performance homepage"
        >
          <Image
            src="/revnox-logo-transparent-trimmed.png"
            alt="Revnox Performance"
            width={220}
            height={78}
            priority
            className="block h-auto w-[132px] object-contain dark:hidden sm:w-[160px]"
          />

          <Image
            src="/revnox-logo-transparent-darkmode.png"
            alt="Revnox Performance"
            width={220}
            height={78}
            priority
            className="hidden h-auto w-[132px] object-contain dark:block sm:w-[160px]"
          />
        </Link>

        <nav className="hidden items-center gap-8 text-xs font-black uppercase tracking-[0.18em] text-foreground/65 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              className="transition-colors hover:text-foreground"
              href={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <ThemeToggle />

          <Link
            href="/cart"
            className={cn(
              buttonVariants({ variant: "primary", size: "md" }),
              "relative h-11 px-3 sm:px-5",
            )}
            aria-label={
              cartQuantity > 0
                ? `Open cart with ${cartQuantity} items`
                : "Open cart"
            }
          >
            <ShoppingBag className="h-4 w-4" />

            <span className="hidden sm:inline">Cart</span>

            {cartQuantity > 0 ? (
              <span className="absolute -right-2 -top-2 inline-flex min-w-6 items-center justify-center rounded-full border border-primary bg-background px-1.5 py-0.5 text-[10px] font-black leading-none !text-foreground shadow-[var(--shadow-card)] sm:static sm:ml-1 sm:border-0 sm:bg-primary-foreground/14 sm:!text-primary-foreground sm:shadow-none">
                {cartQuantity}
              </span>
            ) : null}
          </Link>

          <MobileMenu />
        </div>
      </Container>
    </header>
  );
}