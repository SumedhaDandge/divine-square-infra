import { getToken } from "firebase/messaging";
import axios from "axios";
import { messaging } from "../config/firebase";
import { Base_Url } from "./constants";

export const registerFcmToken = async (
  jwtToken: string
): Promise<void> => {
  try {
    const permission: NotificationPermission =
      await Notification.requestPermission();

    if (permission !== "granted") {
      console.log("❌ Notification permission denied");
      return;
    }

    const fcmToken: string | null = await getToken(messaging, {
      vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY as string,
    });

    if (!fcmToken) {
      console.log("❌ FCM token not generated");
      return;
    }

    console.log("✅ FCM TOKEN:", fcmToken);

    await axios.post(
      `${Base_Url}users/save-fcm-token`,
      { fcmToken },
      {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      }
    );
  } catch (error) {
    console.error("FCM Error:", error);
  }
};
