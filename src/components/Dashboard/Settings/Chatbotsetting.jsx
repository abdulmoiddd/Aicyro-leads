"use client";

import { useState, useEffect } from "react";
import { db } from "../../../lib/firebase";
import { ref, set, get } from "firebase/database";

const AVATAR_OPTIONS = [
  { id: "ai_spark", label: "AI Spark", src: "/avatars/ai-spark.svg" },
  { id: "bot_classic", label: "Classic Bot", src: "/avatars/bot-classic.svg" },
  { id: "human_agent", label: "Human Agent", src: "/avatars/human-agent.svg" },
  { id: "minimal_dot", label: "Minimalist", src: "/avatars/minimal-dot.svg" },
  { id: "custom", label: "Custom SVG", isCustom: true }, // New Custom Option
];

const InfoTooltip = ({ text }) => (
  <div className="group relative inline-flex items-center ml-2 cursor-help align-text-bottom">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-[var(--foreground-muted)] hover:text-[var(--primary)] transition-colors"
    >
      <circle cx="12" cy="12" r="10"></circle>
      <path d="M12 16v-4"></path>
      <path d="M12 8h.01"></path>
    </svg>
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-56 p-2.5 bg-[var(--card-bg)] border border-[var(--border-color)] text-[var(--foreground)] text-[11px] leading-relaxed rounded-lg shadow-xl z-50 normal-case tracking-normal text-center pointer-events-none">
      {text}
      <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px border-4 border-transparent border-t-[var(--border-color)]"></div>
    </div>
  </div>
);

