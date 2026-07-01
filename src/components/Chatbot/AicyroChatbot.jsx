"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { triggerNotification } from "../../lib/notificationHelper";
import { db } from "../../lib/firebase";
import { ref, get } from "firebase/database";

// ─── Constants & Mappings ─────────────────────────────────────────────────────
const AVATAR_MAP = {
  ai_spark: "/avatars/ai-spark.svg",
  bot_classic: "/avatars/bot-classic.svg",
  human_agent: "/avatars/human-agent.svg",
  minimal_dot: "/avatars/minimal-dot.svg",
};

const INDUSTRY_DEMOS = {
  Plumbing: { service: "Plumbing repair", scenario: "Someone has a leaking pipe." },
  HVAC: { service: "AC repair", scenario: "Someone's AC stopped working." },
  Electrical: { service: "Electrical repair", scenario: "Someone has an electrical fault or safety concern." },
  "Pest Control": { service: "Pest inspection", scenario: "Someone needs pest treatment or an inspection." },
  Roofing: { service: "Roof inspection", scenario: "Someone has storm damage or a roof leak." },
  Restoration: { service: "Water damage restoration", scenario: "Someone has water damage or flooding." },
  "Garage Door": { service: "Garage door repair", scenario: "Someone's garage door is stuck or broken." },
  "Appliance Repair": { service: "Appliance repair", scenario: "Someone's refrigerator or washer broke down." },
  "Wellness / Fitness": { service: "Session booking", scenario: "Someone wants to book a session or consultation." },
  "Sauna / Recovery": { service: "Recovery session", scenario: "Someone wants to book a sauna or recovery session." },
  "Med Spa / IV Therapy": { service: "Treatment booking", scenario: "Someone wants to book an IV therapy or spa treatment." },
  Other: { service: "Service inquiry", scenario: "Someone needs help with your service." },
};

// Generates next 6 days, skipping Sundays (0)
function getNextWeekdays() {
  const dates = [];
  let d = new Date();
  let daysFound = 0;

  while (daysFound < 6) {
    d.setDate(d.getDate() + 1);
    if (d.getDay() !== 0) {
      const options = { month: "short", day: "numeric", year: "numeric" };
      dates.push(d.toLocaleDateString("en-US", options));
      daysFound++;
    }
  }
  return dates;
}

// Generates slots from 09:00 AM to 05:00 PM
const generateTimeSlots = () => {
  const slots = [];
  for (let i = 9; i <= 17; i++) {
    const hour = i > 12 ? i - 12 : i;
    const ampm = i >= 12 ? "PM" : "AM";
    const displayHour = hour < 10 ? `0${hour}` : hour;
    slots.push(`${displayHour}:00 ${ampm}`);
  }
  return slots;
};

const STEPS = {
  WELCOME: "WELCOME",
  AI_CHAT_MODE: "AI_CHAT_MODE",
  CHOOSE_PATH: "CHOOSE_PATH",
  SELECT_DATE: "SELECT_DATE",
  SELECT_TIME: "SELECT_TIME",
  CONFIRM_BOOKING: "CONFIRM_BOOKING",
  FINAL_CTA: "FINAL_CTA",
};

