import { Pressable, type StyleProp, type ViewStyle } from "react-native";

import { useTheme } from "../context/ThemeContext";
import { ThemedText } from "./ThemedText";

type IconButtonProps = {
  icon?: string;
  onPress: () => void;
  disabled?: boolean;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
};

export const IconButton = ({
  icon = "X",
  onPress,
  disabled = false,
  accessibilityLabel = "Delete",
  style,
}: IconButtonProps) => {
  const { colors } = useTheme();

  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      accessibilityHint="Deletes the selected item"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        {
          width: 36,
          height: 36,
          borderRadius: 18,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: colors.surface,
          borderColor: colors.border,
          borderWidth: 1,
          opacity: disabled ? 0.5 : pressed ? 0.75 : 1,
        },
        style,
      ]}
    >
      <ThemedText variant="bodyBold" color={colors.error}>
        {icon}
      </ThemedText>
    </Pressable>
  );
};
