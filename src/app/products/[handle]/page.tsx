// This file renders a Shopify product detail page with synchronized variants, images, cart controls, and recommendations.
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/ui/container";
import { ProductPurchaseExperience } from "@/components/product/product-purchase-experience";
import { ProductCarousel } from "@/components/product/product-carousel";
import {
  getProductByHandle,
  getProducts,
  getRelatedProducts,
} from "@/lib/commerce/catalog";
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

  const product =
    await getProductByHandle(handle);

  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  const description =
    product.description ||
    product.title;

  return {
    title: product.title,
    description,
    openGraph: {
      title: product.title,
      description,
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

export default async function ProductPage({
  params,
}: ProductPageProps) {
  const { handle } = await params;

  const product =
    await getProductByHandle(handle);

  if (!product) {
    notFound();
  }

  const relatedProducts =
    await getRelatedProducts(product, 8);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="border-b border-border bg-secondary text-secondary-foreground">
        <Container className="flex items-center justify-center py-2 text-center text-[10px] font-semibold uppercase tracking-[0.24em]">
          Premium performance parts for
          serious builds
        </Container>
      </section>

      <Header />

      <Container className="py-8">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-foreground/60 transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to catalog
        </Link>
      </Container>

      <section className="pb-16 sm:pb-20">
        <Container>
          <ProductPurchaseExperience
            product={product}
            action={addToCartAction}
          />
        </Container>
      </section>

      {relatedProducts.length > 0 ? (
        <section className="border-t border-border bg-card py-14 sm:py-18">
          <Container>
            <div className="mb-8 max-w-2xl">
              <p className="text-xs font-black uppercase tracking-[0.24em] text-primary">
                Related products
              </p>

              <h2 className="mt-3 text-4xl font-black uppercase leading-none tracking-[-0.065em] text-foreground sm:text-5xl">
                You may also like.
              </h2>

              <p className="mt-4 text-base font-medium leading-7 text-foreground/70">
                Explore related products
                selected from the current
                Shopify catalog.
              </p>
            </div>

            <ProductCarousel
              products={relatedProducts}
              ariaLabel={`Related products for ${product.title}`}
            />
          </Container>
        </section>
      ) : null}

      <Footer />
    </main>
  );
}