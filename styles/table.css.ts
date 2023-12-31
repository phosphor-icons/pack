import { style } from "@vanilla-extract/css";

export const table = style({
  width: "100%",
  tableLayout: "auto",
  borderCollapse: "collapse",
});

export const fixed = style({
  tableLayout: "fixed",
});

export const td = style({
  borderTop: "1px solid currentColor",
  padding: "16px 16px 16px 0",
});
