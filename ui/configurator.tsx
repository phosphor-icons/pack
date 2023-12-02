'use client';

import { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { FontEditor } from 'fonteditor-core';
import { generateFont } from '#/app/api/packer';
import { selectionAtom } from '#/state';
import { IconStyle } from '@phosphor-icons/core';

export function Configurator() {
  const selections = useRecoilValue(selectionAtom);
  const [woff, setWoff] = useState<boolean>(true);
  const [ttf, setTtf] = useState<boolean>(false);
  const [otf, setOtf] = useState<boolean>(false);
  const [woff2, setWoff2] = useState<boolean>(false);
  const [eot, setEot] = useState<boolean>(false);
  const [svg, setSvg] = useState<boolean>(false);
  const [output, setOutput] = useState<'inline' | 'preferred' | 'external'>(
    'inline',
  );
  const [css, setCss] = useState<string>('');

  async function requestSubfont() {
    const icons = Object.entries(selections).reduce((acc, [weight, names]) => {
      acc[weight as IconStyle] = Array.from(names);
      return acc;
    }, {} as Partial<Record<IconStyle, string[]>>);
    const res = await generateFont({
      icons,
      formats: Object.entries({ ttf, otf, woff2, woff, eot, svg })
        .filter(([k, v]) => v)
        .map(([k]) => k as FontEditor.FontType),
      inline: output === 'inline',
    });
    setCss(res);
  }

  return (
    <div className="px-4 pb-4">
      <form className="flex gap-8">
        <fieldset name="formats" className="flex flex-col gap-1">
          <legend className="text-sm font-bold">Formats</legend>
          <label className="ml-2 flex items-center gap-2 ">
            <input
              type="checkbox"
              name="woff"
              checked={woff}
              onChange={() => setWoff(!woff)}
            />
            <span>woff</span>
          </label>

          <label className="ml-2 flex items-center gap-2 ">
            <input
              type="checkbox"
              name="ttf"
              checked={ttf}
              onChange={() => setTtf(!ttf)}
            />
            <span>ttf</span>
          </label>

          <s>
            <label className="ml-2 flex items-center gap-2 ">
              <input
                disabled
                type="checkbox"
                name="otf"
                checked={otf}
                onChange={() => setOtf(!otf)}
              />
              <span>otf</span>
            </label>
          </s>

          <s>
            <label className="ml-2 flex items-center gap-2 ">
              <input
                disabled
                type="checkbox"
                name="woff2"
                checked={woff2}
                onChange={() => setWoff2(!woff2)}
              />
              <span>woff2</span>
            </label>
          </s>

          <s>
            <label className="ml-2 flex items-center gap-2 ">
              <input
                disabled
                type="checkbox"
                name="eot"
                checked={eot}
                onChange={() => setEot(!eot)}
              />
              <span>eot</span>
            </label>
          </s>

          <s>
            <label className="ml-2 flex items-center gap-2 ">
              <input
                disabled
                type="checkbox"
                name="svg"
                checked={svg}
                onChange={() => setSvg(!svg)}
              />
              <span>svg</span>
            </label>
          </s>
        </fieldset>
        <fieldset name="version" className="flex flex-col gap-1">
          <legend className="text-sm font-bold">Version</legend>
          <select disabled defaultValue="2.0.3" className="self-start">
            <option value="2.0.3">2.0.3</option>
          </select>
        </fieldset>
        <fieldset
          name="output"
          className="flex flex-col gap-1"
          onChange={(e) =>
            setOutput(
              (e.target as HTMLInputElement).value as
                | 'inline'
                | 'preferred'
                | 'external',
            )
          }
        >
          <legend className="text-sm font-bold">Output</legend>
          <label className="ml-2 flex items-center gap-2 ">
            <input
              type="radio"
              name="output"
              value="inline"
              defaultChecked={output === 'inline'}
            />
            <span>CSS with inlined font(s)</span>
          </label>

          <label className="ml-2 flex items-center gap-2 ">
            <input
              type="radio"
              name="output"
              value="external"
              defaultChecked={output === 'external'}
            />
            <span>CSS and external font(s)</span>
          </label>

          <label className="ml-2 flex items-center gap-2 ">
            <input
              type="radio"
              name="output"
              value="preferred"
              defaultChecked={output === 'preferred'}
            />
            <span>Font(s) only</span>
          </label>
        </fieldset>
      </form>
      <div>
        <button onClick={requestSubfont}>Generate</button>
      </div>
      <textarea
        readOnly
        value={css}
        className="w-full leading-snug"
        style={{ fontFamily: 'monospace', fontSize: 12 }}
      />
    </div>
  );
}
