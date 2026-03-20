import { Linking, View, type StyleProp, type ViewStyle } from "react-native";

import { useTheme } from "../context/ThemeContext";
import { Button } from "./Button";
import { ThemedText } from "./ThemedText";

type PermissionDeniedProps = {
  title?: string;
  description?: string;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
};

export const PermissionDenied = ({
  title = "Permission Required",
  description = "Please enable this permission in your device settings to continue.",
  accessibilityLabel,
  style,
}: PermissionDeniedProps) => {
  const { colors } = useTheme();

  const openSettings = async () => {
    try {
      await Linking.openSettings();
    } catch (error) {
      console.error("Unable to open app settings.", error);
    }
  };

  return (
    <View
      accessible
      accessibilityLabel={accessibilityLabel ?? title}
      style={[
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          borderWidth: 1,
          borderRadius: 12,
          padding: 16,
          gap: 12,
        },
        style,
      ]}
    >
      <ThemedText variant="title">{title}</ThemedText>
      <ThemedText variant="body">{description}</ThemedText>
      <Button
        label="Open Settings"
        onPress={() => {
          void openSettings();
        }}
        variant="secondary"
        accessibilityLabel="Open app settings"
      />
    </View>
  );
};
