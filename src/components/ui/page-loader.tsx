// This file defines the branded loading screen shown while server-rendered storefront routes are loading.
import Image from "next/image";
import logo from "@/images/revnox-logo.png";

type PageLoaderProps = {
  label?: string;
};

export function PageLoader({ label = "Loading storefront" }: PageLoaderProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 text-foreground">
      <div className="flex flex-col items-center text-center">
        <div className="relative flex h-28 w-28 items-center justify-center rounded-[2rem] border border-border bg-card shadow-[var(--shadow-soft)]">
          <div className="absolute inset-0 rounded-[2rem] border border-primary/30 opacity-70 revnox-loader-pulse" />
          <Image
            src={logo}
            alt="Revnox Performance"
            priority
            className="h-auto w-20 object-contain"
          />
        </div>

        <p className="mt-6 text-xs font-black uppercase tracking-[0.28em] text-primary">
          Revnox Performance
        </p>

        <h1 className="mt-3 text-2xl font-black uppercase tracking-[-0.05em]">
          {label}
        </h1>

        <div className="mt-6 h-1.5 w-44 overflow-hidden rounded-full bg-muted">
          <div className="h-full w-1/2 rounded-full bg-primary revnox-loader-bar" />
        </div>
      </div>
    </main>
  );
}