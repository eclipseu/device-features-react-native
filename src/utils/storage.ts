import AsyncStorage from "@react-native-async-storage/async-storage";

import type { TravelEntry, ValidationResult } from "../types/travel";
import { sanitizeTextInput, sanitizeUri } from "./sanitize";

export const STORAGE_KEYS = {
  travelEntries: "travel_entries",
  theme: "theme",
} as const;

const isValidUri = (uri: string): boolean => {
  if (!uri) {
    return false;
  }

  // Supports common URI schemes and platform file paths.
  const uriPattern =
    /^(https?:\/\/|file:\/\/|content:\/\/|asset:\/\/|data:image\/)/i;
  return uriPattern.test(uri);
};

export const validateEntry = (entry: TravelEntry): ValidationResult => {
  const sanitizedAddress = sanitizeTextInput(entry.address);
  const sanitizedImageUri = sanitizeUri(entry.imageUri);

  if (!sanitizedAddress) {
    return { isValid: false, error: "Address cannot be empty." };
  }

  if (!isValidUri(sanitizedImageUri)) {
    return { isValid: false, error: "Image URI is invalid." };
  }

  return { isValid: true, error: null };
};

export const safeGet = async <T>(key: string): Promise<T | null> => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value === null) {
      return null;
    }

    return JSON.parse(value) as T;
  } catch (error) {
    console.error(`Failed to read key ${key} from AsyncStorage.`, error);
    return null;
  }
};

export const safeSet = async <T>(key: string, value: T): Promise<boolean> => {
  try {
    const serialized = JSON.stringify(value);
    await AsyncStorage.setItem(key, serialized);
    return true;
  } catch (error) {
    console.error(`Failed to write key ${key} to AsyncStorage.`, error);
    return false;
  }
};

const sanitizeEntry = (entry: TravelEntry): TravelEntry => ({
  ...entry,
  imageUri: sanitizeUri(entry.imageUri),
  address: sanitizeTextInput(entry.address),
});

export const getAllEntries = async (): Promise<TravelEntry[]> => {
  const entries = await safeGet<TravelEntry[]>(STORAGE_KEYS.travelEntries);
  return Array.isArray(entries) ? entries : [];
};

export const saveEntry = async (
  entry: TravelEntry,
): Promise<ValidationResult> => {
  const sanitizedEntry = sanitizeEntry(entry);
  const validation = validateEntry(sanitizedEntry);

  if (!validation.isValid) {
    return validation;
  }

  const entries = await getAllEntries();
  const nextEntries = [
    ...entries.filter((item) => item.id !== sanitizedEntry.id),
    sanitizedEntry,
  ];
  const success = await safeSet(STORAGE_KEYS.travelEntries, nextEntries);

  return {
    isValid: success,
    error: success ? null : "Unable to save travel entry.",
  };
};

export const removeEntry = async (entryId: string): Promise<boolean> => {
  try {
    const entries = await getAllEntries();
    const nextEntries = entries.filter((entry) => entry.id !== entryId);
    return await safeSet(STORAGE_KEYS.travelEntries, nextEntries);
  } catch (error) {
    console.error("Failed to remove travel entry.", error);
    return false;
  }
};
