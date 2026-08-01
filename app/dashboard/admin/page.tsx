import { Settings, Plus } from "lucide-react";
import { AnalyticsDashboard } from "@/components/dashboard/admin/AnalyticsDashboard";
import Link from "next/link";

export default function AdminDashboard() {
  return (
    <div className="flex-1 w-full p-4 md:p-8 space-y-8 max-w-screen-2xl mx-auto">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-indigo-500">Admin Control Center</h1>
          <p className="text-muted-foreground">Manage events, credits, and platform settings</p>
        </div>
        <div className="flex items-center space-x-2">
          <Link href="/dashboard/admin/hackathons/new" className="flex items-center px-4 py-2 bg-indigo-500/10 text-indigo-500 rounded-lg border border-indigo-500/20 hover:bg-indigo-500/20 transition-colors font-medium">
            <Plus className="h-4 w-4 mr-2" /> New Hackathon
          </Link>
          <button className="flex items-center px-4 py-2 bg-background/50 rounded-lg border border-border/50 hover:bg-background transition-colors">
            <Settings className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* Analytics Module */}
      <AnalyticsDashboard />

    </div>
  );
}
