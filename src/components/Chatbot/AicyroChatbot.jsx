// "use client";

// import { useState, useEffect, useRef } from "react";

// // ─── Constants ────────────────────────────────────────────────────────────────

// const INDUSTRY_DEMOS = {
//   Plumbing: {
//     service: "Plumbing repair",
//     scenario: "Someone has a leaking pipe.",
//   },
//   HVAC: { service: "AC repair", scenario: "Someone's AC stopped working." },
//   Electrical: {
//     service: "Electrical repair",
//     scenario: "Someone has an electrical fault or safety concern.",
//   },
//   "Pest Control": {
//     service: "Pest inspection",
//     scenario: "Someone needs pest treatment or an inspection.",
//   },
//   Roofing: {
//     service: "Roof inspection",
//     scenario: "Someone has storm damage or a roof leak.",
//   },
//   Restoration: {
//     service: "Water damage restoration",
//     scenario: "Someone has water damage or flooding.",
//   },
//   "Garage Door": {
//     service: "Garage door repair",
//     scenario: "Someone's garage door is stuck or broken.",
//   },
//   "Appliance Repair": {
//     service: "Appliance repair",
//     scenario: "Someone's refrigerator or washer broke down.",
//   },
//   "Wellness / Fitness": {
//     service: "Session booking",
//     scenario: "Someone wants to book a session or consultation.",
//   },
//   "Sauna / Recovery": {
//     service: "Recovery session",
//     scenario: "Someone wants to book a sauna or recovery session.",
//   },
//   "Med Spa / IV Therapy": {
//     service: "Treatment booking",
//     scenario: "Someone wants to book an IV therapy or spa treatment.",
//   },
//   Other: {
//     service: "Service inquiry",
//     scenario: "Someone needs help with your service.",
//   },
// };

// const URGENCY_KEYWORDS = [
//   "urgent",
//   "emergency",
//   "leak",
//   "no ac",
//   "no heat",
//   "pest issue",
//   "water damage",
//   "book now",
//   "appointment",
//   "asap",
//   "immediately",
// ];

// const TIME_SLOTS = [
//   "09:00 AM",
//   "10:00 AM",
//   "11:00 AM",
//   "01:00 PM",
//   "02:00 PM",
//   "03:00 PM",
//   "04:00 PM",
// ];

// function getNextWorkingDays(count) {
//   const dates = [];
//   let d = new Date();
//   while (dates.length < count) {
//     d.setDate(d.getDate() + 1);
//     if (d.getDay() !== 0 && d.getDay() !== 6) {
//       const options = { month: "short", day: "numeric", year: "numeric" };
//       dates.push(d.toLocaleDateString("en-US", options));
//     }
//   }
//   return dates;
// }

// // ─── Step Definitions ─────────────────────────────────────────────────────────

// const STEPS = {
//   WELCOME: "WELCOME",
//   AI_CHAT_MODE: "AI_CHAT_MODE",
//   CHOOSE_PATH: "CHOOSE_PATH",
//   SELECT_DATE: "SELECT_DATE",
//   SELECT_TIME: "SELECT_TIME",
//   CONFIRM_BOOKING: "CONFIRM_BOOKING",
//   FINAL_CTA: "FINAL_CTA",
// };

// // ─── Typewriter Helper Component ──────────────────────────────────────────────

// const TypewriterBubble = ({ msg, onButtonClick, scrollRef, isProcessing }) => {
//   const [displayedText, setDisplayedText] = useState("");
//   const [isTypingText, setIsTypingText] = useState(true);

//   useEffect(() => {
//     let i = 0;
//     setIsTypingText(true);
//     setDisplayedText("");

//     const timer = setInterval(() => {
//       setDisplayedText(msg.text.slice(0, i + 1));
//       i++;
//       scrollRef.current?.scrollIntoView();

//       if (i >= msg.text.length) {
//         clearInterval(timer);
//         setIsTypingText(false);
//         setTimeout(() => {
//           scrollRef.current?.scrollIntoView({ behavior: "smooth" });
//         }, 50);
//       }
//     }, 15);

//     return () => clearInterval(timer);
//   }, [msg.text, scrollRef]);

//   return (
//     <div className="flex flex-col gap-1.5 max-w-[85%] self-start animate-acy-fade">
//       <div className="px-4 py-3 text-[14px] leading-relaxed whitespace-pre-wrap bg-[var(--card-bg)] text-[var(--foreground)] rounded-2xl rounded-bl-sm border border-[var(--border-color)] shadow-sm">
//         {displayedText}
//         {isTypingText && (
//           <span className="inline-block w-1.5 h-3.5 ml-1 bg-[var(--primary)] animate-pulse align-middle" />
//         )}
//       </div>

//       {!isTypingText && msg.buttons?.length > 0 && (
//         <div className="flex flex-col gap-2 mt-1.5 w-full animate-acy-fade">
//           {msg.buttons.map((btn) => {
//             const isCTA =
//               btn.value === "path_book" ||
//               btn.value === "path_demo" ||
//               btn.value === "confirm_yes" ||
//               btn.value.startsWith("date_") ||
//               btn.value.startsWith("time_");
//             return (
//               <button
//                 key={btn.value}
//                 onClick={() => onButtonClick(btn.value, btn.label)}
//                 disabled={isProcessing}
//                 className={`text-[13px] font-semibold px-4 py-2.5 rounded-xl transition-all duration-200 text-center border ${
//                   isProcessing
//                     ? "opacity-50 cursor-not-allowed "
//                     : "hover:scale-[1.02] active:scale-95"
//                 } ${
//                   isCTA
//                     ? "bg-[var(--primary)] border-transparent text-white shadow-[0_0_15px_var(--lead-glow)] hover:shadow-[0_0_20px_var(--lead-glow)]"
//                     : "bg-[var(--background)] border-[var(--border-color)] text-[var(--foreground)] hover:bg-[var(--card-bg)] hover:border-[var(--grid-line)]"
//                 }`}
//               >
//                 {btn.label}
//               </button>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// };

// // ─── Main Component ───────────────────────────────────────────────────────────

// export default function AicyroChatbot() {
//   const [isOpen, setIsOpen] = useState(false);
//   const [hasAutoOpened, setHasAutoOpened] = useState(false);
//   const [showPeek, setShowPeek] = useState(false);
//   const [step, setStep] = useState(STEPS.WELCOME);
//   const [messages, setMessages] = useState([]);
//   const [inputValue, setInputValue] = useState("");
//   const [isTyping, setIsTyping] = useState(false);
//   const [isProcessing, setIsProcessing] = useState(false);

//   const [leadData, setLeadData] = useState({
//     business_type: "",
//     name: "",
//     website: "",
//     phone: "",
//     email: "",
//     intent: "",
//     lead_score: "",
//     selected_date: "",
//     lead_problem: "",
//   });

