import React from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, LogOut, Zap } from "lucide-react";

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const name = localStorage.getItem("name") || "User Name";
  const initials = name
    ?.split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    navigate("/login");
  };

  const navItems = [
    { to: "/", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/leads", icon: Users, label: "Leads" },
  ];

  return (
    <div className="flex min-h-screen bg-muted/40">
      {/* Sidebar */}
      <aside className="w-60 bg-background border-r border-border flex flex-col">
        {/* Logo */}
        <div className="h-16 flex items-center gap-2.5 px-5 border-b border-border">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
            <Zap className="w-4 h-4 text-white" />
          </div>

          <span className="text-base font-semibold tracking-tight text-foreground">
            LeadFlow
            <span className="text-muted-foreground font-normal"> CRM</span>
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
          <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-widest px-3 mb-2">
            Menu
          </p>

          {navItems.map(({ to, icon: Icon, label }) => {
            const isActive = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                  ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {label}
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User + Logout */}
        <div className="px-3 py-4 border-t border-border space-y-1">
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-muted/60">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-primary-foreground flex items-center justify-center text-xs font-bold shrink-0">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {name}
              </p>
              <p className="text-[11px] text-muted-foreground">Member</p>
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
      </aside>

      {/* Main Section */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-16 bg-background border-b border-border px-6 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-sm font-semibold text-foreground">
              {navItems.find((n) => n.to === location.pathname)?.label ??
                "Overview"}
            </h2>
            <p className="text-xs text-muted-foreground">
              Welcome back, {name.split(" ")[0]}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-green-500 ring-2 ring-green-500/20" />
            <span className="text-xs text-muted-foreground hidden sm:block">
              Online
            </span>
            <div className="w-9 h-9 rounded-full bg-blue-600 text-primary-foreground flex items-center justify-center text-sm font-semibold">
              {initials}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
