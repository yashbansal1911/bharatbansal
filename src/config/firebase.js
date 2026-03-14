// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyB2BxD1QmNPi1x-03WM0OYnVXCX0Eqa3Ug",
    authDomain: "parity-foods.firebaseapp.com",
    projectId: "parity-foods",
    storageBucket: "parity-foods.firebasestorage.app",
    messagingSenderId: "598585749474",
    appId: "1:598585749474:web:509e1c5f478cf3f9d953bb",
    measurementId: "G-17VYRMKGV9"

};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
