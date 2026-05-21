import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase, ref, push, set, get, child } from "firebase/database";

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

// Your Make.com Webhook URL
const MAKE_WEBHOOK_URL =
  "https://hook.eu1.make.com/j66z9hn4yupgm8b4y461nscmnybn6piv";

export default async function handler(req, res) {
  // POST: Chatbot submitting a new lead
  //   if (req.method === "POST") {
  //     try {
  //       const data = req.body;
  //       const timestamp = new Date().toISOString();

  //       // Construct a single payload to keep historical continuity across systems
  //       const fullLeadPayload = {
  //         ...data,
  //         timestamp,
  //       };

  //       // 1. Deliver to Firebase Realtime Database
  //       const leadsRef = ref(db, "leads");
  //       const newLeadRef = push(leadsRef);
  //       await set(newLeadRef, fullLeadPayload);

  //       // 2. Deliver to Make.com Webhook
  //       try {
  //         const webhookResponse = await fetch(MAKE_WEBHOOK_URL, {
  //           method: "POST",
  //           headers: { "Content-Type": "application/json" },
  //           body: JSON.stringify(fullLeadPayload),
  //         });

  //         if (!webhookResponse.ok) {
  //           console.warn(
  //             `Webhook endpoint responded with status: ${webhookResponse.status}`,
  //           );
  //         }
  //       } catch (webhookError) {
  //         // Log webhook error on server but don't crash or reject response
  //         // because the lead is already successfully secured in Firebase
  //         console.error("Make.com Webhook dispatch failed:", webhookError);
  //       }

  //       return res.status(200).json({ success: true, id: newLeadRef.key });
  //     } catch (error) {
  //       console.error("Database Write Error:", error);
  //       return res
  //         .status(500)
  //         .json({ error: "Failed to completely process lead data." });
  //     }
  //   }

  //   if (req.method === "POST") {
  //     try {
  //       const { firebaseId, ...data } = req.body; // Extract the ID
  //       const timestamp = new Date().toISOString();

  //       const fullLeadPayload = {
  //         ...data,
  //         timestamp,
  //       };

  //       let finalRecordId = firebaseId;

  //       // 1. Deliver to Firebase Realtime Database
  //       if (finalRecordId) {
  //         // UPDATE EXISTING: Prevents duplicate rows when they confirm a booking!
  //         const existingRef = ref(db, `leads/${finalRecordId}`);
  //         await set(existingRef, fullLeadPayload);
  //       } else {
  //         // CREATE NEW
  //         const leadsRef = ref(db, "leads");
  //         const newLeadRef = push(leadsRef);
  //         await set(newLeadRef, fullLeadPayload);
  //         finalRecordId = newLeadRef.key;
  //       }

  //       // 2. Deliver to Make.com Webhook
  //       try {
  //         const webhookResponse = await fetch(MAKE_WEBHOOK_URL, {
  //           method: "POST",
  //           headers: { "Content-Type": "application/json" },
  //           body: JSON.stringify({
  //             ...fullLeadPayload,
  //             record_id: finalRecordId,
  //           }),
  //         });

  //         if (!webhookResponse.ok) {
  //           console.warn(
  //             `Webhook endpoint responded with status: ${webhookResponse.status}`,
  //           );
  //         }
  //       } catch (webhookError) {
  //         console.error("Make.com Webhook dispatch failed:", webhookError);
  //       }

  //       // Return the ID back to the frontend
  //       return res.status(200).json({ success: true, id: finalRecordId });
  //     } catch (error) {
  //       console.error("Database Write Error:", error);
  //       return res
  //         .status(500)
  //         .json({ error: "Failed to completely process lead data." });
  //     }
  //   }

  // POST: Chatbot submitting a new lead or updating an existing one
  if (req.method === "POST") {
    try {
      const { firebaseId, ...data } = req.body; // Extract the ID
      const timestamp = new Date().toISOString();

      const fullLeadPayload = {
        ...data,
        timestamp,
      };

      let finalRecordId = firebaseId;

      // 1. ALWAYS Deliver to Firebase Realtime Database
      if (finalRecordId) {
        // UPDATE EXISTING: Prevents duplicate rows when they confirm a booking!
        const existingRef = ref(db, `leads/${finalRecordId}`);
        await set(existingRef, fullLeadPayload);
      } else {
        // CREATE NEW
        const leadsRef = ref(db, "leads");
        const newLeadRef = push(leadsRef);
        await set(newLeadRef, fullLeadPayload);
        finalRecordId = newLeadRef.key;
      }

      // 2. ONLY Deliver to Make.com Webhook if the meeting is fully confirmed
      if (data.requested_action === "Meeting Booked") {
        try {
          const webhookResponse = await fetch(MAKE_WEBHOOK_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...fullLeadPayload,
              record_id: finalRecordId,
            }),
          });

          if (!webhookResponse.ok) {
            console.warn(
              `Webhook endpoint responded with status: ${webhookResponse.status}`,
            );
          }
        } catch (webhookError) {
          console.error("Make.com Webhook dispatch failed:", webhookError);
        }
      }

      // Return the ID back to the frontend
      return res.status(200).json({ success: true, id: finalRecordId });
    } catch (error) {
      console.error("Database Write Error:", error);
      return res
        .status(500)
        .json({ error: "Failed to completely process lead data." });
    }
  }

  // GET: Dashboard pulling leads for the portal view
  if (req.method === "GET") {
    try {
      const dbRef = ref(db);
      const snapshot = await get(child(dbRef, "leads"));

      if (snapshot.exists()) {
        const data = snapshot.val();
        const leadsArray = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));

        leadsArray.sort(
          (a, b) => new Date(b.timestamp) - new Date(a.timestamp),
        );
        return res.status(200).json(leadsArray);
      } else {
        return res.status(200).json([]);
      }
    } catch (error) {
      console.error("Database Read Error:", error);
      return res.status(500).json({ error: "Failed to retrieve logs." });
    }
  }

  return res.status(405).json({ error: "Method not allowed." });
}
