"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { History, Calendar, Award, CheckCircle2, XCircle, ArrowUpRight, Search, Download } from "lucide-react";
import Link from "next/link";

export default function HistoryPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const historyData = [
    {
      id: "REG-015",
      hackathon: "Streakathon #15: AI & Automation",
      date: "Oct 14-16, 2026",
      status: "EVALUATING", // PENDING, EVALUATING, COMPLETED, MISSED
      team: "Team Horizon",
      credits: "-",
      certificate: false,
    },
    {
      id: "REG-014",
      hackathon: "Streakathon #14: Cloud Computing",
      date: "Sep 28-30, 2026",
      status: "COMPLETED",
      team: "Team Horizon",
      credits: "+150",
      certificate: true,
      rank: "Top 10"
    },
    {
      id: "REG-013",
      hackathon: "Streakathon #13: Web3 Horizons",
      date: "Aug 20-22, 2026",
      status: "COMPLETED",
      team: "Solo (No Team)",
      credits: "+50",
      certificate: true,
      rank: "Participation"
    },
    {
      id: "REG-012",
      hackathon: "Streakathon #12: Cybersecurity",
      date: "Jul 10-12, 2026",
      status: "MISSED",
      team: "Solo (No Team)",
      credits: "-20",
      certificate: false,
    }
  ];

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'COMPLETED':
        return <span className="bg-emerald-500/20 text-emerald-500 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-max"><CheckCircle2 className="w-3.5 h-3.5" /> Completed</span>;
      case 'EVALUATING':
        return <span className="bg-blue-500/20 text-blue-500 border border-blue-500/30 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-max"><span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" /> Evaluating</span>;
      case 'MISSED':
        return <span className="bg-destructive/20 text-destructive border border-destructive/30 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-max"><XCircle className="w-3.5 h-3.5" /> Missed</span>;
      default:
        return <span className="bg-white/10 text-muted-foreground border border-white/20 px-3 py-1 rounded-full text-xs font-bold w-max">{status}</span>;
    }
  };

  const getCreditBadge = (credits: string) => {
    if (credits === '-') return <span className="text-muted-foreground font-mono">-</span>;
    if (credits.startsWith('-')) return <span className="text-destructive font-bold font-mono">{credits} Pts</span>;
    return <span className="text-emerald-500 font-bold font-mono">{credits} Pts</span>;
  };

  return (
    <div className="flex-1 w-full p-4 md:p-8 space-y-8 max-w-screen-xl mx-auto">
      <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Registration History</h1>
          <p className="text-muted-foreground">Track your past hackathon participations and earned credits.</p>
        </div>
        <div className="relative w-full md:w-auto">
          <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search events..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-64 h-10 bg-background/50 border border-white/10 rounded-xl px-10 text-sm focus:border-primary focus:outline-none"
          />
        </div>
      </header>

      {historyData.length === 0 ? (
        <div className="glass-card p-12 rounded-3xl text-center max-w-2xl mx-auto border-white/5">
          <div className="w-24 h-24 bg-primary/20 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
            <History className="w-12 h-12" />
          </div>
          <h2 className="text-2xl font-bold mb-4">No Registration History</h2>
          <p className="text-muted-foreground mb-8">You haven't participated in any hackathons yet. Register for an upcoming event to start building your streak!</p>
          <Link 
            href="/dashboard/student/register"
            className="h-12 inline-flex items-center justify-center px-8 bg-primary text-primary-foreground font-bold rounded-xl transition-transform hover:scale-105 active:scale-95"
          >
            Find Hackathons
          </Link>
        </div>
      ) : (
        <div className="glass-card rounded-3xl overflow-hidden border-white/5">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-white/5 border-b border-white/5">
                <tr>
                  <th className="px-6 py-4 font-bold">Hackathon</th>
                  <th className="px-6 py-4 font-bold">Date</th>
                  <th className="px-6 py-4 font-bold">Status</th>
                  <th className="px-6 py-4 font-bold">Team</th>
                  <th className="px-6 py-4 font-bold text-center">Credits</th>
                  <th className="px-6 py-4 font-bold text-center">Certificate</th>
                </tr>
              </thead>
              <tbody>
                {historyData.map((item, i) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    key={item.id} 
                    className="border-b border-white/5 hover:bg-white/5 transition-colors group"
                  >
                    <td className="px-6 py-5">
                      <div className="font-bold text-foreground mb-1">{item.hackathon}</div>
                      <div className="text-xs text-muted-foreground font-mono">{item.id}</div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-muted-foreground">
                      <div className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {item.date}</div>
                    </td>
                    <td className="px-6 py-5">
                      {getStatusBadge(item.status)}
                    </td>
                    <td className="px-6 py-5 text-muted-foreground">
                      {item.team}
                    </td>
                    <td className="px-6 py-5 text-center">
                      {getCreditBadge(item.credits)}
                    </td>
                    <td className="px-6 py-5">
                      {item.certificate ? (
                        <div className="flex flex-col items-center gap-2">
                          <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">{item.rank}</span>
                          <Link href="/dashboard/student/certificates" className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-white transition-colors bg-primary/10 hover:bg-primary/20 px-3 py-1.5 rounded-lg border border-primary/20">
                            <Download className="w-3.5 h-3.5" /> View
                          </Link>
                        </div>
                      ) : (
                        <div className="text-center text-muted-foreground/50">-</div>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
