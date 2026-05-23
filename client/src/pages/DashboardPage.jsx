import React, { useEffect, useState } from "react";
import { Users, TrendingUp, UserPlus, Phone, CheckCircle2 } from "lucide-react";

const DashboardPage = () => {
  const [stats, setStats] = useState({});

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:5000/api/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setStats(data.stats);
      } catch (error) {
        console.log(error);
      }
    };
    fetchDashboard();
  }, []);

  const name = localStorage.getItem("name") || "there";

  return (
    <div className="px-4 py-4 sm:px-6 sm:py-5 flex flex-col gap-4 max-w-7xl mx-auto">

      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-semibold text-slate-900 leading-tight">
          Welcome Back, {name}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Here's what's happening with your leads today.
        </p>
      </div>

      {/* Stats grid — 2 cols on mobile, 4 on lg */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">

        {/* Total Leads */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-3.5 sm:p-4">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs sm:text-sm font-medium text-blue-800 leading-tight">
              Total Leads
            </span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
              <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600" />
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold mt-3 sm:mt-4 text-blue-950">
            {stats.totalLeads ?? "—"}
          </h2>
        </div>

        {/* New Leads */}
        <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3.5 sm:p-4">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs sm:text-sm font-medium text-emerald-800 leading-tight">
              New Leads
            </span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
              <UserPlus className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600" />
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold mt-3 sm:mt-4 text-emerald-950">
            {stats.newLeads ?? "—"}
          </h2>
        </div>

        {/* Contacted */}
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-3.5 sm:p-4">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs sm:text-sm font-medium text-amber-800 leading-tight">
              Contacted
            </span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
              <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600" />
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold mt-3 sm:mt-4 text-amber-950">
            {stats.contactedLeads ?? "—"}
          </h2>
        </div>

        {/* Closed */}
        <div className="bg-purple-50 border border-purple-100 rounded-xl p-3.5 sm:p-4">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs sm:text-sm font-medium text-purple-800 leading-tight">
              Closed
            </span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-purple-100 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-600" />
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold mt-3 sm:mt-4 text-purple-950">
            {stats.closedLeads ?? "—"}
          </h2>
        </div>

      </div>
    </div>
  );
};

export default DashboardPage;