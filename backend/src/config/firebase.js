// src/config/firebase.js
import admin from "firebase-admin";
import path from "path";
import { fileURLToPath } from "url";
 

// Fix __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 👇 Correct path to JSON file
const serviceAccountPath = path.join(
  __dirname,
  './divinesquarecrm-firebase-adminsdk-fbsvc-ec9a011e1b.json'
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccountPath),
});

export default admin;