export default function ChatbotSettings({ onNavigate }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const [config, setConfig] = useState({
    botAvatar: "ai_spark",
    customAvatarSvg: "", // New field to hold raw SVG string
    botName: "Aicyro Front Desk",
    launcherText: "Chat with us",
    themeColor: "#10b981",
    greetingMessage: "Hi! I'm Aicyro's AI Assistant. How can I help you today?",
    botIdentity: "the 'AI Front Desk' for Aicyro",
    companyContext:
      "We provide automated AI business systems and digital products.",
    customRules: "Never mention competitors. Keep answers extremely brief.",
    additionalConversationalRules:
      "1. Always end your message with a question.\n2. Never use emojis.",
    tone: "Professional & Friendly",
    basePrompt:
      "Operate a strict, funnel-based lead capture system. Give precise answers and use as few tokens as possible.",
    leadCaptureFields: [
      "Service Requested",
      "Location",
      "Name",
      "Email",
      "Phone",
    ],
    services: [""],
    faqs: [{ question: "", answer: "" }],
    qualificationQuestions: [""],
    escalationRule: "email_admin",
    bookingRule: "require_all",
    unavailableBehavior: "collect_lead",
    aiModel: "gpt-4o-mini",
    temperature: 0.1,
    strictValidation: true,
  });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(
      () => setToast({ show: false, message: "", type: "success" }),
      3500,
    );
  };

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const snapshot = await get(ref(db, "settings/chatbot_config"));
        if (snapshot.exists()) {
          const data = snapshot.val();
          setConfig((prev) => ({ ...prev, ...data }));
        }
      } catch (error) {
        showToast("Failed to load settings.", "error");
      } finally {
        setIsLoading(false);
      }
    };
    fetchConfig();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setConfig((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAvatarSelect = (avatarId) => {
    setConfig((prev) => ({ ...prev, botAvatar: avatarId }));
  };

  const handleArrayChange = (index, field, value) => {
    const newArray = [...config[field]];
    newArray[index] = value;
    setConfig((prev) => ({ ...prev, [field]: newArray }));
  };

  const addArrayItem = (field, emptyValue = "") =>
    setConfig((prev) => ({ ...prev, [field]: [...prev[field], emptyValue] }));

  const removeArrayItem = (index, field) => {
    const newArray = config[field].filter((_, i) => i !== index);
    setConfig((prev) => ({
      ...prev,
      [field]: newArray.length ? newArray : [""],
    }));
  };

  const handleFaqChange = (index, key, value) => {
    const newFaqs = [...config.faqs];
    newFaqs[index][key] = value;
    setConfig((prev) => ({ ...prev, faqs: newFaqs }));
  };

  const handleSaveConfig = async () => {
    setIsSaving(true);
    const cleanedConfig = {
      ...config,
      leadCaptureFields: config.leadCaptureFields.filter(
        (f) => f.trim() !== "",
      ),
      services: config.services.filter((s) => s.trim() !== ""),
      qualificationQuestions: config.qualificationQuestions.filter(
        (q) => q.trim() !== "",
      ),
      faqs: config.faqs.filter(
        (f) => f.question.trim() !== "" && f.answer.trim() !== "",
      ),
    };

    try {
      await set(ref(db, "settings/chatbot_config"), {
        ...cleanedConfig,
        updated_at: new Date().toISOString(),
      });
      setConfig(cleanedConfig);
      showToast("Chatbot settings updated successfully!", "success");
    } catch (error) {
      showToast("Failed to save changes.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-[var(--foreground-muted)] text-sm font-bold uppercase tracking-widest animate-pulse">
          Loading AI Config...
        </p>
      </div>
    );

  // Helper to resolve the correct image source for the active avatar
  const getActiveAvatarSrc = () => {
    if (config.botAvatar === "custom") {
      if (
        config.customAvatarSvg &&
        config.customAvatarSvg.trim().startsWith("<svg")
      ) {
        // Convert raw SVG to a data URI safely for the <img> tag
        return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(config.customAvatarSvg)}`;
      }
      // Fallback placeholder if custom is selected but no SVG is provided yet
      return `data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 20h9'%3E%3C/path%3E%3Cpath d='M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z'%3E%3C/path%3E%3C/svg%3E`;
    }
    const selected = AVATAR_OPTIONS.find((a) => a.id === config.botAvatar);
    return selected?.src || AVATAR_OPTIONS[0].src;
  };

  const activeAvatarSrc = getActiveAvatarSrc();

  return (
    <main className="relative z-10 flex-grow w-full max-w-[1600px] mx-auto px-6 sm:px-12 py-8 fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 border-b border-[var(--border-color)] pb-6">
        <div>
          <h1 className="text-3xl font-bold text-[var(--foreground)] tracking-tight">
            Chatbot Settings
          </h1>
          <p className="text-[var(--foreground-muted)] text-sm mt-1">
            Configure your AI agent's branding, prompts, knowledge, and
            operational rules.
          </p>
        </div>
        <button
          onClick={handleSaveConfig}
          disabled={isSaving}
          className="flex items-center gap-2 px-6 py-3 bg-[var(--primary)] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-[0_0_15px_var(--lead-glow)] transition-all disabled:opacity-50 hover:bg-[var(--secondary)]"
        >
          {isSaving ? "Saving..." : "Save AI Rules"}
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 pb-10">
        {/* ==========================================
            LEFT COLUMN (Identity & Persona)
        ========================================== */}
        <div className="flex flex-col gap-8">
          {/* Card 1: Display & Branding */}
          <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl p-6 md:p-8 shadow-sm">
            <h2 className="text-lg font-bold text-[var(--foreground)] tracking-tight border-b border-[var(--border-color)] pb-4 mb-6">
              Display & Branding
            </h2>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-[var(--foreground-muted)] uppercase tracking-widest">
                    Chatbot Name
                    <InfoTooltip text="The public-facing name visitors will see at the top of the chat window." />
                  </label>
                  <input
                    name="botName"
                    value={config.botName}
                    onChange={handleInputChange}
                    className="w-full bg-[var(--background)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm focus:border-[var(--primary)] outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-[var(--foreground-muted)] uppercase tracking-widest">
                    Launcher Text
                    <InfoTooltip text="The text displayed next to the chat bubble before the user opens the widget." />
                  </label>
                  <input
                    name="launcherText"
                    value={config.launcherText}
                    onChange={handleInputChange}
                    className="w-full bg-[var(--background)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm focus:border-[var(--primary)] outline-none"
                  />
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-[var(--border-color)]">
                <label className="text-[11px] font-bold text-[var(--foreground-muted)] uppercase tracking-widest">
                  Bot Avatar Graphic
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {AVATAR_OPTIONS.map((avatar) => {
                    const isSelected = config.botAvatar === avatar.id;
                    let imgSrc = avatar.src;

                    if (avatar.isCustom) {
                      imgSrc =
                        config.customAvatarSvg &&
                        config.customAvatarSvg.trim().startsWith("<svg")
                          ? `data:image/svg+xml;charset=utf-8,${encodeURIComponent(config.customAvatarSvg)}`
                          : `data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 20h9'%3E%3C/path%3E%3Cpath d='M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z'%3E%3C/path%3E%3C/svg%3E`;
                    }

                    return (
                      <button
                        key={avatar.id}
                        type="button"
                        onClick={() => handleAvatarSelect(avatar.id)}
                        className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-300 ${isSelected ? "border-[var(--primary)] bg-[var(--primary)]/10 shadow-[0_0_15px_var(--lead-glow)] scale-[1.02]" : "border-[var(--border-color)] bg-[var(--background)] hover:border-[var(--primary)]/50"}`}
                      >
                        <div className="mb-2 w-7 h-7 flex items-center justify-center">
                          <img
                            src={imgSrc}
                            alt={avatar.label}
                            className={`w-full h-full object-contain ${!isSelected ? "opacity-60 grayscale" : "opacity-100"}`}
                          />
                        </div>
                        <span
                          className={`text-[8px] text-center font-bold uppercase tracking-widest ${isSelected ? "text-[var(--primary)]" : "text-[var(--foreground-muted)]"}`}
                        >
                          {avatar.label}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Custom SVG Input Field (Only visible when 'Custom' is selected) */}
                {config.botAvatar === "custom" && (
                  <div className="mt-4 p-4 border border-[var(--primary)] bg-[var(--primary)]/5 rounded-xl animate-fade-in">
                    <label className="text-[11px] font-bold text-[var(--foreground)] uppercase tracking-widest flex items-center justify-between">
                      Paste Custom SVG Code
                      <InfoTooltip text="Paste raw <svg>...</svg> code here. It will be saved directly to your database." />
                    </label>
                    <textarea
                      name="customAvatarSvg"
                      value={config.customAvatarSvg}
                      onChange={handleInputChange}
                      placeholder="<svg viewBox='0 0 24 24'>...</svg>"
                      rows="3"
                      className="mt-3 w-full bg-[var(--background)] border border-[var(--border-color)] rounded-lg px-4 py-3 text-xs font-mono focus:border-[var(--primary)] outline-none resize-y"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2 pt-4 border-t border-[var(--border-color)]">
                <label className="text-[11px] font-bold text-[var(--foreground-muted)] uppercase tracking-widest">
                  Initial Greeting Message
                  <InfoTooltip text="The very first message the bot sends to engage the user when they open the chat." />
                </label>
                <textarea
                  name="greetingMessage"
                  value={config.greetingMessage}
                  onChange={handleInputChange}
                  rows="2"
                  className="w-full bg-[var(--background)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm focus:border-[var(--primary)] outline-none resize-none"
                />
              </div>
            </div>
          </div>

          {/* Card 2: Core Prompt & Persona */}
          <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl p-6 md:p-8 shadow-sm">
            <h2 className="text-lg font-bold text-[var(--foreground)] tracking-tight border-b border-[var(--border-color)] pb-4 mb-6">
              Prompt Engineering & Persona
            </h2>
            <div className="space-y-6">
              <div className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--background)] grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[var(--foreground-muted)] uppercase tracking-widest">
                    LLM Engine
                    <InfoTooltip text="Select the AI brain. 'mini' models are fast and cheap. Full models are smarter for complex tasks." />
                  </label>
                  <select
                    name="aiModel"
                    value={config.aiModel}
                    onChange={handleInputChange}
                    className="w-full bg-[var(--card-bg)] border border-[var(--border-color)] rounded-lg p-2 text-xs outline-none cursor-pointer"
                  >
                    <option value="gpt-4o-mini">gpt-4o-mini (Fastest)</option>
                    <option value="gpt-4o">gpt-4o (High Logic)</option>
                    <option value="gpt-4-turbo">gpt-4-turbo</option>
                    <option value="gpt-4">gpt-4 (Standard)</option>
                    <option value="gpt-3.5-turbo">
                      gpt-3.5-turbo (Legacy)
                    </option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[var(--foreground-muted)] uppercase tracking-widest">
                    Temperature ({config.temperature})
                    <InfoTooltip text="Lower values (0.1) make the bot strict. Higher values (0.7) make it creative." />
                  </label>
                  <input
                    type="range"
                    min="0.0"
                    max="0.9"
                    step="0.1"
                    name="temperature"
                    value={config.temperature}
                    onChange={handleInputChange}
                    className="w-full accent-[var(--primary)] cursor-pointer mt-2"
                  />
                </div>
                <div className="space-y-1 flex flex-col justify-center items-start pl-2">
                  <label className="text-[10px] font-bold text-[var(--foreground-muted)] uppercase tracking-widest flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="strictValidation"
                      checked={config.strictValidation}
                      onChange={handleInputChange}
                      className="accent-[var(--primary)] rounded"
                    />
                    Strict Formats
                    <InfoTooltip text="If checked, the AI rejects invalid emails/phone numbers. If unchecked, it accepts looser conversational data." />
                  </label>
                  <p className="text-[9px] text-[var(--foreground-muted)] mt-1">
                    Enforce regex checks.
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold text-[var(--foreground-muted)] uppercase tracking-widest">
                  Core System Prompt Override
                  <InfoTooltip text="The fundamental instructions driving the AI. Tell it its ultimate goal." />
                </label>
                <textarea
                  name="basePrompt"
                  value={config.basePrompt}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full bg-[var(--background)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm focus:border-[var(--primary)] outline-none resize-none"
                />
              </div>

              <div className="space-y-2 pt-4 border-t border-[var(--border-color)]">
                <label className="text-[11px] font-bold text-[var(--foreground-muted)] uppercase tracking-widest">
                  Bot Identity / Role
                  <InfoTooltip text="Who the AI thinks it is. Helps set context for the LLM." />
                </label>
                <input
                  name="botIdentity"
                  value={config.botIdentity}
                  onChange={handleInputChange}
                  className="w-full bg-[var(--background)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm focus:border-[var(--primary)] outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold text-[var(--foreground-muted)] uppercase tracking-widest">
                  Company Context
                  <InfoTooltip text="A brief description of your business. The AI uses this to answer general inquiries." />
                </label>
                <textarea
                  name="companyContext"
                  value={config.companyContext}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full bg-[var(--background)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm focus:border-[var(--primary)] outline-none resize-none"
                />
              </div>

              <div className="space-y-2 pt-4 border-t border-[var(--border-color)]">
                <label className="text-[11px] font-bold text-[var(--foreground-muted)] uppercase tracking-widest">
                  Bot Tone
                  <InfoTooltip text="Dictates the vocabulary and conversational style of the AI." />
                </label>
                <select
                  name="tone"
                  value={config.tone}
                  onChange={handleInputChange}
                  className="w-full bg-[var(--background)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm focus:border-[var(--primary)] outline-none appearance-none cursor-pointer"
                >
                  <option value="Professional & Friendly">
                    Professional & Friendly
                  </option>
                  <option value="Highly Formal & Direct">
                    Highly Formal & Direct
                  </option>
                  <option value="Casual & Enthusiastic">
                    Casual & Enthusiastic
                  </option>
                  <option value="Concise & Technical">
                    Concise & Technical
                  </option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* ==========================================
            RIGHT COLUMN (Rules, Flow & Data)
        ========================================== */}
        <div className="flex flex-col gap-8">
          {/* Card 3: Live Agent Preview */}
          <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl p-6 md:p-8 shadow-sm flex flex-col items-center justify-center relative overflow-hidden">
            <h2 className="text-sm font-bold text-[var(--foreground-muted)] tracking-widest uppercase mb-6">
              Live Agent Preview
            </h2>
            <div className="w-full max-w-sm bg-[var(--background)] border border-[var(--border-color)] rounded-2xl shadow-lg overflow-hidden flex flex-col">
              <div className="bg-[var(--card-bg)] p-4 border-b border-[var(--border-color)] flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[var(--background)] border border-[var(--primary)] flex items-center justify-center shadow-[0_0_10px_var(--lead-glow)] p-1.5 shrink-0 overflow-hidden">
                  <img
                    src={activeAvatarSrc}
                    alt="Selected Avatar"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[var(--foreground)] leading-tight">
                    {config.botName || "Bot Name"}
                  </h3>
                  <p className="text-[10px] text-green-500 flex items-center gap-1 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>{" "}
                    Online
                  </p>
                </div>
              </div>
              <div className="p-4 flex flex-col gap-3 min-h-[120px]">
                <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl rounded-tl-none p-3 text-xs text-[var(--foreground)] shadow-sm">
                  {config.greetingMessage || "Hello there!"}
                </div>
              </div>
            </div>
          </div>

          {/* Card 4: Chat Flow & Rules */}
          <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl p-6 md:p-8 shadow-sm">
            <h2 className="text-lg font-bold text-[var(--foreground)] tracking-tight border-b border-[var(--border-color)] pb-4 mb-6">
              Chat Flow & Rules
            </h2>
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-[11px] font-bold text-[var(--foreground-muted)] uppercase tracking-widest flex justify-between items-center">
                  <span>
                    Mandatory Lead Fields
                    <InfoTooltip text="The exact information the AI must collect, in order, before qualifying the user." />
                  </span>
                  <button
                    onClick={() => addArrayItem("leadCaptureFields")}
                    className="text-[var(--primary)]"
                  >
                    + Add Field
                  </button>
                </label>
                <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar pr-2">
                  {config.leadCaptureFields.map((field, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <span className="text-xs font-mono text-[var(--foreground-muted)] bg-[var(--background)] p-2 rounded">
                        {index + 1}.
                      </span>
                      <input
                        type="text"
                        value={field}
                        onChange={(e) =>
                          handleArrayChange(
                            index,
                            "leadCaptureFields",
                            e.target.value,
                          )
                        }
                        className="flex-grow bg-[var(--background)] border border-[var(--border-color)] rounded-lg px-4 py-2 text-sm focus:border-[var(--primary)] outline-none"
                      />
                      <button
                        onClick={() =>
                          removeArrayItem(index, "leadCaptureFields")
                        }
                        className="px-3 text-[var(--foreground-muted)] hover:text-red-400 bg-[var(--background)] border border-[var(--border-color)] rounded-lg transition-colors"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-[var(--border-color)]">
                <label className="text-[11px] font-bold text-[var(--foreground-muted)] uppercase tracking-widest flex justify-between items-center">
                  <span>
                    Qualification Questions
                    <InfoTooltip text="Questions the AI should ask organically to determine if the lead is high quality." />
                  </span>
                  <button
                    onClick={() => addArrayItem("qualificationQuestions")}
                    className="text-[var(--primary)]"
                  >
                    + Add Question
                  </button>
                </label>
                <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar pr-2">
                  {config.qualificationQuestions.map((q, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={q}
                        onChange={(e) =>
                          handleArrayChange(
                            index,
                            "qualificationQuestions",
                            e.target.value,
                          )
                        }
                        className="flex-grow bg-[var(--background)] border border-[var(--border-color)] rounded-lg px-4 py-2 text-sm outline-none focus:border-[var(--primary)]"
                      />
                      <button
                        onClick={() =>
                          removeArrayItem(index, "qualificationQuestions")
                        }
                        className="px-3 text-[var(--foreground-muted)] hover:text-red-400 bg-[var(--background)] border border-[var(--border-color)] rounded-lg transition-colors"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2 pt-4 border-t border-[var(--border-color)]">
                <label className="text-[11px] font-bold text-[var(--foreground-muted)] uppercase tracking-widest">
                  Custom Behavioral Rules
                  <InfoTooltip text="General do's and don'ts. E.g., 'Never mention pricing. Keep answers under 2 sentences.'" />
                </label>
                <textarea
                  name="customRules"
                  value={config.customRules}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full bg-[var(--background)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm focus:border-[var(--primary)] outline-none resize-none"
                />
              </div>

              <div className="space-y-2 pt-4 border-t border-[var(--border-color)]">
                <label className="text-[11px] font-bold text-[var(--foreground-muted)] uppercase tracking-widest">
                  Conversational Rules (Strict Flow)
                  <InfoTooltip text="Directives on how the AI should talk. E.g., 'Always end with a question' or 'Never use bullet points'." />
                </label>
                <textarea
                  name="additionalConversationalRules"
                  value={config.additionalConversationalRules}
                  onChange={handleInputChange}
                  placeholder="1. Always end with a question.&#10;2. Never use emojis."
                  rows="3"
                  className="w-full bg-[var(--background)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm focus:border-[var(--primary)] outline-none resize-none"
                />
              </div>
            </div>
          </div>

          {/* Card 5: Knowledge Base & Routing */}
          <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl p-6 md:p-8 shadow-sm">
            <h2 className="text-lg font-bold text-[var(--foreground)] tracking-tight border-b border-[var(--border-color)] pb-4 mb-6">
              Knowledge & Routing
            </h2>
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-[11px] font-bold text-[var(--foreground-muted)] uppercase tracking-widest flex justify-between items-center">
                  <span>
                    Services Offered
                    <InfoTooltip text="Keywords for your services. If a user asks what you offer, the AI references this list." />
                  </span>
                  <button
                    onClick={() => addArrayItem("services")}
                    className="text-[var(--primary)]"
                  >
                    + Add Service
                  </button>
                </label>
                <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar pr-2">
                  {config.services.map((service, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={service}
                        onChange={(e) =>
                          handleArrayChange(index, "services", e.target.value)
                        }
                        className="flex-grow bg-[var(--background)] border border-[var(--border-color)] rounded-lg px-4 py-2 text-sm focus:border-[var(--primary)] outline-none"
                      />
                      <button
                        onClick={() => removeArrayItem(index, "services")}
                        className="px-3 text-[var(--foreground-muted)] hover:text-red-400 bg-[var(--background)] border border-[var(--border-color)] rounded-lg transition-colors"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-[var(--border-color)]">
                <label className="text-[11px] font-bold text-[var(--foreground-muted)] uppercase tracking-widest flex justify-between items-center">
                  <span>
                    FAQs
                    <InfoTooltip text="Pre-feed exact answers to common questions. The AI will prioritize these over generating a random response." />
                  </span>
                  <button
                    onClick={() =>
                      addArrayItem("faqs", { question: "", answer: "" })
                    }
                    className="text-[var(--primary)]"
                  >
                    + Add FAQ
                  </button>
                </label>
                <div className="space-y-4 max-h-64 overflow-y-auto custom-scrollbar pr-2">
                  {config.faqs.map((faq, index) => (
                    <div
                      key={index}
                      className="flex flex-col gap-2 p-4 bg-[var(--background)] border border-[var(--border-color)] rounded-xl relative group/faq"
                    >
                      <button
                        onClick={() => removeArrayItem(index, "faqs")}
                        className="absolute top-2 right-2 p-1 text-[var(--foreground-muted)] hover:text-red-400 bg-[var(--card-bg)] rounded opacity-0 group-hover/faq:opacity-100 transition-opacity"
                      >
                        ✕
                      </button>
                      <input
                        type="text"
                        value={faq.question}
                        onChange={(e) =>
                          handleFaqChange(index, "question", e.target.value)
                        }
                        placeholder="Question"
                        className="w-full bg-[var(--card-bg)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-sm font-semibold outline-none pr-8 focus:border-[var(--primary)]"
                      />
                      <textarea
                        value={faq.answer}
                        onChange={(e) =>
                          handleFaqChange(index, "answer", e.target.value)
                        }
                        placeholder="Answer"
                        rows="2"
                        className="w-full bg-[var(--card-bg)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-sm outline-none resize-none focus:border-[var(--primary)]"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="h-px w-full bg-[var(--border-color)] my-6"></div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold text-[var(--foreground-muted)] uppercase tracking-widest">
                  Booking Calendar Rules
                  <InfoTooltip text="Controls when the bot is allowed to flag a conversation as 'ready_to_book'." />
                </label>
                <select
                  name="bookingRule"
                  value={config.bookingRule}
                  onChange={handleInputChange}
                  className="w-full bg-[var(--background)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm outline-none appearance-none focus:border-[var(--primary)] cursor-pointer"
                >
                  <option value="require_all">
                    Require Phone & Email before booking
                  </option>
                  <option value="require_email">Require Email only</option>
                  <option value="book_direct">
                    Allow direct booking immediately
                  </option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold text-[var(--foreground-muted)] uppercase tracking-widest">
                  Escalation Behavior
                  <InfoTooltip text="What happens if the AI is asked something completely outside its knowledge base." />
                </label>
                <select
                  name="escalationRule"
                  value={config.escalationRule}
                  onChange={handleInputChange}
                  className="w-full bg-[var(--background)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm outline-none appearance-none focus:border-[var(--primary)] cursor-pointer"
                >
                  <option value="email_admin">
                    Take a message and email Admin
                  </option>
                  <option value="provide_phone">
                    Provide support phone number
                  </option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold text-[var(--foreground-muted)] uppercase tracking-widest">
                  After-Hours Behavior
                  <InfoTooltip text="How the AI handles inquiries outside of standard 9-5 business hours." />
                </label>
                <select
                  name="unavailableBehavior"
                  value={config.unavailableBehavior}
                  onChange={handleInputChange}
                  className="w-full bg-[var(--background)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm outline-none appearance-none focus:border-[var(--primary)] cursor-pointer"
                >
                  <option value="collect_lead">
                    Collect Email & Promise Next-Day Callback
                  </option>
                  <option value="standard">
                    Ignore hours and act normally
                  </option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TOAST SYSTEM */}
      <div
        className={`fixed bottom-6 right-6 z-[100] transition-all duration-500 ease-out ${toast.show ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0 pointer-events-none"}`}
      >
        <div className="app-toast border shadow-[0_10px_40px_rgba(0,0,0,0.3)] rounded-2xl p-4 pr-10 flex items-center gap-3 backdrop-blur-xl relative overflow-hidden">
          <div
            className={`w-1.5 h-full absolute left-0 top-0 ${toast.type === "error" ? "bg-red-500" : "bg-green-500"}`}
          ></div>
          <div>
            <p className="text-[10px] font-bold app-toast-label uppercase tracking-widest mb-0.5">
              System Notice
            </p>
            <p className="text-sm font-semibold">{toast.message}</p>
          </div>
        </div>
      </div>
    </main>
  );
}
