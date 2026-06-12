import React from "react";

export default function Positioning() {
  return (
    <section
      id="Positioning"
      className="relative py-20 sm:py-32 overflow-hidden bg-background border-t border-gridLine transition-colors duration-300"
    >
      {/* =========================================
          BACKGROUND EFFECTS
      ========================================= */}
      <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center overflow-hidden">
        {/* Core Engine Glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] sm:w-[800px] h-[500px] sm:h-[800px] blur-[150px] sm:blur-[200px] rounded-full mix-blend-screen opacity-[0.1] transition-colors duration-1000"
          style={{ backgroundColor: "var(--primary)" }}
        ></div>
        {/* Matrix Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--grid-line)_1px,transparent_1px),linear-gradient(to_bottom,var(--grid-line)_1px,transparent_1px)] bg-[size:48px_48px] opacity-[0.15] [mask-image:radial-gradient(ellipse_70%_50%_at_50%_50%,#000_30%,transparent_100%)]"></div>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 flex flex-col items-center">
        {/* =========================================
            CINEMATIC TYPOGRAPHY
        ========================================= */}
        <div className="text-center mb-16 sm:mb-24 flex flex-col items-center">
          {/* Subtle label to frame the statement */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gridLine mb-6 sm:mb-8 shadow-sm bg-card/50 backdrop-blur-sm">
            <svg
              className="w-4 h-4 text-primary animate-pulse"
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
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-foreground">
              The Architecture
            </span>
          </div>

          <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-black tracking-tighter mb-6 sm:mb-8 leading-[1.1] sm:leading-[1] text-foreground text-balance">
            This is not just a <br className="hidden md:block" />
            <span className="relative inline-block mt-2 md:mt-0">
              <span className="absolute z-20 top-1/2 left-[-5%] right-[-5%] h-1.5 sm:h-2 bg-red-500 -translate-y-1/2 rounded-full shadow-[0_0_15px_rgba(239,68,68,0.5)] -rotate-2 animate-[strike_1s_ease-out_1s_both]"></span>
              <span
                className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-primary"
                style={{ "--tw-gradient-to": "var(--accent-blue)" }}
              >
                chatbot.
              </span>
            </span>
          </h2>

          <p className="text-lg sm:text-xl md:text-2xl text-muted max-w-3xl font-medium leading-relaxed text-balance px-2">
            Aicyro is a lead capture and conversion system designed to help
            businesses stop losing ready-to-buy customers.
          </p>
        </div>

        {/* =========================================
            THE SYSTEM VISUALIZATION (Data Pipeline)
        ========================================= */}
        {/* Changed from fixed h-[400px] to min-h for vertical mobile stacking */}
        <div className="w-full relative min-h-[450px] py-8 flex flex-col md:flex-row items-center justify-center">
          {/* Connection Lines (Background - Desktop Only) */}
          <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none hidden md:flex">
            <div className="w-1/3 h-0.5 bg-gradient-to-r from-transparent to-gridLine relative overflow-hidden">
              <div className="absolute top-0 left-0 h-full w-1/2 bg-gradient-to-r from-transparent via-muted to-transparent animate-[flow-right_2s_linear_infinite]"></div>
            </div>
            <div className="w-64 h-2"></div>
            <div className="w-1/3 h-0.5 bg-gradient-to-r from-gridLine to-transparent relative overflow-hidden">
              <div className="absolute top-0 left-0 h-full w-1/2 bg-gradient-to-r from-transparent via-primary to-transparent animate-[flow-right_2s_linear_infinite]"></div>
            </div>
          </div>

          <div className="w-full max-w-4xl flex flex-col md:flex-row items-center justify-between gap-12 md:gap-4 relative z-10">
            {/* LEFT NODE: The Problem (Anonymous Traffic) */}
            {/* Desktop View */}
            <div className="hidden md:flex flex-col items-center w-1/4 animate-in fade-in slide-in-from-left-8 duration-700">
              <div className="w-16 h-16 rounded-2xl bg-card border border-gridLine flex items-center justify-center mb-4 shadow-lg relative">
                <svg
                  className="w-6 h-6 text-muted"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-3 h-3 bg-muted rounded-full animate-ping"></div>
              </div>
              <h3 className="text-sm font-bold text-foreground uppercase tracking-widest text-center">
                Anonymous Traffic
              </h3>
              <p className="text-xs text-muted text-center mt-2">
                High intent, high risk of bouncing.
              </p>
            </div>

            {/* Mobile View - Top Card */}
            <div className="flex md:hidden w-full max-w-xs bg-card/60 border border-gridLine rounded-xl p-4 items-center gap-4 shadow-sm z-10">
              <div className="w-10 h-10 rounded-full bg-muted/20 flex items-center justify-center text-muted shrink-0">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm font-bold">Raw Traffic In</p>
                <p className="text-[10px] text-muted">High risk of bouncing</p>
              </div>
            </div>

            {/* Mobile Connecting Line (Down) */}
            <div className="md:hidden h-8 w-0.5 bg-gradient-to-b from-gridLine to-transparent -my-6 z-0"></div>

            {/* CENTER NODE: The Aicyro Engine */}
            <div className="relative flex flex-col items-center justify-center animate-in zoom-in-95 duration-700 delay-100 my-4 md:my-0">
              {/* Orbital Rings */}
              <div className="absolute inset-[-30px] sm:inset-[-40px] border border-gridLine rounded-full animate-[spin_10s_linear_infinite]">
                <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-primary shadow-[0_0_10px_rgba(138,43,226,0.6)]"></div>
              </div>
              <div className="absolute inset-[-60px] sm:inset-[-80px] border border-gridLine border-dashed rounded-full animate-[spin_15s_linear_infinite_reverse]">
                <div
                  className="absolute bottom-4 sm:bottom-6 left-2 w-2 h-2 rounded-full"
                  style={{ backgroundColor: "var(--accent-blue)" }}
                ></div>
              </div>

              {/* The Core */}
              <div className="w-28 h-28 sm:w-40 sm:h-40 rounded-3xl sm:rounded-[2.5rem] bg-card/80 backdrop-blur-2xl border border-gridLine flex flex-col items-center justify-center shadow-[0_0_50px_rgba(138,43,226,0.15)] relative overflow-hidden group">
                <div
                  className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity duration-500"
                  style={{
                    background:
                      "radial-gradient(circle at center, var(--primary) 0%, transparent 70%)",
                  }}
                ></div>

                <div
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mb-2 sm:mb-3 relative z-10"
                  style={{
                    background:
                      "linear-gradient(135deg, var(--primary), var(--accent-blue))",
                  }}
                >
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <span className="text-xs sm:text-sm font-black text-foreground uppercase tracking-[0.2em] relative z-10">
                  Core
                </span>
              </div>

              {/* Engine processing tags - Repositioned for mobile safety */}
              <div className="absolute -top-8 -right-4 sm:-top-12 sm:-right-8 bg-card border border-gridLine px-3 py-1 rounded-full text-[9px] sm:text-[10px] font-bold text-foreground shadow-lg animate-[float_3s_ease-in-out_infinite]">
                Qualifying...
              </div>
              <div className="absolute -bottom-6 -left-4 sm:-bottom-8 sm:-left-12 bg-card border border-gridLine px-3 py-1 rounded-full text-[9px] sm:text-[10px] font-bold text-foreground shadow-lg animate-[float_4s_ease-in-out_infinite_1s]">
                Extracting Info...
              </div>
            </div>

            {/* Mobile Connecting Line (Down) */}
            <div className="md:hidden h-8 w-0.5 bg-gradient-to-t from-primary/50 to-transparent -my-6 z-0"></div>

            {/* RIGHT NODE: The Solution (Captured Leads) */}
            {/* Desktop View */}
            <div className="hidden md:flex flex-col items-center w-1/4 animate-in fade-in slide-in-from-right-8 duration-700 delay-200">
              <div
                className="w-16 h-16 rounded-2xl bg-card border border-gridLine flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(138,43,226,0.1)] relative"
                style={{ borderColor: "var(--primary)" }}
              >
                <svg
                  className="w-6 h-6"
                  style={{ color: "var(--primary)" }}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
                <div
                  className="absolute -left-2 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full animate-ping"
                  style={{ backgroundColor: "var(--primary)" }}
                ></div>
              </div>
              <h3 className="text-sm font-bold text-foreground uppercase tracking-widest text-center">
                Ready-to-Buy Leads
              </h3>
              <p className="text-xs text-muted text-center mt-2">
                Captured, routed, and ready to close.
              </p>
            </div>

            {/* Mobile View - Bottom Card */}
            <div className="flex md:hidden w-full max-w-xs bg-primary/10 border border-primary/30 rounded-xl p-4 items-center gap-4 shadow-md z-10">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white shrink-0 shadow-[0_0_15px_rgba(138,43,226,0.4)]">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">
                  Qualified Leads Out
                </p>
                <p className="text-[10px] text-muted">Ready to close</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Internal CSS for Custom Animations */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes flow-right {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        @keyframes strike {
          0% { width: 0; opacity: 0; }
          50% { width: 110%; opacity: 1; }
          100% { width: 110%; opacity: 0.8; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
      `,
        }}
      />
    </section>
  );
}
