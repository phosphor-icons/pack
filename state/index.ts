'use client';

import type { IconEntry } from '#/types';

import { atom, selector } from 'recoil';
import { icons as iconData } from '@phosphor-icons/core';
import * as Phosphor from '@phosphor-icons/react';
import Fuse from 'fuse.js';
import { Summary } from '#/utils/summary';

const icons: ReadonlyArray<IconEntry> = iconData.map((entry) => ({
  ...entry,
  Icon: Phosphor[entry.pascal_name as keyof typeof Phosphor] as Phosphor.Icon,
}));

const fuse = new Fuse(icons, {
  keys: [{ name: 'name', weight: 4 }, 'tags', 'categories'],
  threshold: 0.2, // Tweak this to what feels like the right number of results
  shouldSort: false,
  useExtendedSearch: true,
});

export const searchQueryAtom = atom<string>({
  key: 'searchQuery',
  default: '',
});

export const selectionAtom = atom<
  Partial<Record<Phosphor.IconWeight, Set<string>>>
>({
  key: 'selections',
  default: {},
});

export const reviewSelector = selector({
  key: 'review',
  get: ({ get }) => {
    const selections = get(selectionAtom);

    const glyphCounts = Object.entries(selections).reduce(
      (acc, [weight, names]) => {
        acc[weight as Phosphor.IconWeight] = names.size;
        return acc;
      },
      {} as Partial<Record<Phosphor.IconWeight, number>>,
    );
    const includedWeights = Object.entries(selections)
      .filter(([_, count]) => count.size > 0)
      .map((e) => e[0]) as Phosphor.IconWeight[];
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
  key: 'filteredQueryResults',
  get: ({ get }) => {
    const query = get(searchQueryAtom).trim().toLowerCase();
    if (!query) return icons;

    return new Promise((resolve) =>
      resolve(fuse.search(query).map((value) => value.item)),
    );
  },
});
