"use client";

import { useState } from "react";
import { Users, UserPlus, LogOut, Copy, Check, Shield } from "lucide-react";

export default function TeamPage() {
  const [copied, setCopied] = useState(false);
  const [hasTeam, setHasTeam] = useState(true); // Toggle to test Empty State vs Team View

  const copyInvite = () => {
    navigator.clipboard.writeText("HX-92LA");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const teamMembers = [
    { name: "Siva Mathesh", role: "Captain", dept: "IT-A", isOnline: true },
    { name: "Alex Hacker", role: "Member", dept: "IT-B", isOnline: false },
    { name: "Sarah Connor", role: "Member", dept: "IT-A", isOnline: true },
  ];

  if (!hasTeam) {
    return (
      <div className="flex-1 w-full p-4 md:p-8 flex items-center justify-center max-w-screen-xl mx-auto h-[calc(100vh-100px)]">
        <div className="glass-card p-12 rounded-3xl text-center max-w-2xl w-full border-black/5">
          <div className="w-24 h-24 bg-primary/20 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
            <Users className="w-12 h-12" />
          </div>
          <h2 className="text-3xl font-bold mb-4">You don't have a team yet</h2>
          <p className="text-muted-foreground mb-12 max-w-lg mx-auto">
            You need a team to participate in hackathons. Create a new team and invite your friends, or join an existing team using an invite code.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button 
              onClick={() => setHasTeam(true)}
              className="h-14 bg-primary text-primary-foreground font-bold rounded-xl flex items-center justify-center gap-2 transition-transform hover:scale-105 active:scale-95"
            >
              <UserPlus className="w-5 h-5" /> Create New Team
            </button>
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="Invite Code (e.g. HX-92LA)" 
                className="flex-1 h-14 bg-background/50 border border-black/10 rounded-xl px-4 text-sm focus:outline-none focus:border-primary"
              />
              <button 
                onClick={() => setHasTeam(true)}
                className="h-14 px-6 bg-black/5 hover:bg-black/10 border border-black/10 font-bold rounded-xl flex items-center justify-center transition-colors"
              >
                Join
              </button>
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
                <h2 className="text-2xl font-bold text-foreground">Team Horizon</h2>
                <p className="text-muted-foreground mt-1">Participating in Streakathon #15</p>
              </div>
              <div className="bg-primary/20 text-primary px-3 py-1 rounded-full text-xs font-bold border border-primary/30">
                LOCKED
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {teamMembers.map((m, i) => (
                <div key={i} className="bg-background/50 border border-black/5 rounded-2xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent p-0.5">
                        <div className="w-full h-full bg-background rounded-[10px] flex items-center justify-center font-bold">
                          {m.name.substring(0,2).toUpperCase()}
                        </div>
                      </div>
                      <div className={`absolute -bottom-1 -right-1 w-4 h-4 border-2 border-background rounded-full ${m.isOnline ? 'bg-emerald-500' : 'bg-muted'}`} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm flex items-center gap-1.5">
                        {m.name} 
                        {m.role === 'Captain' && <Shield className="w-3.5 h-3.5 text-warning" />}
                      </h4>
                      <p className="text-xs text-muted-foreground">{m.role} • {m.dept}</p>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Empty Slot */}
              <div className="bg-black/5 border border-dashed border-black/20 rounded-2xl p-4 flex flex-col items-center justify-center text-center opacity-70 hover:opacity-100 transition-opacity cursor-pointer">
                <UserPlus className="w-6 h-6 text-muted-foreground mb-2" />
                <span className="text-sm font-medium text-muted-foreground">Invite Member</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-card rounded-3xl p-6 border-black/5">
            <h3 className="font-bold mb-4">Invite Code</h3>
            <p className="text-sm text-muted-foreground mb-4">Share this code with your classmates so they can join your team.</p>
            <div className="flex gap-2">
              <div className="flex-1 bg-background/50 border border-black/10 rounded-xl px-4 flex items-center justify-center font-mono text-xl tracking-widest font-bold text-primary">
                HX-92LA
              </div>
              <button onClick={copyInvite} className="w-12 h-12 bg-black/5 hover:bg-black/10 border border-black/10 rounded-xl flex items-center justify-center transition-colors">
                {copied ? <Check className="w-5 h-5 text-emerald-500" /> : <Copy className="w-5 h-5 text-muted-foreground" />}
              </button>
            </div>
          </div>

          <div className="glass-card rounded-3xl p-6 border-destructive/20 bg-destructive/5">
            <h3 className="font-bold mb-4 text-destructive">Danger Zone</h3>
            <p className="text-sm text-muted-foreground mb-4">Leaving a team will remove your participation from the active hackathon.</p>
            <button 
              onClick={() => setHasTeam(false)}
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
