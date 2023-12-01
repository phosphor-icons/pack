'use client';

import { useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { IconWeight } from '@phosphor-icons/react';
import {
  filteredQueryResultsSelector,
  reviewSelector,
  searchQueryAtom,
  selectionAtom,
} from '#/state';
import { Selector } from './selector';
import { Review } from './review';
import { Configurator } from './configurator';

export const Main = () => {
  const [query, setQuery] = useRecoilState(searchQueryAtom);
  const [weight, setWeight] = useState<IconWeight>('regular');
  const { glyphCounts } = useRecoilValue(reviewSelector);
  const entries = useRecoilValue(filteredQueryResultsSelector);
  const [selections, setSelection] = useRecoilState(selectionAtom);

  return (
    <ol className="flex flex-col gap-4">
      <li className="bg-white shadow-lg shadow-black/20">
        <h2 className="p-4">Select icons</h2>
        <div className="flex gap-2">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          <button onClick={() => setWeight('regular')}>
            Regular
            {glyphCounts.regular ? (
              <span className="bg-backpack-pink rounded-md p-1">
                {glyphCounts.regular}
              </span>
            ) : null}
          </button>
          <button onClick={() => setWeight('thin')}>
            Thin{' '}
            {glyphCounts.thin ? (
              <span className="bg-backpack-pink rounded-md p-1">
                {glyphCounts.thin}
              </span>
            ) : null}
          </button>
          <button onClick={() => setWeight('light')}>
            Light{' '}
            {glyphCounts.light ? (
              <span className="bg-backpack-pink rounded-md p-1">
                {glyphCounts.light}
              </span>
            ) : null}
          </button>
          <button onClick={() => setWeight('bold')}>
            Bold{' '}
            {glyphCounts.bold ? (
              <span className="bg-backpack-pink rounded-md p-1">
                {glyphCounts.bold}
              </span>
            ) : null}
          </button>
          <button onClick={() => setWeight('fill')}>
            Fill{' '}
            {glyphCounts.fill ? (
              <span className="bg-backpack-pink rounded-md p-1">
                {glyphCounts.fill}
              </span>
            ) : null}
          </button>
          <button onClick={() => setWeight('duotone')}>
            Duotone{' '}
            {glyphCounts.duotone ? (
              <span className="bg-backpack-pink rounded-md p-1">
                {glyphCounts.duotone}
              </span>
            ) : null}
          </button>
        </div>

        <Selector
          key={weight}
          weight={weight}
          entries={entries}
          selections={selections}
          onSelect={setSelection}
        />
      </li>
      <li className="bg-white shadow-lg shadow-black/20">
        <h2 className="p-4">Review font</h2>
        <Review />
      </li>
      <li className="bg-white shadow-lg shadow-black/20">
        <h2 className="p-4">Configure font</h2>
        <Configurator />
      </li>
    </ol>
  );
};
