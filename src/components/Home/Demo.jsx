import React, { useState, useEffect } from "react";

const steps = [
  {
    id: 1,
    title: "Visitor lands on your website",
    subtitle: "High intent traffic hits your landing page.",
  },
  {
    id: 2,
    title: "Aicyro responds instantly",
    subtitle: "Less than a second to say hello.",
  },
  {
    id: 3,
    title: "Customer explains what they need",
    subtitle: "Natural, conversational AI interaction.",
  },
  {
    id: 4,
    title: "Lead details are captured automatically",
    subtitle: "Name, phone, and intent extracted.",
  },
  {
    id: 5,
    title: "Customer is pushed to call or book",
    subtitle: "Seamless calendar or phone routing.",
  },
  {
    id: 6,
    title: "Your team receives the lead instantly",
    subtitle: "Live notifications to your phone/CRM.",
  },
];

export default function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0);
  const [progress, setProgress] = useState(0);

  // Auto-play Animation Loop
  useEffect(() => {
    const duration = 4000; // 4 seconds per step
    const tickRate = 50;
    const increment = (tickRate / duration) * 100;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev + increment >= 100) {
          setActiveStep((current) =>
            current === steps.length - 1 ? 0 : current + 1,
          );
          return 0;
        }
        return prev + increment;
      });
    }, tickRate);

    return () => clearInterval(interval);
  }, [activeStep]);

  // Handle manual click
  const handleStepClick = (index) => {
    setActiveStep(index);
    setProgress(0);
  };

  // Render the specific visual animation based on the active step
  const renderVisual = () => {
    switch (activeStep) {
      case 0: // Visitor lands
        return (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 sm:p-6 animate-in zoom-in-95 duration-500">
            <div className="w-full max-w-sm bg-background border border-gridLine rounded-t-xl overflow-hidden shadow-2xl relative h-[220px] sm:h-[250px]">
              <div className="h-8 bg-card border-b border-gridLine flex items-center px-3 gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/50"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/50"></div>
              </div>
              <div className="p-4 flex flex-col gap-4">
                <div className="w-1/2 h-4 bg-muted/20 rounded"></div>
                <div className="w-3/4 h-8 bg-foreground/10 rounded"></div>
                <div className="w-full h-24 bg-muted/10 rounded"></div>
              </div>
              <div className="absolute right-10 bottom-10 animate-[fly-cursor_2s_ease-out_forwards]">
                <svg
                  className="w-8 h-8 text-foreground drop-shadow-md"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M7 2l12 11.2-5.8.5 3.3 7.3-2.2 1-3.2-7.4-4.4 4.8z" />
                </svg>
              </div>
            </div>
          </div>
        );
      case 1: // Aicyro responds
        return (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 sm:p-6 animate-in fade-in duration-500">
            <div className="relative w-full max-w-sm h-[220px] sm:h-[250px]">
              <div className="absolute bottom-4 right-2 sm:right-4 bg-card border border-gridLine rounded-2xl p-4 shadow-2xl w-[240px] sm:w-[260px] animate-[slide-up-bounce_0.6s_ease-out_forwards] origin-bottom-right">
                <div className="flex items-center gap-3 mb-3 border-b border-gridLine pb-2">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                    <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                  </div>
                  <span className="text-sm font-bold text-foreground">
                    Aicyro
                  </span>
                </div>
                <div className="bg-primary/20 border border-primary/30 text-foreground text-xs py-2.5 px-3 rounded-2xl rounded-tl-sm w-[90%] animate-[fade-in_0.3s_ease-out_0.5s_both]">
                  Hi there! How can I help you today?
                </div>
              </div>
            </div>
          </div>
        );
      case 2: // Explains what they need
        return (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 sm:p-6 animate-in slide-in-from-right-8 duration-500">
            <div className="w-full max-w-sm bg-card border border-gridLine rounded-2xl p-3 sm:p-4 shadow-xl">
              <div className="flex flex-col gap-2 sm:gap-3">
                <div className="self-start bg-primary/20 border border-primary/30 text-foreground text-xs py-2.5 px-3 rounded-2xl rounded-tl-sm w-[80%] opacity-50">
                  Hi there! How can I help you today?
                </div>
                <div className="self-end bg-background border border-gridLine text-foreground text-xs py-2.5 px-3 rounded-2xl rounded-tr-sm w-[85%] shadow-sm animate-[slide-up-fade_0.4s_ease-out_0.2s_both]">
                  My heater just broke and it's freezing.
                </div>
                <div className="self-start bg-primary/20 border border-primary/30 text-foreground text-xs py-2.5 px-3 rounded-2xl rounded-tl-sm w-[90%] animate-[slide-up-fade_0.4s_ease-out_1.2s_both]">
                  I can get a tech out immediately. Are you a current customer?
                </div>
                <div className="self-end bg-background border border-gridLine text-foreground text-xs py-2.5 px-3 rounded-2xl rounded-tr-sm w-[60%] shadow-sm animate-[slide-up-fade_0.4s_ease-out_2s_both]">
                  No, first time.
                </div>
              </div>
            </div>
          </div>
        );
      case 3: // Lead details captured
        return (
          <div className="w-full h-full flex items-center justify-center p-4 sm:p-6 animate-in zoom-in-95 duration-500">
            <div className="w-full max-w-sm bg-background border border-primary/40 rounded-2xl p-4 sm:p-5 shadow-[0_0_40px_rgba(138,43,226,0.15)] relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent animate-[shimmer_2s_infinite]"></div>
              <h4 className="text-xs font-bold text-primary uppercase tracking-widest mb-4">
                Auto-Extracted Data
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center animate-[slide-left-fade_0.4s_ease-out_0.2s_both]">
                  <span className="text-xs text-muted">Intent</span>
                  <span className="text-xs sm:text-sm font-bold text-foreground bg-card px-2 py-1 rounded border border-gridLine">
                    Heater Repair
                  </span>
                </div>
                <div className="flex justify-between items-center animate-[slide-left-fade_0.4s_ease-out_0.6s_both]">
                  <span className="text-xs text-muted">Status</span>
                  <span className="text-xs sm:text-sm font-bold text-foreground bg-card px-2 py-1 rounded border border-gridLine">
                    New Customer
                  </span>
                </div>
                <div className="flex justify-between items-center animate-[slide-left-fade_0.4s_ease-out_1s_both]">
                  <span className="text-xs text-muted">Urgency</span>
                  <span className="text-[10px] sm:text-xs font-bold text-red-500 bg-red-500/10 px-2 py-1 rounded border border-red-500/20 uppercase tracking-wider">
                    High
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      case 4: // Pushed to call or book
        return (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 sm:p-6 animate-in slide-in-from-bottom-8 duration-500">
            <div className="w-full max-w-[240px] sm:max-w-[260px] bg-card border border-gridLine rounded-2xl shadow-xl overflow-hidden">
              <div className="p-3 bg-primary text-white text-center text-xs font-bold uppercase tracking-wider">
                Select Appointment
              </div>
              <div className="p-3 sm:p-4 grid grid-cols-2 gap-2">
                <div className="p-2 border border-gridLine rounded text-center text-xs text-muted">
                  Today 2PM
                </div>
                <div className="p-2 border border-gridLine rounded text-center text-xs text-muted">
                  Today 4PM
                </div>
                <div className="col-span-2 p-2 border-2 border-primary bg-primary/10 rounded text-center text-xs font-bold text-primary animate-pulse">
                  Emergency Dispatch
                </div>
              </div>
            </div>
          </div>
        );
      case 5: // Team receives lead instantly
        return (
          <div className="w-full h-full flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-700">
            <div className="w-[180px] sm:w-[200px] h-[320px] sm:h-[350px] border-[6px] border-gridLine rounded-[2rem] bg-background relative flex justify-center shadow-2xl">
              <div className="absolute top-0 w-20 sm:w-24 h-4 bg-gridLine rounded-b-xl"></div>
              <div className="absolute top-10 sm:top-12 inset-x-2 bg-card/90 backdrop-blur-md border border-primary/40 rounded-xl p-3 shadow-xl animate-[slide-down-bounce_0.6s_ease-out_0.3s_both]">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-4 h-4 rounded bg-primary flex items-center justify-center text-[8px] text-white font-bold">
                    AI
                  </span>
                  <span className="text-[9px] sm:text-[10px] text-muted font-bold uppercase">
                    New Lead
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs font-bold text-foreground">
                  Emergency Heater Repair
                </p>
                <p className="text-[9px] sm:text-[10px] text-muted mt-0.5">
                  Value: $450+
                </p>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const activeStepData = steps[activeStep];

  return (
    <section
      id="HowItWorks"
      className="relative py-20 sm:py-32 overflow-hidden bg-background transition-colors duration-300"
    >
      {/* Background Decor */}
      <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center overflow-hidden">
        <div
          className="absolute top-0 left-[-10%] w-[500px] h-[500px] blur-[150px] rounded-full mix-blend-screen opacity-[0.1] transition-colors duration-1000"
          style={{ backgroundColor: "var(--primary)" }}
        ></div>
        <div className="absolute inset-0 bg-[radial-gradient(var(--grid-line)_1px,transparent_1px)] bg-[size:32px_32px] opacity-[0.2] [mask-image:linear-gradient(to_bottom,black_20%,transparent_100%)]"></div>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header Section */}
        <div className="text-center mb-12 lg:mb-24">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-gridLine mb-6 shadow-sm">
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
                d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
              />
            </svg>
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-foreground">
              The Process
            </span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.05] text-foreground text-balance">
            How Aicyro{" "}
            <span
              className="text-transparent bg-clip-text bg-gradient-to-r from-primary"
              style={{ "--tw-gradient-to": "var(--accent-blue)" }}
            >
              works
            </span>
          </h2>
        </div>

        {/* The Hybrid Layout */}
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8 lg:gap-16 items-center lg:items-start">
          {/* ==============================================
              DESKTOP LEFT SIDE: The Steps List (Hidden on Mobile) 
          ============================================== */}
          <div className="hidden lg:flex lg:col-span-5 flex-col justify-center gap-2 w-full">
            {steps.map((step, index) => {
              const isActive = activeStep === index;
              return (
                <button
                  key={step.id}
                  onClick={() => handleStepClick(index)}
                  className={`relative text-left p-5 rounded-2xl transition-all duration-300 flex flex-col gap-1 overflow-hidden border ${
                    isActive
                      ? "bg-card shadow-lg translate-x-2"
                      : "bg-transparent border-transparent hover:bg-card/40 hover:border-gridLine/50"
                  }`}
                  style={isActive ? { borderColor: "var(--primary)" } : {}}
                >
                  {/* Progress Bar Background for Active Step */}
                  {isActive && (
                    <div
                      className="absolute inset-y-0 left-0 bg-primary/5 z-0 transition-all duration-[50ms] ease-linear"
                      style={{ width: `${progress}%` }}
                    ></div>
                  )}

                  <div className="relative z-10 flex items-center gap-4">
                    <div
                      className={`text-sm font-mono font-bold transition-colors duration-300 ${isActive ? "text-primary" : "text-muted"}`}
                    >
                      0{step.id}
                    </div>
                    <h3
                      className={`text-xl font-bold transition-colors duration-300 ${isActive ? "text-foreground" : "text-muted"}`}
                    >
                      {step.title}
                    </h3>
                  </div>

                  <div
                    className={`relative z-10 pl-9 transition-all duration-500 overflow-hidden ${isActive ? "max-h-20 opacity-100 mt-1" : "max-h-0 opacity-0 mt-0"}`}
                  >
                    <p className="text-sm text-muted font-medium">
                      {step.subtitle}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* ==============================================
              CENTER/TOP: The Visual Stage (Shared by both)
          ============================================== */}
          <div className="w-full lg:col-span-7 relative h-[380px] sm:h-[450px] lg:h-[600px] order-first lg:order-none max-w-2xl mx-auto">
            {/* The Glass Container */}
            <div className="absolute inset-0 bg-card/40 backdrop-blur-3xl border border-gridLine rounded-[2rem] sm:rounded-[3rem] shadow-2xl overflow-hidden flex items-center justify-center">
              <div
                key={activeStep}
                className="w-full h-full flex items-center justify-center relative z-10"
              >
                {renderVisual()}
              </div>

              {/* Ambient Stage Lighting */}
              <div
                className="absolute bottom-0 inset-x-0 h-1/2 opacity-20 pointer-events-none"
                style={{
                  backgroundImage:
                    "linear-gradient(to top, var(--primary), transparent)",
                }}
              ></div>
            </div>
          </div>

          {/* ==============================================
              MOBILE BOTTOM SIDE: The Story Carousel (Hidden on Desktop)
          ============================================== */}
          <div className="flex lg:hidden flex-col items-center gap-6 w-full max-w-sm mt-2">
            {/* Story Progress Dots */}
            <div className="flex items-center justify-between gap-2 w-full px-2">
              {steps.map((step, index) => {
                const isActive = activeStep === index;
                const isPassed = index < activeStep;
                return (
                  <button
                    key={step.id}
                    onClick={() => handleStepClick(index)}
                    className="relative h-1.5 sm:h-2 rounded-full overflow-hidden flex-1 bg-gridLine/50"
                  >
                    <div
                      className="absolute inset-y-0 left-0 bg-primary transition-all"
                      style={{
                        width: isActive
                          ? `${progress}%`
                          : isPassed
                            ? "100%"
                            : "0%",
                        transitionDuration: isActive ? "50ms" : "300ms",
                        transitionTimingFunction: "linear",
                      }}
                    />
                  </button>
                );
              })}
            </div>

            {/* Active Step Text (Fades in when step changes) */}
            <div
              key={activeStep}
              className="text-center px-2 min-h-[100px] flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-500"
            >
              <div className="text-xs font-mono font-bold text-primary mb-2 tracking-widest uppercase">
                Step 0{activeStepData.id}
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-2 leading-tight">
                {activeStepData.title}
              </h3>
              <p className="text-sm text-muted">{activeStepData.subtitle}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Internal CSS for Stage Animations */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes fly-cursor {
          0% { transform: translate(50px, 50px); opacity: 0; }
          40% { transform: translate(-30px, -40px); opacity: 1; }
          50% { transform: translate(-30px, -40px) scale(0.9); opacity: 1; }
          100% { transform: translate(-30px, -40px) scale(1); opacity: 1; }
        }
        @keyframes slide-up-bounce {
          0% { transform: translateY(40px) scale(0.8); opacity: 0; }
          60% { transform: translateY(-5px) scale(1.02); opacity: 1; }
          100% { transform: translateY(0) scale(1); opacity: 1; }
        }
        @keyframes slide-up-fade {
          0% { transform: translateY(15px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        @keyframes fade-in {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes slide-left-fade {
          0% { transform: translateX(20px); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }
        @keyframes slide-down-bounce {
          0% { transform: translateY(-30px); opacity: 0; }
          60% { transform: translateY(5px); opacity: 1; }
          100% { transform: translateY(0); opacity: 1; }
        }
      `,
        }}
      />
    </section>
  );
}
