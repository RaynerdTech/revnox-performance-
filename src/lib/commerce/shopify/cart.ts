// This file maps Shopify Storefront API cart operations into storefront cart types.
import "server-only";
import type { Cart } from "@/lib/commerce/types";
import { shopifyFetch } from "@/lib/commerce/shopify/storefront-client";
import {
  CART_CREATE_MUTATION,
  CART_LINES_ADD_MUTATION,
  CART_LINES_REMOVE_MUTATION,
  CART_LINES_UPDATE_MUTATION,
  CART_QUERY,
} from "@/lib/commerce/shopify/queries";

type ShopifyCartUserError = {
  field: string[] | null;
  message: string;
};

type ShopifyCartLine = {
  id: string;
  quantity: number;
  merchandise: {
    id: string;
    title: string;
    quantityAvailable: number | null;
    price: {
      amount: string;
      currencyCode: string;
    };
    product: {
      title: string;
      handle: string;
      featuredImage: {
        url: string;
        altText: string | null;
      } | null;
    };
  };
};

type ShopifyCart = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: {
    subtotalAmount: {
      amount: string;
      currencyCode: string;
    };
    totalAmount: {
      amount: string;
      currencyCode: string;
    };
  };
  lines: {
    nodes: ShopifyCartLine[];
  };
};

type CartQueryResponse = {
  cart: ShopifyCart | null;
};

type CartCreateResponse = {
  cartCreate: {
    cart: ShopifyCart | null;
    userErrors: ShopifyCartUserError[];
  };
};

type CartLinesAddResponse = {
  cartLinesAdd: {
    cart: ShopifyCart | null;
    userErrors: ShopifyCartUserError[];
  };
};

type CartLinesUpdateResponse = {
  cartLinesUpdate: {
    cart: ShopifyCart | null;
    userErrors: ShopifyCartUserError[];
  };
};

type CartLinesRemoveResponse = {
  cartLinesRemove: {
    cart: ShopifyCart | null;
    userErrors: ShopifyCartUserError[];
  };
};

function mapShopifyCart(cart: ShopifyCart): Cart {
  return {
    id: cart.id,
    checkoutUrl: cart.checkoutUrl,
    totalQuantity: cart.totalQuantity,
    subtotalAmount: Number(cart.cost.subtotalAmount.amount),
    totalAmount: Number(cart.cost.totalAmount.amount),
    currencyCode: cart.cost.totalAmount.currencyCode,
    lines: cart.lines.nodes.map((line) => ({
      id: line.id,
quantity: line.quantity,
quantityAvailable: line.merchandise.quantityAvailable,
merchandiseId: line.merchandise.id,
      variantTitle: line.merchandise.title,
      productTitle: line.merchandise.product.title,
      productHandle: line.merchandise.product.handle,
      productImage:
        line.merchandise.product.featuredImage?.url ??
        "/images/product-wheel-dark.svg",
      productImageAlt:
        line.merchandise.product.featuredImage?.altText ??
        line.merchandise.product.title,
      price: Number(line.merchandise.price.amount),
      currencyCode: line.merchandise.price.currencyCode,
    })),
  };
}

function throwIfUserErrors(errors: ShopifyCartUserError[]) {
  if (errors.length > 0) {
    throw new Error(errors.map((error) => error.message).join(", "));
  }
}

export async function getShopifyCart(cartId: string) {
  const data = await shopifyFetch<CartQueryResponse, { id: string }>({
    query: CART_QUERY,
    variables: { id: cartId },
    cache: "no-store",
    revalidate: 0,
  });

  return data.cart ? mapShopifyCart(data.cart) : null;
}

export async function createShopifyCart({
  merchandiseId,
  quantity,
}: {
  merchandiseId: string;
  quantity: number;
}) {
  const data = await shopifyFetch<
    CartCreateResponse,
    {
      input: {
        lines: {
          merchandiseId: string;
          quantity: number;
        }[];
      };
    }
  >({
    query: CART_CREATE_MUTATION,
    variables: {
      input: {
        lines: [
          {
            merchandiseId,
            quantity,
          },
        ],
      },
    },
    cache: "no-store",
    revalidate: 0,
  });

  throwIfUserErrors(data.cartCreate.userErrors);

  if (!data.cartCreate.cart) {
    throw new Error("Shopify did not return a cart.");
  }

  return mapShopifyCart(data.cartCreate.cart);
}

export async function addShopifyCartLine({
  cartId,
  merchandiseId,
  quantity,
}: {
  cartId: string;
  merchandiseId: string;
  quantity: number;
}) {
  const data = await shopifyFetch<
    CartLinesAddResponse,
    {
      cartId: string;
      lines: {
        merchandiseId: string;
        quantity: number;
      }[];
    }
  >({
    query: CART_LINES_ADD_MUTATION,
    variables: {
      cartId,
      lines: [
        {
          merchandiseId,
          quantity,
        },
      ],
    },
    cache: "no-store",
    revalidate: 0,
  });

  throwIfUserErrors(data.cartLinesAdd.userErrors);

  if (!data.cartLinesAdd.cart) {
    throw new Error("Shopify did not return the updated cart.");
  }

  return mapShopifyCart(data.cartLinesAdd.cart);
}

export async function updateShopifyCartLine({
  cartId,
  lineId,
  quantity,
}: {
  cartId: string;
  lineId: string;
  quantity: number;
}) {
  const data = await shopifyFetch<
    CartLinesUpdateResponse,
    {
      cartId: string;
      lines: {
        id: string;
        quantity: number;
      }[];
    }
  >({
    query: CART_LINES_UPDATE_MUTATION,
    variables: {
      cartId,
      lines: [
        {
          id: lineId,
          quantity,
        },
      ],
    },
    cache: "no-store",
    revalidate: 0,
  });

  throwIfUserErrors(data.cartLinesUpdate.userErrors);

  if (!data.cartLinesUpdate.cart) {
    throw new Error("Shopify did not return the updated cart.");
  }

  return mapShopifyCart(data.cartLinesUpdate.cart);
}

export async function removeShopifyCartLine({
  cartId,
  lineId,
}: {
  cartId: string;
  lineId: string;
}) {
  const data = await shopifyFetch<
    CartLinesRemoveResponse,
    {
      cartId: string;
      lineIds: string[];
    }
  >({
    query: CART_LINES_REMOVE_MUTATION,
    variables: {
      cartId,
      lineIds: [lineId],
    },
    cache: "no-store",
    revalidate: 0,
  });

  throwIfUserErrors(data.cartLinesRemove.userErrors);

  if (!data.cartLinesRemove.cart) {
    throw new Error("Shopify did not return the updated cart.");
  }

  return mapShopifyCart(data.cartLinesRemove.cart);
}