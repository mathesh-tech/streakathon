"use client";

import { useState, useEffect } from "react";
import { Lock, FileText, Download, PlayCircle, ExternalLink, Unlock } from "lucide-react";
import { motion } from "framer-motion";

export default function ProblemStatementPage({ params }: { params: { id: string } }) {
  // Mock locked state for demonstration (toggle this to see both states)
  const [isLocked, setIsLocked] = useState(false);
  const [countdown, setCountdown] = useState("02:14:45");

  useEffect(() => {
    if (!isLocked) return;
    const timer = setInterval(() => {
      // Mock countdown logic
      setCountdown((prev) => {
        const [h, m, s] = prev.split(":").map(Number);
        if (s > 0) return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${(s - 1).toString().padStart(2, '0')}`;
        if (m > 0) return `${h.toString().padStart(2, '0')}:${(m - 1).toString().padStart(2, '0')}:59`;
        if (h > 0) return `${(h - 1).toString().padStart(2, '0')}:59:59`;
        setIsLocked(false);
        return "00:00:00";
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isLocked]);

  if (isLocked) {
    return (
      <div className="flex-1 w-full h-[calc(100vh-100px)] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full glass-card rounded-3xl p-8 text-center border-white/5 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
          <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Problem Statement Locked</h2>
          <p className="text-muted-foreground mb-8">The problem statement for Streakathon #{params.id} will be revealed on Saturday at 10:00 AM.</p>
          
          <div className="bg-[#111] border border-white/5 rounded-2xl p-6">
            <div className="text-sm text-muted-foreground uppercase font-bold tracking-widest mb-2">Unlocking In</div>
            <div className="text-5xl font-black text-white tabular-nums tracking-tighter font-mono">{countdown}</div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full p-4 md:p-8 space-y-8 max-w-screen-lg mx-auto">
      <header className="glass p-6 rounded-2xl flex items-center justify-between border-emerald-500/20 bg-emerald-500/5">
        <div>
          <div className="inline-flex items-center gap-2 text-emerald-500 text-sm font-bold mb-2 uppercase tracking-wider">
            <Unlock className="w-4 h-4" /> Unlocked
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Streakathon #{params.id} Problem Statements</h1>
        </div>
        <div className="hidden md:flex items-center gap-4">
          <button className="flex items-center gap-2 bg-white/5 hover:bg-white/10 px-4 py-2 rounded-lg font-medium transition-colors border border-white/5">
            <Download className="w-4 h-4" /> Download PDF
          </button>
        </div>
      </header>

      <div className="space-y-6">
        {/* Problem 1 */}
        <div className="glass-card rounded-2xl p-6 md:p-8 border-white/5">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-primary/20 text-primary flex items-center justify-center shrink-0">
              <span className="text-xl font-black">01</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">AI-Powered Micro-Investment Platform</h2>
              <div className="flex gap-2 mt-2">
                <span className="text-xs font-medium bg-blue-500/20 text-blue-400 px-2 py-1 rounded">FinTech</span>
                <span className="text-xs font-medium bg-purple-500/20 text-purple-400 px-2 py-1 rounded">Artificial Intelligence</span>
              </div>
            </div>
          </div>
          
          <div className="prose prose-invert max-w-none mb-8">
            <p className="text-muted-foreground text-lg leading-relaxed">
              Design and develop a platform that allows students to invest spare change from their daily college expenses. 
              The platform should utilize an AI agent to analyze spending habits and suggest low-risk mutual funds or fractional stocks.
            </p>
            <h3 className="text-white mt-6 mb-2">Key Requirements:</h3>
            <ul className="text-muted-foreground list-disc pl-5 space-y-1">
              <li>Mock banking API integration for transaction tracking.</li>
              <li>AI agent implementation (using Gemini API or similar) for financial advice.</li>
              <li>Gamified portfolio dashboard showing projected growth.</li>
            </ul>
          </div>

          <div className="flex flex-wrap gap-4 pt-6 border-t border-white/5">
            <button className="flex items-center gap-2 bg-primary/10 hover:bg-primary/20 text-primary px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
              <FileText className="w-4 h-4" /> Dataset / Resources
            </button>
            <button className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
              <ExternalLink className="w-4 h-4" /> Reference API Docs
            </button>
          </div>
        </div>

        {/* Problem 2 */}
        <div className="glass-card rounded-2xl p-6 md:p-8 border-white/5">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-accent/20 text-accent flex items-center justify-center shrink-0">
              <span className="text-xl font-black">02</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">Automated Campus Resource Allocator</h2>
              <div className="flex gap-2 mt-2">
                <span className="text-xs font-medium bg-orange-500/20 text-orange-400 px-2 py-1 rounded">Automation</span>
                <span className="text-xs font-medium bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded">Smart Campus</span>
              </div>
            </div>
          </div>
          
          <div className="prose prose-invert max-w-none mb-8">
            <p className="text-muted-foreground text-lg leading-relaxed">
              Create an intelligent scheduling system for department labs, seminar halls, and faculty appointments. 
              The system should automatically resolve conflicts and optimize resource utilization based on historical usage data.
            </p>
          </div>

          <div className="flex flex-wrap gap-4 pt-6 border-t border-white/5">
            <button className="flex items-center gap-2 bg-primary/10 hover:bg-primary/20 text-primary px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
              <FileText className="w-4 h-4" /> Campus Blueprint Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
