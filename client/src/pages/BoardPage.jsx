import React, { useState, useEffect } from "react";
import { getLeads, updatedLead } from "@/services/leadService";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Building2, Mail, Phone, GripVertical, Users } from "lucide-react";

const COLUMN_CONFIG = {
  new: {
    label: "New",
    dot: "bg-blue-400",
    pill: "bg-blue-50/60 text-blue-600 border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/40",
  },
  contacted: {
    label: "Contacted",
    dot: "bg-purple-400",
    pill: "bg-purple-50/60 text-purple-600 border-purple-200 dark:bg-purple-950/20 dark:text-purple-400 dark:border-purple-900/40",
  },
  qualified: {
    label: "Qualified",
    dot: "bg-emerald-400",
    pill: "bg-emerald-50/60 text-emerald-600 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/40",
  },
  closed: {
    label: "Closed",
    dot: "bg-slate-400",
    pill: "bg-slate-100 text-slate-500 border-slate-200 dark:bg-neutral-800 dark:text-neutral-400 dark:border-neutral-700",
  },
};

const avatarColors = [
  "bg-rose-500",   "bg-pink-500",    "bg-fuchsia-500",
  "bg-purple-500", "bg-indigo-500",  "bg-blue-500",
  "bg-sky-500",    "bg-cyan-500",    "bg-teal-500",
  "bg-emerald-500","bg-green-500",
];

const getInitials = (name = "") =>
  name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();

const getAvatarColor = (name = "") => {
  const hash = name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return avatarColors[hash % avatarColors.length] + " text-white";
};

const BoardPage = () => {
  const columns = ["new", "contacted", "qualified", "closed"];
  const [leads, setLeads] = useState([]);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const response = await getLeads();
        setLeads(response.leads);
      } catch (error) {
        console.error("Failed to fetch leads:", error);
      }
    };
    fetchLeads();
  }, []);

  const onDragEnd = async (result) => {
    if (!result.destination) return;
    const { draggableId, source, destination } = result;
    if (destination.droppableId === source.droppableId) return;
    try {
      await updatedLead(draggableId, { status: destination.droppableId });
      setLeads((prev) =>
        prev.map((lead) =>
          lead._id === draggableId
            ? { ...lead, status: destination.droppableId }
            : lead
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="px-4 py-6 sm:px-6 sm:py-8 max-w-7xl mx-auto space-y-4">

        {/* Header — exact same structure as LeadsPage */}
        <div>
          <h1 className="text-lg sm:text-2xl font-semibold text-slate-900 dark:text-white tracking-tight">
            Leads Pipeline
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Drag and drop leads across stages to update their status.
          </p>
        </div>

        {/* Board grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {columns.map((status) => {
            const filteredLeads = leads.filter((l) => l.status === status);
            const config = COLUMN_CONFIG[status];

            return (
              <div
                key={status}
                className="flex flex-col bg-neutral-50 dark:bg-neutral-900/40 rounded-xl border border-border overflow-hidden"
              >
                {/* Column header — matches TableHeader row style */}
                <div className="flex items-center gap-2 px-4 py-2.5 bg-neutral-50 dark:bg-neutral-900/40 border-b border-border">
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${config.dot}`} />
                  <span className="text-[10.5px] font-semibold uppercase tracking-wider text-slate-400 flex-1">
                    {config.label}
                  </span>
                  <span className="text-xs font-medium text-slate-400 bg-background dark:bg-neutral-800 border border-border px-2 py-0.5 rounded-full">
                    {filteredLeads.length}
                  </span>
                </div>

                {/* Droppable area */}
                <Droppable droppableId={status}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`flex-1 overflow-y-auto p-2.5 flex flex-col gap-2 min-h-[200px] transition-colors ${
                        snapshot.isDraggingOver
                          ? "bg-neutral-100 dark:bg-neutral-800/40"
                          : ""
                      }`}
                    >
                      {filteredLeads.map((lead, index) => (
                        <Draggable
                          draggableId={lead._id}
                          index={index}
                          key={lead._id}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`group relative bg-card border border-border rounded-xl p-4 select-none transition-all ${
                                snapshot.isDragging
                                  ? "shadow-lg ring-1 ring-border rotate-[0.8deg] scale-[1.01] cursor-grabbing"
                                  : "shadow-sm hover:border-slate-300 dark:hover:border-neutral-600 cursor-grab"
                              }`}
                            >
                              {/* Grip */}
                              <div className="absolute top-3.5 right-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-slate-300 dark:text-slate-600">
                                <GripVertical size={13} />
                              </div>

                              {/* Avatar + name */}
                              <div className="flex items-center gap-2.5 mb-3">
                                <div
                                  className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-semibold flex-shrink-0 ${getAvatarColor(lead.name)}`}
                                >
                                  {getInitials(lead.name)}
                                </div>
                                <p className="font-semibold text-sm text-foreground truncate pr-5">
                                  {lead.name}
                                </p>
                              </div>

                              {/* Fields — same icon + text pattern as LeadsPage */}
                              <div className="flex flex-col gap-1.5 pt-2.5 border-t border-border">
                                <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                                  <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
                                  <span className="truncate">{lead.company}</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                                  <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                                  <span className="truncate">{lead.email}</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                                  <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                                  <span>{lead.phone}</span>
                                </div>
                              </div>

                              {/* Status pill — exact same className pattern as LeadsPage */}
                              <div className="mt-2.5 pt-2.5 border-t border-border">
                                <span
                                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${config.pill}`}
                                >
                                  {config.label}
                                </span>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}

                      {/* Empty state — same as LeadsPage empty state */}
                      {filteredLeads.length === 0 && !snapshot.isDraggingOver && (
                        <div className="flex flex-col items-center justify-center gap-2 py-10 border-2 border-dashed border-slate-200 dark:border-neutral-800 rounded-xl">
                          <div className="w-8 h-8 bg-neutral-100 dark:bg-neutral-900 rounded-lg flex items-center justify-center">
                            <Users className="w-3.5 h-3.5 text-slate-400" />
                          </div>
                          <p className="text-xs text-slate-400 dark:text-slate-500">
                            No leads here
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </div>
    </DragDropContext>
  );
};

export default BoardPage;