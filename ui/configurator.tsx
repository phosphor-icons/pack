'use client';

import { useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { createStrippedFont } from '#/app/api/packer';
import { reviewSelector } from '#/state';

export function Configurator() {
  const selections = useRecoilValue(reviewSelector);
  const [css, setCss] = useState<string>('');

  async function requestSubfont() {
    const res = await createStrippedFont({
      icons: selections,
      formats: ['ttf'],
      inline: true,
    });
    setCss(res);
  }

  return (
    <div>
      <div>
        <button onClick={requestSubfont}>Generate</button>
      </div>
      <textarea
        value={css}
        className="w-full leading-snug"
        style={{ fontFamily: 'monospace', fontSize: 12 }}
      />
    </div>
  );
}