//   const messagesEndRef = useRef(null);
//   const inputRef = useRef(null);

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages, isTyping]);

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       if (!hasAutoOpened) {
//         setShowPeek(true);
//         setHasAutoOpened(true);
//       }
//     }, 6000);
//     return () => clearTimeout(timer);
//   }, [hasAutoOpened]);

//   // Drop them instantly into the AI Chat funnel when opening
//   // Drop them instantly into the AI Chat funnel when opening
//   useEffect(() => {
//     if (isOpen && messages.length === 0) {
//       setStep(STEPS.AI_CHAT_MODE);
//       addBotMessage(
//         "Hi there! 👋 I'm the front desk intelligence for Aicyro. What brings you to our site today?",
//         [],
//       );
//     }
//   }, [isOpen]);

//   // ─── Helpers ────────────────────────────────────────────────────────────────

//   function addBotMessage(text, buttons = [], delay = 600) {
//     setIsTyping(true);
//     setTimeout(() => {
//       setIsTyping(false);
//       setMessages((prev) => [
//         ...prev,
//         { role: "bot", text, buttons, id: Date.now() + Math.random() },
//       ]);
//     }, delay);
//   }

//   function addUserMessage(text) {
//     setMessages((prev) => [
//       ...prev,
//       { role: "user", text, id: Date.now() + Math.random() },
//     ]);
//   }

//   function openChat() {
//     setShowPeek(false);
//     setIsOpen(true);
//   }

//   function handleCloseChat() {
//     setIsOpen(false);
//     setStep(STEPS.WELCOME);
//     setMessages([]);
//     setInputValue("");
//     setIsTyping(false);
//     setIsProcessing(false);
//     setLeadData({
//       business_type: "",
//       name: "",
//       website: "",
//       phone: "",
//       email: "",
//       intent: "",
//       lead_score: "",
//       selected_date: "",
//       lead_problem: "",
//     });
//   }

//   function triggerConfirmation(finalData) {
//     setStep(STEPS.CONFIRM_BOOKING);
//     const summaryText = `Great! Before I lock this in, please confirm your details:\n\n• Name: ${finalData.name || "N/A"}\n• Email: ${finalData.email || "N/A"}\n• Phone: ${finalData.phone || "N/A"}\n• Website: ${finalData.website || "N/A"}\n• Meeting: ${finalData.display_time}\n\nDoes everything look correct?`;

//     setTimeout(() => {
//       addBotMessage(summaryText, [
//         { label: "Yes, Confirm Booking", value: "confirm_yes" },
//         { label: "No, Edit Details", value: "confirm_no" },
//       ]);
//     }, 800);
//   }

//   // ─── Webhook & AI Email Generator ──────────────────────────────────────────

//   async function generateAndSendWebhook(data, timeText) {
//     let emailSubject = "Your Aicyro Demo is Confirmed!";
//     let emailBody = `Hi ${data.name || "there"},\n\nYour meeting is confirmed for ${timeText}. We look forward to speaking with you!\n\nBest,\nThe Aicyro Team`;

//     try {
//       const response = await fetch("/api/generate-email", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           name: data.name,
//           business_type: data.business_type,
//           time: timeText,
//         }),
//       });

//       if (response.ok) {
//         const generatedEmail = await response.json();
//         emailSubject = generatedEmail.subject;
//         emailBody = generatedEmail.body;
//       }
//     } catch (error) {
//       console.warn("Skipping AI email generation, using fallback.", error);
//     }

//     submitLead({
//       ...data,
//       generated_subject: emailSubject,
//       generated_body: emailBody,
//     });

//     setIsTyping(false);
//     setIsProcessing(false);
//     setMessages((prev) => [
//       ...prev,
//       {
//         role: "bot",
//         text: `Perfect, your slot is confirmed for ${timeText}. We've sent an invite to ${data.email || "your email"}. We'll review your website beforehand.`,
//         buttons: [{ label: "Close Window", value: "close" }],
//         id: Date.now() + Math.random(),
//       },
//     ]);
//   }

//   async function submitLead(data) {
//     const WEBHOOK_URL =
//       "https://hook.eu1.make.com/j66z9hn4yupgm8b4y461nscmnybn6piv";
//     try {
//       const res = await fetch(WEBHOOK_URL, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           source: "Website Chatbot",
//           timestamp: new Date().toISOString(),
//           ...data,
//         }),
//       });
//     } catch (err) {
//       console.error("❌ LEAD SUBMISSION FAILED:", err);
//     }
//   }

//   // ─── Flow Logic ─────────────────────────────────────────────────────────────

//   async function handleButtonClick(value, label) {
//     if (isProcessing) return;

//     addUserMessage(label);

//     switch (step) {
//       case STEPS.CHOOSE_PATH:
//         if (value === "path_book") {
//           setStep(STEPS.SELECT_DATE);
//           const days = getNextWorkingDays(5);
//           const dateButtons = days.map((d) => ({
//             label: d,
//             value: `date_${d}`,
//           }));
//           addBotMessage(
//             "Awesome. Let's get a free demo booked so we can show you exactly how it works on your site. What day works best?",
//             dateButtons,
//             800,
//           );
//         } else if (value === "path_demo") {
//           showMiniDemo(leadData.business_type || "Other");
//         }
//         break;

//       case STEPS.SELECT_DATE:
//         if (value.startsWith("date_")) {
//           const chosenDate = value.replace("date_", "");
//           setLeadData((d) => ({ ...d, selected_date: chosenDate }));
//           setStep(STEPS.SELECT_TIME);
//           addBotMessage(
//             `Checking my calendar for available times on ${chosenDate}...`,
//             [],
//             100,
//           );

//           const fetchAvailability = async () => {
//             setIsProcessing(true);
//             try {
//               const webhookUrl =
//                 "https://hook.eu1.make.com/8rvlpz2gt3vpici55luvglewdffvucy3";
//               const checkRes = await fetch(webhookUrl, {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({ date: chosenDate }),
//               });

//               if (checkRes.ok) {
//                 const data = await checkRes.json();
//                 const busyString = data.busy_string || "";
//                 let busySlots = [];

//                 const timeMatches = busyString.match(/\d{1,2}:\d{2}\s[AP]M/gi);
//                 if (timeMatches) {
//                   busySlots = timeMatches.map((time) => {
//                     let cleanTime = time.trim().toUpperCase();
//                     if (/^\d:[0-5]\d\s[AP]M$/.test(cleanTime))
//                       cleanTime = "0" + cleanTime;
//                     return cleanTime;
//                   });
//                 }

//                 const availableSlots = TIME_SLOTS.filter(
//                   (slot) => !busySlots.includes(slot),
//                 );

//                 if (availableSlots.length === 0) {
//                   setTimeout(() => {
//                     setStep(STEPS.SELECT_DATE);
//                     const days = getNextWorkingDays(5);
//                     const dateButtons = days.map((d) => ({
//                       label: d,
//                       value: `date_${d}`,
//                     }));
//                     addBotMessage(
//                       `Sorry, I'm completely booked on ${chosenDate}. Please select another day.`,
//                       dateButtons,
//                       500,
//                     );
//                   }, 1000);
//                 } else {
//                   const timeButtons = availableSlots.map((t) => ({
//                     label: t,
//                     value: `time_${t}`,
//                   }));
//                   setTimeout(
//                     () =>
//                       addBotMessage(
//                         `Here is what's available on ${chosenDate}. What works best?`,
//                         timeButtons,
//                         500,
//                       ),
//                     1000,
//                   );
//                 }
//               } else {
//                 throw new Error(
//                   `Make.com scenario failed with status: ${checkRes.status}`,
//                 );
//               }
//             } catch (error) {
//               const timeButtons = TIME_SLOTS.map((t) => ({
//                 label: t,
//                 value: `time_${t}`,
//               }));
//               setTimeout(
//                 () =>
//                   addBotMessage(
//                     `What time on ${chosenDate} works best?`,
//                     timeButtons,
//                     500,
//                   ),
//                 1000,
//               );
//             } finally {
//               setIsProcessing(false);
//             }
//           };

//           fetchAvailability();
//         }
//         break;

//       case STEPS.SELECT_TIME:
//         if (value.startsWith("time_")) {
//           const chosenTime = value.replace("time_", "");
//           const exactTimeText = `${leadData.selected_date} at ${chosenTime}`;
//           const parseableString = `${leadData.selected_date} ${chosenTime}`;

//           let isoDateSlot;
//           try {
//             const parsedDate = new Date(parseableString);
//             isoDateSlot = isNaN(parsedDate)
//               ? exactTimeText
//               : parsedDate.toISOString();
//           } catch (e) {
//             isoDateSlot = exactTimeText;
//           }

//           const finalLeadData = {
//             ...leadData,
//             booked_slot: isoDateSlot,
//             display_time: exactTimeText,
//           };

//           setLeadData(finalLeadData);
//           triggerConfirmation(finalLeadData);
//         }
//         break;

//       case STEPS.CONFIRM_BOOKING:
//         if (value === "confirm_yes") {
//           setStep(STEPS.FINAL_CTA);
//           setIsProcessing(true);
//           setIsTyping(true);

//           const finalDataToSubmit = {
//             ...leadData,
//             requested_action: "Meeting Booked",
//           };
//           generateAndSendWebhook(finalDataToSubmit, leadData.display_time);
//         } else if (value === "confirm_no") {
//           setStep(STEPS.AI_CHAT_MODE);
//           addBotMessage(
//             "No problem. Just tell me what needs to be changed (e.g., 'Change my email to xyz@test.com').",
//           );
//         }
//         break;

//       case STEPS.FINAL_CTA:
//         if (value === "close") handleCloseChat();
//         break;

//       default:
//         break;
//     }
//   }

//   function showMiniDemo(businessType) {
//     const demo = INDUSTRY_DEMOS[businessType] || INDUSTRY_DEMOS["Other"];
//     addBotMessage(
//       `Here's how it works! Imagine a visitor comes to your site and says: '${demo.scenario}' Aicyro checks urgency, captures their info instantly, and pushes them to call or book 24/7.`,
//       [],
//       800,
//     );
//     setTimeout(() => {
//       setMessages((prev) => [
//         ...prev,
//         {
//           role: "bot",
//           type: "demo_card",
//           demo,
//           id: Date.now() + Math.random(),
//         },
//       ]);

//       setTimeout(() => {
//         setStep(STEPS.SELECT_DATE);
//         const days = getNextWorkingDays(5);
//         const dateButtons = days.map((d) => ({ label: d, value: `date_${d}` }));
//         addBotMessage(
//           "Pretty cool, right? Let's get a free demo booked so you can see it in action on your own site. What day works best?",
//           dateButtons,
//           1500,
//         );
//       }, 2000);
//     }, 2500);
//   }

//   // ─── Input Handling ──────────────────────────────────────────────────────────

//   async function handleTextInput(e) {
//     e.preventDefault();
//     if (isProcessing) return;
//     if (!inputValue.trim()) return;
//     const val = inputValue.trim();
//     addUserMessage(val);
//     setInputValue("");

//     if (step === STEPS.AI_CHAT_MODE) {
//       setIsTyping(true);
//       setIsProcessing(true);

//       const aiHistory = messages
//         .filter((m) => m.role === "user" || m.role === "bot")
//         .map((m) => ({
//           role: m.role === "bot" ? "assistant" : "user",
//           content: m.text || "User interacted",
//         }));

//       aiHistory.push({ role: "user", content: val });

//       try {
//         const response = await fetch("/api/chat", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ messages: aiHistory }),
//         });

//         if (!response.ok)
//           throw new Error(`API returned status ${response.status}`);

//         const data = await response.json();
//         addBotMessage(data.reply, [], 100);

//         const extracted = data.extracted_data;

//         if (extracted && extracted.ready_to_book) {
//           const mergedData = {
//             ...leadData,
//             name: extracted.name || leadData.name,
//             email: extracted.email || leadData.email,
//             phone: extracted.phone || leadData.phone,
//             website: extracted.website || leadData.website,
//             business_type: extracted.business_type || leadData.business_type,
//             lead_problem:
//               extracted.lead_problem || leadData.lead_problem || "Unknown",
//             intent: data.intent_type,
//             lead_score: data.lead_score,
//             selected_date: extracted.preferred_date || leadData.selected_date,
//           };

//           setLeadData(mergedData);
//           submitLead({
//             ...mergedData,
//             requested_action: "Lead Captured - Unbooked",
//           });

//           if (extracted.preferred_date && extracted.preferred_time) {
//             const exactTimeText = `${extracted.preferred_date} at ${extracted.preferred_time}`;
//             const parseableString = `${extracted.preferred_date} ${extracted.preferred_time}`;

//             let isoDateSlot;
//             try {
//               const parsedDate = new Date(parseableString);
//               isoDateSlot = isNaN(parsedDate)
//                 ? exactTimeText
//                 : parsedDate.toISOString();
//             } catch (e) {
//               isoDateSlot = exactTimeText;
//             }

//             const finalDirectBookingData = {
//               ...mergedData,
//               booked_slot: isoDateSlot,
//               display_time: exactTimeText,
//             };

//             setLeadData(finalDirectBookingData);
//             triggerConfirmation(finalDirectBookingData);
//           } else {
//             setTimeout(() => {
//               setStep(STEPS.CHOOSE_PATH);
//               addBotMessage(
//                 "What would you like to do next?",
//                 [
//                   { label: "📅 Book a Free Demo", value: "path_book" },
//                   { label: "🤖 See how the Chatbot works", value: "path_demo" },
//                 ],
//                 800,
//               );
//             }, 2000);
//           }
//         } else if (extracted) {
//           setLeadData((prev) => ({
//             ...prev,
//             name: extracted.name || prev.name,
//             email: extracted.email || prev.email,
//             phone: extracted.phone || prev.phone,
//             website: extracted.website || prev.website,
//             business_type: extracted.business_type || prev.business_type,
//           }));
//         }
//       } catch (error) {
//         addBotMessage(
//           "Network error trying to reach AI. Please check your console for details.",
//           [],
//           100,
//         );
//       } finally {
//         setIsProcessing(false);
//       }
//       return;
//     }
//   }

//   const showInput = [STEPS.AI_CHAT_MODE].includes(step);

//   return (
//     <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[9999] flex flex-col items-end gap-4 font-sans">
//       {/* Peek Notification */}
//       {showPeek && !isOpen && (
//         <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl p-4 w-64 shadow-2xl animate-acy-spring origin-bottom-right">
//           <p className="text-[13px] text-[var(--foreground)] font-medium mb-3 leading-snug">
//             Want to see how many website leads you might be missing?
//           </p>
//           <div className="flex flex-wrap gap-2">
//             <button
//               className="text-xs font-semibold px-4 py-2 rounded-xl bg-[var(--primary)] text-white transition-transform hover:-translate-y-0.5 active:translate-y-0 shadow-sm"
//               onClick={openChat}
//             >
//               Show me
//             </button>
//             <button
//               className="text-xs font-medium px-4 py-2 rounded-xl text-[var(--foreground-muted)] hover:bg-[var(--grid-line)]/20 transition-colors"
//               onClick={() => setShowPeek(false)}
//             >
//               Not now
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Launcher FAB */}
//       <div className="relative group">
//         <button
//           className={`relative flex items-center justify-center text-white shadow-[0_4px_20px_var(--lead-glow)] transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_8px_30px_var(--lead-glow)] ${
//             isOpen
//               ? "w-14 h-14 rounded-full rotate-90 bg-[var(--card-bg)] border border-[var(--border-color)] text-[var(--foreground)]"
//               : "h-14 px-6 rounded-full rotate-0 bg-[var(--primary)] text-white"
//           }`}
//           onClick={() => (isOpen ? handleCloseChat() : openChat())}
//           aria-label="Open Chat"
//         >
//           {isOpen ? (
//             <svg
//               className="w-6 h-6"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="2"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 d="M6 18L18 6M6 6l12 12"
//               />
//             </svg>
//           ) : (
//             <div className="flex items-center gap-2.5">
//               <svg
//                 className="w-5 h-5"
//                 fill="none"
//                 stroke="currentColor"
//                 strokeWidth="2.5"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
//                 />
//               </svg>
//               <span className="text-[15px] font-bold tracking-tight pr-1">
//                 Need help
//               </span>
//             </div>
//           )}
//           {!isOpen && (
//             <span className="absolute top-0 right-0 flex h-3.5 w-3.5 -mt-0.5 -mr-0.5">
//               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent-blue)] opacity-75"></span>
//               <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[var(--accent-blue)] border-2 border-[var(--background)]"></span>
//             </span>
//           )}
//         </button>
//       </div>

