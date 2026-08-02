"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  ArrowRight, Trophy, Users, Award, Calendar, TerminalSquare, Rocket, Sparkles, CheckCircle2,
  MapPin, Clock, Star, Medal, Zap, LayoutDashboard, FileText, BarChart
} from "lucide-react";

import Countdown from "@/components/landing/Countdown";
import Hero3DBackground from "@/components/landing/Hero3DBackground";
import MagneticButton from "@/components/landing/MagneticButton";

export default function LandingPage() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 2;
    const y = (e.clientY / window.innerHeight - 0.5) * 2;
    setMousePos({ x, y });
  };



  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <div className="flex flex-col min-h-screen w-full overflow-x-hidden">
      <section 
        onMouseMove={handleMouseMove}
        className="relative w-full min-h-[90vh] flex flex-col items-center justify-center overflow-hidden pt-20"
      >
        <Hero3DBackground />

        <div className="container relative z-10 max-w-screen-xl px-4 md:px-6 w-full pt-12 md:pt-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center w-full min-h-[75vh]">
            
            {/* LEFT COLUMN: TEXT DETAILS & HERO ACTIONS */}
            <motion.div
              className="lg:col-span-7 flex flex-col items-start text-left space-y-6 w-full"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <div className="flex flex-col space-y-3">
                {/* Tech capsule badge */}
                <motion.div 
                  variants={itemVariants}
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-sky-500/25 bg-sky-950/20 text-[10px] font-bold text-sky-400 uppercase tracking-widest w-fit"
                >
                  <span>&lt;/&gt;</span> INNOVATE • BUILD • COMPETE • LEAD
                </motion.div>

                {/* Main Heading */}
                <motion.h1
                  variants={itemVariants}
                  className="text-4xl sm:text-5xl xl:text-6xl font-black italic tracking-tight leading-tight uppercase text-white text-left break-words"
                >
                  INNOVATE <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-500 drop-shadow-[0_0_20px_rgba(56,189,248,0.35)]">TODAY</span><br />
                  IMPACT <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-primary to-yellow-500 drop-shadow-[0_0_20px_rgba(250,204,21,0.35)]">TOMORROW</span>
                </motion.h1>
              </div>

              {/* Subtitle description */}
              <motion.p 
                variants={itemVariants} 
                className="text-sm sm:text-base text-slate-300 leading-relaxed font-medium max-w-lg mt-2 text-left"
              >
                Streakathon is the annual flagship hackathon of the Department of Information Technology.
                Where ideas spark, innovations happen, and futures are built.
              </motion.p>

              {/* Action CTA Buttons */}
              <motion.div variants={itemVariants} className="flex flex-row gap-4 items-center pt-2 z-20">
                <MagneticButton 
                  href="/auth/login"
                  glowColor="rgba(250, 204, 21, 0.45)"
                  className="inline-flex h-12 items-center justify-center rounded-xl bg-primary px-6 text-sm font-bold text-primary-foreground shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  Register Now <ArrowRight className="ml-2 h-4 w-4" />
                </MagneticButton>
                
                <MagneticButton 
                  href="/leaderboard"
                  glowColor="rgba(56, 189, 248, 0.35)"
                  className="inline-flex h-12 items-center justify-center rounded-xl border border-white/10 bg-white/5 backdrop-blur-md px-6 text-sm font-bold text-slate-300 hover:text-white"
                >
                  View Leaderboard <Trophy className="ml-2 h-4 w-4" />
                </MagneticButton>
              </motion.div>


            </motion.div>

            {/* RIGHT COLUMN: COUNTDOWN COMPACT CONTAINER */}
            <div className="lg:col-span-5 w-full flex justify-center lg:justify-end z-20">
              <Countdown />
            </div>

          </div>
        </div>
      </section>




      {/* HOW IT WORKS TIMELINE */}
      <section className="w-full py-24 bg-background">
        <div className="container max-w-screen-xl px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">How It Works</h2>
            <p className="text-muted-foreground max-w-[600px] mx-auto text-lg">Your weekly path from registration to glory.</p>
          </div>

          <div className="relative max-w-4xl mx-auto">
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary/0 via-primary/50 to-primary/0 md:-translate-x-1/2 hidden md:block" />

            <div className="space-y-3 md:space-y-4">
              {[
                { day: "Wednesday", title: "Registration Opens", desc: "Registrations for the upcoming Saturday hackathon begin for 2nd and 3rd year students." },
                { day: "Friday 5:00 PM", title: "Registration Closes", desc: "Finalize your teams. No late registrations will be accepted." },
                { day: "Saturday Morning", title: "Problem Statements Released", desc: "Admins release specific problem statements for 2nd and 3rd years. Start hacking!" },
                { day: "Saturday Evening", title: "Submission", desc: "Submit your solution and code repository before the deadline." },
                { day: "Sunday", title: "Evaluation & Credits", desc: "Hackathon Ambassadors & Admins evaluate submissions and update the leaderboard." },
              ].map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
                  className="flex flex-col md:flex-row gap-4 md:gap-8 items-start md:items-center"
                >
                  <div className="flex-1 w-full flex flex-col md:items-end">
                    {i % 2 === 0 ? (
                      <div className="glass-card p-4 md:p-6 rounded-xl md:rounded-2xl w-full md:w-4/5 text-left md:text-right hover:border-primary/50 transition-colors">
                        <div className="text-primary font-bold mb-1 tracking-wider text-xs md:text-sm uppercase">{step.day}</div>
                        <h3 className="text-lg md:text-xl font-bold text-foreground mb-1 md:mb-2">{step.title}</h3>
                        <p className="text-sm md:text-base text-muted-foreground">{step.desc}</p>
                      </div>
                    ) : (
                      <div className="hidden md:block flex-1" />
                    )}
                  </div>

                  <div className="hidden md:flex relative z-10 w-8 h-8 md:w-12 md:h-12 rounded-full glass border border-primary items-center justify-center bg-background shrink-0 shadow-[0_0_15px_rgba(250,204,21,0.5)]">
                    <div className="w-2 h-2 md:w-3 md:h-3 bg-primary rounded-full" />
                  </div>

                  <div className="flex-1 w-full">
                    {i % 2 !== 0 ? (
                      <div className="glass-card p-4 md:p-6 rounded-xl md:rounded-2xl w-full md:w-4/5 hover:border-primary/50 transition-colors">
                        <div className="text-primary font-bold mb-1 tracking-wider text-xs md:text-sm uppercase">{step.day}</div>
                        <h3 className="text-lg md:text-xl font-bold text-foreground mb-1 md:mb-2">{step.title}</h3>
                        <p className="text-sm md:text-base text-muted-foreground">{step.desc}</p>
                      </div>
                    ) : (
                      <div className="hidden md:block flex-1" />
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>




    </div>
  );
}
