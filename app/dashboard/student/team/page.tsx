"use client";

import { useState, useEffect } from "react";
import { Users, UserPlus, LogOut, Copy, Check, Shield, AlertTriangle, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { toast } from "@/components/ui/use-toast";

export default function TeamPage() {
  const { data: session } = useSession();
  const [copied, setCopied] = useState(false);
  const [team, setTeam] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [hackathonId, setHackathonId] = useState(""); // Should ideally be selected or context-aware
  const [inviteEmail, setInviteEmail] = useState("");
  const [joinToken, setJoinToken] = useState("");

  useEffect(() => {
    // In a real app, we'd fetch the active team. For this demo, we'll fetch mock or active hackathons.
    // Assuming an endpoint exists or we just rely on the API we built.
    fetchTeam();
  }, []);

  const fetchTeam = async () => {
    try {
      // We don't have a GET /api/teams route in our task list, so let's mock the fetch 
      // or we can just show the empty state until they create one, then store in state.
      // For production, we'd add a GET route.
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };

  const handleCreateTeam = async () => {
    if (!teamName || !hackathonId) return toast({ title: "Please enter team name and select hackathon" });
    setActionLoading(true);
    try {
      const res = await fetch("/api/teams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamName, hackathonId })
      });
      const data = await res.json();
      if (data.success) {
        setTeam(data.team);
        toast({ title: "Team created successfully!" });
      } else {
        toast({ title: "Error", description: data.error, variant: "destructive" });
      }
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
    setActionLoading(false);
  };

  const handleJoinTeam = async () => {
    if (!joinToken) return toast({ title: "Enter an invite token" });
    setActionLoading(true);
    try {
      const res = await fetch("/api/teams/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: joinToken })
      });
      const data = await res.json();
      if (data.success) {
        toast({ title: "Successfully joined team!" });
        // Refetch team
      } else {
        toast({ title: "Error", description: data.error, variant: "destructive" });
      }
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
    setActionLoading(false);
  };

  const handleInvite = async () => {
    if (!inviteEmail || !team) return toast({ title: "Enter an email to invite" });
    setActionLoading(true);
    try {
      const res = await fetch(`/api/teams/${team.id}/invite`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: inviteEmail })
      });
      const data = await res.json();
      if (data.success) {
        toast({ title: "Invitation sent!" });
        setInviteEmail("");
      } else {
        toast({ title: "Error", description: data.error, variant: "destructive" });
      }
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
    setActionLoading(false);
  };

  const handleLeaveTeam = async () => {
    if (!team) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/teams/${team.id}/leave`, { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setTeam(null);
        toast({ title: "Left team." });
      } else {
        toast({ title: "Error", description: data.error, variant: "destructive" });
      }
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
    setActionLoading(false);
  };

  if (loading) {
    return <div className="flex-1 flex items-center justify-center h-full"><Loader2 className="w-8 h-8 animate-spin" /></div>;
  }

  if (!team) {
    return (
      <div className="flex-1 w-full p-4 md:p-8 flex items-center justify-center max-w-screen-xl mx-auto min-h-[calc(100vh-100px)]">
        <div className="glass-card p-8 md:p-12 rounded-3xl text-center max-w-2xl w-full border-black/5">
          <div className="w-20 h-20 bg-primary/20 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
            <Users className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-bold mb-4">No Active Team</h2>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
            You need a team to participate in hackathons. Create a new team and invite your friends, or join an existing team using an invite token.
          </p>
          
          <div className="space-y-8 text-left">
            <div className="bg-background/50 p-6 rounded-2xl border border-black/5">
              <h3 className="font-bold mb-4 flex items-center gap-2"><UserPlus className="w-5 h-5"/> Create a Team</h3>
              <div className="space-y-4">
                <input 
                  type="text" 
                  placeholder="Hackathon ID (UUID)" 
                  value={hackathonId}
                  onChange={e => setHackathonId(e.target.value)}
                  className="w-full h-12 bg-background border border-black/10 rounded-xl px-4 text-sm focus:outline-none focus:border-primary"
                />
                <input 
                  type="text" 
                  placeholder="Team Name" 
                  value={teamName}
                  onChange={e => setTeamName(e.target.value)}
                  className="w-full h-12 bg-background border border-black/10 rounded-xl px-4 text-sm focus:outline-none focus:border-primary"
                />
                <button 
                  onClick={handleCreateTeam}
                  disabled={actionLoading}
                  className="w-full h-12 bg-primary text-primary-foreground font-bold rounded-xl flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {actionLoading ? <Loader2 className="w-5 h-5 animate-spin"/> : "Create Team"}
                </button>
              </div>
            </div>

            <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-black/10"></div>
                <span className="flex-shrink-0 mx-4 text-muted-foreground text-sm font-bold">OR</span>
                <div className="flex-grow border-t border-black/10"></div>
            </div>

            <div className="bg-background/50 p-6 rounded-2xl border border-black/5">
              <h3 className="font-bold mb-4">Join via Invitation</h3>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Paste Invite Token" 
                  value={joinToken}
                  onChange={e => setJoinToken(e.target.value)}
                  className="flex-1 h-12 bg-background border border-black/10 rounded-xl px-4 text-sm focus:outline-none focus:border-primary"
                />
                <button 
                  onClick={handleJoinTeam}
                  disabled={actionLoading}
                  className="h-12 px-6 bg-black/5 hover:bg-black/10 border border-black/10 font-bold rounded-xl flex items-center justify-center transition-colors disabled:opacity-50"
                >
                  Join
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full p-4 md:p-8 space-y-8 max-w-screen-xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Team Management</h1>
        <p className="text-muted-foreground">Manage your hackathon team and invite members.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="glass-card rounded-3xl p-6 md:p-8 border-primary/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -z-10 translate-x-1/2 -translate-y-1/2" />
            
            <div className="flex justify-between items-start mb-8">
              <div>
                <h2 className="text-2xl font-bold text-foreground">{team.teamName}</h2>
                <p className="text-muted-foreground mt-1">Status: {team.status}</p>
              </div>
              <div className="bg-primary/20 text-primary px-3 py-1 rounded-full text-xs font-bold border border-primary/30">
                {team.status}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* If we had team members fetched, we would map them here */}
              
              <div className="bg-black/5 border border-dashed border-black/20 rounded-2xl p-4 flex flex-col justify-center gap-3">
                <span className="text-sm font-medium text-muted-foreground text-center">Invite New Member</span>
                <input 
                  type="email" 
                  placeholder="Student Email"
                  value={inviteEmail}
                  onChange={e => setInviteEmail(e.target.value)}
                  className="w-full h-10 bg-background border border-black/10 rounded-lg px-3 text-xs"
                />
                <button onClick={handleInvite} disabled={actionLoading} className="w-full h-10 bg-primary/10 text-primary font-bold rounded-lg hover:bg-primary/20 transition text-xs">
                  Send Invite
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-card rounded-3xl p-6 border-destructive/20 bg-destructive/5">
            <h3 className="font-bold mb-4 text-destructive">Danger Zone</h3>
            <p className="text-sm text-muted-foreground mb-4">Leaving a team will remove your participation from the active hackathon.</p>
            <button 
              onClick={handleLeaveTeam}
              disabled={actionLoading}
              className="w-full flex items-center justify-center gap-2 h-12 bg-destructive/10 hover:bg-destructive text-destructive hover:text-foreground rounded-xl text-sm font-bold transition-colors"
            >
              <LogOut className="w-4 h-4" /> Leave Team
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
