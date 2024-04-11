import { FontEditor } from "fonteditor-core";
import { IconStyle } from "@phosphor-icons/core";

export type SemVer = `${number}.${number}.${number}`;
export type IconStyleMap = Partial<Record<IconStyle, string[]>>;
export type FontFormatMap = Partial<Record<FontEditor.FontType, ArrayBuffer>>;
export type SerialFontFormatMap = Partial<Record<FontEditor.FontType, string>>;

export type FontRequest = {
  icons: Partial<Record<IconStyle, string[]>>;
  version?: SemVer;
  formats?: FontEditor.FontType[];
  inline?: boolean;
};

export interface Message<D> {
  id: string;
  channel: string;
  type: string;
  payload?: D;
  error?: any;
}

export type FontPack = {
  fonts: FontFormatMap;
  css: string;
};

export type SerialFontPack = {
  fonts: SerialFontFormatMap;
  css: string;
};
