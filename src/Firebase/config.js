import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCYooi3D2aKIZmu9WiSareW1jDhx9A80MA",
  authDomain: "login-authentication-81edf.firebaseapp.com",
  projectId: "login-authentication-81edf",
  storageBucket: "login-authentication-81edf.firebasestorage.app",
  messagingSenderId: "1016924026697",
  appId: "1:1016924026697:web:3fb10880d134b55d9ccc98",
  measurementId: "G-68BZ78EYGR"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider()