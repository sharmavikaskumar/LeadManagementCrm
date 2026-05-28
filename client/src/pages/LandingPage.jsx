import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Zap,
  Users,
  TrendingUp,
  Phone,
  Mail,
  ArrowRight,
  Shield,
  Activity,
  Check,
  HelpCircle,
  Menu,
  X,
  ChevronDown,
  Clock,
  Sparkles,
  BarChart2,
  Cpu,
  Orbit,
  Atom,
  Globe,
  Plus,
  Sun,
  Moon
} from "lucide-react";

export default function LandingPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [billingCycle, setBillingCycle] = useState("monthly"); // "monthly" | "annually"
  const [activeTab, setActiveTab] = useState("pipeline"); // "pipeline" | "leads" | "analytics"
  const [faqOpen, setFaqOpen] = useState(null);
  const [contactEmail, setContactEmail] = useState("");
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [theme, setTheme] = useState("dark"); // "dark" | "light"

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("token"));
    // Auto-detect theme
    const savedTheme = localStorage.getItem("landing-theme");
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setTheme(prefersDark ? "dark" : "light");
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("landing-theme", nextTheme);
    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (contactEmail.trim()) {
      setContactSubmitted(true);
      setContactEmail("");
      setTimeout(() => setContactSubmitted(false), 5000);
    }
  };

  const toggleFaq = (index) => {
    setFaqOpen(faqOpen === index ? null : index);
  };

  const isDark = theme === "dark";

  // Mock CRM Data for the Simulator
  const mockLeads = [
    { name: "Bruce Wayne", company: "Wayne Enterprises", value: "$240,000", status: "qualified", date: "Just now", rep: "BW" },
    { name: "Diana Prince", company: "Themyscira Ltd", value: "$95,000", status: "contacted", date: "8 mins ago", rep: "DP" },
    { name: "Tony Stark", company: "Stark Industries", value: "$480,000", status: "new", date: "1 hour ago", rep: "TS" },
    { name: "Clark Kent", company: "Daily Planet", value: "$30,000", status: "closed", date: "1 day ago", rep: "CK" }
  ];

  const pipelineStages = [
    {
      id: "new",
      name: "New Leads",
      color: "bg-blue-500 shadow-blue-500/50",
      leads: [
        { name: "Tony Stark", company: "Stark Industries", value: "$480K" },
        { name: "Barry Allen", company: "S.T.A.R. Labs", value: "$45K" }
      ]
    },
    {
      id: "contacted",
      name: "Contacted",
      color: "bg-purple-500 shadow-purple-500/50",
      leads: [
        { name: "Diana Prince", company: "Themyscira Ltd", value: "$95K" }
      ]
    },
    {
      id: "qualified",
      name: "Qualified",
      color: "bg-emerald-500 shadow-emerald-500/50",
      leads: [
        { name: "Bruce Wayne", company: "Wayne Enterprises", value: "$240K" },
        { name: "Arthur Curry", company: "Atlantis Corp", value: "$130K" }
      ]
    },
    {
      id: "closed",
      name: "Closed Won",
      color: "bg-slate-500 shadow-slate-500/50",
      leads: [
        { name: "Clark Kent", company: "Daily Planet", value: "$30K" }
      ]
    }
  ];

  const faqs = [
    {
      q: "How does the automated routing work?",
      a: "Our system uses criteria-based rules to automatically assign incoming leads to specific sales representatives. You can toggle assignment rules, set active hours, and track individual representative loads."
    },
    {
      q: "Can I import lead CSVs directly?",
      a: "Yes, easily. The smart importer maps columns automatically and matches lead status categories to prevent duplicate rows."
    },
    {
      q: "What makes this CRM interface unique?",
      a: "We combine zero-weight layouts with clear visual pipeline stages, smart SLA reminders, and micro-analytics to help reps process accounts faster with minimal cognitive friction."
    },
    {
      q: "Is data isolation guaranteed?",
      a: "Absolutely. All databases use TLS 1.3 transit encryption and separate keys to guarantee client privacy."
    }
  ];

  return (
    <div className={`min-h-screen font-sans selection:bg-[#00c8b4]/30 transition-colors duration-300 relative overflow-hidden ${
      isDark ? "bg-[#030712] text-white selection:text-white" : "bg-white text-black selection:text-black"
    }`}>
      {/* CSS Keyframes for AntiGravity Floating Design */}
      <style>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(0.5deg); }
        }
        @keyframes float-mid {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(12px) rotate(-0.5deg); }
        }
        @keyframes orbit-glow {
          0% { transform: translate(-50%, -50%) rotate(0deg); }
          100% { transform: translate(-50%, -50%) rotate(360deg); }
        }
        .animate-float-1 {
          animation: float-slow 7s ease-in-out infinite;
        }
        .animate-float-2 {
          animation: float-mid 9s ease-in-out infinite;
        }
        .grid-bg-dark {
          background-image: 
            linear-gradient(to right, rgba(99, 102, 241, 0.04) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(99, 102, 241, 0.04) 1px, transparent 1px);
          background-size: 40px 40px;
        }
        .grid-bg-light {
          background-image: 
            linear-gradient(to right, rgba(99, 102, 241, 0.02) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(99, 102, 241, 0.02) 1px, transparent 1px);
          background-size: 40px 40px;
        }
        .glass-panel-dark {
          background: rgba(15, 23, 42, 0.45);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.06);
        }
        .glass-panel-light {
          background: rgba(248, 250, 252, 0.7);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(0, 0, 0, 0.06);
        }
        .glass-panel-hover:hover {
          border-color: rgba(37, 99, 235, 0.35);
          box-shadow: 0 12px 30px -10px rgba(37, 99, 235, 0.15);
          transform: translateY(-5px);
        }
        .glowing-btn {
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
        }
        .glowing-btn::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transform: translateX(-100%);
          transition: transform 0.6s ease;
        }
        .glowing-btn:hover::after {
          transform: translateX(100%);
        }
      `}</style>

      {/* ── BACKGROUND GRID & GLOWS ── */}
      <div className={`absolute inset-0 pointer-events-none z-0 ${isDark ? "grid-bg-dark" : "grid-bg-light"}`} />
      {isDark && (
        <>
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-900/10 blur-[150px] pointer-events-none animate-pulse" />
          <div className="absolute top-[20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-purple-900/15 blur-[160px] pointer-events-none" />
          <div className="absolute bottom-[-10%] left-[20%] w-[50%] h-[50%] rounded-full bg-cyan-950/20 blur-[140px] pointer-events-none animate-pulse" />
        </>
      )}

      {/* ── HEADER / NAVIGATION ── */}
      <header className={`sticky top-0 z-50 backdrop-blur-md border-b transition-colors duration-300 ${
        isDark ? "bg-[#030712]/60 border-slate-900" : "bg-white/70 border-slate-200"
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/25 shrink-0">
                <Zap className="w-5 h-5 text-white font-black" />
              </div>
              <div>
                <span className={`text-base font-extrabold tracking-tight block ${isDark ? "text-white" : "text-black"}`}>
                  LeadFlow <span className="text-blue-500 font-normal">CRM</span>
                </span>
                <span className="text-[9px] uppercase tracking-widest text-slate-450 font-bold block -mt-1">
                  Sales Accelerator
                </span>
              </div>
            </div>

            {/* Desktop Nav Links */}
            <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
              <a href="#features" className={`hover:text-blue-500 transition-colors ${isDark ? "hover:text-white" : "hover:text-black"}`}>Features</a>
              <a href="#demo" className={`hover:text-blue-500 transition-colors ${isDark ? "hover:text-white" : "hover:text-black"}`}>Sandbox</a>
              <a href="#pricing" className={`hover:text-blue-500 transition-colors ${isDark ? "hover:text-white" : "hover:text-black"}`}>Pricing</a>
              <a href="#faq" className={`hover:text-blue-500 transition-colors ${isDark ? "hover:text-white" : "hover:text-black"}`}>FAQ</a>
              <a href="#contact" className={`hover:text-blue-500 transition-colors ${isDark ? "hover:text-white" : "hover:text-black"}`}>Outreach</a>
            </nav>

            {/* Actions: Theme Toggle + Auth */}
            <div className="hidden md:flex items-center gap-4">
              <button
                onClick={toggleTheme}
                className={`p-2 border rounded-xl transition-colors ${
                  isDark ? "border-slate-800 text-slate-400 hover:text-white hover:bg-slate-900" : "border-slate-250 text-slate-500 hover:text-black hover:bg-slate-100"
                }`}
                aria-label="Toggle Theme Mode"
              >
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>

              {isLoggedIn ? (
                <Link
                  to="/dashboard"
                  className="glowing-btn flex items-center gap-1.5 px-5.5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-lg shadow-blue-500/20 transition-all duration-300"
                >
                  Enter Dashboard
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-xs font-semibold text-slate-400 hover:text-current px-3 py-2 transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="px-4.5 py-2.5 rounded-xl border border-blue-500/30 hover:border-blue-500 bg-blue-500/5 hover:bg-blue-500/10 text-blue-500 dark:text-blue-400 text-xs font-semibold transition-all duration-300"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Actions */}
            <div className="flex items-center gap-2 md:hidden">
              <button
                onClick={toggleTheme}
                className={`p-2 border rounded-xl ${
                  isDark ? "border-slate-850 text-slate-400" : "border-slate-200 text-slate-500"
                }`}
              >
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-slate-400 hover:bg-slate-900 hover:text-white md:hidden transition-colors"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className={`md:hidden border-t px-4 pt-2 pb-6 space-y-4 shadow-2xl transition-colors duration-300 ${
            isDark ? "border-slate-900 bg-black" : "border-slate-200 bg-white"
          }`}>
            <div className="flex flex-col gap-1 font-semibold text-slate-400 text-xs">
              <a href="#features" onClick={() => setMobileMenuOpen(false)} className={`py-3 px-3 transition-colors ${isDark ? "hover:bg-slate-900 hover:text-white" : "hover:bg-slate-100 hover:text-black"}`}>Features</a>
              <a href="#demo" onClick={() => setMobileMenuOpen(false)} className={`py-3 px-3 transition-colors ${isDark ? "hover:bg-slate-900 hover:text-white" : "hover:bg-slate-100 hover:text-black"}`}>Sandbox</a>
              <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className={`py-3 px-3 transition-colors ${isDark ? "hover:bg-slate-900 hover:text-white" : "hover:bg-slate-100 hover:text-black"}`}>Pricing</a>
              <a href="#faq" onClick={() => setMobileMenuOpen(false)} className={`py-3 px-3 transition-colors ${isDark ? "hover:bg-slate-900 hover:text-white" : "hover:bg-slate-100 hover:text-black"}`}>FAQ</a>
              <a href="#contact" onClick={() => setMobileMenuOpen(false)} className={`py-3 px-3 transition-colors ${isDark ? "hover:bg-slate-900 hover:text-white" : "hover:bg-slate-100 hover:text-black"}`}>Outreach</a>
            </div>
            <div className="h-px bg-neutral-900 my-2" />
            <div className="flex flex-col gap-2 px-3">
              {isLoggedIn ? (
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-1.5 py-3 rounded-xl bg-blue-600 text-white text-xs font-semibold shadow-lg shadow-blue-500/20"
                >
                  Enter Dashboard
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="w-full text-center py-2.5 text-xs font-semibold text-slate-400 hover:text-current transition-colors">Sign In</Link>
                  <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="w-full text-center py-2.5 rounded-xl border border-blue-500/35 bg-blue-500/5 text-blue-500 text-xs font-semibold">Sign Up</Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* ── HERO SECTION ── */}
      <section className="relative pt-12 pb-24 sm:pt-20 sm:pb-36 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Stark Badge */}
          <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-medium transition-colors duration-300 ${
            isDark ? "border-blue-500/20 bg-blue-950/20 text-blue-400" : "border-blue-200 bg-blue-50 text-blue-700"
          }`}>
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>AntiGravity CRM engine: Suspend cognitive friction</span>
          </div>

          {/* Hero Headings */}
          <h1 className={`text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-5xl mx-auto leading-[1.05] transition-colors duration-300 ${
            isDark ? "text-white" : "text-black"
          }`}>
            Defy Gravity in Your <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-400 bg-clip-text text-transparent">
              Sales Pipeline
            </span>
          </h1>

          <p className="mt-6 text-sm sm:text-base text-slate-550 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
            Experience the floating CRM model. Track leads, auto-route outreach status, and measure conversion ratios on a sleek, zero-friction interface designed for high-performance sales.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4.5">
            {isLoggedIn ? (
              <Link
                to="/dashboard"
                className="glowing-btn w-full sm:w-auto px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/35 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2"
              >
                Launch Dashboard
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="glowing-btn w-full sm:w-auto px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/35 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  Sign Up Free
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/login"
                  className={`w-full sm:w-auto px-8 py-4 rounded-xl border font-semibold hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 ${
                    isDark ? "border-slate-800 bg-slate-900/50 hover:bg-slate-900 text-white" : "border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800"
                  }`}
                >
                  Sign In
                </Link>
              </>
            )}
          </div>

          {/* Checklist */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs text-slate-400 font-medium">
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-blue-500" /> Free sandbox access
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-blue-500" /> Zero-friction UI configuration
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-blue-500" /> Active team routing
            </span>
          </div>

          {/* ── HERO APP PREVIEW ── */}
          <div className="mt-16 sm:mt-24 max-w-5xl mx-auto relative group animate-float-1">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/15 to-cyan-500/10 rounded-2xl filter blur-2xl opacity-40 group-hover:opacity-60 transition-opacity duration-700 pointer-events-none" />

            <div className={`relative rounded-2xl border p-3 sm:p-4 shadow-2xl overflow-hidden backdrop-blur-xl ${
              isDark ? "border-slate-900 bg-slate-950/80 shadow-blue-950/20" : "border-slate-200 bg-slate-50 shadow-slate-200/50"
            }`}>
              {/* Window Header */}
              <div className={`flex items-center justify-between pb-3 sm:pb-4 border-b ${isDark ? "border-slate-900" : "border-slate-200"}`}>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-rose-500/60" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/60" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/60" />
                  <span className="ml-2.5 text-[10px] font-bold text-slate-500 tracking-widest hidden sm:inline uppercase">
                    leadflow_system_node_preview.env
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
                  <span className="text-[9px] text-blue-500 font-bold uppercase tracking-widest bg-blue-500/10 px-2 py-0.5 rounded-full">
                    Active Gravity Engine
                  </span>
                </div>
              </div>

              {/* Fake Dashboard Content */}
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-4 gap-4 text-left">
                {/* Stats */}
                <div className="col-span-full grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className={`p-3 border rounded-xl ${isDark ? "bg-slate-900/40 border-slate-900" : "bg-white border-slate-200"}`}>
                    <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">Total leads</span>
                    <div className={`text-xl font-extrabold mt-1 ${isDark ? "text-white" : "text-black"}`}>1,248</div>
                  </div>
                  <div className={`p-3 border rounded-xl ${isDark ? "bg-slate-900/40 border-slate-900" : "bg-white border-slate-200"}`}>
                    <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">contacted</span>
                    <div className={`text-xl font-extrabold mt-1 ${isDark ? "text-white" : "text-black"}`}>542</div>
                  </div>
                  <div className={`p-3 border rounded-xl ${isDark ? "bg-slate-900/40 border-slate-900" : "bg-white border-slate-200"}`}>
                    <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">qualified</span>
                    <div className={`text-xl font-extrabold mt-1 ${isDark ? "text-white" : "text-black"}`}>198</div>
                  </div>
                  <div className={`p-3 border rounded-xl ${isDark ? "bg-slate-900/40 border-slate-900" : "bg-white border-slate-200"}`}>
                    <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">revenue won</span>
                    <div className={`text-xl font-extrabold mt-1 ${isDark ? "text-white" : "text-black"}`}>$45,800</div>
                  </div>
                </div>

                {/* Left Mini Sidebar */}
                <div className={`hidden sm:block p-3 border rounded-xl ${isDark ? "bg-slate-900/20 border-slate-900" : "bg-white border-slate-200"}`}>
                  <div className="text-[9px] font-bold text-slate-650 tracking-wider uppercase px-2 mb-2">Workspace</div>
                  <div className="px-2 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-lg flex items-center gap-2">
                    <Orbit className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '8s' }} /> Pipeline View
                  </div>
                  <div className="px-2 py-1.5 text-slate-500 hover:text-current text-xs font-medium rounded-lg flex items-center gap-2 hover:bg-slate-900/40 transition-colors">
                    <TrendingUp className="w-3.5 h-3.5" /> Reports
                  </div>
                  <div className="px-2 py-1.5 text-slate-500 hover:text-current text-xs font-medium rounded-lg flex items-center gap-2 hover:bg-slate-900/40 transition-colors">
                    <Users className="w-3.5 h-3.5" /> Client List
                  </div>
                </div>

                {/* Right Pipeline Grid */}
                <div className={`sm:col-span-3 p-4 border rounded-xl ${isDark ? "bg-slate-900/40 border-slate-900" : "bg-white border-slate-200"}`}>
                  <div className={`flex items-center justify-between pb-3 border-b mb-3 ${isDark ? "border-slate-900" : "border-slate-200"}`}>
                    <span className={`text-xs font-bold tracking-tight ${isDark ? "text-white" : "text-black"}`}>Deal Stage Simulator</span>
                    <span className="text-[9px] text-slate-500">Live Stage Indicators</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div className={`p-2 rounded-lg border ${isDark ? "bg-black border-slate-900" : "bg-white border-slate-200"}`}>
                      <div className="flex items-center justify-between gap-1 mb-2">
                        <span className="text-[9px] font-bold text-blue-500 uppercase">Incoming</span>
                        <span className="text-[8px] bg-blue-500/10 text-blue-500 px-1.5 rounded">2</span>
                      </div>
                      <div className={`p-2 border rounded ${isDark ? "bg-slate-900/60 border-slate-900" : "bg-slate-50 border-slate-200"} mb-1.5`}>
                        <div className={`text-[10px] font-bold ${isDark ? "text-white" : "text-black"}`}>Bruce Wayne</div>
                        <div className="text-[8px] text-slate-650">Wayne Ent.</div>
                      </div>
                      <div className={`p-2 border rounded ${isDark ? "bg-slate-900/60 border-slate-900" : "bg-slate-50 border-slate-200"}`}>
                        <div className={`text-[10px] font-bold ${isDark ? "text-white" : "text-black"}`}>Diana Prince</div>
                        <div className="text-[8px] text-slate-600">Themyscira Ltd</div>
                      </div>
                    </div>

                    <div className={`p-2 rounded-lg border ${isDark ? "bg-black border-slate-900" : "bg-white border-slate-200"}`}>
                      <div className="flex items-center justify-between gap-1 mb-2">
                        <span className="text-[9px] font-bold text-purple-500 uppercase">Outreach</span>
                        <span className="text-[8px] bg-purple-500/10 text-purple-500 px-1.5 rounded">1</span>
                      </div>
                      <div className={`p-2 border rounded ${isDark ? "bg-slate-900/60 border-slate-900" : "bg-slate-50 border-slate-200"}`}>
                        <div className={`text-[10px] font-bold ${isDark ? "text-white" : "text-black"}`}>Tony Stark</div>
                        <div className="text-[8px] text-slate-650">Stark Indus.</div>
                      </div>
                    </div>

                    <div className={`p-2 rounded-lg border ${isDark ? "bg-black border-slate-900" : "bg-white border-slate-200"}`}>
                      <div className="flex items-center justify-between gap-1 mb-2">
                        <span className="text-[9px] font-bold text-emerald-500 uppercase">Qualified</span>
                        <span className="text-[8px] bg-emerald-500/10 text-emerald-500 px-1.5 rounded">1</span>
                      </div>
                      <div className={`p-2 border rounded ${isDark ? "bg-slate-900/60 border-emerald-500/30" : "bg-slate-50 border-emerald-200"}`}>
                        <div className={`text-[10px] font-bold flex items-center justify-between ${isDark ? "text-white" : "text-black"}`}>
                          <span>Arthur Curry</span>
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping" />
                        </div>
                        <div className="text-[8px] text-slate-650">Atlantis Corp.</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── LOGO CLOUD ── */}
      <section className={`py-8 border-t border-b transition-colors duration-300 ${
        isDark ? "bg-black border-slate-950" : "bg-slate-50 border-slate-250"
      }`}>
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold mb-5">
            Empowering Outreach Velocity in High-Performing Teams
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 opacity-30 grayscale font-bold tracking-widest text-xs text-slate-400">
            <span>STRIPE SYSTEM</span>
            <span>ACME CORP</span>
            <span>SLACK LABS</span>
            <span>VERCEL STARK</span>
            <span>FIGMA ORBIT</span>
          </div>
        </div>
      </section>

      {/* ── METRICS SECTION ── */}
      <section className="py-20 sm:py-28 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className={`p-8 border rounded-2xl transition-all duration-300 ${
              isDark ? "glass-panel-dark glass-panel-hover" : "glass-panel-light glass-panel-hover"
            }`}>
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/25 flex items-center justify-center mb-6">
                <Clock className="w-6 h-6 text-blue-500" />
              </div>
              <h3 className={`text-2xl font-bold uppercase tracking-wider ${isDark ? "text-white" : "text-black"}`}>3.4× Faster</h3>
              <p className="text-[9px] font-bold text-blue-500 mt-1 uppercase tracking-widest">Outreach response speed</p>
              <p className="text-slate-400 mt-4 text-xs leading-relaxed">
                Connect with clients immediately when they express interest. Automate notifications to reps and reduce outreach timelines.
              </p>
            </div>

            <div className={`p-8 border rounded-2xl transition-all duration-300 ${
              isDark ? "glass-panel-dark glass-panel-hover" : "glass-panel-light glass-panel-hover"
            }`}>
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/25 flex items-center justify-center mb-6">
                <TrendingUp className="w-6 h-6 text-indigo-500" />
              </div>
              <h3 className={`text-2xl font-bold uppercase tracking-wider ${isDark ? "text-white" : "text-black"}`}>68% Increase</h3>
              <p className="text-[9px] font-bold text-indigo-500 mt-1 uppercase tracking-widest">Pipeline conversion ratio</p>
              <p className="text-slate-400 mt-4 text-xs leading-relaxed">
                By never letting a single potential contact slip through the cracks, teams report higher close ratios and target forecasts.
              </p>
            </div>

            <div className={`p-8 border rounded-2xl transition-all duration-300 ${
              isDark ? "glass-panel-dark glass-panel-hover" : "glass-panel-light glass-panel-hover"
            }`}>
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/25 flex items-center justify-center mb-6">
                <Shield className="w-6 h-6 text-cyan-500" />
              </div>
              <h3 className={`text-2xl font-bold uppercase tracking-wider ${isDark ? "text-white" : "text-black"}`}>Zero Friction</h3>
              <p className="text-[9px] font-bold text-cyan-500 mt-1 uppercase tracking-widest">UI Weight Density</p>
              <p className="text-slate-400 mt-4 text-xs leading-relaxed">
                Designed to minimize database latency and user steps. Manage lists, update roles, and delegate incoming leads without visual distraction.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES SECTION ── */}
      <section id="features" className={`py-20 sm:py-28 relative border-t transition-colors duration-300 ${
        isDark ? "border-slate-900" : "border-slate-200"
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
            <h2 className="text-xs uppercase tracking-widest text-blue-500 font-bold">Feature Highlights</h2>
            <p className={`text-3xl sm:text-4xl font-extrabold mt-2 transition-colors duration-300 ${isDark ? "text-white" : "text-black"}`}>
              Everything you need to master your sales cycle
            </p>
            <p className="text-slate-500 mt-4 text-xs sm:text-sm leading-relaxed">
              Ditch messy spreadsheets and legacy databases. LeadFlow CRM brings your entire pipeline to life with simple, powerful components built for conversion.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Feature 1 */}
            <div className={`p-6 border rounded-2xl transition-all duration-300 ${
              isDark ? "glass-panel-dark glass-panel-hover" : "glass-panel-light glass-panel-hover"
            }`}>
              <div className="w-11 h-11 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500">
                <Cpu className="w-5 h-5 animate-pulse" />
              </div>
              <h3 className={`text-base font-bold mt-5 ${isDark ? "text-white" : "text-black"}`}>Lead Capturing & Routing</h3>
              <p className="text-slate-500 mt-2 text-xs leading-relaxed">
                Capture new leads instantly. Route them directly to appropriate reps to ensure immediate follow-up and engagement.
              </p>
            </div>

            {/* Feature 2 */}
            <div className={`p-6 border rounded-2xl transition-all duration-300 ${
              isDark ? "glass-panel-dark glass-panel-hover" : "glass-panel-light glass-panel-hover"
            }`}>
              <div className="w-11 h-11 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-500">
                <Orbit className="w-5 h-5 animate-spin" style={{ animationDuration: '10s' }} />
              </div>
              <h3 className={`text-base font-bold mt-5 ${isDark ? "text-white" : "text-black"}`}>Visual Stage Pipelines</h3>
              <p className="text-slate-500 mt-2 text-xs leading-relaxed">
                Categorize leads by status. Move them effortlessly between New, Contacted, Qualified, and Closed stages as deal progress is logged.
              </p>
            </div>

            {/* Feature 3 */}
            <div className={`p-6 border rounded-2xl transition-all duration-300 ${
              isDark ? "glass-panel-dark glass-panel-hover" : "glass-panel-light glass-panel-hover"
            }`}>
              <div className="w-11 h-11 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-500">
                <BarChart2 className="w-5 h-5" />
              </div>
              <h3 className={`text-base font-bold mt-5 ${isDark ? "text-white" : "text-black"}`}>Smart Action Analytics</h3>
              <p className="text-slate-500 mt-2 text-xs leading-relaxed">
                Monitor performance with live metrics. Instantly see conversion charts, closed deals counts, and active client distributions.
              </p>
            </div>

            {/* Feature 4 */}
            <div className={`p-6 border rounded-2xl transition-all duration-300 ${
              isDark ? "glass-panel-dark glass-panel-hover" : "glass-panel-light glass-panel-hover"
            }`}>
              <div className="w-11 h-11 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
                <Activity className="w-5 h-5" />
              </div>
              <h3 className={`text-base font-bold mt-5 ${isDark ? "text-white" : "text-black"}`}>Client Activity History</h3>
              <p className="text-slate-500 mt-2 text-xs leading-relaxed">
                Keep an audit log of email exchanges, follow-up calls, and lead data updates to ensure a coherent sales team context.
              </p>
            </div>

            {/* Feature 5 */}
            <div className={`p-6 border rounded-2xl transition-all duration-300 ${
              isDark ? "glass-panel-dark glass-panel-hover" : "glass-panel-light glass-panel-hover"
            }`}>
              <div className="w-11 h-11 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-550">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className={`text-base font-bold mt-5 ${isDark ? "text-white" : "text-black"}`}>SLA Reminders</h3>
              <p className="text-slate-500 mt-2 text-xs leading-relaxed">
                Flag stale leads automatically. Get visual cues and reminders when a lead has remained in a contacted stage too long without action.
              </p>
            </div>

            {/* Feature 6 */}
            <div className={`p-6 border rounded-2xl transition-all duration-300 ${
              isDark ? "glass-panel-dark glass-panel-hover" : "glass-panel-light glass-panel-hover"
            }`}>
              <div className="w-11 h-11 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-500">
                <Atom className="w-5 h-5" />
              </div>
              <h3 className={`text-base font-bold mt-5 ${isDark ? "text-white" : "text-black"}`}>Custom Team Roles</h3>
              <p className="text-slate-500 mt-2 text-xs leading-relaxed">
                Control access by role. Distinguish between Admin actions and Member pipelines to protect database integrity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── INTERACTIVE WORKSPACE SIMULATOR ── */}
      <section id="demo" className={`py-20 sm:py-24 border-t border-b transition-colors duration-300 ${
        isDark ? "border-slate-900" : "border-slate-200"
      }`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <span className={`text-xs uppercase font-bold tracking-widest px-3 py-1 rounded-full border ${
              isDark ? "border-blue-500/20 bg-blue-950/20 text-blue-400" : "border-blue-200 bg-blue-50 text-blue-700"
            }`}>
              Interactive Sandbox
            </span>
            <h2 className={`text-2xl sm:text-3xl font-extrabold mt-4 uppercase tracking-wide transition-colors duration-300 ${isDark ? "text-white" : "text-black"}`}>
              Try the lead scheduler
            </h2>
            <p className="text-xs text-slate-550 dark:text-slate-400 mt-2 leading-relaxed">
              Explore how lead data changes based on stage movements. Toggle the mockup tabs below to preview the pipeline manager interface.
            </p>
          </div>

          {/* Tabs */}
          <div className={`flex justify-center border-b mb-8 max-w-md mx-auto transition-colors duration-300 ${
            isDark ? "border-slate-900" : "border-slate-200"
          }`}>
            <button
              onClick={() => setActiveTab("pipeline")}
              className={`flex-1 text-center pb-3.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
                activeTab === "pipeline"
                  ? "border-blue-500 text-blue-500 dark:text-blue-400"
                  : "border-transparent text-slate-500 hover:text-current"
              }`}
            >
              Zero-G Pipeline
            </button>
            <button
              onClick={() => setActiveTab("leads")}
              className={`flex-1 text-center pb-3.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
                activeTab === "leads"
                  ? "border-blue-500 text-blue-500 dark:text-blue-400"
                  : "border-transparent text-slate-500 hover:text-current"
              }`}
            >
              Nebula Database
            </button>
            <button
              onClick={() => setActiveTab("analytics")}
              className={`flex-1 text-center pb-3.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
                activeTab === "analytics"
                  ? "border-blue-500 text-blue-500 dark:text-blue-400"
                  : "border-transparent text-slate-500 hover:text-current"
              }`}
            >
              Analytics Funnel
            </button>
          </div>

          {/* Display */}
          <div className={`border rounded-2xl p-4 sm:p-6 shadow-2xl relative min-h-[300px] transition-colors duration-300 ${
            isDark ? "border-slate-905 bg-slate-950/80" : "border-slate-200 bg-slate-50"
          }`}>
            {/* View 1: Pipeline */}
            {activeTab === "pipeline" && (
              <div className="space-y-4">
                <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3 transition-colors duration-300 ${
                  isDark ? "border-slate-900" : "border-slate-200"
                }`}>
                  <div>
                    <h4 className={`text-xs font-bold uppercase tracking-wider ${isDark ? "text-white" : "text-black"}`}>Visual Sales Pipeline</h4>
                    <p className="text-[9px] text-slate-500 uppercase">Interactive live stage indicators.</p>
                  </div>
                  <span className={`text-[9px] font-bold px-2 py-1 border uppercase transition-colors duration-300 ${
                    isDark ? "text-blue-400 bg-blue-950/20 border-blue-900/40" : "text-blue-700 bg-blue-50 border-blue-200"
                  }`}>Active: $940,000</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  {pipelineStages.map((stage) => (
                    <div key={stage.id} className={`p-3 border rounded-xl transition-colors duration-300 ${
                      isDark ? "bg-slate-900/40 border-slate-900" : "bg-white border-slate-250"
                    }`}>
                      <div className="flex items-center gap-1.5 mb-3">
                        <span className={`w-1.5 h-1.5 rounded-full ${stage.color} animate-pulse`} />
                        <span className={`text-[10px] font-bold uppercase tracking-wider truncate ${isDark ? "text-white" : "text-black"}`}>{stage.name}</span>
                        <span className={`text-[8px] ml-auto px-1.5 py-0.5 border rounded transition-colors duration-300 ${
                          isDark ? "bg-black border-slate-900 text-slate-500" : "bg-slate-100 border-slate-200 text-slate-600"
                        }`}>{stage.leads.length}</span>
                      </div>

                      <div className="space-y-2">
                        {stage.leads.map((lead) => (
                          <div
                            key={lead.name}
                            className={`p-2.5 rounded-lg border transition-all duration-200 cursor-pointer shadow-sm ${
                              isDark ? "bg-black border-slate-900 hover:border-blue-500/40" : "bg-slate-50 border-slate-200 hover:border-blue-400"
                            }`}
                          >
                            <div className={`text-[10.5px] font-bold ${isDark ? "text-white" : "text-black"}`}>{lead.name}</div>
                            <div className="text-[8.5px] text-slate-500 mt-0.5">{lead.company}</div>
                            <div className={`flex items-center justify-between mt-2.5 border-t pt-1.5 transition-colors duration-300 ${
                              isDark ? "border-slate-900/80" : "border-slate-200"
                            }`}>
                              <span className="text-[9px] font-bold text-slate-400">{lead.value}</span>
                              <span className="text-[8px] text-blue-550 dark:text-blue-400 font-bold uppercase font-mono">Shift →</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* View 2: Leads List */}
            {activeTab === "leads" && (
              <div className="space-y-4">
                <div className={`flex items-center justify-between border-b pb-3 transition-colors duration-300 ${
                  isDark ? "border-slate-900" : "border-slate-200"
                }`}>
                  <div>
                    <h4 className={`text-xs font-bold uppercase tracking-wider ${isDark ? "text-white" : "text-black"}`}>Leads Database</h4>
                    <p className="text-[9px] text-slate-500 uppercase">Live preview of contact database.</p>
                  </div>
                  <button className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 text-[10px] font-bold uppercase rounded-lg transition-colors">
                    + Add Lead Row
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-900 text-slate-505 font-bold uppercase tracking-wider text-[8px]">
                        <th className="py-2 px-3">Lead Contact</th>
                        <th className="py-2 px-3">Value</th>
                        <th className="py-2 px-3">Stage</th>
                        <th className="py-2 px-3">Modified</th>
                        <th className="py-2 px-3 text-right">Rep</th>
                      </tr>
                    </thead>
                    <tbody className={`divide-y transition-colors duration-300 ${isDark ? "divide-slate-900" : "divide-slate-200"}`}>
                      {mockLeads.map((lead) => (
                        <tr key={lead.name} className={`transition-colors duration-200 ${isDark ? "hover:bg-slate-900/30" : "hover:bg-slate-100/30"}`}>
                          <td className="py-2.5 px-3">
                            <div className={`font-bold text-[11px] ${isDark ? "text-white" : "text-black"}`}>{lead.name}</div>
                            <div className="text-[8.5px] text-slate-550 uppercase">{lead.company}</div>
                          </td>
                          <td className="py-2.5 px-3 font-semibold text-slate-400">{lead.value}</td>
                          <td className="py-2.5 px-3">
                            <span className={`inline-flex px-2 py-0.5 rounded-full text-[8.5px] font-bold border uppercase tracking-wider ${
                              lead.status === "qualified" ? "bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/40" :
                              lead.status === "new" ? "bg-blue-55/60 text-blue-600 border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/40" :
                              lead.status === "contacted" ? "bg-purple-55/60 text-purple-600 border-purple-200 dark:bg-purple-950/20 dark:text-purple-400 dark:border-purple-900/40" :
                              "bg-slate-100 text-slate-500 border-slate-200 dark:bg-neutral-800 dark:text-neutral-450 dark:border-neutral-700"
                            }`}>
                              {lead.status}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-slate-500 text-[10px]">{lead.date}</td>
                          <td className="py-2.5 px-3 text-right font-medium text-slate-500">
                            <span className="w-5 h-5 rounded-full bg-blue-600 text-white inline-flex items-center justify-center text-[9px] font-bold">
                              {lead.rep}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* View 3: Analytics */}
            {activeTab === "analytics" && (
              <div className="space-y-6">
                <div className={`flex items-center justify-between border-b pb-3 transition-colors duration-300 ${
                  isDark ? "border-slate-900" : "border-slate-200"
                }`}>
                  <div>
                    <h4 className={`text-xs font-bold uppercase tracking-wider ${isDark ? "text-white" : "text-black"}`}>Conversion Funnels</h4>
                    <p className="text-[9px] text-slate-500 uppercase">Live mockup metrics detailing sales conversions.</p>
                  </div>
                  <span className={`text-[8.5px] font-bold border px-2 py-0.5 rounded-full uppercase transition-colors duration-300 ${
                    isDark ? "text-blue-400 bg-blue-950/20 border-blue-900/40" : "text-blue-700 bg-blue-50 border-blue-200"
                  }`}>Funnel Goal Met</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Funnel Box 1 */}
                  <div className={`p-4 border rounded-xl transition-colors duration-300 ${isDark ? "bg-slate-900/40 border-slate-900" : "bg-white border-slate-200"}`}>
                    <span className="text-[8px] text-slate-500 uppercase font-bold tracking-wider">Leads-to-Outreach</span>
                    <div className={`text-xl font-bold mt-1 ${isDark ? "text-white" : "text-black"}`}>74.2%</div>
                    <div className={`w-full h-1.5 rounded-full mt-2 overflow-hidden border transition-colors duration-300 ${
                      isDark ? "bg-slate-950 border-slate-900" : "bg-slate-205 border-slate-300"
                    }`}>
                      <div className="bg-blue-500 h-full rounded-full" style={{ width: "74%" }} />
                    </div>
                    <p className="text-[8px] text-slate-650 mt-2 uppercase tracking-wide">Target: 70%</p>
                  </div>

                  {/* Funnel Box 2 */}
                  <div className={`p-4 border rounded-xl transition-colors duration-300 ${isDark ? "bg-slate-900/40 border-slate-900" : "bg-white border-slate-200"}`}>
                    <span className="text-[8px] text-slate-500 uppercase font-bold tracking-wider">Outreach-to-Qualified</span>
                    <div className={`text-xl font-bold mt-1 ${isDark ? "text-white" : "text-black"}`}>36.5%</div>
                    <div className={`w-full h-1.5 rounded-full mt-2 overflow-hidden border transition-colors duration-300 ${
                      isDark ? "bg-slate-950 border-slate-900" : "bg-slate-200 border-slate-300"
                    }`}>
                      <div className="bg-indigo-500 h-full rounded-full" style={{ width: "36.5%" }} />
                    </div>
                    <p className="text-[8px] text-slate-650 mt-2 uppercase tracking-wide">Target: 30%</p>
                  </div>

                  {/* Funnel Box 3 */}
                  <div className={`p-4 border rounded-xl transition-colors duration-300 ${isDark ? "bg-slate-900/40 border-slate-900" : "bg-white border-slate-200"}`}>
                    <span className="text-[8px] text-slate-500 uppercase font-bold tracking-wider">Conversion close</span>
                    <div className={`text-xl font-bold mt-1 ${isDark ? "text-white" : "text-black"}`}>18.4%</div>
                    <div className={`w-full h-1.5 rounded-full mt-2 overflow-hidden border transition-colors duration-300 ${
                      isDark ? "bg-slate-950 border-slate-900" : "bg-slate-200 border-slate-300"
                    }`}>
                      <div className="bg-cyan-500 h-full rounded-full" style={{ width: "18.4%" }} />
                    </div>
                    <p className="text-[8px] text-slate-650 mt-2 uppercase tracking-wide">Target: 15%</p>
                  </div>
                </div>

                <div className={`p-4 border rounded-xl flex items-center justify-between gap-4 transition-colors duration-300 ${
                  isDark ? "bg-slate-900/40 border-slate-900" : "bg-slate-100/50 border-slate-200"
                }`}>
                  <div className="flex items-center gap-3">
                    <div className={`p-2 border rounded-lg shrink-0 ${isDark ? "bg-slate-950 border-slate-900 text-blue-500" : "bg-white border-slate-200 text-blue-600"}`}>
                      <Atom className="w-5 h-5 animate-spin" style={{ animationDuration: '6s' }} />
                    </div>
                    <div>
                      <h5 className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? "text-white" : "text-black"}`}>Monthly Closed Deal Target Acquired</h5>
                      <p className="text-[9.5px] text-slate-500">Pipeline health status remains optimal with 14 new conversions this cycle.</p>
                    </div>
                  </div>
                  <Link to="/register" className="text-xs text-blue-600 dark:text-blue-400 font-bold hover:underline shrink-0 whitespace-nowrap">
                    Track Leads →
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── PRICING SECTION ── */}
      <section id="pricing" className="py-20 sm:py-28 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs uppercase tracking-widest text-blue-500 font-bold">Transparent Plans</h2>
            <p className={`text-2xl sm:text-3xl font-extrabold mt-3 uppercase tracking-wider transition-colors duration-300 ${isDark ? "text-white" : "text-black"}`}>
              Flexible options for teams of all sizes
            </p>

            {/* Monthly/Annual Toggle */}
            <div className={`mt-6 inline-flex items-center gap-2.5 p-1 border rounded-xl transition-colors duration-300 ${
              isDark ? "bg-slate-950 border-slate-900" : "bg-slate-50 border-slate-200"
            }`}>
              <button
                onClick={() => setBillingCycle("monthly")}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  billingCycle === "monthly"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-500 hover:text-current"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle("annually")}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  billingCycle === "annually"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-500 hover:text-current"
                }`}
              >
                Annually
                <span className={`px-1 rounded font-bold text-[9px] border transition-colors duration-350 ${
                  isDark ? "bg-slate-900 border-slate-800 text-blue-400" : "bg-blue-50 border-blue-200 text-blue-600"
                }`}>
                  -20% Save
                </span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Plan 1: Free */}
            <div className={`p-8 rounded-2xl border flex flex-col justify-between hover:border-blue-500/40 transition-colors duration-300 ${
              isDark ? "bg-[#09090b] border-slate-900" : "bg-slate-50 border-slate-200"
            }`}>
              <div>
                <span className="text-[9px] uppercase font-bold tracking-wider text-slate-500">Startup Tier</span>
                <h3 className={`text-lg font-bold mt-1 uppercase tracking-wider ${isDark ? "text-white" : "text-black"}`}>Trial Edition</h3>
                <p className="text-slate-500 mt-2 text-xs">Ideal for solo reps getting started.</p>

                <div className="mt-6 flex items-baseline gap-1">
                  <span className={`text-4xl font-extrabold ${isDark ? "text-white" : "text-black"}`}>$0</span>
                  <span className="text-[9px] text-neutral-600 uppercase font-bold">/ forever</span>
                </div>

                <div className={`h-px my-6 ${isDark ? "bg-slate-900" : "bg-slate-200"}`} />

                <ul className="space-y-3.5 text-xs text-slate-400 dark:text-slate-300">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-blue-500 shrink-0" />
                    <span>Up to 150 Lead Contacts</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-blue-500 shrink-0" />
                    <span>Basic Visual Deal Stages</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-blue-500 shrink-0" />
                    <span>Automated Lead Routing</span>
                  </li>
                </ul>
              </div>

              <Link
                to="/register"
                className={`w-full mt-8 py-3 border text-center text-xs font-semibold rounded-xl uppercase tracking-wider transition-colors duration-200 ${
                  isDark ? "border-slate-800 text-slate-300 hover:bg-slate-900 hover:border-slate-700" : "border-slate-200 text-slate-800 hover:bg-slate-100 hover:border-slate-350"
                }`}
              >
                Sign Up Free
              </Link>
            </div>

            {/* Plan 2: Pro */}
            <div className={`p-8 rounded-2xl border flex flex-col justify-between relative shadow-2xl transition-all duration-300 ${
              isDark ? "bg-[#121214] border-blue-500/50 shadow-blue-500/5" : "bg-white border-blue-600/40 shadow-blue-500/10"
            }`}>
              {/* Popular Badge */}
              <div className="absolute top-0 right-8 -translate-y-1/2 px-3 py-1 rounded-full bg-blue-600 text-white text-[9px] font-extrabold uppercase tracking-wider shadow">
                Most Popular
              </div>

              <div>
                <span className="text-[9px] uppercase font-bold tracking-wider text-blue-500 dark:text-blue-400">Growth Tier</span>
                <h3 className={`text-lg font-bold mt-1 uppercase tracking-wider ${isDark ? "text-white" : "text-black"}`}>Professional</h3>
                <p className="text-slate-400 mt-2 text-xs">For teams scaling pipeline velocity.</p>

                <div className="mt-6 flex items-baseline gap-1">
                  <span className={`text-4xl font-extrabold ${isDark ? "text-white" : "text-black"}`}>
                    {billingCycle === "monthly" ? "$29" : "$23"}
                  </span>
                  <span className="text-[9px] text-slate-500 uppercase font-bold">/ rep / mo</span>
                </div>

                <div className={`h-px my-6 ${isDark ? "bg-slate-900" : "bg-slate-200"}`} />

                <ul className="space-y-3.5 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-blue-500 shrink-0" />
                    <span className={`font-bold ${isDark ? "text-white" : "text-black"}`}>Unlimited Lead Contacts</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-blue-500 shrink-0" />
                    <span>Custom pipeline stages</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-blue-500 shrink-0" />
                    <span>Full Funnel Analytics</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-blue-500 shrink-0" />
                    <span>API & webhook routing</span>
                  </li>
                </ul>
              </div>

              <Link
                to="/register"
                className="glowing-btn w-full mt-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-center text-xs font-bold uppercase tracking-wider"
              >
                Get Started 14-Day Free
              </Link>
            </div>

            {/* Plan 3: Enterprise */}
            <div className={`p-8 rounded-2xl border flex flex-col justify-between hover:border-blue-500/40 transition-colors duration-300 ${
              isDark ? "bg-[#09090b] border-slate-900" : "bg-slate-50 border-slate-200"
            }`}>
              <div>
                <span className="text-[8px] uppercase font-bold tracking-wider text-slate-500">Custom Infrastructure</span>
                <h3 className={`text-lg font-bold mt-1 uppercase tracking-wider ${isDark ? "text-white" : "text-black"}`}>Enterprise Suite</h3>
                <p className="text-slate-500 mt-2 text-xs">For agencies requiring advanced controls.</p>

                <div className="mt-6 flex items-baseline gap-1">
                  <span className={`text-4xl font-extrabold ${isDark ? "text-white" : "text-black"}`}>Custom</span>
                  <span className="text-[9px] text-neutral-600 uppercase font-bold">/ monthly</span>
                </div>

                <div className={`h-px my-6 ${isDark ? "bg-slate-900" : "bg-slate-200"}`} />

                <ul className="space-y-3.5 text-xs text-slate-400 dark:text-slate-300">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-blue-500 shrink-0" />
                    <span>Dedicated database instances</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-blue-500 shrink-0" />
                    <span>Unlimited team logins</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-blue-500 shrink-0" />
                    <span>Dedicated SLA Account Manager</span>
                  </li>
                </ul>
              </div>

              <a
                href="#contact"
                className={`w-full mt-8 py-3 border text-center text-xs font-semibold rounded-xl uppercase tracking-wider transition-colors duration-200 ${
                  isDark ? "border-slate-800 text-slate-300 hover:bg-slate-900 hover:border-slate-700" : "border-slate-200 text-slate-800 hover:bg-slate-100 hover:border-slate-350"
                }`}
              >
                Contact Sales
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ SECTION ── */}
      <section id="faq" className={`py-20 sm:py-24 border-t border-b transition-colors duration-300 ${
        isDark ? "border-slate-900" : "border-slate-200"
      }`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-xs uppercase tracking-widest text-blue-500 font-bold">Frequently Asked Questions</h2>
            <p className={`text-2xl font-extrabold mt-2 uppercase tracking-wide transition-colors duration-300 ${isDark ? "text-white" : "text-black"}`}>Got questions? We have answers</p>
          </div>

          <div className="space-y-2">
            {faqs.map((faq, index) => {
              const isOpen = faqOpen === index;
              return (
                <div
                  key={index}
                  className={`border rounded-xl overflow-hidden transition-colors duration-300 ${
                    isDark ? "border-slate-900 bg-slate-950" : "border-slate-200 bg-slate-50"
                  }`}
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className={`w-full flex items-center justify-between p-5 text-left font-bold text-xs uppercase tracking-wider transition-colors ${
                      isDark ? "text-white hover:text-blue-400" : "text-black hover:text-blue-600"
                    }`}
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-300 shrink-0 ${isOpen ? "rotate-180 text-current" : ""}`} />
                  </button>

                  <div
                    className={`transition-all duration-300 ease-in-out overflow-hidden ${
                      isOpen ? "max-h-40 border-t" : "max-h-0"
                    } ${isDark ? "border-slate-900" : "border-slate-200"}`}
                  >
                    <p className={`p-5 text-xs leading-relaxed transition-colors duration-300 ${
                      isDark ? "text-slate-400 bg-slate-900/10" : "text-slate-600 bg-slate-100/30"
                    }`}>
                      {faq.a}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CONTACT & INFO CAPTURE ── */}
      <section id="contact" className="py-20 sm:py-28 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className={`p-8 sm:p-12 border rounded-3xl shadow-2xl relative overflow-hidden transition-colors duration-300 ${
            isDark ? "bg-[#09090b] border-slate-900" : "bg-slate-50 border-slate-200"
          }`}>
            {/* Top design accent bar */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-400" />

            <h2 className={`text-2xl sm:text-3xl font-extrabold uppercase tracking-wider transition-colors duration-300 ${isDark ? "text-white" : "text-black"}`}>
              Ready to double your sales conversion?
            </h2>
            <p className="text-xs text-slate-550 dark:text-slate-400 mt-3 max-w-xl mx-auto leading-relaxed">
              Start tracking, assigning, and converting leads now. Enter your email below to request early portal demo access.
            </p>

            <form onSubmit={handleContactSubmit} className="mt-8 max-w-md mx-auto flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="you@company.com"
                required
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className={`flex-1 h-12 px-4 border rounded-xl text-xs focus:outline-none transition-all ${
                  isDark ? "border-slate-850 bg-black text-white focus:border-blue-500" : "border-slate-250 bg-white text-black focus:border-blue-600"
                }`}
              />
              <button
                type="submit"
                className="h-12 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-lg shadow-blue-500/10 transition-all shrink-0 flex items-center justify-center gap-1.5"
              >
                Request Access
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>

            {contactSubmitted && (
              <div className="mt-4 p-3 bg-emerald-500/10 text-emerald-450 border border-emerald-500/20 rounded-xl text-xs inline-block">
                ✓ Success! Your request has been queued. Our representative will email you shortly.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── BOTTOM SIGN IN / SIGN UP CTA BANNER ── */}
      {!isLoggedIn && (
        <section className={`py-16 sm:py-20 border-t text-center relative z-10 transition-colors duration-300 ${
          isDark ? "bg-[#09090b] border-slate-900" : "bg-slate-50 border-slate-200"
        }`}>
          <div className="max-w-4xl mx-auto px-4">
            <h2 className={`text-xl sm:text-2xl font-black uppercase tracking-wider transition-colors duration-300 ${isDark ? "text-white" : "text-black"}`}>
              Defy Gravity. Accelerate Sales.
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              Join teams managing pipelines with absolute clarity.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/register"
                className="px-8 py-3 text-xs font-bold uppercase tracking-widest w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20 transition-all duration-200"
              >
                Sign Up For Free
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/login"
                className={`px-8 py-3 text-xs font-bold uppercase tracking-widest w-full sm:w-auto flex items-center justify-center border rounded-xl transition-all duration-200 ${
                  isDark ? "border-slate-800 text-white hover:bg-slate-900" : "border-slate-200 text-slate-800 hover:bg-slate-100"
                }`}
              >
                Sign In
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── FOOTER ── */}
      <footer className={`py-12 text-xs text-slate-500 relative z-10 border-t transition-colors duration-300 ${
        isDark ? "bg-black border-slate-950" : "bg-slate-50 border-slate-200"
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12 text-left">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <span className={`font-bold tracking-widest ${isDark ? "text-white" : "text-black"}`}>LEADFLOW</span>
              </div>
              <p className="leading-relaxed pr-4 text-slate-500">
                Accelerating outreach efficiency and lead conversion tracking ratios since 2026.
              </p>
            </div>
            <div>
              <h4 className={`font-bold tracking-widest mb-4 ${isDark ? "text-slate-400" : "text-slate-700"}`}>Product</h4>
              <ul className="space-y-2.5">
                <li><a href="#features" className="hover:text-current transition-colors">Features</a></li>
                <li><a href="#demo" className="hover:text-current transition-colors">Sandbox</a></li>
                <li><a href="#pricing" className="hover:text-current transition-colors">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h4 className={`font-bold tracking-widest mb-4 ${isDark ? "text-slate-400" : "text-slate-700"}`}>Solutions</h4>
              <ul className="space-y-2.5">
                <li><a href="/register" className="hover:text-current transition-colors">Outbound Sales</a></li>
                <li><a href="/register" className="hover:text-current transition-colors">Lead Assignment</a></li>
                <li><a href="/register" className="hover:text-current transition-colors">Pipeline Tracking</a></li>
              </ul>
            </div>
            <div>
              <h4 className={`font-bold tracking-widest mb-4 ${isDark ? "text-slate-400" : "text-slate-700"}`}>Legal</h4>
              <ul className="space-y-2.5">
                <li><a href="/privacy" className="hover:text-current transition-colors">Privacy Policy</a></li>
                <li><a href="/terms" className="hover:text-current transition-colors">Terms of Service</a></li>
                <li><a href="#contact" className="hover:text-current transition-colors">Contact sales</a></li>
              </ul>
            </div>
          </div>

          <div className={`h-px my-8 ${isDark ? "bg-slate-950" : "bg-slate-200"}`} />

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p>© {new Date().getFullYear()} LeadFlow CRM. All rights reserved. Google DeepMind Antigravity.</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-current transition-colors">Twitter</a>
              <a href="#" className="hover:text-current transition-colors">LinkedIn</a>
              <a href="#" className="hover:text-current transition-colors">GitHub</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
