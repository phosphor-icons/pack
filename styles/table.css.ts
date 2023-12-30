import { style } from "@vanilla-extract/css";

export const table = style({
  width: "100%",
  tableLayout: "fixed",
  borderCollapse: "collapse",
});

export const td = style({
  borderTop: "1px solid currentColor",
  padding: "16px 8px 16px 0",
});
