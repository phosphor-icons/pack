import { style } from "@vanilla-extract/css";

export const container = style({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(48px, 1fr))",
  gap: 4,
});

export const example = style({
  display: "grid",
  placeItems: "center",
});
