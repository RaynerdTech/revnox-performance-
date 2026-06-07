// This file defines the responsive storefront header with centered desktop navigation.
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { MobileMenu } from "@/components/layout/mobile-menu";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Container } from "@/components/ui/container";
import { buttonVariants } from "@/components/ui/button";
import { HeaderSearch } from "@/components/search/header-search";
import { getCurrentCart } from "@/lib/commerce/cart";
import { getProducts } from "@/lib/commerce/catalog";
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
  const [cart, products] = await Promise.all([
    getCurrentCart(),
    getProducts(),
  ]);

  const cartQuantity = cart?.totalQuantity ?? 0;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/90 backdrop-blur-xl">
      <Container className="grid h-16 min-w-0 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 sm:h-20 sm:gap-3 xl:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
        <Link
          href="/"
          className="min-w-0 shrink-0 justify-self-start"
          aria-label="Go to Revnox Performance homepage"
        >
          <Image
            src="/revnox-logo-transparent-trimmed.png"
            alt="Revnox Performance"
            width={220}
            height={78}
            priority
            className="block h-auto w-[96px] object-contain dark:hidden sm:w-[138px] xl:w-[150px]"
          />

          <Image
            src="/revnox-logo-transparent-darkmode.png"
            alt="Revnox Performance"
            width={220}
            height={78}
            priority
            className="hidden h-auto w-[96px] object-contain dark:block sm:w-[138px] xl:w-[150px]"
          />
        </Link>

        <nav className="hidden items-center justify-center gap-4 text-[10px] font-black uppercase tracking-[0.14em] text-foreground/65 xl:flex 2xl:gap-6 2xl:text-[11px]">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="whitespace-nowrap transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex min-w-0 shrink-0 items-center gap-1.5 justify-self-end sm:gap-2 lg:gap-3">
          <HeaderSearch products={products} />

          <div className="hidden lg:block">
            <ThemeToggle />
          </div>

          <Link
            href="/cart"
            className={cn(
              buttonVariants({
                variant: "primary",
                size: "md",
              }),
              "relative h-10 w-10 shrink-0 px-0 sm:h-11 sm:w-11 2xl:w-auto 2xl:px-4",
            )}
            aria-label={
              cartQuantity > 0
                ? `Open cart with ${cartQuantity} items`
                : "Open cart"
            }
          >
            <ShoppingBag className="h-4 w-4" />

            <span className="hidden 2xl:inline">
              Cart
            </span>

            {cartQuantity > 0 ? (
              <span className="absolute -right-1.5 -top-1.5 inline-flex min-w-5 items-center justify-center rounded-full border border-primary bg-background px-1 py-0.5 text-[9px] font-black leading-none !text-foreground shadow-[var(--shadow-card)] 2xl:static 2xl:ml-1 2xl:min-w-6 2xl:border-0 2xl:bg-primary-foreground/14 2xl:px-1.5 2xl:text-[10px] 2xl:!text-primary-foreground 2xl:shadow-none">
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