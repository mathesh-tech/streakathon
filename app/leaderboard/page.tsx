"use client";

import { motion } from "framer-motion";
import { Search, Trophy, Medal, Award } from "lucide-react";
import { useState } from "react";

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState("overall");

  return (
    <div className="flex flex-col min-h-screen w-full bg-background pt-24 pb-20">
      <section className="container max-w-screen-xl px-4 md:px-6 mb-12">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
          <div>
            <h1 className="text-5xl font-bold tracking-tight mb-4">Leaderboard</h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              The official ranking of the IT Department's top innovators. Climb the ranks by participating, building, and winning hackathons.
            </p>
          </div>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search students..." 
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-black/5 border border-black/10 focus:outline-none focus:border-primary transition-colors text-sm"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-2 mb-12 overflow-x-auto pb-2">
          {["Overall", "Weekly", "Monthly", "Semester", "Second Year", "Third Year"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab.toLowerCase())}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.toLowerCase() 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-black/5 text-muted-foreground hover:bg-black/10"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Top 3 Podium (Similar to landing page but expanded) */}
        <div className="flex flex-row items-end justify-center gap-2 md:gap-8 max-w-4xl mx-auto h-[300px] md:h-[400px] mb-16 md:mb-24">
            {/* Rank 2 */}
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="w-1/3 flex flex-col items-center order-2 md:order-1"
            >
              <div className="glass-card p-2 md:p-4 rounded-xl border border-black/10 mb-2 md:mb-4 w-full flex flex-col items-center">
                <div className="w-10 h-10 md:w-16 md:h-16 rounded-full bg-black/10 mb-1 md:mb-2 flex items-center justify-center text-sm md:text-xl font-bold">AK</div>
                <h3 className="font-bold text-xs md:text-base text-center truncate w-full px-1">Arjun K</h3>
                <p className="text-[10px] md:text-sm text-muted-foreground">1,120 credits</p>
              </div>
              <div className="w-full h-24 md:h-40 bg-black/5 border border-black/10 rounded-t-xl flex items-start justify-center pt-2 md:pt-4">
                <span className="text-2xl md:text-4xl font-black text-black/20">2</span>
              </div>
            </motion.div>

            {/* Rank 1 */}
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-1/3 flex flex-col items-center order-1 md:order-2"
            >
              <Trophy className="h-8 w-8 md:h-12 md:w-12 text-warning mb-2 md:mb-4" />
              <div className="glass-card p-2 md:p-4 rounded-xl border border-warning/50 mb-2 md:mb-4 w-full flex flex-col items-center shadow-[0_0_30px_rgba(245,158,11,0.15)] relative overflow-hidden">
                <div className="absolute inset-0 bg-warning/10 z-0"></div>
                <div className="relative z-10 flex flex-col items-center w-full">
                  <div className="w-12 h-12 md:w-20 md:h-20 rounded-full bg-black/10 mb-1 md:mb-2 flex items-center justify-center text-base md:text-2xl font-bold border-2 border-warning">SM</div>
                  <h3 className="font-bold text-xs md:text-lg text-center truncate w-full px-1">Siva Mathesh</h3>
                  <p className="text-[10px] md:text-sm text-warning font-bold">1,250 credits</p>
                </div>
              </div>
              <div className="w-full h-32 md:h-56 bg-warning/10 border border-warning/20 rounded-t-xl flex items-start justify-center pt-2 md:pt-4 backdrop-blur-sm">
                <span className="text-3xl md:text-5xl font-black text-warning/30">1</span>
              </div>
            </motion.div>

            {/* Rank 3 */}
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="w-1/3 flex flex-col items-center order-3"
            >
              <div className="glass-card p-2 md:p-4 rounded-xl border border-black/10 mb-2 md:mb-4 w-full flex flex-col items-center">
                <div className="w-10 h-10 md:w-16 md:h-16 rounded-full bg-black/10 mb-1 md:mb-2 flex items-center justify-center text-sm md:text-xl font-bold">PS</div>
                <h3 className="font-bold text-xs md:text-base text-center truncate w-full px-1">Priya S</h3>
                <p className="text-[10px] md:text-sm text-muted-foreground">1,080 credits</p>
              </div>
              <div className="w-full h-20 md:h-32 bg-black/5 border border-black/10 rounded-t-xl flex items-start justify-center pt-2 md:pt-4">
                <span className="text-2xl md:text-4xl font-black text-black/20">3</span>
              </div>
            </motion.div>
        </div>

        {/* Full Table */}
        <div className="glass-card rounded-2xl overflow-x-auto border border-black/10">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black/5 border-b border-black/10">
                <th className="p-4 font-semibold text-muted-foreground">Rank</th>
                <th className="p-4 font-semibold text-muted-foreground">Student</th>
                <th className="p-4 font-semibold text-muted-foreground">Year/Sec</th>
                <th className="p-4 font-semibold text-muted-foreground text-right">Credits</th>
              </tr>
            </thead>
            <tbody>
              {[4, 5, 6, 7, 8, 9, 10].map((rank, i) => (
                <motion.tr 
                  key={rank}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="border-b border-black/5 hover:bg-black/5 transition-colors"
                >
                  <td className="p-4 font-bold text-muted-foreground">#{rank}</td>
                  <td className="p-4 font-semibold flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-black/10 flex items-center justify-center text-xs">U</div>
                    Student Name {rank}
                  </td>
                  <td className="p-4 text-muted-foreground">III / A</td>
                  <td className="p-4 font-bold text-primary text-right">{1000 - (rank * 25)}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

      </section>
    </div>
  );
}
