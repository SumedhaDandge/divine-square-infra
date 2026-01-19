importScripts(
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js",
);

firebase.initializeApp({
  apiKey: "AIzaSyAGfITUi9J_MIuoJYcxviIqRUib-OrC1aA",
  authDomain: "divinesquarecrm.firebaseapp.com",
  projectId: "divinesquarecrm",
  messagingSenderId: "506511388755",
  appId: "1:506511388755:web:c2759fc277404b0c6356a6",
});

firebase.messaging();
