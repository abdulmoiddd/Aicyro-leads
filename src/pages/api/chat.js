// // import OpenAI from "openai";

// // export default async function handler(req, res) {
// //   if (req.method !== "POST") {
// //     return res.status(405).json({ reply: "Method not allowed." });
// //   }

// //   try {
// //     const { messages, current_lead_data } = req.body;

// //     if (!messages || !Array.isArray(messages)) {
// //       return res
// //         .status(400)
// //         .json({ reply: "Conversation history is required." });
// //     }

// //     const apiKey = process.env.OPENAI_API_KEY;
// //     if (!apiKey) {
// //       console.error("CRITICAL ERROR: OPENAI_API_KEY is not defined.");
// //       return res.status(500).json({ reply: "Chat service is not configured." });
// //     }

// //     const openai = new OpenAI({ apiKey });

// //     const today = new Date();
// //     const dateString = today.toLocaleDateString("en-US", {
// //       weekday: "long",
// //       year: "numeric",
// //       month: "long",
// //       day: "numeric",
// //     });

// //     const currentHour = today.getHours();
// //     const isAfterHours = currentHour < 9 || currentHour >= 17;

// //     const systemPrompt = {
// //       role: "system",
// //       content: `You are the "AI Front Desk" for Aicyro. You act as a highly professional human assistant.
// // Today's current date is ${dateString}.

// // YOUR CORE GOAL:
// // Operate a strict, funnel-based lead capture system. Do not let the user wander off-topic. Give precise answers and use as few tokens as possible. You must securely collect all mandatory details before allowing the user to proceed.

// // CURRENTLY COLLECTED DATA:
// // ${JSON.stringify(current_lead_data || {})}

// // CONVERSATIONAL RULES (CRITICAL):
// // 1. Review the "CURRENTLY COLLECTED DATA" above. Find the FIRST missing field (it will be empty or null) in this EXACT order:
// //    1) Service/product requested & Urgency level
// //    2) Location
// //    3) Business name and Website URL (if they are a B2B prospect)
// //    4) Name
// //    5) Email
// //    6) Phone Number
// // 2. Your reply MUST ask for the FIRST missing field from the list above. Do NOT ask for multiple things at once.
// // 3. OUT-OF-ORDER DETECTION: If the user provides info out of order (e.g., you asked for a Name, but they gave a Phone Number), you MUST extract the phone number into the JSON, acknowledge it conversationally, but immediately ASK FOR THE NAME AGAIN.
// // 4. PERSISTENCE & REFUSALS: You MUST collect all fields. If the user refuses or evades the question, politely explain it is required to continue and ask the exact same question again. Do not proceed until they provide it.
// // 5. SCHEDULING: DO NOT ask the user for their preferred date or time. Once the mandatory contact fields above are gathered, simply set "ready_to_book" to true and let the UI handle the scheduling.

// // JSON OUTPUT REQUIREMENT:
// // Output strictly as a raw JSON object.
// // {
// //   "reply": "Your precise, brief 1-2 sentence conversational response asking the next required question.",
// //   "extracted_data": {
// //     "name": "string or null",
// //     "phone": "string or null",
// //     "email": "string or null",
// //     "business_name": "string or null",
// //     "website": "string or null",
// //     "service_requested": "string or null",
// //     "location": "string or null"
// //   },
// //   "visitor_intent": "string (e.g., Demo Request, Support, Inquiry)",
// //   "urgency_level": "High | Medium | Low",
// //   "conversation_summary": "A precise 1-sentence summary of the prospect's needs.",
// //   "lead_score": "High | Medium | Low",
// //   "after_hours_flag": ${isAfterHours},
// //   "ready_to_book": boolean
// // }`,
// //     };

// //     const completion = await openai.chat.completions.create({
// //       model: "gpt-4o-mini",
// //       response_format: { type: "json_object" },
// //       messages: [systemPrompt, ...messages],
// //       temperature: 0.1,
// //       max_tokens: 350,
// //     });

