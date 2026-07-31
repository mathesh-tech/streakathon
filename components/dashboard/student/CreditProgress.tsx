"use client";

import { motion } from "framer-motion";
import { Target } from "lucide-react";

export function CreditProgress({ current, goal = 1000 }: { current: number, goal?: number }) {
  const percentage = Math.min((current / goal) * 100, 100);
  const remaining = Math.max(goal - current, 0);

  const milestones = [
    { value: 100, label: "Beginner" },
    { value: 250, label: "Novice" },
    { value: 500, label: "Pro" },
    { value: 750, label: "Master" },
    { value: 1000, label: "Legend" },
  ];

  return (
    <div className="glass-card rounded-3xl p-6 md:p-8 border-primary/20">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" /> Semester Goal
          </h3>
          <p className="text-muted-foreground text-sm mt-1">Earn {goal} points to become a Semester Legend.</p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-black text-primary">{current} <span className="text-lg text-muted-foreground font-medium">/ {goal}</span></div>
          <div className="text-sm font-medium text-muted-foreground mt-1">{remaining} points remaining</div>
        </div>
      </div>

      <div className="relative pt-6 pb-8">
        {/* Progress Track */}
        <div className="h-4 bg-secondary/30 rounded-full overflow-hidden relative">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary via-accent to-primary rounded-full"
          >
            {/* Shimmer effect */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-black/30 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
          </motion.div>
        </div>

        {/* Milestones */}
        {milestones.map((milestone, i) => {
          const isReached = current >= milestone.value;
          const leftPercent = (milestone.value / goal) * 100;
          return (
            <div 
              key={i} 
              className="absolute top-4 flex flex-col items-center -translate-x-1/2"
              style={{ left: `${leftPercent}%` }}
            >
              <div className={`w-1 h-8 rounded-full mb-2 ${isReached ? 'bg-primary' : 'bg-border'}`} />
              <div className={`w-4 h-4 rounded-full border-4 ${isReached ? 'border-primary bg-background' : 'border-border bg-background'}`} />
              <div className={`text-xs font-bold mt-2 whitespace-nowrap ${isReached ? 'text-primary' : 'text-muted-foreground'}`}>
                {milestone.value}
              </div>
              <div className="text-[10px] text-muted-foreground hidden md:block uppercase tracking-wider">{milestone.label}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
