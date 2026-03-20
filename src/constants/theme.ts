import type { TextStyle } from "react-native";

import type { Theme } from "../types/travel";

export type ThemePreference = Theme | "system";

export type ThemeColors = {
  primary: string;
  background: string;
  surface: string;
  text: string;
  error: string;
  success: string;
  border: string;
  shadow: string;
};

export type TypographyToken = {
  fontSize: number;
  lineHeight: number;
  fontWeight: TextStyle["fontWeight"];
};

export type TypographyScale = {
  caption: TypographyToken;
  body: TypographyToken;
  bodyBold: TypographyToken;
  title: TypographyToken;
  heading: TypographyToken;
};

export const COLOR_PALETTES: Record<Theme, ThemeColors> = {
  light: {
    primary: "#0A7EA4",
    background: "#F5F7FA",
    surface: "#FFFFFF",
    text: "#152238",
    error: "#B42318",
    success: "#15803D",
    border: "#D1D9E6",
    shadow: "#0F172A",
  },
  dark: {
    primary: "#38BDF8",
    background: "#0B1220",
    surface: "#111C31",
    text: "#E6EDF8",
    error: "#F97066",
    success: "#4ADE80",
    border: "#26364F",
    shadow: "#000000",
  },
};

export const TYPOGRAPHY: TypographyScale = {
  caption: { fontSize: 12, lineHeight: 16, fontWeight: "400" },
  body: { fontSize: 16, lineHeight: 22, fontWeight: "400" },
  bodyBold: { fontSize: 16, lineHeight: 22, fontWeight: "600" },
  title: { fontSize: 20, lineHeight: 26, fontWeight: "600" },
  heading: { fontSize: 28, lineHeight: 34, fontWeight: "700" },
};
