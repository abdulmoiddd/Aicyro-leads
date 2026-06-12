"use client";

import { useState, useEffect, useRef } from "react";
// IMPORTANT: Import Firebase to fetch the Business Name
import { db } from "../lib/firebase";
import { ref, onValue } from "firebase/database";

import LoginScreen from "../components/Dashboard/LoginScreen";
import HomeScreen from "../components/Dashboard/HomeScreen";
import TerminalScreen from "../components/Dashboard/TerminalScreen";
import BookingsScreen from "../components/Dashboard/Booking";
import Insight from "@/components/Dashboard/Insight";
import Conversations from "../components/Dashboard/Conversations";
import Report from "../components/Dashboard/Report";

import PasswordChange from "../components/Dashboard/Settings/PasswordChange";

// The 3 Separated Settings Modules
import BusinessProfile from "../components/Dashboard/Settings/BusinessProfile";
import ChatbotSettings from "../components/Dashboard/Settings/Chatbotsetting";
import NotificationSettings from "../components/Dashboard/Settings/notification-settings";
import Apearance from "../components/Dashboard/Settings/apearance";

import LiveNotifications from "../components/Dashboard/LiveNotifications";

// --- MOCK NOTIFICATION DATA ---
const mockNotifications = [
  {
    id: 1,
    title: "Urgent Lead Captured",
    message: "John Doe (Acme Corp) requested a demo.",
    time: "5m ago",
    unread: true,
  },
  {
    id: 2,
    title: "Chatbot Alert",
    message: "A visitor asked to speak with a human agent.",
    time: "1h ago",
    unread: true,
  },
  {
    id: 3,
    title: "Weekly Summary",
    message: "Your Pulse performance report is ready.",
    time: "1d ago",
    unread: false,
  },
];