//       {/* Chat Window */}
//       {isOpen && (
//         <div className="absolute bottom-20 right-0 w-[calc(100vw-32px)] sm:w-[380px] h-[65vh] sm:h-[620px] max-h-[85vh] bg-[var(--background)] border border-[var(--border-color)] rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden animate-acy-spring origin-bottom-right">
//           {/* Header */}
//           <div className="px-5 py-4 flex items-center justify-between shrink-0 bg-[var(--card-bg)] border-b border-[var(--border-color)]">
//             <div className="flex items-center gap-3">
//               <div className="relative w-10 h-10 rounded-xl bg-[var(--primary)] flex items-center justify-center text-white font-bold shadow-sm">
//                 AI
//                 <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 border-[2.5px] border-[var(--card-bg)] rounded-full"></div>
//               </div>
//               <div className="flex flex-col">
//                 <h3 className="text-[15px] font-bold text-[var(--foreground)] leading-tight tracking-tight">
//                   Aicyro Front Desk
//                 </h3>
//                 <span className="text-[12px] font-medium text-[var(--foreground-muted)] mt-0.5">
//                   Security & Lead Intel
//                 </span>
//               </div>
//             </div>
//           </div>

//           {/* Chat Area */}
//           <div className="flex-1 overflow-y-auto overscroll-contain acy-scroll px-4 py-5 flex flex-col gap-5 bg-[var(--background)]">
//             {messages.map((msg) => {
//               if (msg.type === "demo_card") {
//                 return (
//                   <div
//                     key={msg.id}
//                     className="relative w-[85%] self-start bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl p-4 shadow-sm animate-acy-fade"
//                   >
//                     <div className="flex items-center gap-2 mb-3 pb-3 border-b border-[var(--border-color)]">
//                       <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
//                         <svg
//                           className="w-3.5 h-3.5 text-green-500"
//                           fill="none"
//                           viewBox="0 0 24 24"
//                           stroke="currentColor"
//                           strokeWidth="2.5"
//                         >
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             d="M5 13l4 4L19 7"
//                           />
//                         </svg>
//                       </div>
//                       <span className="text-xs font-bold text-[var(--foreground)] uppercase tracking-wider">
//                         Intel Captured
//                       </span>
//                     </div>
//                     <div className="space-y-2.5">
//                       {[
//                         ["Intent", msg.demo.service],
//                         ["Name", "Alex M."],
//                         ["Phone", "(555) 019-2834"],
//                       ].map(([k, v]) => (
//                         <div
//                           key={k}
//                           className="flex justify-between items-center text-[13px]"
//                         >
//                           <span className="text-[var(--foreground-muted)]">
//                             {k}
//                           </span>
//                           <span className="font-semibold text-[var(--foreground)]">
//                             {v}
//                           </span>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 );
//               }

