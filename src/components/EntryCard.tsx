import { Alert, StyleSheet, View } from "react-native";
import { Image } from "expo-image";

import type { TravelEntry } from "../types/travel";
import { useTheme } from "../context/ThemeContext";
import { Card } from "./Card";
import { IconButton } from "./IconButton";
import { ThemedText } from "./ThemedText";

type EntryCardProps = {
  entry: TravelEntry;
  onConfirmDelete: (entry: TravelEntry) => void;
};

const getRelativeTime = (timestamp: number): string => {
  const now = Date.now();
  const diffMs = now - timestamp;

  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diffMs < hour) {
    const minutes = Math.max(1, Math.round(diffMs / minute));
    return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  }

  if (diffMs < day) {
    const hours = Math.max(1, Math.round(diffMs / hour));
    return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  }

  const days = Math.max(1, Math.round(diffMs / day));
  return `${days} day${days === 1 ? "" : "s"} ago`;
};

const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleString();
};

export const EntryCard = ({ entry, onConfirmDelete }: EntryCardProps) => {
  const { colors } = useTheme();

  const relativeTime = getRelativeTime(entry.timestamp);
  const formattedDate = formatDate(entry.timestamp);

  const askDeleteConfirmation = () => {
    Alert.alert(
      "Delete Entry",
      "Are you sure you want to delete this travel entry?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => onConfirmDelete(entry),
        },
      ],
    );
  };

  return (
    <Card
      accessibilityLabel={`Travel entry at ${entry.address}`}
      style={styles.card}
    >
      <Image
        source={{ uri: entry.imageUri }}
        style={styles.image}
        contentFit="cover"
        transition={150}
      />

      <View style={styles.row}>
        <View style={styles.textContainer}>
          <ThemedText numberOfLines={1} ellipsizeMode="tail" variant="bodyBold">
            {entry.address}
          </ThemedText>
          <ThemedText variant="caption" color={colors.text} style={styles.meta}>
            {formattedDate}
          </ThemedText>
          <ThemedText variant="caption" color={colors.primary}>
            {relativeTime}
          </ThemedText>
        </View>

        <IconButton
          icon="DEL"
          onPress={askDeleteConfirmation}
          accessibilityLabel={`Delete travel entry at ${entry.address}`}
        />
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
    gap: 12,
  },
  image: {
    width: "100%",
    aspectRatio: 4 / 3,
    borderRadius: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  textContainer: {
    flex: 1,
    gap: 2,
  },
  meta: {
    opacity: 0.85,
  },
});
