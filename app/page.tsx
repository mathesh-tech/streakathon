"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import { 
  ArrowRight, Trophy, Users, Award, Calendar, TerminalSquare, Rocket, Sparkles, CheckCircle2, 
  MapPin, Clock, Star, Medal, Zap, LayoutDashboard, FileText, BarChart
} from "lucide-react";

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
    <div className="flex flex-col min-h-screen w-full overflow-hidden">
      {/* HERO SECTION */}
      <section className="relative w-full min-h-[90vh] flex flex-col items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 z-0 bg-background overflow-hidden">
          <div className="absolute top-[20%] left-[10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-[10%] right-[10%] w-[400px] h-[400px] bg-secondary/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: "2s" }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-accent/15 rounded-full blur-[150px]" />
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay"></div>
        </div>

        <div className="container relative z-10 max-w-screen-xl px-4 md:px-6 flex flex-col items-center">
          <motion.div 
            className="flex flex-col items-center text-center space-y-6 w-full max-w-4xl"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants} className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary backdrop-blur-sm shadow-sm">
              <Sparkles className="mr-2 h-4 w-4" />
              <span>Sona IT Department's Innovation Ecosystem</span>
            </motion.div>
            
            <motion.h1 variants={itemVariants} className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter text-foreground uppercase leading-[0.9]">
              STREAKATHON<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-secondary text-3xl md:text-4xl lg:text-5xl tracking-normal mt-6 block normal-case font-bold">
                "Turning ideas into reality, one hackathon at a time."
              </span>
            </motion.h1>
            
            <motion.p variants={itemVariants} className="max-w-[700px] text-lg md:text-2xl text-muted-foreground font-medium mt-6">
              Participate in department hackathons, earn credit points, maintain your innovation streak, and become the semester champion.
            </motion.p>
            
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-8 justify-center">
              <Link href="/leaderboard" className="inline-flex h-14 items-center justify-center rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm px-8 text-base font-semibold text-foreground shadow-sm transition-all hover:bg-white/10 hover:scale-[1.02] active:scale-[0.98]">
                View Leaderboard <Trophy className="ml-2 h-5 w-5 text-warning" />
              </Link>
              <Link href="/auth/login" className="inline-flex h-14 items-center justify-center rounded-lg bg-primary px-8 text-base font-semibold text-primary-foreground shadow-lg hover:shadow-primary/25 transition-all hover:scale-[1.02] active:scale-[0.98]">
                Register Now <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </motion.div>

            {/* Countdown Timer */}
            <motion.div variants={itemVariants} className="mt-16 glass-card rounded-2xl p-6 md:p-8 w-full max-w-3xl flex flex-col md:flex-row items-center justify-between gap-6 border-primary/20">
              <div className="text-left flex-1">
                <h3 className="text-lg font-bold text-foreground">Next Hackathon Registration Closes In:</h3>
                <p className="text-sm text-muted-foreground">Streakathon #15 - AI & Automation Theme</p>
              </div>
              <div className="flex gap-4">
                {[
                  { label: "Days", value: timeLeft.days },
                  { label: "Hours", value: timeLeft.hours },
                  { label: "Mins", value: timeLeft.minutes },
                  { label: "Secs", value: timeLeft.seconds }
                ].map((time, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl bg-background/80 border border-white/10 flex items-center justify-center shadow-inner">
                      <span className="text-2xl md:text-3xl font-black text-primary">{time.value.toString().padStart(2, '0')}</span>
                    </div>
                    <span className="text-xs uppercase tracking-wider text-muted-foreground mt-2 font-medium">{time.label}</span>
                  </div>
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
            
            <div className="space-y-12">
              {[
                { day: "Wednesday 9 AM", title: "Registration Opens", desc: "Browse upcoming themes and lock your spot." },
                { day: "Friday 12 PM", title: "Registration Closes", desc: "Finalize teams before the strict deadline." },
                { day: "Saturday 10 AM", title: "Problem Statement", desc: "The challenge is unlocked. Start hacking." },
                { day: "Saturday 10 PM", title: "Submission", desc: "Submit your solution and code repository." },
                { day: "Sunday", title: "Evaluation & Credits", desc: "Leaderboard refreshes and streaks are updated." },
              ].map((step, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
                  className={`flex flex-col md:flex-row gap-8 items-start md:items-center ${i % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
                >
                  <div className="flex-1 w-full flex flex-col md:items-end md:text-right">
                    {i % 2 === 0 ? (
                      <div className="glass-card p-6 rounded-2xl w-full md:w-4/5 text-left md:text-right hover:border-primary/50 transition-colors">
                        <div className="text-primary font-bold mb-1 tracking-wider text-sm uppercase">{step.day}</div>
                        <h3 className="text-xl font-bold text-foreground mb-2">{step.title}</h3>
                        <p className="text-muted-foreground">{step.desc}</p>
                      </div>
                    ) : (
                      <div className="hidden md:block flex-1" />
                    )}
                  </div>

                  <div className="hidden md:flex relative z-10 w-12 h-12 rounded-full glass border border-primary items-center justify-center bg-background shrink-0 shadow-[0_0_15px_rgba(49,46,129,0.5)]">
                    <div className="w-3 h-3 bg-primary rounded-full" />
                  </div>

                  <div className="flex-1 w-full">
                    {i % 2 !== 0 ? (
                      <div className="glass-card p-6 rounded-2xl w-full md:w-4/5 hover:border-primary/50 transition-colors">
                        <div className="text-primary font-bold mb-1 tracking-wider text-sm uppercase">{step.day}</div>
                        <h3 className="text-xl font-bold text-foreground mb-2">{step.title}</h3>
                        <p className="text-muted-foreground">{step.desc}</p>
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
