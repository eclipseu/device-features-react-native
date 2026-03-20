import { useCallback, useMemo, useRef, useState } from "react";

import type {
  CameraView,
  CameraCapturedPicture,
  CameraPictureOptions,
} from "expo-camera";

export type UseCameraResult = {
  cameraRef: React.MutableRefObject<CameraView | null>;
  isCameraReady: boolean;
  isCapturing: boolean;
  lastCapturedImage: CameraCapturedPicture | null;
  error: string | null;
  onCameraReady: () => void;
  onCameraError: (error: unknown) => void;
  takePictureAsync: (
    options?: CameraPictureOptions,
  ) => Promise<CameraCapturedPicture | null>;
  clearError: () => void;
};

const hasValidCapture = (
  capture: CameraCapturedPicture | null,
): capture is CameraCapturedPicture => {
  if (!capture) {
    return false;
  }

  if (typeof capture.uri !== "string" || capture.uri.trim().length === 0) {
    return false;
  }

  if (typeof capture.width !== "number" || capture.width <= 0) {
    return false;
  }

  if (typeof capture.height !== "number" || capture.height <= 0) {
    return false;
  }

  return true;
};

export const useCamera = (): UseCameraResult => {
  const cameraRef = useRef<CameraView | null>(null);
  const [isCameraReady, setIsCameraReady] = useState<boolean>(false);
  const [isCapturing, setIsCapturing] = useState<boolean>(false);
  const [lastCapturedImage, setLastCapturedImage] =
    useState<CameraCapturedPicture | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onCameraReady = useCallback(() => {
    setIsCameraReady(true);
    setError(null);
  }, []);

  const onCameraError = useCallback((mountError: unknown) => {
    console.error("Camera error.", mountError);
    setIsCameraReady(false);
    setError("Camera failed to initialize. Please try again.");
  }, []);

  const takePictureAsync = useCallback(
    async (
      options?: CameraPictureOptions,
    ): Promise<CameraCapturedPicture | null> => {
      if (!cameraRef.current) {
        setError("Camera is not available.");
        return null;
      }

      if (!isCameraReady) {
        setError("Camera is not ready yet.");
        return null;
      }

      setIsCapturing(true);
      setError(null);

      try {
        const photo = await cameraRef.current.takePictureAsync({
          base64: true,
          ...(options ?? {}),
        });

        if (!hasValidCapture(photo)) {
          setError("Could not capture a valid image. Please try again.");
          return null;
        }

        setLastCapturedImage(photo);
        return photo;
      } catch (captureError) {
        console.error("takePictureAsync failed.", captureError);
        setError("An error occurred while taking the picture.");
        return null;
      } finally {
        setIsCapturing(false);
      }
    },
    [isCameraReady],
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return useMemo(
    () => ({
      cameraRef,
      isCameraReady,
      isCapturing,
      lastCapturedImage,
      error,
      onCameraReady,
      onCameraError,
      takePictureAsync,
      clearError,
    }),
    [
      clearError,
      error,
      isCameraReady,
      isCapturing,
      lastCapturedImage,
      onCameraError,
      onCameraReady,
      takePictureAsync,
    ],
  );
};
