// This file provides shared intent-aware, typo-tolerant product search
// for both the live header search and the full product catalog.
import type { Product } from "@/lib/commerce/types";

export type SearchField =
  | "sku"
  | "title"
  | "brand"
  | "category"
  | "variant"
  | "tags"
  | "description";

export type SearchCorrection = {
  from: string;
  to: string;
};

export type SearchInterpretation = {
  originalQuery: string;
  normalizedQuery: string;
  searchableTerms: string[];
  correctedTerms: SearchCorrection[];
  ignoredTerms: string[];
  year?: number;
  vehicleMake?: string;
};

export type ProductSearchResult = {
  product: Product;
  score: number;
  matchedFields: SearchField[];
};

export type ProductSearchResponse = {
  results: ProductSearchResult[];
  interpretation: SearchInterpretation;
};

type VehicleMakeDefinition = {
  name: string;
  aliases: string[];
};

type SearchDocument = {
  product: Product;
  sku: string;
  title: string;
  brand: string;
  category: string;
  variant: string;
  tags: string;
  description: string;
};

const FILLER_WORDS = new Set([
  "a",
  "an",
  "and",
  "for",
  "from",
  "in",
  "me",
  "my",
  "of",
  "on",
  "part",
  "parts",
  "please",
  "show",
  "the",
  "to",
  "with",
]);

// These are controlled automotive vocabulary aliases.
// They are centralized here instead of being scattered through components.
const TERM_ALIASES: Record<string, string[]> = {
  rim: ["wheel"],
  rims: ["wheel"],
  shock: ["suspension"],
  shocks: ["suspension"],
  damper: ["suspension"],
  dampers: ["suspension"],
  tyre: ["tire"],
  tyres: ["tire"],
};

const VEHICLE_MAKES: VehicleMakeDefinition[] = [
  {
    name: "Mercedes-Benz",
    aliases: [
      "mercedes benz",
      "mercedes",
      "benz",
      "merc",
    ],
  },
  {
    name: "BMW",
    aliases: [
      "bmw",
      "bimmer",
      "beemer",
    ],
  },
  {
    name: "Lexus",
    aliases: ["lexus"],
  },
  {
    name: "Toyota",
    aliases: ["toyota"],
  },
  {
    name: "Audi",
    aliases: ["audi"],
  },
  {
    name: "Volkswagen",
    aliases: [
      "volkswagen",
      "vw",
    ],
  },
  {
    name: "Porsche",
    aliases: ["porsche"],
  },
  {
    name: "Ferrari",
    aliases: ["ferrari"],
  },
];

const FIELD_WEIGHTS: Record<
  SearchField,
  number
> = {
  sku: 140,
  title: 110,
  brand: 90,
  category: 80,
  variant: 70,
  tags: 50,
  description: 22,
};

export function searchProducts(
  products: Product[],
  query: string,
): ProductSearchResponse {
  const parsed =
    parseSearchQuery(query);

  const vocabulary =
    buildSearchVocabulary(products);

  const {
    resolvedTerms,
    correctedTerms,
  } = resolveSearchTerms(
    parsed.searchableTerms,
    vocabulary,
  );

  const interpretation: SearchInterpretation =
    {
      ...parsed,
      searchableTerms: resolvedTerms,
      correctedTerms,
    };

  if (resolvedTerms.length === 0) {
    return {
      results: [],
      interpretation,
    };
  }

  const normalizedPhrase =
    resolvedTerms.join(" ");

  const compactQuery =
    compactValue(
      resolvedTerms.join(""),
    );

  const results = products
    .map((product) =>
      scoreProduct(
        buildSearchDocument(product),
        resolvedTerms,
        normalizedPhrase,
        compactQuery,
      ),
    )
    .filter(
      (
        result,
      ): result is ProductSearchResult =>
        result !== null,
    )
    .sort((first, second) => {
      if (second.score !== first.score) {
        return second.score - first.score;
      }

      if (
        first.product.availableForSale !==
        second.product.availableForSale
      ) {
        return first.product.availableForSale
          ? -1
          : 1;
      }

      return first.product.title.localeCompare(
        second.product.title,
      );
    });

  return {
    results,
    interpretation,
  };
}

