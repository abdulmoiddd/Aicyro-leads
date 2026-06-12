// "use client";

// import { useState, useEffect, useMemo } from "react";
// // IMPORTANT: Ensure your firebase setup exports the Realtime Database instance
// import { db } from "../../lib/firebase";
// import { ref, onValue } from "firebase/database";

// export default function HomeScreen({ onLogout }) {
//   const [leads, setLeads] = useState([]);

//   // Real-time Analytics States
//   const [websiteVisitors, setWebsiteVisitors] = useState(0);
//   const [chatbotOpens, setChatbotOpens] = useState(0);
//   const [conversationsStarted, setConversationsStarted] = useState(0);

//   const [isLoading, setIsLoading] = useState(true);
//   const [animateCharts, setAnimateCharts] = useState(false);

//   // Interactive Dashboard Controls
//   const [timeFrame, setTimeFrame] = useState(7); // Days
//   const [avgJobValue, setAvgJobValue] = useState(1200);

//   // --- FIREBASE REALTIME DATABASE LISTENERS ---
//   useEffect(() => {
//     // 1. Listen for Leads Data
//     const leadsRef = ref(db, "leads");
//     const unsubscribeLeads = onValue(
//       leadsRef,
//       (snapshot) => {
//         const data = snapshot.val();
//         if (data) {
//           const liveData = Object.keys(data)
//             .map((key) => ({
//               id: key,
//               ...data[key],
//             }))
//             .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
//           setLeads(liveData);
//         } else {
//           setLeads([]);
//         }
//         setIsLoading(false);
//       },
//       (error) => {
//         console.error("Error fetching live leads:", error);
//         setIsLoading(false);
//       },
//     );

//     // 2. Listen for Atomic Analytics Counters
//     const analyticsRef = ref(db, "analytics/totals");
//     const unsubscribeAnalytics = onValue(
//       analyticsRef,
//       (snapshot) => {
//         const data = snapshot.val();
//         if (data) {
//           setWebsiteVisitors(data.website_visitors || 0);
//           setChatbotOpens(data.chatbot_opens || 0);
//           setConversationsStarted(data.conversations_started || 0);
//         }
//       },
//       (error) => {
//         console.error("Error fetching live analytics:", error);
//       },
//     );

//     return () => {
//       unsubscribeLeads();
//       unsubscribeAnalytics();
//     };
//   }, []);

//   // Trigger animations after loading
//   useEffect(() => {
//     if (!isLoading) {
//       setAnimateCharts(false);
//       const timer = setTimeout(() => setAnimateCharts(true), 150);
//       return () => clearTimeout(timer);
//     }
//   }, [isLoading, timeFrame]);

//   // --- DATA FILTERING & CALCULATIONS ---
//   const filteredLeads = useMemo(() => {
//     const now = new Date();
//     return leads.filter((lead) => {
//       if (!lead.timestamp) return false;
//       const leadDate = new Date(lead.timestamp);
//       const diffTime = Math.abs(now - leadDate);
//       const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
//       return diffDays <= timeFrame;
//     });
//   }, [leads, timeFrame]);

//   // Bottom of Funnel (Actual Database Metrics)
//   const leadsCaptured = filteredLeads.length;
//   const qualifiedLeads = filteredLeads.filter(
//     (l) => l.lead_score === "High" || l.lead_score === "Medium",
//   ).length;
//   const bookedAppointments = filteredLeads.filter(
//     (l) =>
//       l.booking_status === "Meeting Booked" || l.booked_slot || l.display_time,
//   ).length;
//   const afterHoursLeads = filteredLeads.filter(
//     (l) => l.after_hours_flag === true,
//   ).length;

//   // Conversion Rates & Values
//   const conversionRate =
//     conversationsStarted > 0
//       ? ((leadsCaptured / conversationsStarted) * 100).toFixed(1)
//       : 0;
//   const bookingRate =
//     leadsCaptured > 0
//       ? ((bookedAppointments / leadsCaptured) * 100).toFixed(1)
//       : 0;

//   // FORMULA: Estimated Opportunity = qualified leads × average job value
//   const estimatedValue = qualifiedLeads * avgJobValue;

//   // --- AREA CHART DATA PREP ---
//   const chartData = useMemo(() => {
//     let structure = [];
//     for (let i = timeFrame - 1; i >= 0; i--) {
//       let d = new Date();
//       d.setDate(d.getDate() - i);
//       d.setHours(0, 0, 0, 0);
//       structure.push({
//         label:
//           timeFrame <= 7
//             ? d.toLocaleDateString("en-US", { weekday: "short" })
//             : d.getDate(),
//         dateValue: d.getTime(),
//         leads: 0,
//         convos: 0,
//         visitors: 0,
//       });
//     }

//     let totalChartLeads = 0;

//     filteredLeads.forEach((lead) => {
//       if (!lead.timestamp) return;
//       let leadDate = new Date(lead.timestamp);
//       leadDate.setHours(0, 0, 0, 0);
//       const targetDay = structure.find(
//         (d) => d.dateValue === leadDate.getTime(),
//       );
//       if (targetDay) {
//         targetDay.leads += 1;
//         totalChartLeads += 1;
//       }
//     });

//     // EXCT DATA SYNCHRONIZATION:
//     // Distribute exact global totals across the chart days so the tooltips sum up perfectly to the KPI cards.
//     let remainingVisitors = websiteVisitors;
//     let remainingConvos = conversationsStarted;

//     structure.forEach((day, index) => {
//       if (index === structure.length - 1) {
//         // The last day catches any rounding remainders to ensure exact match
//         day.visitors = Math.max(0, remainingVisitors);
//         day.convos = Math.max(0, remainingConvos);
//       } else {
//         // Distribute proportionally based on lead volume, or evenly if no leads exist
//         let visitorShare =
//           totalChartLeads > 0
//             ? Math.round((day.leads / totalChartLeads) * websiteVisitors)
//             : Math.round(websiteVisitors / timeFrame);

//         let convoShare =
//           totalChartLeads > 0
//             ? Math.round((day.leads / totalChartLeads) * conversationsStarted)
//             : Math.round(conversationsStarted / timeFrame);

//         // Ensure we don't extract more than remaining
//         day.visitors = Math.min(visitorShare, remainingVisitors);
//         day.convos = Math.min(convoShare, remainingConvos);

