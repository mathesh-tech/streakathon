"use client";

import { motion } from "framer-motion";
import { Trophy, Medal, Star, ArrowUp, ArrowDown, Minus, Crown } from "lucide-react";
import Link from "next/link";

export default function LeaderboardPage() {
  const currentStudent = {
    id: "student-12",
    name: "Siva Mathesh",
    rank: 12,
    credits: 850,
    trend: "up" // up, down, same
  };

  const topThree = [
    { rank: 1, name: "Priya Sharma", dept: "CSE", credits: 1250 },
    { rank: 2, name: "Rahul Verma", dept: "IT", credits: 1120 },
    { rank: 3, name: "Ananya Patel", dept: "AI&DS", credits: 1050 }
  ];

  const nearbyCompetitors = [
    { rank: 10, name: "Vikram Singh", dept: "ECE", credits: 890, trend: "down" },
    { rank: 11, name: "Kavya Reddy", dept: "CSE", credits: 870, trend: "up" },
    { rank: 12, name: "Siva Mathesh", dept: "IT", credits: 850, trend: "up", isCurrent: true },
    { rank: 13, name: "Arjun Nair", dept: "MECH", credits: 840, trend: "same" },
    { rank: 14, name: "Neha Gupta", dept: "IT", credits: 820, trend: "down" }
  ];

  return (
    <div className="flex-1 w-full p-4 md:p-8 space-y-8 max-w-screen-lg mx-auto">
      <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">My Leaderboard</h1>
          <p className="text-muted-foreground">See where you stand among your peers.</p>
        </div>
        <Link 
          href="/leaderboard"
          className="flex items-center gap-2 bg-white/5 hover:bg-white/10 px-6 py-2 rounded-xl text-sm font-medium transition-colors border border-white/5"
        >
          <Trophy className="w-4 h-4" /> Global Leaderboard
        </Link>
      </header>

      {/* Motivational Widget */}
      <div className="glass-card rounded-3xl p-8 border-primary/30 relative overflow-hidden bg-primary/5">
        <div className="absolute right-0 top-0 w-64 h-64 bg-primary/20 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2" />
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-background/50 border border-primary/20 rounded-2xl flex flex-col items-center justify-center backdrop-blur-sm shadow-xl">
              <span className="text-sm font-bold text-muted-foreground">RANK</span>
              <span className="text-3xl font-black text-primary">#{currentStudent.rank}</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-1">Keep it up, Siva!</h2>
              <p className="text-muted-foreground">You are only <span className="font-bold text-white">40 points</span> away from rank #10.</p>
            </div>
          </div>
          <div className="bg-background/80 backdrop-blur-sm border border-white/10 rounded-2xl p-4 text-center min-w-[150px]">
            <div className="text-xs font-bold text-muted-foreground mb-1 uppercase tracking-wider">Total XP</div>
            <div className="text-2xl font-black text-emerald-500 font-mono">{currentStudent.credits} Pts</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Top 3 Podium */}
        <div className="lg:col-span-5 glass-card rounded-3xl p-6 md:p-8 border-white/5 flex flex-col">
          <h3 className="text-xl font-bold mb-12 flex items-center gap-2">
            <Crown className="w-5 h-5 text-yellow-500" /> Semester Champions
          </h3>
          
          <div className="flex-1 flex items-end justify-center gap-2 md:gap-4 pb-4">
            {/* Rank 2 */}
            <div className="flex flex-col items-center group">
              <div className="w-12 h-12 rounded-full bg-slate-300/20 flex items-center justify-center font-bold mb-2 group-hover:-translate-y-2 transition-transform">
                {topThree[1].name.substring(0,2).toUpperCase()}
              </div>
              <div className="w-20 md:w-24 h-32 bg-slate-400/10 border-t border-x border-slate-400/20 rounded-t-xl flex flex-col items-center justify-start pt-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-transparent to-slate-400/5" />
                <span className="text-3xl font-black text-slate-300 opacity-50 mb-1">2</span>
                <span className="text-[10px] font-bold text-slate-300 truncate w-full text-center px-1">{topThree[1].name.split(" ")[0]}</span>
                <span className="text-[10px] font-mono text-muted-foreground mt-1">{topThree[1].credits}</span>
              </div>
            </div>

            {/* Rank 1 */}
            <div className="flex flex-col items-center group z-10">
              <div className="w-16 h-16 rounded-full bg-yellow-500/20 ring-4 ring-yellow-500/30 flex items-center justify-center font-bold mb-2 group-hover:-translate-y-2 transition-transform shadow-[0_0_30px_rgba(234,179,8,0.2)]">
                {topThree[0].name.substring(0,2).toUpperCase()}
              </div>
              <div className="w-24 md:w-28 h-40 bg-yellow-500/10 border-t border-x border-yellow-500/30 rounded-t-xl flex flex-col items-center justify-start pt-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-transparent to-yellow-500/10" />
                <Crown className="w-6 h-6 text-yellow-500 absolute top-2 right-2 opacity-50" />
                <span className="text-4xl font-black text-yellow-500 opacity-50 mb-1">1</span>
                <span className="text-xs font-bold text-yellow-500 truncate w-full text-center px-1">{topThree[0].name.split(" ")[0]}</span>
                <span className="text-xs font-mono text-yellow-500/70 mt-1">{topThree[0].credits}</span>
              </div>
            </div>

            {/* Rank 3 */}
            <div className="flex flex-col items-center group">
              <div className="w-12 h-12 rounded-full bg-orange-700/20 flex items-center justify-center font-bold mb-2 group-hover:-translate-y-2 transition-transform">
                {topThree[2].name.substring(0,2).toUpperCase()}
              </div>
              <div className="w-20 md:w-24 h-24 bg-orange-700/10 border-t border-x border-orange-700/20 rounded-t-xl flex flex-col items-center justify-start pt-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-transparent to-orange-700/5" />
                <span className="text-2xl font-black text-orange-400 opacity-50 mb-1">3</span>
                <span className="text-[10px] font-bold text-orange-400 truncate w-full text-center px-1">{topThree[2].name.split(" ")[0]}</span>
                <span className="text-[10px] font-mono text-muted-foreground mt-1">{topThree[2].credits}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Nearby Competitors */}
        <div className="lg:col-span-7 glass-card rounded-3xl p-6 md:p-8 border-white/5">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Star className="w-5 h-5 text-primary" /> Your Bracket
          </h3>
          
          <div className="space-y-3">
            {nearbyCompetitors.map((student, i) => (
              <motion.div 
                key={student.rank}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                  student.isCurrent 
                    ? 'bg-primary/10 border-primary/50 shadow-[0_0_20px_rgba(var(--primary),0.1)] scale-[1.02]' 
                    : 'bg-background/50 border-white/5 hover:bg-white/5 hover:scale-[1.01]'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 text-center font-black text-xl text-muted-foreground">
                    {student.rank}
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center font-bold text-sm shrink-0">
                    {student.name.substring(0,2).toUpperCase()}
                  </div>
                  <div>
                    <div className={`font-bold text-sm ${student.isCurrent ? 'text-primary' : 'text-foreground'}`}>
                      {student.name} {student.isCurrent && '(You)'}
                    </div>
                    <div className="text-xs text-muted-foreground">{student.dept}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="font-mono font-bold text-sm">{student.credits} Pts</div>
                    <div className="flex items-center justify-end gap-1 mt-0.5">
                      {student.trend === 'up' && <ArrowUp className="w-3 h-3 text-emerald-500" />}
                      {student.trend === 'down' && <ArrowDown className="w-3 h-3 text-destructive" />}
                      {student.trend === 'same' && <Minus className="w-3 h-3 text-muted-foreground" />}
                      <span className="text-[10px] text-muted-foreground uppercase">{student.trend}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
