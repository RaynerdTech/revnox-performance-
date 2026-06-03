// This file defines the mobile navigation drawer used by the storefront header.
"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils/cn";

const navItems = [
    { label: "Shop", href: "/products" },
  { label: "Wishlist", href: "/wishlist" },
  { label: "Brands", href: "/brands" },
  { label: "Fitment", href: "/fitment" },
  { label: "Journal", href: "/journal" },
  { label: "Contact", href: "/contact" },
];

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card text-card-foreground transition-colors hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label={isOpen ? "Close mobile menu" : "Open mobile menu"}
        aria-expanded={isOpen}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      <div
        className={cn(
          "absolute left-0 right-0 top-20 border-b border-border bg-background/96 px-4 py-5 shadow-[var(--shadow-soft)] backdrop-blur-xl transition-all duration-200",
          isOpen
            ? "visible translate-y-0 opacity-100"
            : "invisible -translate-y-3 opacity-0",
        )}
      >
        <nav className="grid gap-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className="rounded-2xl border border-border bg-card px-5 py-4 text-sm font-black uppercase tracking-[0.18em] text-card-foreground transition-colors hover:border-primary hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}