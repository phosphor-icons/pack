import { style } from "@vanilla-extract/css";
import { vars } from "./global.css";

export const search = style({
  display: "inline-flex",
  padding: "8px 8px 8px 16px",
  alignItems: "center",
  gap: 8,
  background: vars.colors.vellum,
  cursor: "text",
  borderRadius: 8,
  fontSize: 14,
  fontFamily: "inherit",
  ":hover": {
    outline: `2px solid ${vars.colors.shadow}`,
  },
});

export const input = style({
  appearance: "none",
  background: "none",
  fontWeight: 400,
  fontFamily: "inherit",
  minWidth: 210,
  border: "none",
  ":focus-within": {
    outline: "none",
  },
  "::placeholder": {
    color: "inherit",
  },
  "::-webkit-search-cancel-button": {
    WebkitAppearance: "none",
    backgroundColor: vars.colors.moss,
    WebkitMaskImage: `url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgZmlsbD0iIzNjMzMyZSIgdmlld0JveD0iMCAwIDI1NiAyNTYiPjxwYXRoIGQ9Ik0yMDUuNjYsMTk0LjM0YTgsOCwwLDAsMS0xMS4zMiwxMS4zMkwxMjgsMTM5LjMxLDYxLjY2LDIwNS42NmE4LDgsMCwwLDEtMTEuMzItMTEuMzJMMTE2LjY5LDEyOCw1MC4zNCw2MS42NkE4LDgsMCwwLDEsNjEuNjYsNTAuMzRMMTI4LDExNi42OWw2Ni4zNC02Ni4zNWE4LDgsMCwwLDEsMTEuMzIsMTEuMzJMMTM5LjMxLDEyOFoiPjwvcGF0aD48L3N2Zz4=")`,
    backgroundSize: "16px 16px",
    width: 16,
    height: 16,
    cursor: "pointer",
  },
});
