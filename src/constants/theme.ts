import type { TextStyle } from "react-native";

import type { Theme } from "../types/travel";

export type ThemePreference = Theme | "system";

export type ThemeColors = {
  primary: string;
  secondary: string;
  header: string;
  background: string;
  surface: string;
  text: string;
  error: string;
  success: string;
  warning: string;
  highlight: string;
  accent: string;
  border: string;
  shadow: string;
};

export type ThemeGradients = {
  spiderSense: [string, string];
  tVirus: [string, string];
  webShooter: [string, string];
  hazard: [string, string];
};

export type ThemeModeMeta = {
  label: string;
  shortLabel: string;
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
  heroTitle: TypographyToken;
  terminalHeader: TypographyToken;
  comicSpeech: TypographyToken;
  dataReadout: TypographyToken;
  statusLabel: TypographyToken;
};

export const COLOR_PALETTES: Record<Theme, ThemeColors> = {
  light: {
    primary: "#DF1F2D",
    secondary: "#447BBE",
    header: "#2B3784",
    background: "#F5F5F5",
    surface: "#FFFFFF",
    text: "#0A0A0A",
    error: "#B11313",
    success: "#39FF14",
    warning: "#FFD700",
    highlight: "#FFD700",
    accent: "#447BBE",
    border: "#0A0A0A",
    shadow: "#0A0A0A",
  },
  dark: {
    primary: "#00FF41",
    secondary: "#00D4FF",
    header: "#1A1A2E",
    background: "#050505",
    surface: "#1A1A2E",
    text: "#00FF41",
    error: "#FF0040",
    success: "#39FF14",
    warning: "#FFB800",
    highlight: "#FFB800",
    accent: "#00D4FF",
    border: "#2D0000",
    shadow: "#000000",
  },
};

export const MODE_META: Record<Theme, ThemeModeMeta> = {
  light: {
    label: "Light Mode - Hero Ops",
    shortLabel: "Light",
  },
  dark: {
    label: "Dark Mode - Survival Terminal",
    shortLabel: "Dark",
  },
};

export const THEME_GRADIENTS: ThemeGradients = {
  spiderSense: ["#DF1F2D", "#FFD700"],
  tVirus: ["#39FF14", "#00FF41"],
  webShooter: ["#447BBE", "#2B3784"],
  hazard: ["#FFD700", "#FF0040"],
};

export const TYPOGRAPHY: TypographyScale = {
  caption: { fontSize: 12, lineHeight: 16, fontWeight: "500" },
  body: { fontSize: 16, lineHeight: 22, fontWeight: "400" },
  bodyBold: { fontSize: 16, lineHeight: 22, fontWeight: "700" },
  title: { fontSize: 20, lineHeight: 26, fontWeight: "700" },
  heading: { fontSize: 28, lineHeight: 34, fontWeight: "800" },
  heroTitle: { fontSize: 32, lineHeight: 38, fontWeight: "900" },
  terminalHeader: { fontSize: 24, lineHeight: 30, fontWeight: "700" },
  comicSpeech: { fontSize: 16, lineHeight: 22, fontWeight: "500" },
  dataReadout: { fontSize: 14, lineHeight: 20, fontWeight: "500" },
  statusLabel: { fontSize: 12, lineHeight: 16, fontWeight: "700" },
};