const TypewriterBubble = ({ msg, onButtonClick, scrollRef, isProcessing }) => {
  const [displayedText, setDisplayedText] = useState(msg.instant ? msg.text : "");
  const [isTypingText, setIsTypingText] = useState(!msg.instant);

  useEffect(() => {
    if (msg.instant) {
      setDisplayedText(msg.text);
      setIsTypingText(false);
      setTimeout(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 50);
      return;
    }
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
  }, [msg.text, scrollRef, msg.instant]);

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
                className={`text-[13px] font-semibold px-4 py-2.5 rounded-xl transition-all duration-200 text-center border ${isProcessing ? "opacity-50 cursor-not-allowed " : "hover:scale-[1.02] active:scale-95"} ${isCTA ? "bg-[var(--primary)] border-transparent text-white shadow-[0_0_15px_var(--lead-glow)] hover:shadow-[0_0_20px_var(--lead-glow)]" : "bg-[var(--background)] border-[var(--border-color)] text-[var(--foreground)] hover:bg-[var(--card-bg)]"}`}
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

export default function AicyroChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasAutoOpened, setHasAutoOpened] = useState(false);
  const [showPeek, setShowPeek] = useState(false);
  const [step, setStep] = useState(STEPS.WELCOME);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [firebaseDbId, setFirebaseDbId] = useState(null);
  const [hasNotifiedLead, setHasNotifiedLead] = useState(false);

  // ─── DYNAMIC CONFIG STATE ───
  const [botConfig, setBotConfig] = useState({
    botName: "Aicyro Front Desk",
    launcherText: "Need help?",
    greetingMessage: "Hi! I'm Aicyro's AI Assistant. How can I help you today?",
    botAvatar: "ai_spark",
    customAvatarSvg: "", // Field to hold custom SVG
  });

  // ─── FETCH SETTINGS FROM FIREBASE ON MOUNT ───
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const snapshot = await get(ref(db, "settings/chatbot_config"));
        if (snapshot.exists()) {
          const data = snapshot.val();
          setBotConfig({
            botName: data.botName || "Aicyro Front Desk",
            launcherText: data.launcherText || "Need help?",
            greetingMessage:
              data.greetingMessage ||
              "Hi! I'm Aicyro's AI Assistant. How can I help you today?",
            botAvatar: data.botAvatar || "ai_spark",
            customAvatarSvg: data.customAvatarSvg || "", // Fetch SVG
          });
        }
      } catch (err) {
        console.error("Failed to load bot config UI data:", err);
      }
    };
    fetchConfig();
  }, []);

  const [sessionStartTime] = useState(new Date().toISOString());
  const [hasTrackedOpen, setHasTrackedOpen] = useState(false);
  const [hasTrackedConvo, setHasTrackedConvo] = useState(false);

  const [avatarEffect, setAvatarEffect] = useState("");
  const [speechText, setSpeechText] = useState("");
  const [isHovered, setIsHovered] = useState(false);

  const [leadData, setLeadData] = useState({
    name: "", phone: "", email: "", business_name: "", business_type: "", website: "",
    service_requested: "", location: "", visitor_intent: "", urgency_level: "",
    preferred_date: "", preferred_time: "", selected_date: "", conversation_summary: "",
    lead_score: "Low", booking_status: "In Progress", after_hours_flag: false, source_page: "",
  });

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // ─── RESOLVE AVATAR LOGIC ───
  const getActiveAvatarSrc = () => {
    if (botConfig.botAvatar === "custom") {
      if (botConfig.customAvatarSvg && botConfig.customAvatarSvg.trim().startsWith("<svg")) {
        // Safely encode SVG string to a data URL
        return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(botConfig.customAvatarSvg)}`;
      }
      // Fallback custom icon if SVG is empty/invalid
      return `data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 20h9'%3E%3C/path%3E%3Cpath d='M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z'%3E%3C/path%3E%3C/svg%3E`;
    }
    return AVATAR_MAP[botConfig.botAvatar] || AVATAR_MAP.ai_spark;
  };

  const currentAvatarSrc = getActiveAvatarSrc();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event_type: "page_view" }),
    }).catch(() => {});
    const timer = setTimeout(() => {
      if (!hasAutoOpened) {
        setShowPeek(true);
        setHasAutoOpened(true);
      }
    }, 6000);
    return () => clearTimeout(timer);
  }, [hasAutoOpened]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setStep(STEPS.AI_CHAT_MODE);
      addBotMessage(botConfig.greetingMessage, [], true);
    }
  }, [isOpen, messages.length, botConfig.greetingMessage]);

  useEffect(() => {
    const isChatMode = [STEPS.AI_CHAT_MODE].includes(step);
    if (isOpen && !isProcessing && isChatMode && inputRef.current) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen, isProcessing, step]);

  const handleAvatarHover = () => {
    setIsHovered(true);
    if (!avatarEffect) {
      const phrases = ["Beep boop! ⚡", "I capture leads 24/7!", "Let's maximize revenue!", "Need a fast demo? 👇"];
      setSpeechText(phrases[Math.floor(Math.random() * phrases.length)]);
    }
  };

  const handleAvatarLeave = () => {
    setIsHovered(false);
  };

  const handleAvatarClick = (e) => {
    e.stopPropagation();
    if (avatarEffect) return;
    setAvatarEffect("animate-avatar-flip");
    setSpeechText("Whoa! 🚀");
    setTimeout(() => {
      setAvatarEffect("");
      if (isHovered) setSpeechText("Ready for action!");
    }, 1000);
  };

  function addBotMessage(text, buttons = [], isInstant = false) {
    if (isInstant) {
      setMessages((prev) => [...prev, { role: "bot", text, buttons, instant: true, id: Date.now() + Math.random() }]);
    } else {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setMessages((prev) => [...prev, { role: "bot", text, buttons, instant: false, id: Date.now() + Math.random() }]);
      }, 600);
    }
  }

  function addUserMessage(text) {
    setMessages((prev) => [...prev, { role: "user", text, id: Date.now() + Math.random() }]);
  }

  function openChat() {
    setShowPeek(false);
    setIsOpen(true);
    if (!hasTrackedOpen) {
      fetch("/api/analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ event_type: "chatbot_opened" }),
      }).catch(() => {});
      setHasTrackedOpen(true);
    }
  }

  function handleCloseChat() {
    submitLead({ ...leadData, conversation_ended_at: new Date().toISOString() });
    setIsOpen(false);
  }

  function triggerConfirmation(finalData) {
    setStep(STEPS.CONFIRM_BOOKING);
    const summaryText = `Great! Before I lock this in, please confirm your details:\n\n• Name: ${finalData.name || "N/A"}\n• Email: ${finalData.email || "N/A"}\n• Phone: ${finalData.phone || "N/A"}\n• Meeting: ${finalData.display_time}\n\nDoes everything look correct?`;
    addBotMessage(summaryText, [
      { label: "Yes, Confirm Booking", value: "confirm_yes" },
      { label: "No, Edit Details", value: "confirm_no" },
    ]);
  }

  async function generateAndSendWebhook(data, timeText) {
    let emailSubject = "Your Demo is Confirmed!";
    let emailBody = `Hi ${data.name || "there"},\n\nYour meeting is confirmed for ${timeText}. We look forward to speaking with you!\n\nBest,\nThe Team`;
    try {
      const response = await fetch("/api/generate-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: data.name, business_type: data.business_type, time: timeText }),
      });
      if (response.ok) {
        const generatedEmail = await response.json();
        emailSubject = generatedEmail.subject;
        emailBody = generatedEmail.body;
      }
    } catch (error) {
      console.warn("Skipping AI email generation, using fallback.", error);
    }

    triggerNotification("Meeting Booked!", `${data.name || "A visitor"} confirmed a meeting for ${timeText}.`);

    submitLead({
      ...data, booking_status: "Meeting Booked", requested_action: "Meeting Booked",
      generated_subject: emailSubject, generated_body: emailBody, conversation_ended_at: new Date().toISOString(),
    });
    setIsProcessing(false);
    addBotMessage(
      `✅ Contact Confirmed!\n\nYour demo is officially booked for ${timeText}. We have securely saved your details and sent a calendar invite to ${data.email || "your email"}.`,
      [{ label: "Close Chat", value: "close" }], true
    );
  }

  async function submitLead(data) {
    try {
      const currentTranscript = messages.map((m) => `[${m.role.toUpperCase()}]: ${m.text || m.content || "Interaction"}`).join("\n");
      const payload = {
        source: "Website AI Front Desk", source_page: typeof window !== "undefined" ? window.location.href : "Unknown",
        full_conversation_transcript: currentTranscript, conversation_started_at: sessionStartTime,
        last_interaction_at: new Date().toISOString(), ...(!firebaseDbId && { timestamp: new Date().toISOString() }),
        firebaseId: firebaseDbId, ...data,
      };
      const sanitizedPayload = Object.fromEntries(Object.entries(payload).map(([k, v]) => [k, v === undefined || v === null ? "" : v]));
      const res = await fetch("/api/leads", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(sanitizedPayload) });
      if (!res.ok) throw new Error(`Server status: ${res.status}`);
      const responseData = await res.json();
      if (responseData.id && !firebaseDbId) setFirebaseDbId(responseData.id);
    } catch (err) {
      console.error("❌ LEAD SUBMISSION FAILED:", err);
    }
  }

  async function handleButtonClick(value, label) {
    if (isProcessing) return;
    addUserMessage(label);
    switch (step) {
      case STEPS.CHOOSE_PATH:
        if (value === "path_book") {
          setStep(STEPS.SELECT_DATE);
          const dateButtons = getNextWeekdays().map((d) => ({ label: d, value: `date_${d}` }));
          addBotMessage("Please select a date for your meeting:", dateButtons);
        } else if (value === "path_demo") {
          showMiniDemo(leadData.business_type || "Other");
        }
        break;
      case STEPS.SELECT_DATE:
        if (value.startsWith("date_")) {
          const chosenDate = value.replace("date_", "");
          setLeadData((d) => ({ ...d, selected_date: chosenDate }));
          setStep(STEPS.SELECT_TIME);
          const timeButtons = generateTimeSlots().map((t) => ({ label: t, value: `time_${t}` }));
          addBotMessage(`Great, ${chosenDate}. What time works for you?`, timeButtons);
        }
        break;
      case STEPS.SELECT_TIME:
        if (value.startsWith("time_")) {
          const chosenTime = value.replace("time_", "");
          const exactTimeText = `${leadData.selected_date} at ${chosenTime}`;
          let isoDateSlot = exactTimeText;
          try {
            const parsedDate = new Date(`${leadData.selected_date} ${chosenTime}`);
            if (!isNaN(parsedDate)) isoDateSlot = parsedDate.toISOString();
          } catch (e) {}
          const finalLeadData = { ...leadData, booked_slot: isoDateSlot, display_time: exactTimeText };
          setLeadData(finalLeadData);
          triggerConfirmation(finalLeadData);
        }
        break;
      case STEPS.CONFIRM_BOOKING:
        if (value === "confirm_yes") {
          setStep(STEPS.FINAL_CTA);
          setIsProcessing(true);
          generateAndSendWebhook({ ...leadData, requested_action: "Meeting Booked" }, leadData.display_time);
        } else if (value === "confirm_no") {
          setStep(STEPS.AI_CHAT_MODE);
          addBotMessage("No problem. Just tell me what needs to be changed (e.g., 'Change my email to xyz@test.com').");
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
    addBotMessage(`Here's how it works! Imagine a visitor comes to your site and says: '${demo.scenario}' Aicyro checks urgency, captures their info instantly, and pushes them to call or book 24/7.`, []);
    setTimeout(() => {
      setMessages((prev) => [...prev, { role: "bot", type: "demo_card", demo, id: Date.now() + Math.random() }]);
      setTimeout(() => {
        setStep(STEPS.SELECT_DATE);
        const dateButtons = getNextWeekdays().map((d) => ({ label: d, value: `date_${d}` }));
        addBotMessage("Pretty cool, right? Let's get a free demo booked so you can see it in action on your own site. What day works best?", dateButtons);
      }, 1500);
    }, 1500);
  }

  async function handleTextInput(e) {
    e.preventDefault();
    if (isProcessing || !inputValue.trim()) return;
    const val = inputValue.trim();
    addUserMessage(val);
    setInputValue("");

    if (!hasTrackedConvo) {
      fetch("/api/analytics", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ event_type: "conversation_started" }) }).catch(() => {});
      setHasTrackedConvo(true);
      triggerNotification("New Chat Started", `A visitor sent a message: "${val.length > 30 ? val.substring(0, 30) + "..." : val}"`);
    }

    if (step === STEPS.AI_CHAT_MODE) {
      setIsProcessing(true);
      const aiHistory = messages.filter((m) => m.role === "user" || m.role === "bot").map((m) => ({ role: m.role === "bot" ? "assistant" : "user", content: m.text || "User interacted" }));
      aiHistory.push({ role: "user", content: val });

      try {
        const response = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: aiHistory }) });
        if (!response.ok) throw new Error(`API returned status ${response.status}`);
        const data = await response.json();

        addBotMessage(data.reply, []);

        const extracted = data.extracted_data || {};
        const updatedLeadData = {
          ...leadData, name: extracted.name || leadData.name, email: extracted.email || leadData.email,
          phone: extracted.phone || leadData.phone, website: extracted.website || leadData.website,
          business_name: extracted.business_name || leadData.business_name, business_type: extracted.business_name || leadData.business_type,
          service_requested: extracted.service_requested || leadData.service_requested, location: extracted.location || leadData.location,
          visitor_intent: data.visitor_intent || leadData.visitor_intent || "Unknown", urgency_level: data.urgency_level || leadData.urgency_level || "Unknown",
          lead_score: data.lead_score || leadData.lead_score || "Low", conversation_summary: data.conversation_summary || leadData.conversation_summary || "In progress...",
          after_hours_flag: data.after_hours_flag !== undefined ? data.after_hours_flag : leadData.after_hours_flag, booking_status: "In Progress",
        };

        setLeadData(updatedLeadData);

        if (updatedLeadData.name || updatedLeadData.email || updatedLeadData.phone || updatedLeadData.business_name || updatedLeadData.service_requested) {
          submitLead({ ...updatedLeadData, booking_status: "Lead Captured - Unbooked", requested_action: "Lead Captured - Unbooked" });
          if (!hasNotifiedLead && (updatedLeadData.name || updatedLeadData.email || updatedLeadData.phone)) {
            triggerNotification("Intel Captured", `${updatedLeadData.name || "A visitor"} shared their contact details.`);
            setHasNotifiedLead(true);
          }
        }

        const hasMandatoryFields = updatedLeadData.name && updatedLeadData.phone && updatedLeadData.email;
        if ((data.ready_to_book === true || extracted.ready_to_book === true) && hasMandatoryFields) {
          setTimeout(() => {
            setStep(STEPS.SELECT_DATE);
            const dateButtons = getNextWeekdays().map((d) => ({ label: d, value: `date_${d}` }));
            addBotMessage("Please select a date for your meeting:", dateButtons);
          }, 1000);
        }
      } catch (error) {
        addBotMessage("Network error trying to reach AI. Please check your console for details.", []);
      } finally {
        setIsProcessing(false);
      }
    }
  }

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[9999] flex flex-col items-end gap-4 font-sans">
      <style>{`
        @keyframes acy-avatar-float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-8px); } }
        .animate-avatar-float { animation: acy-avatar-float 3.5s ease-in-out infinite; }
        @keyframes acy-robot-peek { 0%, 15% { transform: translate(0, 10px) scale(0.5) rotate(0deg); opacity: 0; } 20%, 35% { transform: translate(-45px, -35px) scale(1.15) rotate(-15deg); opacity: 1; } 40%, 55% { transform: translate(0, 10px) scale(0.5) rotate(0deg); opacity: 0; } 60%, 75% { transform: translate(45px, -35px) scale(1.15) rotate(15deg); opacity: 1; } 80%, 100% { transform: translate(0, 10px) scale(0.5) rotate(0deg); opacity: 0; } }
        .animate-robot-peek { animation: acy-robot-peek 14s cubic-bezier(0.34, 1.56, 0.64, 1) infinite; }
        @keyframes acy-avatar-flip { 0% { transform: translateY(0) scale(1.05) rotateY(0deg); } 30% { transform: translateY(-35px) scale(1.25) rotateY(180deg); filter: brightness(1.2); } 60% { transform: translateY(-10px) scale(1.15) rotateY(360deg); } 100% { transform: translateY(0) scale(1.05) rotateY(360deg); } }
        .animate-avatar-flip { animation: acy-avatar-flip 0.8s ease-out forwards; }
        @keyframes acy-avatar-thinking { 0%, 100% { transform: translate(0, 0) scale(1.05); } 20% { transform: translate(-2px, 1px) scale(1.05) rotate(-1deg); } 40% { transform: translate(2px, -1px) scale(1.05) rotate(1deg); } 60% { transform: translate(-1px, -2px) scale(1.05); } 80% { transform: translate(2px, 2px) scale(1.05); } }
        .animate-avatar-thinking { animation: acy-avatar-thinking 0.25s linear infinite; }
        @keyframes thought-pulse { 0%, 100% { transform: scale(1); opacity: 0.7; } 50% { transform: scale(1.3); opacity: 1; } }
        .thought-dot-1 { animation: thought-pulse 1.5s infinite ease-in-out; }
        .thought-dot-2 { animation: thought-pulse 1.5s infinite ease-in-out 0.3s; }
        .thought-dot-3 { animation: thought-pulse 1.5s infinite ease-in-out 0.6s; }
      `}</style>

      {showPeek && !isOpen && (
        <div className="absolute bottom-[90px] right-2 z-50 animate-acy-spring origin-bottom-right">
          <div className="relative z-10 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-[32px] p-5 w-[280px] shadow-[0_20px_40px_rgba(0,0,0,0.3)] animate-avatar-float">
            <p className="text-[14px] text-[var(--foreground)] font-bold mb-4 leading-snug text-center">
              Want to see how many website leads you might be missing?
            </p>
            <div className="flex justify-center gap-3">
              <button
                className="text-xs font-bold px-5 py-2.5 rounded-xl bg-[var(--primary)] text-white transition-transform hover:-translate-y-0.5 shadow-[0_0_15px_var(--lead-glow)]"
                onClick={openChat}
              >
                Show me
              </button>
              <button
                className="text-xs font-bold px-5 py-2.5 rounded-xl text-[var(--foreground-muted)] border border-transparent hover:border-[var(--border-color)]"
                onClick={() => setShowPeek(false)}
              >
                Not now
              </button>
            </div>
          </div>
          <div className="absolute -bottom-3 right-12 w-5 h-5 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-full shadow-md z-10 thought-dot-1"></div>
          <div className="absolute -bottom-7 right-8 w-3 h-3 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-full shadow-sm z-10 thought-dot-2"></div>
          <div className="absolute -bottom-10 right-6 w-2 h-2 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-full shadow-sm z-10 thought-dot-3"></div>
        </div>
      )}

      {!isOpen && (
        <div className="relative group z-50">
          <div
            onClick={openChat}
            onMouseEnter={handleAvatarHover}
            onMouseLeave={handleAvatarLeave}
            className={`absolute cursor-pointer pointer-events-auto transition-all duration-500 ease-in-out ${showPeek ? "-top-[64px] right-0 w-20 h-20 animate-avatar-float drop-shadow-[0_10px_20px_rgba(0,0,0,0.3)] z-20 scale-100" : "inset-0 m-auto w-16 h-16 animate-robot-peek group-hover:opacity-0 -z-10 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)] scale-90"} ${avatarEffect}`}
          >
            {/* Renders the dynamic chosen avatar SVG */}
            <img
              src={currentAvatarSrc}
              alt="AI Avatar"
              className="w-full h-full object-contain filter hover:brightness-110 transition-all"
            />
          </div>
          <button
            className={`relative z-10 flex items-center justify-center text-white shadow-[0_4px_20px_var(--lead-glow)] transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_8px_30px_var(--lead-glow)] h-14 px-6 rounded-full rotate-0 bg-[var(--primary)]`}
            onClick={openChat}
            aria-label="Open Chat"
          >
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
                {botConfig.launcherText}
              </span>
            </div>
            <span className="absolute top-0 right-0 flex h-3.5 w-3.5 -mt-0.5 -mr-0.5 z-50">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent-blue)] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[var(--accent-blue)] border-2 border-[var(--background)]"></span>
            </span>
          </button>
        </div>
      )}

      {isOpen && (
        <div className="absolute bottom-4 right-0 w-[calc(100vw-32px)] sm:w-[380px] z-50 animate-acy-spring origin-bottom-right">
          <div
            onMouseEnter={handleAvatarHover}
            onMouseLeave={handleAvatarLeave}
            onClick={handleAvatarClick}
            className={`absolute -top-20 right-6 w-24 h-24 z-50 cursor-pointer pointer-events-auto transition-transform hover:scale-110 active:scale-95 drop-shadow-[0_0_20px_var(--lead-glow)] ${avatarEffect ? avatarEffect : isTyping || isProcessing ? "animate-avatar-thinking" : "animate-avatar-float"}`}
          >
            {/* Renders the dynamic chosen avatar SVG */}
            <img
              src={currentAvatarSrc}
              alt="AI Avatar"
              className="w-full h-full object-contain filter hover:brightness-110 transition-all"
            />
            {isHovered && speechText && (
              <div className="absolute bottom-full right-1/2 translate-x-1/2 mb-2 bg-[var(--primary)] text-white font-bold text-[11px] px-3 py-1.5 rounded-xl whitespace-nowrap shadow-xl border border-white/10 animate-acy-spring origin-bottom">
                {speechText}
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[var(--primary)]" />
              </div>
            )}
          </div>

          <div className="relative z-10 w-full h-[65vh] sm:h-[620px] max-h-[85vh] bg-[var(--background)] border border-[var(--border-color)] rounded-[24px] shadow-[0_20px_60px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden">
            <div className="px-5 py-4 flex items-center justify-between shrink-0 bg-[var(--card-bg)] border-b border-[var(--border-color)]">
              <div className="flex items-center gap-3">
                <div className="relative w-16 h-16 rounded-xl bg-[var(--background)] border border-[var(--border-color)] flex items-center justify-center shadow-sm overflow-hidden">
                  {/* Renders the dynamic chosen avatar SVG */}
                  <img
                    src={currentAvatarSrc}
                    alt="AI Assistant"
                    className="w-full h-full object-contain p-2"
                  />
                  <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 border-[2.5px] border-[var(--card-bg)] rounded-full z-10"></div>
                </div>
                <div className="flex flex-col">
                  <h3 className="text-[15px] font-bold text-[var(--foreground)] leading-tight tracking-tight">
                    {botConfig.botName}
                  </h3>
                  <span className="text-[12px] font-medium text-[var(--foreground-muted)] mt-0.5">
                    Security & Lead Intel
                  </span>
                </div>
              </div>
              <button
                onClick={handleCloseChat}
                className="group relative -mr-2 w-10 h-10 flex items-center justify-center text-[var(--foreground-muted)] hover:text-[var(--foreground)] bg-[var(--background)] rounded-full ring-2 ring-[var(--border-color)] transition-all duration-200 hover:scale-[1.1] focus:outline-none"
                aria-label="Minimize Chat"
              >
                <svg
                  className="w-5 h-5 transition-all duration-200 group-hover:stroke-[3.5px]"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
            </div>

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

            <div className="p-3 bg-[var(--background)] border-t border-[var(--border-color)] shrink-0">
              {[STEPS.AI_CHAT_MODE].includes(step) ? (
                <form
                  className="flex items-center gap-2 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-full pl-5 pr-1.5 py-1.5 focus-within:border-[var(--primary)] transition-all"
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
        </div>
      )}
    </div>
  );
}