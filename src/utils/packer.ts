import { IconStyle } from "@phosphor-icons/core";
import type { SemVer } from "./types";

const CDN_BASE_URL = "https://unpkg.com/@phosphor-icons";

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
  constructor() { }

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

  async getSelection(weight: IconStyle, version: SemVer = "2.1.1") {
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

  async getFont(weight: IconStyle, version: SemVer = "2.1.1") {
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

  async getCSS(weight: IconStyle, version: SemVer = "2.1.1") {
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

  async getAssetSize(weight: IconStyle, version: SemVer = "2.1.1") {
    const font = (await this.getFont(weight, version)).byteLength;
    const css = (await this.getCSS(weight, version)).byteLength;

    return { font, css };
  }
})();

