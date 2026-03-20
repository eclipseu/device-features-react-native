import { useCallback, useEffect, useState } from "react";

import type { TravelEntry } from "../types/travel";
import { getAllEntries, removeEntry, saveEntry } from "../utils/storage";

type UseStorageResult = {
  entries: TravelEntry[];
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  refreshEntries: () => Promise<void>;
  addEntry: (entry: TravelEntry) => Promise<boolean>;
  deleteEntry: (entryId: string) => Promise<boolean>;
  clearError: () => void;
};

export const useStorage = (): UseStorageResult => {
  const [entries, setEntries] = useState<TravelEntry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const refreshEntries = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const allEntries = await getAllEntries();
      setEntries(allEntries);
    } catch (err) {
      console.error("Failed to load travel entries.", err);
      setError("Failed to load travel entries.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addEntry = useCallback(async (entry: TravelEntry): Promise<boolean> => {
    setIsSaving(true);
    setError(null);

    try {
      const result = await saveEntry(entry);
      if (!result.isValid) {
        setError(result.error ?? "Failed to save travel entry.");
        return false;
      }

      const allEntries = await getAllEntries();
      setEntries(allEntries);
      return true;
    } catch (err) {
      console.error("Failed to save travel entry.", err);
      setError("Failed to save travel entry.");
      return false;
    } finally {
      setIsSaving(false);
    }
  }, []);

  const deleteEntry = useCallback(async (entryId: string): Promise<boolean> => {
    setError(null);

    try {
      const removed = await removeEntry(entryId);
      if (!removed) {
        setError("Failed to delete travel entry.");
        return false;
      }

      setEntries((current) => current.filter((entry) => entry.id !== entryId));
      return true;
    } catch (err) {
      console.error("Failed to delete travel entry.", err);
      setError("Failed to delete travel entry.");
      return false;
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  useEffect(() => {
    void refreshEntries();
  }, [refreshEntries]);

  return {
    entries,
    isLoading,
    isSaving,
    error,
    refreshEntries,
    addEntry,
    deleteEntry,
    clearError,
  };
};
