import * as Notifications from "expo-notifications";

let isNotificationHandlerConfigured = false;

export const configureNotificationHandler = () => {
  if (isNotificationHandlerConfigured) {
    return;
  }

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });

  isNotificationHandlerConfigured = true;
};

const ensureNotificationPermission = async (): Promise<boolean> => {
  const existing = await Notifications.getPermissionsAsync();
  if (existing.granted) {
    return true;
  }

  const requested = await Notifications.requestPermissionsAsync();
  return requested.granted;
};

export const scheduleSuccessNotification = async (
  location: string,
): Promise<boolean> => {
  try {
    const hasPermission = await ensureNotificationPermission();
    if (!hasPermission) {
      return false;
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Travel Entry Saved",
        body: location
          ? `Saved for ${location}`
          : "Your travel entry was saved successfully.",
      },
      trigger: null,
    });

    return true;
  } catch (error) {
    console.error("Failed to schedule success notification.", error);
    return false;
  }
};
