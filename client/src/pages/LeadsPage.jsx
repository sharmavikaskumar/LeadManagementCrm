import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  cretaeLead,
  deleteLead,
  getLeads,
  updatedLead,
} from "@/services/leadService";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  X,
  ChevronLeft,
  ChevronRight,
  Users,
  Mail,
  Phone,
  Building2,
} from "lucide-react";

const LeadsPage = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingLead, setEditingLead] = useState(null);
  const [showModel, setShowModel] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    status: "new",
  });

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const response = await getLeads(page);
        setLeads(response.leads);
        setTotalPages(response.totalPages);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchLeads();
  }, [page]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingLead) {
        const updated = await updatedLead(editingLead._id, formData);
        setLeads((prev) =>
          prev.map((lead) => (lead._id === editingLead._id ? updated : lead)),
        );
        toast.success("Lead updated successfully");
      } else {
        const newLead = await cretaeLead(formData);
        setLeads((prev) => [newLead, ...prev]);
        toast.success("Lead created successfully");
      }
      setShowModel(false);
      setEditingLead(null);
      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        status: "new",
      });
    } catch (error) {
      toast.error(error.message);
    }
  };

  const filteredLeads = leads.filter((lead) =>
    lead.name.toLowerCase().includes(search.toLowerCase()),
  );

  const handelEditlead = (lead) => {
    setEditingLead(lead);
    setFormData({
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      company: lead.company,
      status: lead.status,
    });
    setShowModel(true);
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure want to delete this lead?");
    if (!confirmed) return;
    try {
      await deleteLead(id);
      setLeads(leads.filter((l) => l._id !== id));
      toast.success("Lead deleted successfully");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const closeModal = () => {
    setShowModel(false);
    setEditingLead(null);
    setFormData({ name: "", email: "", phone: "", company: "", status: "new" });
  };

  const statusConfig = {
    new: {
      label: "New",
      className: "bg-blue-50 text-blue-600 border-blue-200",
    },
    contacted: {
      label: "Contacted",
      className: "bg-purple-50 text-purple-600 border-purple-200",
    },
    qualified: {
      label: "Qualified",
      className: "bg-emerald-50 text-emerald-600 border-emerald-200",
    },
    closed: {
      label: "Closed",
      className: "bg-slate-100 text-slate-500 border-slate-200",
    },
  };

  const getInitials = (name) =>
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
    "bg-violet-500",
    "bg-indigo-500",
    "bg-blue-500",
    "bg-sky-500",
    "bg-cyan-500",
    "bg-teal-500",
    "bg-emerald-500",
    "bg-green-500",
  ];

  const getAvatarColor = (name) => {
    const hash = name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
    return avatarColors[hash % avatarColors.length];
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] text-slate-400 gap-3">
        <div className="w-5 h-5 border-2 border-slate-200 border-t-indigo-500 rounded-full animate-spin" />
        <p className="text-xs text-slate-400">Loading leads…</p>
      </div>
    );
  }

  return (
    <div className="px-4 py-4 sm:px-6 sm:py-5 max-w-7xl mx-auto space-y-4 bg-[#FAF9F6]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-lg sm:text-xl font-semibold text-slate-900 tracking-tight">
            Leads pipeline
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage, track, and convert your potential customers.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Search */}
          <div className="relative flex-1 sm:flex-none">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search leads…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-xs w-full sm:w-52 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-colors"
            />
          </div>

          {/* Add Lead */}
          <button
            onClick={() => setShowModel(true)}
            className="flex items-center gap-1.5 bg-slate-900 text-white px-3 py-2 rounded-lg text-xs font-medium hover:bg-slate-800 transition-colors whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            Add lead
          </button>
        </div>
      </div>

      {/* ── Mobile card list (< md) ── */}
      <div className="md:hidden space-y-2">
        {filteredLeads.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl py-16 flex flex-col items-center gap-3">
            <div className="w-9 h-9 bg-slate-100 rounded-lg flex items-center justify-center">
              <Users className="w-4 h-4 text-slate-400" />
            </div>
            <p className="text-slate-700 font-medium text-sm">No leads found</p>
            <p className="text-slate-400 text-xs text-center max-w-xs px-4">
              Get started by adding your first lead.
            </p>
            <button
              onClick={() => setShowModel(true)}
              className="flex items-center gap-1.5 text-indigo-600 hover:bg-indigo-50 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Add your first lead
            </button>
          </div>
        ) : (
          filteredLeads.map((lead) => (
            <div
              key={lead._id}
              className="bg-white border border-slate-200 rounded-xl p-4"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0 ${getAvatarColor(lead.name)}`}
                >
                  {getInitials(lead.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-slate-900 truncate">
                    {lead.name}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
                    <Building2 className="w-3 h-3 shrink-0" />
                    <span className="truncate">{lead.company}</span>
                  </div>
                </div>
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border flex-shrink-0 ${
                    statusConfig[lead.status]?.className ??
                    statusConfig.new.className
                  }`}
                >
                  {statusConfig[lead.status]?.label ?? lead.status}
                </span>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-100 flex flex-col gap-1.5">
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Mail className="w-3 h-3 text-slate-300 shrink-0" />
                  <span className="truncate">{lead.email}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Phone className="w-3 h-3 text-slate-300 shrink-0" />
                  <span>{lead.phone}</span>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  onClick={() => handelEditlead(lead)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                >
                  <Edit2 className="w-3 h-3" /> Edit
                </button>
                <button
                  onClick={() => handleDelete(lead._id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors"
                >
                  <Trash2 className="w-3 h-3" /> Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ── Desktop table (≥ md) ── */}
      <div className="hidden md:block bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50 hover:bg-slate-50 border-b border-slate-200">
                <TableHead className="text-[10.5px] font-semibold uppercase tracking-wider text-slate-400 py-3 pl-5">
                  Lead
                </TableHead>
                <TableHead className="text-[10.5px] font-semibold uppercase tracking-wider text-slate-400 py-3">
                  Contact
                </TableHead>
                <TableHead className="text-[10.5px] font-semibold uppercase tracking-wider text-slate-400 py-3 hidden lg:table-cell">
                  Company
                </TableHead>
                <TableHead className="text-[10.5px] font-semibold uppercase tracking-wider text-slate-400 py-3">
                  Status
                </TableHead>
                <TableHead className="text-[10.5px] font-semibold uppercase tracking-wider text-slate-400 py-3 text-right pr-5">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredLeads.map((lead) => (
                <TableRow
                  key={lead._id}
                  className="hover:bg-slate-50/60 transition-colors border-b border-slate-100 last:border-0 group"
                >
                  <TableCell className="py-3 pl-5">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-semibold flex-shrink-0 ${getAvatarColor(lead.name)}`}
                      >
                        {getInitials(lead.name)}
                      </div>
                      <div>
                        <div className="font-medium text-sm text-slate-900">
                          {lead.name}
                        </div>
                        <div className="text-xs text-slate-400 lg:hidden mt-0.5">
                          {lead.company}
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="py-3">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <Mail className="w-3 h-3 text-slate-300 shrink-0" />
                        <span className="truncate max-w-[140px] xl:max-w-[200px]">
                          {lead.email}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-400">
                        <Phone className="w-3 h-3 text-slate-300 shrink-0" />
                        <span>{lead.phone}</span>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="py-3 hidden lg:table-cell">
                    <div className="flex items-center gap-1.5 text-xs text-slate-600">
                      <Building2 className="w-3 h-3 text-slate-300 shrink-0" />
                      <span className="truncate max-w-[130px]">
                        {lead.company}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="py-3">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${
                        statusConfig[lead.status]?.className ??
                        statusConfig.new.className
                      }`}
                    >
                      {statusConfig[lead.status]?.label ?? lead.status}
                    </span>
                  </TableCell>

                  <TableCell className="py-3 pr-5">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handelEditlead(lead)}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(lead._id)}
                        className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-md transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}

              {filteredLeads.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-9 h-9 bg-slate-100 rounded-lg flex items-center justify-center">
                        <Users className="w-4 h-4 text-slate-400" />
                      </div>
                      <p className="text-slate-700 font-medium text-sm">
                        No leads found
                      </p>
                      <p className="text-slate-400 text-xs max-w-xs mx-auto">
                        Get started by adding your first lead to track your
                        sales pipeline.
                      </p>
                      <button
                        onClick={() => setShowModel(true)}
                        className="flex items-center gap-1.5 text-indigo-600 hover:bg-indigo-50 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add your first lead
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {leads.length > 0 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100 bg-slate-50/50">
            <p className="text-xs text-slate-400">
              Page <span className="font-medium text-slate-600">{page}</span> of{" "}
              <span className="font-medium text-slate-600">{totalPages}</span>
            </p>
            <div className="flex items-center gap-1.5">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="flex items-center gap-1 px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs font-medium text-slate-500 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors bg-transparent"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Prev
              </button>
              <button
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
                className="flex items-center gap-1 px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs font-medium text-slate-500 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors bg-transparent"
              >
                Next <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Mobile pagination */}
      {leads.length > 0 && (
        <div className="md:hidden flex items-center justify-between px-1">
          <p className="text-xs text-slate-400">
            Page <span className="font-medium text-slate-600">{page}</span> of{" "}
            <span className="font-medium text-slate-600">{totalPages}</span>
          </p>
          <div className="flex items-center gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="flex items-center gap-1 px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-medium text-slate-500 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" /> Prev
            </button>
            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className="flex items-center gap-1 px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-medium text-slate-500 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Next <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* ── Modal ── */}
      {showModel && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-slate-900/30 backdrop-blur-[2px]"
          onClick={(e) => e.target === e.currentTarget && closeModal()}
        >
          <div className="bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-xl shadow-xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <div>
                <h2 className="text-sm font-semibold text-slate-900">
                  {editingLead ? "Edit lead" : "Add new lead"}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  {editingLead
                    ? "Update the information for this lead."
                    : "Enter the details for this lead."}
                </p>
              </div>
              <button
                onClick={closeModal}
                className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1.5 rounded-md transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 flex flex-col gap-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10.5px] font-semibold text-slate-500 uppercase tracking-wider">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10.5px] font-semibold text-slate-500 uppercase tracking-wider">
                    Company
                  </label>
                  <input
                    type="text"
                    name="company"
                    placeholder="Acme Corp"
                    value={formData.company}
                    onChange={handleChange}
                    required
                    className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-colors"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10.5px] font-semibold text-slate-500 uppercase tracking-wider">
                  Email address
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10.5px] font-semibold text-slate-500 uppercase tracking-wider">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="+91 9000000000"
                    value={formData.phone}
                    onChange={handleChange}
                    className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10.5px] font-semibold text-slate-500 uppercase tracking-wider">
                    Status
                  </label>
                  <div className="relative">
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="appearance-none w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-colors pr-8"
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="qualified">Qualified</option>
                      <option value="closed">Closed</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-400">
                      <ChevronLeft className="w-3 h-3 -rotate-90" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-1 border-t border-slate-100">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="px-4 py-2 text-xs font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors"
                >
                  {editingLead ? "Update lead" : "Save lead"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadsPage;
