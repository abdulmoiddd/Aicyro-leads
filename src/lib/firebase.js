import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase, ref, get } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBFBPiyFTCFaSjXJNI8X8m5egnBd1IGNGc",
  authDomain: "aichatbot-a6217.firebaseapp.com",
  databaseURL: "https://aichatbot-a6217-default-rtdb.firebaseio.com",
  projectId: "aichatbot-a6217",
  storageBucket: "aichatbot-a6217.firebasestorage.app",
  messagingSenderId: "810702112832",
  appId: "1:810702112832:web:a94cca4b5bc26b5d8777a5",
  measurementId: "G-ZBFR3QKF20",
};

export const app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const db = getDatabase(app);
