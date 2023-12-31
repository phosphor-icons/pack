import { style } from "@vanilla-extract/css";
import { vars } from "./global.css";

export const container = style({
  display: "grid",
  gridTemplateColumns: `${vars.dimensions.rail} 1fr`,
  gap: 8,
  paddingTop: 40,
  paddingLeft: 32,
});

export const centered = style({
  display: "grid",
  placeItems: "center",
  padding: 32,
});
