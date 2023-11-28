import fs from 'node:fs';
import { IconWeight } from '@phosphor-icons/react';
import { Font, FontEditor } from 'fonteditor-core';

const CDN_BASE_URL = 'https://unpkg.com/@phosphor-icons';

export type Version = `${number}.${number}.${number}`;

type FontCSS = {
  fontFace: string;
  iconClasses: string[];
};

type SubsetResult = FontCSS & {
  fonts: Partial<Record<FontEditor.FontType, ArrayBuffer>>;
};

type IcoMoonSelection = {
  IcoMoonType: 'selection';
  icons: {
    icon: {
      paths: string[];
      attrs: Record<string, string>[];
      isMulticolor: boolean;
      isMulticolor2: boolean;
      grid: number;
      tags: string[];
    };
    attrs: Record<string, string>[];
    properties: {
      order: number;
      id: number;
      name: string;
      prevSize: number;
      code: number;
      codes?: number[];
      ligatures: string;
    };
    setIdx: number;
    setId: number;
    iconIdx: number;
  }[];
};

const CACHE = new (class {
  private selections: Map<Version, Map<IconWeight, IcoMoonSelection>> =
    new Map();
  private fonts: Map<Version, Map<IconWeight, ArrayBuffer>> = new Map();
  constructor() {}

  private packageVersion(version: Version): string {
    return !!version ? `web@${version}` : 'web';
  }

  private fontName(weight: IconWeight): string {
    return weight === 'regular'
      ? 'Phosphor'
      : `Phosphor-${weight.replace(/^\w/, (c) => c.toUpperCase())}`;
  }

  private fontURL(weight: IconWeight, version: Version): string {
    return `${CDN_BASE_URL}/${this.packageVersion(
      version,
    )}/src/${weight}/${this.fontName(weight)}.ttf`;
  }

  private selectionURL(weight: IconWeight, version: Version) {
    return `${CDN_BASE_URL}/${this.packageVersion(
      version,
    )}/src/${weight}/selection.json`;
  }

  async getSelection(weight: IconWeight, version: Version = '2.0.3') {
    let v = this.selections.get(version);
    if (!v) {
      v = new Map();
      this.selections.set(version, v);
    }

    let selection = v.get(weight);
    if (!selection) {
      const res = await fetch(this.selectionURL(weight, version), {
        method: 'GET',
        mode: 'cors',
        cache: 'default',
      });

      if (res.status !== 200) {
        throw new Error(res.statusText);
      }

      selection = (await res.json()) as IcoMoonSelection;
      v.set(weight, selection);
    }

    return selection;
  }

  async getFont(weight: IconWeight, version: Version = '2.0.3') {
    let v = this.fonts.get(version);
    if (!v) {
      v = new Map();
      this.fonts.set(version, v);
    }

    let buffer = v.get(weight);
    if (!buffer) {
      const res = await fetch(this.fontURL(weight, version), {
        method: 'GET',
        mode: 'cors',
        cache: 'default',
      });

      if (res.status !== 200) {
        throw new Error(res.statusText);
      }

      buffer = await res.arrayBuffer();
      v.set(weight, buffer);
    }

    return buffer;
  }
})();

class FontSubset {
  private names: Set<string>;
  weight: IconWeight;
  version?: Version;
  codes: Map<string, number[]> = new Map();

  constructor(weight: IconWeight, names: string[], version?: Version) {
    this.weight = weight;
    this.version = version;
    this.names = new Set(names.filter(Boolean));
  }

  fontName(): string {
    return this.weight === 'regular'
      ? 'Phosphor'
      : `Phosphor-${this.weight.replace(/^\w/, (c) => c.toUpperCase())}`;
  }

  glyphName(iconName: string): string {
    if (this.weight === 'regular') return iconName;
    return `${iconName}-${this.weight}`;
  }

  prefixClass(): string {
    return this.weight === 'regular' ? 'ph' : `ph-${this.weight}`;
  }

  private generateFontFace(
    formats: FontEditor.FontType[],
    buffer?: ArrayBuffer | null,
  ) {
    const name = this.fontName();
    const fmts: [extension: string, format: string][] = formats.map((fmt) =>
      fmt === 'ttf'
        ? [fmt, 'truetype']
        : fmt === 'otf'
        ? [fmt, 'opentype']
        : [fmt, fmt],
    );

    const source = buffer
      ? `url(data:font/${fmts[0][1]};charset=utf-8;base64,${Font.toBase64(
          buffer,
        )})`
      : fmts
          .map(
            ([extension, format]) =>
              `url("<your-path-to>/${name}.${extension}${
                format === 'svg' ? `#${name}` : ''
              }") format("${format}")`,
          )
          .join(', ');

