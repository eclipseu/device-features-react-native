export interface TravelEntry {
  id: string;
  imageUri: string;
  address: string;
  latitude: number;
  longitude: number;
  timestamp: number;
  createdAt: string;
}

export type Theme = "light" | "dark";

export type ValidationResult = {
  isValid: boolean;
  error: string | null;
};