//               if (msg.role === "bot") {
//                 return (
//                   <TypewriterBubble
//                     key={msg.id}
//                     msg={msg}
//                     onButtonClick={handleButtonClick}
//                     scrollRef={messagesEndRef}
//                     isProcessing={isProcessing}
//                   />
//                 );
//               }

//               return (
//                 <div
//                   key={msg.id}
//                   className="flex flex-col gap-1.5 max-w-[85%] self-end animate-acy-fade"
//                 >
//                   <div className="px-4 py-3 text-[14px] leading-relaxed whitespace-pre-wrap bg-[var(--primary)] text-white rounded-2xl rounded-br-sm shadow-sm">
//                     {msg.text}
//                   </div>
//                 </div>
//               );
//             })}

//             {isTyping && (
//               <div className="self-start bg-[var(--card-bg)] rounded-2xl rounded-bl-sm px-4 py-3.5 flex items-center gap-1.5 border border-[var(--border-color)] animate-acy-fade">
//                 <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] animate-bounce"></span>
//                 <span
//                   className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] animate-bounce"
//                   style={{ animationDelay: "0.15s" }}
//                 ></span>
//                 <span
//                   className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] animate-bounce"
//                   style={{ animationDelay: "0.3s" }}
//                 ></span>
//               </div>
//             )}
//             <div ref={messagesEndRef} className="h-2 shrink-0" />
//           </div>

