// This file defines the main storefront footer with responsive image branding, navigation, and customer-service links.
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/container";

const shopLinks = [
  { label: "Wheels", href: "/products?category=wheels" },
  { label: "Braking", href: "/products?category=braking" },
  { label: "Suspension", href: "/products?category=suspension" },
  { label: "Exhaust", href: "/products?category=exhaust" },
  { label: "Intake & Engine", href: "/products?category=intake-engine" },
];

const companyLinks = [
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Journal", href: "/journal" },
  { label: "Fitment", href: "/fitment" },
];

const supportLinks = [
  { label: "Shipping", href: "/shipping" },
  { label: "Returns", href: "/returns" },
  { label: "Order Status", href: "/order-status" },
  { label: "Customer Support", href: "/contact" },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-footer text-footer-foreground">
      <Container className="grid gap-12 py-14 lg:grid-cols-[1.15fr_2fr] lg:gap-16">
        <div>
          <Link
            href="/"
            className="inline-flex items-center"
            aria-label="Go to Revnox Performance homepage"
          >
            <Image
              src="/revnox-logo-transparent-darkmode.png"
              alt="Revnox Performance"
              width={240}
              height={86}
              className="h-auto w-[170px] object-contain"
            />
          </Link>

          <p className="mt-5 max-w-sm text-base font-medium leading-7 text-footer-muted">
            Premium performance parts for drivers who care about fitment,
            control, finish, and the buying experience.
          </p>
        </div>

        <div className="grid gap-9 sm:grid-cols-3">
          <FooterColumn title="Shop" items={shopLinks} />
          <FooterColumn title="Company" items={companyLinks} />
          <FooterColumn title="Support" items={supportLinks} />
        </div>
      </Container>

      <Container className="border-t border-white/10 py-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-footer-muted">
          © {new Date().getFullYear()} Revnox Performance. All rights reserved.
        </p>
      </Container>
    </footer>
  );
}

function FooterColumn({
  title,
  items,
}: {
  title: string;
  items: { label: string; href: string }[];
}) {
  return (
    <div>
      <h2 className="text-sm font-black uppercase tracking-[0.22em] text-footer-foreground">
        {title}
      </h2>

      <div className="mt-5 grid gap-3.5">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="text-base font-medium text-footer-muted transition-colors hover:text-footer-foreground"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}