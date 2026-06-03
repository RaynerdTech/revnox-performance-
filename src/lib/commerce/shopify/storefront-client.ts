// This file creates the server-side Shopify Storefront API client used by the commerce gateway, with retry handling for transient network failures.
import "server-only";

const shopifyStoreDomain = process.env.SHOPIFY_STORE_DOMAIN;
const shopifyPrivateToken = process.env.SHOPIFY_STOREFRONT_PRIVATE_ACCESS_TOKEN;
const shopifyApiVersion =
  process.env.SHOPIFY_STOREFRONT_API_VERSION ?? "2026-04";

type ShopifyFetchOptions<TVariables> = {
  query: string;
  variables?: TVariables;
  cache?: RequestCache;
  revalidate?: number;
};

type ShopifyResponse<TData> = {
  data?: TData;
  errors?: {
    message: string;
  }[];
};

function sleep(milliseconds: number) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

async function fetchWithRetry(
  url: string,
  options: RequestInit,
  retries = 2,
): Promise<Response> {
  let lastError: unknown;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      const response = await fetch(url, options);

      if (response.ok) {
        return response;
      }

      if (![429, 500, 502, 503, 504].includes(response.status)) {
        return response;
      }

      lastError = new Error(`Shopify responded with ${response.status}`);
    } catch (error) {
      lastError = error;
    }

    if (attempt < retries) {
      await sleep(350 * (attempt + 1));
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error("Shopify Storefront API fetch failed.");
}

export async function shopifyFetch<TData, TVariables = Record<string, never>>({
  query,
  variables,
  cache = "force-cache",
  revalidate = 300,
}: ShopifyFetchOptions<TVariables>): Promise<TData> {
  if (!shopifyStoreDomain) {
    throw new Error("Missing SHOPIFY_STORE_DOMAIN in .env.local");
  }

  if (!shopifyPrivateToken) {
    throw new Error("Missing SHOPIFY_STOREFRONT_PRIVATE_ACCESS_TOKEN in .env.local");
  }

  const fetchOptions: RequestInit & {
    next?: {
      revalidate: number;
    };
  } = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Shopify-Storefront-Private-Token": shopifyPrivateToken,
    },
    body: JSON.stringify({
      query,
      variables,
    }),
    cache,
  };

  if (cache !== "no-store") {
    fetchOptions.next = {
      revalidate,
    };
  }

  const response = await fetchWithRetry(
    `https://${shopifyStoreDomain}/api/${shopifyApiVersion}/graphql.json`,
    fetchOptions,
  );

  const body = (await response.json()) as ShopifyResponse<TData>;

  if (!response.ok || body.errors) {
    console.error("Shopify Storefront API error:", body.errors ?? body);
    throw new Error("Shopify Storefront API request failed.");
  }

  if (!body.data) {
    throw new Error("Shopify Storefront API returned no data.");
  }

  return body.data;
}