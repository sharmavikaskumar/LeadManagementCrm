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