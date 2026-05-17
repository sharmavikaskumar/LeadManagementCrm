import React from "react";
import { useEffect, useState } from "react";
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

const LeadsPage = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingLead, setEditingLead] = useState(null);
  const [showModel, setShowModel] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    status: "new",
  });

  useEffect(() => {
    const fecthLeads = async () => {
      try {
        const response = await getLeads();
        setLeads(response.leads);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fecthLeads();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // const handelCreateLead = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const newLead = await cretaeLead(formData);
  //     setLeads([newLead, ...leads]);
  //     setShowModel(false);
  //     setFormData({ name: "", email: "", phone: "", company: "", status: "new" });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingLead) {
        const updated = await updatedLead(editingLead._id, formData);
        setLeads((prev) =>
          prev.map((lead) => (lead._id === editingLead._id ? updated : lead)),
        );
      } else {
        const newLead = await cretaeLead(formData);

        setLeads((prev) => [newLead, ...prev]);
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
      console.log(error);
    }
  };

  const handelEditlead = async (lead) => {
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
    const confirmed = window.confirm("Are you sure want to delect this lead ?");
    if (!confirmed) return;
    try {
      await deleteLead(id);
      setLeads(leads.filter((l) => l._id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  const statusConfig = {
    new: { label: "New", className: "bg-blue-50 text-blue-700" },
    contacted: {
      label: "Contacted",
      className: "bg-violet-50 text-violet-700",
    },
    qualified: {
      label: "Qualified",
      className: "bg-emerald-50 text-emerald-700",
    },
    closed: { label: "Closed", className: "bg-slate-100 text-slate-600" },
  };

  const getInitials = (name) =>
    name
      .split(" ")
      .slice(0, 2)
      .map((w) => w[0])
      .join("")
      .toUpperCase();

  const avatarColors = ["bg-blue-600 text-white"];

  const getAvatarColor = (name) => {
    const hash = name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
    return avatarColors[hash % avatarColors.length];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-sm text-slate-400">
        Loading leads...
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Leads</h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Manage your leads here.
          </p>
        </div>
        <button
          onClick={() => setShowModel(true)}
          className="flex items-center gap-2 bg-slate-900 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors"
        >
          <span className="text-base leading-none">+</span> Add Lead
        </button>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 hover:bg-slate-50">
              <TableHead className="text-xs font-semibold uppercase tracking-wide text-slate-400 py-3 pl-6 w-[220px]">
                Name
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wide text-slate-400 py-3">
                Email
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wide text-slate-400 py-3">
                Phone
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wide text-slate-400 py-3">
                Company
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wide text-slate-400 py-3">
                Status
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wide text-slate-400 py-3 text-right pr-6 text-center">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {leads.map((lead) => (
              <TableRow
                key={lead._id}
                className="hover:bg-slate-50 transition-colors border-slate-100"
              >
                {/* Name + Avatar */}
                <TableCell className="py-3.5 pl-6">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 ${getAvatarColor(lead.name)}`}
                    >
                      {getInitials(lead.name)}
                    </div>
                    <span className="font-medium text-slate-800 text-sm">
                      {lead.name}
                    </span>
                  </div>
                </TableCell>

                {/* Email */}
                <TableCell className="text-sm text-slate-500 py-3.5">
                  {lead.email}
                </TableCell>

                {/* Phone */}
                <TableCell className="text-sm text-slate-500 py-3.5">
                  {lead.phone}
                </TableCell>

                {/* Company */}
                <TableCell className="text-sm text-slate-700 font-medium py-3.5">
                  {lead.company}
                </TableCell>

                {/* Status Badge */}
                <TableCell className="py-3.5">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium capitalize ${
                      statusConfig[lead.status]?.className ??
                      statusConfig.new.className
                    }`}
                  >
                    {statusConfig[lead.status]?.label ?? lead.status}
                  </span>
                </TableCell>

                {/* Actions */}
                <TableCell className="py-3.5 pr-6">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handelEditlead(lead)}
                      className="text-xs text-slate-600 border border-slate-200 px-3 py-1.5 rounded-md hover:bg-slate-100 transition-colors font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(lead._id)}
                      className="text-xs text-red-600 border border-red-100 px-3 py-1.5 rounded-md hover:bg-red-50 transition-colors font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}

            {leads.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-16 text-slate-400 text-sm"
                >
                  No leads yet. Add your first lead to get started.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Modal */}
      {showModel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div>
                <h2 className="text-base font-semibold text-slate-900">
                  {editingLead ? "Edit Lead" : "Add Lead"}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Fill in the details below.
                </p>
              </div>
              <button
                onClick={() => setShowModel(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors text-xl leading-none p-1 rounded-lg hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <form
              onSubmit={handleSubmit}
              className="px-6 py-5 flex flex-col gap-4"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-slate-500">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Full name"
                    value={formData.name}
                    onChange={handleChange}
                    className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-slate-500">
                    Company
                  </label>
                  <input
                    type="text"
                    name="company"
                    placeholder="Company name"
                    value={formData.company}
                    onChange={handleChange}
                    className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-slate-500">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="email@company.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-slate-500">
                    Phone
                  </label>
                  <input
                    type="text"
                    name="phone"
                    placeholder="+1 000 000 0000"
                    value={formData.phone}
                    onChange={handleChange}
                    className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-slate-500">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition bg-white"
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="qualified">Qualified</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowModel(false)}
                  className="text-sm text-slate-600 border border-slate-200 px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="text-sm bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors font-medium"
                >
                  {editingLead ? "Update Lead" : "Save Lead"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadsPage;
