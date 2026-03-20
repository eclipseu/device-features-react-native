import { View, type StyleProp, type ViewStyle } from "react-native";

import { useTheme } from "../context/ThemeContext";
import { ThemedText } from "./ThemedText";

type EmptyStateProps = {
  title?: string;
  description?: string;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
};

export const EmptyState = ({
  title = "NO FIELD DATA DETECTED",
  description = "Awaiting reconnaissance input, Agent.",
  accessibilityLabel,
  style,
}: EmptyStateProps) => {
  const { colors } = useTheme();

  return (
    <View
      accessible
      accessibilityLabel={accessibilityLabel ?? title}
      style={[
        {
          alignItems: "center",
          justifyContent: "center",
          paddingVertical: 24,
          paddingHorizontal: 16,
          borderRadius: 0,
          borderColor: colors.border,
          borderWidth: 3,
          backgroundColor: colors.surface,
          shadowColor: colors.shadow,
          shadowOpacity: 0.3,
          shadowRadius: 0,
          shadowOffset: { width: 8, height: 8 },
          elevation: 8,
        },
        style,
      ]}
    >
      <ThemedText
        variant="heroTitle"
        style={{ textAlign: "center", marginBottom: 8 }}
      >
        {title}
      </ThemedText>
      <ThemedText variant="comicSpeech" style={{ textAlign: "center" }}>
        {description}
      </ThemedText>
    </View>
  );
};
