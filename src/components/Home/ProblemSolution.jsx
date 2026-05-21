import React, { useState, useEffect } from "react";

const flowSteps = [
  {
    id: 1,
    title: "Visitor Lands",
    desc: "Intent is high. They are ready to buy.",
  },
  { id: 2, title: "No Response", desc: "They sit waiting. Patience drops." },
  {
    id: 3,
    title: "Visitor Leaves",
    desc: "They close the tab and look elsewhere.",
  },
  {
    id: 4,
    title: "Competitor Hired",
    desc: "Your ad spend is wasted. They get paid.",
  },
];

export default function ProblemSolution() {
  const [progress, setProgress] = useState(100);
  const [phase, setPhase] = useState(1);
  const [lostRevenue, setLostRevenue] = useState(14250);

  // SVG Circle Math for the Countdown Ring
  const circleRadius = 140;
  const circleCircumference = 2 * Math.PI * circleRadius;
  const strokeDashoffset =
    circleCircumference - (progress / 100) * circleCircumference;

  // Animation Loop
  useEffect(() => {
    const tickRate = 50; // 50ms per tick
    const totalDuration = 5000; // 5 seconds full cycle
    const drainPerTick = 100 / (totalDuration / tickRate);

    const timer = setInterval(() => {
      setProgress((prev) => {
        const nextProgress = prev - drainPerTick;

        if (nextProgress <= 0) {
          // Reset loop and add lost revenue
          setLostRevenue((curr) => curr + 850);
          setPhase(1);
          return 100;
        }

        // Update phases based on progress thresholds
        if (nextProgress > 75) setPhase(1);
        else if (nextProgress > 40) setPhase(2);
        else if (nextProgress > 10) setPhase(3);
        else setPhase(4);

        return nextProgress;
      });
    }, tickRate);

    return () => clearInterval(timer);
  }, []);

  // Determine dynamic styles based on phase
  const getPhaseStyles = () => {
    switch (phase) {
      case 1:
        return {
          color: "text-green-500",
          stroke: "stroke-green-500",
          bg: "bg-green-500/10",
          shadow: "shadow-[0_0_40px_rgba(34,197,94,0.2)]",
          icon: "Landing...",
        };
      case 2:
        return {
          color: "text-amber-500",
          stroke: "stroke-amber-500",
          bg: "bg-amber-500/10",
          shadow: "shadow-[0_0_40px_rgba(245,158,11,0.2)]",
          icon: "Waiting...",
        };
      case 3:
        return {
          color: "text-orange-500",
          stroke: "stroke-orange-500",
          bg: "bg-orange-500/10",
          shadow: "shadow-[0_0_40px_rgba(249,115,22,0.2)]",
          icon: "Leaving!",
        };
      case 4:
        return {
          color: "text-red-500",
          stroke: "stroke-red-500",
          bg: "bg-red-500/20",
          shadow: "shadow-[0_0_60px_rgba(239,68,68,0.4)]",
          icon: "LOST",
        };
      default:
        return {
          color: "text-primary",
          stroke: "stroke-primary",
          bg: "bg-primary/10",
          shadow: "",
        };
    }
  };

  const activeStyles = getPhaseStyles();

  return (
    <section
      id="ProblemSolution"
      className="relative py-24 sm:py-32 overflow-hidden bg-background border-t border-gridLine transition-colors duration-300"
    >
      {/* =========================================
          BACKGROUND EFFECTS (Global CSS Vars)
      ========================================= */}
      <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center overflow-hidden">
        <div
          className="absolute left-[-10%] top-1/4 w-[500px] h-[500px] blur-[150px] rounded-full mix-blend-screen opacity-[0.15] transition-colors duration-1000"
          style={{ backgroundColor: "var(--primary)" }}
        ></div>
        <div className="absolute right-[10%] bottom-[-10%] w-[600px] h-[600px] bg-red-500/10 blur-[150px] rounded-full mix-blend-screen opacity-30"></div>
        <div className="absolute inset-0 bg-[radial-gradient(var(--grid-line)_1px,transparent_1px)] bg-[size:40px_40px] opacity-[0.15] [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,#000_20%,transparent_100%)]"></div>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-16 lg:gap-8 items-center">
        {/* =========================================
            LEFT COLUMN: THE CORE STORY
        ========================================= */}
        <div className="flex flex-col items-start text-left z-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-gridLine mb-6 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            <span className="text-xs font-bold uppercase tracking-[0.15em] text-foreground">
              The Conversion Leak
            </span>
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight mb-6 leading-[1.05] text-foreground text-balance">
            Most businesses are losing leads{" "}
            <span
              className="text-transparent bg-clip-text bg-gradient-to-r from-primary"
              style={{ "--tw-gradient-to": "var(--accent-blue)" }}
            >
              without realizing it.
            </span>
          </h2>

          <p className="text-lg sm:text-xl text-muted max-w-lg font-medium leading-relaxed mb-10">
            People expect immediate responses. If they don’t get one, they move
            on. Watch how quickly a hot lead turns into a competitor's payday.
          </p>

          {/* Stepper List */}
          <div className="space-y-6 w-full max-w-md relative">
            <div className="absolute left-[15px] top-4 bottom-4 w-0.5 bg-gridLine -z-10"></div>

            {flowSteps.map((step, index) => {
              const isCurrent = phase === index + 1;
              const isPast = phase > index + 1;

              return (
                <div
                  key={step.id}
                  className={`flex items-start gap-4 transition-all duration-300 ${isCurrent ? "opacity-100 translate-x-2" : isPast ? "opacity-50" : "opacity-30"}`}
                >
                  <div
                    className={`w-8 h-8 rounded-full border-4 border-background flex items-center justify-center flex-shrink-0 transition-colors duration-300 ${isCurrent ? "bg-foreground" : "bg-gridLine"}`}
                  ></div>
                  <div className="-mt-1">
                    <h4
                      className={`text-xl font-black transition-colors duration-300 ${isCurrent ? "text-foreground" : "text-muted"}`}
                    >
                      {step.title}
                    </h4>
                    <p className="text-sm text-muted mt-1">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* =========================================
            RIGHT COLUMN: THE PATIENCE TRACKER
        ========================================= */}
        <div className="w-full flex justify-center items-center relative py-10">
          <div
            className={`relative w-[340px] h-[340px] sm:w-[400px] sm:h-[400px] rounded-full bg-card/40 backdrop-blur-3xl border border-gridLine flex items-center justify-center transition-all duration-300 ${activeStyles.shadow} ${phase === 4 ? "scale-105" : "scale-100"}`}
          >
            {/* SVG Countdown Ring */}
            <svg
              className="absolute inset-0 w-full h-full -rotate-90"
              viewBox="0 0 320 320"
            >
              {/* Background Track */}
              <circle
                cx="160"
                cy="160"
                r={circleRadius}
                className="fill-none stroke-gridLine opacity-30"
                strokeWidth="12"
              />
              {/* Animated Progress Ring */}
              <circle
                cx="160"
                cy="160"
                r={circleRadius}
                className={`fill-none transition-all duration-[50ms] ease-linear ${activeStyles.stroke}`}
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={circleCircumference}
                strokeDashoffset={strokeDashoffset}
              />
            </svg>

            {/* Inner Content */}
            <div className="flex flex-col items-center text-center z-10 px-8">
              {/* Status Badge */}
              <div
                className={`px-4 py-1.5 rounded-full mb-4 transition-colors duration-300 ${activeStyles.bg} ${activeStyles.color}`}
              >
                <span className="text-xs font-black uppercase tracking-widest">
                  {activeStyles.icon}
                </span>
              </div>

              {/* Countdown Number */}
              <div className="text-6xl sm:text-7xl font-black text-foreground tabular-nums tracking-tighter mb-2">
                {Math.ceil((progress / 100) * 60)}
                <span className="text-2xl text-muted font-medium">s</span>
              </div>

              <p className="text-sm text-muted font-bold uppercase tracking-wider">
                Visitor Patience
              </p>

              {/* The Competitor Flash (Only visible in Phase 4) */}
              <div
                className={`absolute inset-0 bg-red-500/90 rounded-full flex flex-col items-center justify-center transition-all duration-200 z-20 ${phase === 4 ? "opacity-100 scale-100" : "opacity-0 scale-90 pointer-events-none"}`}
              >
                <svg
                  className="w-12 h-12 text-white mb-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 22V8"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 18H3a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h18a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-2"
                  />
                  <circle cx="12" cy="5" r="3" />
                </svg>
                <h3 className="text-3xl font-black text-white uppercase tracking-wider">
                  Lost!
                </h3>
                <p className="text-sm text-red-100 font-bold mt-1">
                  Competitor hired.
                </p>
              </div>
            </div>
          </div>

          {/* Floating Widget: Total Lost Revenue */}
          <div className="absolute -bottom-4 right-0 sm:right-8 bg-card border-2 border-red-500/30 px-6 py-4 rounded-2xl shadow-2xl z-30 transition-transform hover:-translate-y-1">
            <p className="text-[10px] font-bold text-muted uppercase tracking-[0.2em] mb-1">
              Revenue Lost to Competitors
            </p>
            <div className="flex items-baseline gap-1">
              <span className="text-xl text-muted font-light">$</span>
              <span
                className={`text-3xl font-black tabular-nums transition-colors duration-300 ${phase === 4 ? "text-red-500" : "text-foreground"}`}
              >
                {lostRevenue.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Floating Widget: Intent Tag */}
          <div className="absolute top-10 left-0 sm:left-4 bg-background border border-gridLine px-4 py-2 rounded-xl shadow-lg z-30 animate-[float_4s_ease-in-out_infinite]">
            <p className="text-xs font-mono text-muted mb-0.5">Session #8924</p>
            <p className="text-sm font-bold text-foreground">
              High Intent Visitor
            </p>
          </div>
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
      `,
        }}
      />
    </section>
  );
}
