// Import the functions you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"; // 🔥 ADD THIS
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBsBG7_8SGdaNitan18bbd2TLqRz7I-XoE",
  authDomain: "forms-6d833.firebaseapp.com",
  projectId: "forms-6d833",
  storageBucket: "forms-6d833.firebasestorage.app",
  messagingSenderId: "917087490031",
  appId: "1:917087490031:web:8b861f0e50fca4f91f701a",
  measurementId: "G-B67Y9NRKMJ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ FIRESTORE
export const db = getFirestore(app);

// ✅ AUTH (🔥 THIS FIXES YOUR ISSUE)
export const auth = getAuth(app);

// (optional)
getAnalytics(app);