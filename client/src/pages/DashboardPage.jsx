import React, { useEffect, useState } from "react";
import { Users, TrendingUp, UserPlus, Phone, CheckCircle2 } from "lucide-react";

const DashboardPage = () => {
  const [stats, setStats] = useState({});

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/dashboard`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message);
        }

        setStats(data.stats);
      } catch (error) {
        console.log(error);
      }
    };
    fetchDashboard();
  }, []);

  const name = localStorage.getItem("name") || "there";

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8 flex flex-col gap-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white leading-tight">
          Welcome Back, {name}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Here's what's happening with your leads today.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Leads */}
        <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 rounded-xl p-4 sm:p-5 hover:shadow-sm transition-all duration-200">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs sm:text-sm font-semibold text-blue-800 dark:text-blue-300 leading-tight">
              Total Leads
            </span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-blue-100 dark:bg-blue-950/60 flex items-center justify-center shrink-0">
              <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold mt-3 sm:mt-4 text-blue-950 dark:text-blue-50">
            {stats.totalLeads ?? "—"}
          </h2>
        </div>

        {/* New Leads */}
        <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 rounded-xl p-4 sm:p-5 hover:shadow-sm transition-all duration-200">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs sm:text-sm font-semibold text-emerald-800 dark:text-emerald-300 leading-tight">
              New Leads
            </span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center shrink-0">
              <UserPlus className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold mt-3 sm:mt-4 text-emerald-950 dark:text-emerald-50">
            {stats.newLeads ?? "—"}
          </h2>
        </div>

        {/* Contacted */}
        <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/40 rounded-xl p-4 sm:p-5 hover:shadow-sm transition-all duration-200">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs sm:text-sm font-semibold text-amber-800 dark:text-amber-300 leading-tight">
              Contacted
            </span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-amber-100 dark:bg-amber-950/60 flex items-center justify-center shrink-0">
              <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold mt-3 sm:mt-4 text-amber-950 dark:text-amber-50">
            {stats.contactedLeads ?? "—"}
          </h2>
        </div>

        {/* Closed */}
        <div className="bg-purple-50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/40 rounded-xl p-4 sm:p-5 hover:shadow-sm transition-all duration-200">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs sm:text-sm font-semibold text-purple-800 dark:text-purple-300 leading-tight">
              Closed
            </span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-purple-100 dark:bg-purple-950/60 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold mt-3 sm:mt-4 text-purple-950 dark:text-purple-50">
            {stats.closedLeads ?? "—"}
          </h2>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