export default function LeadsDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState("home");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // State for dynamic Business Name in the Sidebar
  const [sidebarBrandName, setSidebarBrandName] = useState("Aicyro Pulse");

  // Sidebar Settings Dropdown State
  const [isSettingsExpanded, setIsSettingsExpanded] = useState(false);

  // --- THEME STATE ---
  const [theme, setTheme] = useState("dark");

  // --- NOTIFICATION STATE ---
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const notificationsRef = useRef(null);

  // --- FETCH BUSINESS NAME FROM FIREBASE ---
  useEffect(() => {
    if (isAuthenticated) {
      const brandRef = ref(
        db,
        "settings/business_profile/basic_info/businessName",
      );
      const unsubscribe = onValue(brandRef, (snapshot) => {
        if (snapshot.exists() && snapshot.val().trim() !== "") {
          setSidebarBrandName(snapshot.val());
        } else {
          setSidebarBrandName("Aicyro Pulse");
        }
      });

      return () => unsubscribe();
    }
  }, [isAuthenticated]);

  // --- THEME INITIALIZATION & PERSISTENCE ---
  useEffect(() => {
    // Check local storage for saved theme, default to dark
    const savedTheme = localStorage.getItem("theme") || "dark";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };

  // --- CLOSE NOTIFICATIONS ON OUTSIDE CLICK ---
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target)
      ) {
        setIsNotificationsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!isAuthenticated) {
    return <LoginScreen onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  const handleNavClick = (view) => {
    setCurrentView(view);
    setIsSidebarOpen(false); // Close sidebar on mobile after selection

    // Automatically open settings accordion if a settings page is clicked,
    // but don't close it if clicking a main menu item unless desired.
    if (
      [
        "business_profile",
        "chatbot_settings",
        "notification_settings",
        "apearance", // <-- Added appearance here so accordion stays open
      ].includes(view)
    ) {
      setIsSettingsExpanded(true);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setIsSidebarOpen(false);
  };

  // Helper to format the current view string for the Top Header
  const getHeaderTitle = () => {
    const titles = {
      home: "Pulse Overview",
      terminal: "Leads Terminal",
      bookings: "Bookings",
      insight: "Insight",
      conversations: "Conversations",
      reports: "Reports",
      business_profile: "Business Profile",
      chatbot_settings: "Chatbot Settings",
      apearance: "Appearance Settings", // <-- Fixed capitalization for the top header
      notification_settings: "Notification Settings",
      password_change: "Account Security",
    };
    return titles[currentView] || "Dashboard";
  };

  const unreadCount = mockNotifications.filter((n) => n.unread).length;

  return (
    <div className="flex min-h-screen bg-[var(--background)] font-sans text-[var(--foreground)] relative overflow-hidden">
      {/* Ambient Glowing Background */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-[var(--primary)] opacity-5 blur-[150px] rounded-full mix-blend-screen"></div>
      </div>

      {/* Sidebar Overlay (Mobile) */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300 ${isSidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={() => setIsSidebarOpen(false)}
      ></div>

      {/* ================= SIDEBAR PANEL ================= */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-[var(--sidebar-bg)] backdrop-blur-2xl border-r border-[var(--sidebar-border)] shadow-[20px_0_50px_rgba(0,0,0,0.1)] transform transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center justify-between p-6 border-b border-[var(--border-color)]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden bg-[var(--background)] border border-[var(--border-color)] shrink-0">
              <img
                src="/icon.png"
                alt="Icon"
                className="w-full h-full object-contain p-1"
              />
            </div>
            <span
              className="text-lg font-bold text-[var(--foreground)] tracking-wide truncate max-w-[150px]"
              title={sidebarBrandName}
            >
              {sidebarBrandName}
            </span>
            <span className="text-lg font-bold text-[var(--foreground)] tracking-wide truncate max-w-[150px]">
              Pulse
            </span>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="p-2 rounded-lg text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--background)] transition-colors shrink-0"
          >
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="flex-grow overflow-y-auto custom-scrollbar flex flex-col gap-2 p-4 mt-2">
          {/* Main Menu Section */}
          <p className="px-4 text-[10px] font-bold text-[var(--foreground-muted)] uppercase tracking-widest mb-1">
            Main Menu
          </p>

          {[
            "home",
            "terminal",
            "bookings",
            "insight",
            "conversations",
            "reports",
          ].map((view) => {
            const labels = {
              home: "Pulse",
              terminal: "Leads",
              bookings: "Booking",
              insight: "Insight",
              conversations: "Conversations",
              reports: "Reports",
            };
            return (
              <button
                key={view}
                onClick={() => handleNavClick(view)}
                className={`flex items-center gap-4 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 group ${
                  currentView === view
                    ? "bg-[var(--primary)]/10 text-[var(--primary)] border border-[var(--primary)]/20 shadow-[0_0_15px_var(--lead-glow)]"
                    : "text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--background)] border border-transparent"
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${currentView === view ? "bg-[var(--primary)]" : "bg-[var(--foreground-muted)] opacity-50 group-hover:bg-[var(--foreground)] transition-colors"}`}
                ></div>
                {labels[view]}
              </button>
            );
          })}

          {/* Settings Accordion Section */}
          <div className="mt-4 pt-4 border-t border-[var(--border-color)]">
            <button
              onClick={() => setIsSettingsExpanded(!isSettingsExpanded)}
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                isSettingsExpanded
                  ? "text-[var(--foreground)] bg-[var(--background)]"
                  : "text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--background)]"
              }`}
            >
              <div className="flex items-center gap-4">
                <svg
                  className={`w-4 h-4 ${isSettingsExpanded ? "text-[var(--primary)]" : "text-[var(--foreground-muted)]"}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                Settings
              </div>
              <svg
                className={`w-4 h-4 transition-transform duration-300 ${isSettingsExpanded ? "rotate-180 text-[var(--foreground)]" : "text-[var(--foreground-muted)]"}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${isSettingsExpanded ? "max-h-64 opacity-100 mt-2" : "max-h-0 opacity-0"}`}
            >
              <div className="flex flex-col gap-1 pl-4 ml-6 border-l border-[var(--border-color)]">
                <button
                  onClick={() => handleNavClick("business_profile")}
                  className={`text-left px-4 py-2.5 rounded-r-xl text-xs font-medium transition-all ${currentView === "business_profile" ? "bg-[var(--primary)]/10 text-[var(--primary)] border-l-2 border-[var(--primary)]" : "text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--background)] border-l-2 border-transparent"}`}
                >
                  Business Profile
                </button>
                <button
                  onClick={() => handleNavClick("chatbot_settings")}
                  className={`text-left px-4 py-2.5 rounded-r-xl text-xs font-medium transition-all ${currentView === "chatbot_settings" ? "bg-[var(--primary)]/10 text-[var(--primary)] border-l-2 border-[var(--primary)]" : "text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--background)] border-l-2 border-transparent"}`}
                >
                  Chatbot Configuration
                </button>
                <button
                  onClick={() => handleNavClick("notification_settings")}
                  className={`text-left px-4 py-2.5 rounded-r-xl text-xs font-medium transition-all ${currentView === "notification_settings" ? "bg-[var(--primary)]/10 text-[var(--primary)] border-l-2 border-[var(--primary)]" : "text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--background)] border-l-2 border-transparent"}`}
                >
                  Notification Settings
                </button>

                {/* --- ADDED APPEARANCE LINK HERE --- */}
                <button
                  onClick={() => handleNavClick("apearance")}
                  className={`text-left px-4 py-2.5 rounded-r-xl text-xs font-medium transition-all ${currentView === "apearance" ? "bg-[var(--primary)]/10 text-[var(--primary)] border-l-2 border-[var(--primary)]" : "text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--background)] border-l-2 border-transparent"}`}
                >
                  Appearance Themes
                </button>
                {/* ---------------------------------- */}
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-[var(--border-color)] shrink-0">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 transition-all"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Sign Out
          </button>
        </div>
      </aside>

      <div className="flex-grow flex flex-col w-full h-screen overflow-y-auto relative z-10">
        {/* ================= TOP HEADER BAR ================= */}
        <header className="sticky top-0 z-30 w-full px-6 sm:px-12 py-4 flex items-center justify-between bg-[var(--background)]/80 backdrop-blur-xl border-b border-[var(--border-color)] shadow-sm">
          {/* Left Side: Hamburger & Title */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2.5 rounded-xl bg-[var(--card-bg)] border border-[var(--border-color)] text-[var(--foreground)] hover:text-[var(--primary)] hover:border-[var(--primary)] transition-all shadow-sm"
            >
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
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <div className="h-6 w-px bg-[var(--border-color)] mx-2"></div>
            <span className="text-[var(--foreground-muted)] text-sm font-semibold tracking-wider uppercase">
              {getHeaderTitle()}
            </span>
          </div>

          {/* Right Side: THEME TOGGLE & LIVE NOTIFICATION MODULE */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle Button */}

            <LiveNotifications onNavigate={handleNavClick} />
          </div>
        </header>
        {/* Dynamic Screen Rendering */}
        <div className="flex-grow">
          {currentView === "home" && <HomeScreen onLogout={handleLogout} />}
          {currentView === "terminal" && (
            <TerminalScreen onLogout={handleLogout} />
          )}

          {currentView === "bookings" && (
            <BookingsScreen onLogout={handleLogout} />
          )}
          {currentView === "insight" && <Insight onLogout={handleLogout} />}
          {currentView === "conversations" && (
            <Conversations onLogout={handleLogout} />
          )}
          {currentView === "reports" && <Report onLogout={handleLogout} />}

          {currentView === "business_profile" && (
            <BusinessProfile onNavigate={handleNavClick} />
          )}

          {/* --- FIXED CASE SENSITIVITY HERE ("Apearance" -> "apearance") --- */}
          {currentView === "apearance" && <Apearance />}

          {currentView === "chatbot_settings" && <ChatbotSettings />}
          {currentView === "notification_settings" && <NotificationSettings />}
          {currentView === "password_change" && (
            <PasswordChange onNavigate={handleNavClick} />
          )}
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: var(--border-color); border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: var(--foreground-muted); }
      `,
        }}
      />
    </div>
  );
}
