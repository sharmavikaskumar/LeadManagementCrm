import { useState } from "react";
import { registerUser } from "@/services/authService";
import { Loader2, Eye, EyeOff, UserPlus } from "lucide-react";

const steps = [
  { title: "Create your account", desc: "Enter your details and get instant access to your dashboard." },
  { title: "Import your leads",   desc: "Bring in leads from CSV, forms, or connect your existing tools." },
  { title: "Assign & convert",    desc: "Assign to reps, set follow-ups, and watch your pipeline grow." },
];

const avatars = [
  { initials: "RM", bg: "#2563eb" },
  { initials: "SP", bg: "#7c3aed" },
  { initials: "AK", bg: "#059669" },
  { initials: "NJ", bg: "#dc2626" },
];

const getStrength = (pw) => {
  if (!pw) return -1;
  if (pw.length < 8) return 0;
  if (pw.length < 12) return 1;
  return 2;
};

const strengthColor = ["#ef4444", "#f59e0b", "#22c55e"];

export default function RegisterPage() {
  const [formData, setFormData] = useState({ firstName: "", lastName: "", email: "", password: "" });
  const [isLoading, setIsLoading]     = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const strength = getStrength(formData.password);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errorMessage) setErrorMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    try {
      const payload = {
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        password: formData.password,
      };
      await registerUser(payload);
      window.location.href = "/dashboard";
    } catch (error) {
      console.error(error);
      setErrorMessage(error?.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 relative overflow-hidden"
      style={{ background: "#f4f5f7" }}>

      {/* Soft bg circles */}
      <div className="absolute rounded-full pointer-events-none"
        style={{ width: 420, height: 420, background: "#dbeafe", bottom: -180, right: -120 }} />
      <div className="absolute rounded-full pointer-events-none"
        style={{ width: 200, height: 200, background: "#eff6ff", top: -80, left: -60 }} />

      <div className="relative z-10 flex w-full max-w-3xl rounded-2xl overflow-hidden shadow-lg border border-slate-200">

        {/* ── Left: Info Panel ── */}
        <div className="hidden md:flex flex-col justify-between w-1/2 p-10"
          style={{ background: "#0f172a" }}>
          <div>
            {/* Logo */}
            <div className="flex items-center gap-2.5 mb-9">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                style={{ background: "#2563eb" }}>LF</div>
              <div>
                <div className="text-white font-medium text-sm">LeadFlow CRM</div>
                <div className="text-[9px] uppercase tracking-widest" style={{ color: "#64748b" }}>
                  Lead Management
                </div>
              </div>
            </div>

            <h1 className="text-white text-xl font-medium leading-snug mb-2">
              Start managing leads<br />the smart way.
            </h1>
            <p className="text-xs leading-relaxed mb-7" style={{ color: "#64748b" }}>
              Set up your account in seconds and get your whole team tracking leads from day one.
            </p>

            {/* Steps */}
            <ol className="flex flex-col">
              {steps.map((s, i) => (
                <li key={s.title} className="flex gap-3 relative">
                  {i < steps.length - 1 && (
                    <div className="absolute left-[11px] top-6 w-px h-full" style={{ background: "#1e293b" }} />
                  )}
                  <div className="w-[22px] h-[22px] rounded-full flex items-center justify-center text-white text-[10px] font-semibold flex-shrink-0 mt-0.5 relative z-10"
                    style={{ background: "#2563eb" }}>{i + 1}</div>
                  <div className="pb-5">
                    <p className="text-xs font-medium mb-0.5" style={{ color: "#e2e8f0" }}>{s.title}</p>
                    <p className="text-[11px] leading-relaxed" style={{ color: "#475569" }}>{s.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {/* Trust avatars */}
          <div className="flex items-center gap-2">
            <div className="flex">
              {avatars.map((a, i) => (
                <div key={a.initials}
                  className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[9px] font-semibold border-2"
                  style={{ background: a.bg, borderColor: "#0f172a", marginLeft: i === 0 ? 0 : -8, zIndex: avatars.length - i }}>
                  {a.initials}
                </div>
              ))}
            </div>
            <span className="text-[11px] ml-1" style={{ color: "#475569" }}>
              <span style={{ color: "#94a3b8" }}>1,200+ teams</span> already on board
            </span>
          </div>
        </div>

        {/* ── Right: Register Panel ── */}
        <div className="flex flex-col justify-center w-full md:w-1/2 bg-white px-8 py-10">
          <h2 className="text-xl font-medium mb-1" style={{ color: "#0f172a" }}>Create an account</h2>
          <p className="text-xs mb-6" style={{ color: "#94a3b8" }}>Get started with LeadFlow CRM for free</p>

          {/* Google */}
          <button type="button"
            className="w-full h-9 flex items-center justify-center gap-2 rounded-lg text-xs mb-4 transition-colors"
            style={{ border: "1px solid #e2e8f0", background: "#fff", color: "#374151" }}
            onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"}
            onMouseLeave={e => e.currentTarget.style.background = "#fff"}>
            <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908C16.658 14.233 17.64 11.926 17.64 9.2z" fill="#4285F4"/>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
              <path d="M3.964 10.71c-.18-.54-.282-1.117-.282-1.71s.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
            </svg>
            Sign up with Google
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px" style={{ background: "#f1f5f9" }} />
            <span className="text-[11px]" style={{ color: "#cbd5e1" }}>or</span>
            <div className="flex-1 h-px" style={{ background: "#f1f5f9" }} />
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-2.5">
            {/* Name row */}
            <div className="grid grid-cols-2 gap-2">
              {[["firstName", "First name", "Rahul"], ["lastName", "Last name", "Mehta"]].map(([name, label, ph]) => (
                <div key={name} className="flex flex-col gap-1">
                  <label className="text-[11px] font-medium" style={{ color: "#64748b" }}>{label}</label>
                  <input type="text" name={name} placeholder={ph} required
                    value={formData[name]} onChange={handleChange} disabled={isLoading}
                    className="h-9 px-3 text-xs rounded-lg outline-none transition-all disabled:opacity-50"
                    style={{ border: "1px solid #e2e8f0", background: "#f8fafc", color: "#0f172a" }}
                    onFocus={e => { e.target.style.borderColor = "#2563eb"; e.target.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.08)"; e.target.style.background = "#fff"; }}
                    onBlur={e  => { e.target.style.borderColor = "#e2e8f0"; e.target.style.boxShadow = "none"; e.target.style.background = "#f8fafc"; }}
                  />
                </div>
              ))}
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-medium" style={{ color: "#64748b" }}>Work Email</label>
              <input type="email" name="email" placeholder="you@company.com" required
                value={formData.email} onChange={handleChange} disabled={isLoading}
                className="h-9 px-3 text-xs rounded-lg outline-none transition-all disabled:opacity-50"
                style={{ border: "1px solid #e2e8f0", background: "#f8fafc", color: "#0f172a" }}
                onFocus={e => { e.target.style.borderColor = "#2563eb"; e.target.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.08)"; e.target.style.background = "#fff"; }}
                onBlur={e  => { e.target.style.borderColor = "#e2e8f0"; e.target.style.boxShadow = "none"; e.target.style.background = "#f8fafc"; }}
              />
            </div>

            {/* Password + strength */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-medium" style={{ color: "#64748b" }}>Password</label>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} name="password"
                  placeholder="Min. 8 characters" required
                  value={formData.password} onChange={handleChange} disabled={isLoading}
                  className="w-full h-9 px-3 pr-9 text-xs rounded-lg outline-none transition-all disabled:opacity-50"
                  style={{ border: "1px solid #e2e8f0", background: "#f8fafc", color: "#0f172a" }}
                  onFocus={e => { e.target.style.borderColor = "#2563eb"; e.target.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.08)"; e.target.style.background = "#fff"; }}
                  onBlur={e  => { e.target.style.borderColor = "#e2e8f0"; e.target.style.boxShadow = "none"; e.target.style.background = "#f8fafc"; }}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2"
                  style={{ background: "none", border: "none", color: "#cbd5e1", cursor: "pointer" }}>
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              {/* Strength bars */}
              <div className="flex gap-1 mt-1">
                {[0, 1, 2].map(i => (
                  <div key={i} className="flex-1 rounded-full" style={{
                    height: 3,
                    background: strength >= 0 && i <= strength ? strengthColor[strength] : "#f1f5f9",
                    transition: "background 0.2s",
                  }} />
                ))}
              </div>
            </div>

            {errorMessage && (
              <div className="p-2.5 text-xs rounded-lg" style={{ color: "#ef4444", background: "#fef2f2", border: "1px solid #fecaca" }}>
                {errorMessage}
              </div>
            )}

            <p className="text-[11px] leading-relaxed" style={{ color: "#94a3b8" }}>
              By creating an account you agree to our{" "}
              <a href="/terms" style={{ color: "#2563eb", textDecoration: "none" }}>Terms of Service</a> and{" "}
              <a href="/privacy" style={{ color: "#2563eb", textDecoration: "none" }}>Privacy Policy</a>.
            </p>

            <button type="submit" disabled={isLoading}
              className="w-full h-9 rounded-lg text-white text-xs font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-60"
              style={{ background: "#2563eb" }}
              onMouseEnter={e => !isLoading && (e.currentTarget.style.background = "#1d4ed8")}
              onMouseLeave={e => (e.currentTarget.style.background = "#2563eb")}>
              {isLoading
                ? <><Loader2 size={14} className="animate-spin" /> Creating account...</>
                : <><UserPlus size={14} /> Create Account</>}
            </button>
          </form>

          <p className="text-center text-xs mt-4" style={{ color: "#94a3b8" }}>
            Already have an account?{" "}
            <a href="/login" style={{ color: "#2563eb", fontWeight: 500, textDecoration: "none" }}>Sign in</a>
          </p>
        </div>

      </div>
    </div>
  );
}