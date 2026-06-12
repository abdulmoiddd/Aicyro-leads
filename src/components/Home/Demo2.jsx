"use client";

import React, { useState, useRef } from "react";
// IMPORTANT: If Next.js throws an error about importing .mp4 files,
// move the video to your "public" folder and use src="/demo.mp4" instead.
// import demoVideo from "../../assets/demo.mp4";

export default function Demo() {
  const [isHovered, setIsHovered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);

  const togglePlay = (e) => {
    e.stopPropagation();
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <section
      id="Demo"
      className="relative py-24 sm:py-32 overflow-hidden bg-[var(--background)] transition-colors duration-300"
    >
      {/* =========================================
          BACKGROUND EFFECTS (Global CSS Vars)
      ========================================= */}
      <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center overflow-hidden">
        {/* Spotlight Glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] blur-[200px] rounded-full mix-blend-screen opacity-[0.1] transition-all duration-700"
          style={{
            backgroundColor: isHovered
              ? "var(--accent-blue)"
              : "var(--primary)",
          }}
        ></div>
        <div className="absolute inset-0 bg-[radial-gradient(var(--grid-line)_1px,transparent_1px)] bg-[size:48px_48px] opacity-[0.2] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_40%,#000_30%,transparent_100%)]"></div>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 flex flex-col items-center">
        {/* =========================================
            HEADER SECTION
        ========================================= */}
        <div className="text-center mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--card-bg)] border border-[var(--grid-line)] mb-6 shadow-sm">
            <svg
              className="w-4 h-4 animate-pulse"
              style={{ color: "var(--primary)" }}
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
            <span className="text-xs font-bold uppercase tracking-widest text-[var(--foreground)]">
              Live Showcase
            </span>
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight mb-6 leading-[1.05] text-[var(--foreground)] text-balance">
            See Aicyro in{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary)] to-[var(--accent-blue)]">
              action
            </span>
          </h2>

          <p className="text-lg sm:text-xl text-[var(--foreground-muted)] max-w-2xl mx-auto font-medium leading-relaxed text-balance">
            Watch how website visitors are turned into real leads in real time.
          </p>
        </div>

        {/* =========================================
            THE INTERACTIVE PLAYER & FLOATING UI
        ========================================= */}
        <div className="w-full max-w-5xl mx-auto relative flex justify-center items-center perspective-[1200px] mt-8 sm:mt-12">
          {/* Floating Element 1: Lead Captured (Top Left) */}
          <div
            className={`hidden md:flex absolute top-10 left-0 bg-[var(--card-bg)]/90 backdrop-blur-md border border-[var(--grid-line)] p-4 rounded-2xl shadow-2xl items-center gap-3 transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] z-0 ${
              isHovered
                ? "-translate-x-24 -translate-y-16 scale-100 opacity-100 rotate-[-8deg]"
                : "translate-x-0 translate-y-0 scale-75 opacity-0 rotate-0"
            }`}
          >
            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center border border-green-500/30">
              <svg
                className="w-5 h-5 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <div>
              <p className="text-xs font-bold text-[var(--foreground-muted)] uppercase tracking-wider">
                Lead Captured
              </p>
              <p className="text-sm font-black text-[var(--foreground)] mt-0.5">
                Value: $1,200
              </p>
            </div>
          </div>

          {/* Floating Element 2: Response Time (Bottom Right) */}
          <div
            className={`hidden md:flex absolute bottom-10 right-0 bg-[var(--card-bg)]/90 backdrop-blur-md border border-[var(--grid-line)] p-4 rounded-2xl shadow-2xl items-center gap-3 transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] delay-75 z-0 ${
              isHovered
                ? "translate-x-24 translate-y-16 scale-100 opacity-100 rotate-[6deg]"
                : "translate-x-0 translate-y-0 scale-75 opacity-0 rotate-0"
            }`}
          >
            <div className="w-10 h-10 rounded-full bg-[var(--primary)]/20 flex items-center justify-center border border-[var(--primary)]/30">
              <svg
                className="w-5 h-5 text-[var(--primary)]"
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
              <p className="text-xs font-bold text-[var(--foreground-muted)] uppercase tracking-wider">
                Avg Response
              </p>
              <p className="text-sm font-black text-[var(--foreground)] mt-0.5">
                &lt; 0.8 Seconds
              </p>
            </div>
          </div>

          {/* Floating Element 3: Meeting Booked (Top Right) */}
          <div
            className={`hidden lg:flex absolute -top-8 right-12 bg-[var(--card-bg)]/90 backdrop-blur-md border border-[var(--grid-line)] p-3 rounded-2xl shadow-2xl items-center gap-3 transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] delay-150 z-0 ${
              isHovered
                ? "translate-x-16 -translate-y-16 scale-100 opacity-100 rotate-[12deg]"
                : "translate-x-0 translate-y-0 scale-75 opacity-0 rotate-0"
            }`}
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "var(--accent-blue)" }}
            >
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="3"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <p className="text-sm font-bold text-[var(--foreground)] pr-2">
              Meeting Booked
            </p>
          </div>

          {/* MAIN VIDEO PLAYER */}
          <div
            className="w-full max-w-4xl relative z-10 cursor-pointer group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={togglePlay}
          >
            {/* Player Container */}
            <div
              className={`aspect-video w-full bg-[#000000] backdrop-blur-3xl border border-[var(--grid-line)] rounded-3xl sm:rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex flex-col transition-transform duration-500 [transform-style:preserve-3d] ${isHovered ? "scale-[1.02] rotate-x-[2deg]" : "scale-100 rotate-x-0"}`}
            >
              {/* Video & UI Area */}
              <div className="flex-1 relative overflow-hidden flex items-center justify-center pt-10 sm:pt-12">
                {/* Real HTML5 Video Element */}
                <video
                  ref={videoRef}
                  // src="../../assets/demo.mp4"
                  src="/demo.mp4"
                  className="absolute inset-0 w-full h-full object-cover z-0"
                  loop
                  playsInline
                  onEnded={() => setIsPlaying(false)}
                />

                {/* The Play/Pause Button Overlay */}
                <div
                  className={`relative z-20 flex flex-col items-center justify-center transition-all duration-500 ${isPlaying && !isHovered ? "opacity-0 scale-90" : "opacity-100 scale-100"}`}
                >
                  <div
                    className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center transition-all duration-500 border border-white/10 ${
                      isHovered
                        ? "scale-110 shadow-[0_0_80px_rgba(138,43,226,0.6)] backdrop-blur-md"
                        : "scale-100 shadow-[0_0_40px_rgba(138,43,226,0.3)] backdrop-blur-sm"
                    }`}
                    style={{
                      backgroundColor: isHovered
                        ? "var(--primary)"
                        : "rgba(138,43,226,0.8)",
                    }}
                  >
                    {/* Play/Pause Icon Toggle */}
                    {isPlaying ? (
                      <svg
                        className={`w-8 h-8 sm:w-10 sm:h-10 text-white transition-transform duration-300 ${isHovered ? "scale-110" : "scale-100"}`}
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                      </svg>
                    ) : (
                      <svg
                        className={`w-8 h-8 sm:w-10 sm:h-10 text-white ml-2 transition-transform duration-300 ${isHovered ? "scale-110" : "scale-100"}`}
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M5 3l14 9-14 9V3z" />
                      </svg>
                    )}

                    {/* Ripple Effect (Only when paused to draw attention) */}
                    {!isPlaying && (
                      <div
                        className="absolute inset-0 rounded-full border border-white/30 animate-ping"
                        style={{ animationDuration: "2s" }}
                      ></div>
                    )}
                  </div>
                </div>

                {/* Bottom Progress Bar Simulation */}
                <div className="absolute bottom-0 inset-x-0 h-1.5 bg-[var(--background)] border-t border-[var(--grid-line)] z-20">
                  <div
                    className="h-full w-1/3 relative"
                    style={{ backgroundColor: "var(--primary)" }}
                  >
                    <div
                      className={`absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-md transition-all duration-300 ${isHovered ? "scale-100 opacity-100" : "scale-0 opacity-0"}`}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================
            CALL TO ACTION BUTTON
        ========================================= */}
        <div className="mt-16 sm:mt-24 flex items-center justify-center z-20">
          <button
            onClick={togglePlay}
            className="group relative flex items-center justify-center gap-3 w-full sm:w-auto px-8 py-4 bg-[var(--foreground)] text-[var(--background)] hover:scale-105 font-black rounded-xl transition-all duration-300 text-lg sm:text-xl shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:shadow-[0_0_50px_rgba(255,255,255,0.2)]"
          >
            <svg
              className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M5 3l14 9-14 9V3z" />
            </svg>
            Watch 2-Minute Demo
          </button>
        </div>
      </div>
    </section>
  );
}
