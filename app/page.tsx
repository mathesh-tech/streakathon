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

        <div className="container relative z-10 max-w-screen-xl px-4 md:px-6 flex flex-col items-center">
          <motion.div
            className="flex flex-col items-center text-center space-y-6 w-full max-w-4xl"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >


            <motion.h1
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
              animate={{
                x: mousePos.x * 12,
                y: mousePos.y * 12,
              }}
              style={{ 
                fontFamily: 'var(--font-orbitron), sans-serif',
                textShadow: `0 0 ${20 + Math.abs(mousePos.x) * 15}px rgba(250,204,21,${0.35 + Math.abs(mousePos.y) * 0.25})`
              }}
              className="text-2xl min-[360px]:text-3xl sm:text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-black italic tracking-widest uppercase leading-[1.1] md:leading-[0.9] break-words transition-shadow duration-300"
            >
              <span className="text-white">STREAK</span><span className="text-primary">ATHON</span>
            </motion.h1>

            <motion.p variants={itemVariants} className="max-w-[700px] text-xs sm:text-sm md:text-lg text-muted-foreground font-bold mt-6 tracking-widest uppercase text-center">
              DEPARTMENT OF INFORMATION TECHNOLOGY
            </motion.p>

            <motion.p 
              variants={itemVariants} 
              style={{ fontFamily: 'var(--font-caveat), cursive' }}
              className="max-w-[900px] text-2xl sm:text-3xl md:text-5xl lg:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-primary to-yellow-500 mt-4 drop-shadow-[0_2px_15px_rgba(250,204,21,0.3)] px-4 leading-tight text-center"
            >
              "Empowering minds to innovate, build, and lead the future."
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto mt-8 justify-center items-center z-20">
              <MagneticButton 
                href="/leaderboard"
                glowColor="rgba(56, 189, 248, 0.35)"
                className="inline-flex h-14 items-center justify-center rounded-xl border border-white/10 bg-white/5 backdrop-blur-md px-8 text-base font-semibold text-slate-300 hover:text-white"
              >
                View Leaderboard <Trophy className="ml-2 h-5 w-5 text-warning" />
              </MagneticButton>
              <MagneticButton 
                href="/auth/login"
                glowColor="rgba(250, 204, 21, 0.45)"
                className="inline-flex h-14 items-center justify-center rounded-xl bg-primary px-8 text-base font-semibold text-primary-foreground shadow-lg"
              >
                Register Now <ArrowRight className="ml-2 h-5 w-5" />
              </MagneticButton>
            </motion.div>

            {/* Countdown Timer */}
            <motion.div variants={itemVariants} className="w-full max-w-6xl mt-16">
              <Countdown />
            </motion.div>
          </motion.div>
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
