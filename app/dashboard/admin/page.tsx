import { Settings, Plus, UserPlus, Shield } from "lucide-react";
import { AnalyticsDashboard } from "@/components/dashboard/admin/AnalyticsDashboard";
import Link from "next/link";

export default function AdminDashboard() {
  return (
    <div className="flex-1 w-full p-4 md:p-8 space-y-8 max-w-screen-2xl mx-auto">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <Shield className="w-8 h-8 text-amber-400" />
            Admin Control Center
          </h1>
          <p className="text-slate-400 text-sm">
            Manage Hackathon Ambassador accounts, events, credits, and live analytics
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Link
            href="/dashboard/admin/ambassadors"
            className="flex items-center px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl font-bold transition-all shadow-lg shadow-amber-500/20 text-sm"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Create Ambassador ID
          </Link>

          <Link
            href="/dashboard/admin/hackathons/new"
            className="flex items-center px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl border border-slate-700 transition-colors font-medium text-sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Hackathon
          </Link>
        </div>
      </header>

      {/* Analytics Module */}
      <AnalyticsDashboard />

    </div>
  );
}
