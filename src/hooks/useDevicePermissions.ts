import { useCallback, useEffect, useMemo, useState } from "react";

import * as Notifications from "expo-notifications";
import { Camera } from "expo-camera";
import * as Location from "expo-location";

type PermissionStatusValue = "granted" | "denied" | "undetermined";

type PermissionState = {
  status: PermissionStatusValue;
  granted: boolean;
  canAskAgain: boolean;
};

type DevicePermissionState = {
  camera: PermissionState;
  location: PermissionState;
  notifications: PermissionState;
};

type DevicePermissionErrors = {
  camera: string | null;
  location: string | null;
  notifications: string | null;
};

type UseDevicePermissionsResult = {
  permissions: DevicePermissionState;
  errors: DevicePermissionErrors;
  isLoading: boolean;
  requestAllPermissions: () => Promise<DevicePermissionState>;
  refetchPermissions: () => Promise<DevicePermissionState>;
};

const defaultPermissionState: PermissionState = {
  status: "undetermined",
  granted: false,
  canAskAgain: true,
};

const defaultPermissions: DevicePermissionState = {
  camera: defaultPermissionState,
  location: defaultPermissionState,
  notifications: defaultPermissionState,
};

const defaultErrors: DevicePermissionErrors = {
  camera: null,
  location: null,
  notifications: null,
};

const toPermissionState = (input: {
  status: PermissionStatusValue;
  granted: boolean;
  canAskAgain: boolean;
}): PermissionState => ({
  status: input.status,
  granted: input.granted,
  canAskAgain: input.canAskAgain,
});

const denialMessage = (feature: string): string =>
  `Permission denied for ${feature}. You can enable it later in system settings.`;

export const useDevicePermissions = (): UseDevicePermissionsResult => {
  const [permissions, setPermissions] =
    useState<DevicePermissionState>(defaultPermissions);
  const [errors, setErrors] = useState<DevicePermissionErrors>(defaultErrors);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getCameraPermissionState =
    useCallback(async (): Promise<PermissionState> => {
      const response = await Camera.getCameraPermissionsAsync();
      return toPermissionState({
        status: response.status,
        granted: response.granted,
        canAskAgain: response.canAskAgain,
      });
    }, []);

  const getLocationPermissionState =
    useCallback(async (): Promise<PermissionState> => {
      const response = await Location.getForegroundPermissionsAsync();
      return toPermissionState({
        status: response.status,
        granted: response.granted,
        canAskAgain: response.canAskAgain,
      });
    }, []);

  const getNotificationPermissionState =
    useCallback(async (): Promise<PermissionState> => {
      const response = await Notifications.getPermissionsAsync();
      return toPermissionState({
        status: response.status,
        granted: response.granted,
        canAskAgain: response.canAskAgain,
      });
    }, []);

  const refetchPermissions =
    useCallback(async (): Promise<DevicePermissionState> => {
      setIsLoading(true);

      try {
        const [camera, location, notifications] = await Promise.all([
          getCameraPermissionState(),
          getLocationPermissionState(),
          getNotificationPermissionState(),
        ]);

        const nextPermissions = { camera, location, notifications };
        const nextErrors: DevicePermissionErrors = {
          camera: camera.granted ? null : denialMessage("camera"),
          location: location.granted ? null : denialMessage("location"),
          notifications: notifications.granted
            ? null
            : denialMessage("notifications"),
        };

        setPermissions(nextPermissions);
        setErrors(nextErrors);
        return nextPermissions;
      } catch (error) {
        console.error("Failed to refresh permissions.", error);
        const genericError =
          "Could not refresh device permissions. Please try again.";
        setErrors({
          camera: genericError,
          location: genericError,
          notifications: genericError,
        });
        return defaultPermissions;
      } finally {
        setIsLoading(false);
      }
    }, [
      getCameraPermissionState,
      getLocationPermissionState,
      getNotificationPermissionState,
    ]);

  const requestAllPermissions =
    useCallback(async (): Promise<DevicePermissionState> => {
      setIsLoading(true);

      try {
        const [cameraResult, locationResult, notificationsResult] =
          await Promise.all([
            Camera.requestCameraPermissionsAsync(),
            Location.requestForegroundPermissionsAsync(),
            Notifications.requestPermissionsAsync(),
          ]);

        const nextPermissions: DevicePermissionState = {
          camera: toPermissionState(cameraResult),
          location: toPermissionState(locationResult),
          notifications: toPermissionState(notificationsResult),
        };

        const nextErrors: DevicePermissionErrors = {
          camera: nextPermissions.camera.granted
            ? null
            : denialMessage("camera"),
          location: nextPermissions.location.granted
            ? null
            : denialMessage("location"),
          notifications: nextPermissions.notifications.granted
            ? null
            : denialMessage("notifications"),
        };

        setPermissions(nextPermissions);
        setErrors(nextErrors);
        return nextPermissions;
      } catch (error) {
        console.error("Failed to request permissions.", error);
        const genericError =
          "Unable to request one or more permissions. Please try again.";
        setErrors({
          camera: genericError,
          location: genericError,
          notifications: genericError,
        });
        return defaultPermissions;
      } finally {
        setIsLoading(false);
      }
    }, []);

  useEffect(() => {
    void refetchPermissions();
  }, [refetchPermissions]);

  return useMemo(
    () => ({
      permissions,
      errors,
      isLoading,
      requestAllPermissions,
      refetchPermissions,
    }),
    [errors, isLoading, permissions, refetchPermissions, requestAllPermissions],
  );
};
