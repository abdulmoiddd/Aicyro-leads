import React, { useState, useEffect } from "react";

const features = [
  {
    id: 0,
    title: "Instant Response",
    subtitle: "Every visitor gets an immediate reply.",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M13 10V3L4 14h7v7l9-11h-7z"
        />
      </svg>
    ),
  },
  {
    id: 1,
    title: "Lead Capture",
    subtitle: "Capture names & phone numbers automatically.",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
        />
      </svg>
    ),
  },
  {
    id: 2,
    title: "Booking Flow",
    subtitle: "Guide customers toward appointments.",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    ),
  },
  {
    id: 3,
    title: "After-Hours",
    subtitle: "Capture leads even when you are closed.",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
        />
      </svg>
    ),
  },
];

export default function Solution() {
  const [activeTab, setActiveTab] = useState(0);
  const [progress, setProgress] = useState(0);

  // Auto-play logic
  useEffect(() => {
    const duration = 6000; // 6 seconds per tab
    const tickRate = 50;
    const increment = (tickRate / duration) * 100;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev + increment >= 100) {
          setActiveTab((current) =>
            current === features.length - 1 ? 0 : current + 1,
          );
          return 0;
        }
        return prev + increment;
      });
    }, tickRate);

    return () => clearInterval(interval);
  }, [activeTab]);

  // Handle manual tab click
  const handleTabClick = (index) => {
    setActiveTab(index);
    setProgress(0);
  };

  // The 4 interactive scenes rendered inside the main stage
  const renderScene = () => {
    switch (activeTab) {
      case 0:
        return (
          <div className="flex flex-col w-full max-w-lg mx-auto gap-4 p-6 bg-card border border-gridLine rounded-2xl shadow-2xl relative animate-in zoom-in-95 duration-500">
            <div className="absolute -top-4 -right-4 bg-background border border-gridLine rounded-full px-4 py-2 shadow-xl flex items-center gap-2 z-10">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-xs font-bold text-foreground font-mono">
                0.4s Avg Response
              </span>
            </div>
            <div className="self-end bg-background border border-gridLine text-foreground text-sm py-3 px-4 rounded-2xl rounded-tr-sm max-w-[80%] shadow-sm animate-[slide-up_0.5s_ease-out]">
              Do you offer emergency plumbing repair?
            </div>
            <div
              className="self-start text-sm py-3 px-4 rounded-2xl rounded-tl-sm max-w-[85%] text-white shadow-md animate-[slide-up_0.5s_ease-out_0.6s_both]"
              style={{
                background:
                  "linear-gradient(to right, var(--primary), var(--accent-blue))",
              }}
            >
              Yes, we have emergency crews available 24/7. What is your address?
            </div>
            <div className="self-end bg-background border border-gridLine text-foreground text-sm py-3 px-4 rounded-2xl rounded-tr-sm max-w-[80%] shadow-sm animate-[slide-up_0.5s_ease-out_1.8s_both]">
              123 Oak St. Please hurry!
            </div>
            <div className="self-start bg-card border border-gridLine text-foreground text-sm py-3 px-4 rounded-2xl rounded-tl-sm max-w-[85%] shadow-sm flex items-center gap-2 animate-[slide-up_0.5s_ease-out_2.4s_both]">
              <span className="w-1.5 h-1.5 rounded-full bg-muted animate-bounce"></span>
              <span
                className="w-1.5 h-1.5 rounded-full bg-muted animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></span>
              <span
                className="w-1.5 h-1.5 rounded-full bg-muted animate-bounce"
                style={{ animationDelay: "0.4s" }}
              ></span>
            </div>
          </div>
        );
      case 1:
        return (
          <div className="w-full h-full flex flex-col md:flex-row gap-6 p-4 animate-in fade-in duration-500">
            {/* Raw Chat */}
            <div className="flex-1 bg-background/50 border border-gridLine rounded-2xl p-5 flex flex-col justify-center gap-4">
              <p className="text-xs font-bold text-muted uppercase tracking-widest mb-2 border-b border-gridLine pb-2">
                Unstructured Chat
              </p>
              <p className="text-sm text-foreground leading-relaxed italic animate-[fade-in_0.5s_ease-out_0.2s_both]">
                "Hi, my name is{" "}
                <span className="bg-primary/20 text-primary px-1 rounded">
                  Sarah
                </span>
                . I need a quote for an{" "}
                <span className="bg-accent-blue/20 text-accent-blue px-1 rounded">
                  AC install
                </span>
                . Call me at{" "}
                <span className="bg-green-500/20 text-green-500 px-1 rounded">
                  555-0199
                </span>
                ."
              </p>
              <div className="mt-4 h-1 w-full bg-gradient-to-r from-transparent via-primary to-transparent opacity-50 relative overflow-hidden rounded-full">
                <div className="absolute inset-y-0 left-0 w-1/3 bg-white blur-sm animate-[fly-right_2s_ease-in-out_infinite]"></div>
              </div>
            </div>
            {/* Structured CRM Data */}
            <div className="flex-1 bg-card border border-gridLine rounded-2xl p-5 shadow-xl flex flex-col gap-4">
              <p className="text-xs font-bold text-muted uppercase tracking-widest mb-2 border-b border-gridLine pb-2 flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-primary"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
                Lead CRM
              </p>
              <div className="flex justify-between items-center bg-background p-3 rounded-lg border border-gridLine animate-[slide-up_0.5s_ease-out_1s_both]">
                <span className="text-xs text-muted font-bold">Name</span>
                <span className="text-sm font-mono text-foreground font-semibold">
                  Sarah
                </span>
              </div>
              <div className="flex justify-between items-center bg-background p-3 rounded-lg border border-gridLine animate-[slide-up_0.5s_ease-out_1.5s_both]">
                <span className="text-xs text-muted font-bold">Phone</span>
                <span className="text-sm font-mono text-foreground font-semibold">
                  555-0199
                </span>
              </div>
              <div className="flex justify-between items-center bg-background p-3 rounded-lg border border-gridLine animate-[slide-up_0.5s_ease-out_2s_both]">
                <span className="text-xs text-muted font-bold">Service</span>
                <span className="text-xs font-bold uppercase tracking-wider text-accent-blue bg-accent-blue/10 px-2 py-1 rounded">
                  AC Install
                </span>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="w-full max-w-lg mx-auto flex flex-col items-center justify-center p-6 animate-in zoom-in-95 duration-500">
            <div className="bg-card border border-gridLine rounded-3xl p-6 shadow-2xl w-full relative overflow-hidden">
              <div className="flex items-center justify-between mb-6">
                <h4 className="font-bold text-foreground">
                  Select a Date & Time
                </h4>
                <div className="flex gap-1">
                  <span className="w-2 h-2 rounded-full bg-gridLine"></span>
                  <span className="w-2 h-2 rounded-full bg-gridLine"></span>
                </div>
              </div>
              {/* Fake Calendar Grid */}
              <div className="grid grid-cols-5 gap-2 mb-6">
                {Array.from({ length: 15 }).map((_, i) => {
                  const isTarget = i === 12;
                  return (
                    <div
                      key={i}
                      className={`aspect-square rounded-xl flex items-center justify-center text-sm font-mono transition-all duration-500 ${isTarget ? "bg-primary text-white shadow-lg scale-110 animate-[pulse-glow_2s_ease-in-out_infinite_1s]" : "bg-background border border-gridLine text-muted"}`}
                    >
                      {i + 1}
                    </div>
                  );
                })}
              </div>
              {/* Time Slot Selection */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="p-3 text-center text-sm text-muted bg-background border border-gridLine rounded-xl">
                  09:00 AM
                </div>
                <div
                  className="p-3 text-center text-sm text-white font-bold rounded-xl shadow-md animate-[pop-in_0.5s_ease-out_2s_both]"
                  style={{ background: "var(--primary)" }}
                >
                  10:30 AM
                </div>
              </div>

              {/* Success Overlay */}
              <div className="absolute inset-0 bg-card/90 backdrop-blur-md flex flex-col items-center justify-center animate-[fade-in_0.5s_ease-out_3.5s_both]">
                <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-4 border border-green-500/40">
                  <svg
                    className="w-8 h-8 text-green-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="3"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-black text-foreground">
                  Meeting Booked!
                </h3>
                <p className="text-sm text-muted mt-1">Calendar synced.</p>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-[#060010] animate-in fade-in duration-700">
            {/* Night Sky Elements */}
            <div className="absolute top-1/4 left-1/4 w-1.5 h-1.5 bg-white rounded-full animate-pulse opacity-50"></div>
            <div
              className="absolute top-1/3 right-1/4 w-1 h-1 bg-white rounded-full animate-pulse opacity-30"
              style={{ animationDelay: "1s" }}
            ></div>
            <div
              className="absolute bottom-1/3 left-1/3 w-2 h-2 bg-white rounded-full animate-pulse opacity-20"
              style={{ animationDelay: "0.5s" }}
            ></div>

            {/* Large Clock */}
            <div className="flex flex-col items-center relative z-10 mb-12">
              <h2 className="text-6xl sm:text-8xl font-light text-white tracking-widest drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                03:14
              </h2>
              <p className="text-xl text-white/50 tracking-[0.3em] uppercase mt-2 font-medium">
                AM / Closed
              </p>
            </div>

            {/* The Bot Wakes Up */}
            <div className="absolute bottom-10 inset-x-6 sm:inset-x-auto sm:w-[400px] bg-primary/20 backdrop-blur-xl border border-primary/40 p-4 rounded-2xl shadow-[0_0_40px_rgba(138,43,226,0.3)] flex items-center gap-4 animate-[slide-up_0.5s_ease-out_1s_both]">
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-white text-xs font-bold uppercase">
                    AI
                  </span>
                </div>
                <span className="absolute -top-1 -right-1 flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500 border-2 border-[#060010]"></span>
                </span>
              </div>
              <div>
                <p className="text-sm font-bold text-white uppercase tracking-wider">
                  New Lead Captured
                </p>
                <p className="text-xs text-white/70 mt-1 line-clamp-1">
                  While you were sleeping, Sarah booked a slot.
                </p>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <section
      id="Solution"
      className="relative py-24 sm:py-32 overflow-hidden bg-background border-t border-gridLine transition-colors duration-300"
    >
      {/* Background Decor */}
      <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center overflow-hidden">
        <div
          className="absolute top-[20%] w-[600px] h-[600px] blur-[150px] rounded-full mix-blend-screen opacity-[0.12] transition-colors duration-1000"
          style={{ backgroundColor: "var(--primary)" }}
        ></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--grid-line)_1px,transparent_1px),linear-gradient(to_bottom,var(--grid-line)_1px,transparent_1px)] bg-[size:32px_32px] opacity-[0.25] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_40%,#000_30%,transparent_100%)]"></div>
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 flex flex-col items-center">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-card border border-gridLine mb-6 shadow-sm">
            <svg
              className="w-4 h-4 text-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            <span className="text-xs font-bold uppercase tracking-widest text-foreground">
              The Solution
            </span>
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight mb-6 leading-[1.05] text-foreground text-balance">
            A 24/7 AI front desk for{" "}
            <span
              className="text-transparent bg-clip-text bg-gradient-to-r from-primary"
              style={{ "--tw-gradient-to": "var(--accent-blue)" }}
            >
              your business.
            </span>
          </h2>

          <p className="text-lg sm:text-xl text-muted max-w-2xl mx-auto font-medium leading-relaxed text-balance">
            Aicyro engages visitors instantly, answers questions, captures lead
            details, and moves customers toward booking or calling.
          </p>
        </div>

        {/* Main Showcase Container */}
        <div className="w-full flex flex-col gap-6 lg:gap-8">
          {/* THE MAIN STAGE (Large Visual Area) */}
          <div className="w-full h-[400px] sm:h-[450px] bg-card/60 backdrop-blur-2xl border border-gridLine rounded-3xl sm:rounded-[2.5rem] shadow-2xl overflow-hidden relative flex items-center justify-center p-4 transition-colors duration-300">
            {/* Key ensures React completely re-renders and re-triggers CSS animations when tab changes */}
            <div
              key={activeTab}
              className="w-full h-full flex items-center justify-center relative z-10"
            >
              {renderScene()}
            </div>
            {/* Generic Stage Lighting */}
            <div className="absolute bottom-0 inset-x-0 h-1/2 bg-gradient-to-t from-primary/5 to-transparent pointer-events-none"></div>
          </div>

          {/* THE INTERACTIVE TABS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 w-full">
            {features.map((feature, index) => {
              const isActive = activeTab === index;
              return (
                <button
                  key={feature.id}
                  onClick={() => handleTabClick(index)}
                  className={`relative text-left p-4 sm:p-5 rounded-2xl border transition-all duration-300 flex flex-col gap-3 group overflow-hidden ${
                    isActive
                      ? "bg-card shadow-lg"
                      : "bg-background/50 border-gridLine hover:bg-card/50 hover:border-gridLine/80"
                  }`}
                  style={isActive ? { borderColor: "var(--primary)" } : {}}
                >
                  {/* Progress Bar Background for Active Tab */}
                  {isActive && (
                    <div
                      className="absolute inset-y-0 left-0 bg-primary/5 z-0 transition-all duration-[50ms] ease-linear"
                      style={{ width: `${progress}%` }}
                    ></div>
                  )}

                  <div className="relative z-10 flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 ${isActive ? "bg-primary text-white shadow-[0_0_15px_rgba(138,43,226,0.4)]" : "bg-muted/10 text-muted group-hover:text-foreground"}`}
                    >
                      {feature.icon}
                    </div>
                    <h3
                      className={`font-bold transition-colors duration-300 ${isActive ? "text-foreground" : "text-muted group-hover:text-foreground"}`}
                    >
                      {feature.title}
                    </h3>
                  </div>

                  <p className="relative z-10 text-sm text-muted font-medium line-clamp-2 pl-11">
                    {feature.subtitle}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Internal CSS for Custom Keyframe Animations */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes slide-up {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes pop-in {
          0% { opacity: 0; transform: scale(0.9); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes fade-in {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        @keyframes fly-right {
          0% { transform: translateX(-100%); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateX(300%); opacity: 0; }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(138, 43, 226, 0.4); }
          50% { box-shadow: 0 0 20px 10px rgba(138, 43, 226, 0); }
        }
      `,
        }}
      />
    </section>
  );
}
