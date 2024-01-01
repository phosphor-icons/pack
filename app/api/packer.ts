"use server";

import fs from "node:fs";
import { IconStyle } from "@phosphor-icons/core";
import { FontEditor } from "fonteditor-core";
import {
  FontPacker,
  FontPack,
  SemVer,
  SerialFontFormatMap,
  SerialFontPack,
} from "#/utils/packer";

type FontRequest = {
  icons: Partial<Record<IconStyle, string[]>>;
  version?: SemVer;
  formats?: FontEditor.FontType[];
  inline?: boolean;
};

export async function generateFont(
  req: FontRequest,
): Promise<SerialFontPack | Error> {
  "use server";

  const packer = new FontPacker(req.icons, req.version);

  try {
    const pack = await packer.generate(req.formats, req.inline);

    if (process.env.NODE_ENV === "development") {
      emitTestPage(req, pack);
    }
    return {
      ...pack,
      fonts: Object.entries(pack.fonts).reduce<SerialFontFormatMap>(
        (acc, [fmt, buff]) => {
          acc[fmt as FontEditor.FontType] = new Uint8Array(buff);
          return acc;
        },
        {},
      ),
    };
  } catch (e) {
    if (e instanceof Error) {
      return e;
    } else if (typeof e === "string") {
      return new Error(e);
    } else {
      return new Error("Unknown server error");
    }
  }
}

function emitTestPage(req: FontRequest, pack: FontPack) {
  fs.writeFileSync(
    ".tmp/test.html",
    `\
<!DOCTYPE html>
<html>
  <head>
    <style>
      :root {
        font-size: 48px;
        color: #3f51b5;
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
                `<i title="${name}" class="ph${
                  weight === "regular" ? "" : `-${weight}`
                } ph-${name}"></i>`,
            )
            .join("\n"),
        )
        .join("\n")}
    <h6>Should not render</h6>
  </body>
</html>
`,
  );

  for (const fmt of req.formats!) {
    fs.writeFileSync(`.tmp/Phosphor.${fmt}`, String(pack.fonts[fmt]));
  }
  fs.writeFileSync(".tmp/style.css", String(pack.css));
}
