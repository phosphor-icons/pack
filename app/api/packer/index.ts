'use server';

import fs from 'node:fs';
import { IconWeight } from '@phosphor-icons/react';
import { FontEditor } from 'fonteditor-core';
import { FontPacker } from './packer';

type FontRequest = {
  icons: Partial<Record<IconWeight, string[]>>;
  version?: `${number}.${number}.${number}`;
  formats?: FontEditor.FontType[];
  inline?: boolean;
};

export async function createStrippedFont(req: FontRequest): Promise<string> {
  'use server';

  const packer = new FontPacker(req.icons, req.version);
  const fonts = await packer.generate(req.formats, req.inline);

  if (process.env.NODE_ENV === 'development') {
    emitTestPage(req, fonts);
  }
  return fonts.css;
}

function emitTestPage(
  req: FontRequest,
  pack: {
    fonts: Partial<Record<FontEditor.FontType, ArrayBuffer>>;
    css: string;
  },
) {
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
  fs.writeFileSync('.tmp/bold.ttf', String(pack.fonts.ttf!));
}
