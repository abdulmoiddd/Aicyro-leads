"use client";

import { useState, useEffect } from "react";
import Navbar from "../components/Essential/Navbar";
import Footer from "../components/Essential/Footer";

export default function LeadsDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [leads, setLeads] = useState([]);
  const [isLoadingLeads, setIsLoadingLeads] = useState(false);

  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [filterScore, setFilterScore] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");

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
        setIsAuthenticated(true);
        fetchLeads();
      } else {
        setLoginError(data.error || "Login failed");
      }
    } catch (err) {
      setLoginError("Network error. Try again.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const fetchLeads = async () => {
    setIsLoadingLeads(true);
    try {
      const response = await fetch("/api/leads");
      const data = await response.json();
      setLeads(data);
    } catch (error) {
      console.error("Failed to fetch leads", error);
    } finally {
      setIsLoadingLeads(false);
    }
  };

  // --- Core Filtering Logic ---
  const filteredLeads = leads.filter((lead) => {
    const searchString = searchTerm.toLowerCase();
    const matchesSearch =
      lead.name?.toLowerCase().includes(searchString) ||
      lead.email?.toLowerCase().includes(searchString) ||
      lead.phone?.toLowerCase().includes(searchString) ||
      lead.business_type?.toLowerCase().includes(searchString);

    const matchesScore =
      filterScore === "All" || lead.lead_score === filterScore;

    const matchesStatus =
      filterStatus === "All"
        ? true
        : filterStatus === "Booked"
          ? !!lead.display_time
          : filterStatus === "Unbooked"
            ? !lead.display_time
            : true;

    return matchesSearch && matchesScore && matchesStatus;
  });

  // --- Calculate Metrics ---
  const totalLeads = leads.length;
  const bookedMeetings = leads.filter((lead) => lead.display_time).length;
  const highIntentLeads = leads.filter(
    (lead) => lead.lead_score === "High",
  ).length;
  const conversionRate =
    totalLeads > 0 ? Math.round((bookedMeetings / totalLeads) * 100) : 0;

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col min-h-screen bg-[var(--background)] font-sans text-[var(--foreground)] relative">
        {/* Ambient Glowing Background */}
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-[var(--primary)] opacity-10 blur-[120px] rounded-full mix-blend-screen"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[30vw] h-[30vw] bg-[var(--secondary)] opacity-10 blur-[100px] rounded-full mix-blend-screen"></div>
        </div>

        {/* Navbar with Padding */}
        <div className="relative sm:px-12">
          <Navbar />
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

  return (
    <div className="flex flex-col min-h-screen bg-[var(--background)] font-sans text-[var(--foreground)] relative">
      {/* Ambient Glowing Background */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[50vw] h-[30vw] bg-[var(--primary)] opacity-5 blur-[150px] rounded-full mix-blend-screen"></div>
      </div>

      {/* Navbar with Padding */}
      <div className="relative   sm:px-12">
        <Navbar />
      </div>

      <main className="relative z-10 mt-20 flex-grow w-full max-w-[1600px] mx-auto px-6 sm:px-12 py-10">
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-bold text-[var(--foreground)] tracking-tight mb-2">
              Lead Intelligence
            </h1>
            <p className="text-[var(--foreground-muted)] text-sm font-medium">
              Real-time capture and conversion tracking
            </p>
          </div>
          <button
            onClick={() => setIsAuthenticated(false)}
            className="flex items-center gap-2 text-sm font-semibold bg-[var(--card-bg)] hover:bg-red-500/10 text-[var(--foreground-muted)] hover:text-red-400 border border-[var(--border-color)] hover:border-red-500/30 px-5 py-3 rounded-xl transition-all shadow-sm"
          >
            Sign Out
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
          </button>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[
            {
              label: "Total Captures",
              value: totalLeads,
              icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
            },
            {
              label: "Meetings Booked",
              value: bookedMeetings,
              color: "text-[var(--primary)]",
              icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
            },
            {
              label: "High Intent",
              value: highIntentLeads,
              icon: "M13 10V3L4 14h7v7l9-11h-7z",
            },
            {
              label: "Conversion Rate",
              value: `${conversionRate}%`,
              icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
            },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-[var(--card-bg)] backdrop-blur-xl border border-[var(--border-color)] rounded-3xl p-6 shadow-lg hover:-translate-y-1 hover:border-[var(--grid-line)] transition-all duration-300 group"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[var(--foreground-muted)] text-sm font-semibold uppercase tracking-wider">
                    {stat.label}
                  </p>
                  <h3
                    className={`text-4xl font-black mt-3 tracking-tight ${stat.color || "text-[var(--foreground)]"}`}
                  >
                    {stat.value}
                  </h3>
                </div>
                <div className="p-3 bg-[var(--background)] rounded-2xl text-[var(--foreground-muted)] group-hover:text-[var(--primary)] group-hover:bg-[var(--lead-glow)] transition-all duration-300 shadow-inner">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d={stat.icon}
                    />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Data Grid */}
        <div className="bg-[var(--card-bg)] backdrop-blur-xl border border-[var(--border-color)] rounded-3xl shadow-xl flex flex-col mb-10 overflow-hidden">
          {/* Controls Bar */}
          <div className="px-8 py-6 border-b border-[var(--border-color)] bg-[var(--background)] flex flex-col xl:flex-row gap-5 justify-between items-center">
            <div className="relative w-full xl:w-[400px]">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-[var(--foreground-muted)]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search names, emails, or domains..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl pl-12 pr-5 py-3.5 text-sm text-[var(--foreground)] placeholder:text-[var(--foreground-muted)] focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-all shadow-inner"
              />
            </div>

            <div className="flex w-full xl:w-auto items-center gap-4">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="flex-1 xl:flex-none bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl px-5 py-3.5 text-sm text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)] transition-all cursor-pointer appearance-none pr-10 relative bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2214%22%20height%3D%2214%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%239CA3AF%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[position:right_15px_center]"
              >
                <option value="All">All Statuses</option>
                <option value="Booked">Meetings Booked</option>
                <option value="Unbooked">Unbooked Captures</option>
              </select>

              <select
                value={filterScore}
                onChange={(e) => setFilterScore(e.target.value)}
                className="flex-1 xl:flex-none bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl px-5 py-3.5 text-sm text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)] transition-all cursor-pointer appearance-none pr-10 relative bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2214%22%20height%3D%2214%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%239CA3AF%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[position:right_15px_center]"
              >
                <option value="All">All Scores</option>
                <option value="High">High Intent</option>
                <option value="Medium">Medium Intent</option>
                <option value="Low">Low Intent</option>
              </select>

              <button
                onClick={fetchLeads}
                className="p-3.5 border border-[var(--border-color)] bg-[var(--card-bg)] rounded-2xl text-[var(--foreground-muted)] hover:text-[var(--primary)] hover:border-[var(--primary)] transition-all shadow-sm"
                title="Refresh Data"
              >
                <svg
                  className={`w-5 h-5 ${isLoadingLeads ? "animate-spin text-[var(--primary)]" : ""}`}
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
              </button>
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto min-h-[450px]">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead>
                <tr className="border-b border-[var(--border-color)] bg-[var(--background)] text-[var(--foreground-muted)] text-xs uppercase tracking-widest font-semibold">
                  <th className="px-8 py-5">Contact Details</th>
                  <th className="px-8 py-5">Business Profile</th>
                  <th className="px-8 py-5">Intent Analysis</th>
                  <th className="px-8 py-5">Capture Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-color)]">
                {isLoadingLeads ? (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-8 py-20 text-center text-[var(--foreground-muted)] text-base"
                    >
                      Syncing secure database...
                    </td>
                  </tr>
                ) : leads.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-8 py-24 text-center">
                      <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-3xl flex items-center justify-center mb-4 shadow-inner">
                          <svg
                            className="w-8 h-8 text-[var(--foreground-muted)]"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="1.5"
                              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                            />
                          </svg>
                        </div>
                        <p className="text-[var(--foreground)] font-semibold text-lg">
                          No leads captured yet
                        </p>
                        <p className="text-[var(--foreground-muted)] text-sm mt-1">
                          When the bot captures info, it will appear here
                          instantly.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : filteredLeads.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-8 py-24 text-center">
                      <div className="flex flex-col items-center">
                        <svg
                          className="w-12 h-12 text-[var(--foreground-muted)] mb-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.5"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                          />
                        </svg>
                        <p className="text-[var(--foreground)] font-semibold text-lg">
                          No matches found
                        </p>
                        <button
                          onClick={() => {
                            setSearchTerm("");
                            setFilterScore("All");
                            setFilterStatus("All");
                          }}
                          className="mt-3 text-sm text-[var(--primary)] hover:underline transition-colors"
                        >
                          Clear all filters
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredLeads.map((lead, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-[var(--background)] transition-colors duration-200 group"
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-[var(--background)] border border-[var(--border-color)] flex items-center justify-center text-[var(--foreground-muted)] font-bold uppercase text-sm group-hover:bg-[var(--primary)] group-hover:text-[var(--background)] group-hover:border-[var(--primary)] transition-all duration-300 shadow-sm">
                            {lead.name ? lead.name.charAt(0) : "?"}
                          </div>
                          <div>
                            <div className="font-bold text-[var(--foreground)] text-base">
                              {lead.name || "Anonymous"}
                            </div>
                            <div className="text-[var(--foreground-muted)] text-xs mt-1 font-medium">
                              {lead.email}
                            </div>
                            {lead.phone && (
                              <div className="text-[var(--foreground-muted)] opacity-80 text-xs mt-0.5">
                                {lead.phone}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="font-semibold text-[var(--foreground)]">
                          {lead.business_type || "Unspecified"}
                        </div>
                        {lead.website && (
                          <a
                            href={
                              lead.website.startsWith("http")
                                ? lead.website
                                : `https://${lead.website}`
                            }
                            target="_blank"
                            rel="noreferrer"
                            className="text-[var(--primary)] hover:text-[var(--foreground)] transition-colors text-xs mt-1.5 flex items-center gap-1 font-medium"
                          >
                            {lead.website.replace(/^https?:\/\//, "")}
                            <svg
                              className="w-3 h-3"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                              />
                            </svg>
                          </a>
                        )}
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col gap-2.5 items-start">
                          <div className="flex gap-2">
                            <span
                              className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${
                                lead.lead_score === "High"
                                  ? "bg-[var(--lead-glow)] border-[var(--primary)] text-[var(--primary)]"
                                  : lead.lead_score === "Medium"
                                    ? "bg-amber-500/10 border-amber-500/30 text-amber-500"
                                    : "bg-[var(--background)] border-[var(--border-color)] text-[var(--foreground-muted)]"
                              }`}
                            >
                              {lead.lead_score || "Unscored"}
                            </span>
                            <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-[var(--background)] border border-[var(--border-color)] text-[10px] font-bold text-[var(--foreground-muted)] uppercase tracking-wider">
                              {lead.intent || "Pending"}
                            </span>
                          </div>
                          {lead.display_time ? (
                            <div className="text-xs font-bold text-[var(--primary)] bg-[var(--lead-glow)] px-2.5 py-1.5 rounded-md flex items-center gap-2 border border-[var(--border-color)] shadow-sm">
                              <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] animate-pulse"></span>
                              {lead.display_time}
                            </div>
                          ) : (
                            <div className="text-xs text-[var(--foreground-muted)] font-medium px-1 py-1">
                              Capture incomplete
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-8 py-6 text-[var(--foreground-muted)] text-xs font-medium">
                        <div className="text-[var(--foreground)] mb-1">
                          {new Date(lead.timestamp).toLocaleDateString(
                            undefined,
                            { month: "long", day: "numeric", year: "numeric" },
                          )}
                        </div>
                        <div>
                          {new Date(lead.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          {filteredLeads.length > 0 && (
            <div className="px-8 py-4 border-t border-[var(--border-color)] bg-[var(--background)] text-xs text-[var(--foreground-muted)] font-medium tracking-wide uppercase">
              Showing {filteredLeads.length} of {leads.length} total entries
            </div>
          )}
        </div>
      </main>

      {/* Footer with Padding */}
    </div>
  );
}