//           {/* Input Area */}
//           <div className="p-3 bg-[var(--background)] border-t border-[var(--border-color)] shrink-0">
//             {showInput ? (
//               <form
//                 className="flex items-center gap-2 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-full pl-5 pr-1.5 py-1.5 focus-within:border-[var(--primary)] focus-within:ring-1 focus-within:ring-[var(--primary)] transition-all"
//                 onSubmit={handleTextInput}
//               >
//                 <input
//                   ref={inputRef}
//                   disabled={isProcessing}
//                   className="flex-1 bg-transparent text-[var(--foreground)] text-[14px] outline-none placeholder:text-[var(--foreground-muted)] disabled:opacity-50 py-1.5"
//                   value={inputValue}
//                   onChange={(e) => setInputValue(e.target.value)}
//                   placeholder="Type a message..."
//                   autoFocus
//                 />
//                 <button
//                   type="submit"
//                   disabled={!inputValue.trim() || isProcessing}
//                   className="w-9 h-9 rounded-full flex items-center justify-center bg-[var(--primary)] text-white transition-all disabled:opacity-50 disabled:scale-100 hover:scale-105"
//                 >
//                   <svg
//                     className="w-4 h-4 ml-0.5"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     stroke="currentColor"
//                     strokeWidth="2.5"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       d="M5 12h14M12 5l7 7-7 7"
//                     />
//                   </svg>
//                 </button>
//               </form>
//             ) : (
//               <div className="w-full text-center py-2 flex items-center justify-center gap-1.5">
//                 <svg
//                   className="w-3.5 h-3.5 text-[var(--foreground-muted)]"
//                   fill="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path d="M12 2L2 22h20L12 2zm0 4.5l6.5 13.5h-13L12 6.5z" />
//                 </svg>
//                 <span className="text-[11px] font-bold text-[var(--foreground-muted)] uppercase tracking-widest">
//                   Powered by Aicyro
//                 </span>
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

//
///
//
//
//
//
//
///

"use client";

import { useState, useEffect, useRef } from "react";

// ─── Constants ────────────────────────────────────────────────────────────────

const INDUSTRY_DEMOS = {
  Plumbing: {
    service: "Plumbing repair",
    scenario: "Someone has a leaking pipe.",
  },
  HVAC: { service: "AC repair", scenario: "Someone's AC stopped working." },
  Electrical: {
    service: "Electrical repair",
    scenario: "Someone has an electrical fault or safety concern.",
  },
  "Pest Control": {
    service: "Pest inspection",
    scenario: "Someone needs pest treatment or an inspection.",
  },
  Roofing: {
    service: "Roof inspection",
    scenario: "Someone has storm damage or a roof leak.",
  },
  Restoration: {
    service: "Water damage restoration",
    scenario: "Someone has water damage or flooding.",
  },
  "Garage Door": {
    service: "Garage door repair",
    scenario: "Someone's garage door is stuck or broken.",
  },
  "Appliance Repair": {
    service: "Appliance repair",
    scenario: "Someone's refrigerator or washer broke down.",
  },
  "Wellness / Fitness": {
    service: "Session booking",
    scenario: "Someone wants to book a session or consultation.",
  },
  "Sauna / Recovery": {
    service: "Recovery session",
    scenario: "Someone wants to book a sauna or recovery session.",
  },
  "Med Spa / IV Therapy": {
    service: "Treatment booking",
    scenario: "Someone wants to book an IV therapy or spa treatment.",
  },
  Other: {
    service: "Service inquiry",
    scenario: "Someone needs help with your service.",
  },
};

const TIME_SLOTS = [
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "01:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
];

function getNextWorkingDays(count) {
  const dates = [];
  let d = new Date();
  while (dates.length < count) {
    d.setDate(d.getDate() + 1);
    if (d.getDay() !== 0 && d.getDay() !== 6) {
      const options = { month: "short", day: "numeric", year: "numeric" };
      dates.push(d.toLocaleDateString("en-US", options));
    }
  }
  return dates;
}

// ─── Step Definitions ─────────────────────────────────────────────────────────

const STEPS = {
  WELCOME: "WELCOME",
  AI_CHAT_MODE: "AI_CHAT_MODE",
  CHOOSE_PATH: "CHOOSE_PATH",
  SELECT_DATE: "SELECT_DATE",
  SELECT_TIME: "SELECT_TIME",
  CONFIRM_BOOKING: "CONFIRM_BOOKING",
  FINAL_CTA: "FINAL_CTA",
};

// ─── Typewriter Helper Component ──────────────────────────────────────────────

