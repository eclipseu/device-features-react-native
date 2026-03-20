import {
  Text,
  type StyleProp,
  type TextProps,
  type TextStyle,
} from "react-native";

import { useTheme } from "../context/ThemeContext";

type TextVariant = "caption" | "body" | "bodyBold" | "title" | "heading";

type ThemedTextProps = TextProps & {
  variant?: TextVariant;
  color?: string;
  accessibilityLabel?: string;
  style?: StyleProp<TextStyle>;
};

export const ThemedText = ({
  children,
  variant = "body",
  color,
  accessibilityLabel,
  style,
  ...rest
}: ThemedTextProps) => {
  const { colors, typography } = useTheme();

  return (
    <Text
      accessibilityLabel={accessibilityLabel}
      style={[
        {
          color: color ?? colors.text,
          fontSize: typography[variant].fontSize,
          lineHeight: typography[variant].lineHeight,
          fontWeight: typography[variant].fontWeight,
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </Text>
  );
};
