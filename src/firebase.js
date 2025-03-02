import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDGTJpBmQtqOg_hRvtbwIZIw6c4qPGzYVc",
  authDomain: "timewell-c0b5f.firebaseapp.com",
  projectId: "timewell-c0b5f",
  storageBucket: "timewell-c0b5f.appspot.com",
  messagingSenderId: "1095371085844",
  appId: "1:1095371085844:web:c0c5c2e2d6e0a5c0c9c9c9",
  measurementId: "G-XXXXXXXXXX"  // Replace with your actual measurement ID if you have one
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;
