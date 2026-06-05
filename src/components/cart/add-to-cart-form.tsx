// This file renders the controlled product-detail add-to-cart form
// with a responsive inline Shopify variant selector and inventory limits.
"use client";

import Link from "next/link";
import { Check, ChevronDown } from "lucide-react";
import type { KeyboardEvent } from "react";
import {
  useActionState,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import type { ProductVariant } from "@/lib/commerce/types";
import type { AddToCartActionState } from "@/app/cart/actions";
import { buttonVariants } from "@/components/ui/button";
import { formatMoney } from "@/lib/utils/money";
import { cn } from "@/lib/utils/cn";

type AddToCartFormProps = {
  variants: ProductVariant[];
  selectedVariantId: string;
  onVariantChange: (variantId: string) => void;
  action: (
    previousState: AddToCartActionState,
    formData: FormData,
  ) => Promise<AddToCartActionState>;
};

type VariantSelectorProps = {
  variants: ProductVariant[];
  selectedVariantId: string;
  onChange: (variantId: string) => void;
};

const initialAddToCartActionState: AddToCartActionState = {
  status: "idle",
  message: "",
  submittedAt: null,
};

function getStartingQuantity(variant?: ProductVariant) {
  if (!variant?.availableForSale || variant.quantityAvailable === 0) {
    return 0;
  }

  return 1;
}

function getVariantLabel(variant: ProductVariant) {
  const meaningfulOptions = variant.selectedOptions.filter(
    (option) =>
      !(option.name === "Title" && option.value === "Default Title"),
  );

  if (meaningfulOptions.length === 0) {
    return variant.title;
  }

  return meaningfulOptions
    .map((option) => `${option.name}: ${option.value}`)
    .join(" / ");
}

function getAvailabilityLabel(variant: ProductVariant) {
  if (!variant.availableForSale) {
    return "Unavailable";
  }

  if (typeof variant.quantityAvailable === "number") {
    if (variant.quantityAvailable <= 0) {
      return "Unavailable";
    }

    return `${variant.quantityAvailable} available`;
  }

  return "In stock";
}

export function AddToCartForm({
  variants,
  selectedVariantId,
  onVariantChange,
  action,
}: AddToCartFormProps) {
  const router = useRouter();
  const confirmationRef = useRef<HTMLDivElement>(null);

  const selectedVariant = useMemo(
    () =>
      variants.find((variant) => variant.id === selectedVariantId) ??
      variants[0],
    [selectedVariantId, variants],
  );

  const [state, formAction] = useActionState(
    action,
    initialAddToCartActionState,
  );

  const [quantity, setQuantity] = useState(() =>
    getStartingQuantity(selectedVariant),
  );

  const hasKnownLimit =
    typeof selectedVariant?.quantityAvailable === "number";

  const maxQuantity = hasKnownLimit
    ? selectedVariant?.quantityAvailable ?? 0
    : null;

  const canAddToCart =
    Boolean(selectedVariant?.availableForSale) &&
    (!hasKnownLimit || (maxQuantity !== null && maxQuantity > 0));

  const minimumQuantity = canAddToCart ? 1 : 0;

  const isAtLimit =
    canAddToCart &&
    hasKnownLimit &&
    maxQuantity !== null &&
    quantity >= maxQuantity;

  useEffect(() => {
    setQuantity(getStartingQuantity(selectedVariant));
  }, [selectedVariant]);

  useEffect(() => {
    if (state.status !== "success") {
      return;
    }

    router.refresh();

    window.setTimeout(() => {
      confirmationRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 120);
  }, [router, state.status, state.submittedAt]);

  return (
    <form action={formAction} className="mt-6 grid min-w-0 gap-4">
      <input
        type="hidden"
        name="variantId"
        value={selectedVariant?.id ?? ""}
      />

      <input type="hidden" name="quantity" value={quantity} />

      {variants.length > 1 ? (
        <div className="grid min-w-0 gap-2">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-foreground/65">
            Select option
          </p>

          <VariantSelector
            variants={variants}
            selectedVariantId={selectedVariantId}
            onChange={onVariantChange}
          />
        </div>
      ) : null}

      <div className="flex min-w-0 items-center justify-between gap-3 rounded-2xl border border-border bg-background p-3">
        <p className="min-w-0 pl-1 text-[11px] font-black uppercase tracking-[0.14em] text-foreground/65 sm:pl-2 sm:text-xs sm:tracking-[0.18em]">
          Quantity
        </p>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() =>
              setQuantity((current) =>
                Math.max(minimumQuantity, current - 1),
              )
            }
            disabled={!canAddToCart || quantity <= minimumQuantity}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-lg font-black text-foreground transition-colors hover:border-primary hover:text-primary disabled:pointer-events-none disabled:opacity-40"
            aria-label="Decrease quantity"
          >
            -
          </button>

          <output
            className="flex h-10 min-w-11 items-center justify-center rounded-full border border-border px-3 text-sm font-black text-foreground sm:min-w-12 sm:px-4"
            aria-live="polite"
          >
            {quantity}
          </output>

          <button
            type="button"
            onClick={() =>
              setQuantity((current) =>
                hasKnownLimit && maxQuantity !== null
                  ? Math.min(maxQuantity, current + 1)
                  : current + 1,
              )
            }
            disabled={!canAddToCart || isAtLimit}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-lg font-black text-foreground transition-colors hover:border-primary hover:text-primary disabled:pointer-events-none disabled:opacity-40"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
      </div>

      {isAtLimit ? (
        <p className="text-xs font-bold text-primary">
          Maximum available quantity reached.
        </p>
      ) : null}

      {!canAddToCart ? (
        <p className="text-xs font-bold text-foreground/60">
          This option is currently unavailable.
        </p>
      ) : null}

      <SubmitButton disabled={!canAddToCart} />

      {state.status !== "idle" ? (
        <div
          ref={confirmationRef}
          className={cn(
            "scroll-mt-28 rounded-2xl border p-4",
            state.status === "success"
              ? "border-primary/30 bg-primary/10"
              : "border-danger/30 bg-danger/10",
          )}
          role="status"
          aria-live="polite"
        >
          <p
            className={cn(
              "text-sm font-black uppercase tracking-[0.14em]",
              state.status === "success" ? "text-primary" : "text-danger",
            )}
          >
            {state.message}
          </p>

          {state.status === "success" ? (
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/products"
                className={cn(
                  buttonVariants({
                    variant: "outline",
                    size: "md",
                  }),
                  "w-full sm:w-auto",
                )}
              >
                Continue shopping
              </Link>

              <Link
                href="/cart"
                className={cn(
                  buttonVariants({
                    variant: "primary",
                    size: "md",
                  }),
                  "w-full sm:w-auto",
                )}
              >
                View cart
              </Link>
            </div>
          ) : null}
        </div>
      ) : null}
    </form>
  );
}

function VariantSelector({
  variants,
  selectedVariantId,
  onChange,
}: VariantSelectorProps) {
  const listboxId = useId();

  const selectorRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listboxRef = useRef<HTMLDivElement>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const [isOpen, setIsOpen] = useState(false);

  const selectedIndex = Math.max(
    variants.findIndex((variant) => variant.id === selectedVariantId),
    0,
  );

  const [highlightedIndex, setHighlightedIndex] = useState(selectedIndex);

  const selectedVariant = variants[selectedIndex];

  useEffect(() => {
    setHighlightedIndex(selectedIndex);
  }, [selectedIndex]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handleOutsideClick(event: PointerEvent) {
      if (
        selectorRef.current &&
        !selectorRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("pointerdown", handleOutsideClick);

    return () => {
      document.removeEventListener("pointerdown", handleOutsideClick);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    optionRefs.current[highlightedIndex]?.scrollIntoView({
      block: "nearest",
    });
  }, [highlightedIndex, isOpen]);

  function openSelector(preferredIndex = selectedIndex) {
    setHighlightedIndex(preferredIndex);
    setIsOpen(true);

    window.setTimeout(() => {
      listboxRef.current?.focus();
    }, 0);
  }

  function closeSelector(returnFocus = false) {
    setIsOpen(false);

    if (returnFocus) {
      window.setTimeout(() => {
        triggerRef.current?.focus();
      }, 0);
    }
  }

  function selectVariant(index: number) {
    const variant = variants[index];

    if (!variant) {
      return;
    }

    onChange(variant.id);
    closeSelector(true);
  }

  function handleTriggerKeyDown(
    event: KeyboardEvent<HTMLButtonElement>,
  ) {
    if (event.key === "ArrowDown") {
      event.preventDefault();

      openSelector(
        Math.min(selectedIndex + 1, variants.length - 1),
      );

      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();

      openSelector(Math.max(selectedIndex - 1, 0));

      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openSelector();
    }
  }

  function handleListboxKeyDown(
    event: KeyboardEvent<HTMLDivElement>,
  ) {
    if (event.key === "Escape") {
      event.preventDefault();
      closeSelector(true);
      return;
    }

    if (event.key === "Tab") {
      closeSelector();
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();

      setHighlightedIndex(
        (current) => (current + 1) % variants.length,
      );

      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();

      setHighlightedIndex(
        (current) =>
          (current - 1 + variants.length) % variants.length,
      );

      return;
    }

    if (event.key === "Home") {
      event.preventDefault();
      setHighlightedIndex(0);
      return;
    }

    if (event.key === "End") {
      event.preventDefault();
      setHighlightedIndex(variants.length - 1);
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      selectVariant(highlightedIndex);
    }
  }

  return (
    <div ref={selectorRef} className="min-w-0 max-w-full">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => {
          if (isOpen) {
            closeSelector();
          } else {
            openSelector();
          }
        }}
        onKeyDown={handleTriggerKeyDown}
        className={cn(
          "group flex min-h-14 w-full min-w-0 max-w-full items-center justify-between gap-3 overflow-hidden rounded-xl border bg-background px-4 py-3 text-left shadow-[var(--shadow-card)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          isOpen
            ? "border-primary"
            : "border-border hover:border-primary/70",
        )}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
      >
        <span className="min-w-0 flex-1 overflow-hidden">
          <span className="block text-[9px] font-black uppercase tracking-[0.15em] text-foreground/50 sm:text-[10px] sm:tracking-[0.18em]">
            Selected option
          </span>

          <span className="mt-1 block truncate text-sm font-black text-foreground sm:text-base">
            {getVariantLabel(selectedVariant)}
          </span>
        </span>

        <span className="flex shrink-0 items-center gap-2 sm:gap-3">
          <span className="hidden text-right md:block">
            <span className="block text-sm font-black text-foreground">
              {formatMoney(
                selectedVariant.price,
                selectedVariant.currencyCode,
              )}
            </span>

            <span
              className={cn(
                "mt-0.5 block text-[10px] font-black uppercase tracking-[0.12em]",
                selectedVariant.availableForSale
                  ? "text-primary"
                  : "text-foreground/45",
              )}
            >
              {getAvailabilityLabel(selectedVariant)}
            </span>
          </span>

          <ChevronDown
            className={cn(
              "h-5 w-5 shrink-0 text-foreground/55 transition-transform duration-200 group-hover:text-primary",
              isOpen && "rotate-180 text-primary",
            )}
            aria-hidden="true"
          />
        </span>
      </button>

      {isOpen ? (
        <div className="mt-2 min-w-0 max-w-full overflow-hidden rounded-xl border border-border bg-card shadow-[var(--shadow-card)]">
          <div className="flex items-center justify-between gap-3 border-b border-border bg-surface/60 px-4 py-3">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-foreground/55">
              Choose an option
            </p>

            <p className="text-[10px] font-bold text-foreground/45">
              {variants.length}{" "}
              {variants.length === 1 ? "option" : "options"}
            </p>
          </div>

          <div
            ref={listboxRef}
            id={listboxId}
            role="listbox"
            tabIndex={-1}
            aria-activedescendant={`${listboxId}-option-${highlightedIndex}`}
            onKeyDown={handleListboxKeyDown}
            className="revnox-sidebar-scroll max-h-[18rem] overflow-x-hidden overflow-y-auto p-2 outline-none sm:max-h-[20rem]"
          >
            {variants.map((variant, index) => {
              const isSelected =
                variant.id === selectedVariantId;

              const isHighlighted =
                index === highlightedIndex;

              return (
                <button
                  key={variant.id}
                  ref={(element) => {
                    optionRefs.current[index] = element;
                  }}
                  id={`${listboxId}-option-${index}`}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  onFocus={() => setHighlightedIndex(index)}
                  onClick={() => selectVariant(index)}
                  className={cn(
                    "mb-1 grid w-full min-w-0 grid-cols-[auto_minmax(0,1fr)] gap-3 overflow-hidden rounded-lg border px-3 py-3 text-left transition-colors last:mb-0 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center sm:px-4",
                    isHighlighted
                      ? "border-border bg-muted"
                      : "border-transparent bg-card hover:bg-muted/70",
                    isSelected &&
                      "border-primary/35 bg-primary/10",
                  )}
                >
                  <span
                    className={cn(
                      "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border sm:mt-0 sm:h-8 sm:w-8",
                      isSelected
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background text-transparent",
                    )}
                  >
                    <Check className="h-4 w-4" aria-hidden="true" />
                  </span>

                  <span className="min-w-0 overflow-hidden">
                    <span className="block break-words text-sm font-black leading-5 text-foreground sm:text-base">
                      {getVariantLabel(variant)}
                    </span>

                    <span
                      className={cn(
                        "mt-1 block text-[10px] font-black uppercase tracking-[0.12em]",
                        variant.availableForSale
                          ? "text-primary"
                          : "text-foreground/45",
                      )}
                    >
                      {getAvailabilityLabel(variant)}
                    </span>

                    <span className="mt-2 flex flex-wrap items-baseline gap-2 sm:hidden">
                      <span className="text-sm font-black text-foreground">
                        {formatMoney(
                          variant.price,
                          variant.currencyCode,
                        )}
                      </span>

                      {variant.compareAtPrice ? (
                        <span className="text-xs font-bold text-foreground/45 line-through">
                          {formatMoney(
                            variant.compareAtPrice,
                            variant.currencyCode,
                          )}
                        </span>
                      ) : null}
                    </span>
                  </span>

                  <span className="hidden shrink-0 text-right sm:block">
                    <span className="block text-sm font-black text-foreground">
                      {formatMoney(
                        variant.price,
                        variant.currencyCode,
                      )}
                    </span>

                    {variant.compareAtPrice ? (
                      <span className="mt-1 block text-xs font-bold text-foreground/45 line-through">
                        {formatMoney(
                          variant.compareAtPrice,
                          variant.currencyCode,
                        )}
                      </span>
                    ) : null}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="hidden border-t border-border bg-surface/50 px-4 py-2.5 sm:block">
            <p className="text-center text-[9px] font-black uppercase tracking-[0.14em] text-foreground/40">
              Use arrow keys and Enter to select
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function SubmitButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={disabled || pending}
      className={cn(
        buttonVariants({
          variant: "primary",
          size: "lg",
        }),
        "w-full",
      )}
    >
      {pending
        ? "Adding..."
        : disabled
          ? "Unavailable"
          : "Add to cart"}
    </button>
  );
}