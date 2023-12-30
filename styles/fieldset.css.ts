import { style } from "@vanilla-extract/css";

export const fieldset = style({
  border: "none",
});

export const legend = style({
  marginBottom: 16,
});

export const items = style({
  display: "flex",
  flexDirection: "column",
  gap: 6,
  paddingInlineStart: 24,
});