export function parseSearchQuery(
  query: string,
): SearchInterpretation {
  const normalizedQuery =
    normalizeSearchText(query);

  let tokens = tokenize(normalizedQuery);

  const ignoredTerms: string[] = [];

  let year: number | undefined;

  tokens = tokens.filter((token) => {
    if (
      /^(19|20)\d{2}$/.test(token)
    ) {
      if (!year) {
        year = Number(token);
      }

      ignoredTerms.push(token);
      return false;
    }

    return true;
  });

  const vehicleMatch =
    detectVehicleMake(tokens);

  tokens =
    vehicleMatch.remainingTokens;

  if (vehicleMatch.matchedTerms.length) {
    ignoredTerms.push(
      ...vehicleMatch.matchedTerms,
    );
  }

  const searchableTerms =
    tokens.flatMap((token) => {
      if (FILLER_WORDS.has(token)) {
        ignoredTerms.push(token);
        return [];
      }

      return (
        TERM_ALIASES[token] ?? [token]
      );
    });

  return {
    originalQuery: query,
    normalizedQuery,
    searchableTerms:
      removeDuplicateTerms(
        searchableTerms,
      ),
    correctedTerms: [],
    ignoredTerms:
      removeDuplicateTerms(
        ignoredTerms,
      ),
    year,
    vehicleMake:
      vehicleMatch.vehicleMake,
  };
}

function buildSearchDocument(
  product: Product,
): SearchDocument {
  const variantText =
    product.variants
      .map((variant) => {
        const selectedOptions =
          variant.selectedOptions
            .map(
              (option) =>
                `${option.name} ${option.value}`,
            )
            .join(" ");

        return [
          variant.title,
          selectedOptions,
        ]
          .filter(Boolean)
          .join(" ");
      })
      .join(" ");

  const skuText =
    product.variants
      .map(
        (variant) =>
          variant.sku ?? "",
      )
      .join(" ");

  return {
    product,
    sku: normalizeSearchText(skuText),
    title: normalizeSearchText(
      product.title,
    ),
    brand: normalizeSearchText(
      product.brand,
    ),
    category: normalizeSearchText(
      [
        product.category,
        product.categoryHandle,
      ].join(" "),
    ),
    variant:
      normalizeSearchText(
        variantText,
      ),
    tags: normalizeSearchText(
      product.tags.join(" "),
    ),
    description:
      normalizeSearchText(
        product.description,
      ),
  };
}

function scoreProduct(
  document: SearchDocument,
  terms: string[],
  normalizedPhrase: string,
  compactQuery: string,
): ProductSearchResult | null {
  let score = 0;

  const matchedFields =
    new Set<SearchField>();

  for (const term of terms) {
    let bestTermScore = 0;
    let bestField:
      | SearchField
      | undefined;

    for (const field of Object.keys(
      FIELD_WEIGHTS,
    ) as SearchField[]) {
      const fieldScore =
        scoreTermAgainstText(
          term,
          document[field],
        ) * FIELD_WEIGHTS[field];

      if (
        fieldScore >
        bestTermScore
      ) {
        bestTermScore =
          fieldScore;

        bestField = field;
      }
    }

    // Every meaningful term must match somewhere.
    if (bestTermScore === 0) {
      return null;
    }

    score += bestTermScore;

    if (bestField) {
      matchedFields.add(bestField);
    }
  }

  const compactSkus =
    document.product.variants
      .map((variant) =>
        compactValue(
          variant.sku ?? "",
        ),
      )
      .filter(Boolean);

  if (
    compactQuery &&
    compactSkus.includes(
      compactQuery,
    )
  ) {
    score += 1200;
    matchedFields.add("sku");
  }

  if (
    document.title ===
    normalizedPhrase
  ) {
    score += 600;
    matchedFields.add("title");
  } else if (
    document.title.startsWith(
      `${normalizedPhrase} `,
    )
  ) {
    score += 320;
    matchedFields.add("title");
  } else if (
    document.title.includes(
      normalizedPhrase,
    )
  ) {
    score += 220;
    matchedFields.add("title");
  }

  if (
    document.brand ===
    normalizedPhrase
  ) {
    score += 260;
    matchedFields.add("brand");
  }

  if (
    document.category ===
    normalizedPhrase
  ) {
    score += 220;
    matchedFields.add(
      "category",
    );
  }

  if (
    document.product.availableForSale
  ) {
    score += 8;
  }

  if (
    document.product.isBestSeller
  ) {
    score += 5;
  }

  if (
    document.product.isFeatured
  ) {
    score += 3;
  }

  return {
    product: document.product,
    score,
    matchedFields:
      Array.from(matchedFields),
  };
}

