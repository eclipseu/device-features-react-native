import {
  ActivityIndicator,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { useTheme } from "../context/ThemeContext";
import { ThemedText } from "./ThemedText";

type LoadingSpinnerProps = {
  message?: string;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
};

export const LoadingSpinner = ({
  message = "Loading...",
  accessibilityLabel = "Loading content",
  style,
}: LoadingSpinnerProps) => {
  const { colors } = useTheme();

  return (
    <View
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={accessibilityLabel}
      style={[
        { alignItems: "center", justifyContent: "center", paddingVertical: 20 },
        style,
      ]}
    >
      <ActivityIndicator size="large" color={colors.primary} />
      <ThemedText variant="caption" style={{ marginTop: 8 }}>
        {message}
      </ThemedText>
    </View>
  );
};
