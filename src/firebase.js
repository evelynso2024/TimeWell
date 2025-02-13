import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyB5TkViVNrFStAFPE7HWkPm97hN9c7NLy8",
    authDomain: "wheredidtimego-679b4.firebaseapp.com",
    projectId: "wheredidtimego-679b4",
    storageBucket: "wheredidtimego-679b4.firebasestorage.app",
    messagingSenderId: "417767684649",
    appId: "1:417767684649:web:12a5e278b27f3cfd367a38",
    measurementId: "G-LLXVJM9414"
  };

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
