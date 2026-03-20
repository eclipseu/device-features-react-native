import { useCallback, useMemo, useState } from "react";

import * as Location from "expo-location";

export type Coordinates = {
  latitude: number;
  longitude: number;
};

type UseLocationResult = {
  address: string | null;
  coordinates: Coordinates | null;
  isLoading: boolean;
  error: string | null;
  getCurrentAddress: () => Promise<string | null>;
  clearError: () => void;
};

const DEFAULT_TIMEOUT_MS = 15000;
const DEFAULT_ACCURACY = Location.Accuracy.Balanced;

const withTimeout = async <T>(
  promise: Promise<T>,
  timeoutMs: number,
  errorMessage: string,
): Promise<T> => {
  let timer: ReturnType<typeof setTimeout> | null = null;

  try {
    return await Promise.race([
      promise,
      new Promise<T>((_, reject) => {
        timer = setTimeout(() => reject(new Error(errorMessage)), timeoutMs);
      }),
    ]);
  } finally {
    if (timer) {
      clearTimeout(timer);
    }
  }
};

const isValidCoordinates = (
  coords: Coordinates | null,
): coords is Coordinates => {
  if (!coords) {
    return false;
  }

  const { latitude, longitude } = coords;
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return false;
  }

  if (latitude < -90 || latitude > 90) {
    return false;
  }

  if (longitude < -180 || longitude > 180) {
    return false;
  }

  return true;
};

const formatAddress = (address: Location.LocationGeocodedAddress): string => {
  const parts = [
    address.name,
    address.street,
    address.district,
    address.city,
    address.region,
    address.postalCode,
    address.country,
  ].filter((part): part is string => Boolean(part && part.trim().length > 0));

  return parts.join(", ");
};

export const useLocation = (): UseLocationResult => {
  const [address, setAddress] = useState<string | null>(null);
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const getCurrentAddress = useCallback(async (): Promise<string | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const isServiceEnabled = await Location.hasServicesEnabledAsync();
      if (!isServiceEnabled) {
        const serviceError =
          "Location services are disabled. Please enable GPS/location services.";
        setError(serviceError);
        return null;
      }

      const permission = await Location.getForegroundPermissionsAsync();
      const effectivePermission = permission.granted
        ? permission
        : await Location.requestForegroundPermissionsAsync();

      if (!effectivePermission.granted) {
        const permissionError =
          "Location permission was denied. Please allow location access.";
        setError(permissionError);
        return null;
      }

      const position = await withTimeout(
        Location.getCurrentPositionAsync({
          accuracy: DEFAULT_ACCURACY,
          mayShowUserSettingsDialog: true,
        }),
        DEFAULT_TIMEOUT_MS,
        "Location request timed out. Please try again.",
      );

      const nextCoords: Coordinates = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };

      if (!isValidCoordinates(nextCoords)) {
        const coordsError = "Received invalid coordinates from the device.";
        setError(coordsError);
        return null;
      }

      const geocoded = await Location.reverseGeocodeAsync(nextCoords);
      const primaryAddress = geocoded[0];

      if (!primaryAddress) {
        const geocodeError =
          "Could not resolve an address for your current location.";
        setError(geocodeError);
        return null;
      }

      const formattedAddress = formatAddress(primaryAddress);
      if (!formattedAddress) {
        const formatError = "Address was found but could not be formatted.";
        setError(formatError);
        return null;
      }

      setCoordinates(nextCoords);
      setAddress(formattedAddress);
      return formattedAddress;
    } catch (locationError) {
      console.error("Failed to resolve current address.", locationError);
      setError("Unable to fetch current location. Please try again.");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return useMemo(
    () => ({
      address,
      coordinates,
      isLoading,
      error,
      getCurrentAddress,
      clearError,
    }),
    [address, clearError, coordinates, error, getCurrentAddress, isLoading],
  );
};
