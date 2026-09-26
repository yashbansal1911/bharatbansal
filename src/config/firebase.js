// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyB2BxD1QmNPi1x-03WM0OYnVXCX0Eqa3Ug",
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "parity-foods.firebaseapp.com",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "parity-foods",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "parity-foods.firebasestorage.app",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "598585749474",
    appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:598585749474:web:509e1c5f478cf3f9d953bb",
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-17VYRMKGV9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