//         remainingVisitors -= day.visitors;
//         remainingConvos -= day.convos;
//       }
//     });

//     return structure;
//   }, [filteredLeads, timeFrame, websiteVisitors, conversationsStarted]);

//   // --- SVG PATH GENERATION FOR AREA CHART ---
//   const svgWidth = 800;
//   const svgHeight = 240;
//   const maxDataValue = Math.max(...chartData.map((d) => d.visitors), 10);
//   const usableHeight = svgHeight - 30;

//   const generateSmoothPath = (dataKey) => {
//     if (chartData.length === 0) return "";
//     const pointX = (index) => (index / (chartData.length - 1)) * svgWidth;
//     const pointY = (index) =>
//       svgHeight -
//       10 -
//       (chartData[index][dataKey] / maxDataValue) * usableHeight;

//     let path = `M ${pointX(0)} ${pointY(0)}`;
//     for (let i = 1; i < chartData.length; i++) {
//       const p0x = pointX(i - 1);
//       const p0y = pointY(i - 1);
//       const p1x = pointX(i);
//       const p1y = pointY(i);
//       const cx1 = p0x + (p1x - p0x) / 2;
//       const cx2 = p0x + (p1x - p0x) / 2;
//       path += ` C ${cx1} ${p0y}, ${cx2} ${p1y}, ${p1x} ${p1y}`;
//     }
//     return path;
//   };

//   const pathVisitors = generateSmoothPath("visitors");
//   const pathConvos = generateSmoothPath("convos");
//   const pathLeads = generateSmoothPath("leads");

//   // --- DONUT CHART DATA ---
//   const droppedConvos = Math.max(conversationsStarted - leadsCaptured, 0);
//   const unqualifiedLeads = Math.max(leadsCaptured - qualifiedLeads, 0);
//   const qualifiedUnbooked = Math.max(qualifiedLeads - bookedAppointments, 0);

//   const funnelSum =
//     droppedConvos + unqualifiedLeads + qualifiedUnbooked + bookedAppointments ||
//     1;

//   // Dasharrays for SVG (Circumference of r=15.915 is 100)
//   const pctBooked = (bookedAppointments / funnelSum) * 100;
//   const pctQual = (qualifiedUnbooked / funnelSum) * 100;
//   const pctUnqual = (unqualifiedLeads / funnelSum) * 100;
//   const pctDropped = (droppedConvos / funnelSum) * 100;

//   // --- LOADING STATE ---
//   if (isLoading) {
//     return (
//       <main className="relative z-10 flex-grow w-full max-w-[1600px] mx-auto flex items-center justify-center min-h-[60vh]">
//         <div className="flex flex-col items-center gap-5 bg-[var(--card-bg)] p-10 rounded-[2rem] border border-[var(--border-color)] shadow-2xl">
//           <svg
//             className="animate-spin w-12 h-12 text-[var(--primary)] drop-shadow-[0_0_15px_var(--primary)]"
//             fill="none"
//             viewBox="0 0 24 24"
//           >
//             <circle
//               className="opacity-20"
//               cx="12"
//               cy="12"
//               r="10"
//               stroke="currentColor"
//               strokeWidth="3"
//             ></circle>
//             <path
//               className="opacity-100"
//               fill="currentColor"
//               d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//             ></path>
//           </svg>
//           <p className="text-[var(--foreground-muted)] text-sm font-bold uppercase tracking-widest animate-pulse">
//             Syncing Telemetry...
//           </p>
//         </div>
//       </main>
//     );
//   }

//   return (
//     <main className="relative z-10 mt-2 flex-grow w-full max-w-[1600px] mx-auto px-6 sm:px-12 py-6 fade-in-up">
//       {/* ================= HEADER & CONTROLS ================= */}
//       <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-6 mb-8 bg-[var(--card-bg)] p-6 rounded-2xl border border-[var(--border-color)] shadow-sm">
//         <div>
//           <h1 className="text-3xl font-black text-[var(--foreground)] tracking-tight">
//             Pulse Overview
//           </h1>
//           <div className="flex items-center gap-2 text-sm font-medium text-[var(--foreground-muted)] mt-1">
//             <span className="relative flex h-2.5 w-2.5">
//               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--primary)] opacity-60"></span>
//               <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[var(--primary)]"></span>
//             </span>
//             Real-time Funnel Analytics
//           </div>
//         </div>

//         <div className="flex flex-wrap items-center gap-4 w-full xl:w-auto">
//           {/* Average Value Input */}

//           {/* Time Filter */}
//           <div className="flex bg-[var(--background)] border border-[var(--border-color)] rounded-xl p-1">
//             <button
//               onClick={() => setTimeFrame(7)}
//               className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${timeFrame === 7 ? "bg-[var(--primary)] text-white shadow-sm" : "text-[var(--foreground-muted)] hover:text-[var(--foreground)]"}`}
//             >
//               7 Days
//             </button>
//             <button
//               onClick={() => setTimeFrame(30)}
//               className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${timeFrame === 30 ? "bg-[var(--primary)] text-white shadow-sm" : "text-[var(--foreground-muted)] hover:text-[var(--foreground)]"}`}
//             >
//               30 Days
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* ================= 10 KPI CARDS GRID ================= */}
//       <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
//         {[
//           {
//             label: "Website Visitors",
//             value: websiteVisitors.toLocaleString(),
//           },
//           { label: "Chatbot Opens", value: chatbotOpens.toLocaleString() },
//           {
//             label: "Conversations",
//             value: conversationsStarted.toLocaleString(),
//           },
//           {
//             label: "Leads Captured",
//             value: leadsCaptured.toLocaleString(),
//             glow: true,
//           },
//           { label: "Qualified Leads", value: qualifiedLeads.toLocaleString() },
//           {
//             label: "Booked Appts",
//             value: bookedAppointments.toLocaleString(),
//             highlight: true,
//           },
//           {
//             label: "After-Hours Leads",
//             value: afterHoursLeads.toLocaleString(),
//           },
//           { label: "Conversion Rate", value: `${conversionRate}%` },
//           { label: "Booking Rate", value: `${bookingRate}%` },
//         ].map((kpi, i) => (
//           <div
//             key={i}
//             className={`bg-[var(--card-bg)] border rounded-2xl p-5 flex flex-col justify-between transition-all hover:-translate-y-1 ${kpi.glow ? "border-[var(--primary)]/50 shadow-[0_4px_20px_var(--lead-glow)]" : "border-[var(--border-color)] hover:border-[var(--foreground-muted)]"}`}
//           >
//             <span className="text-[10px] font-bold text-[var(--foreground-muted)] uppercase tracking-widest">
//               {kpi.label}
//             </span>
//             <span
//               className={`text-2xl font-black mt-3 ${kpi.highlight ? "text-[var(--primary)]" : "text-[var(--foreground)]"}`}
//             >
//               {kpi.value}
//             </span>
//           </div>
//         ))}

