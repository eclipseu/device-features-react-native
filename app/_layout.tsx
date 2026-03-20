import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

import { ThemeProvider, useTheme } from "../src/context/ThemeContext";

const LayoutContent = () => {
  const { theme } = useTheme();

  return (
    <>
      <StatusBar style={theme === "dark" ? "light" : "dark"} />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right",
        }}
      />
    </>
  );
};

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <LayoutContent />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
