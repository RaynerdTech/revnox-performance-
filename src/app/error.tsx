// This file renders a concise, recoverable storefront error screen.
"use client";

import Image from "next/image";
import Link from "next/link";
import { RefreshCw, ShoppingBag, WifiOff } from "lucide-react";
import { useEffect, useState } from "react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function Error({ error }: ErrorPageProps) {
  const [isOnline, setIsOnline] = useState(true);
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    console.error("Storefront route error:", {
      error,
      digest: error.digest,
    });

    function updateOnlineStatus() {
      setIsOnline(window.navigator.onLine);
    }

    updateOnlineStatus();

    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);

    return () => {
      window.removeEventListener("online", updateOnlineStatus);
      window.removeEventListener("offline", updateOnlineStatus);
    };
  }, [error]);

  function handleRetry() {
    if (!isOnline || isRetrying) return;

    setIsRetrying(true);

    // Perform a full request so failed server data is fetched again.
    window.location.reload();
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-5 py-10 text-foreground">
      <div className="pointer-events-none absolute inset-0 revnox-grid-bg opacity-25" />

      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl" />

      <section
        className="relative w-full max-w-lg border border-border bg-card p-6 shadow-[var(--shadow-soft)] sm:p-8"
        role="alert"
        aria-live="assertive"
      >
        <Link
          href="/"
          className="inline-flex items-center"
          aria-label="Go to Revnox Performance homepage"
        >
          <Image
            src="/revnox-logo-transparent-trimmed.png"
            alt="Revnox Performance"
            width={220}
            height={78}
            priority
            className="block h-auto w-[145px] object-contain dark:hidden"
          />

          <Image
            src="/revnox-logo-transparent-darkmode.png"
            alt="Revnox Performance"
            width={220}
            height={78}
            priority
            className="hidden h-auto w-[145px] object-contain dark:block"
          />
        </Link>

        <div className="mt-8">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-primary">
            {isOnline ? "Something went wrong" : "You are offline"}
          </p>

          <h1 className="mt-3 text-4xl font-black uppercase leading-[0.92] tracking-[-0.065em] text-foreground sm:text-5xl">
            {isOnline
              ? "We couldn’t load this page."
              : "Check your connection."}
          </h1>

          <p className="mt-5 max-w-md text-base font-medium leading-7 text-foreground/70">
            {isOnline
              ? "Try loading the page again, or return to the product catalog."
              : "Reconnect to the internet, then try loading the page again."}
          </p>
        </div>

        {!isOnline ? (
          <div className="mt-6 flex items-center gap-3 border border-danger/30 bg-danger/10 p-4">
            <WifiOff
              className="h-5 w-5 shrink-0 text-danger"
              aria-hidden="true"
            />

            <p className="text-sm font-bold text-foreground">
              No internet connection detected.
            </p>
          </div>
        ) : null}

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={handleRetry}
            disabled={!isOnline || isRetrying}
            className={cn(
              buttonVariants({ variant: "primary", size: "lg" }),
              "w-full",
            )}
          >
            <RefreshCw
              className={cn("h-4 w-4", isRetrying && "animate-spin")}
              aria-hidden="true"
            />

            {isRetrying ? "Reloading" : "Try again"}
          </button>

          <Link
            href="/products"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "w-full",
            )}
          >
            <ShoppingBag className="h-4 w-4" aria-hidden="true" />
            View products
          </Link>
        </div>
      </section>
    </main>
  );
}