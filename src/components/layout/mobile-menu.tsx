// This file renders the responsive navigation drawer outside the header
// so it always covers the full viewport.
"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { createPortal } from "react-dom";
import {
  useEffect,
  useRef,
  useState,
} from "react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
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
  const pathname = usePathname();

  const triggerRef =
    useRef<HTMLButtonElement>(null);

  const closeButtonRef =
    useRef<HTMLButtonElement>(null);

  const drawerRef =
    useRef<HTMLElement>(null);

  const [mounted, setMounted] =
    useState(false);

  const [isOpen, setIsOpen] =
    useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousBodyOverflow =
      document.body.style.overflow;

    const previousHtmlOverflow =
      document.documentElement.style
        .overflow;

    const previousBodyPaddingRight =
      document.body.style.paddingRight;

    const scrollbarWidth =
      window.innerWidth -
      document.documentElement.clientWidth;

    document.body.style.overflow =
      "hidden";

    document.documentElement.style.overflow =
      "hidden";

    if (scrollbarWidth > 0) {
      document.body.style.paddingRight =
        `${scrollbarWidth}px`;
    }

    const focusFrame =
      window.requestAnimationFrame(() => {
        closeButtonRef.current?.focus();
      });

    function handleKeyDown(
      event: KeyboardEvent,
    ) {
      if (event.key === "Escape") {
        setIsOpen(false);
        return;
      }

      if (
        event.key !== "Tab" ||
        !drawerRef.current
      ) {
        return;
      }

      const focusableElements =
        Array.from(
          drawerRef.current.querySelectorAll<
            HTMLElement
          >(
            'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
          ),
        );

      if (
        focusableElements.length === 0
      ) {
        return;
      }

      const firstElement =
        focusableElements[0];

      const lastElement =
        focusableElements[
          focusableElements.length - 1
        ];

      if (
        event.shiftKey &&
        document.activeElement ===
          firstElement
      ) {
        event.preventDefault();
        lastElement.focus();
      } else if (
        !event.shiftKey &&
        document.activeElement ===
          lastElement
      ) {
        event.preventDefault();
        firstElement.focus();
      }
    }

    function handleResize() {
      if (window.innerWidth >= 1280) {
        setIsOpen(false);
      }
    }

    window.addEventListener(
      "keydown",
      handleKeyDown,
    );

    window.addEventListener(
      "resize",
      handleResize,
    );

    return () => {
      window.cancelAnimationFrame(
        focusFrame,
      );

      document.body.style.overflow =
        previousBodyOverflow;

      document.documentElement.style.overflow =
        previousHtmlOverflow;

      document.body.style.paddingRight =
        previousBodyPaddingRight;

      window.removeEventListener(
        "keydown",
        handleKeyDown,
      );

      window.removeEventListener(
        "resize",
        handleResize,
      );
    };
  }, [isOpen]);

  function closeMenu(
    restoreFocus = false,
  ) {
    setIsOpen(false);

    if (restoreFocus) {
      window.setTimeout(() => {
        triggerRef.current?.focus();
      }, 0);
    }
  }

  const drawer =
    mounted
      ? createPortal(
          <div
            className={cn(
              "fixed inset-0 z-[9999] xl:hidden",
              isOpen
                ? "visible pointer-events-auto"
                : "invisible pointer-events-none",
            )}
            aria-hidden={!isOpen}
          >
            <button
              type="button"
              onClick={() =>
                closeMenu(true)
              }
              className={cn(
                "absolute inset-0 cursor-default bg-black/70 backdrop-blur-sm transition-opacity duration-300",
                isOpen
                  ? "opacity-100"
                  : "opacity-0",
              )}
              aria-label="Close navigation menu"
              tabIndex={isOpen ? 0 : -1}
            />

            <aside
              ref={drawerRef}
              id="storefront-navigation-drawer"
              className={cn(
                "absolute inset-y-0 right-0 flex h-[100dvh] w-[min(92vw,420px)] max-w-full flex-col overflow-hidden border-l border-border bg-background shadow-[var(--shadow-soft)] transition-transform duration-300 ease-out",
                isOpen
                  ? "translate-x-0"
                  : "translate-x-full",
              )}
              role="dialog"
              aria-modal="true"
              aria-label="Storefront navigation"
            >
              <div className="flex shrink-0 items-center justify-between gap-4 border-b border-border px-5 py-5">
                <div className="min-w-0">
                  <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">
                    Navigation
                  </p>

                  <h2 className="mt-1 text-xl font-black uppercase leading-none tracking-[-0.05em] sm:text-2xl">
                    Explore Revnox
                  </h2>
                </div>

                <button
                  ref={closeButtonRef}
                  type="button"
                  onClick={() =>
                    closeMenu(true)
                  }
                  className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border bg-card text-card-foreground transition-colors hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  aria-label="Close navigation menu"
                  tabIndex={
                    isOpen ? 0 : -1
                  }
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="revnox-sidebar-scroll flex-1 overscroll-contain overflow-x-hidden overflow-y-auto px-4 py-5 sm:px-5">
                <nav className="grid gap-2">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() =>
                        closeMenu()
                      }
                      tabIndex={
                        isOpen ? 0 : -1
                      }
                      className="flex min-h-13 items-center border border-border bg-card px-5 py-4 text-sm font-black uppercase tracking-[0.16em] text-card-foreground transition-colors hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>

                <div className="mt-6 border-t border-border pt-6">
                  <p className="mb-3 text-[10px] font-black uppercase tracking-[0.2em] text-foreground/50">
                    Appearance
                  </p>

                  <ThemeToggle />
                </div>
              </div>
            </aside>
          </div>,
          document.body,
        )
      : null;

  return (
    <div className="xl:hidden">
      <button
        ref={triggerRef}
        type="button"
        onClick={() =>
          setIsOpen(true)
        }
        className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-card text-card-foreground transition-colors hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:h-11 sm:w-11"
        aria-label="Open navigation menu"
        aria-expanded={isOpen}
        aria-controls="storefront-navigation-drawer"
      >
        <Menu className="h-5 w-5" />
      </button>

      {drawer}
    </div>
  );
}