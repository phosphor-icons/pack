'use server';

import fs from 'node:fs';
import { IconWeight } from '@phosphor-icons/react';
import { FontEditor } from 'fonteditor-core';
import { FontPacker, CACHE, FontFormatMap, FontPack, SemVer } from './packer';

type FontRequest = {
  icons: Partial<Record<IconWeight, string[]>>;
  version?: SemVer;
  formats?: FontEditor.FontType[];
  inline?: boolean;
};

type StaticSizeRequest = {
  weights: IconWeight[];
  version?: SemVer;
};

export async function generateFont(req: FontRequest): Promise<string> {
  'use server';

  const packer = new FontPacker(req.icons, req.version);
  const pack = await packer.generate(req.formats, req.inline);

  if (process.env.NODE_ENV === 'development') {
    emitTestPage(req, pack);
  }
  return pack.css;
}

export async function computeStaticSize(
  req: StaticSizeRequest,
): Promise<Partial<Record<IconWeight, { font: number; css: number }>>> {
  const sizes = await Promise.all(
    req.weights.map((weight) => CACHE.getAssetSize(weight)),
  );
  return sizes.reduce((acc, curr, i) => {
    acc[req.weights[i]] = curr;
    return acc;
  }, {} as Partial<Record<IconWeight, { font: number; css: number }>>);
}

function emitTestPage(req: FontRequest, pack: FontPack) {
  fs.writeFileSync(
    '.tmp/test.html',
    `\
<!DOCTYPE html>
<html>
  <head>
    <style>
      :root {
        font-size: 48px;
        color: purple;
      }
    </style>
    <style>
      ${pack.css}
    </style>
  </head>
  <body>
    <h6>Should render</h6>
      ${Object.entries(req.icons)
        .map(([weight, names]) =>
          names
            .map(
              (name) =>
                `<i class="ph${
                  weight === 'regular' ? '' : `-${weight}`
                } ph-${name}"></i>`,
            )
            .join('\n'),
        )
        .join('\n')}
    <h6>Should not render</h6>
  </body>
</html>
`,
  );
  fs.writeFileSync('.tmp/Phosphor.ttf', String(pack.fonts.ttf!));
  fs.writeFileSync('.tmp/style.css', String(pack.css));
}
