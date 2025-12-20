// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC8s_BGB6mGXIGpCv5KIl4bsHZZKNzvbdg",
  authDomain: "back2me-392a5.firebaseapp.com",
  projectId: "back2me-392a5",
  storageBucket: "back2me-392a5.firebasestorage.app",
  messagingSenderId: "940218571310",
  appId: "1:940218571310:web:5680960a61dd5555225dbf"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
