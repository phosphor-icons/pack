import JSZip from "jszip";
import { FontEditor } from "fonteditor-core";
import { SerialFontPack } from "./packer";

export function downloadFile(blob: Blob, filename: string) {
  const url = window.URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.style.display = "none";
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(link);
}

export async function createZip(kit: SerialFontPack): Promise<Blob> {
  const zip = new JSZip();
  zip.file("Phosphor.css", kit.css);
  for (const [fmt, data] of Object.entries(kit.fonts)) {
    const filename = `Phosphor.${fmt}`;
    zip.file(filename, data, {
      binary: true,
    });
  }

  return zip.generateAsync({ type: "blob" });
}

export async function copyToClipboard(text: string) {
  return navigator.clipboard.writeText(text);
}

export function mimeTypeForFont(fmt: FontEditor.FontType): string {
  return `font/${fmt};base64`;
}
