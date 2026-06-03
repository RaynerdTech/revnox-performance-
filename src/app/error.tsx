// This file renders a premium recoverable storefront error screen with mobile-safe retry and navigation controls.
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowRight, RefreshCw, Signal, WifiOff } from "lucide-react";
import logo from "@/images/revnox-logo.png";

export default function Error({
  error,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [isOnline, setIsOnline] = useState(true);
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    console.error("Storefront route error:", error);

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
    if (!isOnline) return;

    setIsRetrying(true);
    window.location.reload();
  }

  function handleOpenCatalog() {
    if (!isOnline) return;

    window.location.href = "/products";
  }

  return (
    <main className="relative z-[9999] min-h-screen overflow-hidden bg-background text-foreground">
      <div className="absolute inset-0 revnox-grid-bg opacity-40" />
      <div className="absolute left-1/2 top-0 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-primary/12 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-[360px] w-[360px] rounded-full bg-muted/80 blur-3xl dark:bg-primary/10" />

      <section className="relative flex min-h-screen items-center justify-center px-5 py-10">
        <div className="w-full max-w-xl overflow-hidden rounded-[2rem] border border-border bg-card/92 shadow-[var(--shadow-soft)] backdrop-blur-xl">
          <div className="border-b border-border bg-surface/70 px-6 py-5 sm:px-8">
            <div className="flex items-center justify-between gap-4">
              <Image
                src={logo}
                alt="Revnox Performance"
                className="h-auto w-32 object-contain"
                priority
              />

              <div className="flex items-center gap-2 rounded-full border border-border bg-background px-3 py-2">
                {isOnline ? (
                  <Signal className="h-4 w-4 text-primary" />
                ) : (
                  <WifiOff className="h-4 w-4 text-danger" />
                )}
                <span className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">
                  {isOnline ? "Online" : "Offline"}
                </span>
              </div>
            </div>
          </div>

          <div className="px-6 py-8 sm:px-8 sm:py-10">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-primary">
              Connection interrupted
            </p>

            <h1 className="mt-4 text-4xl font-black uppercase leading-[0.95] tracking-[-0.07em] sm:text-5xl">
              Storefront request did not complete.
            </h1>

            <p className="mt-5 max-w-md text-sm leading-7 text-muted-foreground sm:text-base">
              The page could not finish loading because the network request was
              interrupted. Once your connection is back, reload the storefront or
              return to the catalog.
            </p>

            <div className="mt-7 grid gap-3 rounded-[1.5rem] border border-border bg-background p-4">
              <StatusRow
                label="Network"
                value={isOnline ? "Connection restored" : "Waiting for connection"}
                strong={isOnline}
              />
              <StatusRow
                label="Action"
                value={isOnline ? "Retry is available" : "Reconnect before retrying"}
                strong={isOnline}
              />
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={handleRetry}
                disabled={!isOnline || isRetrying}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-xs font-black uppercase tracking-[0.18em] text-primary-foreground shadow-[var(--shadow-card)] transition-transform duration-200 hover:-translate-y-0.5 disabled:pointer-events-none disabled:opacity-50"
              >
                <RefreshCw
                  className={`h-4 w-4 ${isRetrying ? "animate-spin" : ""}`}
                />
                {isRetrying
                  ? "Reloading"
                  : isOnline
                    ? "Try again"
                    : "Offline"}
              </button>

              <button
                type="button"
                onClick={handleOpenCatalog}
                disabled={!isOnline}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-xs font-black uppercase tracking-[0.18em] text-foreground transition-colors hover:border-primary hover:text-primary disabled:pointer-events-none disabled:opacity-50"
              >
                Open catalog
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            <p className="mt-6 text-xs leading-6 text-muted-foreground">
              This screen protects the shopping experience from temporary network
              or Shopify response interruptions.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

function StatusRow({
  label,
  value,
  strong,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </p>
      <p
        className={
          strong
            ? "text-right text-sm font-black text-primary"
            : "text-right text-sm font-black text-muted-foreground"
        }
      >
        {value}
      </p>
    </div>
  );
}