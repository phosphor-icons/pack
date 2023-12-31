import { IconStyle, icons } from "@phosphor-icons/core";
import { Font, FontEditor, woff2 } from "fonteditor-core";

const CDN_BASE_URL = "https://unpkg.com/@phosphor-icons";

export type SemVer = `${number}.${number}.${number}`;
export type IconStyleMap = Partial<Record<IconStyle, string[]>>;
export type FontFormatMap = Partial<Record<FontEditor.FontType, ArrayBuffer>>;
export type SerialFontFormatMap = Partial<
  Record<FontEditor.FontType, Uint8Array>
>;

export type FontPack = {
  fonts: FontFormatMap;
  css: string;
};

export type SerialFontPack = {
  fonts: SerialFontFormatMap;
  css: string;
};

type IcoMoonSelection = {
  IcoMoonType: "selection";
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

export const CACHE = new (class {
  private selections: Map<SemVer, Map<IconStyle, IcoMoonSelection>> = new Map();
  private fonts: Map<SemVer, Map<IconStyle, ArrayBuffer>> = new Map();
  private css: Map<SemVer, Map<IconStyle, ArrayBuffer>> = new Map();
  constructor() {}

  private packageVersion(version: SemVer): string {
    return !!version ? `web@${version}` : "web";
  }

  private fontName(weight: IconStyle): string {
    return weight === "regular"
      ? "Phosphor"
      : `Phosphor-${weight.replace(/^\w/, (c) => c.toUpperCase())}`;
  }

  private fontURL(weight: IconStyle, version: SemVer): string {
    return `${CDN_BASE_URL}/${this.packageVersion(
      version,
    )}/src/${weight}/${this.fontName(weight)}.ttf`;
  }

  private cssURL(weight: IconStyle, version: SemVer): string {
    return `${CDN_BASE_URL}/${this.packageVersion(
      version,
    )}/src/${weight}/style.css`;
  }

  private selectionURL(weight: IconStyle, version: SemVer) {
    return `${CDN_BASE_URL}/${this.packageVersion(
      version,
    )}/src/${weight}/selection.json`;
  }

  async getSelection(weight: IconStyle, version: SemVer = "2.0.3") {
    let v = this.selections.get(version);
    if (!v) {
      v = new Map();
      this.selections.set(version, v);
    }

    let selection = v.get(weight);
    if (!selection) {
      const res = await fetch(this.selectionURL(weight, version), {
        method: "GET",
        mode: "cors",
        cache: "default",
      });

      if (res.status !== 200) {
        throw new Error(res.statusText);
      }

      selection = (await res.json()) as IcoMoonSelection;
      v.set(weight, selection);
    }

    return selection;
  }

  async getFont(weight: IconStyle, version: SemVer = "2.0.3") {
    let v = this.fonts.get(version);
    if (!v) {
      v = new Map();
      this.fonts.set(version, v);
    }

    let buffer = v.get(weight);
    if (!buffer) {
      const res = await fetch(this.fontURL(weight, version), {
        method: "GET",
        mode: "cors",
        cache: "default",
      });

      if (res.status !== 200) {
        throw new Error(res.statusText);
      }

      buffer = await res.arrayBuffer();
      v.set(weight, buffer);
    }

    return buffer;
  }

  async getCSS(weight: IconStyle, version: SemVer = "2.0.3") {
    let v = this.css.get(version);
    if (!v) {
      v = new Map();
      this.css.set(version, v);
    }

    let css = v.get(weight);
    if (!css) {
      const res = await fetch(this.cssURL(weight, version), {
        method: "GET",
        mode: "cors",
        cache: "default",
      });

      if (res.status !== 200) {
        throw new Error(res.statusText);
      }

      css = await res.arrayBuffer();
      v.set(weight, css);
    }

    return css;
  }

  async getAssetSize(weight: IconStyle, version: SemVer = "2.0.3") {
    const font = (await this.getFont(weight, version)).byteLength;
    const css = (await this.getCSS(weight, version)).byteLength;

    return { font, css };
  }
})();

class FontSubset {
  private names: Set<string>;
  weight: IconStyle;
  version?: SemVer;
  codes: Map<string, number[]> = new Map();
  font: FontEditor.Font = Font.create();

  constructor(weight: IconStyle, names: string[], version?: SemVer) {
    this.weight = weight;
    this.version = version;
    this.names = new Set(names.filter(Boolean));
  }

  fontName(): string {
    return this.weight === "regular"
      ? "Phosphor"
      : `Phosphor-${this.weight.replace(/^\w/, (c) => c.toUpperCase())}`;
  }

  glyphName(iconName: string): string {
    if (this.weight === "regular") return iconName;
    return `${iconName}-${this.weight}`;
  }

  prefixClass(): string {
    return this.weight === "regular" ? ".ph" : `.ph-${this.weight}`;
  }

  private generateIconCSS(name: string) {
    const codes = this.codes.get(name);

    if (!codes) {
      throw new Error(`Could not find code points for "${name}"`);
    }

    if (codes.length > 2 || codes.length === 0) {
      throw new Error(`Invalid number of code points for ${name}: ${codes}`);
    }

    if (this.weight === "duotone") {
      if (codes.length === 2) {
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
        return `\
.ph-duotone.ph-${name}:before {
  content: "\\${codes[0].toString(16)}";
}`;
      }
    } else {
      if (codes.length !== 1) {
        throw new Error(`Invalid number of code points: ${codes}`);
      }
      return `\
${this.prefixClass()}.ph-${name}:before {
    content: "\\${codes[0].toString(16)}";
}`;
    }
  }

  async initialize() {
    const selection = await CACHE.getSelection(this.weight, this.version);

    for (const name of Array.from(this.names)) {
      let matchName = this.glyphName(name);
      if (name === "file-search") {
        matchName = this.glyphName("file-magnifying-glass");
      }

      let entry = selection.icons.find(
        (entry) => entry.properties.name === matchName,
      );
      if (!entry) {
        const iconEntry = icons.find((e) => e.alias?.name === name);
        if (iconEntry) {
          let matchName = this.glyphName(iconEntry.alias!.name);
          entry = selection.icons.find(
            (entry) => entry.properties.name === matchName,
          );
          break;
        }
        throw new Error(`Selection match not found for "${matchName}"`);
      }
      this.codes.set(name, entry.properties.codes ?? [entry.properties.code]);
    }
  }

  async prepareFont() {
    await this.initialize();

    const buffer = await CACHE.getFont(this.weight, this.version);
    const codePoints = Array.from(this.codes.values()).flat();

    this.font = Font.create(buffer, {
      type: "ttf",
      subset: codePoints,
      hinting: false,
      compound2simple: true,
    });
  }

  generateIconsCSS(): string[] {
    return Array.from(this.codes.keys()).map((name) =>
      this.generateIconCSS(name),
    );
  }
}

export class FontPacker {
  private subsets: FontSubset[];

  constructor(icons: IconStyleMap, version?: SemVer) {
    this.subsets = Object.entries(icons)
      .filter(([_, names]) => !!names.length)
      .map(
        ([weight, names]) =>
          new FontSubset(weight as IconStyle, names, version),
      );
  }

  private prefixClasses() {
    return this.subsets.map((subset) => subset.prefixClass()).join(", ");
  }

  private generatePrefixClassDefinition(
    fonts: FontFormatMap,
    buffer?: ArrayBuffer | null,
  ) {
    const fmts: [extension: string, format: string][] = Object.keys(fonts).map(
      (fmt) =>
        fmt === "ttf"
          ? [fmt, "truetype"]
          : fmt === "otf"
          ? [fmt, "opentype"]
          : fmt === "eot"
          ? [fmt, "embedded-opentype"]
          : [fmt, fmt],
    );

    const source = buffer
      ? // TODO: use a preferred format??
        `url(data:font/${fmts[0][1]};charset=utf-8;base64,${Font.toBase64(
          buffer,
        )})`
      : fmts
          .map(
            ([extension, format]) =>
              `url("<your-path-to>/Phosphor.${extension}${
                format === "svg" ? `#Phosphor` : ""
              }") format("${format}")`,
          )
          .join(", ");

    return `\
@font-face {
    font-family: "Phosphor";
    src: ${source};
    font-weight: normal;
    font-style: normal;
    font-display: block;
}

${this.prefixClasses()} {
    /* use !important to prevent issues with browser extensions that change fonts */
    font-family: "Phosphor" !important;
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

  private mergeCSS(fonts: FontFormatMap, buffer: ArrayBuffer | null) {
    const classes = this.subsets
      .map((subset) => subset.generateIconsCSS())
      .flat()
      .join("\n");

    return `\
${this.generatePrefixClassDefinition(fonts, buffer)}
${classes}
`;
  }

  private remapCodePointsIfNeeded() {
    const PUA_START = 0xe000;
    const PUA_END = 0xf8ff;
    const SPUA_A_START = 0xf0000;
    const usedCodes = new Set<number>();

    let next = PUA_START;
    function nextAvailableCodePoint() {
      while (usedCodes.has(next)) {
        next += 1;
        if (next === PUA_END + 1) {
          next = SPUA_A_START;
        }
      }

      return next;
    }

    for (const subset of this.subsets) {
      for (const [key, codes] of subset.codes) {
        codes.forEach((codePoint, i) => {
          const [glyph] = subset.font.find({ unicode: [codePoint] });
          if (!glyph) {
            throw new Error(
              `Glyph for code point 0x${codePoint} (${key}) not found`,
            );
          }

          glyph.name = key;

          if (usedCodes.has(codePoint)) {
            const newCodePoint = nextAvailableCodePoint();

            // Reassign glyph code point
            glyph.unicode = [newCodePoint];

            // Reassign in cmap
            const cmap = subset.font.get().cmap;
            const idx = cmap[codePoint];
            delete cmap[codePoint];
            cmap[newCodePoint] = idx;

            // Reassign in local map
            codes[i] = newCodePoint;
            usedCodes.add(newCodePoint);
          } else {
            usedCodes.add(codePoint);
          }
        });
      }
    }
  }

  async generate(
    formats: FontEditor.FontType[] = ["woff", "ttf", "svg"],
    inline?: boolean,
  ): Promise<FontPack> {
    let woff2editor: FontEditor.Woff2;
    if (formats.includes("woff2") && !woff2.isInited) {
      woff2editor = await woff2.init();
    }

    await Promise.all(this.subsets.map((subset) => subset.prepareFont()));
    this.remapCodePointsIfNeeded();

    let mergedFont: FontEditor.Font;
    if (this.subsets.length === 1) {
      mergedFont = this.subsets[0].font;
    } else if (this.subsets.length > 1) {
      mergedFont = this.subsets[0].font;
      for (let i = 1; i < this.subsets.length; i++) {
        mergedFont = mergedFont.merge(this.subsets[i].font, { scale: 1 });
      }
    } else {
      throw new Error("Font must contain at least 1 glyph!");
    }

    const fonts = formats.reduce<FontFormatMap>((acc, format) => {
      if (format === "woff2") {
        acc[format] = woff2editor.encode(
          mergedFont.write({
            type: "ttf",
            hinting: false,
            writeZeroContoursGlyfData: true,
            metadata: "" /*TODO*/,
            toBuffer: true,
          }),
        );
      } else {
        try {
          acc[format] = mergedFont.write({
            type: format,
            hinting: false,
            writeZeroContoursGlyfData: true,
            metadata: "" /*TODO*/,
            toBuffer: true,
          });
        } catch (e) {
          console.error(e);
          console.log(
            mergedFont.get().glyf[5886],
            mergedFont.find({ unicode: mergedFont.get().glyf[5886].unicode }),
          );
        }
      }
      return acc;
    }, {});

    // TODO: preferred font!
    const css = this.mergeCSS(fonts, inline ? fonts[formats[0]]! : null);
    return { fonts, css };
  }
}
