import { useEffect, useState } from "react";

const THEMES = [
  // Defaults
  {
    id: "light",
    name: "Aicyro Light (Default)",
    color1: "#8a2be2",
    color2: "#ffffff",
    isLight: true,
  },
  {
    id: "dark",
    name: "Aicyro Dark (Default)",
    color1: "#8a2be2",
    color2: "#0a0118",
    isLight: false,
  },

  // Red
  {
    id: "red-light",
    name: "Salmon",
    color1: "#ef4444",
    color2: "#ffffff",
    isLight: true,
  },
  {
    id: "red-dark",
    name: "Maroon",
    color1: "#ef4444",
    color2: "#0f0505",
    isLight: false,
  },

  // Orange
  {
    id: "orange-light",
    name: "Peach",
    color1: "#f97316",
    color2: "#ffffff",
    isLight: true,
  },
  {
    id: "orange-dark",
    name: "Rust",
    color1: "#f97316",
    color2: "#0f0804",
    isLight: false,
  },

  // Yellow
  {
    id: "yellow-light",
    name: "Lemon",
    color1: "#f59e0b",
    color2: "#ffffff",
    isLight: true,
  },
  {
    id: "yellow-dark",
    name: "Mustard",
    color1: "#f59e0b",
    color2: "#0f0a04",
    isLight: false,
  },

  // Green
  {
    id: "green-light",
    name: "Mint",
    color1: "#10b981",
    color2: "#ffffff",
    isLight: true,
  },
  {
    id: "green-dark",
    name: "Forest Green",
    color1: "#10b981",
    color2: "#050f0a",
    isLight: false,
  },

  // Blue
  {
    id: "blue-light",
    name: "Sky Blue",
    color1: "#3b82f6",
    color2: "#ffffff",
    isLight: true,
  },
  {
    id: "blue-dark",
    name: "Midnight Blue",
    color1: "#3b82f6",
    color2: "#050a0f",
    isLight: false,
  },

  // Indigo
  {
    id: "indigo-light",
    name: "Mauve",
    color1: "#6366f1",
    color2: "#ffffff",
    isLight: true,
  },
  {
    id: "indigo-dark",
    name: "Plum",
    color1: "#6366f1",
    color2: "#08050f",
    isLight: false,
  },

  // Violet
  {
    id: "violet-light",
    name: "Lavender",
    color1: "#8b5cf6",
    color2: "#ffffff",
    isLight: true,
  },
  {
    id: "violet-dark",
    name: "Blackberry",
    color1: "#8b5cf6",
    color2: "#0d050f",
    isLight: false,
  },
];

