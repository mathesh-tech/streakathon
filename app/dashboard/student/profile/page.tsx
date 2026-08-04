"use client";

import { useState } from "react";
import { User, Mail, Hash, Phone, Github, Linkedin, Globe, Edit3, ShieldCheck, Save, X, Camera } from "lucide-react";
import { triggerConfetti } from "@/components/dashboard/student/GamificationSystem";

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);

  const [profile, setProfile] = useState({
    name: "Siva Mathesh",
    email: "siva.mathesh@sonatech.ac.in",
    registerNumber: "732921104108",
    department: "Information Technology",
    year: "3",
    section: "A",
    phone: "+91 98765 43210",
    github: "github.com/sivamathesh",
    linkedin: "linkedin.com/in/sivamathesh",
    portfolio: "sivamathesh.dev",
    bio: "Passionate about building AI applications and decentralized systems.",
  });

  const badges = [
    { name: "First Hackathon", date: "Jan 2026", color: "bg-blue-500/20 text-blue-500", border: "border-blue-500/20" },
    { name: "Top 10 Performer", date: "Feb 2026", color: "bg-emerald-500/20 text-emerald-500", border: "border-emerald-500/20" },
    { name: "Streak Master", date: "Mar 2026", color: "bg-orange-500/20 text-orange-500", border: "border-orange-500/20" },
    { name: "AI Innovator", date: "Apr 2026", color: "bg-purple-500/20 text-purple-500", border: "border-purple-500/20" },
  ];

  const handleSave = () => {
    setIsEditing(false);
    triggerConfetti();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex-1 w-full p-4 md:p-8 space-y-8 max-w-screen-xl mx-auto">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Student Profile</h1>
          <p className="text-muted-foreground">Manage your public identity and showcase your achievements.</p>
        </div>
        {!isEditing ? (
          <button 
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 bg-black/5 hover:bg-black/10 px-6 py-2 rounded-xl text-sm font-medium transition-colors border border-black/5"
          >
            <Edit3 className="w-4 h-4" /> Edit Profile
          </button>
        ) : (
          <div className="flex gap-2">
            <button 
              onClick={() => setIsEditing(false)}
              className="flex items-center gap-2 bg-black/5 hover:bg-black/10 px-4 py-2 rounded-xl text-sm font-medium transition-colors"
            >
              <X className="w-4 h-4" /> Cancel
            </button>
            <button 
              onClick={handleSave}
              className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2 rounded-xl text-sm font-bold transition-all hover:brightness-110"
            >
              <Save className="w-4 h-4" /> Save Changes
            </button>
          </div>
        )}
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-8">
          <div className="glass-card rounded-3xl p-6 md:p-8 border-black/5 relative overflow-hidden">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="relative w-32 h-32 rounded-2xl bg-gradient-to-br from-primary to-accent p-1 shrink-0 group">
                <div className="w-full h-full bg-background rounded-xl flex items-center justify-center font-bold text-4xl overflow-hidden relative">
                  {profile.name.substring(0,2).toUpperCase()}
                  
                  {isEditing && (
                    <label className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer backdrop-blur-sm">
                      <Camera className="w-6 h-6 mb-1" />
                      <span className="text-[10px] font-bold uppercase">Change</span>
                      <input type="file" className="hidden" accept="image/*" />
                    </label>
                  )}
                </div>
              </div>
              
              <div className="flex-1 space-y-6 w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> Full Name</label>
                    {isEditing ? (
                      <input name="name" value={profile.name} onChange={handleChange} className="w-full h-10 bg-background/50 border border-black/10 rounded-lg px-3 text-sm focus:border-primary focus:outline-none" />
                    ) : (
                      <div className="font-medium text-foreground">{profile.name}</div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> Email (Read Only)</label>
                    <div className="font-medium text-muted-foreground">{profile.email}</div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-1.5"><Hash className="w-3.5 h-3.5" /> Register Number (Read Only)</label>
                    <div className="font-medium text-muted-foreground">{profile.registerNumber}</div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> Phone</label>
                    {isEditing ? (
                      <input name="phone" value={profile.phone} onChange={handleChange} className="w-full h-10 bg-background/50 border border-black/10 rounded-lg px-3 text-sm focus:border-primary focus:outline-none" />
                    ) : (
                      <div className="font-medium text-foreground">{profile.phone}</div>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-black/5 space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase">Bio</label>
                  {isEditing ? (
                    <textarea name="bio" value={profile.bio} onChange={handleChange} rows={3} className="w-full bg-background/50 border border-black/10 rounded-lg p-3 text-sm focus:border-primary focus:outline-none resize-none" />
                  ) : (
                    <p className="text-sm text-foreground">{profile.bio}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card rounded-3xl p-6 md:p-8 border-black/5">
            <h3 className="text-xl font-bold mb-6">Social Links</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-1.5"><Github className="w-3.5 h-3.5" /> GitHub</label>
                {isEditing ? (
                  <input name="github" value={profile.github} onChange={handleChange} className="w-full h-10 bg-background/50 border border-black/10 rounded-lg px-3 text-sm focus:border-primary focus:outline-none" />
                ) : (
                  <a href={`https://${profile.github}`} target="_blank" className="font-medium text-primary hover:underline text-sm truncate block">{profile.github}</a>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-1.5"><Linkedin className="w-3.5 h-3.5" /> LinkedIn</label>
                {isEditing ? (
                  <input name="linkedin" value={profile.linkedin} onChange={handleChange} className="w-full h-10 bg-background/50 border border-black/10 rounded-lg px-3 text-sm focus:border-primary focus:outline-none" />
                ) : (
                  <a href={`https://${profile.linkedin}`} target="_blank" className="font-medium text-primary hover:underline text-sm truncate block">{profile.linkedin}</a>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-1.5"><Globe className="w-3.5 h-3.5" /> Portfolio</label>
                {isEditing ? (
                  <input name="portfolio" value={profile.portfolio} onChange={handleChange} className="w-full h-10 bg-background/50 border border-black/10 rounded-lg px-3 text-sm focus:border-primary focus:outline-none" />
                ) : (
                  <a href={`https://${profile.portfolio}`} target="_blank" className="font-medium text-primary hover:underline text-sm truncate block">{profile.portfolio}</a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Side Panel */}
        <div className="space-y-8">
          <div className="glass-card rounded-3xl p-6 border-black/5">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-primary" /> Badge Collection
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {badges.map((badge, i) => (
                <div key={i} className={`p-4 rounded-2xl border ${badge.border} flex flex-col items-center justify-center text-center group hover:scale-105 transition-transform cursor-pointer`}>
                  <div className={`w-12 h-12 rounded-full ${badge.color} flex items-center justify-center mb-3 group-hover:animate-pulse`}>
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <h4 className="text-xs font-bold text-foreground mb-1">{badge.name}</h4>
                  <p className="text-[10px] text-muted-foreground">{badge.date}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
