"use client";

import { motion } from "framer-motion";
import { Flame, FlameKindling, Info } from "lucide-react";

export function StreakTimeline({ currentStreak, bestStreak }: { currentStreak: number, bestStreak: number }) {
  // Let's generate a visual timeline of the last 10 weeks
  const maxVisual = 10;
  const history = Array.from({ length: maxVisual }).map((_, i) => {
    // True if part of the current streak
    return i < currentStreak;
  }).reverse(); // Left to right (oldest to newest)

  return (
    <div className="glass-card rounded-3xl p-6 md:p-8">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-500" /> Participation Streak
          </h3>
          <p className="text-muted-foreground text-sm mt-1">Don't miss a hackathon to keep your streak alive.</p>
        </div>
        <div className="text-right">
          <div className="text-sm font-medium text-muted-foreground">Best Streak</div>
          <div className="text-xl font-bold text-foreground">{bestStreak} 🔥</div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-4 custom-scrollbar">
        {history.map((isActive, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="flex flex-col items-center gap-3 min-w-[40px]"
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
              isActive 
                ? 'bg-orange-500/20 shadow-[0_0_15px_rgba(249,115,22,0.4)] border border-orange-500/50' 
                : 'bg-white/5 border border-white/10'
            }`}>
              {isActive ? (
                <Flame className="w-5 h-5 text-orange-500" />
              ) : (
                <FlameKindling className="w-5 h-5 text-muted-foreground/30" />
              )}
            </div>
            <div className="text-[10px] text-muted-foreground uppercase font-bold">W{i + 1}</div>
          </motion.div>
        ))}
      </div>

      {currentStreak === 0 && (
        <div className="mt-4 p-4 rounded-xl bg-orange-500/10 border border-orange-500/20 flex gap-3 items-start">
          <Info className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
          <div className="text-sm text-orange-500/90 font-medium">
            Your streak reset because you missed the last hackathon. Register for the next one to ignite it again!
          </div>
        </div>
      )}
      {currentStreak > 0 && (
        <div className="mt-4 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex gap-3 items-start">
          <Flame className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
          <div className="text-sm text-emerald-500/90 font-medium">
            You are on a {currentStreak} hackathon streak! Register for the next one to keep the fire burning.
          </div>
        </div>
      )}
    </div>
  );
}
