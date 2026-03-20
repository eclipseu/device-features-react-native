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
          borderWidth: 1,
          borderRadius: 14,
          padding: 14,
          shadowColor: colors.shadow,
          shadowOpacity: 0.14,
          shadowRadius: 10,
          shadowOffset: { width: 0, height: 4 },
          elevation: 3,
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
};