    return `\
@font-face {
    font-family: "${name}";
    src: ${source};
    font-weight: normal;
    font-style: normal;
    font-display: block;
}
.${this.prefixClass()} {
    /* use !important to prevent issues with browser extensions that change fonts */
    font-family: "${name}" !important;
    speak: never;
    font-style: normal;
    font-weight: normal;
    font-variant: normal;
    text-transform: none;
    line-height: 1;
  
    /* Better Font Rendering =========== */
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
`;
  }

  private generateIconClass(name: string) {
    const codes = this.codes.get(name);

    if (!codes) {
      throw new Error(`Could not find code points for "${name}"`);
    }

    if (this.weight === 'duotone') {
      if (codes.length !== 2) {
        throw new Error(`Invalid number of code points: ${codes}`);
      }
      return `\
.ph-duotone.ph-${name}:before {
    content: "\\${codes[0].toString(16)}";
    opacity: 0.2;
}
.ph-duotone.ph-${name}:after {
    content: "\\${codes[1].toString(16)}";
    margin-left: -1em;
}`;
    } else {
      if (codes.length !== 1) {
        throw new Error(`Invalid number of code points: ${codes}`);
      }
      return `\
.${this.prefixClass()}.ph-${name}:before {
    content: "\\${codes[0].toString(16)}";
}`;
    }
  }

  private async generateCSS(
    formats: FontEditor.FontType[],
    buffer?: ArrayBuffer | null,
  ): Promise<FontCSS> {
    const fontFace = this.generateFontFace(formats, buffer);
    const iconClasses = Array.from(this.codes.keys()).map((name) =>
      this.generateIconClass(name),
    );
    return { fontFace, iconClasses };
  }

  async initialize() {
    const selection = await CACHE.getSelection(this.weight, this.version);

    for (const name of Array.from(this.names)) {
      const matchName = this.glyphName(name);
      const entry = selection.icons.find(
        (entry) => entry.icon.tags[0] === matchName,
      );
      if (!entry) {
        throw new Error(`Selection match not found for "${matchName}"`);
      }
      this.codes.set(name, entry.properties.codes ?? [entry.properties.code]);
    }
  }

  async generate(
    formats: FontEditor.FontType[] = ['woff', 'ttf', 'svg'],
    inline?: boolean,
  ): Promise<SubsetResult> {
    await this.initialize();

    const buffer = await CACHE.getFont(this.weight, this.version);
    const codePoints = Array.from(this.codes.values()).flat();

    const fonts = formats.reduce<
      Partial<Record<FontEditor.FontType, ArrayBuffer>>
    >((fonts, format) => {
      const editor = Font.create(buffer, {
        type: 'ttf',
        subset: codePoints,
        hinting: false,
        compound2simple: true,
      });
      const packed = editor.write({
        type: format,
        hinting: false,
        writeZeroContoursGlyfData: false,
        metadata: '/*TODO*/',
        // support: { /*TODO*/ head: {}, hhea: {} },
        toBuffer: true,
      });
      fonts[format] = packed;
      return fonts;
    }, {});

    // TODO: which to inline??
    const inlineBuffer = inline ? fonts[formats[0]] : null;
    const css = await this.generateCSS(formats, inlineBuffer);
    return { fonts, ...css };
  }
}

export class FontPacker {
  private subsets: FontSubset[];

  constructor(icons: Partial<Record<IconWeight, string[]>>, version?: Version) {
    this.subsets = Object.entries(icons).map(
      ([weight, names]) => new FontSubset(weight as IconWeight, names, version),
    );
  }

  private mergeCSS(packs: SubsetResult[]) {
    const { faces, classes } = packs.reduce<{
      faces: string[];
      classes: string[];
    }>(
      (acc, curr) => {
        acc.faces.push(curr.fontFace);
        acc.classes.push(...curr.iconClasses);
        return acc;
      },
      { faces: [], classes: [] },
    );

    return [...faces, ...classes].join('\n');
  }

  async generate(
    formats: FontEditor.FontType[] = ['woff', 'ttf', 'svg'],
    inline?: boolean,
  ): Promise<{
    fonts: Partial<Record<FontEditor.FontType, ArrayBuffer>>;
    css: string;
  }> {
    const packs = await Promise.all(
      this.subsets.map((subset) => subset.generate(formats, inline)),
    );
    const css = this.mergeCSS(packs);
    return { fonts: packs[0].fonts, css };
  }
}
