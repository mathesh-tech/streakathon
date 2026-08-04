"use client";

import { useEffect, useState } from "react";
import { Users, Search, RefreshCw, CheckCircle2, ShieldCheck, Zap, AlertCircle, Clock } from "lucide-react";

interface TeamVerification {
  id: string;
  teamName: string;
  teamCode: string;
  hackathonTitle: string;
  isVerified: boolean;
  partiallyVerified: boolean;
  members: {
    studentId: string;
    userId: string;
    name: string;
    email: string;
    registerNumber: string;
    department: string;
    role: string;
    isAttended: boolean;
  }[];
}

export default function AmbassadorVerifyTeamsPage() {
  const [teams, setTeams] = useState<TeamVerification[]>([]);
  const [loading, setLoading] = useState(true);
  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchTeams = async () => {
    setLoading(true);
    try {
      const url = searchQuery ? `/api/ambassador/verify-team?query=${encodeURIComponent(searchQuery)}` : "/api/ambassador/verify-team";
      const res = await fetch(url);
      const data = await res.json();
      if (res.ok) {
        setTeams(data.teams || []);
      }
    } catch (err) {
      console.error("Failed to load verification teams", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const handleVerifyTeam = async (teamId: string, teamName: string) => {
    setVerifyingId(teamId);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/ambassador/verify-team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamId }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(data.message || `Verified team ${teamName}`);
        fetchTeams();
      } else {
        setError(data.error || "Failed to verify team arrival");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setVerifyingId(null);
    }
  };

  return (
    <div className="flex-1 p-8 bg-slate-950 text-slate-100 min-h-screen space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Users className="w-8 h-8 text-amber-400" />
            Option 2: Live Team Arrival Verification
          </h1>
          <p className="text-slate-400 mt-1">
            Check physical team arrival live on-site. Clicking <strong>Verify Team</strong> marks attendance and awards <strong>+1 Innovation Credit Point</strong> to all team members simultaneously.
          </p>
        </div>

        <button
          onClick={fetchTeams}
          className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-200 rounded-xl text-sm font-semibold transition"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Refresh Live Teams
        </button>
      </div>

      {/* Notifications */}
      {error && (
        <div className="p-4 bg-red-950/80 border border-red-800 rounded-xl flex items-center gap-3 text-red-200">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div className="p-4 bg-emerald-950/80 border border-emerald-800 rounded-xl flex items-center gap-3 text-emerald-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* Search Bar */}
      <form onSubmit={(e) => { e.preventDefault(); fetchTeams(); }} className="flex gap-4 bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-xl max-w-2xl">
        <div className="flex-1 relative">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search team name or code..."
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
          No teams found for verification.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {teams.map((t) => (
            <div
              key={t.id}
              className={`bg-slate-900 border rounded-2xl p-6 shadow-xl space-y-5 flex flex-col justify-between transition ${
                t.isVerified ? "border-emerald-800/80 bg-emerald-950/10" : "border-slate-800 hover:border-slate-700"
              }`}
            >
              
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
                      {t.teamName}
                    </h3>
                    <p className="text-xs text-amber-400 font-mono font-semibold">Code: {t.teamCode}</p>
                  </div>

                  {t.isVerified ? (
                    <span className="px-3 py-1 bg-emerald-950/90 border border-emerald-700 text-emerald-400 text-xs font-black rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      ALREADY VERIFIED
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-amber-950/80 border border-amber-800 text-amber-400 text-xs font-bold rounded-full flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      PENDING ARRIVAL
                    </span>
                  )}
                </div>

                {/* Team Members Roster */}
                <div className="space-y-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Team Members ({t.members.length})</p>
                  <div className="space-y-1.5">
                    {t.members.map((m, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2.5 bg-slate-950 border border-slate-800/80 rounded-xl text-xs">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-slate-800 text-amber-400 flex items-center justify-center font-bold text-[10px]">
                            {m.name.charAt(0)}
                          </div>
                          <span className="font-semibold text-white">{m.name}</span>
                          <span className="text-slate-500 font-mono">({m.registerNumber})</span>
                        </div>

                        <div className="flex items-center gap-2">
                          {m.isAttended && (
                            <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] font-bold rounded flex items-center gap-1">
                              <Zap className="w-3 h-3" /> +1 Credit
                            </span>
                          )}
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            m.role === "LEADER" ? "bg-amber-500/20 text-amber-400 border border-amber-500/30" : "bg-slate-800 text-slate-400"
                          }`}>
                            {m.role}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                {t.isVerified ? (
                  <div className="w-full py-2.5 bg-emerald-950/50 border border-emerald-800 text-emerald-400 text-xs font-extrabold rounded-xl flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    Verified & All Members Credited (+1 PT)
                  </div>
                ) : (
                  <button
                    onClick={() => handleVerifyTeam(t.id, t.teamName)}
                    disabled={verifyingId === t.id}
                    className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold rounded-xl text-sm transition shadow-lg shadow-amber-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {verifyingId === t.id ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Verifying Team Arrival...
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        Verify Team Arrival & Award +1 Credit To All
                      </>
                    )}
                  </button>
                )}
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}
