'use client';

import { useRecoilValue } from 'recoil';
import { reviewSelector } from '#/state';

export function Review() {
  const selections = useRecoilValue(reviewSelector);

  return (
    <div>
      <p>{JSON.stringify(selections)}</p>
    </div>
  );
}