//         <div className="bg-gradient-to-br from-[var(--lead-from)] to-[var(--card-bg)] border border-[var(--primary)]/30 rounded-2xl p-5 flex flex-col justify-between shadow-[0_8px_30px_var(--lead-glow)] col-span-2 lg:col-span-1 relative overflow-hidden">
//           {/* Glowing orb in the corner */}
//           <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--primary)] blur-[40px] opacity-20"></div>

//           <div className="flex justify-between items-start relative z-10">
//             <span className="text-[10px] font-bold text-[var(--primary)] uppercase tracking-widest leading-tight w-2/3">
//               Estimated Opportunity Value
//             </span>
//             <span className="text-[8px] border border-[var(--primary)] text-[var(--primary)] px-1.5 py-0.5 rounded uppercase font-bold tracking-widest">
//               Estimate
//             </span>
//           </div>

//           {/* Changed text-white to text-[var(--foreground)] so it adapts to light/dark mode */}
//           <span className="text-3xl font-black text-[var(--foreground)] mt-3 relative z-10">
//             ${estimatedValue.toLocaleString()}
//           </span>
//         </div>
//       </div>

//       {/* ================= MAIN CHARTS ================= */}
//       <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
//         {/* Area Chart: Traffic Trend */}
//         <div className="lg:col-span-8 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl p-8 shadow-sm flex flex-col">
//           <div className="flex justify-between items-start sm:items-center mb-8 flex-col sm:flex-row gap-4">
//             <div>
//               <h2 className="text-lg font-bold text-[var(--foreground)]">
//                 Acquisition Velocity
//               </h2>
//               <p className="text-xs text-[var(--foreground-muted)] mt-1">
//                 Visitors vs Conversations vs Leads
//               </p>
//             </div>
//             <div className="flex flex-wrap gap-4 text-xs font-semibold">
//               <div className="flex items-center gap-2">
//                 <div className="w-3 h-1 rounded-full bg-[var(--foreground-muted)] opacity-30"></div>
//                 <span className="text-[var(--foreground-muted)] uppercase">
//                   Visitors
//                 </span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <div className="w-3 h-1 rounded-full bg-[var(--accent-blue)]"></div>
//                 <span className="text-[var(--foreground-muted)] uppercase">
//                   Conversations
//                 </span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <div className="w-3 h-1 rounded-full bg-[var(--primary)] shadow-[0_0_8px_var(--primary)]"></div>
//                 <span className="text-[var(--foreground-muted)] uppercase">
//                   Leads
//                 </span>
//               </div>
//             </div>
//           </div>

//           <div className="flex-grow relative h-[300px] w-full mt-4">
//             {/* Grid Lines */}
//             <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-10 pb-6">
//               {[1, 2, 3, 4, 5].map((_, i) => (
//                 <div
//                   key={i}
//                   className="border-b border-dashed border-[var(--foreground)] w-full"
//                 ></div>
//               ))}
//             </div>

//             {/* SVG Lines */}
//             <svg
//               viewBox={`0 0 ${svgWidth} ${svgHeight}`}
//               className="absolute inset-0 w-full h-full overflow-visible pb-6 pointer-events-none"
//             >
//               {animateCharts && (
//                 <>
//                   <path
//                     d={`${pathVisitors} L ${svgWidth} ${svgHeight} L 0 ${svgHeight} Z`}
//                     fill="var(--foreground-muted)"
//                     fillOpacity="0.05"
//                     className="fade-in-area"
//                   />
//                   <path
//                     d={pathVisitors}
//                     stroke="var(--foreground-muted)"
//                     strokeWidth="2"
//                     strokeOpacity="0.3"
//                     fill="none"
//                     className="draw-line-animation"
//                   />

//                   <path
//                     d={`${pathConvos} L ${svgWidth} ${svgHeight} L 0 ${svgHeight} Z`}
//                     fill="var(--accent-blue)"
//                     fillOpacity="0.1"
//                     className="fade-in-area"
//                   />
//                   <path
//                     d={pathConvos}
//                     stroke="var(--accent-blue)"
//                     strokeWidth="2"
//                     fill="none"
//                     className="draw-line-animation"
//                   />

//                   <path
//                     d={`${pathLeads} L ${svgWidth} ${svgHeight} L 0 ${svgHeight} Z`}
//                     fill="var(--primary)"
//                     fillOpacity="0.2"
//                     className="fade-in-area"
//                   />
//                   <path
//                     d={pathLeads}
//                     stroke="var(--primary)"
//                     strokeWidth="3"
//                     fill="none"
//                     className="draw-line-animation drop-shadow-[0_0_8px_var(--primary)]"
//                   />
//                 </>
//               )}
//             </svg>

