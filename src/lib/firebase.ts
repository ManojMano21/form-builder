// src/lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth"; // ✅ ADD THIS

const firebaseConfig = {
  apiKey: "AIzaSyBsBG7_8SGdaNitan18bbd2TLqRz7I-XoE",
  authDomain: "forms-6d833.firebaseapp.com",
  projectId: "forms-6d833",
  storageBucket: "forms-6d833.firebasestorage.app",
  messagingSenderId: "917087490031",
  appId: "1:917087490031:web:8b861f0e50fca4f91f701a",
  measurementId: "G-B67Y9NRKMJ",
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Firestore
export const db = getFirestore(app);

// ✅ Auth
export const auth = getAuth(app);

// 🔥 ADD THIS (IMPORTANT)
export const googleProvider = new GoogleAuthProvider();