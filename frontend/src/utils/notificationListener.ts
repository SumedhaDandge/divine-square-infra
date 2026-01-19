import { onMessage } from "firebase/messaging";
import { Messaging } from "firebase/messaging";
import { NavigateFunction } from "react-router-dom";

export const setupNotificationListener = (
  messaging: Messaging,
  navigate: NavigateFunction
): void => {
  onMessage(messaging, (payload) => {
    console.log("🔔 Notification received:", payload);

    const taskId = payload?.data?.taskId;

    if (taskId) {
      navigate(`/tasks/${taskId}`);
    }
  });
};
