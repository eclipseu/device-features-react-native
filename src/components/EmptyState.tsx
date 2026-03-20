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
  title = "No Entries yet",
  description = "Start by creating your first travel memory.",
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
          borderRadius: 14,
          borderColor: colors.border,
          borderWidth: 1,
          backgroundColor: colors.surface,
        },
        style,
      ]}
    >
      <ThemedText
        variant="title"
        style={{ textAlign: "center", marginBottom: 8 }}
      >
        {title}
      </ThemedText>
      <ThemedText variant="body" style={{ textAlign: "center" }}>
        {description}
      </ThemedText>
    </View>
  );
};
