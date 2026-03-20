import {
  ActivityIndicator,
  Pressable,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { useTheme } from "../context/ThemeContext";
import { ThemedText } from "./ThemedText";

type ButtonVariant = "primary" | "secondary";

type ButtonProps = {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  loading?: boolean;
  disabled?: boolean;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
};

export const Button = ({
  label,
  onPress,
  variant = "primary",
  loading = false,
  disabled = false,
  accessibilityLabel,
  style,
}: ButtonProps) => {
  const { colors } = useTheme();
  const isDisabled = disabled || loading;

  const backgroundColor =
    variant === "primary" ? colors.primary : colors.surface;

  const borderColor = variant === "primary" ? colors.primary : colors.border;
  const textColor = variant === "primary" ? "#FFFFFF" : colors.text;

  return (
    <Pressable
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      onPress={onPress}
      style={({ pressed }) => [
        {
          minHeight: 48,
          borderRadius: 12,
          borderWidth: 1,
          borderColor,
          backgroundColor,
          alignItems: "center",
          justifyContent: "center",
          opacity: isDisabled ? 0.6 : pressed ? 0.9 : 1,
          paddingHorizontal: 16,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <ThemedText variant="bodyBold" color={textColor}>
          {label}
        </ThemedText>
      )}
    </Pressable>
  );
};
