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

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold">
          Welcome Back, {localStorage.getItem("name")}
        </h1>

        <p className="text-sm text-slate-500">
          Here's what's happening with your leads today.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Total Leads */}
        <div className="bg-blue-50 border border-blue-100 text-blue-900 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="font-medium text-blue-800">Total Leads</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <h2 className="text-3xl font-bold mt-4 text-blue-950">
            {stats.totalLeads}
          </h2>
        </div>

        {/* New Leads */}
        <div className="bg-emerald-50 border border-emerald-100 text-emerald-900 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="font-medium text-emerald-800">New Leads</span>
            <UserPlus className="w-4 h-4 text-emerald-600" />
          </div>
          <h2 className="text-3xl font-bold mt-4 text-emerald-950">
            {stats.newLeads}
          </h2>
        </div>

        {/* Contacted */}
        <div className="bg-amber-50 border border-amber-100 text-amber-900 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="font-medium text-amber-800">Contacted</span>
            <Phone className="w-4 h-4 text-amber-600" />
          </div>
          <h2 className="text-3xl font-bold mt-4 text-amber-950">
            {stats.contactedLeads}
          </h2>
        </div>

        {/* Closed */}
        <div className="bg-purple-50 border border-purple-100 text-purple-900 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="font-medium text-purple-800">Closed</span>
            <CheckCircle2 className="w-4 h-4 text-purple-600" />
          </div>
          <h2 className="text-3xl font-bold mt-4 text-purple-950">
            {stats.closedLeads}
          </h2>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
