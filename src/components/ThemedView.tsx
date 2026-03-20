import {
  SafeAreaView,
  View,
  type StyleProp,
  type ViewProps,
  type ViewStyle,
} from "react-native";

import { useTheme } from "../context/ThemeContext";

type ThemedViewProps = ViewProps & {
  useSafeArea?: boolean;
  background?: "background" | "surface";
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
};

export const ThemedView = ({
  children,
  useSafeArea = true,
  background = "background",
  style,
  accessibilityLabel,
  ...rest
}: ThemedViewProps) => {
  const { colors } = useTheme();
  const baseStyle: StyleProp<ViewStyle> = [
    { backgroundColor: colors[background], flex: 1 },
    style,
  ];

  if (useSafeArea) {
    return (
      <SafeAreaView
        accessibilityLabel={accessibilityLabel}
        style={baseStyle}
        {...rest}
      >
        {children}
      </SafeAreaView>
    );
  }

  return (
    <View accessibilityLabel={accessibilityLabel} style={baseStyle} {...rest}>
      {children}
    </View>
  );
};
