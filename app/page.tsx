"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  ArrowRight, Trophy, Users, Award, Calendar, TerminalSquare, Rocket, Sparkles, CheckCircle2,
  MapPin, Clock, Star, Medal, Zap, LayoutDashboard, FileText, BarChart
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Add specific types or leave implicit depending on context, using 'any' sparingly.

export default function LandingPage() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    // Mock Countdown to next Friday
    const target = new Date();
    target.setDate(target.getDate() + ((5 + 7 - target.getDay()) % 7 || 7));
    target.setHours(12, 0, 0, 0);

    const interval = setInterval(() => {
      const now = new Date();
      const difference = target.getTime() - now.getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

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
      {/* HERO SECTION */}
      <section className="relative w-full min-h-[90vh] flex flex-col items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 z-0 bg-background overflow-hidden">
          <motion.div
            animate={{ y: [0, -40, 0], scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
            transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
            className="absolute top-[20%] left-[10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px]"
          />
          <motion.div
            animate={{ y: [0, 30, 0], scale: [1, 1.2, 1], rotate: [0, -10, 10, 0] }}
            transition={{ repeat: Infinity, duration: 10, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-[10%] right-[10%] w-[400px] h-[400px] bg-secondary/30 rounded-full blur-[100px]"
          />
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay"></div>
        </div>

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
              style={{ fontFamily: 'var(--font-orbitron), sans-serif' }}
              className="text-2xl min-[360px]:text-3xl sm:text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-black italic tracking-widest uppercase leading-[1.1] md:leading-[0.9] drop-shadow-[0_0_25px_rgba(250,204,21,0.4)] break-words"
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

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-8 justify-center">
              <Link href="/leaderboard">
                <Button variant="outline" size="lg" className="h-14 px-8 text-base shadow-sm">
                  View Leaderboard <Trophy className="ml-2 h-5 w-5 text-warning" />
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button size="lg" className="h-14 px-8 text-base shadow-lg hover:shadow-primary/25">
                  Register Now <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </motion.div>

            {/* Countdown Timer */}
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -5, boxShadow: "0 20px 40px -10px rgba(0,0,0,0.1)" }}
              className="mt-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 w-full max-w-3xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl transition-all"
            >
              <div className="text-left flex-1">
                <motion.h3
                  className="text-lg font-bold text-slate-900 dark:text-white"
                >
                  Next Hackathon Registration Closes In:
                </motion.h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Streakathon #15 - AI & Automation Theme</p>
              </div>
              <div className="flex gap-4">
                {[
                  { label: "Days", value: timeLeft.days },
                  { label: "Hours", value: timeLeft.hours },
                  { label: "Mins", value: timeLeft.minutes },
                  { label: "Secs", value: timeLeft.seconds }
                ].map((time, i) => (
                  <motion.div
                    key={i}
                    className="flex flex-col items-center"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.5 + (i * 0.1), type: "spring" }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="w-14 h-14 md:w-16 md:h-16 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shadow-inner cursor-pointer"
                    >
                      <span className="text-xl md:text-2xl font-bold text-primary">{time.value.toString().padStart(2, '0')}</span>
                    </motion.div>
                    <span className="text-[10px] md:text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-2 font-semibold">{time.label}</span>
                  </motion.div>
                ))}
              </div>
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
                      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm p-4 md:p-6 rounded-xl md:rounded-2xl w-full md:w-4/5 text-left md:text-right hover:shadow-md transition-shadow">
                        <div className="text-primary font-bold mb-1 tracking-wider text-xs md:text-sm uppercase">{step.day}</div>
                        <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mb-1 md:mb-2">{step.title}</h3>
                        <p className="text-sm md:text-base text-slate-500 dark:text-slate-400">{step.desc}</p>
                      </div>
                    ) : (
                      <div className="hidden md:block flex-1" />
                    )}
                  </div>

                  <div className="hidden md:flex relative z-10 w-8 h-8 md:w-12 md:h-12 rounded-full border border-primary/30 items-center justify-center bg-white dark:bg-slate-900 shrink-0 shadow-sm">
                    <div className="w-2 h-2 md:w-3 md:h-3 bg-primary rounded-full" />
                  </div>

                  <div className="flex-1 w-full">
                    {i % 2 !== 0 ? (
                      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm p-4 md:p-6 rounded-xl md:rounded-2xl w-full md:w-4/5 text-left hover:shadow-md transition-shadow">
                        <div className="text-primary font-bold mb-1 tracking-wider text-xs md:text-sm uppercase">{step.day}</div>
                        <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mb-1 md:mb-2">{step.title}</h3>
                        <p className="text-sm md:text-base text-slate-500 dark:text-slate-400">{step.desc}</p>
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
