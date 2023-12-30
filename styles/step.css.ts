import { style } from "@vanilla-extract/css";

export const steps = style({
  listStyle: "none",
  padding: 0,
  margin: 0,
});

export const step = style({
  paddingTop: 24,
  paddingBottom: 40,
  borderTop: `2px solid currentColor`,
});

export const stepHeader = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
});

export const stepTitle = style({
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
});

export const stepNumber = style({
  fontSize: 24,
});

export const stepName = style({
  fontSize: 16,
  fontWeight: 700,
  margin: 0,
});
