import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";

// The simulated conversation script
const chatSequence = [
  {
    id: 1,
    type: "user",
    text: "Do you have anyone available for an electrical issue?",
    delay: 1000,
  },
  {
    id: 2,
    type: "ai",
    text: "Yes, we have a technician in your area. Is this an emergency?",
    delay: 1500,
  },
  {
    id: 3,
    type: "user",
    text: "Yes, half my house just lost power.",
    delay: 1200,
  },
  {
    id: 4,
    type: "ai",
    text: "I'm dispatching a priority unit now. ETA is 20 minutes.",
    delay: 1800,
  },
  { id: 5, type: "action", text: "Priority Dispatch Secured", delay: 800 },
];

export default function Hero() {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [step, setStep] = useState(0);
  const [showBookingPopup, setShowBookingPopup] = useState(false);
  const chatContainerRef = useRef(null);

  // Smoothly auto-scroll chat to bottom
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, isTyping]);

  // Handle the live chat sequence and popup timing
  useEffect(() => {
    let timeoutId;

    if (step === 0) {
      setShowBookingPopup(false);
    }

    if (step < chatSequence.length) {
      const nextMessage = chatSequence[step];

      if (nextMessage.type === "ai") {
        // Show typing indicator smoothly
        setIsTyping(true);
        timeoutId = setTimeout(() => {
          setIsTyping(false);
          // Small staggered delay before message pops in
          setTimeout(() => {
            setMessages((prev) => [...prev, nextMessage]);
            setStep((prev) => prev + 1);
          }, 150);
        }, nextMessage.delay);
      } else {
        timeoutId = setTimeout(() => {
          setMessages((prev) => [...prev, nextMessage]);
          setStep((prev) => prev + 1);
        }, nextMessage.delay);
      }
    } else {
      setShowBookingPopup(true);
      timeoutId = setTimeout(() => {
        setMessages([]);
        setStep(0);
      }, 4500);
    }

    return () => clearTimeout(timeoutId);
  }, [step]);

  const industries = [
    "Plumbing",
    "HVAC",
    "Wellness",
    "Fitness",
    "Recovery",
    "Electrical",
    "Pest Control",
    "Restoration",
  ];

  return (
    <section className="relative min-h-[100svh] flex flex-col items-center justify-center px-4 sm:px-6 pt-24 sm:pt-28 pb-16 sm:pb-20 overflow-hidden bg-background text-foreground transition-colors duration-300">
      {/* =========================================
          BACKGROUND EFFECTS (DEEP GLOW)
      ========================================= */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none flex items-center justify-center">
        <div className="absolute top-1/4 right-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-primary/20 blur-[100px] md:blur-[150px] rounded-full mix-blend-screen transition-opacity duration-1000"></div>
        <div
          className="absolute bottom-0 left-0 md:left-1/4 w-[400px] md:w-[600px] h-[400px] md:h-[600px] blur-[100px] md:blur-[120px] rounded-full mix-blend-screen transition-opacity duration-1000 opacity-10"
          style={{ backgroundColor: "var(--accent-blue)" }}
        ></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--grid-line)_1px,transparent_1px),linear-gradient(to_bottom,var(--grid-line)_1px,transparent_1px)] bg-[size:30px_30px] md:bg-[size:40px_40px] opacity-[0.3] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_20%,transparent_100%)]"></div>
      </div>

      {/* =========================================
          MAIN HERO CONTENT (TWO-COLUMN)
      ========================================= */}
      <div className="relative z-10 w-full max-w-7xl mx-auto grid lg:grid-cols-12 gap-10 lg:gap-8 items-center mt-4">
        {/* Left Column: Copy & Actions */}
        <div className="lg:col-span-5 flex flex-col items-center lg:items-start text-center lg:text-left z-20">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-muted/10 border border-gridLine mb-4 sm:mb-6 hover:bg-muted/20 transition-colors duration-300">
            <span
              className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full animate-pulse"
              style={{ backgroundColor: "var(--accent-blue)" }}
            ></span>
            <span className="text-[10px] sm:text-xs font-mono text-muted uppercase tracking-wider">
              Aicyro Engine v2.0
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.5rem] font-black tracking-tighter mb-4 sm:mb-6 leading-[1.05] text-foreground text-balance">
            Never lose a <br className="hidden lg:block" /> website{" "}
            <span
              className="text-transparent bg-clip-text bg-gradient-to-br from-primary"
              style={{ "--tw-gradient-to": "var(--accent-blue)" }}
            >
              lead again.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-muted max-w-xl font-medium mb-8 sm:mb-10 leading-relaxed text-balance px-2 sm:px-0">
            Aicyro responds to visitors instantly, qualifies every inquiry, and
            pushes customers to call or book —{" "}
            <span className="text-foreground font-bold border-b border-primary/50">
              before they leave your site.
            </span>
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto px-4 sm:px-0">
            <Link
              href="#demo"
              className="relative flex items-center justify-center w-full sm:w-auto px-6 py-3.5 sm:px-8 sm:py-4 bg-foreground text-background hover:scale-105 font-black rounded-xl transition-all duration-300 ease-out text-base sm:text-lg shadow-xl hover:shadow-2xl"
            >
              Watch Live Demo
            </Link>
            <Link
              href="#how-it-works"
              className="flex items-center justify-center w-full sm:w-auto px-6 py-3.5 sm:px-8 sm:py-4 bg-transparent hover:bg-card/60 text-foreground font-bold rounded-xl border border-gridLine hover:border-primary/50 transition-colors duration-300 text-base sm:text-lg"
            >
              See How It Works
            </Link>
          </div>
        </div>

        {/* Right Column: Visual Stage (Flat on mobile, Isometric on desktop) */}
        <div className="lg:col-span-7 relative w-full h-[450px] sm:h-[500px] lg:h-[650px] flex items-center justify-center perspective-[1000px] lg:perspective-[1200px] mt-4 lg:mt-0">
          {/* 3D Wrapper - Flattens on Mobile */}
          <div className="relative w-full max-w-[340px] sm:max-w-[400px] lg:max-w-[450px] h-[400px] sm:h-[450px] lg:h-[550px] transition-transform duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)] lg:[transform-style:preserve-3d] hover:scale-[1.02] lg:hover:[transform:rotateY(-12deg)_rotateX(4deg)_scale(1.02)] lg:[transform:rotateY(-20deg)_rotateX(8deg)_scale(0.96)]">
            {/* The Main Chat Interface */}
            <div className="absolute inset-0 bg-card/90 backdrop-blur-3xl border border-gridLine rounded-3xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3),_inset_0_1px_0_rgba(255,255,255,0.05)] lg:shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3),_inset_0_1px_0_rgba(255,255,255,0.05)] flex flex-col overflow-hidden transition-colors duration-300">
              {/* Header */}
              <div className="bg-gradient-to-r from-primary/10 to-transparent border-b border-gridLine p-4 sm:p-5 flex items-center gap-3 sm:gap-4">
                <div
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-primary p-[1px] shadow-lg shrink-0"
                  style={{ "--tw-gradient-to": "var(--accent-blue)" }}
                >
                  <div className="w-full h-full bg-card rounded-[15px] flex items-center justify-center transition-colors duration-300">
                    <div className="w-3 h-3 sm:w-4 sm:h-4 bg-foreground rounded-full shadow-[0_0_15px_rgba(138,43,226,0.5)]"></div>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-foreground tracking-wide">
                    Aicyro Intelligence
                  </h3>
                  <div className="flex items-center gap-2 mt-0.5 sm:mt-1">
                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full animate-pulse"></span>
                    <span className="text-[10px] sm:text-xs text-muted font-medium">
                      Monitoring site traffic...
                    </span>
                  </div>
                </div>
              </div>

              {/* Chat Body */}
              <div
                ref={chatContainerRef}
                className="flex-1 p-4 sm:p-5 overflow-y-auto flex flex-col gap-3 sm:gap-4 hide-scrollbar"
              >
                {messages.map((msg) => {
                  if (msg.type === "action") {
                    return (
                      <div
                        key={msg.id}
                        className="self-center my-1 sm:my-2 bg-green-500/10 border border-green-500/20 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg flex items-center gap-2 animate-pop-in"
                      >
                        <svg
                          className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span className="text-[10px] sm:text-xs font-bold text-green-500 uppercase tracking-widest">
                          {msg.text}
                        </span>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={msg.id}
                      className={`max-w-[85%] text-xs sm:text-sm py-2.5 px-3 sm:py-3 sm:px-4 shadow-sm animate-pop-in origin-bottom transition-colors duration-300 ${
                        msg.type === "user"
                          ? "self-end bg-background text-foreground border border-gridLine rounded-2xl rounded-tr-sm origin-bottom-right"
                          : "self-start bg-primary/10 border border-primary/20 text-foreground rounded-2xl rounded-tl-sm origin-bottom-left"
                      }`}
                    >
                      {msg.text}
                    </div>
                  );
                })}

                {/* Smooth Pop-in Typing Indicator */}
                {isTyping && (
                  <div className="self-start bg-background/80 border border-gridLine py-2.5 px-3 sm:py-3 sm:px-4 rounded-2xl rounded-tl-sm flex items-center gap-1.5 w-12 sm:w-16 animate-pop-in origin-bottom-left transition-colors duration-300">
                    <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-muted rounded-full animate-[pulse_1s_ease-in-out_infinite]"></span>
                    <span
                      className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-muted rounded-full animate-[pulse_1s_ease-in-out_infinite]"
                      style={{ animationDelay: "0.2s" }}
                    ></span>
                    <span
                      className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-muted rounded-full animate-[pulse_1s_ease-in-out_infinite]"
                      style={{ animationDelay: "0.4s" }}
                    ></span>
                  </div>
                )}
              </div>
            </div>

            {/* Floating Element 1: "Response Time" - Scaled for Mobile */}
            <div className="absolute -left-4 sm:-left-6 lg:-left-12 top-6 sm:top-10 lg:top-20 z-30 bg-card/95 backdrop-blur-md border border-gridLine p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-xl lg:[transform:translateZ(60px)] animate-[float_6s_ease-in-out_infinite] transition-colors duration-300 scale-90 sm:scale-100 origin-top-left">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 text-primary"
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
                </div>
                <div>
                  <p className="text-muted text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                    Avg Response
                  </p>
                  <p className="text-foreground text-sm sm:text-lg font-black whitespace-nowrap">
                    &lt; 1 Second
                  </p>
                </div>
              </div>
            </div>

            {/* Floating Element 2: "Meeting Booked" - Scaled for Mobile */}
            <div
              className={`absolute -right-4 sm:-right-6 lg:-right-16 bottom-16 sm:bottom-20 lg:bottom-24 bg-card/95 backdrop-blur-xl border border-green-500/40 p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-xl lg:[transform:translateZ(90px)] transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] z-30 scale-90 sm:scale-100 origin-bottom-right ${
                showBookingPopup
                  ? "opacity-100 translate-y-0 scale-[0.9] sm:scale-100 animate-[float_7s_ease-in-out_infinite_0.5s]"
                  : "opacity-0 translate-y-12 scale-[0.8] sm:scale-90 pointer-events-none"
              }`}
            >
              <div className="flex items-start gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 text-green-500"
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
                <div>
                  <p className="text-foreground font-bold text-xs sm:text-sm whitespace-nowrap">
                    Meeting Booked
                  </p>
                  <p className="text-muted text-[10px] sm:text-xs mt-0.5">
                    Added to Calendar
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================
          TRUST BAR (INDUSTRIES)
      ========================================= */}
      <div className="relative z-10 w-full max-w-6xl mx-auto mt-12 sm:mt-16 lg:mt-8 flex flex-col items-center">
        <p className="text-[10px] sm:text-xs text-muted font-mono mb-4 sm:mb-6 uppercase tracking-[0.2em] text-center opacity-70 px-4">
          Engineered for local service providers
        </p>

        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 w-full max-w-3xl lg:max-w-full">
          {industries.map((industry) => (
            <div
              key={industry}
              className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-muted/5 border border-gridLine text-xs sm:text-sm font-semibold text-foreground/80 hover:text-foreground hover:bg-muted/10 transition-colors cursor-default"
            >
              {industry}
            </div>
          ))}
        </div>
      </div>

      {/* Custom Keyframes & Utilities for Smoothness */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @keyframes float {
          0%, 100% { transform: translateZ(60px) translateY(0px); }
          50% { transform: translateZ(60px) translateY(-12px); }
        }
        
        /* The Springy Pop-in Animation */
        @keyframes pop-in {
          0% { 
            opacity: 0; 
            transform: scale(0.8) translateY(15px); 
          }
          60% { 
            transform: scale(1.02) translateY(-2px); 
          }
          100% { 
            opacity: 1; 
            transform: scale(1) translateY(0); 
          }
        }
        .animate-pop-in {
          animation: pop-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
      `,
        }}
      />
    </section>
  );
}
