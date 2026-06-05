// This file defines the branded route-aware loading screen shown while server-rendered storefront routes are loading.
"use client";

import { usePathname } from "next/navigation";

function getLoadingLabel(pathname: string | null) {
  if (!pathname || pathname === "/") return "Loading";
  const segments = pathname.split("/").filter(Boolean);
  const firstSegment = segments[0];
  if (firstSegment === "products" && segments.length > 1) return "Loading product";
  if (firstSegment === "products") return "Loading catalog";
  return `Loading ${firstSegment.replace(/-/g, " ")}`;
}

export function PageLoader() {
  const pathname = usePathname();
  const label = getLoadingLabel(pathname);

  return (
    <main
      style={{
        position: "relative",
        display: "flex",
        minHeight: "100svh",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        backgroundColor: "var(--background)",
        color: "var(--foreground)",
      }}
    >
      {/* Subtle noise grain overlay */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
          backgroundSize: "160px 160px",
          opacity: 0.025,
          pointerEvents: "none",
        }}
      />

      {/* Far-left vertical rule */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          left: "clamp(24px, 4vw, 64px)",
          top: 0,
          bottom: 0,
          width: "1px",
          background:
            "linear-gradient(to bottom, transparent 0%, var(--border) 20%, var(--border) 80%, transparent 100%)",
          opacity: 0.4,
        }}
      />

      {/* Far-right vertical rule */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          right: "clamp(24px, 4vw, 64px)",
          top: 0,
          bottom: 0,
          width: "1px",
          background:
            "linear-gradient(to bottom, transparent 0%, var(--border) 20%, var(--border) 80%, transparent 100%)",
          opacity: 0.4,
        }}
      />

      {/* Content */}
      <section
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          width: "min(640px, calc(100vw - 48px))",
        }}
      >
        {/* Brand eyebrow */}
        <p
          style={{
            margin: 0,
            fontSize: "10px",
            fontWeight: 900,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "var(--primary)",
            opacity: 0.9,
            animation: "rvx-fadein 0.6s ease forwards",
          }}
        >
          Revnox Performance
        </p>

        {/* Divider under eyebrow */}
        <div
          aria-hidden
          style={{
            marginTop: "14px",
            width: "32px",
            height: "1px",
            backgroundColor: "var(--primary)",
            opacity: 0.5,
            animation: "rvx-fadein 0.6s 0.1s ease both",
          }}
        />

        {/* Page title */}
        <h1
          style={{
            margin: "18px 0 0",
            fontSize: "clamp(2.4rem, 6vw, 4.5rem)",
            fontWeight: 900,
            letterSpacing: "-0.045em",
            lineHeight: 0.92,
            textTransform: "uppercase",
            color: "var(--foreground)",
            animation: "rvx-fadein 0.7s 0.15s ease both",
          }}
        >
          {label}
        </h1>

        {/* Gauge track */}
        <div
          aria-hidden
          style={{
            position: "relative",
            marginTop: "52px",
            width: "100%",
            height: "2px",
            backgroundColor: "color-mix(in srgb, var(--foreground) 8%, transparent)",
            animation: "rvx-fadein 0.5s 0.3s ease both",
            opacity: 0,
          }}
        >
          {/* Tick marks */}
          {Array.from({ length: 21 }).map((_, i) => (
            <div
              key={i}
              aria-hidden
              style={{
                position: "absolute",
                top: i % 5 === 0 ? "-7px" : "-4px",
                left: `${(i / 20) * 100}%`,
                width: "1px",
                height: i % 5 === 0 ? "8px" : "5px",
                backgroundColor: "var(--border)",
                opacity: i % 5 === 0 ? 0.7 : 0.35,
                transform: "translateX(-50%)",
              }}
            />
          ))}

          {/* Sweeping fill */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to right, var(--primary) 0%, color-mix(in srgb, var(--primary) 60%, transparent) 100%)",
              transformOrigin: "left center",
              animation: "rvx-sweep 2.4s cubic-bezier(0.4, 0, 0.2, 1) infinite",
            }}
          />

          {/* Glowing cursor head */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              transform: "translateY(-50%)",
              width: "3px",
              height: "14px",
              borderRadius: "2px",
              backgroundColor: "var(--primary)",
              boxShadow:
                "0 0 12px color-mix(in srgb, var(--primary) 80%, transparent), 0 0 28px color-mix(in srgb, var(--primary) 50%, transparent)",
              animation: "rvx-cursor 2.4s cubic-bezier(0.4, 0, 0.2, 1) infinite",
            }}
          />
        </div>

        {/* Status row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginTop: "20px",
            animation: "rvx-fadein 0.5s 0.4s ease both",
            opacity: 0,
          }}
        >
          {/* Breathing dot */}
          <span
            style={{
              display: "inline-block",
              width: "5px",
              height: "5px",
              borderRadius: "50%",
              backgroundColor: "var(--primary)",
              animation: "rvx-breathe 1.8s ease-in-out infinite",
            }}
          />
          <p
            style={{
              margin: 0,
              fontSize: "10px",
              fontWeight: 900,
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "var(--foreground)",
              opacity: 0.4,
            }}
          >
            Preparing page
          </p>
        </div>
      </section>

      <style>{`
        @keyframes rvx-fadein {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        @keyframes rvx-sweep {
          0%   { transform: scaleX(0); }
          60%  { transform: scaleX(1); }
          100% { transform: scaleX(1); opacity: 0; }
        }

        @keyframes rvx-cursor {
          0%   { left: 0%; }
          60%  { left: calc(100% - 3px); }
          100% { left: calc(100% - 3px); opacity: 0; }
        }

        @keyframes rvx-breathe {
          0%, 100% { opacity: 0.4; transform: scale(0.85); }
          50%       { opacity: 1;   transform: scale(1.15); }
        }
      `}</style>
    </main>
  );
}