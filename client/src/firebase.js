// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-real-estate-c44d7.firebaseapp.com",
  projectId: "mern-real-estate-c44d7",
  storageBucket: "mern-real-estate-c44d7.appspot.com",
  messagingSenderId: "801998583179",
  appId: "1:801998583179:web:e5dc4cef027b9ea2b7ab8e",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
