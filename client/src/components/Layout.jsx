import React, { useState, useEffect } from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, LogOut, Zap, Menu, X, Sun, Moon } from "lucide-react";

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setuser] = useState();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [theme, setTheme] = useState("light");

  const name = user?.name || "User Name";
  const role = user?.role || "Member";
  const initials = name
    ?.split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  useEffect(() => {
    // Determine active theme on load
    const savedTheme = localStorage.getItem("landing-theme") || "light";
    setTheme(savedTheme);
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
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

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/auth/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        if (!response.ok) {
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }
        const data = await response.json();
        setuser(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchCurrentUser();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    navigate("/login");
  };

  const navItems = [
    { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/dashboard/leads", icon: Users, label: "Leads" },
  ];

  const closeSidebar = () => setSidebarOpen(false);

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="h-16 flex items-center gap-2.5 px-5 border-b border-border shrink-0">
        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
          <Zap className="w-4 h-4 text-white" />
        </div>
        <span className="text-base font-semibold tracking-tight text-foreground">
          LeadFlow
          <span className="text-muted-foreground font-normal"> CRM</span>
        </span>
        {/* Close button — mobile only */}
        <button
          onClick={closeSidebar}
          className="ml-auto p-1.5 rounded-lg text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors md:hidden"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto">
        <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-widest px-3 mb-2">
          Menu
        </p>

        {navItems.map(({ to, icon: Icon, label }) => {
          const isActive = location.pathname === to;
          return (
            <Link
              key={to}
              to={to}
              onClick={closeSidebar}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                ${
                  isActive
                    ? "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-semibold"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* User + Logout */}
      <div className="px-3 py-4 border-t border-border space-y-1 shrink-0">
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-muted/60">
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {name}
            </p>
            <p className="text-[11px] text-muted-foreground">{role}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          Log out
        </button>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-background transition-colors duration-300">
      {/* Mobile overlay backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-60 bg-background border-r border-border flex flex-col
          transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:static md:translate-x-0 md:z-auto md:shrink-0
        `}
      >
        <SidebarContent />
      </aside>

      {/* Main section */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-14 md:h-16 bg-background border-b border-border px-4 md:px-6 flex items-center justify-between shrink-0 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            {/* Hamburger — mobile only */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors md:hidden"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <h2 className="text-sm font-semibold text-foreground leading-tight">
                {navItems.find((n) => n.to === location.pathname)?.label ??
                  "Overview"}
              </h2>
              <p className="text-xs text-muted-foreground hidden sm:block">
                Welcome back, {name.split(" ")[0]}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Light/Dark Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
              aria-label="Toggle Theme Mode"
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <div className="w-2 h-2 rounded-full bg-green-500 ring-2 ring-green-500/20 animate-pulse" />
            <span className="text-xs text-muted-foreground hidden sm:block">
              Online
            </span>
            <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs md:text-sm font-semibold">
              {initials}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
