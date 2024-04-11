import { IconStyle } from "@phosphor-icons/core";
import { FontEditor } from "fonteditor-core";
import type { SemVer, SerialFontPack } from "@/utils/types";

const VAL_TOWN_ENDPOINT = "https://rektdeckard-FontPack.web.val.run";

type FontRequest = {
  icons: Partial<Record<IconStyle, string[]>>;
  version?: SemVer;
  formats?: FontEditor.FontType[];
  inline?: boolean;
};

export async function generateFont(
  req: FontRequest,
): Promise<SerialFontPack | { error: string }> {
  try {
    const res = await fetch(
      VAL_TOWN_ENDPOINT,
      {
        method: "POST",
        body: JSON.stringify(req),
      }
    );
    const pack = await res.json();

    if (process.env.NODE_ENV === "development") {
      // await emitTestPage(req, pack);
    }
    return pack;
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


// async function emitTestPage(req: FontRequest, pack: FontPack) {
//   const fs = await import("fs");
//   fs.writeFileSync(
//     ".tmp/test.html",
//     `\
// <!DOCTYPE html>
// <html>
//   <head>
//     <style>
//       :root {
//         font-size: 48px;
//         color: #3f51b5;
//       }
//     </style>
//     <style>
//       ${pack.css}
//     </style>
//   </head>
//   <body>
//     <h6>Should render</h6>
//       ${Object.entries(req.icons)
//       .map(([weight, names]) =>
//         names
//           .map(
//             (name) =>
//               `<i title="${name}" class="ph${weight === "regular" ? "" : `-${weight}`
//               } ph-${name}"></i>`,
//           )
//           .join("\n"),
//       )
//       .join("\n")}
//     <h6>Should not render</h6>
//   </body>
// </html>
// `,
//   );
//
//   for (const fmt of req.formats!) {
//     fs.writeFileSync(`.tmp/Phosphor.${fmt}`, String(pack.fonts[fmt]));
//   }
//   fs.writeFileSync(".tmp/style.css", String(pack.css));
// }
