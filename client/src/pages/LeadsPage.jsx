import React, { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import { toast } from "sonner";
import {
  cretaeLead,
  deleteLead,
  getLeads,
  updatedLead,
  addLeadNote,
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
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    status: "new",
  });

  const [showNotesModal, setShowNotesModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [noteText, setNoteText] = useState("");

  // ── Bulk WhatsApp ──
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkQueue, setBulkQueue] = useState([]);
  const [bulkIndex, setBulkIndex] = useState(0);
  const DEFAULT_TEMPLATE =
    "Hi {{name}},\n\nThank you for your interest.\n\nRegards,\nVikas";
  const [bulkTemplate, setBulkTemplate] = useState(DEFAULT_TEMPLATE);

  const PLACEHOLDERS = [
    { tag: "{{name}}", label: "Name" },
    { tag: "{{company}}", label: "Company" },
    { tag: "{{phone}}", label: "Phone" },
    { tag: "{{email}}", label: "Email" },
    { tag: "{{status}}", label: "Status" },
  ];

  const resolveTemplate = (template, lead) =>
    template
      .replace(/{{name}}/g, lead.name)
      .replace(/{{company}}/g, lead.company)
      .replace(/{{phone}}/g, lead.phone)
      .replace(/{{email}}/g, lead.email)
      .replace(/{{status}}/g, lead.status);

  const previewMessage = bulkQueue[bulkIndex]
    ? resolveTemplate(bulkTemplate, bulkQueue[bulkIndex])
    : resolveTemplate(bulkTemplate, {
        name: "John Doe",
        company: "Acme Corp",
        phone: "+91 9000000000",
        email: "john@example.com",
        status: "new",
      });

  const handleAddNote = async () => {
    try {
      const updatedLead = await addLeadNote(selectedLead._id, noteText);
      setSelectedLead(updatedLead);
      setLeads((prev) =>
        prev.map((lead) => (lead._id === updatedLead._id ? updatedLead : lead)),
      );
      setNoteText("");
      toast.success("Note added");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const sendWhatsApp = (lead) => {
    const phone = lead.phone.replace(/\D/g, "");
    const message = `Hi ${lead.name},\n\nThank you for your interest.\n\nRegards,\nVikas`;
    window.open(
      `https://web.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(message)}`,
      "_blank",
    );
  };

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

  const toggleLeadSelection = (id) => {
    setSelectedLeads((prev) =>
      prev.includes(id)
        ? prev.filter((leadId) => leadId !== id)
        : [...prev, id],
    );
  };

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
      setFormData({ name: "", email: "", phone: "", company: "", status: "new" });
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleBulkWhatsApp = () => {
    const selected = leads.filter((lead) => selectedLeads.includes(lead._id));
    if (selected.length === 0) return;
    setBulkQueue(selected);
    setBulkIndex(0);
    setShowBulkModal(true);
  };

  const handleBulkNext = () => {
    const lead = bulkQueue[bulkIndex];
    const phone = lead.phone.replace(/\D/g, "");
    const message = resolveTemplate(bulkTemplate, lead);
    window.open(
      `https://web.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(message)}`,
      "_blank",
    );
    if (bulkIndex + 1 >= bulkQueue.length) {
      setShowBulkModal(false);
      setSelectedLeads([]);
      toast.success("All messages sent!");
    } else {
      setBulkIndex((i) => i + 1);
    }
  };

  const insertPlaceholder = (tag) => {
    setBulkTemplate((prev) => prev + tag);
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
      className:
        "bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/40",
    },
    contacted: {
      label: "Contacted",
      className:
        "bg-purple-50 text-purple-600 border-purple-200 dark:bg-purple-950/20 dark:text-purple-400 dark:border-purple-900/40",
    },
    qualified: {
      label: "Qualified",
      className:
        "bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/40",
    },
    closed: {
      label: "Closed",
      className:
        "bg-slate-100 text-slate-500 border-slate-200 dark:bg-neutral-800 dark:text-neutral-400 dark:border-neutral-700",
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
    return avatarColors[hash % avatarColors.length] + " text-white";
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] text-slate-400 gap-3">
        <div className="w-5 h-5 border-2 border-slate-200 dark:border-neutral-800 border-t-blue-500 rounded-full animate-spin" />
        <p className="text-xs font-semibold text-slate-500">Loading leads…</p>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8 max-w-7xl mx-auto space-y-4">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-lg sm:text-2xl font-semibold text-slate-900 dark:text-white tracking-tight">
            Leads Pipeline
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage, track, and convert your potential customers.
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          {/* Search */}
          <div className="relative flex-1 sm:flex-none">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search leads…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-3 py-2 bg-background border border-border text-foreground rounded-lg text-xs w-full sm:w-52 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-colors"
            />
          </div>

          {/* Add Lead */}
          <button
            onClick={() => setShowModel(true)}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            Add lead
          </button>

          {/* Bulk WhatsApp */}
          <button
            onClick={handleBulkWhatsApp}
            disabled={selectedLeads.length === 0}
            className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed text-white px-3.5 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            Bulk WhatsApp ({selectedLeads.length})
          </button>
        </div>
      </div>

      {/* ── Mobile card list (< md) ── */}
      <div className="md:hidden space-y-3">
        {filteredLeads.length === 0 ? (
          <div className="bg-card border border-border rounded-xl py-16 flex flex-col items-center gap-3">
            <div className="w-9 h-9 bg-neutral-100 dark:bg-neutral-900 rounded-lg flex items-center justify-center">
              <Users className="w-4 h-4 text-slate-400" />
            </div>
            <p className="text-foreground font-medium text-sm">No leads found</p>
            <p className="text-slate-400 text-xs text-center max-w-xs px-4">
              Get started by adding your first lead.
            </p>
            <button
              onClick={() => setShowModel(true)}
              className="flex items-center gap-1.5 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-neutral-900 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border border-border"
            >
              <Plus className="w-3.5 h-3.5" /> Add your first lead
            </button>
          </div>
        ) : (
          filteredLeads.map((lead) => (
            <div
              key={lead._id}
              className="bg-card border border-border rounded-xl p-4"
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={selectedLeads.includes(lead._id)}
                  onChange={() => toggleLeadSelection(lead._id)}
                />
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 ${getAvatarColor(lead.name)}`}
                >
                  {getInitials(lead.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-foreground truncate">
                    {lead.name}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                    <Building2 className="w-3 h-3 shrink-0 text-slate-400" />
                    <span className="truncate">{lead.company}</span>
                  </div>
                </div>
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border flex-shrink-0 ${
                    statusConfig[lead.status]?.className ?? statusConfig.new.className
                  }`}
                >
                  {statusConfig[lead.status]?.label ?? lead.status}
                </span>
              </div>

              <div className="mt-3 pt-3 border-t border-border flex flex-col gap-1.5">
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                  <span className="truncate">{lead.email}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                  <span>{lead.phone}</span>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-border flex items-center justify-end gap-2">
                <button
                  onClick={() => handelEditlead(lead)}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/20 dark:text-blue-400 rounded-lg transition-colors"
                >
                  <Edit2 className="w-3 h-3" /> Edit
                </button>
                <button
                  onClick={() => {
                    setSelectedLead(lead);
                    setShowNotesModal(true);
                  }}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-amber-600 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/20 dark:text-amber-400 rounded-lg transition-colors"
                >
                  Notes
                </button>
                <button
                  onClick={() => handleDelete(lead._id)}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-rose-600 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/20 dark:text-rose-400 rounded-lg transition-colors"
                >
                  <Trash2 className="w-3 h-3" /> Delete
                </button>
                <button
                  onClick={() => sendWhatsApp(lead)}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-green-600 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
                >
                  <MessageCircle className="w-3 h-3" />
                  WhatsApp
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ── Desktop table (≥ md) ── */}
      <div className="hidden md:block bg-card border border-border rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-neutral-50 dark:bg-neutral-900/40 hover:bg-neutral-50 dark:hover:bg-neutral-900/40 border-b border-border">
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
                  className="hover:bg-neutral-100/10 dark:hover:bg-neutral-900/30 transition-colors border-b border-border last:border-0 group"
                >
                  <TableCell className="py-3 pl-5">
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={selectedLeads.includes(lead._id)}
                        onChange={() => toggleLeadSelection(lead._id)}
                      />
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-semibold flex-shrink-0 ${getAvatarColor(lead.name)}`}
                      >
                        {getInitials(lead.name)}
                      </div>
                      <div>
                        <div className="font-semibold text-sm text-foreground">
                          {lead.name}
                        </div>
                        <div className="text-xs text-slate-500 lg:hidden mt-0.5">
                          {lead.company}
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="py-3">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate max-w-[140px] xl:max-w-[200px]">
                          {lead.email}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                        <span>{lead.phone}</span>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="py-3 hidden lg:table-cell">
                    <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300">
                      <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="truncate max-w-[130px]">
                        {lead.company}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="py-3">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${
                        statusConfig[lead.status]?.className ?? statusConfig.new.className
                      }`}
                    >
                      {statusConfig[lead.status]?.label ?? lead.status}
                    </span>
                  </TableCell>

                  <TableCell className="py-3 pr-5">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handelEditlead(lead)}
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-md transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedLead(lead);
                          setShowNotesModal(true);
                        }}
                        className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-md transition-colors"
                        title="Notes"
                      >
                        Notes
                      </button>
                      <button
                        onClick={() => handleDelete(lead._id)}
                        className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50/50 dark:hover:bg-rose-950/40 rounded-md transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => sendWhatsApp(lead)}
                        className="p-1.5 text-green-500 hover:bg-green-50 rounded-md transition-colors"
                        title="WhatsApp"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}

              {filteredLeads.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-9 h-9 bg-neutral-100 dark:bg-neutral-900 rounded-lg flex items-center justify-center">
                        <Users className="w-4 h-4 text-slate-400" />
                      </div>
                      <p className="text-foreground font-medium text-sm">
                        No leads found
                      </p>
                      <p className="text-slate-400 text-xs max-w-xs mx-auto">
                        Get started by adding your first lead to track your sales pipeline.
                      </p>
                      <button
                        onClick={() => setShowModel(true)}
                        className="flex items-center gap-1.5 text-blue-600 hover:bg-blue-50 dark:text-blue-400 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border border-border"
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
          <div className="flex items-center justify-between px-5 py-3 border-t border-border bg-neutral-50/50 dark:bg-neutral-900/30">
            <p className="text-xs text-slate-400">
              Page <span className="font-medium text-foreground">{page}</span>{" "}
              of{" "}
              <span className="font-medium text-foreground">{totalPages}</span>
            </p>
            <div className="flex items-center gap-1.5">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="flex items-center gap-1 px-2.5 py-1.5 border border-border rounded-lg text-xs font-medium text-slate-500 hover:bg-background dark:hover:bg-neutral-900 disabled:opacity-40 disabled:cursor-not-allowed transition-colors bg-transparent"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Prev
              </button>
              <button
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
                className="flex items-center gap-1 px-2.5 py-1.5 border border-border rounded-lg text-xs font-medium text-slate-500 hover:bg-background dark:hover:bg-neutral-900 disabled:opacity-40 disabled:cursor-not-allowed transition-colors bg-transparent"
              >
                Next <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Mobile pagination ── */}
      {leads.length > 0 && (
        <div className="md:hidden flex items-center justify-between px-1">
          <p className="text-xs text-slate-400">
            Page <span className="font-medium text-foreground">{page}</span> of{" "}
            <span className="font-medium text-foreground">{totalPages}</span>
          </p>
          <div className="flex items-center gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="flex items-center gap-1 px-3 py-1.5 border border-border rounded-lg text-xs font-medium text-slate-500 bg-background dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" /> Prev
            </button>
            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className="flex items-center gap-1 px-3 py-1.5 border border-border rounded-lg text-xs font-medium text-slate-500 bg-background dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Next <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* ── Add / Edit Modal ── */}
      {showModel && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-slate-900/30 dark:bg-black/50 backdrop-blur-[2px]"
          onClick={(e) => e.target === e.currentTarget && closeModal()}
        >
          <div className="bg-background border border-border w-full sm:max-w-md rounded-xl shadow-xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <div>
                <h2 className="text-sm font-semibold text-foreground">
                  {editingLead ? "Edit lead" : "Add new lead"}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {editingLead
                    ? "Update the information for this lead."
                    : "Enter the details for this lead."}
                </p>
              </div>
              <button
                onClick={closeModal}
                className="text-slate-400 hover:text-foreground hover:bg-muted p-1.5 rounded-md transition-colors"
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
                    className="border border-border bg-background text-foreground rounded-lg px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-colors"
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
                    className="border border-border bg-background text-foreground rounded-lg px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-colors"
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
                  className="border border-border bg-background text-foreground rounded-lg px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-colors"
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
                    className="border border-border bg-background text-foreground rounded-lg px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-colors"
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
                      className="appearance-none w-full border border-border bg-background text-foreground rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-colors pr-8"
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

              <div className="flex justify-end gap-2 pt-1 border-t border-border">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-xs font-medium text-foreground bg-background border border-border rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="px-4 py-2 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingLead ? "Update lead" : "Save lead"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Bulk WhatsApp Modal ── */}
      {showBulkModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={(e) =>
            e.target === e.currentTarget && setShowBulkModal(false)
          }
        >
          <div className="bg-background border border-border w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <div>
                <h2 className="text-sm font-semibold text-foreground">
                  Bulk WhatsApp
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {bulkIndex + 1} of {bulkQueue.length} — sending to{" "}
                  <span className="font-medium text-foreground">
                    {bulkQueue[bulkIndex]?.name}
                  </span>
                </p>
              </div>
              <button
                onClick={() => setShowBulkModal(false)}
                className="p-1.5 rounded-md hover:bg-muted transition-colors"
              >
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              {/* Placeholder chips */}
              <div className="space-y-1.5">
                <p className="text-[10.5px] font-semibold text-slate-500 uppercase tracking-wider">
                  Insert placeholder
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {PLACEHOLDERS.map(({ tag, label }) => (
                    <button
                      key={tag}
                      onClick={() => insertPlaceholder(tag)}
                      className="px-2.5 py-1 text-xs font-medium rounded-full border border-border bg-muted hover:bg-neutral-200 dark:hover:bg-neutral-800 text-foreground transition-colors"
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Template editor */}
              <div className="space-y-1.5">
                <p className="text-[10.5px] font-semibold text-slate-500 uppercase tracking-wider">
                  Message template
                </p>
                <textarea
                  value={bulkTemplate}
                  onChange={(e) => setBulkTemplate(e.target.value)}
                  rows={6}
                  className="w-full border border-border bg-background rounded-xl p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-400 font-mono"
                />
              </div>

              {/* Live preview */}
              <div className="space-y-1.5">
                <p className="text-[10.5px] font-semibold text-slate-500 uppercase tracking-wider">
                  Preview
                </p>
                <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900/40 rounded-xl p-3 text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                  {previewMessage}
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-neutral-100 dark:bg-neutral-800 rounded-full h-1.5">
                <div
                  className="bg-green-500 h-1.5 rounded-full transition-all duration-300"
                  style={{
                    width: `${(bulkIndex / bulkQueue.length) * 100}%`,
                  }}
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2 pt-1">
                <button
                  onClick={() => setShowBulkModal(false)}
                  className="px-4 py-2 text-xs font-medium border border-border rounded-lg hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBulkNext}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  {bulkIndex + 1 === bulkQueue.length
                    ? "Send last & finish"
                    : `Send & next (${bulkIndex + 1}/${bulkQueue.length})`}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Notes Modal ── */}
      {showNotesModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={(e) =>
            e.target === e.currentTarget && setShowNotesModal(false)
          }
        >
          <div className="bg-background border border-border w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <div>
                <h2 className="text-sm font-semibold text-foreground">
                  Lead Notes
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {selectedLead?.name}
                </p>
              </div>
              <button
                onClick={() => setShowNotesModal(false)}
                className="p-1.5 rounded-md hover:bg-muted transition-colors"
              >
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="space-y-3">
                <textarea
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="Write a note..."
                  rows={4}
                  className="w-full border border-border bg-background rounded-xl p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                />
                <div className="flex justify-end">
                  <button
                    onClick={handleAddNote}
                    disabled={!noteText.trim()}
                    className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-medium px-4 py-2 rounded-lg transition-colors"
                  >
                    Add Note
                  </button>
                </div>
              </div>

              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {selectedLead?.notes?.length > 0 ? (
                  selectedLead.notes
                    .slice()
                    .reverse()
                    .map((note, index) => (
                      <div
                        key={index}
                        className="border border-border rounded-xl p-3 bg-muted/30"
                      >
                        <p className="text-sm text-foreground whitespace-pre-wrap">
                          {note.text}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-2">
                          {new Date(note.createdAt).toLocaleString()}
                        </p>
                      </div>
                    ))
                ) : (
                  <div className="text-center py-10">
                    <p className="text-sm text-slate-400">No notes added yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadsPage;