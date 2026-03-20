import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";
import { useColorScheme } from "react-native";

import {
  COLOR_PALETTES,
  TYPOGRAPHY,
  type ThemeColors,
  type ThemePreference,
  type TypographyScale,
} from "../constants/theme";
import type { Theme } from "../types/travel";
import { STORAGE_KEYS, safeGet, safeSet } from "../utils/storage";

type ThemeContextValue = {
  theme: Theme;
  preference: ThemePreference;
  isHydrated: boolean;
  colors: ThemeColors;
  typography: TypographyScale;
  toggleTheme: () => Promise<void>;
  setThemePreference: (preference: ThemePreference) => Promise<void>;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const normalizeThemePreference = (value: unknown): ThemePreference => {
  if (value === "dark" || value === "light" || value === "system") {
    return value;
  }

  return "system";
};

export const ThemeProvider = ({ children }: PropsWithChildren) => {
  const systemScheme = useColorScheme();
  const [preference, setPreference] = useState<ThemePreference>("system");
  const [isHydrated, setIsHydrated] = useState<boolean>(false);

  const systemTheme: Theme = systemScheme === "dark" ? "dark" : "light";
  const theme: Theme = preference === "system" ? systemTheme : preference;

  useEffect(() => {
    let mounted = true;

    const loadThemePreference = async () => {
      const storedPreference = await safeGet<ThemePreference>(
        STORAGE_KEYS.theme,
      );
      if (!mounted) {
        return;
      }

      setPreference(normalizeThemePreference(storedPreference));
      setIsHydrated(true);
    };

    void loadThemePreference();

    return () => {
      mounted = false;
    };
  }, []);

  const setThemePreference = useCallback(
    async (nextPreference: ThemePreference) => {
      setPreference(nextPreference);
      await safeSet<ThemePreference>(STORAGE_KEYS.theme, nextPreference);
    },
    [],
  );

  const toggleTheme = useCallback(async () => {
    const resolvedTheme: Theme =
      preference === "system" ? systemTheme : preference;
    const nextTheme: Theme = resolvedTheme === "dark" ? "light" : "dark";
    await setThemePreference(nextTheme);
  }, [preference, setThemePreference, systemTheme]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      preference,
      isHydrated,
      colors: COLOR_PALETTES[theme],
      typography: TYPOGRAPHY,
      toggleTheme,
      setThemePreference,
    }),
    [isHydrated, preference, setThemePreference, theme, toggleTheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider.");
  }

  return context;
};
