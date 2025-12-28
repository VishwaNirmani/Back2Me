import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { initializeFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyC8s_BGB6mGXIGpCv5KIl4bsHZZKNzvbdg",
  authDomain: "back2me-392a5.firebaseapp.com",
  projectId: "back2me-392a5",
  storageBucket: "back2me-392a5.appspot.com",
  messagingSenderId: "940218571310",
  appId: "1:940218571310:web:5680960a61dd5555225dbf",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
  useFetchStreams: false,
});

// Export Storage for uploads (e.g., profile photos)
export const storage = getStorage(app);