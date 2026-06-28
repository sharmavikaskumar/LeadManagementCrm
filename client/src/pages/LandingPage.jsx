import React, { useState, useEffect, useRef, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Zap, Users, TrendingUp, ArrowRight, Shield, Activity,
  Check, Menu, X, ChevronDown, Clock, Sparkles, BarChart2,
  Cpu, Orbit, Atom, Sun, Moon
} from "lucide-react";

// ─── STATIC DATA (outside component — never recreated on re-render) ───────────

const MOCK_LEADS = [
  { name: "Bruce Wayne",   company: "Wayne Enterprises", value: "$240,000", status: "qualified", date: "Just now",   rep: "BW" },
  { name: "Diana Prince",  company: "Themyscira Ltd",    value: "$95,000",  status: "contacted", date: "8 mins ago", rep: "DP" },
  { name: "Tony Stark",    company: "Stark Industries",  value: "$480,000", status: "new",       date: "1 hour ago", rep: "TS" },
  { name: "Clark Kent",    company: "Daily Planet",      value: "$30,000",  status: "closed",    date: "1 day ago",  rep: "CK" },
];

const PIPELINE_STAGES = [
  {
    id: "new", name: "New Leads", dot: "bg-blue-500",
    leads: [
      { name: "Tony Stark",  company: "Stark Industries", value: "$480K" },
      { name: "Barry Allen", company: "S.T.A.R. Labs",    value: "$45K"  },
    ],
  },
  {
    id: "contacted", name: "Contacted", dot: "bg-purple-500",
    leads: [
      { name: "Diana Prince", company: "Themyscira Ltd", value: "$95K" },
    ],
  },
  {
    id: "qualified", name: "Qualified", dot: "bg-emerald-500",
    leads: [
      { name: "Bruce Wayne",  company: "Wayne Enterprises", value: "$240K" },
      { name: "Arthur Curry", company: "Atlantis Corp",     value: "$130K" },
    ],
  },
  {
    id: "closed", name: "Closed Won", dot: "bg-slate-500",
    leads: [
      { name: "Clark Kent", company: "Daily Planet", value: "$30K" },
    ],
  },
];

const FAQS = [
  {
    q: "How does the automated routing work?",
    a: "Our system uses criteria-based rules to automatically assign incoming leads to specific sales representatives. You can toggle assignment rules, set active hours, and track individual representative loads.",
  },
  {
    q: "Can I import lead CSVs directly?",
    a: "Yes, easily. The smart importer maps columns automatically and matches lead status categories to prevent duplicate rows.",
  },
  {
    q: "What makes this CRM interface unique?",
    a: "We combine zero-weight layouts with clear visual pipeline stages, smart SLA reminders, and micro-analytics to help reps process accounts faster with minimal cognitive friction.",
  },
  {
    q: "Is data isolation guaranteed?",
    a: "Absolutely. All databases use TLS 1.3 transit encryption and separate keys to guarantee client privacy.",
  },
];

const FEATURES = [
  { icon: Cpu,      color: "blue",    title: "Lead Capturing & Routing",  desc: "Capture new leads instantly. Route them directly to appropriate reps to ensure immediate follow-up and engagement." },
  { icon: Orbit,    color: "purple",  title: "Visual Stage Pipelines",    desc: "Categorize leads by status. Move them effortlessly between New, Contacted, Qualified, and Closed stages as deal progress is logged." },
  { icon: BarChart2,color: "indigo",  title: "Smart Action Analytics",    desc: "Monitor performance with live metrics. Instantly see conversion charts, closed deal counts, and active client distributions." },
  { icon: Activity, color: "emerald", title: "Client Activity History",   desc: "Keep an audit log of email exchanges, follow-up calls, and lead data updates to ensure a coherent sales team context." },
  { icon: Clock,    color: "amber",   title: "SLA Reminders",             desc: "Flag stale leads automatically. Get visual cues and reminders when a lead has remained in a contacted stage too long without action." },
  { icon: Shield,   color: "cyan",    title: "Custom Team Roles",         desc: "Control access by role. Distinguish between Admin actions and Member pipelines to protect database integrity." },
];

const STATUS_STYLES = {
  qualified: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/40",
  new:       "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/40",
  contacted: "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/20 dark:text-purple-400 dark:border-purple-900/40",
  closed:    "bg-slate-100 text-slate-500 border-slate-200 dark:bg-neutral-800 dark:text-neutral-400 dark:border-neutral-700",
};

