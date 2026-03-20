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
    variant === "primary" ? colors.primary : colors.secondary;

  const borderColor = colors.border;
  const textColor = variant === "primary" ? "#F5F5F5" : "#F5F5F5";

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
          borderRadius: 0,
          borderWidth: 3,
          borderColor,
          backgroundColor,
          alignItems: "center",
          justifyContent: "center",
          opacity: isDisabled ? 0.6 : pressed ? 0.9 : 1,
          paddingHorizontal: 16,
          shadowColor: colors.shadow,
          shadowOpacity: 0.25,
          shadowRadius: 0,
          shadowOffset: { width: 4, height: 4 },
          elevation: 5,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <ThemedText variant="statusLabel" color={textColor}>
          {label}
        </ThemedText>
      )}
    </Pressable>
  );
};
