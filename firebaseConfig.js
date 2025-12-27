import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { initializeFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC8s_BGB6mGXIGpCv5KIl4bsHZZKNzvbdg",
  authDomain: "back2me-392a5.firebaseapp.com",
  projectId: "back2me-392a5",
  storageBucket: "back2me-392a5.firebasestorage.app",
  messagingSenderId: "940218571310",
  appId: "1:940218571310:web:5680960a61dd5555225dbf",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
});