const TypewriterBubble = ({ msg, onButtonClick, scrollRef, isProcessing }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [isTypingText, setIsTypingText] = useState(true);

  useEffect(() => {
    let i = 0;
    setIsTypingText(true);
    setDisplayedText("");

    const timer = setInterval(() => {
      setDisplayedText(msg.text.slice(0, i + 1));
      i++;
      scrollRef.current?.scrollIntoView();

      if (i >= msg.text.length) {
        clearInterval(timer);
        setIsTypingText(false);
        setTimeout(() => {
          scrollRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 50);
      }
    }, 15);

    return () => clearInterval(timer);
  }, [msg.text, scrollRef]);

  return (
    <div className="flex flex-col gap-1.5 max-w-[85%] self-start animate-acy-fade">
      <div className="px-4 py-3 text-[14px] leading-relaxed whitespace-pre-wrap bg-[var(--card-bg)] text-[var(--foreground)] rounded-2xl rounded-bl-sm border border-[var(--border-color)] shadow-sm">
        {displayedText}
        {isTypingText && (
          <span className="inline-block w-1.5 h-3.5 ml-1 bg-[var(--primary)] animate-pulse align-middle" />
        )}
      </div>

      {!isTypingText && msg.buttons?.length > 0 && (
        <div className="flex flex-col gap-2 mt-1.5 w-full animate-acy-fade">
          {msg.buttons.map((btn) => {
            const isCTA =
              btn.value === "path_book" ||
              btn.value === "path_demo" ||
              btn.value === "confirm_yes" ||
              btn.value.startsWith("date_") ||
              btn.value.startsWith("time_");
            return (
              <button
                key={btn.value}
                onClick={() => onButtonClick(btn.value, btn.label)}
                disabled={isProcessing}
                className={`text-[13px] font-semibold px-4 py-2.5 rounded-xl transition-all duration-200 text-center border ${
                  isProcessing
                    ? "opacity-50 cursor-not-allowed "
                    : "hover:scale-[1.02] active:scale-95"
                } ${
                  isCTA
                    ? "bg-[var(--primary)] border-transparent text-white shadow-[0_0_15px_var(--lead-glow)] hover:shadow-[0_0_20px_var(--lead-glow)]"
                    : "bg-[var(--background)] border-[var(--border-color)] text-[var(--foreground)] hover:bg-[var(--card-bg)] hover:border-[var(--grid-line)]"
                }`}
              >
                {btn.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AicyroChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasAutoOpened, setHasAutoOpened] = useState(false);
  const [showPeek, setShowPeek] = useState(false);
  const [step, setStep] = useState(STEPS.WELCOME);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasCapturedUnbooked, setHasCapturedUnbooked] = useState(false);
  const [firebaseDbId, setFirebaseDbId] = useState(null);

  const [leadData, setLeadData] = useState({
    business_type: "",
    name: "",
    website: "",
    phone: "",
    email: "",
    intent: "",
    lead_score: "",
    selected_date: "",
    lead_problem: "",
  });

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!hasAutoOpened) {
        setShowPeek(true);
        setHasAutoOpened(true);
      }
    }, 6000);
    return () => clearTimeout(timer);
  }, [hasAutoOpened]);

  // Drop them instantly into the AI Chat funnel when opening
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setStep(STEPS.AI_CHAT_MODE);
      addBotMessage(
        "Hi there! 👋 I'm the front desk intelligence for Aicyro. What brings you to our site today?",
        [],
      );
    }
  }, [isOpen]);

  // ─── Helpers ────────────────────────────────────────────────────────────────

  function addBotMessage(text, buttons = [], delay = 600) {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        { role: "bot", text, buttons, id: Date.now() + Math.random() },
      ]);
    }, delay);
  }

  function addUserMessage(text) {
    setMessages((prev) => [
      ...prev,
      { role: "user", text, id: Date.now() + Math.random() },
    ]);
  }

  function openChat() {
    setShowPeek(false);
    setIsOpen(true);
  }

  function handleCloseChat() {
    setIsOpen(false);
    setStep(STEPS.WELCOME);
    setMessages([]);
    setInputValue("");
    setIsTyping(false);
    setIsProcessing(false);
    setHasCapturedUnbooked(false); // NEW
    setFirebaseDbId(null); // NEW
    setLeadData({
      business_type: "",
      name: "",
      website: "",
      phone: "",
      email: "",
      intent: "",
      lead_score: "",
      selected_date: "",
      lead_problem: "",
    });
  }

  function triggerConfirmation(finalData) {
    setStep(STEPS.CONFIRM_BOOKING);
    const summaryText = `Great! Before I lock this in, please confirm your details:\n\n• Name: ${finalData.name || "N/A"}\n• Email: ${finalData.email || "N/A"}\n• Phone: ${finalData.phone || "N/A"}\n• Website: ${finalData.website || "N/A"}\n• Meeting: ${finalData.display_time}\n\nDoes everything look correct?`;

    setTimeout(() => {
      addBotMessage(summaryText, [
        { label: "Yes, Confirm Booking", value: "confirm_yes" },
        { label: "No, Edit Details", value: "confirm_no" },
      ]);
    }, 800);
  }

  // ─── Webhook & Lead DB Submission ──────────────────────────────────────────

  async function generateAndSendWebhook(data, timeText) {
    let emailSubject = "Your Aicyro Demo is Confirmed!";
    let emailBody = `Hi ${data.name || "there"},\n\nYour meeting is confirmed for ${timeText}. We look forward to speaking with you!\n\nBest,\nThe Aicyro Team`;

    try {
      const response = await fetch("/api/generate-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          business_type: data.business_type,
          time: timeText,
        }),
      });

      if (response.ok) {
        const generatedEmail = await response.json();
        emailSubject = generatedEmail.subject;
        emailBody = generatedEmail.body;
      }
    } catch (error) {
      console.warn("Skipping AI email generation, using fallback.", error);
    }

    submitLead({
      ...data,
      generated_subject: emailSubject,
      generated_body: emailBody,
    });

    setIsTyping(false);
    setIsProcessing(false);
    setMessages((prev) => [
      ...prev,
      {
        role: "bot",
        text: `Perfect, your slot is confirmed for ${timeText}. We've sent an invite to ${data.email || "your email"}. We'll review your website beforehand.`,
        buttons: [{ label: "Close Window", value: "close" }],
        id: Date.now() + Math.random(),
      },
    ]);
  }

  // NEW DATABASE INTEGRATION: Pushing directly to Firebase via local API
  async function submitLead(data) {
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "Website Chatbot",
          firebaseId: firebaseDbId, // Attach the ID so the backend updates the existing row
          ...data,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server responded with status code ${res.status}`);
      }

      const responseData = await res.json();

      // If this is a brand new lead, save the ID assigned by Firebase!
      if (responseData.id && !firebaseDbId) {
        setFirebaseDbId(responseData.id);
      }
    } catch (err) {
      console.error("❌ LEAD SUBMISSION FAILED:", err);
    }
  }
  // ─── Flow Logic ─────────────────────────────────────────────────────────────

  async function handleButtonClick(value, label) {
    if (isProcessing) return;

    addUserMessage(label);

    switch (step) {
      case STEPS.CHOOSE_PATH:
        if (value === "path_book") {
          setStep(STEPS.SELECT_DATE);
          const days = getNextWorkingDays(5);
          const dateButtons = days.map((d) => ({
            label: d,
            value: `date_${d}`,
          }));
          addBotMessage(
            "Awesome. Let's get a free demo booked so we can show you exactly how it works on your site. What day works best?",
            dateButtons,
            800,
          );
        } else if (value === "path_demo") {
          showMiniDemo(leadData.business_type || "Other");
        }
        break;

      case STEPS.SELECT_DATE:
        if (value.startsWith("date_")) {
          const chosenDate = value.replace("date_", "");
          setLeadData((d) => ({ ...d, selected_date: chosenDate }));
          setStep(STEPS.SELECT_TIME);
          addBotMessage(
            `Checking my calendar for available times on ${chosenDate}...`,
            [],
            100,
          );

          const fetchAvailability = async () => {
            setIsProcessing(true);
            try {
              const webhookUrl =
                "https://hook.eu1.make.com/8rvlpz2gt3vpici55luvglewdffvucy3";
              const checkRes = await fetch(webhookUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ date: chosenDate }),
              });

              if (checkRes.ok) {
                const data = await checkRes.json();
                const busyString = data.busy_string || "";
                let busySlots = [];

                const timeMatches = busyString.match(/\d{1,2}:\d{2}\s[AP]M/gi);
                if (timeMatches) {
                  busySlots = timeMatches.map((time) => {
                    let cleanTime = time.trim().toUpperCase();
                    if (/^\d:[0-5]\d\s[AP]M$/.test(cleanTime))
                      cleanTime = "0" + cleanTime;
                    return cleanTime;
                  });
                }

                const availableSlots = TIME_SLOTS.filter(
                  (slot) => !busySlots.includes(slot),
                );

                if (availableSlots.length === 0) {
                  setTimeout(() => {
                    setStep(STEPS.SELECT_DATE);
                    const days = getNextWorkingDays(5);
                    const dateButtons = days.map((d) => ({
                      label: d,
                      value: `date_${d}`,
                    }));
                    addBotMessage(
                      `Sorry, I'm completely booked on ${chosenDate}. Please select another day.`,
                      dateButtons,
                      500,
                    );
                  }, 1000);
                } else {
                  const timeButtons = availableSlots.map((t) => ({
                    label: t,
                    value: `time_${t}`,
                  }));
                  setTimeout(
                    () =>
                      addBotMessage(
                        `Here is what's available on ${chosenDate}. What works best?`,
                        timeButtons,
                        500,
                      ),
                    1000,
                  );
                }
              } else {
                throw new Error(
                  `Make.com scenario failed with status: ${checkRes.status}`,
                );
              }
            } catch (error) {
              const timeButtons = TIME_SLOTS.map((t) => ({
                label: t,
                value: `time_${t}`,
              }));
              setTimeout(
                () =>
                  addBotMessage(
                    `What time on ${chosenDate} works best?`,
                    timeButtons,
                    500,
                  ),
                1000,
              );
            } finally {
              setIsProcessing(false);
            }
          };

          fetchAvailability();
        }
        break;

      case STEPS.SELECT_TIME:
        if (value.startsWith("time_")) {
          const chosenTime = value.replace("time_", "");
          const exactTimeText = `${leadData.selected_date} at ${chosenTime}`;
          const parseableString = `${leadData.selected_date} ${chosenTime}`;

          let isoDateSlot;
          try {
            const parsedDate = new Date(parseableString);
            isoDateSlot = isNaN(parsedDate)
              ? exactTimeText
              : parsedDate.toISOString();
          } catch (e) {
            isoDateSlot = exactTimeText;
          }

          const finalLeadData = {
            ...leadData,
            booked_slot: isoDateSlot,
            display_time: exactTimeText,
          };

          setLeadData(finalLeadData);
          triggerConfirmation(finalLeadData);
        }
        break;

      case STEPS.CONFIRM_BOOKING:
        if (value === "confirm_yes") {
          setStep(STEPS.FINAL_CTA);
          setIsProcessing(true);
          setIsTyping(true);

          const finalDataToSubmit = {
            ...leadData,
            requested_action: "Meeting Booked",
          };
          generateAndSendWebhook(finalDataToSubmit, leadData.display_time);
        } else if (value === "confirm_no") {
          setStep(STEPS.AI_CHAT_MODE);
          addBotMessage(
            "No problem. Just tell me what needs to be changed (e.g., 'Change my email to xyz@test.com').",
          );
        }
        break;

      case STEPS.FINAL_CTA:
        if (value === "close") handleCloseChat();
        break;

      default:
        break;
    }
  }

  function showMiniDemo(businessType) {
    const demo = INDUSTRY_DEMOS[businessType] || INDUSTRY_DEMOS["Other"];
    addBotMessage(
      `Here's how it works! Imagine a visitor comes to your site and says: '${demo.scenario}' Aicyro checks urgency, captures their info instantly, and pushes them to call or book 24/7.`,
      [],
      800,
    );
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          type: "demo_card",
          demo,
          id: Date.now() + Math.random(),
        },
      ]);

      setTimeout(() => {
        setStep(STEPS.SELECT_DATE);
        const days = getNextWorkingDays(5);
        const dateButtons = days.map((d) => ({ label: d, value: `date_${d}` }));
        addBotMessage(
          "Pretty cool, right? Let's get a free demo booked so you can see it in action on your own site. What day works best?",
          dateButtons,
          1500,
        );
      }, 2000);
    }, 2500);
  }

  // ─── Input Handling ──────────────────────────────────────────────────────────

  async function handleTextInput(e) {
    e.preventDefault();
    if (isProcessing) return;
    if (!inputValue.trim()) return;
    const val = inputValue.trim();
    addUserMessage(val);
    setInputValue("");

    if (step === STEPS.AI_CHAT_MODE) {
      setIsTyping(true);
      setIsProcessing(true);

      const aiHistory = messages
        .filter((m) => m.role === "user" || m.role === "bot")
        .map((m) => ({
          role: m.role === "bot" ? "assistant" : "user",
          content: m.text || "User interacted",
        }));

      aiHistory.push({ role: "user", content: val });

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: aiHistory }),
        });

        if (!response.ok)
          throw new Error(`API returned status ${response.status}`);

        const data = await response.json();
        addBotMessage(data.reply, [], 100);

        const extracted = data.extracted_data;

        if (extracted && extracted.ready_to_book) {
          const mergedData = {
            ...leadData,
            name: extracted.name || leadData.name,
            email: extracted.email || leadData.email,
            phone: extracted.phone || leadData.phone,
            website: extracted.website || leadData.website,
            business_type: extracted.business_type || leadData.business_type,
            lead_problem:
              extracted.lead_problem || leadData.lead_problem || "Unknown",
            intent: data.intent_type,
            lead_score: data.lead_score,
            selected_date: extracted.preferred_date || leadData.selected_date,
          };

          setLeadData(mergedData);

          if (!hasCapturedUnbooked) {
            submitLead({
              ...mergedData,
              requested_action: "Lead Captured - Unbooked",
            });
            setHasCapturedUnbooked(true);
          }

          if (extracted.preferred_date && extracted.preferred_time) {
            const exactTimeText = `${extracted.preferred_date} at ${extracted.preferred_time}`;
            const parseableString = `${extracted.preferred_date} ${extracted.preferred_time}`;

            let isoDateSlot;
            try {
              const parsedDate = new Date(parseableString);
              isoDateSlot = isNaN(parsedDate)
                ? exactTimeText
                : parsedDate.toISOString();
            } catch (e) {
              isoDateSlot = exactTimeText;
            }

            const finalDirectBookingData = {
              ...mergedData,
              booked_slot: isoDateSlot,
              display_time: exactTimeText,
            };

            setLeadData(finalDirectBookingData);
            triggerConfirmation(finalDirectBookingData);
          } else {
            setTimeout(() => {
              setStep(STEPS.CHOOSE_PATH);
              addBotMessage(
                "What would you like to do next?",
                [
                  { label: "📅 Book a Free Demo", value: "path_book" },
                  { label: "🤖 See how the Chatbot works", value: "path_demo" },
                ],
                800,
              );
            }, 2000);
          }
        } else if (extracted) {
          setLeadData((prev) => ({
            ...prev,
            name: extracted.name || prev.name,
            email: extracted.email || prev.email,
            phone: extracted.phone || prev.phone,
            website: extracted.website || prev.website,
            business_type: extracted.business_type || prev.business_type,
          }));
        }
      } catch (error) {
        addBotMessage(
          "Network error trying to reach AI. Please check your console for details.",
          [],
          100,
        );
      } finally {
        setIsProcessing(false);
      }
      return;
    }
  }

  const showInput = [STEPS.AI_CHAT_MODE].includes(step);

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[9999] flex flex-col items-end gap-4 font-sans">
      {/* Peek Notification */}
      {showPeek && !isOpen && (
        <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl p-4 w-64 shadow-2xl animate-acy-spring origin-bottom-right">
          <p className="text-[13px] text-[var(--foreground)] font-medium mb-3 leading-snug">
            Want to see how many website leads you might be missing?
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              className="text-xs font-semibold px-4 py-2 rounded-xl bg-[var(--primary)] text-white transition-transform hover:-translate-y-0.5 active:translate-y-0 shadow-sm"
              onClick={openChat}
            >
              Show me
            </button>
            <button
              className="text-xs font-medium px-4 py-2 rounded-xl text-[var(--foreground-muted)] hover:bg-[var(--grid-line)]/20 transition-colors"
              onClick={() => setShowPeek(false)}
            >
              Not now
            </button>
          </div>
        </div>
      )}

      {/* Launcher FAB */}
      <div className="relative group">
        <button
          className={`relative flex items-center justify-center text-white shadow-[0_4px_20px_var(--lead-glow)] transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_8px_30px_var(--lead-glow)] ${
            isOpen
              ? "w-14 h-14 rounded-full rotate-90 bg-[var(--card-bg)] border border-[var(--border-color)] text-[var(--foreground)]"
              : "h-14 px-6 rounded-full rotate-0 bg-[var(--primary)] text-white"
          }`}
          onClick={() => (isOpen ? handleCloseChat() : openChat())}
          aria-label="Open Chat"
        >
          {isOpen ? (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <div className="flex items-center gap-2.5">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <span className="text-[15px] font-bold tracking-tight pr-1">
                Need help
              </span>
            </div>
          )}
          {!isOpen && (
            <span className="absolute top-0 right-0 flex h-3.5 w-3.5 -mt-0.5 -mr-0.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent-blue)] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[var(--accent-blue)] border-2 border-[var(--background)]"></span>
            </span>
          )}
        </button>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-[calc(100vw-32px)] sm:w-[380px] h-[65vh] sm:h-[620px] max-h-[85vh] bg-[var(--background)] border border-[var(--border-color)] rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden animate-acy-spring origin-bottom-right">
          {/* Header */}
          <div className="px-5 py-4 flex items-center justify-between shrink-0 bg-[var(--card-bg)] border-b border-[var(--border-color)]">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-xl bg-[var(--primary)] flex items-center justify-center text-white font-bold shadow-sm">
                AI
                <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 border-[2.5px] border-[var(--card-bg)] rounded-full"></div>
              </div>
              <div className="flex flex-col">
                <h3 className="text-[15px] font-bold text-[var(--foreground)] leading-tight tracking-tight">
                  Aicyro Front Desk
                </h3>
                <span className="text-[12px] font-medium text-[var(--foreground-muted)] mt-0.5">
                  Security & Lead Intel
                </span>
              </div>
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 overflow-y-auto overscroll-contain acy-scroll px-4 py-5 flex flex-col gap-5 bg-[var(--background)]">
            {messages.map((msg) => {
              if (msg.type === "demo_card") {
                return (
                  <div
                    key={msg.id}
                    className="relative w-[85%] self-start bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl p-4 shadow-sm animate-acy-fade"
                  >
                    <div className="flex items-center gap-2 mb-3 pb-3 border-b border-[var(--border-color)]">
                      <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                        <svg
                          className="w-3.5 h-3.5 text-green-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="2.5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <span className="text-xs font-bold text-[var(--foreground)] uppercase tracking-wider">
                        Intel Captured
                      </span>
                    </div>
                    <div className="space-y-2.5">
                      {[
                        ["Intent", msg.demo.service],
                        ["Name", "Alex M."],
                        ["Phone", "(555) 019-2834"],
                      ].map(([k, v]) => (
                        <div
                          key={k}
                          className="flex justify-between items-center text-[13px]"
                        >
                          <span className="text-[var(--foreground-muted)]">
                            {k}
                          </span>
                          <span className="font-semibold text-[var(--foreground)]">
                            {v}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }

              if (msg.role === "bot") {
                return (
                  <TypewriterBubble
                    key={msg.id}
                    msg={msg}
                    onButtonClick={handleButtonClick}
                    scrollRef={messagesEndRef}
                    isProcessing={isProcessing}
                  />
                );
              }

              return (
                <div
                  key={msg.id}
                  className="flex flex-col gap-1.5 max-w-[85%] self-end animate-acy-fade"
                >
                  <div className="px-4 py-3 text-[14px] leading-relaxed whitespace-pre-wrap bg-[var(--primary)] text-white rounded-2xl rounded-br-sm shadow-sm">
                    {msg.text}
                  </div>
                </div>
              );
            })}

            {isTyping && (
              <div className="self-start bg-[var(--card-bg)] rounded-2xl rounded-bl-sm px-4 py-3.5 flex items-center gap-1.5 border border-[var(--border-color)] animate-acy-fade">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] animate-bounce"></span>
                <span
                  className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] animate-bounce"
                  style={{ animationDelay: "0.15s" }}
                ></span>
                <span
                  className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] animate-bounce"
                  style={{ animationDelay: "0.3s" }}
                ></span>
              </div>
            )}
            <div ref={messagesEndRef} className="h-2 shrink-0" />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-[var(--background)] border-t border-[var(--border-color)] shrink-0">
            {showInput ? (
              <form
                className="flex items-center gap-2 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-full pl-5 pr-1.5 py-1.5 focus-within:border-[var(--primary)] focus-within:ring-1 focus-within:ring-[var(--primary)] transition-all"
                onSubmit={handleTextInput}
              >
                <input
                  ref={inputRef}
                  disabled={isProcessing}
                  className="flex-1 bg-transparent text-[var(--foreground)] text-[14px] outline-none placeholder:text-[var(--foreground-muted)] disabled:opacity-50 py-1.5"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Type a message..."
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim() || isProcessing}
                  className="w-9 h-9 rounded-full flex items-center justify-center bg-[var(--primary)] text-white transition-all disabled:opacity-50 disabled:scale-100 hover:scale-105"
                >
                  <svg
                    className="w-4 h-4 ml-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 12h14M12 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </form>
            ) : (
              <div className="w-full text-center py-2 flex items-center justify-center gap-1.5">
                <svg
                  className="w-3.5 h-3.5 text-[var(--foreground-muted)]"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2L2 22h20L12 2zm0 4.5l6.5 13.5h-13L12 6.5z" />
                </svg>
                <span className="text-[11px] font-bold text-[var(--foreground-muted)] uppercase tracking-widest">
                  Powered by Aicyro
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