// //     const aiResponse = JSON.parse(completion.choices[0].message.content);
// //     return res.status(200).json(aiResponse);
// //   } catch (error) {
// //     console.error("OpenAI API Route Execution Error:", error);
// //     return res.status(500).json({
// //       reply:
// //         "We are experiencing a brief system delay. Please try sending your message again.",
// //     });
// //   }
// // }

// //
// //
// //
// //
// //
// //
// //
// //
// //
// //
// //
// //
// //
// //
// //
// ///
// //
// //
// //
// import OpenAI from "openai";
// import { db } from "../../lib/firebase"; // Adjust path to your firebase config
// import { ref, get } from "firebase/database";

// export default async function handler(req, res) {
//   if (req.method !== "POST") {
//     return res.status(405).json({ reply: "Method not allowed." });
//   }

//   try {
//     const { messages, current_lead_data } = req.body;

//     if (!messages || !Array.isArray(messages)) {
//       return res
//         .status(400)
//         .json({ reply: "Conversation history is required." });
//     }

//     const apiKey = process.env.OPENAI_API_KEY;
//     if (!apiKey) {
//       console.error("CRITICAL ERROR: OPENAI_API_KEY is not defined.");
//       return res.status(500).json({ reply: "Chat service is not configured." });
//     }

//     // --- FETCH CUSTOM SETTINGS FROM FIREBASE ---
//     let botConfig = {
//       botIdentity: "the 'AI Front Desk' for Aicyro",
//       companyContext: "",
//       customRules: "",
//       tone: "Professional",
//       services: [],
//       faqs: [],
//       qualificationQuestions: [],
//     };

//     try {
//       const snapshot = await get(ref(db, "settings/chatbot_config"));
//       if (snapshot.exists()) {
//         botConfig = { ...botConfig, ...snapshot.val() };
//       }
//     } catch (fbError) {
//       console.error(
//         "Failed to fetch custom bot config from Firebase, using defaults.",
//         fbError,
//       );
//     }

//     const openai = new OpenAI({ apiKey });

//     const today = new Date();
//     const dateString = today.toLocaleDateString("en-US", {
//       weekday: "long",
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//     });
//     const currentHour = today.getHours();
//     const isAfterHours = currentHour < 9 || currentHour >= 17;

//     // --- BUILD DYNAMIC SYSTEM PROMPT ---
//     const systemPrompt = {
//       role: "system",
//       content: `You are ${botConfig.botIdentity}. You act as a ${botConfig.tone} assistant.
// Today's current date is ${dateString}.

// COMPANY CONTEXT & KNOWLEDGE:
// ${botConfig.companyContext}
// Services Offered: ${botConfig.services.length ? botConfig.services.join(", ") : "N/A"}
// FAQs: ${botConfig.faqs.length ? JSON.stringify(botConfig.faqs) : "N/A"}
// Qualification Questions to ask: ${botConfig.qualificationQuestions.length ? botConfig.qualificationQuestions.join(", ") : "N/A"}

// YOUR CUSTOM BEHAVIORAL RULES:
// ${botConfig.customRules}

// YOUR CORE GOAL:
// Operate a strict, funnel-based lead capture system. Give precise answers and use as few tokens as possible. You must securely collect all mandatory details before allowing the user to proceed.

// CURRENTLY COLLECTED DATA:
// ${JSON.stringify(current_lead_data || {})}

