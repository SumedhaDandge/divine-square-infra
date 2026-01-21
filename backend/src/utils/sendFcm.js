// utils/sendFcm.js
import admin from "../config/firebase.js";



export const sendFcmNotification = async ({ token, title, body, data = {} }) => {
  if (!token) return;

  const message = {
    token,
    notification: { title, body },
    data,
  };

  await admin.messaging().send(message);
};
