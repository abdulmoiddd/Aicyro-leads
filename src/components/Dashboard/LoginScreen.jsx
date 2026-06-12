"use client";

import { useState } from "react";

export default function LoginScreen({ onLoginSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError("");

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // SAVE LOGGED-IN USERNAME TO LOCAL STORAGE FOR PASSWORD CHANGES
        localStorage.setItem("loggedInUser", username);

        onLoginSuccess();
      } else {
        setLoginError(data.error || "Login failed");
      }
    } catch (err) {
      setLoginError("Network error. Try again.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[var(--background)] font-sans text-[var(--foreground)] relative">
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-[var(--primary)] opacity-10 blur-[120px] rounded-full mix-blend-screen"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[30vw] h-[30vw] bg-[var(--secondary)] opacity-10 blur-[100px] rounded-full mix-blend-screen"></div>
      </div>

      <div className="relative z-10 flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[var(--card-bg)] backdrop-blur-2xl border border-[var(--border-color)] rounded-3xl p-10 shadow-[0_8px_32px_rgba(0,0,0,0.2)]">
          <div className="flex flex-col items-center mb-10">
            <div className="w-14 h-14 bg-[var(--lead-glow)] border border-[var(--border-color)] rounded-2xl flex items-center justify-center mb-5 shadow-sm">
              <svg
                className="w-7 h-7 text-[var(--primary)]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-[var(--foreground)] tracking-tight">
              System Access
            </h1>
            <p className="text-[var(--primary)] text-sm mt-2 font-medium tracking-wide uppercase">
              Aicyro Secure Portal
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-[var(--background)] border border-[var(--border-color)] rounded-xl px-5 py-4 text-[var(--foreground)] placeholder:text-[var(--foreground-muted)] focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-all text-sm"
                required
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[var(--background)] border border-[var(--border-color)] rounded-xl px-5 py-4 text-[var(--foreground)] placeholder:text-[var(--foreground-muted)] focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-all text-sm"
                required
              />
            </div>

            {loginError && (
              <p className="text-red-400 text-xs text-center bg-red-500/10 py-3 rounded-lg border border-red-500/20">
                {loginError}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full bg-[var(--primary)] text-[var(--background)] font-bold py-4 px-4 rounded-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 mt-4 text-sm shadow-[0_0_20px_var(--lead-glow)]"
            >
              {isLoggingIn ? "Authenticating..." : "Login to Dashboard"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
