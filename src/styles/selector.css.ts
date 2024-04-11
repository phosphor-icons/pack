import { style } from "@vanilla-extract/css";
import { vars } from "./global.css";

export const container = style({
  display: "grid",
  gridTemplateColumns: `${vars.dimensions.rail} 1fr`,
  gap: 8,
  paddingTop: 48,
  paddingLeft: 32,
});

export const weightList = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: 20,
});

export const weightButton = style({
  position: "relative",
  appearance: "none",
  background: "none",
  border: "none",
  padding: 0,
  cursor: "pointer",
  fontSize: 16,
  fontFamily: "inherit",
});

export const weightButtonActive = style({
  fontWeight: 700,
});

export const weightCount = style({
  position: "absolute",
  top: -8,
  right: -32,
  padding: "1px 4px",
  background: vars.colors.acid,
  borderRadius: 4,
  fontSize: 12,
  fontWeight: 700,
});

export const selectionArea = style({
  cursor: "cell",
  overflowY: "auto",
});

export const grid = style({
  display: "flex",
  flexWrap: "wrap",
  justifyItems: "center",
  gap: 4,
});

export const icon = style({
  fontSize: 32,
  padding: 4,
  width: 32,
  height: 32,
  transition: "background 150ms ease",
});

export const selection = style({
  background: vars.colors.acid,
  borderRadius: 4,
});

export const selectionActions = style({
  display: "inline-flex",
  alignItems: "center",
  gap: 24,
});
