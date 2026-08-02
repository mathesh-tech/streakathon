"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight, Trophy, Users, Award, Calendar, TerminalSquare, Rocket, Sparkles, CheckCircle2,
  MapPin, Clock, Star, Medal, Zap, LayoutDashboard, FileText, BarChart
} from "lucide-react";

import Countdown from "@/components/landing/Countdown";
import MagneticButton from "@/components/landing/MagneticButton";

export default function LandingPage() {
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
    <div className="flex flex-col min-h-screen w-full overflow-x-hidden bg-gradient-to-b from-[#1F3F6E] via-[#18375F] to-[#132D4F]">
      <section 
        className="relative w-full min-h-[95vh] flex flex-col items-center justify-center overflow-hidden pt-16 pb-12"
      >
        <div className="container relative z-10 max-w-screen-md mx-auto px-4 md:px-6 w-full flex flex-col items-center text-center mt-12 md:mt-16">
          
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center w-full space-y-8 md:space-y-10"
          >
            {/* Title and Subtitle Container */}
            <div className="flex flex-col items-center space-y-4">
              {/* Main Title */}
              <motion.h1
                variants={itemVariants}
                className="text-[11vw] leading-none sm:text-6xl md:text-7xl lg:text-[6rem] font-black italic tracking-tighter uppercase drop-shadow-2xl flex flex-nowrap justify-center items-center"
                style={{ fontFamily: "var(--font-orbitron), sans-serif", transform: "skewX(-8deg)" }}
              >
                <span className="text-white">STREAK</span><span className="text-[#F4B400]">ATHON</span>
              </motion.h1>

              {/* Department Text */}
              <motion.h2
                variants={itemVariants}
                className="text-[9px] sm:text-sm md:text-base font-bold tracking-[0.2em] text-[#D6DCE6] uppercase mt-2"
              >
                Department of Information Technology
              </motion.h2>
            </div>

            {/* Quote */}
            <motion.p
              variants={itemVariants}
              className="text-3xl sm:text-4xl md:text-5xl text-[#F4B400] max-w-2xl leading-snug py-2"
              style={{ fontFamily: "var(--font-caveat), cursive" }}
            >
              "Empowering minds to innovate, build, and lead the future."
            </motion.p>

            {/* Action CTA Buttons */}
            <motion.div 
              variants={itemVariants} 
              className="flex flex-col sm:flex-row w-full max-w-2xl gap-4 pt-4 z-20 mx-auto justify-center"
            >
              <MagneticButton 
                href="/leaderboard"
                glowColor="rgba(63, 111, 181, 0.4)"
                className="flex h-14 w-full items-center justify-center rounded-xl bg-[rgba(255,255,255,0.06)] border border-[#3F6FB5] backdrop-blur-[20px] px-6 text-lg font-bold text-white shadow-lg hover:bg-[rgba(63,111,181,0.2)] hover:shadow-[0_0_20px_rgba(63,111,181,0.4)] transition-all"
              >
                View Leaderboard <span className="ml-3 text-xl">🏆</span>
              </MagneticButton>

              <MagneticButton 
                href="/auth/login"
                glowColor="rgba(244, 180, 0, 0.4)"
                className="flex h-14 w-full items-center justify-center rounded-xl bg-[#F4B400] px-6 text-lg font-bold text-[#1F3F6E] shadow-[0_0_15px_rgba(244,180,0,0.3)] hover:bg-[#FFD54F] hover:shadow-[0_0_25px_rgba(255,213,79,0.5)] transition-all"
              >
                Register Now <ArrowRight className="ml-3 h-5 w-5" />
              </MagneticButton>
            </motion.div>

            {/* Countdown Component */}
            <motion.div 
              variants={itemVariants}
              className="w-full flex justify-center pt-6 z-20"
            >
              <Countdown />
            </motion.div>

          </motion.div>
        </div>
      </section>




      {/* HOW IT WORKS TIMELINE */}
      <section className="w-full py-24 bg-[#214472] relative z-10">
        <div className="container max-w-screen-xl px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-white">How It Works</h2>
            <p className="text-[#AAB6C5] max-w-[600px] mx-auto text-lg">Your weekly path from registration to glory.</p>
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

                  <div className="hidden md:flex relative z-10 w-8 h-8 md:w-12 md:h-12 rounded-full glass border border-primary items-center justify-center bg-background shrink-0 shadow-[0_0_15px_rgba(244,180,0,0.4)]">
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
