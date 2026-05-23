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
          prev.map((lead) => (lead._id === editingLead._id ? updated : lead))
        );
        toast.success("Lead updated successfully");
      } else {
        const newLead = await cretaeLead(formData);
        setLeads((prev) => [newLead, ...prev]);
        toast.success("Lead created successfully");
      }
      setShowModel(false);
      setEditingLead(null);
      setFormData({ name: "", email: "", phone: "", company: "", status: "new" });
    } catch (error) {
      toast.error(error.message);
    }
  };

  const filteredLeads = leads.filter((lead) =>
    lead.name.toLowerCase().includes(search.toLowerCase())
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
    new: { label: "New", className: "bg-blue-100 text-blue-800 border-blue-200" },
    contacted: { label: "Contacted", className: "bg-purple-100 text-purple-800 border-purple-200" },
    qualified: { label: "Qualified", className: "bg-emerald-100 text-emerald-800 border-emerald-200" },
    closed: { label: "Closed", className: "bg-slate-100 text-slate-800 border-slate-200" },
  };

  const getInitials = (name) =>
    name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();

  const avatarColors = [
    "bg-rose-500", "bg-pink-500", "bg-fuchsia-500", "bg-purple-500",
    "bg-violet-500", "bg-indigo-500", "bg-blue-500", "bg-sky-500",
    "bg-cyan-500", "bg-teal-500", "bg-emerald-500", "bg-green-500",
  ];

  const getAvatarColor = (name) => {
    const hash = name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
    return avatarColors[hash % avatarColors.length];
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] text-slate-400 gap-3">
        <div className="w-7 h-7 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-medium animate-pulse">Loading leads...</p>
      </div>
    );
  }

  return (
    <div className="px-4 py-4 sm:px-6 sm:py-5 max-w-7xl mx-auto space-y-4 animate-in fade-in duration-500">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Leads Pipeline
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Manage, track, and convert your potential customers.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Search */}
          <div className="relative group flex-1 sm:flex-none">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-indigo-500 transition-colors" />
            <input
              type="text"
              placeholder="Search leads..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-sm w-full sm:w-56 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
            />
          </div>

          {/* Add Lead */}
          <button
            onClick={() => setShowModel(true)}
            className="flex items-center gap-1.5 bg-indigo-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 active:scale-[0.98] transition-all shadow-sm shadow-indigo-200 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden xs:inline sm:inline">Add Lead</span>
            <span className="xs:hidden sm:hidden">Add</span>
          </button>
        </div>
      </div>

      {/* ── Mobile card list (< md) ── */}
      <div className="md:hidden space-y-2">
        {filteredLeads.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl py-16 flex flex-col items-center gap-3">
            <div className="w-11 h-11 bg-slate-100 rounded-full flex items-center justify-center">
              <Users className="w-5 h-5 text-slate-400" />
            </div>
            <p className="text-slate-900 font-medium text-sm">No leads found</p>
            <p className="text-slate-500 text-xs text-center max-w-xs px-4">
              Get started by adding your first lead.
            </p>
            <button
              onClick={() => setShowModel(true)}
              className="flex items-center gap-1.5 text-indigo-600 hover:bg-indigo-50 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
            >
              <Plus className="w-4 h-4" /> Add your first lead
            </button>
          </div>
        ) : (
          filteredLeads.map((lead) => (
            <div
              key={lead._id}
              className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm"
            >
              {/* Top row: avatar + name + status + actions */}
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ${getAvatarColor(lead.name)}`}
                >
                  {getInitials(lead.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-slate-900 truncate">{lead.name}</p>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                    <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
                    <span className="truncate">{lead.company}</span>
                  </div>
                </div>
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border flex-shrink-0 ${
                    statusConfig[lead.status]?.className ?? statusConfig.new.className
                  }`}
                >
                  {statusConfig[lead.status]?.label ?? lead.status}
                </span>
              </div>

              {/* Contact info row */}
              <div className="mt-3 pt-3 border-t border-slate-100 flex flex-col gap-1.5">
                <div className="flex items-center gap-1.5 text-xs text-slate-600">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{lead.email}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{lead.phone}</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  onClick={() => handelEditlead(lead)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" /> Edit
                </button>
                <button
                  onClick={() => handleDelete(lead._id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ── Desktop / 720p table (≥ md) ── */}
      <div className="hidden md:block bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/80 hover:bg-slate-50/80 border-b border-slate-200">
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-slate-500 py-3 pl-5">
                  Lead
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-slate-500 py-3">
                  Contact Info
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-slate-500 py-3 hidden lg:table-cell">
                  Company
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-slate-500 py-3">
                  Status
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-slate-500 py-3 text-right pr-5">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredLeads.map((lead) => (
                <TableRow
                  key={lead._id}
                  className="hover:bg-slate-50/80 transition-colors border-b border-slate-100 last:border-0 group"
                >
                  {/* Name + Avatar */}
                  <TableCell className="py-3 pl-5">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ${getAvatarColor(lead.name)}`}
                      >
                        {getInitials(lead.name)}
                      </div>
                      <div>
                        <div className="font-semibold text-sm text-slate-900">{lead.name}</div>
                        <div className="text-xs text-slate-500 lg:hidden mt-0.5">{lead.company}</div>
                      </div>
                    </div>
                  </TableCell>

                  {/* Contact Info */}
                  <TableCell className="py-3">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5 text-xs text-slate-600">
                        <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate max-w-[140px] xl:max-w-[200px]">{lead.email}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                        <span>{lead.phone}</span>
                      </div>
                    </div>
                  </TableCell>

                  {/* Company — hidden at 720p (md), shown at lg+ */}
                  <TableCell className="py-3 hidden lg:table-cell">
                    <div className="flex items-center gap-1.5 text-xs font-medium text-slate-700">
                      <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate max-w-[130px]">{lead.company}</span>
                    </div>
                  </TableCell>

                  {/* Status Badge */}
                  <TableCell className="py-3">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${
                        statusConfig[lead.status]?.className ?? statusConfig.new.className
                      }`}
                    >
                      {statusConfig[lead.status]?.label ?? lead.status}
                    </span>
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="py-3 pr-5">
                    <div className="flex items-center justify-end gap-1 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handelEditlead(lead)}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(lead._id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
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
                      <div className="w-11 h-11 bg-slate-100 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-slate-400" />
                      </div>
                      <p className="text-slate-900 font-medium text-sm">No leads found</p>
                      <p className="text-slate-500 text-xs max-w-xs mx-auto">
                        Get started by adding your first lead to track your sales pipeline.
                      </p>
                      <button
                        onClick={() => setShowModel(true)}
                        className="flex items-center gap-1.5 text-indigo-600 hover:bg-indigo-50 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                      >
                        <Plus className="w-4 h-4" /> Add your first lead
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {leads.length > 0 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-slate-200 bg-slate-50/50">
            <p className="text-xs text-slate-500">
              Page <span className="font-medium text-slate-900">{page}</span> of{" "}
              <span className="font-medium text-slate-900">{totalPages}</span>
            </p>
            <div className="flex items-center gap-1.5">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="flex items-center gap-1 px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs font-medium text-slate-600 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors bg-transparent shadow-sm"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Prev
              </button>
              <button
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
                className="flex items-center gap-1 px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs font-medium text-slate-600 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors bg-transparent shadow-sm"
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
          <p className="text-xs text-slate-500">
            Page <span className="font-medium text-slate-900">{page}</span> of{" "}
            <span className="font-medium text-slate-900">{totalPages}</span>
          </p>
          <div className="flex items-center gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="flex items-center gap-1 px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-medium text-slate-600 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm"
            >
              <ChevronLeft className="w-3.5 h-3.5" /> Prev
            </button>
            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className="flex items-center gap-1 px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-medium text-slate-600 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm"
            >
              Next <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* ── Modal ── */}
      {showModel && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={(e) => e.target === e.currentTarget && closeModal()}
        >
          <div className="bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 sm:zoom-in-95 duration-200">

            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/50">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  {editingLead ? "Edit Lead Details" : "Add New Lead"}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {editingLead
                    ? "Update the information for this lead."
                    : "Enter the details of your new lead."}
                </p>
              </div>
              <button
                onClick={closeModal}
                className="text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 p-1.5 rounded-full transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 flex flex-col gap-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-700">Name</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="e.g. John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-700">Company</label>
                  <input
                    type="text"
                    name="company"
                    placeholder="e.g. Acme Corp"
                    value={formData.company}
                    onChange={handleChange}
                    required
                    className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700">Email Address</label>
                <input
                  type="email"
                  name="email"
                  placeholder="john.doe@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-700">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="+91 9000000000"
                    value={formData.phone}
                    onChange={handleChange}
                    className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-700">Status</label>
                  <div className="relative">
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="appearance-none w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all pr-8"
                    >
                      <option value="new">New Lead</option>
                      <option value="contacted">Contacted</option>
                      <option value="qualified">Qualified</option>
                      <option value="closed">Closed</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-500">
                      <ChevronLeft className="w-3.5 h-3.5 -rotate-90" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-end gap-2 pt-2 mt-1 border-t border-slate-100">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 active:scale-[0.98] transition-all"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 active:scale-[0.98] transition-all shadow-sm shadow-indigo-200"
                >
                  {editingLead ? "Update Lead" : "Save Lead"}
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