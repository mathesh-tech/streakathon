"use client";

import { useEffect, useState } from "react";
import { Trophy, Download, RefreshCw, Flame } from "lucide-react";

interface RankedStudent {
  rank: number;
  id: string;
  name: string;
  email: string;
  registerNumber: string;
  department: string;
  year: number;
  section: string;
  credits: number;
  streak: number;
  participations: number;
}

export default function AmbassadorLeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<RankedStudent[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/leaderboard");
      const data = await res.json();
      if (res.ok) {
        setLeaderboard(data.leaderboard || []);
      }
    } catch (err) {
      console.error("Failed to load leaderboard", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const handleExportCSV = () => {
    if (leaderboard.length === 0) return;

    const headers = ["Rank", "Name", "Register Number", "Email", "Department", "Year & Sec", "Credits", "Streak (Days)", "Participations"];
    const rows = leaderboard.map(s => [
      s.rank,
      `"${s.name}"`,
      `"${s.registerNumber}"`,
      `"${s.email}"`,
      s.department,
      `Year ${s.year}-${s.section}`,
      s.credits,
      s.streak,
      s.participations
    ]);

    const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Streakathon_Ambassador_Leaderboard_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex-1 p-8 bg-slate-950 text-slate-100 min-h-screen space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Trophy className="w-8 h-8 text-amber-400" />
            Hackathon Leaderboard (Ambassador View)
          </h1>
          <p className="text-slate-400 mt-1">
            Real-time student rankings based on Innovation Credits, streak counts, and participations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchLeaderboard}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-200 rounded-xl text-sm font-semibold transition"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>

          <button
            onClick={handleExportCSV}
            disabled={leaderboard.length === 0}
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-sm transition shadow-lg shadow-emerald-600/20 disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            Download Leaderboard CSV
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            Top Student Rankings ({leaderboard.length})
          </h2>
        </div>

        {loading ? (
          <div className="py-20 flex justify-center text-slate-500">
            <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : leaderboard.length === 0 ? (
          <div className="py-16 text-center text-slate-500">
            No student leaderboard rankings available yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase text-xs">
                <tr>
                  <th className="py-3 px-4 rounded-l-lg text-center">Rank</th>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Reg Number</th>
                  <th className="py-3 px-4">Dept & Class</th>
                  <th className="py-3 px-4 text-center">Participations</th>
                  <th className="py-3 px-4 text-center">Streak</th>
                  <th className="py-3 px-4 text-right rounded-r-lg">Credits</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {leaderboard.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-850/50 transition">
                    <td className="py-4 px-4 text-center">
                      <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-black text-xs ${
                        s.rank === 1 ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30" :
                        s.rank === 2 ? "bg-slate-300 text-slate-950" :
                        s.rank === 3 ? "bg-amber-700 text-white" :
                        "bg-slate-800 text-slate-400"
                      }`}>
                        #{s.rank}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-bold text-white">
                      <div>{s.name}</div>
                      <div className="text-xs text-slate-400 font-normal">{s.email}</div>
                    </td>
                    <td className="py-4 px-4 font-mono text-slate-400">{s.registerNumber}</td>
                    <td className="py-4 px-4">
                      <span className="px-2.5 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-md text-xs font-semibold mr-2">
                        {s.department}
                      </span>
                      <span className="px-2.5 py-1 bg-slate-800 text-slate-300 rounded-md text-xs">
                        Yr {s.year}-{s.section}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center font-semibold text-white">
                      {s.participations} Times
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-orange-950/80 border border-orange-800 text-orange-400 rounded-md text-xs font-bold">
                        <Flame className="w-3.5 h-3.5 fill-orange-400" />
                        {s.streak} Days
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right font-extrabold text-amber-400 text-base">
                      {s.credits} pts
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
