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

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getDatabase(app);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Username and password required" });
  }

  try {
    const loginRef = ref(db, "login");
    const snapshot = await get(loginRef);

    if (snapshot.exists()) {
      const users = snapshot.val();

      // Iterate through the "1", "2" keys to find a match
      const isValidUser = Object.values(users).some(
        (user) => user.name === username && user.password === password,
      );

      if (isValidUser) {
        return res.status(200).json({ success: true });
      } else {
        return res.status(401).json({ error: "Invalid credentials" });
      }
    } else {
      return res.status(500).json({ error: "Auth database not found" });
    }
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
