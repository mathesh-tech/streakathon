"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Target, Trophy, Medal, TerminalSquare, Crown, Award, ShieldCheck, Flame } from "lucide-react";

// Helper component for animated numbers
function AnimatedNumber({ value }: { value: number }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    if (start === end) return;
    const duration = 1000;
    const incrementTime = (duration / end) * 5;
    
    const timer = setInterval(() => {
      start += Math.ceil(end / (duration / 20));
      if (start > end) start = end;
      setDisplayValue(start);
      if (start === end) clearInterval(timer);
    }, 20);

    return () => clearInterval(timer);
  }, [value]);

  return <span>{displayValue}</span>;
}

export function OverviewGrid({ student }: { student: any }) {
  const metrics = [
    { title: "Current Credits", value: student.currentCredits, icon: Target, color: "text-blue-500", bg: "bg-blue-500/10" },
    { title: "Current Rank", value: student.currentRank, prefix: "#", icon: Trophy, color: "text-warning", bg: "bg-warning/10" },
    { title: "Semester Rank", value: student.semesterRank, prefix: "#", icon: Medal, color: "text-indigo-500", bg: "bg-indigo-500/10" },
    { title: "Participations", value: student.totalParticipations, icon: TerminalSquare, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { title: "Total Wins", value: student.totalWins, icon: Crown, color: "text-yellow-500", bg: "bg-yellow-500/10" },
    { title: "Certificates", value: student.certificates, icon: Award, color: "text-purple-500", bg: "bg-purple-500/10" },
    { title: "Badges Earned", value: student.badges, icon: ShieldCheck, color: "text-pink-500", bg: "bg-pink-500/10" },
    { title: "Current Streak", value: student.currentStreak, suffix: " 🔥", icon: Flame, color: "text-orange-500", bg: "bg-orange-500/10" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {metrics.map((m, i) => (
        <motion.div 
          key={i}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.05 }}
          className="glass-card rounded-2xl p-5 border border-white/5 flex flex-col justify-between"
        >
          <div className="flex justify-between items-start mb-4">
            <div className={`p-2 rounded-lg ${m.bg}`}>
              <m.icon className={`w-5 h-5 ${m.color}`} />
            </div>
          </div>
          <div>
            <div className="text-3xl font-black text-foreground">
              {m.prefix && <span className="text-muted-foreground text-xl mr-1">{m.prefix}</span>}
              <AnimatedNumber value={m.value} />
              {m.suffix && <span>{m.suffix}</span>}
            </div>
            <div className="text-sm font-medium text-muted-foreground mt-1">{m.title}</div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
