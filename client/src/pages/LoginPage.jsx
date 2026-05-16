import { useState } from "react";
import { loginUser } from "@/services/authService";
import { Loader2, Eye, EyeOff, LayoutDashboard, UserPlus, Bell, BarChart2, CheckCircle } from "lucide-react";

const features = [
    { icon: <UserPlus size={14} />, text: "Capture & assign leads automatically" },
    { icon: <LayoutDashboard size={14} />, text: "Visual pipeline with drag-and-drop stages" },
    { icon: <Bell size={14} />, text: "Follow-up reminders & activity tracking" },
    { icon: <BarChart2 size={14} />, text: "Conversion reports & team performance" },
];

const stats = [
    { num: "3.4×", label: "Faster follow-ups" },
    { num: "68%", label: "Higher conversion" },
];

const LoginPage = () => {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (errorMessage) setErrorMessage("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMessage("");
        try {
            const data = await loginUser(formData);
            localStorage.setItem("token", data.token);
            localStorage.setItem("name", data.user.name);
            window.location.href = "/dashboard";
        } catch (error) {
            console.error(error);
            setErrorMessage(
                error?.response?.data?.message || "Invalid email or password. Please try again."
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-100 px-4">
            <div className="flex w-full max-w-3xl rounded-2xl overflow-hidden shadow-xl border border-slate-200">

                {/* ── Left: Info Panel ── */}
                <div
                    className="hidden md:flex flex-col justify-between w-1/2 p-10 relative overflow-hidden"
                    style={{ background: "linear-gradient(160deg, #0f2027, #1a3a4a, #0d5c6e)" }}
                >
                    <div>
                        {/* Logo */}
                        <div className="flex items-center gap-2.5 mb-9">
                            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-base"
                                style={{ background: "#00c8b4" }}>
                                LF
                            </div>
                            <div>
                                <div className="text-white font-medium text-sm">LeadFlow CRM</div>
                                <div className="text-[10px] uppercase tracking-widest" style={{ color: "#00c8b4" }}>
                                    Lead Management System
                                </div>
                            </div>
                        </div>

                        {/* Trust badge */}
                        <div className="inline-flex items-center gap-1.5 text-[10px] px-3 py-1 rounded-full mb-5"
                            style={{ background: "rgba(0,200,180,0.12)", border: "0.5px solid rgba(0,200,180,0.3)", color: "#00c8b4" }}>
                            <CheckCircle size={11} /> Trusted by 1,200+ sales teams
                        </div>

                        <h1 className="text-white text-xl font-medium leading-snug mb-2">
                            Close more deals.<br />Lose fewer leads.
                        </h1>
                        <p className="text-xs leading-relaxed mb-7" style={{ color: "rgba(255,255,255,0.5)" }}>
                            Track every lead from first touch to closed deal. Assign, follow up,
                            and convert — all from one smart dashboard.
                        </p>

                        {/* Features */}
                        <ul className="flex flex-col gap-3">
                            {features.map(({ icon, text }) => (
                                <li key={text} className="flex items-center gap-3">
                                    <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                                        style={{ background: "rgba(0,200,180,0.15)", border: "0.5px solid rgba(0,200,180,0.25)", color: "#00c8b4" }}>
                                        {icon}
                                    </div>
                                    <span className="text-xs" style={{ color: "rgba(255,255,255,0.7)" }}>{text}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-2.5 mt-8">
                        {stats.map(({ num, label }) => (
                            <div key={label} className="rounded-xl px-3 py-2.5"
                                style={{ background: "rgba(255,255,255,0.06)", border: "0.5px solid rgba(255,255,255,0.1)" }}>
                                <div className="text-lg font-medium" style={{ color: "#00c8b4" }}>{num}</div>
                                <div className="text-[10px] uppercase tracking-wider mt-0.5"
                                    style={{ color: "rgba(255,255,255,0.4)" }}>{label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Right: Login Panel ── */}
                <div className="flex flex-col justify-center w-full md:w-1/2 bg-white px-8 py-10">
                    <h2 className="text-xl font-medium text-gray-900 mb-1">Welcome back</h2>
                    <p className="text-xs text-gray-500 mb-6">Sign in to your CRM dashboard</p>

                    {/* Google */}
                    <button type="button"
                        className="w-full h-9 flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-gray-50 text-gray-600 text-xs hover:bg-gray-100 transition-colors mb-4">
                        <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
                            <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908C16.658 14.233 17.64 11.926 17.64 9.2z" fill="#4285F4" />
                            <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853" />
                            <path d="M3.964 10.71c-.18-.54-.282-1.117-.282-1.71s.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05" />
                            <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z" fill="#EA4335" />
                        </svg>
                        Continue with Google
                    </button>

                    <div className="flex items-center gap-3 mb-4">
                        <div className="flex-1 h-px bg-gray-200" />
                        <span className="text-[11px] text-gray-400">or sign in with email</span>
                        <div className="flex-1 h-px bg-gray-200" />
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                        <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">
                                Work Email
                            </label>
                            <input type="email" name="email" placeholder="you@company.com" required
                                value={formData.email} onChange={handleChange} disabled={isLoading}
                                className="h-9 px-3 text-xs rounded-lg border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition disabled:opacity-50"
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <div className="flex justify-between items-center">
                                <label className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Password</label>
                                <a href="/forgot-password" className="text-[11px] hover:underline" style={{ color: "#00a896" }}>
                                    Forgot password?
                                </a>
                            </div>
                            <div className="relative">
                                <input type={showPassword ? "text" : "password"} name="password"
                                    placeholder="Enter your password" required
                                    value={formData.password} onChange={handleChange} disabled={isLoading}
                                    className="w-full h-9 px-3 pr-9 text-xs rounded-lg border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition disabled:opacity-50"
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                                </button>
                            </div>
                        </div>

                        {errorMessage && (
                            <div className="p-2.5 text-xs text-red-500 bg-red-50 rounded-lg border border-red-100">
                                {errorMessage}
                            </div>
                        )}

                        <button type="submit" disabled={isLoading}
                            className="w-full h-9 mt-1 flex items-center justify-center gap-2 rounded-lg text-white text-xs font-medium transition disabled:opacity-60"
                            style={{ background: "#0d5c6e" }}>
                            {isLoading ? (
                                <><Loader2 size={14} className="animate-spin" /> Signing in...</>
                            ) : (
                                <><LayoutDashboard size={14} /> Go to Dashboard</>
                            )}
                        </button>
                    </form>

                    <p className="text-center text-xs text-gray-400 mt-5">
                        New to LeadFlow?{" "}
                        <a href="/register" className="font-medium hover:underline" style={{ color: "#00a896" }}>
                            Request access
                        </a>
                    </p>
                </div>

            </div>
        </div>
    );
};

export default LoginPage;