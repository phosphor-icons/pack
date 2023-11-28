'use client';

import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import {
  filteredQueryResultsSelector,
  searchQueryAtom,
  selectionAtom,
} from '#/state';
import { Selector } from './selector';
import { Review } from './review';
import { Configurator } from './configurator';

export const Main = () => {
  const [query, setQuery] = useRecoilState(searchQueryAtom);
  const entries = useRecoilValue(filteredQueryResultsSelector);
  const setSelection = useSetRecoilState(selectionAtom);

  return (
    <ol className="flex flex-col gap-4">
      <li className="bg-white shadow-lg shadow-black/20">
        <h2 className="p-4">Select icons</h2>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Selector entries={entries} onSelect={setSelection} />
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
