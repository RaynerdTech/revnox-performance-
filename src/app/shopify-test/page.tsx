// This file renders a private development page for confirming Shopify product data is connected correctly.
import { getBestSellingProducts, getCategories, getFeaturedProducts, getProducts } from "@/lib/commerce/catalog";

export default async function ShopifyTestPage() {
  const [products, categories, featuredProducts, bestSellingProducts] =
    await Promise.all([
      getProducts(),
      getCategories(),
      getFeaturedProducts(),
      getBestSellingProducts(),
    ]);

  return (
    <main className="min-h-screen bg-background px-6 py-10 text-foreground">
      <div className="mx-auto max-w-5xl">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-primary">
          Shopify connection test
        </p>
        <h1 className="mt-3 text-4xl font-black uppercase tracking-[-0.06em]">
          Storefront API is connected.
        </h1>

        <div className="mt-8 grid gap-4 sm:grid-cols-4">
          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="text-sm text-muted-foreground">Products</p>
            <p className="mt-2 text-3xl font-black">{products.length}</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="text-sm text-muted-foreground">Categories</p>
            <p className="mt-2 text-3xl font-black">{categories.length}</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="text-sm text-muted-foreground">Featured</p>
            <p className="mt-2 text-3xl font-black">{featuredProducts.length}</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="text-sm text-muted-foreground">Best sellers</p>
            <p className="mt-2 text-3xl font-black">
              {bestSellingProducts.length}
            </p>
          </div>
        </div>

        <div className="mt-10 rounded-2xl border border-border bg-card p-6">
          <h2 className="text-xl font-black uppercase tracking-[-0.04em]">
            First products
          </h2>

          <div className="mt-5 divide-y divide-border">
            {products.slice(0, 8).map((product) => (
              <div
                key={product.id}
                className="grid gap-2 py-4 sm:grid-cols-[1fr_auto]"
              >
                <div>
                  <p className="font-bold">{product.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {product.category} · {product.brand}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Tags: {product.tags.join(", ") || "None"}
                  </p>
                </div>
                <p className="font-black">${product.price.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}