'use client';

import type { IconEntry, SelectionEntry } from '#/types';

import { atom, selector } from 'recoil';
import { icons as iconData } from '@phosphor-icons/core';
import * as Phosphor from '@phosphor-icons/react';
import Fuse from 'fuse.js';

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

export const selectionAtom = atom<SelectionEntry[]>({
  key: 'selections',
  default: [],
});

export const reviewSelector = selector({
  key: 'review',
  get: ({ get }) => {
    const selections = get(selectionAtom);
    return selections.reduce<Partial<Record<Phosphor.IconWeight, string[]>>>(
      (acc, curr) => {
        if (acc[curr.weight] == undefined) {
          acc[curr.weight] = [];
        }

        acc[curr.weight]!.push(curr.name);
        return acc;
      },
      {},
    );
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