const ICON_COLORS = {
  blue:    "bg-blue-500/10 border-blue-500/20 text-blue-500",
  purple:  "bg-purple-500/10 border-purple-500/20 text-purple-500",
  indigo:  "bg-indigo-500/10 border-indigo-500/20 text-indigo-500",
  emerald: "bg-emerald-500/10 border-emerald-500/20 text-emerald-500",
  amber:   "bg-amber-500/10 border-amber-500/20 text-amber-500",
  cyan:    "bg-cyan-500/10 border-cyan-500/20 text-cyan-500",
};

// ─── COMPONENT ────────────────────────────────────────────────────────────────

export default function LandingPage() {
  const [isLoggedIn,      setIsLoggedIn]      = useState(false);
  const [mobileMenuOpen,  setMobileMenuOpen]  = useState(false);
  const [activeTab,       setActiveTab]       = useState("pipeline");
  const [faqOpen,         setFaqOpen]         = useState(null);
  const [contactEmail,    setContactEmail]    = useState("");
  const [contactSubmitted,setContactSubmitted]= useState(false);
  const [theme,           setTheme]           = useState("dark");
  const heroRef = useRef(null);

  // ── Derive once, not on every render ──
  const isDark = useMemo(() => theme === "dark", [theme]);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("token"));
    const saved = localStorage.getItem("landing-theme");
    if (saved) {
      setTheme(saved);
      if (saved === "dark") document.documentElement.classList.add("dark");
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setTheme(prefersDark ? "dark" : "light");
      if (prefersDark) document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    const next = isDark ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("landing-theme", next);
    document.documentElement.classList.toggle("dark", next === "dark");
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (contactEmail.trim()) {
      setContactSubmitted(true);
      setContactEmail("");
      setTimeout(() => setContactSubmitted(false), 5000);
    }
  };

  const toggleFaq = (i) => setFaqOpen(faqOpen === i ? null : i);

  // ── Shared class builders (no recomputation of theme per call) ──
  const card = isDark
    ? "bg-slate-950/60 border-slate-800 hover:border-blue-500/30 hover:shadow-blue-950/30"
    : "bg-white border-slate-200 hover:border-blue-300 hover:shadow-blue-100/50";

  const surface = isDark ? "bg-slate-900/40 border-slate-800" : "bg-white border-slate-200";
  const divider = isDark ? "border-slate-800" : "border-slate-200";
  const textPrimary = isDark ? "text-white" : "text-slate-900";
  const textMuted   = isDark ? "text-slate-400" : "text-slate-500";

  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 ${
      isDark ? "bg-[#030712] text-white" : "bg-white text-slate-900"
    }`}>

      {/* ── GLOBAL STYLES ────────────────────────────────────────────── */}
      <style>{`
        /* Performance: only 2 keyframes, reduced to transform+opacity only */
        @keyframes float {
          0%,100% { transform: translateY(0px); }
          50%      { transform: translateY(-14px); }
        }
        @keyframes spin-slow { to { transform: rotate(360deg); } }

        /* will-change promotes element to its own GPU layer before animation starts */
        .hero-card {
          animation: float 8s ease-in-out infinite;
          will-change: transform;
        }
        .spin-slow {
          animation: spin-slow 10s linear infinite;
          will-change: transform;
        }
        .spin-med {
          animation: spin-slow 6s linear infinite;
          will-change: transform;
        }

        /* Respect user preference */
        @media (prefers-reduced-motion: reduce) {
          .hero-card, .spin-slow, .spin-med { animation: none !important; }
        }

        /* Grid background — low-opacity so it doesn't fight content */
        .grid-bg {
          background-image:
            linear-gradient(to right,  rgba(99,102,241,0.04) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(99,102,241,0.04) 1px, transparent 1px);
          background-size: 40px 40px;
        }

        /* Glass: applied only where needed (header + hero preview) */
        .glass {
          background: rgba(15,23,42,0.55);
          border: 1px solid rgba(255,255,255,0.07);
        }
        .glass-light {
          background: rgba(248,250,252,0.75);
          border: 1px solid rgba(0,0,0,0.07);
        }

        /* Shimmer on primary CTA — CSS only, no JS */
        .btn-primary {
          position: relative;
          overflow: hidden;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .btn-primary::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent);
          transform: translateX(-100%);
          transition: transform 0.5s ease;
        }
        .btn-primary:hover::after  { transform: translateX(100%); }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 12px 28px -8px rgba(37,99,235,0.45); }

        /* Card hover — translate only (cheap) */
        .feature-card {
          transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
        }
        .feature-card:hover { transform: translateY(-4px); }

        /* FAQ expand */
        .faq-body {
          display: grid;
          grid-template-rows: 0fr;
          transition: grid-template-rows 0.28s ease;
        }
        .faq-body.open { grid-template-rows: 1fr; }
        .faq-inner { overflow: hidden; }
      `}</style>

      {/* ── AMBIENT GLOW (dark only, pointer-events off, no animation) ── */}
      <div className="absolute inset-0 grid-bg pointer-events-none z-0" />
      {isDark && (
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full bg-blue-900/10 blur-[160px]" />
          <div className="absolute top-1/3 -right-32 w-[500px] h-[500px] rounded-full bg-purple-900/12 blur-[160px]" />
          <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] rounded-full bg-cyan-950/15 blur-[140px]" />
        </div>
      )}

      {/* ── HEADER ───────────────────────────────────────────────────── */}
      <header className={`sticky top-0 z-50 border-b transition-colors duration-300 ${
        isDark
          ? "bg-[#030712]/70 border-slate-900 backdrop-blur-md"
          : "bg-white/80 border-slate-200 backdrop-blur-md"
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16 sm:h-[70px]">
          {/* Logo */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/30">
              <Zap className="w-4.5 h-4.5 text-white" />
            </div>
            <div className="leading-none">
              <span className={`text-sm font-black tracking-tight block ${textPrimary}`}>
                LeadFlow <span className="text-blue-500 font-normal">CRM</span>
              </span>
              <span className={`text-[9px] uppercase tracking-[0.18em] font-bold block mt-0.5 ${textMuted}`}>
                Sales Accelerator
              </span>
            </div>
          </div>

          {/* Nav */}
          <nav className={`hidden md:flex items-center gap-7 text-xs font-semibold ${textMuted}`}>
            {["features","demo","faq","contact"].map((id) => (
              <a key={id} href={`#${id}`}
                className="capitalize hover:text-blue-500 transition-colors">
                {id === "contact" ? "Outreach" : id.charAt(0).toUpperCase() + id.slice(1)}
              </a>
            ))}
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-3">
            <button onClick={toggleTheme} aria-label="Toggle theme"
              className={`p-2 rounded-lg border transition-colors ${
                isDark
                  ? "border-slate-800 text-slate-400 hover:text-white hover:bg-slate-900"
                  : "border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-100"
              }`}>
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {isLoggedIn ? (
              <Link to="/dashboard"
                className="btn-primary flex items-center gap-1.5 px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold">
                Dashboard <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            ) : (
              <>
                <Link to="/login" className={`text-xs font-semibold px-3 py-2 transition-colors ${textMuted} hover:text-blue-500`}>
                  Sign In
                </Link>
                <Link to="/register"
                  className="px-4 py-2 rounded-lg border border-blue-500/30 hover:border-blue-500 bg-blue-500/5 hover:bg-blue-500/10 text-blue-500 text-xs font-semibold transition-all">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <div className="flex items-center gap-2 md:hidden">
            <button onClick={toggleTheme} aria-label="Toggle theme"
              className={`p-2 rounded-lg border ${isDark ? "border-slate-800 text-slate-400" : "border-slate-200 text-slate-500"}`}>
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle menu"
              className={`p-2 rounded-lg transition-colors ${isDark ? "text-slate-400 hover:bg-slate-900" : "text-slate-600 hover:bg-slate-100"}`}>
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile drawer */}
        {mobileMenuOpen && (
          <div className={`md:hidden border-t px-4 py-4 space-y-1 ${
            isDark ? "border-slate-900 bg-[#030712]" : "border-slate-200 bg-white"
          }`}>
            {["features","demo","faq","contact"].map((id) => (
              <a key={id} href={`#${id}`} onClick={() => setMobileMenuOpen(false)}
                className={`block py-2.5 px-3 rounded-lg text-xs font-semibold capitalize transition-colors ${
                  isDark ? "text-slate-400 hover:bg-slate-900 hover:text-white" : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                }`}>
                {id === "contact" ? "Outreach" : id.charAt(0).toUpperCase() + id.slice(1)}
              </a>
            ))}
            <div className={`h-px my-2 ${isDark ? "bg-slate-900" : "bg-slate-200"}`} />
            {isLoggedIn ? (
              <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-blue-600 text-white text-xs font-semibold">
                Dashboard <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            ) : (
              <div className="flex gap-2">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}
                  className={`flex-1 text-center py-2.5 text-xs font-semibold rounded-lg border transition-colors ${
                    isDark ? "border-slate-800 text-slate-300 hover:bg-slate-900" : "border-slate-200 text-slate-700 hover:bg-slate-100"
                  }`}>Sign In</Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center py-2.5 rounded-lg bg-blue-600 text-white text-xs font-semibold">Sign Up</Link>
              </div>
            )}
          </div>
        )}
      </header>

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section ref={heroRef} className="relative pt-16 pb-28 sm:pt-24 sm:pb-40 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Badge */}
          <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-semibold mb-6 ${
            isDark ? "border-blue-500/20 bg-blue-950/20 text-blue-400" : "border-blue-200 bg-blue-50 text-blue-700"
          }`}>
            <Sparkles className="w-3.5 h-3.5" />
            Zero-friction sales pipeline for high-growth teams
          </div>

          <h1 className={`text-4xl sm:text-6xl lg:text-[70px] font-black tracking-tight leading-[1.04] max-w-5xl mx-auto ${textPrimary}`}>
            Defy Gravity in Your{" "}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-400 bg-clip-text text-transparent">
              Sales Pipeline
            </span>
          </h1>

          <p className={`mt-6 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed ${textMuted}`}>
            Track leads, auto-route outreach, and measure conversion ratios on a sleek, zero-friction interface built for high-performance sales teams.
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            {isLoggedIn ? (
              <Link to="/dashboard"
                className="btn-primary w-full sm:w-auto px-8 py-3.5 rounded-xl bg-blue-600 text-white font-semibold shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2">
                Launch Dashboard <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <Link to="/register"
                  className="btn-primary w-full sm:w-auto px-8 py-3.5 rounded-xl bg-blue-600 text-white font-semibold shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2">
                  Start Free <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/login"
                  className={`w-full sm:w-auto px-8 py-3.5 rounded-xl border font-semibold transition-all flex items-center justify-center gap-2 ${
                    isDark ? "border-slate-800 bg-slate-900/50 hover:bg-slate-800 text-white" : "border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800"
                  }`}>
                  Sign In
                </Link>
              </>
            )}
          </div>

          {/* Trust bullets */}
          <div className={`mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs font-medium ${textMuted}`}>
            {["Free sandbox access","Zero-friction UI","Active team routing"].map((t) => (
              <span key={t} className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-blue-500 shrink-0" /> {t}
              </span>
            ))}
          </div>

          {/* ── HERO APP PREVIEW ── */}
          <div className="mt-20 sm:mt-28 max-w-5xl mx-auto hero-card">
            <div className={`rounded-2xl border overflow-hidden shadow-2xl ${
              isDark ? "border-slate-800 bg-slate-950 shadow-black/40" : "border-slate-200 bg-white shadow-slate-300/30"
            }`}>
              {/* Window chrome */}
              <div className={`flex items-center justify-between px-4 py-3 border-b ${
                isDark ? "border-slate-800 bg-slate-950" : "border-slate-200 bg-slate-50"
              }`}>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-rose-500/60" />
                  <span className="w-3 h-3 rounded-full bg-amber-500/60" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/60" />
                  <span className={`ml-3 text-[9px] font-bold uppercase tracking-widest hidden sm:inline ${textMuted}`}>
                    leadflow · pipeline · preview
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  <span className="text-[9px] text-blue-500 font-bold uppercase tracking-widest">Live</span>
                </div>
              </div>

              <div className="p-4 sm:p-5">
                {/* Stat row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                  {[
                    { label: "Total leads",  value: "1,248" },
                    { label: "Contacted",    value: "542"   },
                    { label: "Qualified",    value: "198"   },
                    { label: "Revenue won",  value: "$45.8k"},
                  ].map(({ label, value }) => (
                    <div key={label} className={`p-3 border rounded-xl ${surface}`}>
                      <span className={`text-[9px] uppercase font-bold tracking-wider ${textMuted}`}>{label}</span>
                      <div className={`text-lg font-black mt-0.5 ${textPrimary}`}>{value}</div>
                    </div>
                  ))}
                </div>

                {/* Mini pipeline */}
                <div className="grid grid-cols-3 gap-3">
                  {PIPELINE_STAGES.slice(0, 3).map((stage) => (
                    <div key={stage.id} className={`p-3 border rounded-xl ${surface}`}>
                      <div className="flex items-center gap-1.5 mb-2">
                        <span className={`w-1.5 h-1.5 rounded-full ${stage.dot}`} />
                        <span className={`text-[9px] font-bold uppercase tracking-wider truncate ${textPrimary}`}>{stage.name}</span>
                        <span className={`text-[8px] ml-auto px-1.5 py-0.5 border rounded ${
                          isDark ? "bg-black border-slate-800 text-slate-500" : "bg-slate-100 border-slate-200 text-slate-600"
                        }`}>{stage.leads.length}</span>
                      </div>
                      {stage.leads.slice(0, 2).map((lead) => (
                        <div key={lead.name} className={`p-2 rounded-lg border mb-1.5 last:mb-0 ${
                          isDark ? "bg-black border-slate-800" : "bg-slate-50 border-slate-200"
                        }`}>
                          <div className={`text-[10px] font-bold ${textPrimary}`}>{lead.name}</div>
                          <div className={`text-[8px] mt-0.5 ${textMuted}`}>{lead.company}</div>
                          <div className={`text-[9px] font-semibold mt-1.5 pt-1.5 border-t ${
                            isDark ? "border-slate-800 text-slate-400" : "border-slate-200 text-slate-500"
                          }`}>{lead.value}</div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── LOGO CLOUD ───────────────────────────────────────────────── */}
      <div className={`py-8 border-t border-b transition-colors duration-300 ${
        isDark ? "bg-black border-slate-900" : "bg-slate-50 border-slate-200"
      }`}>
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className={`text-[10px] uppercase tracking-[0.2em] font-bold mb-5 ${textMuted}`}>
            Empowering high-performing sales teams
          </p>
          <div className={`flex flex-wrap items-center justify-center gap-x-12 gap-y-5 text-xs font-bold tracking-widest opacity-25 ${textMuted}`}>
            {["STRIPE","ACME CORP","SLACK LABS","VERCEL CO","FIGMA ORG"].map((b) => (
              <span key={b}>{b}</span>
            ))}
          </div>
        </div>
      </div>

      {/* ── METRICS ──────────────────────────────────────────────────── */}
      <section className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {[
            { icon: Clock,      color: "text-blue-500",    bg: "bg-blue-500/10 border-blue-500/20",    stat: "3.4×",      sub: "Outreach response speed",    desc: "Connect with clients the moment they express interest. Automated rep notifications cut response timelines dramatically." },
            { icon: TrendingUp, color: "text-indigo-500",  bg: "bg-indigo-500/10 border-indigo-500/20", stat: "68%",       sub: "Pipeline conversion uplift", desc: "Never let a single potential contact slip. Teams consistently report higher close ratios and more predictable forecasts." },
            { icon: Shield,     color: "text-cyan-500",    bg: "bg-cyan-500/10 border-cyan-500/20",    stat: "0 drag",    sub: "UI weight density",          desc: "Manage lists, update roles, and delegate leads without visual clutter. Built for speed under real sales pressure." },
          ].map(({ icon: Icon, color, bg, stat, sub, desc }) => (
            <div key={stat} className={`feature-card p-8 border rounded-2xl shadow-sm ${card}`}>
              <div className={`w-11 h-11 rounded-xl border flex items-center justify-center mb-6 ${bg}`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <h3 className={`text-2xl font-black uppercase tracking-wide ${textPrimary}`}>{stat}</h3>
              <p className={`text-[9px] font-bold uppercase tracking-widest mt-1 ${color}`}>{sub}</p>
              <p className={`mt-4 text-xs leading-relaxed ${textMuted}`}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────────────── */}
      <section id="features" className={`py-20 sm:py-28 border-t ${divider}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-xs uppercase tracking-widest text-blue-500 font-bold">Feature Highlights</p>
            <h2 className={`text-3xl sm:text-4xl font-black mt-2 ${textPrimary}`}>
              Everything to master your sales cycle
            </h2>
            <p className={`mt-4 text-sm leading-relaxed ${textMuted}`}>
              Ditch spreadsheets and legacy databases. LeadFlow brings your pipeline to life with powerful, conversion-focused components.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map(({ icon: Icon, color, title, desc }) => (
              <div key={title} className={`feature-card p-6 border rounded-2xl shadow-sm ${card}`}>
                <div className={`w-10 h-10 rounded-lg border flex items-center justify-center ${ICON_COLORS[color]}`}>
                  {color === "purple"
                    ? <Icon className={`w-4.5 h-4.5 ${ICON_COLORS[color].split(" ")[2]} spin-slow`} />
                    : color === "cyan"
                    ? <Icon className={`w-4.5 h-4.5 ${ICON_COLORS[color].split(" ")[2]} spin-med`} />
                    : <Icon className={`w-4.5 h-4.5 ${ICON_COLORS[color].split(" ")[2]}`} />
                  }
                </div>
                <h3 className={`text-sm font-bold mt-5 ${textPrimary}`}>{title}</h3>
                <p className={`mt-2 text-xs leading-relaxed ${textMuted}`}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SANDBOX / DEMO ───────────────────────────────────────────── */}
      <section id="demo" className={`py-20 sm:py-24 border-t border-b ${divider}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className={`text-xs uppercase font-bold tracking-widest px-3 py-1 rounded-full border inline-block ${
              isDark ? "border-blue-500/20 bg-blue-950/20 text-blue-400" : "border-blue-200 bg-blue-50 text-blue-700"
            }`}>Interactive Sandbox</span>
            <h2 className={`text-2xl sm:text-3xl font-black mt-4 uppercase tracking-wide ${textPrimary}`}>
              Try the live scheduler
            </h2>
            <p className={`text-xs mt-2 leading-relaxed ${textMuted}`}>
              Explore pipeline stages, lead data, and conversion analytics. Toggle tabs below to preview each view.
            </p>
          </div>

          {/* Tabs */}
          <div className={`flex justify-center border-b mb-8 max-w-md mx-auto ${divider}`}>
            {[
              { id: "pipeline",  label: "Pipeline"   },
              { id: "leads",     label: "Leads DB"   },
              { id: "analytics", label: "Analytics"  },
            ].map(({ id, label }) => (
              <button key={id} onClick={() => setActiveTab(id)}
                className={`flex-1 pb-3 text-xs font-bold uppercase tracking-wide border-b-2 transition-all ${
                  activeTab === id
                    ? "border-blue-500 text-blue-500"
                    : `border-transparent ${textMuted} hover:text-blue-400`
                }`}>
                {label}
              </button>
            ))}
          </div>

          {/* Panel */}
          <div className={`border rounded-2xl p-4 sm:p-6 shadow-xl min-h-[300px] ${
            isDark ? "border-slate-800 bg-slate-950" : "border-slate-200 bg-slate-50"
          }`}>

            {/* Pipeline */}
            {activeTab === "pipeline" && (
              <div>
                <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3 mb-4 ${divider}`}>
                  <div>
                    <h4 className={`text-xs font-bold uppercase tracking-wide ${textPrimary}`}>Visual Sales Pipeline</h4>
                    <p className={`text-[9px] uppercase mt-0.5 ${textMuted}`}>Live stage indicators</p>
                  </div>
                  <span className={`text-[9px] font-bold px-2 py-1 rounded border uppercase ${
                    isDark ? "text-blue-400 bg-blue-950/20 border-blue-900/40" : "text-blue-700 bg-blue-50 border-blue-200"
                  }`}>Active: $940,000</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  {PIPELINE_STAGES.map((stage) => (
                    <div key={stage.id} className={`p-3 border rounded-xl ${surface}`}>
                      <div className="flex items-center gap-1.5 mb-3">
                        <span className={`w-1.5 h-1.5 rounded-full ${stage.dot}`} />
                        <span className={`text-[10px] font-bold uppercase tracking-wide truncate ${textPrimary}`}>{stage.name}</span>
                        <span className={`text-[8px] ml-auto px-1.5 py-0.5 border rounded ${
                          isDark ? "bg-black border-slate-800 text-slate-500" : "bg-white border-slate-200 text-slate-500"
                        }`}>{stage.leads.length}</span>
                      </div>
                      {stage.leads.map((lead) => (
                        <div key={lead.name} className={`p-2.5 rounded-lg border mb-2 last:mb-0 transition-colors cursor-pointer ${
                          isDark ? "bg-black border-slate-800 hover:border-blue-500/40" : "bg-white border-slate-200 hover:border-blue-400"
                        }`}>
                          <div className={`text-[10px] font-bold ${textPrimary}`}>{lead.name}</div>
                          <div className={`text-[8.5px] mt-0.5 ${textMuted}`}>{lead.company}</div>
                          <div className={`flex items-center justify-between mt-2 pt-1.5 border-t text-[9px] ${
                            isDark ? "border-slate-800" : "border-slate-200"
                          }`}>
                            <span className={textMuted}>{lead.value}</span>
                            <span className="text-blue-400 font-bold">Move →</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Leads DB */}
            {activeTab === "leads" && (
              <div>
                <div className={`flex items-center justify-between border-b pb-3 mb-4 ${divider}`}>
                  <div>
                    <h4 className={`text-xs font-bold uppercase tracking-wide ${textPrimary}`}>Leads Database</h4>
                    <p className={`text-[9px] uppercase mt-0.5 ${textMuted}`}>Live contact preview</p>
                  </div>
                  <button className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 text-[10px] font-bold uppercase rounded-lg transition-colors">
                    + Add Lead
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className={`border-b text-[8px] uppercase tracking-wider font-bold ${divider} ${textMuted}`}>
                        {["Contact","Value","Stage","Modified","Rep"].map((h) => (
                          <th key={h} className={`py-2 px-3 ${h === "Rep" ? "text-right" : ""}`}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className={`divide-y text-xs ${isDark ? "divide-slate-800" : "divide-slate-200"}`}>
                      {MOCK_LEADS.map((lead) => (
                        <tr key={lead.name} className={`transition-colors ${isDark ? "hover:bg-slate-900/40" : "hover:bg-slate-100/50"}`}>
                          <td className="py-2.5 px-3">
                            <div className={`font-bold text-[11px] ${textPrimary}`}>{lead.name}</div>
                            <div className={`text-[8.5px] uppercase ${textMuted}`}>{lead.company}</div>
                          </td>
                          <td className={`py-2.5 px-3 font-semibold ${textMuted}`}>{lead.value}</td>
                          <td className="py-2.5 px-3">
                            <span className={`inline-flex px-2 py-0.5 rounded-full text-[8.5px] font-bold border uppercase ${STATUS_STYLES[lead.status]}`}>
                              {lead.status}
                            </span>
                          </td>
                          <td className={`py-2.5 px-3 text-[10px] ${textMuted}`}>{lead.date}</td>
                          <td className="py-2.5 px-3 text-right">
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

            {/* Analytics */}
            {activeTab === "analytics" && (
              <div>
                <div className={`flex items-center justify-between border-b pb-3 mb-5 ${divider}`}>
                  <div>
                    <h4 className={`text-xs font-bold uppercase tracking-wide ${textPrimary}`}>Conversion Funnels</h4>
                    <p className={`text-[9px] uppercase mt-0.5 ${textMuted}`}>Live mockup metrics</p>
                  </div>
                  <span className={`text-[8.5px] font-bold border px-2 py-0.5 rounded-full uppercase ${
                    isDark ? "text-emerald-400 bg-emerald-950/20 border-emerald-900/40" : "text-emerald-700 bg-emerald-50 border-emerald-200"
                  }`}>All targets met</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                  {[
                    { label: "Leads → Outreach",   pct: 74, color: "bg-blue-500",    target: 70 },
                    { label: "Outreach → Qualified", pct: 36.5, color: "bg-indigo-500", target: 30 },
                    { label: "Conversion close",    pct: 18.4, color: "bg-cyan-500",   target: 15 },
                  ].map(({ label, pct, color, target }) => (
                    <div key={label} className={`p-4 border rounded-xl ${surface}`}>
                      <span className={`text-[8px] uppercase font-bold tracking-wider ${textMuted}`}>{label}</span>
                      <div className={`text-xl font-black mt-1 ${textPrimary}`}>{pct}%</div>
                      <div className={`w-full h-1.5 rounded-full mt-2 overflow-hidden ${isDark ? "bg-slate-800" : "bg-slate-200"}`}>
                        <div className={`${color} h-full rounded-full`} style={{ width: `${pct}%` }} />
                      </div>
                      <p className={`text-[8px] uppercase tracking-wide mt-2 ${textMuted}`}>Target: {target}%</p>
                    </div>
                  ))}
                </div>

                <div className={`p-4 border rounded-xl flex items-center justify-between gap-3 ${surface}`}>
                  <div className="flex items-center gap-3">
                    <div className={`p-2 border rounded-lg shrink-0 ${isDark ? "bg-slate-950 border-slate-800 text-blue-500" : "bg-white border-slate-200 text-blue-600"}`}>
                      <Atom className="w-5 h-5 spin-med" />
                    </div>
                    <div>
                      <h5 className={`text-[10px] font-bold uppercase tracking-wide ${textPrimary}`}>Monthly target acquired</h5>
                      <p className={`text-[9.5px] mt-0.5 ${textMuted}`}>14 new conversions this cycle. Pipeline health is optimal.</p>
                    </div>
                  </div>
                  <Link to="/register" className="text-xs text-blue-500 font-bold hover:underline shrink-0">
                    Track leads →
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────── */}
      <section id="faq" className={`py-20 sm:py-24 border-b ${divider}`}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-xs uppercase tracking-widest text-blue-500 font-bold">FAQ</p>
            <h2 className={`text-2xl font-black mt-2 uppercase tracking-wide ${textPrimary}`}>Got questions? We have answers</h2>
          </div>

          <div className="space-y-2">
            {FAQS.map((faq, i) => (
              <div key={i} className={`border rounded-xl overflow-hidden ${
                isDark ? "border-slate-800 bg-slate-950" : "border-slate-200 bg-slate-50"
              }`}>
                <button onClick={() => toggleFaq(i)}
                  className={`w-full flex items-center justify-between p-5 text-left text-xs font-bold uppercase tracking-wide transition-colors ${
                    isDark ? "text-white hover:text-blue-400" : "text-slate-900 hover:text-blue-600"
                  }`}>
                  {faq.q}
                  <ChevronDown className={`w-4 h-4 shrink-0 transition-transform duration-300 ${faqOpen === i ? "rotate-180 text-blue-500" : textMuted}`} />
                </button>

                {/* Grid-rows trick — no JS height measurement needed */}
                <div className={`faq-body ${faqOpen === i ? "open" : ""} ${isDark ? "border-slate-800" : "border-slate-200"} ${faqOpen === i ? "border-t" : ""}`}>
                  <div className="faq-inner">
                    <p className={`p-5 text-xs leading-relaxed ${textMuted}`}>{faq.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT ──────────────────────────────────────────────────── */}
      <section id="contact" className="py-20 sm:py-28">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <div className={`relative p-8 sm:p-12 border rounded-3xl overflow-hidden ${
            isDark ? "bg-[#09090b] border-slate-800" : "bg-slate-50 border-slate-200"
          }`}>
            <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-400" />

            <h2 className={`text-2xl sm:text-3xl font-black uppercase tracking-wide ${textPrimary}`}>
              Ready to double your conversion rate?
            </h2>
            <p className={`mt-3 text-xs max-w-md mx-auto leading-relaxed ${textMuted}`}>
              Enter your email below to request early portal demo access.
            </p>

            <form onSubmit={handleContactSubmit} className="mt-8 max-w-sm mx-auto flex flex-col sm:flex-row gap-3">
              <input type="email" placeholder="you@company.com" required
                value={contactEmail} onChange={(e) => setContactEmail(e.target.value)}
                className={`flex-1 h-11 px-4 border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all ${
                  isDark ? "border-slate-800 bg-black text-white focus:border-blue-500" : "border-slate-200 bg-white text-slate-900 focus:border-blue-500"
                }`} />
              <button type="submit"
                className="h-11 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 shrink-0">
                Request Access <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>

            {contactSubmitted && (
              <div className="mt-4 px-4 py-2.5 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-xl text-xs inline-block">
                ✓ Request received — we'll reach out shortly.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ───────────────────────────────────────────────── */}
      {!isLoggedIn && (
        <section className={`py-16 sm:py-20 border-t text-center ${divider} ${
          isDark ? "bg-[#09090b]" : "bg-slate-50"
        }`}>
          <div className="max-w-xl mx-auto px-4">
            <h2 className={`text-xl sm:text-2xl font-black uppercase tracking-wide ${textPrimary}`}>
              Defy Gravity. Accelerate Sales.
            </h2>
            <p className={`text-xs mt-2 ${textMuted}`}>Join teams managing pipelines with absolute clarity.</p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register"
                className="btn-primary px-8 py-3 text-xs font-bold uppercase tracking-widest w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
                Sign Up Free <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/login"
                className={`px-8 py-3 text-xs font-bold uppercase tracking-widest w-full sm:w-auto flex items-center justify-center border rounded-xl transition-colors ${
                  isDark ? "border-slate-800 text-white hover:bg-slate-900" : "border-slate-200 text-slate-800 hover:bg-slate-100"
                }`}>
                Sign In
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── FOOTER ───────────────────────────────────────────────────── */}
      <footer className={`py-12 border-t text-xs ${divider} ${
        isDark ? "bg-black text-slate-500" : "bg-slate-50 text-slate-400"
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10 text-left">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <span className={`font-black tracking-widest text-sm ${textPrimary}`}>LEADFLOW</span>
              </div>
              <p className="leading-relaxed text-slate-500 pr-4">
                Accelerating outreach efficiency and lead conversion tracking since 2026.
              </p>
            </div>

            {[
              { heading: "Product",   links: [{ label: "Features", href: "#features" }, { label: "Sandbox", href: "#demo" }] },
              { heading: "Solutions", links: [{ label: "Outbound Sales", href: "/register" }, { label: "Lead Assignment", href: "/register" }, { label: "Pipeline Tracking", href: "/register" }] },
              { heading: "Legal",     links: [{ label: "Privacy Policy", href: "/privacy" }, { label: "Terms of Service", href: "/terms" }, { label: "Contact Sales", href: "#contact" }] },
            ].map(({ heading, links }) => (
              <div key={heading}>
                <h4 className={`font-bold tracking-widest mb-4 ${isDark ? "text-slate-400" : "text-slate-600"}`}>{heading}</h4>
                <ul className="space-y-2.5">
                  {links.map(({ label, href }) => (
                    <li key={label}>
                      <a href={href} className="hover:text-blue-500 transition-colors">{label}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className={`h-px mb-8 ${isDark ? "bg-slate-900" : "bg-slate-200"}`} />

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p>© {new Date().getFullYear()} LeadFlow CRM. All rights reserved.</p>
            <div className="flex gap-5">
              {["Twitter","LinkedIn","GitHub"].map((s) => (
                <a key={s} href="#" className="hover:text-blue-500 transition-colors">{s}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}