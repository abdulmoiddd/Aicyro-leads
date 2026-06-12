import React, { useState, useEffect } from "react";

export default function Impact() {
  // States for live micro-animations
  const [responseTime, setResponseTime] = useState(15.0);
  const [conversionRate, setConversionRate] = useState(2.4);
  const [trafficUtil, setTrafficUtil] = useState(12);
  const [triggerAnim, setTriggerAnim] = useState(0); // Used to loop animations

  // Loop animations every 6 seconds
  useEffect(() => {
    const loop = setInterval(() => {
      setTriggerAnim((prev) => prev + 1);
    }, 6000);
    return () => clearInterval(loop);
  }, []);

  // Animate the numbers
  useEffect(() => {
    // 1. Response Time crashes from 15m to 0.8s
    setResponseTime(15.0);
    setTimeout(() => {
      let current = 15.0;
      const timer = setInterval(() => {
        current -= 1.2;
        if (current <= 0.8) {
          setResponseTime(0.8);
          clearInterval(timer);
        } else {
          setResponseTime(current);
        }
      }, 30);
    }, 500);

    // 2. Conversion Rate climbs
    setConversionRate(2.4);
    setTimeout(() => {
      let current = 2.4;
      const timer = setInterval(() => {
        current += 0.5;
        if (current >= 18.2) {
          setConversionRate(18.2);
          clearInterval(timer);
        } else {
          setConversionRate(current);
        }
      }, 40);
    }, 1000);

    // 3. Traffic Utilization fills up
    setTrafficUtil(12);
    setTimeout(() => {
      let current = 12;
      const timer = setInterval(() => {
        current += 2;
        if (current >= 87) {
          setTrafficUtil(87);
          clearInterval(timer);
        } else {
          setTrafficUtil(current);
        }
      }, 30);
    }, 800);
  }, [triggerAnim]);

  return (
    <section
      id="Impact"
      className="relative py-24 sm:py-32 overflow-hidden bg-background border-t border-gridLine transition-colors duration-300"
    >
      {/* =========================================
          BACKGROUND EFFECTS
      ========================================= */}
      <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center overflow-hidden">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] blur-[200px] rounded-full mix-blend-screen opacity-[0.1] transition-colors duration-1000"
          style={{ backgroundColor: "var(--primary)" }}
        ></div>
        <div className="absolute inset-0 bg-[radial-gradient(var(--grid-line)_1px,transparent_1px)] bg-[size:48px_48px] opacity-[0.15] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_20%,transparent_100%)]"></div>
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6">
        {/* =========================================
            HEADER SECTION
        ========================================= */}
        <div className="flex flex-col items-center text-center mb-16 lg:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-card border border-gridLine mb-6 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span
                className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                style={{ backgroundColor: "var(--primary)" }}
              ></span>
              <span
                className="relative inline-flex rounded-full h-2 w-2"
                style={{ backgroundColor: "var(--primary)" }}
              ></span>
            </span>
            <span className="text-xs font-bold uppercase tracking-[0.15em] text-foreground">
              The Impact
            </span>
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.05] text-foreground text-balance">
            More responses. More bookings.{" "}
            <span
              className="text-transparent bg-clip-text bg-gradient-to-r from-primary"
              style={{ "--tw-gradient-to": "var(--accent-blue)" }}
            >
              More jobs.
            </span>
          </h2>
        </div>

        {/* =========================================
            THE BENTO GRID OF STATS
        ========================================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
          {/* STAT 1: Faster Response Times */}
          <div className="bg-card/50 backdrop-blur-xl border border-gridLine rounded-[2rem] p-8 sm:p-10 flex flex-col justify-between overflow-hidden relative transition-all duration-300 hover:bg-card/80 hover:shadow-2xl hover:-translate-y-1 group">
            <div className="relative z-10 mb-12">
              <h3 className="text-2xl font-black text-foreground mb-3">
                Faster response times
              </h3>
              <p className="text-muted font-medium text-lg leading-relaxed max-w-sm">
                Respond instantly instead of minutes or hours later.
              </p>
            </div>

            {/* Visual: Speed Timer */}
            <div className="relative z-10 mt-auto flex flex-col gap-4">
              <div className="flex justify-between items-end">
                <span className="text-xs font-bold text-muted uppercase tracking-wider">
                  Average Wait
                </span>
                <div className="flex items-baseline gap-1">
                  <span
                    className={`text-5xl font-black tabular-nums transition-colors duration-300 ${responseTime < 5 ? "text-green-500" : "text-foreground"}`}
                  >
                    {responseTime.toFixed(1)}
                  </span>
                  <span
                    className={`text-xl font-bold ${responseTime < 5 ? "text-green-500/70" : "text-muted"}`}
                  >
                    {responseTime === 15.0 ? "m" : "s"}
                  </span>
                </div>
              </div>
              <div className="w-full h-2 bg-background border border-gridLine rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 transition-all duration-75 ease-linear"
                  style={{
                    width: `${Math.max(5, (1.0 / responseTime) * 100)}%`,
                  }}
                ></div>
              </div>
            </div>

            {/* Background Glow */}
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-green-500/10 blur-3xl rounded-full group-hover:bg-green-500/20 transition-colors duration-500"></div>
          </div>

          {/* STAT 2: Higher lead conversion */}
          <div className="bg-card/50 backdrop-blur-xl border border-gridLine rounded-[2rem] p-8 sm:p-10 flex flex-col justify-between overflow-hidden relative transition-all duration-300 hover:bg-card/80 hover:shadow-2xl hover:-translate-y-1 group">
            <div className="relative z-10 mb-12">
              <h3 className="text-2xl font-black text-foreground mb-3">
                Higher lead conversion
              </h3>
              <p className="text-muted font-medium text-lg leading-relaxed max-w-sm">
                Turn more website visitors into paying customers.
              </p>
            </div>

            {/* Visual: Upward Graph */}
            <div className="relative z-10 mt-auto flex flex-col">
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-4xl font-black text-foreground tabular-nums">
                  +{conversionRate.toFixed(1)}%
                </span>
                <span className="text-sm font-bold text-muted uppercase tracking-wider">
                  Conversion
                </span>
              </div>

              <div className="w-full h-[80px] relative mt-4">
                {/* Decorative Grid Lines */}
                <div className="absolute inset-0 flex flex-col justify-between opacity-30">
                  <div className="w-full h-px bg-gridLine"></div>
                  <div className="w-full h-px bg-gridLine"></div>
                  <div className="w-full h-px bg-gridLine"></div>
                </div>
                {/* Animated Line Chart SVG */}
                <svg
                  className="w-full h-full overflow-visible"
                  preserveAspectRatio="none"
                  viewBox="0 0 100 100"
                >
                  <path
                    key={triggerAnim} // Re-triggers animation
                    d="M0,90 Q20,80 40,60 T80,30 T100,10"
                    fill="none"
                    style={{ stroke: "var(--primary)" }}
                    strokeWidth="4"
                    strokeLinecap="round"
                    className="animate-[draw-line_1.5s_ease-out_forwards]"
                    strokeDasharray="200"
                    strokeDashoffset="200"
                  />
                </svg>
                {/* Pulsing Dot at peak */}
                <div
                  className="absolute top-[5%] right-0 w-3 h-3 rounded-full animate-[fade-in_0.5s_ease-in_1.5s_both]"
                  style={{
                    backgroundColor: "var(--primary)",
                    boxShadow: "0 0 15px var(--primary)",
                  }}
                ></div>
              </div>
            </div>
          </div>

          {/* STAT 3: No missed after-hours inquiries */}
          <div className="bg-card/50 backdrop-blur-xl border border-gridLine rounded-[2rem] p-8 sm:p-10 flex flex-col justify-between overflow-hidden relative transition-all duration-300 hover:bg-card/80 hover:shadow-2xl hover:-translate-y-1 group">
            <div className="relative z-10 mb-12">
              <h3 className="text-2xl font-black text-foreground mb-3">
                No missed after-hours
              </h3>
              <p className="text-muted font-medium text-lg leading-relaxed max-w-sm">
                Capture leads 24/7 automatically, even when you sleep.
              </p>
            </div>

            {/* Visual: 24/7 Orbit */}
            <div className="relative z-10 mt-auto flex items-center justify-center h-[120px]">
              <div className="relative flex items-center justify-center">
                {/* Center Hub */}
                <div className="w-20 h-20 rounded-full bg-background border-2 border-gridLine z-10 flex items-center justify-center shadow-lg">
                  <span className="text-lg font-black text-foreground">
                    24/7
                  </span>
                </div>

                {/* Orbit Rings */}
                <div className="absolute inset-[-30px] rounded-full border border-gridLine border-dashed opacity-50"></div>
                <div className="absolute inset-[-60px] rounded-full border border-gridLine opacity-30"></div>

                {/* Orbiting Dot (The Bot) */}
                <div className="absolute inset-[-30px] animate-[spin_4s_linear_infinite]">
                  <div
                    className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full shadow-[0_0_15px_rgba(138,43,226,0.6)]"
                    style={{ backgroundColor: "var(--primary)" }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Background Glow */}
            <div
              className="absolute -top-20 -left-20 w-64 h-64 blur-3xl rounded-full opacity-10 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none"
              style={{ backgroundColor: "var(--primary)" }}
            ></div>
          </div>

          {/* STAT 4: Better use of existing traffic */}
          <div className="bg-card/50 backdrop-blur-xl border border-gridLine rounded-[2rem] p-8 sm:p-10 flex flex-col justify-between overflow-hidden relative transition-all duration-300 hover:bg-card/80 hover:shadow-2xl hover:-translate-y-1 group">
            <div className="relative z-10 mb-12">
              <h3 className="text-2xl font-black text-foreground mb-3">
                Better use of traffic
              </h3>
              <p className="text-muted font-medium text-lg leading-relaxed max-w-sm">
                Get more value from the visitors you already have.
              </p>
            </div>

            {/* Visual: Traffic Utilization Gauge */}
            <div className="relative z-10 mt-auto">
              <div className="flex justify-between items-end mb-4">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-muted uppercase tracking-wider mb-1">
                    Traffic Utilized
                  </span>
                  <span className="text-4xl font-black text-foreground tabular-nums">
                    {trafficUtil}%
                  </span>
                </div>

                <div className="flex items-center gap-1.5 px-3 py-1 bg-green-500/10 border border-green-500/30 rounded-full">
                  <svg
                    className="w-3 h-3 text-green-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="3"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 10l7-7m0 0l7 7m-7-7v18"
                    />
                  </svg>
                  <span className="text-[10px] font-bold text-green-500 uppercase tracking-wider">
                    Optimized
                  </span>
                </div>
              </div>

              {/* Progress blocks */}
              <div className="flex gap-1.5 h-6">
                {Array.from({ length: 20 }).map((_, i) => {
                  // Calculate if this block should be "filled" based on trafficUtil (0-100 mapped to 0-20)
                  const threshold = (i / 20) * 100;
                  const isFilled = trafficUtil >= threshold;

                  return (
                    <div
                      key={i}
                      className={`flex-1 rounded-sm transition-all duration-300 ${
                        isFilled
                          ? "opacity-100 shadow-[0_0_8px_rgba(138,43,226,0.4)]"
                          : "bg-gridLine opacity-30"
                      }`}
                      style={
                        isFilled ? { backgroundColor: "var(--primary)" } : {}
                      }
                    ></div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Internal CSS for the graph animation */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes draw-line {
          to { stroke-dashoffset: 0; }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.5); }
          to { opacity: 1; transform: scale(1); }
        }
      `,
        }}
      />
    </section>
  );
}
