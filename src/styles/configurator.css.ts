import { style } from "@vanilla-extract/css";

export const container = style({
  display: "grid",
  gridTemplateColumns: `1fr 1fr`,
  gap: 8,
  paddingTop: 40,
  paddingLeft: 32,
});
