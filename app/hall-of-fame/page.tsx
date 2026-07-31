"use client";

import { motion } from "framer-motion";
import { Trophy, Medal, Star, Award, Search, Filter, Crown } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
export default function HallOfFamePage() {
  const [searchTerm, setSearchTerm] = useState("");

  const pastChampions = [
    {
      id: "ch-01",
      semester: "Even Semester 2025",
      name: "Siva Mathesh",
      department: "Information Technology",
      year: "3rd Year",
      credits: 2150,
      wins: 4,
      participations: 8,
      achievement: "Innovation Master"
    },
    {
      id: "ch-02",
      semester: "Odd Semester 2025",
      name: "Priya Sharma",
      department: "Computer Science",
      year: "4th Year",
      credits: 1980,
      wins: 3,
      participations: 6,
      achievement: "Problem Solver"
    },
    {
      id: "ch-03",
      semester: "Even Semester 2024",
      name: "Rahul Verma",
      department: "Artificial Intelligence",
      year: "4th Year",
      credits: 1850,
      wins: 3,
      participations: 5,
      achievement: "Consistency Star"
    }
  ];

  const filteredChampions = pastChampions.filter(champ => 
    champ.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    champ.semester.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow pt-32 pb-20">
        <div className="container mx-auto px-4 max-w-7xl">
          
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center justify-center p-3 bg-yellow-500/20 text-yellow-500 rounded-full mb-6 ring-4 ring-yellow-500/10 shadow-[0_0_30px_rgba(234,179,8,0.3)]"
            >
              <Crown className="w-10 h-10" />
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl md:text-5xl font-black mb-6 tracking-tight"
            >
              Hall of Fame
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
            >
              Honoring the most consistent, innovative, and dedicated students from past semesters. These are our legends.
            </motion.p>
          </div>

          <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-12">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Search champions or semesters..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-12 bg-background/50 border border-black/10 rounded-xl px-10 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary backdrop-blur-sm"
              />
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <button className="flex-1 md:flex-none h-12 px-6 bg-background/50 border border-black/10 rounded-xl flex items-center justify-center gap-2 hover:bg-black/5 transition-colors text-sm font-medium">
                <Filter className="w-4 h-4" /> Filter by Dept
              </button>
            </div>
          </div>

          <div className="space-y-8">
            {filteredChampions.map((champion, i) => (
              <motion.div 
                key={champion.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-card rounded-3xl p-1 overflow-hidden group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="bg-background/80 backdrop-blur-sm rounded-[22px] p-6 md:p-8 flex flex-col md:flex-row items-center gap-8 relative z-10">
                  
                  {/* Avatar & Medal */}
                  <div className="relative shrink-0">
                    <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-yellow-500/20 to-primary/20 flex items-center justify-center ring-1 ring-white/10 group-hover:ring-yellow-500/50 transition-all shadow-xl">
                      <span className="text-4xl font-black bg-gradient-to-br from-white to-black/50 bg-clip-text text-transparent">
                        {champion.name.substring(0, 2).toUpperCase()}
                      </span>
                    </div>
                    <div className="absolute -bottom-4 -right-4 bg-yellow-500 text-yellow-950 p-2.5 rounded-xl shadow-lg border border-yellow-400">
                      <Medal className="w-6 h-6" />
                    </div>
                  </div>

                  {/* Details */}
                  <div className="flex-1 text-center md:text-left space-y-4">
                    <div>
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/5 border border-black/10 text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">
                        <Star className="w-3.5 h-3.5 text-yellow-500" /> {champion.semester} Champion
                      </div>
                      <h2 className="text-3xl font-black text-foreground mb-1">{champion.name}</h2>
                      <p className="text-muted-foreground font-medium">{champion.department} • {champion.year}</p>
                    </div>

                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2">
                      <div className="bg-black/5 px-4 py-2 rounded-xl border border-black/5 flex flex-col">
                        <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-0.5">Total XP</span>
                        <span className="font-mono font-bold text-emerald-500">{champion.credits}</span>
                      </div>
                      <div className="bg-black/5 px-4 py-2 rounded-xl border border-black/5 flex flex-col">
                        <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-0.5">Wins</span>
                        <span className="font-mono font-bold text-yellow-500">{champion.wins}</span>
                      </div>
                      <div className="bg-black/5 px-4 py-2 rounded-xl border border-black/5 flex flex-col">
                        <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-0.5">Participations</span>
                        <span className="font-mono font-bold text-primary">{champion.participations}</span>
                      </div>
                    </div>
                  </div>

                  {/* Signature Achievement */}
                  <div className="shrink-0 w-full md:w-auto flex flex-col items-center justify-center p-6 bg-gradient-to-br from-yellow-500/10 to-transparent rounded-2xl border border-yellow-500/20">
                    <Award className="w-8 h-8 text-yellow-500 mb-3" />
                    <div className="text-sm font-bold text-foreground text-center">Signature Achievement</div>
                    <div className="text-xs font-medium text-yellow-500/80 text-center mt-1 bg-yellow-500/10 px-3 py-1 rounded-full">{champion.achievement}</div>
                  </div>

                </div>
              </motion.div>
            ))}

            {filteredChampions.length === 0 && (
              <div className="text-center py-20 glass-card rounded-3xl border-black/5">
                <Crown className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-bold mb-2">No Champions Found</h3>
                <p className="text-muted-foreground">Try adjusting your search criteria.</p>
              </div>
            )}
          </div>
          
        </div>
      </main>
    </div>
  );
}
