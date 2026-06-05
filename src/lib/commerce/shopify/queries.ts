// This file stores Shopify Storefront API GraphQL queries used by the commerce gateway.
export const PRODUCT_FRAGMENT = /* GraphQL */ `
  fragment ProductFields on Product {
    id
    title
    handle
    description
    vendor
    tags

    featuredImage {
      id
      url
      altText
      width
      height
    }

    images(first: 12) {
      nodes {
        id
        url
        altText
        width
        height
      }
    }

    collections(first: 3) {
      nodes {
        id
        title
        handle
      }
    }

    variants(first: 100) {
      nodes {
        id
        title
        availableForSale
        quantityAvailable
        sku

        selectedOptions {
          name
          value
        }

        image {
          id
          url
          altText
          width
          height
        }

        price {
          amount
          currencyCode
        }

        compareAtPrice {
          amount
          currencyCode
        }
      }
    }

    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }

    compareAtPriceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
  }
`;

export const PRODUCTS_QUERY = /* GraphQL */ `
  ${PRODUCT_FRAGMENT}

  query Products($first: Int!) {
    products(
      first: $first
      sortKey: CREATED_AT
      reverse: true
    ) {
      nodes {
        ...ProductFields
      }
    }
  }
`;

export const COLLECTIONS_QUERY = /* GraphQL */ `
  query Collections($first: Int!) {
    collections(first: $first) {
      nodes {
        id
        title
        handle
        description

        image {
          url
          altText
          width
          height
        }

        products(first: 100) {
          nodes {
            id
          }
        }
      }
    }
  }
`;

export const PRODUCT_BY_HANDLE_QUERY = /* GraphQL */ `
  ${PRODUCT_FRAGMENT}

  query ProductByHandle($handle: String!) {
    product(handle: $handle) {
      ...ProductFields
    }
  }
`;

export const PRODUCT_RECOMMENDATIONS_QUERY = /* GraphQL */ `
  ${PRODUCT_FRAGMENT}

  query ProductRecommendations($productId: ID!) {
    productRecommendations(productId: $productId) {
      ...ProductFields
    }
  }
`;

export const CART_FRAGMENT = /* GraphQL */ `
  fragment CartFields on Cart {
    id
    checkoutUrl
    totalQuantity

    cost {
      subtotalAmount {
        amount
        currencyCode
      }

      totalAmount {
        amount
        currencyCode
      }
    }

    lines(first: 100) {
      nodes {
        id
        quantity

        merchandise {
          ... on ProductVariant {
            id
            title
            quantityAvailable

            price {
              amount
              currencyCode
            }

            product {
              title
              handle

              featuredImage {
                url
                altText
              }
            }
          }
        }
      }
    }
  }
`;

export const CART_QUERY = /* GraphQL */ `
  ${CART_FRAGMENT}

  query Cart($id: ID!) {
    cart(id: $id) {
      ...CartFields
    }
  }
`;

export const CART_CREATE_MUTATION = /* GraphQL */ `
  ${CART_FRAGMENT}

  mutation CartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        ...CartFields
      }

      userErrors {
        field
        message
      }
    }
  }
`;

export const CART_LINES_ADD_MUTATION = /* GraphQL */ `
  ${CART_FRAGMENT}

  mutation CartLinesAdd(
    $cartId: ID!
    $lines: [CartLineInput!]!
  ) {
    cartLinesAdd(
      cartId: $cartId
      lines: $lines
    ) {
      cart {
        ...CartFields
      }

      userErrors {
        field
        message
      }
    }
  }
`;

export const CART_LINES_UPDATE_MUTATION = /* GraphQL */ `
  ${CART_FRAGMENT}

  mutation CartLinesUpdate(
    $cartId: ID!
    $lines: [CartLineUpdateInput!]!
  ) {
    cartLinesUpdate(
      cartId: $cartId
      lines: $lines
    ) {
      cart {
        ...CartFields
      }

      userErrors {
        field
        message
      }
    }
  }
`;

export const CART_LINES_REMOVE_MUTATION = /* GraphQL */ `
  ${CART_FRAGMENT}

  mutation CartLinesRemove(
    $cartId: ID!
    $lineIds: [ID!]!
  ) {
    cartLinesRemove(
      cartId: $cartId
      lineIds: $lineIds
    ) {
      cart {
        ...CartFields
      }

      userErrors {
        field
        message
      }
    }
  }
`;