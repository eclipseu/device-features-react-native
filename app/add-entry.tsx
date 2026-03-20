import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Alert, BackHandler, Pressable, StyleSheet, View } from "react-native";
import { CameraView, type CameraCapturedPicture } from "expo-camera";
import { Image } from "expo-image";
import * as Haptics from "expo-haptics";
import { useFocusEffect, useNavigation, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { useCamera } from "../src/hooks/useCamera";
import { useDevicePermissions } from "../src/hooks/useDevicePermissions";
import { useLocation } from "../src/hooks/useLocation";
import { useStorage } from "../src/hooks/useStorage";
import { useTheme } from "../src/context/ThemeContext";
import {
  Button,
  ErrorMessage,
  LoadingSpinner,
  PermissionDenied,
  ThemedText,
} from "../src/components";
import {
  configureNotificationHandler,
  scheduleSuccessNotification,
} from "../src/utils/notifications";
import type { TravelEntry } from "../src/types/travel";

const hasValidCoordinates = (
  latitude: number | undefined,
  longitude: number | undefined,
): boolean =>
  typeof latitude === "number" &&
  Number.isFinite(latitude) &&
  typeof longitude === "number" &&
  Number.isFinite(longitude);

export default function AddEntryScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const { colors } = useTheme();

  const {
    permissions,
    errors,
    isLoading: isPermissionLoading,
    requestAllPermissions,
  } = useDevicePermissions();
  const {
    cameraRef,
    isCameraReady,
    isCapturing,
    error: cameraError,
    onCameraError,
    onCameraReady,
    takePictureAsync,
    clearError: clearCameraError,
  } = useCamera();
  const {
    address,
    coordinates,
    isLoading: isResolvingAddress,
    error: locationError,
    getCurrentAddress,
    clearError: clearLocationError,
  } = useLocation();
  const {
    addEntry,
    isSaving,
    error: storageError,
    clearError: clearStorageError,
  } = useStorage();

  const [capturedImage, setCapturedImage] =
    useState<CameraCapturedPicture | null>(null);
  const [resolvedAddress, setResolvedAddress] = useState<string>("");
  const [validationError, setValidationError] = useState<string | null>(null);

  const didSaveRef = useRef<boolean>(false);
  const allowDismissRef = useRef<boolean>(false);
  const hasUnsavedChangesRef = useRef<boolean>(false);

  const hasUnsavedChanges = Boolean(capturedImage || resolvedAddress);

  useEffect(() => {
    hasUnsavedChangesRef.current = hasUnsavedChanges;
  }, [hasUnsavedChanges]);

  const resetState = useCallback(() => {
    setCapturedImage(null);
    setResolvedAddress("");
    setValidationError(null);
    clearCameraError();
    clearLocationError();
    clearStorageError();
  }, [clearCameraError, clearLocationError, clearStorageError]);

  useEffect(() => {
    configureNotificationHandler();
  }, []);

  useFocusEffect(
    useCallback(() => {
      didSaveRef.current = false;
      allowDismissRef.current = false;
      resetState();

      const backSubscription = BackHandler.addEventListener(
        "hardwareBackPress",
        () => {
          if (!hasUnsavedChangesRef.current) {
            return false;
          }

          Alert.alert(
            "Discard entry?",
            "You have unsaved changes. Discard this entry?",
            [
              { text: "Keep Editing", style: "cancel" },
              {
                text: "Discard",
                style: "destructive",
                onPress: () => {
                  allowDismissRef.current = true;
                  resetState();
                  router.back();
                },
              },
            ],
          );

          return true;
        },
      );

      return () => {
        backSubscription.remove();
        if (!didSaveRef.current) {
          resetState();
        }
      };
    }, [resetState, router]),
  );

  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", (event: any) => {
      if (!hasUnsavedChanges || allowDismissRef.current || didSaveRef.current) {
        return;
      }

      event.preventDefault();
      Alert.alert(
        "Discard entry?",
        "You have unsaved changes. Discard this entry?",
        [
          { text: "Keep Editing", style: "cancel" },
          {
            text: "Discard",
            style: "destructive",
            onPress: () => {
              allowDismissRef.current = true;
              resetState();
              navigation.dispatch(event.data.action);
            },
          },
        ],
      );
    });

    return unsubscribe;
  }, [hasUnsavedChanges, navigation, resetState]);

  useEffect(() => {
    if (address) {
      setResolvedAddress(address);
    }
  }, [address]);

  const capturePhoto = async () => {
    setValidationError(null);
    clearStorageError();

    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const photo = await takePictureAsync({ base64: true, quality: 0.75 });

    if (!photo) {
      return;
    }

    setCapturedImage(photo);
    setResolvedAddress("");
  };

  const confirmCapture = async () => {
    if (!capturedImage?.uri) {
      setValidationError("Please capture an image before confirming.");
      return;
    }

    setValidationError(null);
    const nextAddress = await getCurrentAddress();

    if (!nextAddress) {
      setValidationError(
        "Could not resolve your location address. Please try again.",
      );
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    setResolvedAddress("");
    setValidationError(null);
    clearLocationError();
  };

  const saveEntry = async () => {
    if (!capturedImage?.uri) {
      setValidationError("Validation failed: image is required before saving.");
      return;
    }

    if (!resolvedAddress.trim()) {
      setValidationError("Validation failed: address must not be empty.");
      return;
    }

    if (!hasValidCoordinates(coordinates?.latitude, coordinates?.longitude)) {
      setValidationError(
        "Validation failed: valid location coordinates are required.",
      );
      return;
    }

    setValidationError(null);

    const now = Date.now();
    const entry: TravelEntry = {
      id: `${now}`,
      imageUri: capturedImage.uri,
      address: resolvedAddress,
      latitude: coordinates!.latitude,
      longitude: coordinates!.longitude,
      timestamp: now,
      createdAt: new Date(now).toISOString(),
    };

    const saved = await addEntry(entry);
    if (!saved) {
      setValidationError("We could not save this entry. Please try again.");
      return;
    }

    await scheduleSuccessNotification(resolvedAddress);

    didSaveRef.current = true;
    allowDismissRef.current = true;
    resetState();
    router.replace("/");
  };

  const cancelAndGoBack = () => {
    if (!hasUnsavedChanges) {
      allowDismissRef.current = true;
      resetState();
      router.back();
      return;
    }

    Alert.alert(
      "Discard entry?",
      "You have unsaved changes. Discard this entry?",
      [
        { text: "Keep Editing", style: "cancel" },
        {
          text: "Discard",
          style: "destructive",
          onPress: () => {
            allowDismissRef.current = true;
            resetState();
            router.back();
          },
        },
      ],
    );
  };

  const activeError = useMemo(
    () => validationError ?? cameraError ?? locationError ?? storageError,
    [cameraError, locationError, storageError, validationError],
  );

  if (isPermissionLoading) {
    return (
      <SafeAreaView
        style={[styles.safeArea, { backgroundColor: colors.background }]}
      >
        <LoadingSpinner
          message="Checking permissions..."
          accessibilityLabel="Checking permissions"
        />
      </SafeAreaView>
    );
  }

  if (!permissions.camera.granted) {
    return (
      <SafeAreaView
        style={[styles.safeArea, { backgroundColor: colors.background }]}
      >
        <View style={styles.screenPadding}>
          <PermissionDenied
            title="Camera Permission Required"
            description={
              errors.camera ??
              "Please enable camera permission to capture travel photos."
            }
          />
          <Button
            label="Grant Permissions"
            onPress={() => {
              void requestAllPermissions();
            }}
            style={styles.actionSpacing}
            accessibilityLabel="Grant camera and location permissions"
          />
          <Button
            label="Cancel"
            variant="secondary"
            onPress={cancelAndGoBack}
            accessibilityLabel="Cancel adding entry"
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
    >
      <View style={styles.screenPadding}>
        <View style={styles.header}>
          <ThemedText variant="title">Add Entry</ThemedText>
          <Button
            label="Cancel"
            onPress={cancelAndGoBack}
            variant="secondary"
            accessibilityLabel="Cancel and go back"
          />
        </View>

        <ErrorMessage message={activeError} />

        {!capturedImage ? (
          <View style={styles.cameraShell}>
            <CameraView
              ref={cameraRef}
              style={styles.cameraView}
              facing="back"
              onCameraReady={onCameraReady}
              onMountError={onCameraError}
              accessibilityLabel="Camera preview"
            />
            <Button
              label={isCapturing ? "Capturing..." : "Capture"}
              onPress={() => {
                void capturePhoto();
              }}
              disabled={!isCameraReady || isCapturing}
              loading={isCapturing}
              accessibilityLabel="Capture image"
              style={styles.captureButton}
            />
          </View>
        ) : (
          <View style={styles.previewShell}>
            <Image
              source={{ uri: capturedImage.uri }}
              contentFit="cover"
              style={styles.previewImage}
              transition={150}
            />

            {isResolvingAddress ? (
              <LoadingSpinner
                message="Resolving address..."
                accessibilityLabel="Resolving address"
              />
            ) : (
              <>
                <ThemedText variant="bodyBold">Address</ThemedText>
                <ThemedText variant="body">
                  {resolvedAddress ||
                    "Address not resolved yet. Confirm capture to fetch location."}
                </ThemedText>
              </>
            )}

            <View style={styles.actionsRow}>
              <Button
                label="Retake"
                variant="secondary"
                onPress={retakePhoto}
                accessibilityLabel="Retake image"
                style={styles.flexButton}
              />
              <Button
                label="Confirm"
                onPress={() => {
                  void confirmCapture();
                }}
                disabled={isResolvingAddress}
                loading={isResolvingAddress}
                accessibilityLabel="Confirm image and fetch address"
                style={styles.flexButton}
              />
            </View>

            <Button
              label="Save Entry"
              onPress={() => {
                void saveEntry();
              }}
              disabled={
                !capturedImage?.uri || !resolvedAddress.trim() || isSaving
              }
              loading={isSaving}
              accessibilityLabel="Save travel entry"
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  screenPadding: {
    flex: 1,
    padding: 16,
    gap: 12,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  actionSpacing: {
    marginTop: 8,
    marginBottom: 8,
  },
  cameraShell: {
    flex: 1,
    gap: 12,
  },
  cameraView: {
    flex: 1,
    borderRadius: 14,
    overflow: "hidden",
  },
  captureButton: {
    marginBottom: 8,
  },
  previewShell: {
    flex: 1,
    gap: 12,
  },
  previewImage: {
    width: "100%",
    aspectRatio: 4 / 3,
    borderRadius: 12,
  },
  actionsRow: {
    flexDirection: "row",
    gap: 10,
  },
  flexButton: {
    flex: 1,
  },
});
