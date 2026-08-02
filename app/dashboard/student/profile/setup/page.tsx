"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function ProfileSetupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    
    try {
      const res = await fetch("/api/student/profile/setup", {
        method: "POST",
        body: JSON.stringify(Object.fromEntries(formData)),
        headers: { "Content-Type": "application/json" }
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to setup profile");
      }

      router.push("/dashboard/student");
      router.refresh(); // Refresh to update session token in middleware
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex-1 w-full p-4 md:p-8 flex items-center justify-center min-h-[80vh]">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl bg-card border border-white/10 rounded-xl p-8"
      >
        <h1 className="text-2xl md:text-3xl font-black text-white mb-2 uppercase tracking-tight">
          Complete Your Profile
        </h1>
        <p className="text-slate-400 mb-8">
          Welcome to STREAKATHON! Please provide your academic details to get started.
        </p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-300">Batch (e.g. 2022-2026)</label>
              <input 
                name="batch"
                required
                className="w-full bg-background border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="2022-2026"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-300">Semester</label>
              <select 
                name="semester"
                required
                className="w-full bg-background border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                {[1,2,3,4,5,6,7,8].map(sem => (
                  <option key={sem} value={sem}>Semester {sem}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-300">Section</label>
              <input 
                name="section"
                required
                className="w-full bg-background border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="A, B, C..."
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-300">Mobile Number (Optional)</label>
              <input 
                name="phone"
                type="tel"
                className="w-full bg-background border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="+91..."
              />
            </div>
          </div>

          <hr className="border-white/5" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-300">GitHub Profile (Optional)</label>
              <input 
                name="github"
                type="url"
                className="w-full bg-background border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="https://github.com/username"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-300">LinkedIn Profile (Optional)</label>
              <input 
                name="linkedin"
                type="url"
                className="w-full bg-background border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="https://linkedin.com/in/username"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-black py-4 rounded-lg uppercase tracking-wider transition-colors disabled:opacity-50"
          >
            {loading ? "Saving Profile..." : "Complete Setup"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
