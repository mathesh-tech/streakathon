"use client";

import { Activity, Search, Filter, ArrowUpDown } from "lucide-react";
import { useState } from "react";

// Mock data for audit logs
const mockLogs = [
  { id: "LOG-001", user: "Admin (Faculty)", action: "CREATE", entity: "Hackathon", details: "Created Hackathon #15", timestamp: "2 mins ago", status: "success" },
  { id: "LOG-002", user: "Siva Mathesh", action: "UPDATE", entity: "Team", details: "Updated team name to 'CodeCrafters'", timestamp: "1 hour ago", status: "info" },
  { id: "LOG-003", user: "Admin (Faculty)", action: "DELETE", entity: "User", details: "Removed duplicate student account", timestamp: "3 hours ago", status: "destructive" },
  { id: "LOG-004", user: "Priya S", action: "APPROVE", entity: "Submission", details: "Approved project 'AI Assistant'", timestamp: "1 day ago", status: "success" },
  { id: "LOG-005", user: "Arjun K", action: "LOGIN", entity: "Auth", details: "Successful login", timestamp: "1 day ago", status: "info" },
];

export default function AuditLogsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success": return "text-success bg-success/10 border-success/20";
      case "destructive": return "text-destructive bg-destructive/10 border-destructive/20";
      case "warning": return "text-warning bg-warning/10 border-warning/20";
      default: return "text-primary bg-primary/10 border-primary/20";
    }
  };

  return (
    <div className="flex-1 w-full p-4 md:p-8 space-y-8 max-w-screen-2xl mx-auto">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-indigo-500 flex items-center">
            <Activity className="mr-3 h-8 w-8" />
            System Audit Logs
          </h1>
          <p className="text-muted-foreground mt-1">Track all administrative and user actions across the platform</p>
        </div>
      </header>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search logs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>
        <button className="flex items-center px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors">
          <Filter className="h-4 w-4 mr-2" /> Filter
        </button>
      </div>

      {/* Logs Table */}
      <div className="glass rounded-xl overflow-hidden border border-white/10">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-white/5 text-muted-foreground font-medium border-b border-white/10">
              <tr>
                <th className="px-6 py-4 flex items-center cursor-pointer hover:text-white transition-colors">
                  Log ID <ArrowUpDown className="ml-2 h-4 w-4" />
                </th>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Action</th>
                <th className="px-6 py-4">Entity</th>
                <th className="px-6 py-4">Details</th>
                <th className="px-6 py-4">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {mockLogs.map((log) => (
                <tr key={log.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4 font-mono text-muted-foreground">{log.id}</td>
                  <td className="px-6 py-4 font-medium">{log.user}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusColor(log.status)}`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-foreground/80">{log.entity}</td>
                  <td className="px-6 py-4 text-muted-foreground truncate max-w-xs">{log.details}</td>
                  <td className="px-6 py-4 text-muted-foreground whitespace-nowrap">{log.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination placeholder */}
        <div className="p-4 border-t border-white/10 flex items-center justify-between text-sm text-muted-foreground">
          <span>Showing 1 to 5 of 248 entries</span>
          <div className="flex gap-2">
            <button className="px-3 py-1 bg-white/5 rounded border border-white/10 hover:bg-white/10 disabled:opacity-50" disabled>Previous</button>
            <button className="px-3 py-1 bg-indigo-500/20 text-indigo-400 rounded border border-indigo-500/30">1</button>
            <button className="px-3 py-1 bg-white/5 rounded border border-white/10 hover:bg-white/10">2</button>
            <button className="px-3 py-1 bg-white/5 rounded border border-white/10 hover:bg-white/10">3</button>
            <button className="px-3 py-1 bg-white/5 rounded border border-white/10 hover:bg-white/10">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
