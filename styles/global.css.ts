import { globalStyle, createGlobalTheme, style } from "@vanilla-extract/css";

export const vars = createGlobalTheme(":root", {
  colors: {
    acid: "#c4e456",
    olive: "#a4b55b",
    moss: "#3c402b",
    vellum: "#EEEAE3",
    shadow: "rgba(60, 64, 43, 0.20)",
  },
  dimensions: {
    rail: "160px",
  },
});

export const version = style({
  background: vars.colors.vellum,
  padding: "2px 4px",
  borderRadius: 4,
});

export const link = style({
  color: "inherit",
});

globalStyle(":root", {
  scrollbarColor: vars.colors.moss,
  scrollbarWidth: "thin",
});
