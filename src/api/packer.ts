import fs from "node:fs";
import { IconStyle } from "@phosphor-icons/core";
import { FontEditor } from "fonteditor-core";
import type {
  FontPack,
  SemVer,
  SerialFontFormatMap,
  SerialFontPack,
} from "@/utils/types";
import { WorkerClient } from "@/utils/syncbridge";
// @ts-ignore
import workerUrl from "../utils/worker?worker&url";

type FontRequest = {
  icons: Partial<Record<IconStyle, string[]>>;
  version?: SemVer;
  formats?: FontEditor.FontType[];
  inline?: boolean;
};

const packer = new WorkerClient(
  workerUrl,
  // new URL("../utils/worker.ts", import.meta.url).toString(),
  "packer",
);

export async function generateFont(
  req: FontRequest,
): Promise<SerialFontPack | { error: string }> {
  return packer.post({ type: "pack", payload: req });
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
