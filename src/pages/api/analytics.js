import { ref, runTransaction } from "firebase/database";
import { db } from "../../lib/firebase"; // Adjust this relative path as needed

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { event_type } = req.body;

    // Map incoming client events directly to your structural database fields
    let targetField = "";
    if (event_type === "page_view") targetField = "website_visitors";
    if (event_type === "chatbot_opened") targetField = "chatbot_opens";
    if (event_type === "conversation_started")
      targetField = "conversations_started";

    if (!targetField) {
      return res.status(400).json({ error: "Invalid tracking event type" });
    }

    // Reference a dedicated metrics counter block inside your database
    const counterRef = ref(db, `analytics/totals/${targetField}`);

    // Use an atomic transaction to ensure precision under simultaneous traffic spikes
    await runTransaction(counterRef, (currentValue) => {
      return (currentValue || 0) + 1;
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Firebase Analytics Write Error:", error);
    return res.status(500).json({ error: "Internal tracking server error" });
  }
}
