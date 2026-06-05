// This file defines the branded route-aware loading screen shown while server-rendered storefront routes are loading.
"use client";

import { usePathname } from "next/navigation";

function getLoadingLabel(pathname: string | null) {
  if (!pathname || pathname === "/") {
    return "Loading";
  }

  const segments = pathname.split("/").filter(Boolean);
  const firstSegment = segments[0];

  if (firstSegment === "products" && segments.length > 1) {
    return "Loading product";
  }

  if (firstSegment === "products") {
    return "Loading catalog";
  }

  const pageName = firstSegment.replace(/-/g, " ");

  return `Loading ${pageName}`;
}

export function PageLoader() {
  const pathname = usePathname();
  const label = getLoadingLabel(pathname);

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 revnox-grid-bg opacity-20" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      <section className="relative flex flex-col items-center px-6 text-center">
        <div className="relative flex h-28 w-28 items-center justify-center sm:h-32 sm:w-32">
          <div className="absolute inset-0 rounded-full border border-border" />
          <div className="absolute inset-3 rounded-full border border-primary/20" />
          <div className="revnox-loader-ring absolute inset-0 rounded-full border-[3px] border-transparent border-r-primary/35 border-t-primary" />
          <div className="revnox-loader-ring-reverse absolute inset-5 rounded-full border-2 border-transparent border-b-primary/70" />

          <div className="relative flex h-14 w-14 items-center justify-center rounded-full border border-border bg-card shadow-[var(--shadow-card)]">
            <div className="h-5 w-5 rounded-full bg-primary shadow-[0_0_28px_color-mix(in_srgb,var(--primary)_70%,transparent)]" />
          </div>
        </div>

        <div className="mt-8">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-primary">
            Revnox Performance
          </p>

          <h1 className="mt-3 text-3xl font-black uppercase leading-none tracking-[-0.06em] text-foreground sm:text-5xl">
            {label}
          </h1>
        </div>

        <div className="mt-7 w-[260px] overflow-hidden border border-border bg-card sm:w-[340px]">
          <div className="relative h-1.5 bg-muted">
            <div className="revnox-loader-scan absolute inset-y-0 left-0 w-1/3 bg-primary" />
          </div>
        </div>

        <p className="mt-5 text-xs font-black uppercase tracking-[0.22em] text-foreground/55">
          Preparing page
        </p>
      </section>
    </main>
  );
}