import { style } from "@vanilla-extract/css";
import { vars } from "./global.css";

export const button = style({
  position: "relative",
  appearance: "none",
  background: "none",
  border: "none",
  color: "inherit",
  cursor: "pointer",
  fontSize: 16,
  fontFamily: "inherit",
  ":hover": {
    outline: `2px solid ${vars.colors.shadow}`,
  },
  ":disabled": {
    cursor: "not-allowed",
    opacity: 0.7,
  },
});

export const basicButton = style([
  button,
  {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "16px 28px",
    border: `1px solid currentColor`,
    borderRadius: 8,
    boxShadow: `2px 2px 0px 0px ${vars.colors.shadow}`,
    transition: "box-shadow 200ms ease",
    ":active": {
      background: vars.colors.shadow,
      boxShadow: `0 0 0 0 ${vars.colors.shadow}`,
    },
  },
]);

export const link = style({
  textDecoration: "underline",
});

export const active = style({
  fontWeight: 700,
});

export const textButton = style([
  button,
  {
    padding: 0,
  },
]);
