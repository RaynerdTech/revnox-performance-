// This file defines shared commerce types used by products, collections,
// variants, cart, and checkout.
export type ProductBadge =
  | "Best Seller"
  | "Featured"
  | "New"
  | "Limited";

export type ProductCategory = {
  id: string;
  title: string;
  handle: string;
  description: string;
  productCount: number;
  image?: {
    url: string;
    altText: string;
    width?: number;
    height?: number;
  };
};

export type ProductImage = {
  id: string;
  url: string;
  altText: string;
  width?: number;
  height?: number;
};

export type BrandProfile = {
  id: string;
  handle: string;
  name: string;
  logo?: ProductImage;
  description?: string;
  website?: string;
  active: boolean;
};

export type ProductOptionSelection = {
  name: string;
  value: string;
};

export type ProductVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  quantityAvailable: number | null;
  sku?: string;
  price: number;
  compareAtPrice?: number;
  currencyCode: string;
  image?: ProductImage;
  selectedOptions: ProductOptionSelection[];
};

export type Product = {
  id: string;
  title: string;
  handle: string;
  category: string;
  categoryHandle: string;

  // This comes from the direct custom.brand_profile reference.
  brand: string;
  brandProfile?: BrandProfile;

  description: string;
  price: number;
  compareAtPrice?: number;
  currencyCode: string;
  image: string;
  imageAlt: string;
  images: ProductImage[];
  variants: ProductVariant[];
  availableForSale: boolean;
  badge?: ProductBadge;
  tags: string[];
  isBestSeller: boolean;
  isFeatured: boolean;
};

export type CategoryProductSection = {
  category: ProductCategory;
  products: Product[];
};

export type HomepageCatalog = {
  categories: ProductCategory[];
  featuredProducts: Product[];
  bestSellingProducts: Product[];
  categoryProductSections: CategoryProductSection[];
};

export type CartLine = {
  id: string;
  quantity: number;
  quantityAvailable: number | null;
  merchandiseId: string;
  variantTitle: string;
  productTitle: string;
  productHandle: string;
  productImage: string;
  productImageAlt: string;
  price: number;
  currencyCode: string;
};

export type Cart = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  subtotalAmount: number;
  totalAmount: number;
  currencyCode: string;
  lines: CartLine[];
};