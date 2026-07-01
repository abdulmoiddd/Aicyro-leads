import { ref, push, set, get, child } from "firebase/database";
import { db } from "../../lib/firebase"; // Adjust this relative path based on your folder structure

const MAKE_WEBHOOK_URL =
  "https://hook.eu1.make.com/j66z9hn4yupgm8b4y461nscmnybn6piv";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { firebaseId, ...data } = req.body;
      const timestamp = new Date().toISOString();

      // Clean the payload (Firebase throws errors if values are 'undefined')
      const cleanData = Object.fromEntries(
        Object.entries(data).map(([k, v]) => [k, v === undefined ? "" : v]),
      );

      const fullLeadPayload = {
        ...cleanData,
        timestamp,
      };

      let finalRecordId = firebaseId;

      // 1. Deliver to Firebase Realtime Database
      if (finalRecordId) {
        // UPDATE EXISTING ROW
        const existingRef = ref(db, `leads/${finalRecordId}`);
        await set(existingRef, fullLeadPayload);
      } else {
        // CREATE NEW ROW
        const leadsRef = ref(db, "leads");
        const newLeadRef = push(leadsRef);
        await set(newLeadRef, fullLeadPayload);
        finalRecordId = newLeadRef.key;
      }

      // 2. Deliver to Make.com Webhook (Only if fully booked)
      if (data.booking_status === "Meeting Booked") {
        try {
          await fetch(MAKE_WEBHOOK_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...fullLeadPayload,
              record_id: finalRecordId,
            }),
          });
        } catch (webhookError) {
          console.error("Make.com Webhook dispatch failed:", webhookError);
        }
      }

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
