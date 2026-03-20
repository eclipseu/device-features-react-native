import { useCallback, useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  Platform,
  RefreshControl,
  StyleSheet,
  ToastAndroid,
  View,
} from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import type { TravelEntry } from "../src/types/travel";
import { useStorage } from "../src/hooks/useStorage";
import { useTheme } from "../src/context/ThemeContext";
import {
  Button,
  EmptyState,
  EntryCard,
  ErrorMessage,
  LoadingSpinner,
  ThemedText,
} from "../src/components";

const showSuccessToast = (message: string) => {
  if (Platform.OS === "android") {
    ToastAndroid.show(message, ToastAndroid.SHORT);
    return;
  }

  Alert.alert("Success", message);
};

export default function HomeScreen() {
  const router = useRouter();
  const { colors, theme, toggleTheme } = useTheme();
  const { entries, isLoading, error, refreshEntries, deleteEntry, clearError } =
    useStorage();
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const sortedEntries = useMemo(
    () => [...entries].sort((a, b) => b.timestamp - a.timestamp),
    [entries],
  );

  useFocusEffect(
    useCallback(() => {
      void refreshEntries();
    }, [refreshEntries]),
  );

  const onRefresh = async () => {
    setIsRefreshing(true);
    await refreshEntries();
    setIsRefreshing(false);
  };

  const handleDeleteEntry = async (entry: TravelEntry) => {
    clearError();

    const deleted = await deleteEntry(entry.id);
    if (!deleted) {
      return;
    }

    showSuccessToast("Entry deleted successfully.");
  };

  if (isLoading && entries.length === 0) {
    return (
      <SafeAreaView
        style={[styles.safeArea, { backgroundColor: colors.background }]}
      >
        <View style={styles.container}>
          <LoadingSpinner
            message="Loading entries..."
            accessibilityLabel="Loading travel entries"
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerTitleSection}>
            <ThemedText variant="heading">Travel Diary</ThemedText>
            <ThemedText variant="caption">
              Capture moments with location context
            </ThemedText>
          </View>

          <View style={styles.headerActions}>
            <Button
              label="Add Entry"
              onPress={() => {
                router.push("/add-entry");
              }}
              accessibilityLabel="Go to add entry screen"
              style={styles.smallButton}
            />
            <Button
              label={theme === "dark" ? "Light" : "Dark"}
              onPress={() => {
                void toggleTheme();
              }}
              variant="secondary"
              accessibilityLabel="Toggle theme"
              style={styles.smallButton}
            />
          </View>
        </View>

        <ErrorMessage message={error} />

        <FlatList
          data={sortedEntries}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <EntryCard entry={item} onConfirmDelete={handleDeleteEntry} />
          )}
          contentContainerStyle={[
            styles.listContent,
            sortedEntries.length === 0 && styles.emptyListContent,
          ]}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={() => {
                void onRefresh();
              }}
              tintColor={colors.primary}
            />
          }
          ListEmptyComponent={
            <EmptyState
              title="No Entries yet"
              description="Capture your first place to begin your travel timeline."
              accessibilityLabel="No entries yet"
            />
          }
          accessibilityLabel="Travel entries list"
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
    gap: 12,
  },
  headerTitleSection: {
    flex: 1,
    gap: 2,
  },
  headerActions: {
    width: 96,
    gap: 8,
  },
  smallButton: {
    minHeight: 40,
  },
  listContent: {
    paddingBottom: 20,
    gap: 6,
  },
  emptyListContent: {
    flexGrow: 1,
    justifyContent: "center",
  },
});