export default function AppearanceSettings() {
  const [activeTheme, setActiveTheme] = useState("dark");
  const [toast, setToast] = useState({ show: false, message: "" });

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "dark";
    setActiveTheme(savedTheme);
  }, []);

  const handleThemeChange = (themeId, isLight) => {
    setActiveTheme(themeId);

    // Apply the theme to the HTML tag
    document.documentElement.setAttribute("data-theme", themeId);

    // Manage Tailwind's default dark class
    if (isLight) {
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
    }

    // Save preference globally
    localStorage.setItem("theme", themeId);

    // Show a quick success toast
    setToast({ show: true, message: "Theme applied successfully!" });
    setTimeout(() => setToast({ show: false, message: "" }), 3000);
  };

  return (
    <main className="relative z-10 flex-grow w-full max-w-[1600px] mx-auto px-6 sm:px-12 py-8 fade-in min-h-screen">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8 border-b border-[var(--border-color)] pb-8">
        <div>
          <h1 className="text-3xl font-bold text-[var(--foreground)] tracking-tight flex items-center gap-3">
            Appearance Settings
            <svg
              className="w-6 h-6 text-[var(--primary)] animate-pulse"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
              />
            </svg>
          </h1>
          <p className="text-[var(--foreground-muted)] text-sm mt-2">
            Customize the platform's visual interface and global color themes.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 animate-slide-up relative">
        {/* Left Side: Theme Selector */}
        <div className="xl:col-span-8 flex flex-col gap-6">
          <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-3xl p-8 shadow-lg h-full relative overflow-hidden">
            {/* Decorative Grid Background */}
            <div
              className="absolute inset-0 z-0 opacity-20 pointer-events-none"
              style={{
                backgroundImage:
                  "radial-gradient(var(--grid-line) 1px, transparent 1px)",
                backgroundSize: "24px 24px",
              }}
            ></div>

            <div className="relative z-10 flex items-center gap-3 mb-8 border-b border-[var(--border-color)] pb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center text-white shadow-lg">
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
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-[var(--foreground)] tracking-tight">
                Global Themes
              </h2>
            </div>

            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {THEMES.map((theme) => {
                const isActive = activeTheme === theme.id;
                return (
                  <button
                    key={theme.id}
                    onClick={() => handleThemeChange(theme.id, theme.isLight)}
                    className={`group relative flex flex-col text-left overflow-hidden rounded-2xl border transition-all duration-500 ${
                      isActive
                        ? "border-[var(--primary)] shadow-[0_8px_30px_var(--lead-glow)] scale-[1.03] bg-[var(--background)] z-10"
                        : "border-[var(--border-color)] hover:border-[var(--primary)]/50 hover:bg-[var(--background)] hover:-translate-y-1 opacity-80 hover:opacity-100"
                    }`}
                  >
                    {/* Theme Color Preview Strip */}
                    <div className="h-28 w-full flex relative overflow-hidden">
                      <div
                        className="w-1/2 h-full transition-transform duration-700 group-hover:scale-110"
                        style={{ backgroundColor: theme.color2 }}
                      ></div>
                      <div
                        className="w-1/2 h-full transition-transform duration-700 group-hover:scale-110"
                        style={{ backgroundColor: theme.color1 }}
                      ></div>

                      {/* Decorative SVG Overlay on the colors */}
                      <svg
                        className="absolute inset-0 w-full h-full opacity-10 text-white mix-blend-overlay"
                        viewBox="0 0 100 100"
                        preserveAspectRatio="none"
                      >
                        <polygon
                          points="0,100 100,0 100,100"
                          fill="currentColor"
                        />
                      </svg>
                    </div>

                    <div className="p-5 bg-[var(--card-bg)] flex items-center justify-between transition-colors duration-300">
                      <span
                        className={`text-sm font-bold tracking-wide transition-colors ${isActive ? "text-[var(--primary)]" : "text-[var(--foreground)]"}`}
                      >
                        {theme.name}
                      </span>
                      {isActive && (
                        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center text-white shadow-[0_0_15px_var(--primary)] animate-bounce">
                          <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="3"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* RIGHT SIDE: LIVE INTERACTIVE PREVIEW PANEL (STICKY & REDESIGNED) */}
        {/* ========================================================= */}
        {/* `sticky top-24 self-start` keeps this panel floating while scrolling the left side */}
        <div className="xl:col-span-4 flex flex-col gap-6 sticky top-24 self-start">
          <div className="bg-[var(--card-bg)]/60 backdrop-blur-2xl border border-[var(--border-color)] rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,0.15)] flex flex-col relative overflow-hidden group/preview ring-1 ring-[var(--border-color)]">
            {/* Window Controls (Mac Style) & Header */}
            <div className="px-6 py-4 border-b border-[var(--border-color)]/50 bg-[var(--background)]/30 flex items-center justify-between z-20">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80 shadow-inner"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/80 shadow-inner"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/80 shadow-inner"></div>
              </div>
              <span className="text-[10px] text-[var(--primary)] bg-[var(--primary)]/10 font-bold px-3 py-1 rounded-full border border-[var(--primary)]/20 animate-pulse flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-[var(--primary)] rounded-full"></span>
                LIVE PREVIEW
              </span>
            </div>

            {/* Glowing Ambient Backgrounds */}
            <div className="absolute top-10 -right-10 w-64 h-64 bg-[var(--primary)] rounded-full blur-[90px] opacity-20 pointer-events-none transition-all duration-1000 group-hover/preview:scale-125"></div>
            <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-[var(--secondary)] rounded-full blur-[90px] opacity-15 pointer-events-none transition-all duration-1000 group-hover/preview:scale-125"></div>

            <div className="p-8 flex-grow z-10 flex flex-col gap-6">
              {/* Mock Dashboard Element - Glassy Stats Card */}
              <div className="p-5 rounded-2xl border border-white/5 bg-white/5 backdrop-blur-md shadow-lg flex justify-between items-center transition-all duration-300 hover:border-[var(--primary)]/30 hover:bg-[var(--card-bg)]">
                <div>
                  <div className="text-[10px] font-bold text-[var(--foreground-muted)] uppercase tracking-wider mb-2">
                    Total Conversion
                  </div>
                  <div className="flex items-end gap-2">
                    <div className="text-3xl font-black text-[var(--foreground)]">
                      84%
                    </div>
                    <div className="text-xs font-bold text-green-500 mb-1">
                      +12%
                    </div>
                  </div>
                </div>

                {/* Smooth SVG Trend Line */}
                <svg
                  className="w-20 h-12 text-[var(--primary)] drop-shadow-[0_0_8px_var(--primary)]"
                  viewBox="0 0 100 40"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path
                    d="M0 35 Q 15 20, 30 25 T 60 15 T 100 5"
                    className="animate-[dash_3s_ease-in-out_infinite]"
                    strokeDasharray="200"
                    strokeDashoffset="0"
                  />
                </svg>
              </div>

              {/* Minimalist Lead Card */}
              <div className="bg-[var(--background)]/80 border border-[var(--border-color)] rounded-2xl p-4 shadow-md flex items-center gap-4 hover:-translate-y-1 transition-transform duration-300">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center text-white font-bold text-lg shadow-[0_0_15px_var(--lead-glow)]">
                    JD
                  </div>
                  <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-[var(--background)]"></div>
                </div>
                <div className="flex-grow">
                  <p className="text-sm font-bold text-[var(--foreground)]">
                    John Doe
                  </p>
                  <p className="text-[11px] text-[var(--foreground-muted)]">
                    johndoe@acmecorp.com
                  </p>
                </div>
                <div className="px-3 py-1.5 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] text-[10px] font-bold uppercase tracking-wider border border-[var(--primary)]/20">
                  New Lead
                </div>
              </div>

              {/* Chat Bubble Preview */}
              <div className="flex flex-col gap-4 mt-2">
                <div className="flex items-end gap-3">
                  <div className="w-8 h-8 rounded-full bg-[var(--card-bg)] border border-[var(--border-color)] flex items-center justify-center shrink-0 shadow-sm">
                    <svg
                      className="w-4 h-4 text-[var(--primary)]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl rounded-bl-none p-3.5 text-xs text-[var(--foreground)] leading-relaxed shadow-sm">
                    How can I assist you with Aicyro today?
                  </div>
                </div>

                <div className="flex items-end justify-end">
                  <div className="bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] rounded-2xl rounded-br-none p-3.5 text-xs text-white font-medium shadow-[0_5px_15px_var(--lead-glow)]">
                    I need to view my dashboard.
                  </div>
                </div>
              </div>

              {/* Sync Button */}
              <button className="mt-4 w-full py-4 rounded-xl bg-[var(--background)] border border-[var(--border-color)] text-[var(--foreground)] text-xs font-bold uppercase tracking-widest shadow-sm hover:border-[var(--primary)] hover:text-[var(--primary)] hover:shadow-[0_0_20px_var(--lead-glow)] transition-all duration-300 flex items-center justify-center gap-3 group">
                <svg
                  className="w-4 h-4 group-hover:animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Sync Settings
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Toaster Notification */}
      <div
        className={`fixed bottom-8 right-8 z-[100] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          toast.show
            ? "translate-y-0 opacity-100 scale-100"
            : "translate-y-12 opacity-0 scale-95 pointer-events-none"
        }`}
      >
        <div className="bg-[var(--card-bg)] border border-[var(--primary)] shadow-[0_15px_50px_var(--lead-glow)] rounded-2xl p-4 pr-12 flex items-center gap-4 relative overflow-hidden backdrop-blur-2xl">
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-[var(--primary)] to-[var(--secondary)]"></div>
          <div className="w-8 h-8 rounded-full bg-[var(--primary)]/20 flex items-center justify-center text-[var(--primary)]">
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
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <div>
            <p className="text-[10px] font-bold text-[var(--primary)] uppercase tracking-widest mb-0.5">
              System Update
            </p>
            <p className="text-sm font-semibold text-[var(--foreground)]">
              {toast.message}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
