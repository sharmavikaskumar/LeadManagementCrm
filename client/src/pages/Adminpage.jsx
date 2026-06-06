import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { getAdminAnalytics } from "@/services/adminService";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Download } from "lucide-react";

import {
  Users,
  Mail,
  TrendingUp,
  BarChart2,
  CheckCircle2,
  PhoneCall,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const getInitials = (name = "") =>
  name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

const avatarColors = [
  "bg-rose-500",
  "bg-pink-500",
  "bg-fuchsia-500",
  "bg-purple-500",
  "bg-indigo-500",
  "bg-blue-500",
  "bg-sky-500",
  "bg-cyan-500",
  "bg-teal-500",
  "bg-emerald-500",
  "bg-green-500",
];

const getAvatarColor = (name = "") => {
  const hash = name.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return avatarColors[hash % avatarColors.length] + " text-white";
};

const AdminPage = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const data = await getAdminAnalytics(page);
        setEmployees(data.data);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [page]);

  const filteredEmployees = employees.filter((emp) =>
    emp.employeeName.toLowerCase().includes(search.toLowerCase()),
  );

  const exportPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Employee Analytics Report", 14, 20);

    autoTable(doc, {
      startY: 30,
      head: [
        [
          "Employee",
          "Email",
          "Total",
          "New",
          "Contacted",
          "Qualified",
          "Closed",
        ],
      ],
      body: filteredEmployees.map((emp) => [
        emp.employeeName,
        emp.employeeEmail,
        emp.totalLeads,
        emp.new,
        emp.contacted,
        emp.qualified,
        emp.closed,
      ]),
    });

    doc.save("employee-analytics.pdf");
  };

  const totals = employees.reduce(
    (acc, emp) => ({
      total: acc.total + (emp.totalLeads || 0),
      new: acc.new + (emp.new || 0),
      contacted: acc.contacted + (emp.contacted || 0),
      qualified: acc.qualified + (emp.qualified || 0),
      closed: acc.closed + (emp.closed || 0),
    }),
    { total: 0, new: 0, contacted: 0, qualified: 0, closed: 0 },
  );

  const summaryCards = [
    {
      label: "Total Leads",
      value: totals.total,
      icon: BarChart2,
      color: "text-slate-500",
    },
    { label: "New", value: totals.new, icon: Sparkles, color: "text-blue-500" },
    {
      label: "Contacted",
      value: totals.contacted,
      icon: PhoneCall,
      color: "text-purple-500",
    },
    {
      label: "Qualified",
      value: totals.qualified,
      icon: TrendingUp,
      color: "text-emerald-500",
    },
    {
      label: "Closed",
      value: totals.closed,
      icon: CheckCircle2,
      color: "text-slate-400",
    },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] gap-3">
        <div className="w-5 h-5 border-2 border-slate-200 dark:border-neutral-800 border-t-blue-500 rounded-full animate-spin" />
        <p className="text-xs font-semibold text-slate-400">
          Loading analytics…
        </p>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8 max-w-7xl mx-auto space-y-4">
      <div>
        <h1 className="text-lg sm:text-2xl font-semibold text-slate-900 dark:text-white tracking-tight">
          Admin Analytics
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Lead performance breakdown across all employees.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {summaryCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="bg-card border border-border rounded-xl px-4 py-3.5 flex flex-col gap-2"
            >
              <div className="flex items-center justify-between">
                <p className="text-[10.5px] font-semibold uppercase tracking-wider text-slate-400">
                  {card.label}
                </p>
                <Icon className={`w-3.5 h-3.5 ${card.color}`} />
              </div>
              <p className="text-2xl font-semibold text-foreground leading-none">
                {card.value}
              </p>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between gap-2">
        <input
          type="text"
          placeholder="Search employee..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-72 px-4 py-2 rounded-lg border border-border bg-background text-sm outline-none focus:ring-2 focus:ring-blue-500"
        />

        <Button
            onClick={exportPDF}
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <Table className="border-collapse border border-border">
            <TableHeader>
              <TableRow className="bg-neutral-50 dark:bg-neutral-900/40 border-b border-border">
                {[
                  "Employee",
                  "Email",
                  "Total",
                  "New",
                  "Contacted",
                  "Qualified",
                  "Closed",
                ].map((header, i) => (
                  <TableHead
                    key={header}
                    className={`text-[10.5px] font-semibold uppercase tracking-wider text-slate-400 py-3 pl-5 ${i !== 6 ? "border-r border-border" : ""} ${header === "Email" ? "hidden sm:table-cell" : ""} ${header === "Contacted" || header === "Qualified" ? "hidden md:table-cell" : ""}`}
                  >
                    {header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredEmployees.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="py-20 text-center">
                    No data found
                  </TableCell>
                </TableRow>
              ) : (
                filteredEmployees.map((emp) => (
                  <TableRow
                    key={emp.employeeEmail}
                    className="hover:bg-neutral-100/10 dark:hover:bg-neutral-900/30 transition-colors border-b border-border"
                  >
                    <TableCell className="py-3 pl-5 border-r border-border">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`rounded-full flex-shrink-0 font-semibold ${getAvatarColor(emp.employeeName)}`}
                          style={{
                            width: 28,
                            height: 28,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 10,
                          }}
                        >
                          {getInitials(emp.employeeName)}
                        </div>
                        <p className="font-semibold text-sm text-foreground">
                          {emp.employeeName}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="py-3 hidden sm:table-cell border-r border-border text-xs text-slate-500">
                      {emp.employeeEmail}
                    </TableCell>
                    <TableCell className="py-3 border-r border-border">
                      {emp.totalLeads}
                    </TableCell>
                    <TableCell className="py-3 border-r border-border">
                      {emp.new}
                    </TableCell>
                    <TableCell className="py-3 hidden md:table-cell border-r border-border">
                      {emp.contacted}
                    </TableCell>
                    <TableCell className="py-3 hidden md:table-cell border-r border-border">
                      {emp.qualified}
                    </TableCell>
                    <TableCell className="py-3">{emp.closed}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Improved Pagination */}
          <div className="flex items-center justify-between px-5 py-4 border-t border-border bg-neutral-50/50 dark:bg-neutral-900/20 mt-2">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg border border-border bg-background text-slate-700 dark:text-slate-200 shadow-sm hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-background"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>

            <div className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Page{" "}
              <span className="text-slate-900 dark:text-slate-100">{page}</span>{" "}
              of{" "}
              <span className="text-slate-900 dark:text-slate-100">
                {totalPages}
              </span>
            </div>

            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg border border-border bg-background text-slate-700 dark:text-slate-200 shadow-sm hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-background"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
