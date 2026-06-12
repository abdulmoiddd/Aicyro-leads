"use client";

import { useState, useEffect } from "react";
import { db } from "../../../lib/firebase";
import { ref, set, get } from "firebase/database";

export default function ChatbotSettings({ onNavigate }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const [config, setConfig] = useState({
    botName: "Aicyro Front Desk",
    launcherText: "Chat with us",
    themeColor: "#10b981",
    greetingMessage: "Hi! I'm Aicyro's AI Assistant. How can I help you today?",

    botIdentity: "the 'AI Front Desk' for Aicyro",
    companyContext:
      "We provide automated AI business systems and digital products.",
    customRules: "Never mention competitors. Keep answers extremely brief.",
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

  const handleInputChange = (e) =>
    setConfig((prev) => ({ ...prev, [e.target.name]: e.target.value }));

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
          className="flex items-center gap-2 px-6 py-3 bg-[var(--primary)] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-[0_0_15px_var(--lead-glow)] transition-all disabled:opacity-50"
        >
          {isSaving ? "Saving..." : "Save AI Rules"}
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 pb-10">
        {/* === LEFT COLUMN === */}
        <div className="flex flex-col gap-8">
          <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl p-6 md:p-8 shadow-sm">
            <h2 className="text-lg font-bold text-[var(--foreground)] tracking-tight border-b border-[var(--border-color)] pb-4 mb-6">
              Display & Branding
            </h2>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-[var(--foreground-muted)] uppercase tracking-widest">
                    Chatbot Name
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
                  </label>
                  <input
                    name="launcherText"
                    value={config.launcherText}
                    onChange={handleInputChange}
                    className="w-full bg-[var(--background)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm focus:border-[var(--primary)] outline-none"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-[var(--foreground-muted)] uppercase tracking-widest">
                  Initial Greeting Message
                </label>
                <textarea
                  name="greetingMessage"
                  value={config.greetingMessage}
                  onChange={handleInputChange}
                  rows="2"
                  className="w-full bg-[var(--background)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm focus:border-[var(--primary)] outline-none resize-none"
                />
              </div>
              {/* <div className="space-y-2 border-t border-[var(--border-color)] pt-4">
                <label className="text-[11px] font-bold text-[var(--foreground-muted)] uppercase tracking-widest">
                  Theme Accent Color
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="color"
                    name="themeColor"
                    value={config.themeColor}
                    onChange={handleInputChange}
                    className="w-12 h-12 rounded cursor-pointer bg-transparent border-0 p-0"
                  />
                  <span className="text-sm font-mono text-[var(--foreground-muted)] px-3 py-2 bg-[var(--background)] border border-[var(--border-color)] rounded-lg">
                    {config.themeColor.toUpperCase()}
                  </span>
                </div>
              </div> */}
            </div>
          </div>

          <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl p-6 md:p-8 shadow-sm">
            <h2 className="text-lg font-bold text-[var(--foreground)] tracking-tight border-b border-[var(--border-color)] pb-4 mb-6">
              Prompt Engineering
            </h2>
            <div className="space-y-6">
              {/* NEW BASE PROMPT FIELD */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-[var(--foreground-muted)] uppercase tracking-widest">
                  Core System Prompt Override
                </label>
                <textarea
                  name="basePrompt"
                  value={config.basePrompt}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full bg-[var(--background)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm focus:border-[var(--primary)] outline-none resize-none"
                />
              </div>

              {/* NEW DYNAMIC LEAD FIELDS */}
              <div className="space-y-3 pt-4 border-t border-[var(--border-color)]">
                <label className="text-[11px] font-bold text-[var(--foreground-muted)] uppercase tracking-widest flex justify-between items-center">
                  Mandatory Lead Fields{" "}
                  <button
                    onClick={() => addArrayItem("leadCaptureFields")}
                    className="text-[var(--primary)]"
                  >
                    + Add Field
                  </button>
                </label>
                <p className="text-[10px] text-[var(--foreground-muted)]">
                  The AI will collect these fields in this exact sequence.
                </p>
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
                        className="px-3 text-[var(--foreground-muted)] hover:text-red-400 bg-[var(--background)] border border-[var(--border-color)] rounded-lg"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2 pt-4 border-t border-[var(--border-color)]">
                <label className="text-[11px] font-bold text-[var(--foreground-muted)] uppercase tracking-widest">
                  Bot Identity / Role
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
                </label>
                <textarea
                  name="companyContext"
                  value={config.companyContext}
                  onChange={handleInputChange}
                  rows="2"
                  className="w-full bg-[var(--background)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm focus:border-[var(--primary)] outline-none resize-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-[var(--foreground-muted)] uppercase tracking-widest">
                  Custom Behavioral Rules
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
                  Bot Tone
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

        {/* === RIGHT COLUMN === */}
        <div className="flex flex-col gap-8">
          <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl p-6 md:p-8 shadow-sm">
            <h2 className="text-lg font-bold text-[var(--foreground)] tracking-tight border-b border-[var(--border-color)] pb-4 mb-6">
              Knowledge Base
            </h2>
            <div className="space-y-3 mb-8">
              <label className="text-[11px] font-bold text-[var(--foreground-muted)] uppercase tracking-widest flex justify-between items-center">
                Services Offered{" "}
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
                      className="px-3 text-[var(--foreground-muted)] hover:text-red-400 bg-[var(--background)] border border-[var(--border-color)] rounded-lg"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3 border-t border-[var(--border-color)] pt-6">
              <label className="text-[11px] font-bold text-[var(--foreground-muted)] uppercase tracking-widest flex justify-between items-center">
                FAQs{" "}
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
                    className="flex flex-col gap-2 p-4 bg-[var(--background)] border border-[var(--border-color)] rounded-xl relative group"
                  >
                    <button
                      onClick={() => removeArrayItem(index, "faqs")}
                      className="absolute top-2 right-2 p-1 text-[var(--foreground-muted)] hover:text-red-400 bg-[var(--card-bg)] rounded opacity-0 group-hover:opacity-100"
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
          </div>

          <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl p-6 md:p-8 shadow-sm">
            <h2 className="text-lg font-bold text-[var(--foreground)] tracking-tight border-b border-[var(--border-color)] pb-4 mb-6">
              Operational Rules
            </h2>
            <div className="space-y-8">
              <div className="space-y-3">
                <label className="text-[11px] font-bold text-[var(--foreground-muted)] uppercase tracking-widest flex justify-between items-center">
                  Qualification Questions{" "}
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
                        className="px-3 text-[var(--foreground-muted)] hover:text-red-400 bg-[var(--background)] border border-[var(--border-color)] rounded-lg"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="h-px w-full bg-[var(--border-color)]"></div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold text-[var(--foreground-muted)] uppercase tracking-widest">
                  Booking Calendar Rules
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

      <div
        className={`fixed bottom-6 right-6 z-[100] transition-all duration-500 ease-out ${toast.show ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0 pointer-events-none"}`}
      >
        <div className="bg-[var(--card-bg)] border border-[var(--border-color)] shadow-[0_10px_40px_rgba(0,0,0,0.3)] rounded-2xl p-4 pr-10 flex items-center gap-3 backdrop-blur-xl">
          <div
            className={`w-1.5 h-full absolute left-0 top-0 ${toast.type === "error" ? "bg-red-500" : "bg-green-500"}`}
          ></div>
          <div>
            <p className="text-[10px] font-bold text-[var(--foreground-muted)] uppercase tracking-widest mb-0.5">
              System Notice
            </p>
            <p className="text-sm font-semibold">{toast.message}</p>
          </div>
        </div>
      </div>
    </main>
  );
}
