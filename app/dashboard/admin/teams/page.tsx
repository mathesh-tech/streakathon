"use client";

import { useEffect, useState } from "react";
import { Users, Search, RefreshCw, Trophy, FileCode } from "lucide-react";

interface Team {
  id: string;
  teamName: string;
  teamCode: string;
  status: string;
  createdAt: string;
  hackathon?: {
    title: string;
    status: string;
  };
  members: {
    role: string;
    student: {
      user: {
        name: string;
        email: string;
        registerNumber: string;
        department: string;
      };
    };
  }[];
  submissions?: {
    githubLink: string;
    documentation: string;
    submittedAt: string;
  }[];
}

export default function TeamsAdminPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchTeams = async () => {
    setLoading(true);
    try {
      const url = searchQuery ? `/api/admin/teams?query=${encodeURIComponent(searchQuery)}` : "/api/admin/teams";
      const res = await fetch(url);
      const data = await res.json();
      if (res.ok) {
        setTeams(data.teams || []);
      }
    } catch (err) {
      console.error("Failed to load teams", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTeams();
  };

  return (
    <div className="flex-1 p-8 bg-slate-950 text-slate-100 min-h-screen space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Users className="w-8 h-8 text-amber-400" />
            Hackathon Teams Management
          </h1>
          <p className="text-slate-400 mt-1">
            View all registered hackathon teams, team leaders, member rosters, and project submissions.
          </p>
        </div>

        <button
          onClick={fetchTeams}
          className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-200 rounded-xl text-sm font-semibold transition"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Refresh Teams
        </button>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} className="flex gap-4 bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-xl max-w-2xl">
        <div className="flex-1 relative">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search team name or team code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>
        <button
          type="submit"
          className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-sm transition"
        >
          Search
        </button>
      </form>

      {/* Teams Grid */}
      {loading ? (
        <div className="py-20 flex justify-center text-slate-500">
          <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : teams.length === 0 ? (
        <div className="py-16 text-center text-slate-500 bg-slate-900 border border-slate-800 rounded-2xl">
          No teams found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {teams.map((t) => (
            <div key={t.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5 flex flex-col justify-between">
              
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
                      {t.teamName}
                    </h3>
                    <p className="text-xs text-amber-400 font-mono font-semibold">Code: {t.teamCode}</p>
                  </div>
                  <span className="px-3 py-1 bg-emerald-950/80 border border-emerald-800 text-emerald-400 text-xs font-bold rounded-full">
                    {t.status}
                  </span>
                </div>

                <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-slate-300 space-y-1">
                  <p className="text-slate-400">Hackathon Event:</p>
                  <p className="font-bold text-white flex items-center gap-1.5">
                    <Trophy className="w-3.5 h-3.5 text-amber-400" />
                    {t.hackathon?.title || "Streakathon 2K26"}
                  </p>
                </div>

                {/* Team Roster */}
                <div className="space-y-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Team Members ({t.members.length})</p>
                  <div className="space-y-1.5">
                    {t.members.map((m, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2.5 bg-slate-950 border border-slate-800/80 rounded-xl text-xs">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-slate-800 text-amber-400 flex items-center justify-center font-bold text-[10px]">
                            {m.student?.user?.name?.charAt(0)}
                          </div>
                          <span className="font-semibold text-white">{m.student?.user?.name}</span>
                          <span className="text-slate-500 font-mono">({m.student?.user?.registerNumber})</span>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          m.role === "LEADER" ? "bg-amber-500/20 text-amber-400 border border-amber-500/30" : "bg-slate-800 text-slate-400"
                        }`}>
                          {m.role}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Submissions Footer */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                {t.submissions && t.submissions.length > 0 ? (
                  <a
                    href={t.submissions[0].githubLink}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 text-emerald-400 hover:underline font-semibold"
                  >
                    <FileCode className="w-4 h-4" />
                    View GitHub Code
                  </a>
                ) : (
                  <span className="text-slate-500 italic">No project submission yet</span>
                )}
                <span className="text-slate-500">Created: {new Date(t.createdAt).toLocaleDateString()}</span>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}
