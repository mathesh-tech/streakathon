"use client";

import { CheckCircle2, FileText, Download, Trophy, ShieldCheck, Plus } from "lucide-react";

export function RecentActivity() {
  const activities = [
    { type: "badge", title: "Earned Badge: Top Performer", date: "2 hours ago", icon: ShieldCheck, color: "text-pink-500", bg: "bg-pink-500/10" },
    { type: "leaderboard", title: "Moved to Rank #12", date: "1 day ago", icon: Trophy, color: "text-warning", bg: "bg-warning/10" },
    { type: "certificate", title: "Downloaded Certificate: Sprint #11", date: "3 days ago", icon: Download, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { type: "submission", title: "Project Submitted for Sprint #11", date: "4 days ago", icon: CheckCircle2, color: "text-blue-500", bg: "bg-blue-500/10" },
    { type: "registration", title: "Registered for Sprint #11", date: "1 week ago", icon: Plus, color: "text-primary", bg: "bg-primary/10" },
  ];

  return (
    <div className="glass-card rounded-3xl p-6 md:p-8 h-full">
      <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
        <FileText className="w-5 h-5 text-primary" /> Recent Activity
      </h3>
      
      <div className="relative pl-6 space-y-6">
        {/* Vertical Line */}
        <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-border rounded-full" />
        
        {activities.map((activity, i) => (
          <div key={i} className="relative">
            {/* Timeline dot */}
            <div className={`absolute -left-6 top-0 w-6 h-6 rounded-full flex items-center justify-center bg-background border-2 border-background shadow-sm`}>
              <div className={`w-full h-full rounded-full flex items-center justify-center ${activity.bg}`}>
                <activity.icon className={`w-3 h-3 ${activity.color}`} />
              </div>
            </div>
            
            <div className="bg-white/5 border border-white/5 rounded-xl p-4 ml-4">
              <h4 className="font-semibold text-sm text-foreground">{activity.title}</h4>
              <p className="text-xs text-muted-foreground mt-1">{activity.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
