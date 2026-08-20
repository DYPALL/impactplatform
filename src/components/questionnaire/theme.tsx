import { createContext, useContext } from "react";

export type AreaTheme = {
  accent: string; // main colour (headings, bars, buttons)
  soft: string; // light tinted background
  border: string; // tinted border
  row: string; // zebra row background in matrix tables
};

export const AREA_THEMES: Record<string, AreaTheme> = {
  representativeness: { accent: "#502181", soft: "#F7F4FC", border: "#E3DBF0", row: "#F3EDF9" },
  governance: { accent: "#D97A2B", soft: "#FDF4EC", border: "#F6DCC2", row: "#FBEEDF" },
  empowerment: { accent: "#FF66C5", soft: "#FFF0F8", border: "#FFD0EA", row: "#FFE6F4" },
  results: { accent: "#219C9E", soft: "#E8F7F7", border: "#BCE3E3", row: "#D7F0F0" },
};

export const DEFAULT_AREA_THEME = AREA_THEMES["representativeness"]!;

export function themeForArea(areaKey?: string): AreaTheme {
  return (areaKey && AREA_THEMES[areaKey]) || DEFAULT_AREA_THEME;
}

const AreaThemeContext = createContext<AreaTheme>(DEFAULT_AREA_THEME);

export function AreaThemeProvider({ areaKey, children }: { areaKey?: string; children: React.ReactNode }) {
  return <AreaThemeContext.Provider value={themeForArea(areaKey)}>{children}</AreaThemeContext.Provider>;
}

export function useAreaTheme() {
  return useContext(AreaThemeContext);
}
