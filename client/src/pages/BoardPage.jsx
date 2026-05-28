import React, { useState, useEffect } from "react";
import { getLeads } from "@/services/leadService";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Building2, Mail, GripVertical } from "lucide-react";

const COLUMN_CONFIG = {
  new: { 
    label: "New", 
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
    dot: "bg-blue-500"
  },
  contacted: { 
    label: "Contacted", 
    color: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
    dot: "bg-amber-500"
  },
  qualified: { 
    label: "Qualified", 
    color: "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300",
    dot: "bg-purple-500"
  },
  closed: { 
    label: "Closed", 
    color: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
    dot: "bg-emerald-500"
  },
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

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const { draggableId, source, destination } = result;

    if (destination.droppableId === source.droppableId) return;

    setLeads((prev) =>
      prev.map((lead) =>
        lead._id === draggableId ? { ...lead, status: destination.droppableId } : lead
      )
    );
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 md:p-6">
        
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Lead Pipeline
          </h1>
        </div>

        {/* ✅ The Layout Fix: 1 column on mobile, 2 columns on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 max-w-5xl mx-auto">
          {columns.map((status) => {
            const filteredLeads = leads.filter((lead) => lead.status === status);
            const config = COLUMN_CONFIG[status];

            return (
              <div 
                key={status}
                className="flex flex-col bg-slate-200/50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800 max-h-[600px]"
              >
                {/* Column Header */}
                <div className="p-4 border-b border-slate-200 dark:border-slate-700/50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${config.dot}`} />
                    <h2 className="font-semibold text-slate-700 dark:text-slate-200">
                      {config.label}
                    </h2>
                  </div>
                  <span className="text-xs font-medium py-1 px-2.5 rounded-full bg-white dark:bg-slate-800 text-slate-500 shadow-sm">
                    {filteredLeads.length}
                  </span>
                </div>

                {/* Droppable Area (Scrolls internally if too many cards) */}
                <Droppable droppableId={status}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`flex-1 overflow-y-auto p-3 space-y-3 transition-colors ${
                        snapshot.isDraggingOver ? "bg-slate-200/80 dark:bg-slate-800/80" : ""
                      }`}
                    >
                      {filteredLeads.map((lead, index) => (
                        <Draggable draggableId={lead._id} index={index} key={lead._id}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`group relative bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700 select-none ${
                                snapshot.isDragging 
                                  ? "shadow-xl ring-2 ring-blue-500 rotate-1 scale-[1.02] cursor-grabbing z-50" 
                                  : "shadow-sm cursor-grab"
                              }`}
                            >
                              {/* Drag Handle */}
                              <div className="absolute top-4 right-3 text-slate-300 dark:text-slate-600 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                                <GripVertical size={16} />
                              </div>

                              <h3 className="font-semibold text-slate-900 dark:text-slate-100 pr-6">
                                {lead.name}
                              </h3>

                              <div className="space-y-2 mt-3">
                                <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                                  <Building2 size={14} className="mr-2 flex-shrink-0 text-slate-400" />
                                  <span className="truncate">{lead.company}</span>
                                </div>
                                <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                                  <Mail size={14} className="mr-2 flex-shrink-0 text-slate-400" />
                                  <span className="truncate">{lead.email}</span>
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                      
                      {filteredLeads.length === 0 && (
                        <div className="text-center p-6 text-sm text-slate-400 dark:text-slate-500 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg mt-2">
                          Drop leads here
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