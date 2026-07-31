"use client";

import { motion } from "framer-motion";
import { Flame, Trophy, MapPin, BookOpen, Clock, Target, Sparkles } from "lucide-react";
import Image from "next/image";

interface WelcomeCardProps {
  student: {
    name: string;
    avatar?: string;
    department: string;
    year: number;
    section: string;
    semester: number;
    currentRank: number;
    currentCredits: number;
    currentStreak: number;
    bestStreak: number;
  };
}

export function WelcomeCard({ student }: WelcomeCardProps) {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-3xl overflow-hidden relative border border-black/10"
    >
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[300px] bg-primary/10 rounded-full blur-[100px] -z-10 translate-x-1/3 -translate-y-1/2" />
      
      <div className="p-8 flex flex-col md:flex-row gap-8 items-start md:items-center justify-between">
        <div className="flex items-center gap-6 z-10">
          <div className="relative">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-accent p-1 shadow-xl shadow-primary/20">
              <div className="w-full h-full bg-background rounded-xl flex items-center justify-center overflow-hidden">
                {student.avatar ? (
                  <img src={student.avatar} alt={student.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-primary to-accent">
                    {student.name.substring(0, 2).toUpperCase()}
                  </span>
                )}
              </div>
            </div>
            {student.currentStreak > 0 && (
              <div className="absolute -top-3 -right-3 bg-orange-500 text-foreground rounded-full p-1.5 shadow-lg border-2 border-background animate-bounce">
                <Flame className="w-4 h-4" />
              </div>
            )}
          </div>
          
          <div>
            <div className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground mb-1">
              <Sparkles className="w-4 h-4 text-primary" /> {getGreeting()}
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-2">
              {student.name}
            </h2>
            <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-muted-foreground">
              <span className="flex items-center gap-1.5"><BookOpen className="w-4 h-4" /> {student.department}</span>
              <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> Year {student.year}, Sem {student.semester}</span>
              <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> Section {student.section}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-4 w-full md:w-auto z-10">
          <div className="flex-1 md:flex-none glass border border-black/5 bg-black/5 rounded-2xl p-4 flex flex-col items-center justify-center min-w-[120px]">
            <Trophy className="w-6 h-6 text-warning mb-2" />
            <div className="text-sm font-medium text-muted-foreground">Rank</div>
            <div className="text-2xl font-black text-foreground">#{student.currentRank}</div>
          </div>
          <div className="flex-1 md:flex-none glass border border-black/5 bg-black/5 rounded-2xl p-4 flex flex-col items-center justify-center min-w-[120px]">
            <Target className="w-6 h-6 text-primary mb-2" />
            <div className="text-sm font-medium text-muted-foreground">Credits</div>
            <div className="text-2xl font-black text-foreground">{student.currentCredits}</div>
          </div>
          <div className="flex-1 md:flex-none glass border border-black/5 bg-black/5 rounded-2xl p-4 flex flex-col items-center justify-center min-w-[120px] relative overflow-hidden">
            <div className="absolute inset-0 bg-orange-500/10" />
            <Flame className="w-6 h-6 text-orange-500 mb-2 z-10" />
            <div className="text-sm font-medium text-orange-500 z-10">Streak</div>
            <div className="text-2xl font-black text-orange-400 z-10">{student.currentStreak}</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
