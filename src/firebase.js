import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAZ1tPhxNayzE43Rz_8kvTxVF_Zzcgujio",
  authDomain: "eastern-ceiling-484315-i8.firebaseapp.com",
  projectId: "eastern-ceiling-484315-i8",
  storageBucket: "eastern-ceiling-484315-i8.firebasestorage.app",
  messagingSenderId: "57874039611",
  appId: "1:57874039611:web:98e2d996d02091badc6d1e",
  measurementId: "G-9RBR7JKFP2"
};

// Init app
const app = initializeApp(firebaseConfig);

// Auth
export const auth = getAuth(app);

// 🔥 Google Provider (THIS FIXES YOUR ERROR)
export const googleProvider = new GoogleAuthProvider();

// Analytics (optional)
getAnalytics(app);