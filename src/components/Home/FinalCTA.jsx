import React, { useState, useEffect } from "react";
import Link from "next/link";

// Mock data for the live feed
const leadTypes = [
  "Emergency AC Repair",
  "Plumbing Consultation",
  "Electrical Quote",
  "Water Heater Install",
  "General Maintenance",
  "Pest Control Request",
];

export default function FinalCTA() {
  const [liveLeads, setLiveLeads] = useState([]);
  const [secondsSinceLastLead, setSecondsSinceLastLead] = useState(0);

  // 1. Timer for "Time Since Last Lead"
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsSinceLastLead((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 2. Generator for the floating lead notifications
  useEffect(() => {
    let idCounter = 0;

    const generateLead = () => {
      const isBooking = Math.random() > 0.6;
      const newLead = {
        id: idCounter++,
        text: leadTypes[Math.floor(Math.random() * leadTypes.length)],
        type: isBooking ? "booking" : "lead",
        // Random starting position across the width (10% to 90%)
        left: `${Math.floor(Math.random() * 80) + 10}%`,
        // Random scale for depth effect
        scale: Math.random() * 0.4 + 0.8,
      };

      setLiveLeads((prev) => [...prev.slice(-10), newLead]); // Keep max 10 on screen
      setSecondsSinceLastLead(0); // Reset the timer!

      // Schedule the next lead (randomly between 2s and 6s)
      const nextDelay = Math.floor(Math.random() * 4000) + 2000;
      setTimeout(generateLead, nextDelay);
    };

    // Start the first generation after 1s
    const initialTimeout = setTimeout(generateLead, 1000);

    return () => clearTimeout(initialTimeout);
  }, []);

  return (
    <section
      id="FinalCTA"
      className="relative py-24 sm:py-40 overflow-hidden bg-background border-t border-gridLine transition-colors duration-300 flex items-center justify-center"
    >
      {/* =========================================
          BACKGROUND: THE LIVE STREAM & GRID
      ========================================= */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none flex items-center justify-center">
        {/* Core Glowing Orb */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] blur-[150px] rounded-full mix-blend-screen opacity-[0.12] transition-colors duration-1000"
          style={{ backgroundColor: "var(--primary)" }}
        ></div>

        {/* Minimal Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--grid-line)_1px,transparent_1px),linear-gradient(to_bottom,var(--grid-line)_1px,transparent_1px)] bg-[size:32px_32px] opacity-[0.2] [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,#000_20%,transparent_100%)]"></div>

        {/* The Floating Live Leads (Behind the glass) */}
        {liveLeads.map((lead) => (
          <div
            key={lead.id}
            className="absolute -bottom-20 flex items-center gap-2 px-4 py-2 rounded-xl bg-card border border-gridLine shadow-lg animate-[float-up_8s_linear_forwards] z-0"
            style={{
              left: lead.left,
              transform: `scale(${lead.scale})`,
            }}
          >
            {lead.type === "booking" ? (
              <span
                className="flex h-2 w-2 rounded-full bg-primary animate-pulse"
                style={{ backgroundColor: "var(--primary)" }}
              ></span>
            ) : (
              <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
            )}
            <span className="text-xs font-bold text-muted uppercase tracking-wider">
              {lead.type === "booking" ? "Meeting Booked" : "Lead Captured"}
            </span>
            <span className="text-xs text-foreground font-medium hidden sm:inline-block ml-1 border-l border-gridLine pl-3">
              {lead.text}
            </span>
          </div>
        ))}
      </div>

      {/* =========================================
          FOREGROUND: THE HEAVY GLASS TERMINAL
      ========================================= */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6">
        <div className="w-full bg-card/40 backdrop-blur-3xl border border-gridLine rounded-[2.5rem] sm:rounded-[3.5rem] p-8 sm:p-16 lg:p-20 text-center shadow-[0_20px_60px_rgba(0,0,0,0.15)] flex flex-col items-center relative overflow-hidden transition-colors duration-300">
          {/* Subtle Inner Highlight */}
          <div className="absolute inset-0 border border-white/5 rounded-[2.5rem] sm:rounded-[3.5rem] pointer-events-none"></div>

          {/* 1. Live Status Ticker */}
          <div className="inline-flex flex-col sm:flex-row items-center gap-3 sm:gap-4 px-5 py-2.5 rounded-full bg-background/80 border border-gridLine mb-10 shadow-sm transition-all duration-300">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
              </span>
              <span className="text-xs font-bold uppercase tracking-widest text-foreground">
                System Active
              </span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-gridLine"></div>
            <div className="text-xs font-mono text-muted flex items-center gap-2">
              Last lead captured:
              <span
                className={`font-bold transition-colors duration-300 ${secondsSinceLastLead === 0 ? "text-green-500" : "text-foreground"}`}
              >
                {secondsSinceLastLead < 10
                  ? `00:0${secondsSinceLastLead}`
                  : `00:${secondsSinceLastLead}`}
                s ago
              </span>
            </div>
          </div>

          {/* 2. Headline */}
          <h2 className="text-4xl sm:text-5xl lg:text-7xl font-black tracking-tighter mb-6 leading-[1.05] text-foreground text-balance max-w-4xl">
            Stop losing customers to{" "}
            <span
              className="text-transparent bg-clip-text bg-gradient-to-r from-primary"
              style={{ "--tw-gradient-to": "var(--accent-blue)" }}
            >
              faster competitors.
            </span>
          </h2>

          {/* 3. Subheadline */}
          <p className="text-lg sm:text-xl md:text-2xl text-muted font-medium leading-relaxed mb-12 max-w-2xl text-balance">
            Your website should capture leads — not leak them. Start turning
            your existing traffic into booked appointments instantly.
          </p>

          {/* 4. Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 w-full sm:w-auto relative z-20">
            {/* Primary Action */}
            <Link
              href="#demo-booking"
              className="group relative flex items-center justify-center gap-3 w-full sm:w-auto px-10 py-5 text-white hover:scale-105 font-black rounded-2xl transition-all duration-300 text-lg sm:text-xl shadow-[0_0_30px_rgba(138,43,226,0.2)] hover:shadow-[0_0_60px_rgba(138,43,226,0.5)] overflow-hidden"
              style={{ backgroundColor: "var(--primary)" }}
            >
              {/* Shimmer Effect */}
              <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"></div>
              Book Demo
              <svg
                className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="3"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </Link>

            {/* Secondary Action */}
            <Link
              href="#live-example"
              className="flex items-center justify-center gap-3 w-full sm:w-auto px-10 py-5 bg-background hover:bg-muted/10 text-foreground font-bold rounded-2xl border border-gridLine transition-all duration-300 text-lg sm:text-xl hover:-translate-y-1"
            >
              <svg
                className="w-5 h-5 text-muted"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              See Live Example
            </Link>
          </div>

          {/* 5. Trust Snippet */}
          <div className="mt-10 flex items-center justify-center gap-2 opacity-60">
            <svg
              className="w-4 h-4 text-muted"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            <p className="text-xs font-mono text-muted uppercase tracking-wider">
              Takes 5 minutes to set up.
            </p>
          </div>
        </div>
      </div>

      {/* Internal CSS for the Floating Stream and Shimmer */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes float-up {
          0% { 
            transform: translateY(0) scale(var(--tw-scale-x)); 
            opacity: 0; 
          }
          10% { 
            opacity: 1; 
          }
          90% { 
            opacity: 1; 
          }
          100% { 
            transform: translateY(-800px) scale(var(--tw-scale-x)); 
            opacity: 0; 
          }
        }
        
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `,
        }}
      />
    </section>
  );
}
