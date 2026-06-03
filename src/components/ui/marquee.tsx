// This file defines the premium automotive marquee used for subtle homepage motion.
const marqueeItems = [
  "Forged wheels",
  "Brake upgrades",
  "Suspension systems",
  "Performance exhaust",
  "Carbon intake",
  "Fitment-focused catalog",
  "Secure Shopify checkout",
  "Premium auto parts",
];

export function Marquee() {
  const repeatedItems = [...marqueeItems, ...marqueeItems];

  return (
    <section className="overflow-hidden border-y border-border bg-footer text-footer-foreground">
      <div className="revnox-marquee-track flex w-max items-center gap-10 py-4">
        {repeatedItems.map((item, index) => (
          <div
            key={`${item}-${index}`}
            className="flex items-center gap-10 text-xs font-black uppercase tracking-[0.28em] text-footer-muted"
          >
            <span>{item}</span>
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          </div>
        ))}
      </div>
    </section>
  );
}