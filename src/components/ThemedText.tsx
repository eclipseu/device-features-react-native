import {
  Text,
  type StyleProp,
  type TextProps,
  type TextStyle,
} from "react-native";

import { useTheme } from "../context/ThemeContext";

type TextVariant = "caption" | "body" | "bodyBold" | "title" | "heading";
type ExtendedTextVariant =
  | TextVariant
  | "heroTitle"
  | "terminalHeader"
  | "comicSpeech"
  | "dataReadout"
  | "statusLabel";

type ThemedTextProps = TextProps & {
  variant?: ExtendedTextVariant;
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

  const variantEffects: Record<ExtendedTextVariant, TextStyle> = {
    caption: {},
    body: {
      fontFamily: "monospace",
    },
    bodyBold: {
      fontFamily: "monospace",
    },
    title: {
      letterSpacing: 1,
      textTransform: "uppercase",
    },
    heading: {
      letterSpacing: 1.5,
      textTransform: "uppercase",
    },
    heroTitle: {
      textTransform: "uppercase",
      letterSpacing: 2,
      textShadowColor: "#B11313",
      textShadowOffset: { width: 2, height: 2 },
      textShadowRadius: 0,
    },
    terminalHeader: {
      fontFamily: "monospace",
      letterSpacing: 1,
      textShadowColor: "#00FF41",
      textShadowOffset: { width: 0, height: 0 },
      textShadowRadius: 6,
    },
    comicSpeech: {
      fontStyle: "italic",
      backgroundColor: "#FFD70033",
      paddingHorizontal: 4,
    },
    dataReadout: {
      fontFamily: "monospace",
      color: "#00FF41",
    },
    statusLabel: {
      textTransform: "uppercase",
      letterSpacing: 4,
      fontFamily: "monospace",
    },
  };

  return (
    <Text
      accessibilityLabel={accessibilityLabel}
      style={[
        {
          color: color ?? colors.text,
          fontSize: typography[variant].fontSize,
          lineHeight: typography[variant].lineHeight,
          fontWeight: typography[variant].fontWeight,
          textShadowColor: "#000000",
          textShadowOffset: { width: 2, height: 2 },
          textShadowRadius: 0,
        },
        variantEffects[variant],
        style,
      ]}
      {...rest}
    >
      {children}
    </Text>
  );
};
