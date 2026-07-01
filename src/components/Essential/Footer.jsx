import React from "react";
import Link from "next/link";
import Image from "next/image";

// --- ASSETS ---
import Logo from "../../assets/logo.png";
import logoWhite from "../../assets/logowhite.png";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  // Links imported directly from your Navbar configuration
  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Problem", path: "/#ProblemSolution" },
    { name: "Solution", path: "/#Solution" },
    { name: "How it Works", path: "/#HowItWorks" },
    { name: "Impact", path: "/#Impact" },
    { name: "Demo", path: "/#Demo" },
    { name: "Final CTA", path: "/#FinalCTA" },
  ];

  return (
    <footer className="relative bg-background border-t border-gridLine overflow-hidden pt-12 md:pt-24 pb-6 md:pb-8 transition-colors duration-300">
      {/* =========================================
          BACKGROUND WATERMARK & GLOW
      ========================================= */}
      <div className="absolute inset-0 z-0 pointer-events-none flex flex-col justify-end overflow-hidden">
        {/* Subtle ambient glow behind the watermark - smaller on mobile */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[400px] md:w-[800px] h-[200px] md:h-[400px] blur-[100px] md:blur-[200px] rounded-full mix-blend-screen opacity-[0.05] transition-colors duration-1000"
          style={{ backgroundColor: "var(--primary)" }}
        ></div>

        {/* Massive Brand Watermark (AICYRO) */}
        <div className="flex justify-center items-end w-full translate-y-[28%] md:translate-y-[28%] select-none">
          <span className="text-[20vw] md:text-[25vw] font-black leading-none tracking-tighter text-foreground opacity-[0.02] uppercase">
            Aicyro
          </span>
        </div>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6">
        {/* =========================================
            MAIN FOOTER CONTENT GRID
        ========================================= */}
        {/* Tighter gaps and margins on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 lg:gap-8 mb-10 md:mb-16">
          {/* Column 1: Brand & Info (Spans 2 columns on large screens) */}
          <div className="lg:col-span-2 flex flex-col items-start">
            {/* THEME-AWARE LOGO - scaled down on mobile */}
            <Link
              href="/"
              className="group flex items-center gap-3 mb-4 md:mb-6"
              aria-label="Aicyro Home"
            >
              {/* Light Mode Logo */}
              <Image
                src={logoWhite}
                alt="Aicyro Solutions Logo"
                className="w-24 md:w-40 h-auto object-contain dark:hidden transition-transform group-hover:scale-105"
              />
              {/* Dark Mode Logo */}
              <Image
                src={Logo}
                alt="Aicyro Solutions Logo"
                className="hidden w-24 md:w-40 h-auto object-contain dark:block transition-transform group-hover:scale-105"
              />
            </Link>

            {/* Smaller text on mobile */}
            <p className="text-muted text-sm md:text-base leading-relaxed max-w-sm mb-6 md:mb-8">
              The autonomous lead capture and conversion system. Turn your
              website traffic into a 24/7 revenue engine and stop losing
              customers to faster competitors.
            </p>

            {/* Social Links - smaller icons on mobile */}
            <div className="flex items-center gap-3 md:gap-4">
              <a
                href="#"
                aria-label="Twitter"
                className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-card border border-gridLine flex items-center justify-center text-muted hover:text-foreground hover:border-foreground transition-all duration-300"
              >
                <svg
                  className="w-3 h-3 md:w-4 md:h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="#"
                aria-label="LinkedIn"
                className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-card border border-gridLine flex items-center justify-center text-muted hover:text-foreground hover:border-foreground transition-all duration-300"
              >
                <svg
                  className="w-3 h-3 md:w-4 md:h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links (From Navbar) */}
          <div className="mt-2 md:mt-0">
            <h4 className="text-xs md:text-sm font-bold text-foreground uppercase tracking-wider mb-4 md:mb-6 border-b border-gridLine/50 pb-2 inline-block">
              Navigation
            </h4>
            {/* Tighter line heights on mobile */}
            <ul className="space-y-3 md:space-y-4">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.path}
                    className="text-muted hover:text-foreground hover:translate-x-1 inline-block text-xs md:text-sm font-medium transition-all duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Legal & Support */}
          <div className="mt-2 lg:mt-0">
            <h4 className="text-xs md:text-sm font-bold text-foreground uppercase tracking-wider mb-4 md:mb-6 border-b border-gridLine/50 pb-2 inline-block">
              Legal
            </h4>
            <ul className="space-y-3 md:space-y-4">
              <li>
                <Link
                  href="/privacy"
                  className="text-muted hover:text-foreground text-xs md:text-sm font-medium transition-colors duration-200"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/termofuse"
                  className="text-muted hover:text-foreground text-xs md:text-sm font-medium transition-colors duration-200"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/cookie"
                  className="text-muted hover:text-foreground text-xs md:text-sm font-medium transition-colors duration-200"
                >
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* =========================================
            BOTTOM BAR
        ========================================= */}
        <div className="border-t border-gridLine/50 pt-6 md:pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs md:text-sm text-muted font-medium text-center md:text-left">
            &copy; {currentYear} Aicyro. All rights reserved.
          </p>

          <div className="flex items-center gap-2 bg-card/50 border border-gridLine px-3 md:px-4 py-1.5 md:py-2 rounded-full backdrop-blur-sm shadow-sm">
            <span className="relative flex h-1.5 w-1.5 md:h-2 md:w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 md:h-2 md:w-2 bg-green-500"></span>
            </span>
            <span className="text-[10px] md:text-xs font-mono font-semibold text-muted">
              All systems operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