function scoreTermAgainstText(
  term: string,
  text: string,
) {
  if (!term || !text) {
    return 0;
  }

  if (text === term) {
    return 1.3;
  }

  const words = tokenize(text);

  if (words.includes(term)) {
    return 1;
  }

  if (
    text.startsWith(`${term} `)
  ) {
    return 0.96;
  }

  if (text.includes(term)) {
    return 0.88;
  }

  if (term.length < 4) {
    return 0;
  }

  let bestSimilarity = 0;

  for (const word of words) {
    const similarity =
      getWordSimilarity(
        term,
        word,
      );

    if (
      similarity >
      bestSimilarity
    ) {
      bestSimilarity =
        similarity;
    }
  }

  if (
    bestSimilarity <
    getSimilarityThreshold(term)
  ) {
    return 0;
  }

  return bestSimilarity * 0.7;
}

function buildSearchVocabulary(
  products: Product[],
) {
  const vocabulary =
    new Set<string>();

  for (const product of products) {
    const values = [
      product.title,
      product.brand,
      product.category,
      product.categoryHandle,
      product.tags.join(" "),
      product.variants
        .map((variant) =>
          [
            variant.title,
            variant.sku ?? "",
            variant.selectedOptions
              .map(
                (option) =>
                  `${option.name} ${option.value}`,
              )
              .join(" "),
          ].join(" "),
        )
        .join(" "),
    ];

    for (const value of values) {
      for (const token of tokenize(
        normalizeSearchText(value),
      )) {
        if (
          token.length >= 3 &&
          !FILLER_WORDS.has(token)
        ) {
          vocabulary.add(token);
        }
      }
    }
  }

  return vocabulary;
}

function resolveSearchTerms(
  terms: string[],
  vocabulary: Set<string>,
) {
  const correctedTerms:
    SearchCorrection[] = [];

  const resolvedTerms =
    terms.map((term) => {
      if (
        vocabulary.has(term) ||
        term.length < 4
      ) {
        return term;
      }

      let bestCandidate = term;
      let bestSimilarity = 0;

      for (const candidate of vocabulary) {
        if (
          Math.abs(
            candidate.length -
              term.length,
          ) > 3
        ) {
          continue;
        }

        if (
          candidate.charAt(0) !==
          term.charAt(0)
        ) {
          continue;
        }

        const similarity =
          getWordSimilarity(
            term,
            candidate,
          );

        if (
          similarity >
          bestSimilarity
        ) {
          bestSimilarity =
            similarity;

          bestCandidate =
            candidate;
        }
      }

      if (
        bestCandidate !== term &&
        bestSimilarity >=
          getSimilarityThreshold(
            term,
          )
      ) {
        correctedTerms.push({
          from: term,
          to: bestCandidate,
        });

        return bestCandidate;
      }

      return term;
    });

  return {
    resolvedTerms:
      removeDuplicateTerms(
        resolvedTerms,
      ),
    correctedTerms,
  };
}

function detectVehicleMake(
  tokens: string[],
) {
  // Exact phrase matching first.
  for (const vehicle of VEHICLE_MAKES) {
    const aliases =
      vehicle.aliases
        .map((alias) =>
          tokenize(
            normalizeSearchText(
              alias,
            ),
          ),
        )
        .sort(
          (first, second) =>
            second.length -
            first.length,
        );

    for (const aliasTokens of aliases) {
      const matchIndex =
        findTokenSequence(
          tokens,
          aliasTokens,
        );

      if (matchIndex >= 0) {
        return {
          vehicleMake:
            vehicle.name,
          matchedTerms:
            aliasTokens,
          remainingTokens: [
            ...tokens.slice(
              0,
              matchIndex,
            ),
            ...tokens.slice(
              matchIndex +
                aliasTokens.length,
            ),
          ],
        };
      }
    }
  }

  // Generic fuzzy matching handles misspelled vehicle makes.
  for (
    let tokenIndex = 0;
    tokenIndex < tokens.length;
    tokenIndex += 1
  ) {
    const token =
      tokens[tokenIndex];

    if (token.length < 4) {
      continue;
    }

    let bestVehicle:
      | VehicleMakeDefinition
      | undefined;

    let bestSimilarity = 0;

    for (const vehicle of VEHICLE_MAKES) {
      for (const alias of vehicle.aliases) {
        const aliasTokens =
          tokenize(
            normalizeSearchText(
              alias,
            ),
          );

        if (
          aliasTokens.length !== 1
        ) {
          continue;
        }

        const similarity =
          getWordSimilarity(
            token,
            aliasTokens[0],
          );

        if (
          similarity >
          bestSimilarity
        ) {
          bestSimilarity =
            similarity;

          bestVehicle =
            vehicle;
        }
      }
    }

    if (
      bestVehicle &&
      bestSimilarity >= 0.8
    ) {
      return {
        vehicleMake:
          bestVehicle.name,
        matchedTerms: [token],
        remainingTokens:
          tokens.filter(
            (_, index) =>
              index !== tokenIndex,
          ),
      };
    }
  }

  return {
    vehicleMake: undefined,
    matchedTerms: [],
    remainingTokens: tokens,
  };
}

