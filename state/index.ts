"use client";

import { atom, selector } from "recoil";
import { icons, IconEntry, IconStyle } from "@phosphor-icons/core";
import Fuse from "fuse.js";
import { Summary } from "#/utils/summary";

const fuse = new Fuse(icons, {
  keys: [{ name: "name", weight: 4 }, "tags", "categories"],
  threshold: 0.2, // Tweak this to what feels like the right number of results
  shouldSort: false,
  useExtendedSearch: true,
});

export const searchQueryAtom = atom<string>({
  key: "searchQuery",
  default: "",
});

export const selectionAtom = atom<Partial<Record<IconStyle, Set<string>>>>({
  key: "selections",
  default: {},
});

export const weightAtom = atom<IconStyle>({
  key: "weight",
  default: IconStyle.REGULAR,
});

export const nonceAtom = atom<number>({
  key: "nonce",
  default: 0,
});

export type ConfigurationState = {
  woff: boolean;
  ttf: boolean;
  otf: boolean;
  woff2: boolean;
  eot: boolean;
  svg: boolean;
  output: "inline" | "preferred" | "external";
};

export const configurationAtom = atom<ConfigurationState>({
  key: "configuration",
  default: {
    woff: true,
    ttf: false,
    otf: false,
    woff2: false,
    eot: false,
    svg: false,
    output: "inline",
  },
});

export const cssAtom = atom<string>({
  key: "css",
  default: "",
});

export const reviewSelector = selector({
  key: "review",
  get: ({ get }) => {
    const selections = get(selectionAtom);

    const glyphCounts = Object.entries(selections).reduce(
      (acc, [weight, names]) => {
        acc[weight as IconStyle] = names.size;
        return acc;
      },
      {} as Partial<Record<IconStyle, number>>,
    );
    const includedWeights = Object.entries(selections)
      .filter(([_, count]) => count.size > 0)
      .map((e) => e[0]) as IconStyle[];
    const { byteEstimates: inline } = Summary.estimateSize(glyphCounts, true);
    const { byteEstimates: external } = Summary.estimateSize(
      glyphCounts,
      false,
    );
    return {
      glyphCounts,
      includedWeights,
      byteEstimates: { inline, external },
    };
  },
});

export const filteredQueryResultsSelector = selector<ReadonlyArray<IconEntry>>({
  key: "filteredQueryResults",
  get: ({ get }) => {
    const query = get(searchQueryAtom).trim().toLowerCase();
    if (!query) return icons;

    return new Promise((resolve) =>
      resolve(fuse.search(query).map((value) => value.item)),
    );
  },
});
