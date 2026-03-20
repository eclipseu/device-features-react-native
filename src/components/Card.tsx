import {
  View,
  type StyleProp,
  type ViewProps,
  type ViewStyle,
} from "react-native";

import { useTheme } from "../context/ThemeContext";

type CardProps = ViewProps & {
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
};

export const Card = ({
  children,
  style,
  accessibilityLabel,
  ...rest
}: CardProps) => {
  const { colors } = useTheme();

  return (
    <View
      accessibilityLabel={accessibilityLabel}
      style={[
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          borderWidth: 3,
          borderRadius: 0,
          padding: 14,
          shadowColor: colors.shadow,
          shadowOpacity: 0.35,
          shadowRadius: 0,
          shadowOffset: { width: 8, height: 8 },
          elevation: 8,
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
};
