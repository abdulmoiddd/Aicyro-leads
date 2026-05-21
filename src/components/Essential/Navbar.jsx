import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import ThemeToggle from "../ThemeToggle";

// --- ASSETS ---
import Logo from "../../assets/logo.png";
import logoWhite from "../../assets/logowhite.png";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle scroll detection for the glass effect
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isMobileMenuOpen]);

  // FIXED: Added '/' prefix to force Next.js to the home page first,
  // and used clean, lowercase IDs to match the section tags.
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
    <>
      <header
        className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 ${
          isScrolled
            ? "bg-background/80 backdrop-blur-xl border-b border-gridLine shadow-sm py-3"
            : "bg-transparent border-b border-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          {/* =========================================
              BRAND LOGO
          ========================================= */}
          <Link
            href="/"
            className="flex items-center z-50 group"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            {/* Light Mode Logo - Widened for Landscape Image */}
            <Image
              src={logoWhite}
              alt="Aicyro Solutions Logo"
              className="w-40 md:w-48 h-auto object-contain dark:hidden transition-transform group-hover:scale-105"
            />
            {/* Dark Mode Logo - Widened for Landscape Image */}
            <Image
              src={Logo}
              alt="Aicyro Solutions Logo"
              className="hidden w-40 md:w-48 h-auto object-contain dark:block transition-transform group-hover:scale-105"
            />
          </Link>

          {/* =========================================
              DESKTOP NAVIGATION
          ========================================= */}
          <nav className="hidden md:flex items-center gap-1 bg-card/50 backdrop-blur-md border border-gridLine rounded-full px-2 py-1 shadow-sm">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.path}
                className="px-5 py-2 text-sm font-semibold text-muted hover:text-foreground hover:bg-foreground/5 rounded-full transition-all duration-200"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* =========================================
              DESKTOP ACTIONS
          ========================================= */}
          <div className="hidden md:flex items-center gap-4 z-50">
            <ThemeToggle />
            <Link
              href="/#audit"
              className="px-5 py-2.5 text-sm font-bold text-background bg-foreground rounded-full hover:scale-105 hover:shadow-lg transition-all duration-300 shadow-md"
            >
              Analyze My Website
            </Link>
          </div>

          {/* =========================================
              MOBILE TOGGLE BUTTON
          ========================================= */}
          <div className="flex md:hidden items-center gap-3 z-50">
            <ThemeToggle />
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 -mr-2 text-foreground hover:bg-foreground/5 rounded-lg transition-colors focus:outline-none"
              aria-label="Open mobile menu"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* =========================================
          MOBILE SIDE DRAWER
      ========================================= */}
      {/* Blurred Backdrop */}
      <div
        className={`fixed inset-0 z-50 bg-background/80 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
        aria-hidden="true"
      />

      {/* Slide-out Panel */}
      <div
        className={`fixed top-0 right-0 bottom-0 z-50 w-[280px] sm:w-[320px] bg-card border-l border-gridLine shadow-2xl transform transition-transform duration-300 ease-out md:hidden flex flex-col ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Panel Header */}
        <div className="flex items-center justify-between p-4 border-b border-gridLine">
          <span className="text-lg font-black text-foreground ml-2 tracking-tight">
            Navigation
          </span>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-2 text-muted hover:text-foreground transition-colors bg-background rounded-full border border-gridLine hover:bg-foreground/5"
            aria-label="Close menu"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Panel Links */}
        <div className="flex flex-col flex-1 py-6 px-4 gap-2 overflow-y-auto">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-4 py-3.5 text-lg font-semibold text-muted hover:text-foreground hover:bg-foreground/5 rounded-xl transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Panel Footer */}
        <div className="p-6 border-t border-gridLine bg-background/50">
          <Link
            href="/#audit"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center justify-center w-full py-4 text-base font-bold text-white bg-primary rounded-xl hover:bg-primary/90 transition-all shadow-[0_0_20px_rgba(138,43,226,0.3)] hover:-translate-y-0.5"
          >
            Analyze My Website
          </Link>
        </div>
      </div>
    </>
  );
}