// CONVERSATIONAL RULES (CRITICAL):
// 1. Review the "CURRENTLY COLLECTED DATA" above. Find the FIRST missing field (it will be empty or null) in this EXACT order:
//    1) Service/product requested & Urgency level
//    2) Location
//    3) Business name and Website URL (if B2B)
//    4) Name
//    5) Email
//    6) Phone Number
// 2. Your reply MUST ask for the FIRST missing field from the list above. Do NOT ask for multiple things at once.
// 3. OUT-OF-ORDER DETECTION: If the user provides info out of order, extract it into the JSON, acknowledge it, but immediately ASK FOR THE MISSING FIELD AGAIN.
// 4. PERSISTENCE & REFUSALS: If the user evades the question, politely explain it is required and ask again.
// 5. SCHEDULING: DO NOT ask the user for their preferred date or time. Once the mandatory contact fields above are gathered, set "ready_to_book" to true.

// JSON OUTPUT REQUIREMENT:
// Output strictly as a raw JSON object.
// {
//   "reply": "Your precise, brief conversational response based on custom rules.",
//   "extracted_data": {
//     "name": "string or null",
//     "phone": "string or null",
//     "email": "string or null",
//     "business_name": "string or null",
//     "website": "string or null",
//     "service_requested": "string or null",
//     "location": "string or null"
//   },
//   "visitor_intent": "string (e.g., Demo Request, Support, Inquiry)",
//   "urgency_level": "High | Medium | Low",
//   "conversation_summary": "A precise 1-sentence summary.",
//   "lead_score": "High | Medium | Low",
//   "after_hours_flag": ${isAfterHours},
//   "ready_to_book": boolean
// }`,
//     };

//     const completion = await openai.chat.completions.create({
//       model: "gpt-4o-mini",
//       response_format: { type: "json_object" },
//       messages: [systemPrompt, ...messages],
//       temperature: 0.1,
//       max_tokens: 350,
//     });

//     const aiResponse = JSON.parse(completion.choices[0].message.content);
//     return res.status(200).json(aiResponse);
//   } catch (error) {
//     console.error("OpenAI API Route Execution Error:", error);
//     return res.status(500).json({
//       reply:
//         "We are experiencing a brief system delay. Please try sending your message again.",
//     });
//   }
// }

//
//
//
//
//
//
//
//
//
//
//
//

