// This file defines the reusable button component and button style variants for the storefront.
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-none font-black uppercase tracking-[0.16em] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-primary-foreground shadow-[var(--shadow-card)] hover:-translate-y-0.5 active:translate-y-0",
        secondary:
          "bg-secondary text-secondary-foreground shadow-[var(--shadow-card)] hover:-translate-y-0.5 active:translate-y-0",
        outline:
          "border border-border bg-transparent text-foreground hover:border-primary hover:text-primary",
        ghost:
          "bg-transparent text-muted-foreground hover:bg-muted hover:text-foreground",
        danger:
          "bg-danger text-danger-foreground shadow-[var(--shadow-card)] hover:-translate-y-0.5 active:translate-y-0",
        link:
          "rounded-none px-0 py-0 text-foreground underline-offset-4 hover:text-primary hover:underline",
        icon:
          "border border-border bg-card text-card-foreground hover:border-primary hover:text-primary",
      },
      size: {
        sm: "h-9 px-4 text-[11px]",
        md: "h-11 px-5 text-xs",
        lg: "h-12 px-7 text-sm",
        icon: "h-11 w-11 px-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    loading?: boolean;
  };

export function Button({
  className,
  variant,
  size,
  loading = false,
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
      {children}
    </button>
  );
}

export { buttonVariants };