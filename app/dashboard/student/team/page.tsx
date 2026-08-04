"use client";

import { useState, useEffect } from "react";
import { Users, UserPlus, LogOut, Copy, Check, Shield, Loader2, Sparkles, UserCheck } from "lucide-react";
import { useSession } from "next-auth/react";

export default function TeamPage() {
  const { data: session } = useSession();
  const [copied, setCopied] = useState(false);
  const [team, setTeam] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [inviteIdentifier, setInviteIdentifier] = useState(""); // Register Number or Email
  const [joinToken, setJoinToken] = useState("");
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    fetchActiveTeam();
  }, []);

  const fetchActiveTeam = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/teams/active");
      if (res.ok) {
        const data = await res.json();
        if (data.team) {
          setTeam(data.team);
        }
      }
    } catch (e) {
      console.error("Failed to load active team:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName.trim()) {
      setMessage({ text: "Please enter a team name", type: "error" });
      return;
    }

    setActionLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/teams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamName: teamName.trim() }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setTeam(data.team);
        setMessage({ text: "Team created successfully! Share your team code with teammates.", type: "success" });
      } else {
        setMessage({ text: data.error || "Failed to create team", type: "error" });
      }
    } catch (e: any) {
      setMessage({ text: "An unexpected error occurred", type: "error" });
    } finally {
      setActionLoading(false);
    }
  };

  const handleJoinTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinToken.trim()) {
      setMessage({ text: "Please enter a team code", type: "error" });
      return;
    }

    setActionLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/teams/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: joinToken.trim().toUpperCase() }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setTeam(data.team);
        setMessage({ text: "Successfully joined the team!", type: "success" });
      } else {
        setMessage({ text: data.error || "Failed to join team", type: "error" });
      }
    } catch (e: any) {
      setMessage({ text: "An unexpected error occurred", type: "error" });
    } finally {
      setActionLoading(false);
    }
  };

  const handleInviteMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteIdentifier.trim() || !team) return;

    setActionLoading(true);
    setMessage(null);

    try {
      const res = await fetch(`/api/teams/${team.id}/invite`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: inviteIdentifier.trim() }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setMessage({ text: `Teammate ${inviteIdentifier} added successfully!`, type: "success" });
        setInviteIdentifier("");
        fetchActiveTeam();
      } else {
        setMessage({ text: data.error || "Failed to add teammate", type: "error" });
      }
    } catch (e: any) {
      setMessage({ text: "An error occurred while inviting member", type: "error" });
    } finally {
      setActionLoading(false);
    }
  };

  const copyCode = () => {
    if (team?.teamCode) {
      navigator.clipboard.writeText(team.teamCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen bg-slate-950 text-slate-100">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    );
  }

  return (
    <div className="flex-1 w-full p-4 md:p-8 space-y-8 max-w-screen-xl mx-auto text-slate-100 min-h-screen">
      <header className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
          <Users className="w-8 h-8 text-amber-400" />
          Hackathon Team Management
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Form your team, invite your teammates by email or register number, and enter Streakathon 2K26!
        </p>
      </header>

      {message && (
        <div
          className={`p-4 rounded-xl border flex items-center justify-between text-sm font-medium ${
            message.type === "success"
              ? "bg-emerald-950/80 border-emerald-800 text-emerald-300"
              : "bg-red-950/80 border-red-800 text-red-300"
          }`}
        >
          <span>{message.text}</span>
          <button onClick={() => setMessage(null)} className="text-xs uppercase font-bold opacity-75 hover:opacity-100">
            Dismiss
          </button>
        </div>
      )}

      {!team ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Create Team Form (For Team Leaders) */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-xl space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
              <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl">
                <UserPlus className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Create a New Team</h2>
                <p className="text-xs text-slate-400">As Team Leader, create your team & generate a Team Code</p>
              </div>
            </div>

            <form onSubmit={handleCreateTeam} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                  Team Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sona Tech Innovators"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="p-4 bg-slate-950/60 border border-slate-800/80 rounded-xl text-xs text-slate-400 space-y-1">
                <div className="flex items-center gap-2 text-amber-400 font-semibold">
                  <Sparkles className="w-4 h-4" />
                  Active Event: Streakathon 2K26
                </div>
                <p>Team size: 2 to 4 members per team (IT & ADS Departments).</p>
              </div>

              <button
                type="submit"
                disabled={actionLoading}
                className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-sm transition shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {actionLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Create Team as Leader"}
              </button>
            </form>
          </div>

          {/* Join Existing Team Form */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-xl space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
              <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Join an Existing Team</h2>
                <p className="text-xs text-slate-400">Enter the 6-character Team Code provided by your Team Leader</p>
              </div>
            </div>

            <form onSubmit={handleJoinTeam} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                  Team Code
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SONA-01 or HX-92LA"
                  value={joinToken}
                  onChange={(e) => setJoinToken(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white font-mono placeholder-slate-500 uppercase focus:outline-none focus:border-amber-500"
                />
              </div>

              <button
                type="submit"
                disabled={actionLoading}
                className="w-full py-3.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-sm transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {actionLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Join Team"}
              </button>
            </form>
          </div>

        </div>
      ) : (
        /* Team Active State */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
              <div>
                <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold rounded-full uppercase tracking-wider">
                  Active Team
                </span>
                <h2 className="text-3xl font-extrabold text-white mt-2">{team.teamName}</h2>
              </div>
              
              {/* Team Code Display */}
              <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 px-4 py-2.5 rounded-xl">
                <span className="text-xs text-slate-400 uppercase font-semibold">Team Code:</span>
                <span className="font-mono text-base font-bold text-amber-400 tracking-wider">{team.teamCode}</span>
                <button
                  onClick={copyCode}
                  className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition ml-1"
                  title="Copy Team Code"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Team Members List */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-amber-400" />
                Team Members ({team.members?.length || 1} / {team.maxMembers || 4})
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {team.members?.map((member: any, i: number) => (
                  <div key={i} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold flex items-center justify-center text-sm">
                      {member.student?.user?.name?.charAt(0) || "M"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold text-white truncate">
                        {member.student?.user?.name || "Student Member"}
                      </div>
                      <div className="text-xs text-slate-400 truncate">
                        {member.student?.user?.registerNumber || member.role}
                      </div>
                    </div>
                    {member.role === "LEADER" && (
                      <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded text-[10px] font-bold">
                        LEADER
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Add / Invite Teammate */}
            <form onSubmit={handleInviteMember} className="pt-4 border-t border-slate-800 space-y-3">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Add Teammate (By Register Number or Email)
              </label>
              <div className="flex gap-3">
                <input
                  type="text"
                  required
                  placeholder="e.g. 6178231IT002 or teammate@sonatech.ac.in"
                  value={inviteIdentifier}
                  onChange={(e) => setInviteIdentifier(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-sm transition disabled:opacity-50"
                >
                  Add Teammate
                </button>
              </div>
            </form>
          </div>

          {/* Side Status Box */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-emerald-400" />
              Registration Status
            </h3>

            <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2 text-xs text-slate-400">
              <div className="flex justify-between text-slate-200 font-semibold">
                <span>Hackathon:</span>
                <span className="text-amber-400">Streakathon 2K26</span>
              </div>
              <div className="flex justify-between">
                <span>Status:</span>
                <span className="text-emerald-400 font-bold uppercase">{team.status}</span>
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
