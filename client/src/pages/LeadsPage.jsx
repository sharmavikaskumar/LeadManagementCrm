import React from "react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { getLeads } from "@/services/leadService";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
const LeadsPage = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fecthLeads = async () => {
      try {
        const response = await getLeads();
        setLeads(response.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fecthLeads();
  }, []);
  const getStatusVariant = (status) => {
    switch (status) {
      case "new":
        return "default";

      case "contacted":
        return "secondary";

      case "qualified":
        return "outline";

      case "closed":
        return "destructive";

      default:
        return "default";
    }
  };
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Leads</h1>

          <p className="text-sm text-slate-500">Manage your leads here.</p>
        </div>

        <Button>Add Lead</Button>
      </div>
      <div className="rounded-xl border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>

              <TableHead>Email</TableHead>

              <TableHead>Phone</TableHead>

              <TableHead>Company</TableHead>

              <TableHead>Status</TableHead>

              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {leads.map((lead) => (
              <TableRow key={lead.id}>
                <TableCell className="font-medium">{lead.name}</TableCell>

                <TableCell>{lead.email}</TableCell>

                <TableCell>{lead.phone}</TableCell>

                <TableCell>{lead.company}</TableCell>

                <TableCell>
                  <Badge
                    variant={getStatusVariant(lead.status)}
                    className="capitalize"
                  >
                    {lead.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button size="sm" variant="secondary">
                      Edit
                    </Button>

                    <Button size="sm" variant="destructive">
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default LeadsPage;
