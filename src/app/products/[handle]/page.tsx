// This file renders the Shopify-powered product detail page for a single product handle.
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  Truck,
  Wrench,
  ElementType,
} from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/ui/container";
import { ProductDetailGallery } from "@/components/product/product-detail-gallery";
import { ProductVariantList } from "@/components/product/product-variant-list";
import { getProductByHandle, getProducts } from "@/lib/commerce/catalog";
import { formatMoney } from "@/lib/utils/money";
import { AddToCartForm } from "@/components/cart/add-to-cart-form";
import { addToCartAction } from "@/app/cart/actions";

type ProductPageProps = {
  params: Promise<{
    handle: string;
  }>;
};

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { handle } = await params;
  const product = await getProductByHandle(handle);

  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  return {
    title: product.title,
    description: product.description,
    openGraph: {
      title: product.title,
      description: product.description,
      images: [
        {
          url: product.image,
          alt: product.imageAlt,
        },
      ],
    },
  };
}

export async function generateStaticParams() {
  const products = await getProducts();

  return products.map((product) => ({
    handle: product.handle,
  }));
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { handle } = await params;
  const product = await getProductByHandle(handle);

  if (!product) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="border-b border-border bg-secondary text-secondary-foreground">
        <Container className="flex items-center justify-center py-2 text-center text-[10px] font-semibold uppercase tracking-[0.24em]">
          Premium performance parts for serious builds
        </Container>
      </section>

      <Header />

      <Container className="py-8">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to catalog
        </Link>
      </Container>

      <section className="pb-20">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1fr_0.9fr] lg:items-start">
            <ProductDetailGallery product={product} />

            <div className="lg:sticky lg:top-28">
              <div className="rounded-[2rem] border border-border bg-card p-6 sm:p-8">
                <div className="mb-5 flex flex-wrap gap-2">
                  <span className="rounded-full bg-primary px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-primary-foreground">
                    {product.category}
                  </span>
                  {product.badge ? (
                    <span className="rounded-full border border-border px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">
                      {product.badge}
                    </span>
                  ) : null}
                </div>

                <p className="text-xs font-black uppercase tracking-[0.22em] text-muted-foreground">
                  {product.brand}
                </p>

                <h1 className="mt-3 text-4xl font-black uppercase leading-[0.95] tracking-[-0.07em] sm:text-5xl">
                  {product.title}
                </h1>

                <div className="mt-6 flex flex-wrap items-end gap-3">
                  <p className="text-4xl font-black tracking-[-0.06em]">
                    {formatMoney(product.price, product.currencyCode)}
                  </p>

                  {product.compareAtPrice ? (
                    <p className="text-lg font-bold text-muted-foreground line-through">
                      {formatMoney(
                        product.compareAtPrice,
                        product.currencyCode,
                      )}
                    </p>
                  ) : null}
                </div>

                <p className="mt-6 text-base leading-8 text-muted-foreground">
                  {product.description}
                </p>

                <div className="mt-8 grid gap-3">
                  {[
                    "Shopify-powered product data",
                    "Published through the Headless sales channel",
                    "Structured for cart and checkout integration",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 rounded-2xl border border-border bg-background p-4 text-sm font-bold text-muted-foreground"
                    >
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" />
                      {item}
                    </div>
                  ))}
                </div>

                <AddToCartForm
                  variants={product.variants}
                  action={addToCartAction}
                />

                <Link
                  href={`/products?category=${product.categoryHandle}`}
                  className="mt-3 inline-flex w-full items-center justify-center rounded-full border border-border bg-background px-6 py-4 text-sm font-black uppercase tracking-[0.18em] text-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  View similar
                </Link>

                <p className="mt-4 text-xs leading-5 text-muted-foreground">
                  Cart action will connect in the next phase. Product data,
                  variants, and merchandising are already coming from Shopify.
                </p>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <DetailSignal
                  icon={Wrench}
                  title="Fitment"
                  text="Built for precise product decisions."
                />
                <DetailSignal
                  icon={Truck}
                  title="Delivery"
                  text="Ready for Shopify checkout flow."
                />
                <DetailSignal
                  icon={ShieldCheck}
                  title="Secure"
                  text="Commerce backend powered by Shopify."
                />
              </div>
            </div>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_0.9fr]">
            <ProductVariantList variants={product.variants} />

            <div className="rounded-[1.5rem] border border-border bg-card p-5">
              <h2 className="text-xs font-black uppercase tracking-[0.22em] text-muted-foreground">
                Product tags
              </h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-border bg-background px-3 py-2 text-xs font-bold text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      <Footer />
    </main>
  );
}

function DetailSignal({
  icon: Icon,
  title,
  text,
}: {
  icon: ElementType;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 ">
      <Icon className="mb-3 h-5 w-5 text-primary" />
      <h2 className="text-xs font-black uppercase tracking-[0.18em]">
        {title}
      </h2>
      <p className="mt-2 text-xs leading-5 text-muted-foreground">{text}</p>
    </div>
  );
}
