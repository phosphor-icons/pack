import { style } from "@vanilla-extract/css";
import { vars } from "#/styles/global.css";

export const body = style({
  color: vars.colors.moss,
  padding: 88,
});

export const main = style({
  maxWidth: 888,
  margin: "auto",
});

export const header = style({
  display: "flex",
  alignItems: "flex-end",
  justifyContent: "space-between",
  paddingBottom: 40,
});

export const logo = style({
  display: "inline-flex",
  alignItems: "flex-start",
  selectors: {
    "h1 &": {
      margin: 0,
    },
  },
});

export const name = style({
  fontSize: 40,
  fontWeight: 500,
  margin: 0,
});

export const icon = style({
  fontSize: 32,
});

export const slug = style({
  fontSize: 16,
  fontWeight: 500,
  margin: 0,
  marginBottom: 7,
});