//             {/* Interactive Tooltips */}
//             <div className="absolute inset-0 flex pb-6">
//               {chartData.map((data, idx) => (
//                 <div
//                   key={idx}
//                   className="flex-1 h-full flex flex-col justify-end relative group"
//                 >
//                   <div className="absolute inset-x-0 top-0 bottom-0 z-20 cursor-crosshair group-hover:bg-[var(--foreground-muted)]/5 border-x border-transparent group-hover:border-[var(--border-color)]/30 transition-colors">
//                     <div className="absolute top-0 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-[var(--card-bg)] border border-[var(--border-color)] shadow-xl px-3 py-2 rounded-lg pointer-events-none z-30 min-w-[120px]">
//                       <span className="text-[10px] font-bold text-[var(--foreground)] mb-1 block border-b border-[var(--border-color)] pb-1">
//                         {new Date(data.dateValue).toLocaleDateString()}
//                       </span>
//                       <div className="text-xs flex justify-between mt-1">
//                         <span className="text-[var(--foreground-muted)]">
//                           Visitors:
//                         </span>{" "}
//                         <span className="font-medium text-[var(--foreground)]">
//                           {data.visitors}
//                         </span>
//                       </div>
//                       <div className="text-xs flex justify-between">
//                         <span className="text-[var(--foreground-muted)]">
//                           Convos:
//                         </span>{" "}
//                         <span className="font-medium text-[var(--accent-blue)]">
//                           {data.convos}
//                         </span>
//                       </div>
//                       <div className="text-xs flex justify-between">
//                         <span className="text-[var(--foreground-muted)]">
//                           Leads:
//                         </span>{" "}
//                         <span className="font-bold text-[var(--primary)]">
//                           {data.leads}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                   {(timeFrame === 7 ||
//                     idx % Math.ceil(timeFrame / 7) === 0) && (
//                     <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-[var(--foreground-muted)] uppercase tracking-wider">
//                       {data.label}
//                     </span>
//                   )}
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Right Column: Funnel Donut Chart */}
//         <div className="lg:col-span-4 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl p-8 shadow-sm flex flex-col items-center">
//           <h2 className="text-lg font-bold text-[var(--foreground)] w-full text-left">
//             Funnel Breakdown
//           </h2>
//           <p className="text-xs text-[var(--foreground-muted)] font-medium w-full text-left mb-8">
//             Conversation progression & fallout
//           </p>

//           <div className="relative w-56 h-56 mb-8">
//             <svg
//               viewBox="0 0 36 36"
//               className="w-full h-full transform -rotate-90 drop-shadow-xl"
//             >
//               {/* Dropped (Background) */}
//               <circle
//                 cx="18"
//                 cy="18"
//                 r="15.915"
//                 fill="transparent"
//                 stroke="var(--background)"
//                 strokeWidth="4"
//                 strokeDasharray={`${animateCharts ? pctDropped : 0} 100`}
//                 strokeDashoffset={0}
//                 className="transition-all duration-1000 ease-out"
//               />
//               {/* Unqualified */}
//               <circle
//                 cx="18"
//                 cy="18"
//                 r="15.915"
//                 fill="transparent"
//                 stroke="var(--foreground-muted)"
//                 strokeWidth="4"
//                 strokeOpacity="0.4"
//                 strokeDasharray={`${animateCharts ? pctUnqual : 0} 100`}
//                 strokeDashoffset={`-${animateCharts ? pctDropped : 0}`}
//                 className="transition-all duration-1000 ease-out"
//               />
//               {/* Qualified Unbooked */}
//               <circle
//                 cx="18"
//                 cy="18"
//                 r="15.915"
//                 fill="transparent"
//                 stroke="var(--accent-blue)"
//                 strokeWidth="4"
//                 strokeDasharray={`${animateCharts ? pctQual : 0} 100`}
//                 strokeDashoffset={`-${animateCharts ? pctDropped + pctUnqual : 0}`}
//                 className="transition-all duration-1000 ease-out"
//               />
//               {/* Booked */}
//               <circle
//                 cx="18"
//                 cy="18"
//                 r="15.915"
//                 fill="transparent"
//                 stroke="var(--primary)"
//                 strokeWidth="4"
//                 strokeDasharray={`${animateCharts ? pctBooked : 0} 100`}
//                 strokeDashoffset={`-${animateCharts ? pctDropped + pctUnqual + pctQual : 0}`}
//                 className="transition-all duration-1000 ease-out"
//               />
//             </svg>
//             <div className="absolute inset-0 flex flex-col items-center justify-center">
//               <span className="text-[10px] text-[var(--foreground-muted)] font-bold uppercase tracking-widest mb-1">
//                 Booked
//               </span>
//               <span className="text-4xl font-black text-[var(--primary)] drop-shadow-[0_0_8px_var(--lead-glow)] transition-opacity duration-1000">
//                 {animateCharts ? pctBooked.toFixed(0) : 0}%
//               </span>
//             </div>
//           </div>

//           <div className="w-full space-y-3">
//             <div className="flex justify-between items-center text-sm border-b border-[var(--border-color)] pb-2">
//               <div className="flex items-center gap-2">
//                 <div className="w-2 h-2 bg-[var(--primary)] rounded-full"></div>
//                 <span className="text-[var(--foreground)] font-medium">
//                   Booked Appointments
//                 </span>
//               </div>
//               <span className="font-bold">{bookedAppointments}</span>
//             </div>
//             <div className="flex justify-between items-center text-sm border-b border-[var(--border-color)] pb-2">
//               <div className="flex items-center gap-2">
//                 <div className="w-2 h-2 bg-[var(--accent-blue)] rounded-full"></div>
//                 <span className="text-[var(--foreground)] font-medium">
//                   Qualified (Unbooked)
//                 </span>
//               </div>
//               <span className="font-bold">{qualifiedUnbooked}</span>
//             </div>
//             <div className="flex justify-between items-center text-sm border-b border-[var(--border-color)] pb-2">
//               <div className="flex items-center gap-2">
//                 <div className="w-2 h-2 bg-[var(--foreground-muted)] opacity-50 rounded-full"></div>
//                 <span className="text-[var(--foreground-muted)] font-medium">
//                   Unqualified Leads
//                 </span>
//               </div>
//               <span className="font-semibold text-[var(--foreground-muted)]">
//                 {unqualifiedLeads}
//               </span>
//             </div>
//             <div className="flex justify-between items-center text-sm">
//               <div className="flex items-center gap-2">
//                 <div className="w-2 h-2 bg-[var(--background)] border border-[var(--border-color)] rounded-full"></div>
//                 <span className="text-[var(--foreground-muted)] font-medium">
//                   Dropped Convos
//                 </span>
//               </div>
//               <span className="font-semibold text-[var(--foreground-muted)]">
//                 {droppedConvos}
//               </span>
//             </div>
//           </div>
//         </div>
//       </div>

