import { FontEditor } from "fonteditor-core";

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

export async function copyToClipboard(text: string) {
  return navigator.clipboard.writeText(text);
}

export function mimeTypeForFont(fmt: FontEditor.FontType): string {
  return `font/${fmt}`;
}
