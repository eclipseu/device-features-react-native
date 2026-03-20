import { View, type StyleProp, type ViewStyle } from "react-native";

import { useTheme } from "../context/ThemeContext";
import { ThemedText } from "./ThemedText";

type ErrorMessageProps = {
  message?: string | null;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
};

export const ErrorMessage = ({
  message,
  accessibilityLabel = "Error message",
  style,
}: ErrorMessageProps) => {
  const { colors } = useTheme();

  if (!message) {
    return null;
  }

  return (
    <View
      accessible
      accessibilityRole="alert"
      accessibilityLabel={accessibilityLabel}
      style={[
        {
          backgroundColor: colors.surface,
          borderColor: colors.error,
          borderWidth: 1,
          borderRadius: 10,
          paddingVertical: 10,
          paddingHorizontal: 12,
        },
        style,
      ]}
    >
      <ThemedText variant="body" color={colors.error}>
        {message}
      </ThemedText>
    </View>
  );
};