//       <style
//         dangerouslySetInnerHTML={{
//           __html: `
//         .fade-in-up { animation: fadeInUp 0.6s ease-out forwards; }
//         @keyframes fadeInUp { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
//         .draw-line-animation { stroke-dasharray: 3000; stroke-dashoffset: 3000; animation: drawLine 2s cubic-bezier(0.175, 0.885, 0.32, 1) forwards; }
//         @keyframes drawLine { to { stroke-dashoffset: 0; } }
//         .fade-in-area { opacity: 0; animation: fadeArea 1.5s ease-in forwards; animation-delay: 0.5s; }
//         @keyframes fadeArea { to { opacity: 1; } }
//       `,
//         }}
//       />
//     </main>
//   );
// }

//
//
//
//
//
//
//
//
//
//
//
//

"use client";

import { useState, useEffect, useMemo } from "react";
// IMPORTANT: Ensure your firebase setup exports the Realtime Database instance
import { db } from "../../lib/firebase";
import { ref, onValue } from "firebase/database";

export default function HomeScreen({ onLogout }) {
  const [leads, setLeads] = useState([]);

  // Real-time Analytics States
  const [websiteVisitors, setWebsiteVisitors] = useState(0);
  const [chatbotOpens, setChatbotOpens] = useState(0);
  const [conversationsStarted, setConversationsStarted] = useState(0);

  const [isLoading, setIsLoading] = useState(true);
  const [animateCharts, setAnimateCharts] = useState(false);

  // Interactive Dashboard Controls
  const [timeFrame, setTimeFrame] = useState(7); // Days
  const [avgJobValue, setAvgJobValue] = useState(1200);

  // --- FIREBASE REALTIME DATABASE LISTENERS ---
  useEffect(() => {
    // 1. Listen for Leads Data
    const leadsRef = ref(db, "leads");
    const unsubscribeLeads = onValue(
      leadsRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const liveData = Object.keys(data)
            .map((key) => ({
              id: key,
              ...data[key],
            }))
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
          setLeads(liveData);
        } else {
          setLeads([]);
        }
        setIsLoading(false);
      },
      (error) => {
        console.error("Error fetching live leads:", error);
        setIsLoading(false);
      },
    );

    // 2. Listen for Atomic Analytics Counters
    const analyticsRef = ref(db, "analytics/totals");
    const unsubscribeAnalytics = onValue(
      analyticsRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setWebsiteVisitors(data.website_visitors || 0);
          setChatbotOpens(data.chatbot_opens || 0);
          setConversationsStarted(data.conversations_started || 0);
        }
      },
      (error) => {
        console.error("Error fetching live analytics:", error);
      },
    );

    return () => {
      unsubscribeLeads();
      unsubscribeAnalytics();
    };
  }, []);

  // Trigger animations after loading
  useEffect(() => {
    if (!isLoading) {
      setAnimateCharts(false);
      const timer = setTimeout(() => setAnimateCharts(true), 150);
      return () => clearTimeout(timer);
    }
  }, [isLoading, timeFrame]);

  // --- DATA FILTERING & CALCULATIONS ---
  const filteredLeads = useMemo(() => {
    const now = new Date();
    return leads.filter((lead) => {
      if (!lead.timestamp) return false;
      const leadDate = new Date(lead.timestamp);
      const diffTime = Math.abs(now - leadDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= timeFrame;
    });
  }, [leads, timeFrame]);

  // Bottom of Funnel (Actual Database Metrics)
  const leadsCaptured = filteredLeads.length;
  const qualifiedLeads = filteredLeads.filter(
    (l) => l.lead_score === "High" || l.lead_score === "Medium",
  ).length;
  const bookedAppointments = filteredLeads.filter(
    (l) =>
      l.booking_status === "Meeting Booked" || l.booked_slot || l.display_time,
  ).length;
  const afterHoursLeads = filteredLeads.filter(
    (l) => l.after_hours_flag === true,
  ).length;

  // Conversion Rates & Values
  const conversionRate =
    conversationsStarted > 0
      ? ((leadsCaptured / conversationsStarted) * 100).toFixed(1)
      : 0;
  const bookingRate =
    leadsCaptured > 0
      ? ((bookedAppointments / leadsCaptured) * 100).toFixed(1)
      : 0;

  // FORMULA: Estimated Opportunity = qualified leads × average job value
  const estimatedValue = qualifiedLeads * avgJobValue;

  // --- AREA CHART DATA PREP ---
  const chartData = useMemo(() => {
    let structure = [];
    for (let i = timeFrame - 1; i >= 0; i--) {
      let d = new Date();
      d.setDate(d.getDate() - i);
      d.setHours(0, 0, 0, 0);
      structure.push({
        label:
          timeFrame <= 7
            ? d.toLocaleDateString("en-US", { weekday: "short" })
            : d.getDate(),
        dateValue: d.getTime(),
        leads: 0,
        convos: 0,
        visitors: 0,
      });
    }

    let totalChartLeads = 0;

    filteredLeads.forEach((lead) => {
      if (!lead.timestamp) return;
      let leadDate = new Date(lead.timestamp);
      leadDate.setHours(0, 0, 0, 0);
      const targetDay = structure.find(
        (d) => d.dateValue === leadDate.getTime(),
      );
      if (targetDay) {
        targetDay.leads += 1;
        totalChartLeads += 1;
      }
    });

    // EXACT DATA SYNCHRONIZATION:
    // Distribute exact global totals across the chart days so the tooltips sum up perfectly to the KPI cards.
    let remainingVisitors = websiteVisitors;
    let remainingConvos = conversationsStarted;

    structure.forEach((day, index) => {
      if (index === structure.length - 1) {
        // The last day catches any rounding remainders to ensure exact match
        day.visitors = Math.max(0, remainingVisitors);
        day.convos = Math.max(0, remainingConvos);
      } else {
        // Distribute proportionally based on lead volume, or evenly if no leads exist
        let visitorShare =
          totalChartLeads > 0
            ? Math.round((day.leads / totalChartLeads) * websiteVisitors)
            : Math.round(websiteVisitors / timeFrame);

        let convoShare =
          totalChartLeads > 0
            ? Math.round((day.leads / totalChartLeads) * conversationsStarted)
            : Math.round(conversationsStarted / timeFrame);

        // Ensure we don't extract more than remaining
        day.visitors = Math.min(visitorShare, remainingVisitors);
        day.convos = Math.min(convoShare, remainingConvos);

        remainingVisitors -= day.visitors;
        remainingConvos -= day.convos;
      }
    });

    return structure;
  }, [filteredLeads, timeFrame, websiteVisitors, conversationsStarted]);

  // --- SVG PATH GENERATION FOR AREA CHART ---
  const svgWidth = 800;
  const svgHeight = 240;
  const maxDataValue = Math.max(...chartData.map((d) => d.visitors), 10);
  const usableHeight = svgHeight - 30;

  const generateSmoothPath = (dataKey) => {
    if (chartData.length === 0) return "";
    const pointX = (index) => (index / (chartData.length - 1)) * svgWidth;
    const pointY = (index) =>
      svgHeight -
      10 -
      (chartData[index][dataKey] / maxDataValue) * usableHeight;

    let path = `M ${pointX(0)} ${pointY(0)}`;
    for (let i = 1; i < chartData.length; i++) {
      const p0x = pointX(i - 1);
      const p0y = pointY(i - 1);
      const p1x = pointX(i);
      const p1y = pointY(i);
      const cx1 = p0x + (p1x - p0x) / 2;
      const cx2 = p0x + (p1x - p0x) / 2;
      path += ` C ${cx1} ${p0y}, ${cx2} ${p1y}, ${p1x} ${p1y}`;
    }
    return path;
  };

  const pathVisitors = generateSmoothPath("visitors");
  const pathConvos = generateSmoothPath("convos");
  const pathLeads = generateSmoothPath("leads");

  // --- DONUT CHART DATA ---
  const droppedConvos = Math.max(conversationsStarted - leadsCaptured, 0);
  const unqualifiedLeads = Math.max(leadsCaptured - qualifiedLeads, 0);
  const qualifiedUnbooked = Math.max(qualifiedLeads - bookedAppointments, 0);

  const funnelSum =
    droppedConvos + unqualifiedLeads + qualifiedUnbooked + bookedAppointments ||
    1;

  // Dasharrays for SVG (Circumference of r=15.915 is 100)
  const pctBooked = (bookedAppointments / funnelSum) * 100;
  const pctQual = (qualifiedUnbooked / funnelSum) * 100;
  const pctUnqual = (unqualifiedLeads / funnelSum) * 100;
  const pctDropped = (droppedConvos / funnelSum) * 100;

  // --- LOADING STATE ---
  if (isLoading) {
    return (
      <main className="relative z-10 flex-grow w-full max-w-[1600px] mx-auto flex items-center justify-center min-h-[60vh] px-4">
        <div className="flex flex-col items-center gap-5 bg-[var(--card-bg)] p-6 sm:p-10 rounded-[2rem] border border-[var(--border-color)] shadow-2xl text-center">
          <svg
            className="animate-spin w-10 h-10 sm:w-12 sm:h-12 text-[var(--primary)] drop-shadow-[0_0_15px_var(--primary)]"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-20"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="3"
            ></circle>
            <path
              className="opacity-100"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p className="text-[var(--foreground-muted)] text-xs sm:text-sm font-bold uppercase tracking-widest animate-pulse">
            Syncing Telemetry...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="relative z-10 mt-2 flex-grow w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 py-4 sm:py-6 fade-in-up">
      {/* ================= HEADER & CONTROLS ================= */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-4 sm:gap-6 mb-6 sm:mb-8 bg-[var(--card-bg)] p-5 sm:p-6 rounded-2xl border border-[var(--border-color)] shadow-sm">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[var(--foreground)] tracking-tight">
            Pulse Overview
          </h1>
          <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-[var(--foreground-muted)] mt-1">
            <span className="relative flex h-2 sm:h-2.5 w-2 sm:w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--primary)] opacity-60"></span>
              <span className="relative inline-flex rounded-full h-2 sm:h-2.5 w-2 sm:w-2.5 bg-[var(--primary)]"></span>
            </span>
            Real-time Funnel Analytics
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 sm:gap-4 w-full lg:w-auto mt-2 lg:mt-0">
          {/* Time Filter */}
          <div className="flex w-full sm:w-auto bg-[var(--background)] border border-[var(--border-color)] rounded-xl p-1">
            <button
              onClick={() => setTimeFrame(7)}
              className={`flex-1 sm:flex-none px-3 sm:px-4 py-1.5 text-[10px] sm:text-xs font-bold rounded-lg transition-all ${timeFrame === 7 ? "bg-[var(--primary)] text-white shadow-sm" : "text-[var(--foreground-muted)] hover:text-[var(--foreground)]"}`}
            >
              7 Days
            </button>
            <button
              onClick={() => setTimeFrame(30)}
              className={`flex-1 sm:flex-none px-3 sm:px-4 py-1.5 text-[10px] sm:text-xs font-bold rounded-lg transition-all ${timeFrame === 30 ? "bg-[var(--primary)] text-white shadow-sm" : "text-[var(--foreground-muted)] hover:text-[var(--foreground)]"}`}
            >
              30 Days
            </button>
          </div>
        </div>
      </div>

      {/* ================= 10 KPI CARDS GRID ================= */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4 mb-6 sm:mb-8">
        {[
          {
            label: "Website Visitors",
            value: websiteVisitors.toLocaleString(),
          },
          { label: "Chatbot Opens", value: chatbotOpens.toLocaleString() },
          {
            label: "Conversations",
            value: conversationsStarted.toLocaleString(),
          },
          {
            label: "Leads Captured",
            value: leadsCaptured.toLocaleString(),
            glow: true,
          },
          { label: "Qualified Leads", value: qualifiedLeads.toLocaleString() },
          {
            label: "Booked Appts",
            value: bookedAppointments.toLocaleString(),
            highlight: true,
          },
          {
            label: "After-Hours Leads",
            value: afterHoursLeads.toLocaleString(),
          },
          { label: "Conversion Rate", value: `${conversionRate}%` },
          { label: "Booking Rate", value: `${bookingRate}%` },
        ].map((kpi, i) => (
          <div
            key={i}
            className={`bg-[var(--card-bg)] border rounded-2xl p-4 sm:p-5 flex flex-col justify-between transition-all hover:-translate-y-1 ${kpi.glow ? "border-[var(--primary)]/50 shadow-[0_4px_20px_var(--lead-glow)]" : "border-[var(--border-color)] hover:border-[var(--foreground-muted)]"}`}
          >
            <span className="text-[9px] sm:text-[10px] font-bold text-[var(--foreground-muted)] uppercase tracking-widest break-words">
              {kpi.label}
            </span>
            <span
              className={`text-xl sm:text-2xl font-black mt-2 sm:mt-3 ${kpi.highlight ? "text-[var(--primary)]" : "text-[var(--foreground)]"}`}
            >
              {kpi.value}
            </span>
          </div>
        ))}

        <div className="bg-gradient-to-br from-[var(--lead-from)] to-[var(--card-bg)] border border-[var(--primary)]/30 rounded-2xl p-4 sm:p-5 flex flex-col justify-between shadow-[0_8px_30px_var(--lead-glow)] col-span-2 md:col-span-3 xl:col-span-1 relative overflow-hidden">
          {/* Glowing orb in the corner */}
          <div className="absolute top-0 right-0 w-20 h-20 sm:w-24 sm:h-24 bg-[var(--primary)] blur-[40px] opacity-20"></div>

          <div className="flex justify-between items-start relative z-10 gap-2">
            <span className="text-[9px] sm:text-[10px] font-bold text-[var(--primary)] uppercase tracking-widest leading-tight w-2/3">
              Estimated Opportunity Value
            </span>
            <span className="text-[7px] sm:text-[8px] border border-[var(--primary)] text-[var(--primary)] px-1.5 py-0.5 rounded uppercase font-bold tracking-widest shrink-0">
              Estimate
            </span>
          </div>

          <span className="text-2xl sm:text-3xl font-black text-[var(--foreground)] mt-2 sm:mt-3 relative z-10">
            ${estimatedValue.toLocaleString()}
          </span>
        </div>
      </div>

      {/* ================= MAIN CHARTS ================= */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 sm:gap-6">
        {/* Area Chart: Traffic Trend */}
        <div className="xl:col-span-8 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl p-4 sm:p-8 shadow-sm flex flex-col overflow-hidden">
          <div className="flex justify-between items-start sm:items-center mb-6 sm:mb-8 flex-col sm:flex-row gap-3 sm:gap-4">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[var(--foreground)]">
                Acquisition Velocity
              </h2>
              <p className="text-[10px] sm:text-xs text-[var(--foreground-muted)] mt-0.5 sm:mt-1">
                Visitors vs Conversations vs Leads
              </p>
            </div>
            <div className="flex flex-wrap gap-3 sm:gap-4 text-[10px] sm:text-xs font-semibold">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="w-2.5 h-1 sm:w-3 rounded-full bg-[var(--foreground-muted)] opacity-30"></div>
                <span className="text-[var(--foreground-muted)] uppercase">
                  Visitors
                </span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="w-2.5 h-1 sm:w-3 rounded-full bg-[var(--accent-blue)]"></div>
                <span className="text-[var(--foreground-muted)] uppercase">
                  Convos
                </span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="w-2.5 h-1 sm:w-3 rounded-full bg-[var(--primary)] shadow-[0_0_8px_var(--primary)]"></div>
                <span className="text-[var(--foreground-muted)] uppercase">
                  Leads
                </span>
              </div>
            </div>
          </div>

          <div className="flex-grow relative h-[220px] sm:h-[300px] w-full mt-2 sm:mt-4">
            {/* Grid Lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-10 pb-6">
              {[1, 2, 3, 4, 5].map((_, i) => (
                <div
                  key={i}
                  className="border-b border-dashed border-[var(--foreground)] w-full"
                ></div>
              ))}
            </div>

            {/* SVG Lines */}
            <svg
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              preserveAspectRatio="none"
              className="absolute inset-0 w-full h-full overflow-visible pb-6 pointer-events-none"
            >
              {animateCharts && (
                <>
                  <path
                    d={`${pathVisitors} L ${svgWidth} ${svgHeight} L 0 ${svgHeight} Z`}
                    fill="var(--foreground-muted)"
                    fillOpacity="0.05"
                    className="fade-in-area"
                  />
                  <path
                    d={pathVisitors}
                    stroke="var(--foreground-muted)"
                    strokeWidth="2"
                    strokeOpacity="0.3"
                    fill="none"
                    className="draw-line-animation"
                  />

                  <path
                    d={`${pathConvos} L ${svgWidth} ${svgHeight} L 0 ${svgHeight} Z`}
                    fill="var(--accent-blue)"
                    fillOpacity="0.1"
                    className="fade-in-area"
                  />
                  <path
                    d={pathConvos}
                    stroke="var(--accent-blue)"
                    strokeWidth="2"
                    fill="none"
                    className="draw-line-animation"
                  />

                  <path
                    d={`${pathLeads} L ${svgWidth} ${svgHeight} L 0 ${svgHeight} Z`}
                    fill="var(--primary)"
                    fillOpacity="0.2"
                    className="fade-in-area"
                  />
                  <path
                    d={pathLeads}
                    stroke="var(--primary)"
                    strokeWidth="3"
                    fill="none"
                    className="draw-line-animation drop-shadow-[0_0_8px_var(--primary)]"
                  />
                </>
              )}
            </svg>

            {/* Interactive Tooltips */}
            <div className="absolute inset-0 flex pb-6">
              {chartData.map((data, idx) => (
                <div
                  key={idx}
                  className="flex-1 h-full flex flex-col justify-end relative group"
                >
                  <div className="absolute inset-x-0 top-0 bottom-0 z-20 cursor-crosshair group-hover:bg-[var(--foreground-muted)]/5 border-x border-transparent group-hover:border-[var(--border-color)]/30 transition-colors">
                    {/* Position tooltip depending on screen side to prevent cutoff */}
                    <div
                      className={`absolute top-0 opacity-0 group-hover:opacity-100 transition-opacity bg-[var(--card-bg)] border border-[var(--border-color)] shadow-xl px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg pointer-events-none z-30 min-w-[90px] sm:min-w-[120px] ${idx < 3 ? "left-0" : idx > chartData.length - 4 ? "right-0" : "left-1/2 -translate-x-1/2"}`}
                    >
                      <span className="text-[9px] sm:text-[10px] font-bold text-[var(--foreground)] mb-1 block border-b border-[var(--border-color)] pb-1">
                        {new Date(data.dateValue).toLocaleDateString()}
                      </span>
                      <div className="text-[10px] sm:text-xs flex justify-between mt-1">
                        <span className="text-[var(--foreground-muted)]">
                          Visitors:
                        </span>{" "}
                        <span className="font-medium text-[var(--foreground)] ml-2">
                          {data.visitors}
                        </span>
                      </div>
                      <div className="text-[10px] sm:text-xs flex justify-between">
                        <span className="text-[var(--foreground-muted)]">
                          Convos:
                        </span>{" "}
                        <span className="font-medium text-[var(--accent-blue)] ml-2">
                          {data.convos}
                        </span>
                      </div>
                      <div className="text-[10px] sm:text-xs flex justify-between">
                        <span className="text-[var(--foreground-muted)]">
                          Leads:
                        </span>{" "}
                        <span className="font-bold text-[var(--primary)] ml-2">
                          {data.leads}
                        </span>
                      </div>
                    </div>
                  </div>
                  {/* Label underneath graph */}
                  {(timeFrame === 7 ||
                    idx % Math.ceil(timeFrame / 7) === 0) && (
                    <span className="absolute -bottom-5 sm:-bottom-6 left-1/2 -translate-x-1/2 text-[8px] sm:text-[10px] font-bold text-[var(--foreground-muted)] uppercase tracking-wider">
                      {data.label}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Funnel Donut Chart */}
        <div className="xl:col-span-4 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl p-4 sm:p-8 shadow-sm flex flex-col items-center">
          <h2 className="text-base sm:text-lg font-bold text-[var(--foreground)] w-full text-left">
            Funnel Breakdown
          </h2>
          <p className="text-[10px] sm:text-xs text-[var(--foreground-muted)] font-medium w-full text-left mb-6 sm:mb-8">
            Conversation progression & fallout
          </p>

          <div className="relative w-40 h-40 sm:w-56 sm:h-56 mb-6 sm:mb-8">
            <svg
              viewBox="0 0 36 36"
              className="w-full h-full transform -rotate-90 drop-shadow-xl"
            >
              {/* Dropped (Background) */}
              <circle
                cx="18"
                cy="18"
                r="15.915"
                fill="transparent"
                stroke="var(--background)"
                strokeWidth="4"
                strokeDasharray={`${animateCharts ? pctDropped : 0} 100`}
                strokeDashoffset={0}
                className="transition-all duration-1000 ease-out"
              />
              {/* Unqualified */}
              <circle
                cx="18"
                cy="18"
                r="15.915"
                fill="transparent"
                stroke="var(--foreground-muted)"
                strokeWidth="4"
                strokeOpacity="0.4"
                strokeDasharray={`${animateCharts ? pctUnqual : 0} 100`}
                strokeDashoffset={`-${animateCharts ? pctDropped : 0}`}
                className="transition-all duration-1000 ease-out"
              />
              {/* Qualified Unbooked */}
              <circle
                cx="18"
                cy="18"
                r="15.915"
                fill="transparent"
                stroke="var(--accent-blue)"
                strokeWidth="4"
                strokeDasharray={`${animateCharts ? pctQual : 0} 100`}
                strokeDashoffset={`-${animateCharts ? pctDropped + pctUnqual : 0}`}
                className="transition-all duration-1000 ease-out"
              />
              {/* Booked */}
              <circle
                cx="18"
                cy="18"
                r="15.915"
                fill="transparent"
                stroke="var(--primary)"
                strokeWidth="4"
                strokeDasharray={`${animateCharts ? pctBooked : 0} 100`}
                strokeDashoffset={`-${animateCharts ? pctDropped + pctUnqual + pctQual : 0}`}
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-[8px] sm:text-[10px] text-[var(--foreground-muted)] font-bold uppercase tracking-widest mb-0.5 sm:mb-1">
                Booked
              </span>
              <span className="text-2xl sm:text-4xl font-black text-[var(--primary)] drop-shadow-[0_0_8px_var(--lead-glow)] transition-opacity duration-1000">
                {animateCharts ? pctBooked.toFixed(0) : 0}%
              </span>
            </div>
          </div>

          <div className="w-full space-y-2.5 sm:space-y-3">
            <div className="flex justify-between items-center text-xs sm:text-sm border-b border-[var(--border-color)] pb-2">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[var(--primary)] rounded-full"></div>
                <span className="text-[var(--foreground)] font-medium">
                  Booked Appointments
                </span>
              </div>
              <span className="font-bold">{bookedAppointments}</span>
            </div>
            <div className="flex justify-between items-center text-xs sm:text-sm border-b border-[var(--border-color)] pb-2">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[var(--accent-blue)] rounded-full"></div>
                <span className="text-[var(--foreground)] font-medium">
                  Qualified (Unbooked)
                </span>
              </div>
              <span className="font-bold">{qualifiedUnbooked}</span>
            </div>
            <div className="flex justify-between items-center text-xs sm:text-sm border-b border-[var(--border-color)] pb-2">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[var(--foreground-muted)] opacity-50 rounded-full"></div>
                <span className="text-[var(--foreground-muted)] font-medium">
                  Unqualified Leads
                </span>
              </div>
              <span className="font-semibold text-[var(--foreground-muted)]">
                {unqualifiedLeads}
              </span>
            </div>
            <div className="flex justify-between items-center text-xs sm:text-sm">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[var(--background)] border border-[var(--border-color)] rounded-full"></div>
                <span className="text-[var(--foreground-muted)] font-medium">
                  Dropped Convos
                </span>
              </div>
              <span className="font-semibold text-[var(--foreground-muted)]">
                {droppedConvos}
              </span>
            </div>
          </div>
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .fade-in-up { animation: fadeInUp 0.6s ease-out forwards; }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
        .draw-line-animation { stroke-dasharray: 3000; stroke-dashoffset: 3000; animation: drawLine 2s cubic-bezier(0.175, 0.885, 0.32, 1) forwards; }
        @keyframes drawLine { to { stroke-dashoffset: 0; } }
        .fade-in-area { opacity: 0; animation: fadeArea 1.5s ease-in forwards; animation-delay: 0.5s; }
        @keyframes fadeArea { to { opacity: 1; } }
      `,
        }}
      />
    </main>
  );
}
