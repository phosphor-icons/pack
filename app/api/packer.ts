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
): Promise<SerialFontPack | { error: string }> {
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
          acc[fmt as FontEditor.FontType] =
            Buffer.from(buff).toString("base64");
          return acc;
        },
        {},
      ),
    };
  } catch (error) {
    console.error(error);

    if (error instanceof Error) {
      return { error: error.message };
    } else if (typeof error === "string") {
      return { error };
    } else {
      return { error: "Unknown server error" };
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
