'use client';

import { createStrippedFont } from '#/app/api/packer';

export default async function Page() {
  async function go() {
    const css = await createStrippedFont({
      icons: {
        duotone: [
          'hand-tap',
          'footprints',
          'cursor-click',
          'park',
          'tipi',
          'virus',
          'tooth',
          'tree-palm',
          'usb',
        ],
      },
      formats: ['ttf'],
      inline: true,
    });
    console.log(css);
  }
  return (
    <div className="space-y-8">
      <h1 className="text-xl font-medium text-gray-300">Generate</h1>
      <button onClick={go}>GENERATE IT</button>
    </div>
  );
}
