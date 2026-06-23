import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { Platform } from "react-native";
import { api } from "./api";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function registerForPushNotificationsAsync(): Promise<string | null> {
  if (Platform.OS === "web") {
    console.log("Push notification não funciona no web.");
    return null;
  }

  if (!Device.isDevice) {
    console.log("Push notification precisa de dispositivo físico.");
    return null;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();

  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    console.log("Permissão de push notification negada.");
    return null;
  }

  const projectId =
    Constants.expoConfig?.extra?.eas?.projectId ??
    Constants.easConfig?.projectId;

  if (!projectId) {
    console.log("EAS projectId não encontrado.");
    return null;
  }

  const token = await Notifications.getExpoPushTokenAsync({
    projectId,
  });

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#22C55E",
    });
  }

  return token.data;
}

export async function syncPushTokenWithApi() {
  const expoPushToken = await registerForPushNotificationsAsync();

  if (!expoPushToken) {
    return;
  }

  await api.post("/push-tokens", {
    token: expoPushToken,
    platform: Platform.OS,
  });

  console.log("Expo push token sincronizado:", expoPushToken);
}