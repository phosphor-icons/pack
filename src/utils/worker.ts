import type { FontEditor } from "fonteditor-core";
import { FontPacker } from "./packer";
import { WorkerHost } from "./syncbridge";
import type { Message, FontRequest, SerialFontFormatMap } from "./types";

// type M = Message<FontRequest> & {
//   type: "pack";
// };

const host = new WorkerHost<FontRequest>("packer");

// Handle messages from the main thread
// NOTE: we can skip checking channel and message ids ourselves,
// as the wrapper has already filtered them out for us!
host.on("message", async (event) => {
  const { type, payload } = event.data;

  switch (type) {
    case "pack":
      const packer = new FontPacker(payload!.icons, payload!.version);

      try {
        const pack = await packer.generate(payload!.formats, payload!.inline);

        // if (process.env.NODE_ENV === "development") {
        //   emitTestPage(req, pack);
        // }
        return {
          ...pack,
          fonts: Object.entries(pack.fonts).reduce<SerialFontFormatMap>(
            (acc, [fmt, buff]) => {
              acc[fmt as FontEditor.FontType] = btoa(
                Array.from(new Uint8Array(buff))
                  .map((b) => String.fromCharCode(b))
                  .join(""),
              );
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
      break;
    default:
      return { error: `Unknown message type "${type}"` };
      break;
  }
});