import OpenAI from "openai";
import { db } from "../../lib/firebase"; // Adjust path if needed
import { ref, get } from "firebase/database";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ reply: "Method not allowed." });
  }

  try {
    const { messages, current_lead_data } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res
        .status(400)
        .json({ reply: "Conversation history is required." });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error("CRITICAL ERROR: OPENAI_API_KEY is not defined.");
      return res.status(500).json({ reply: "Chat service is not configured." });
    }

    // --- 1. FETCH CUSTOM SETTINGS FROM FIREBASE ---
    let botConfig = {
      botIdentity: "the 'AI Front Desk' for Aicyro",
      companyContext: "",
      customRules: "",
      tone: "Professional",
      services: [],
      faqs: [],
      qualificationQuestions: [],
      leadCaptureFields: ["Service Requested", "Name", "Email", "Phone"], // Dynamic Lead Flow
      escalationRule: "email_admin",
      bookingRule: "require_all",
      unavailableBehavior: "collect_lead",
      basePrompt:
        "Operate a strict, funnel-based lead capture system. Give precise answers and use as few tokens as possible.",
    };

    try {
      const snapshot = await get(ref(db, "settings/chatbot_config"));
      if (snapshot.exists()) {
        botConfig = { ...botConfig, ...snapshot.val() };
      }
    } catch (fbError) {
      console.error(
        "Failed to fetch custom bot config from Firebase, using defaults.",
        fbError,
      );
    }

    const openai = new OpenAI({ apiKey });

    // --- 2. TIME & ROUTING LOGIC ---
    const today = new Date();
    const dateString = today.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const currentHour = today.getHours();
    const isAfterHours = currentHour < 9 || currentHour >= 17;

    // --- 3. DYNAMIC RULE TRANSLATORS ---
    let bookingInstruction = "";
    if (botConfig.bookingRule === "require_all")
      bookingInstruction =
        "DO NOT set 'ready_to_book' to true until Phone and Email are collected.";
    if (botConfig.bookingRule === "require_email")
      bookingInstruction =
        "DO NOT set 'ready_to_book' to true until Email is collected.";
    if (botConfig.bookingRule === "book_direct")
      bookingInstruction =
        "You may set 'ready_to_book' to true immediately if the user asks to book a meeting.";

    let escalationInstruction = "";
    if (botConfig.escalationRule === "email_admin")
      escalationInstruction =
        "If the user asks a question you cannot answer using the FAQs, inform them you will take a message for the team to review.";
    if (botConfig.escalationRule === "provide_phone")
      escalationInstruction =
        "If the user asks a question you cannot answer, politely provide the support phone number.";

    let hoursInstruction = "";
    if (isAfterHours && botConfig.unavailableBehavior === "collect_lead") {
      hoursInstruction =
        "CRITICAL: It is currently AFTER HOURS. You must politely inform the user that the team is currently away, but you can collect their details for a next-day callback.";
    }

    // --- 4. BUILD DYNAMIC SYSTEM PROMPT ---
    const systemPrompt = {
      role: "system",
      content: `You are ${botConfig.botIdentity}. You act as a ${botConfig.tone} assistant.
Today's current date is ${dateString}.

COMPANY CONTEXT & KNOWLEDGE:
${botConfig.companyContext}
Services Offered: ${botConfig.services.length ? botConfig.services.join(", ") : "N/A"}
FAQs: ${botConfig.faqs.length ? JSON.stringify(botConfig.faqs) : "N/A"}
Qualification Questions to ask: ${botConfig.qualificationQuestions.length ? botConfig.qualificationQuestions.join(", ") : "N/A"}

YOUR CUSTOM BEHAVIORAL RULES:
${botConfig.customRules}
${escalationInstruction}
${hoursInstruction}
${bookingInstruction}

YOUR CORE GOAL:
${botConfig.basePrompt}

CURRENTLY COLLECTED DATA:
${JSON.stringify(current_lead_data || {})}

CONVERSATIONAL RULES (CRITICAL):
1. Review the "CURRENTLY COLLECTED DATA". You must collect the following fields in this EXACT order:
   ${botConfig.leadCaptureFields.map((field, i) => `${i + 1}) ${field}`).join("\n   ")}
2. Your reply MUST ask for the FIRST missing field from the list above. Do NOT ask for multiple things at once.
3. OUT-OF-ORDER DETECTION: If the user provides info out of order, extract it into the JSON, acknowledge it, but immediately ASK FOR THE MISSING FIELD AGAIN.
4. PERSISTENCE & REFUSALS: If the user evades the question, politely explain it is required and ask again.
5. SCHEDULING: DO NOT ask the user for their preferred date or time. Once the mandatory contact fields above are gathered, set "ready_to_book" to true.

JSON OUTPUT REQUIREMENT:
Output strictly as a raw JSON object.
{
  "reply": "Your precise, brief conversational response based on custom rules.",
  "extracted_data": {
    "name": "string or null",
    "phone": "string or null",
    "email": "string or null",
    "business_name": "string or null",
    "website": "string or null",
    "service_requested": "string or null",
    "location": "string or null"
  },
  "visitor_intent": "string (e.g., Demo Request, Support, Inquiry)",
  "urgency_level": "High | Medium | Low",
  "conversation_summary": "A precise 1-sentence summary.",
  "lead_score": "High | Medium | Low",
  "after_hours_flag": ${isAfterHours},
  "ready_to_book": boolean
}`,
    };

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [systemPrompt, ...messages],
      temperature: 0.1,
      max_tokens: 350,
    });

    const aiResponse = JSON.parse(completion.choices[0].message.content);
    return res.status(200).json(aiResponse);
  } catch (error) {
    console.error("OpenAI API Route Execution Error:", error);
    return res.status(500).json({
      reply:
        "We are experiencing a brief system delay. Please try sending your message again.",
    });
  }
}