function findTokenSequence(
  tokens: string[],
  sequence: string[],
) {
  if (
    sequence.length === 0 ||
    sequence.length > tokens.length
  ) {
    return -1;
  }

  for (
    let index = 0;
    index <=
    tokens.length -
      sequence.length;
    index += 1
  ) {
    const matches =
      sequence.every(
        (token, offset) =>
          tokens[
            index + offset
          ] === token,
      );

    if (matches) {
      return index;
    }
  }

  return -1;
}

function getWordSimilarity(
  firstWord: string,
  secondWord: string,
) {
  const first =
    normalizeSearchText(
      firstWord,
    );

  const second =
    normalizeSearchText(
      secondWord,
    );

  if (!first || !second) {
    return 0;
  }

  if (first === second) {
    return 1;
  }

  const firstStem =
    getSimpleStem(first);

  const secondStem =
    getSimpleStem(second);

  if (
    firstStem === secondStem
  ) {
    return 0.96;
  }

  if (
    `${firstStem}e` ===
      secondStem ||
    `${secondStem}e` ===
      firstStem
  ) {
    return 0.92;
  }

  if (
    first.length >= 4 &&
    second.length >= 4 &&
    getConsonantKey(first) ===
      getConsonantKey(second)
  ) {
    return 0.9;
  }

  const distance =
    getDamerauLevenshteinDistance(
      first,
      second,
    );

  return (
    1 -
    distance /
      Math.max(
        first.length,
        second.length,
      )
  );
}

function getSimilarityThreshold(
  term: string,
) {
  if (term.length <= 4) {
    return 0.76;
  }

  if (term.length <= 6) {
    return 0.7;
  }

  return 0.66;
}

function getSimpleStem(
  value: string,
) {
  if (
    value.length > 5 &&
    value.endsWith("ing")
  ) {
    return value.slice(0, -3);
  }

  if (
    value.length > 4 &&
    value.endsWith("ies")
  ) {
    return `${value.slice(0, -3)}y`;
  }

  if (
    value.length > 4 &&
    value.endsWith("es")
  ) {
    return value.slice(0, -2);
  }

  if (
    value.length > 3 &&
    value.endsWith("s")
  ) {
    return value.slice(0, -1);
  }

  if (
    value.length > 4 &&
    value.endsWith("ed")
  ) {
    return value.slice(0, -2);
  }

  return value;
}

function getConsonantKey(
  value: string,
) {
  return value.replace(
    /[aeiouy]/g,
    "",
  );
}

function getDamerauLevenshteinDistance(
  first: string,
  second: string,
) {
  const matrix = Array.from(
    {
      length:
        first.length + 1,
    },
    () =>
      Array<number>(
        second.length + 1,
      ).fill(0),
  );

  for (
    let row = 0;
    row <= first.length;
    row += 1
  ) {
    matrix[row][0] = row;
  }

  for (
    let column = 0;
    column <= second.length;
    column += 1
  ) {
    matrix[0][column] =
      column;
  }

  for (
    let row = 1;
    row <= first.length;
    row += 1
  ) {
    for (
      let column = 1;
      column <=
      second.length;
      column += 1
    ) {
      const substitutionCost =
        first[row - 1] ===
        second[column - 1]
          ? 0
          : 1;

      matrix[row][column] =
        Math.min(
          matrix[row - 1][
            column
          ] + 1,
          matrix[row][
            column - 1
          ] + 1,
          matrix[row - 1][
            column - 1
          ] +
            substitutionCost,
        );

      if (
        row > 1 &&
        column > 1 &&
        first[row - 1] ===
          second[column - 2] &&
        first[row - 2] ===
          second[column - 1]
      ) {
        matrix[row][column] =
          Math.min(
            matrix[row][column],
            matrix[row - 2][
              column - 2
            ] +
              substitutionCost,
          );
      }
    }
  }

  return matrix[first.length][
    second.length
  ];
}

function normalizeSearchText(
  value: string,
) {
  return value
    .normalize("NFKD")
    .replace(
      /[\u0300-\u036f]/g,
      "",
    )
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenize(value: string) {
  if (!value) {
    return [];
  }

  return value
    .split(" ")
    .filter(Boolean);
}

function compactValue(
  value: string,
) {
  return normalizeSearchText(
    value,
  ).replace(/\s+/g, "");
}

function removeDuplicateTerms(
  terms: string[],
) {
  return Array.from(
    new Set(terms),
  );
}