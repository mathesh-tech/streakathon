"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useAnimationFrame } from "framer-motion";
import { Trophy, ArrowRight, AlertTriangle, Play, Flame } from "lucide-react";
import Link from "next/link";
import confetti from "canvas-confetti";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function Countdown() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [difference, setDifference] = useState<number>(1); // starts > 0
  const [isMounted, setIsMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Setup target time (next Friday at 12:00 PM)
  useEffect(() => {
    setIsMounted(true);
    const target = new Date();
    target.setDate(target.getDate() + ((5 + 7 - target.getDay()) % 7 || 7));
    target.setHours(12, 0, 0, 0);

    const interval = setInterval(() => {
      const now = new Date();
      const diff = target.getTime() - now.getTime();
      setDifference(diff);

      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / 1000 / 60) % 60),
          seconds: Math.floor((diff / 1000) % 60)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Determine urgency state
  const totalHours = timeLeft.days * 24 + timeLeft.hours;
  const isCompleted = difference <= 0;
  
  let urgency: "normal" | "medium" | "high" | "critical" = "normal";
  if (isCompleted) {
    // completed
  } else if (timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes < 60) {
    urgency = "critical";
  } else if (timeLeft.days === 0 && timeLeft.hours < 24) {
    urgency = "high";
  } else if (timeLeft.days < 3) {
    urgency = "medium";
  }

  // Handle explosion and confetti on completion
  const explodedRef = useRef(false);
  useEffect(() => {
    if (isCompleted && isMounted && !explodedRef.current) {
      explodedRef.current = true;
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 }
      });
    }
  }, [isCompleted, isMounted]);

  if (!isMounted) return null;

  // Colors and glow configurations based on urgency
  const getUrgencyStyles = () => {
    switch (urgency) {
      case "critical":
        return {
          glowColor: "rgba(239, 68, 68, 0.4)",
          borderColor: "border-red-500/50",
          textColor: "from-red-400 to-rose-600",
          pulseSpeed: 1.2,
          pulseScale: [1, 1.03, 1],
          badgeBg: "bg-red-500/20 text-red-400 border-red-500/30"
        };
      case "high":
        return {
          glowColor: "rgba(249, 115, 22, 0.3)",
          borderColor: "border-orange-500/40",
          textColor: "from-orange-400 to-amber-500",
          pulseSpeed: 1.6,
          pulseScale: [1, 1.015, 1],
          badgeBg: "bg-orange-500/20 text-orange-400 border-orange-500/30"
        };
      case "medium":
        return {
          glowColor: "rgba(56, 189, 248, 0.25)",
          borderColor: "border-sky-500/35",
          textColor: "from-sky-400 to-blue-500",
          pulseSpeed: 2.2,
          pulseScale: [1, 1.01, 1],
          badgeBg: "bg-sky-500/20 text-sky-400 border-sky-500/30"
        };
      default:
        return {
          glowColor: "rgba(148, 163, 184, 0.15)",
          borderColor: "border-slate-500/25",
          textColor: "from-slate-200 to-slate-400",
          pulseSpeed: 3,
          pulseScale: [1],
          badgeBg: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
        };
    }
  };

  const style = getUrgencyStyles();

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`relative w-full max-w-6xl rounded-[24px] border ${style.borderColor} bg-[#0c1827]/60 backdrop-blur-xl p-8 md:p-12 overflow-hidden shadow-2xl transition-all duration-500`}
      style={{
        boxShadow: `0 0 50px -10px ${style.glowColor}`
      }}
    >
      {/* BACKGROUND MESH GRADIENT */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{
            x: [0, 40, -20, 0],
            y: [0, -30, 20, 0],
            scale: [1, 1.2, 0.9, 1]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-[20%] -left-[10%] w-[600px] h-[600px] bg-slate-900/60 rounded-full blur-[140px]"
        />
        <motion.div
          animate={{
            x: [0, -50, 30, 0],
            y: [0, 40, -30, 0],
            scale: [1, 1.15, 0.85, 1]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute -bottom-[20%] -right-[10%] w-[500px] h-[500px] bg-sky-950/40 rounded-full blur-[120px]"
        />
        {/* Particle Overlay */}
        <Particles />
      </div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* LEFT SIDE: HACKATHON DETAILS */}
        <div className="lg:col-span-5 flex flex-col space-y-6">
          <div className="flex items-center gap-3">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
            </span>
            <span className={`px-2.5 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${style.badgeBg}`}>
              {isCompleted ? "Closed" : "LIVE"}
            </span>
          </div>

          <div>
            <h4 className="text-sm font-semibold tracking-widest text-primary uppercase mb-2">
              🚀 Next Hackathon Registration
            </h4>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight text-white mb-4">
              {isCompleted ? "Registration Closed" : "Registration Closes In"}
            </h2>
            <div className="h-[2px] w-24 bg-gradient-to-r from-primary to-transparent" />
          </div>

          <div className="space-y-3 text-sm text-slate-300">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-100">Event:</span>
              <span>Streakathon #15</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-100">Theme:</span>
              <span>AI & Automation</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-100">Venue:</span>
              <span>IT Dept Lab 3 & 4</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-100">Status:</span>
              <span className="text-emerald-400 font-bold">{isCompleted ? "Closed" : "Active & Accepting Teams"}</span>
            </div>
          </div>
          
        </div>

        {/* RIGHT SIDE: THE COUNTDOWN CARDS */}
        <div className="lg:col-span-7 flex justify-center items-center">
          {isCompleted ? (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center py-12"
            >
              <h3 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-primary to-yellow-500 drop-shadow-[0_0_20px_rgba(250,204,21,0.3)] mb-4">
                🎉 Registration Closed
              </h3>
              <p className="text-slate-400 max-w-md mx-auto">
                Teams have been locked. Stay tuned for the release of problem statements on Saturday morning!
              </p>
            </motion.div>
          ) : (
            <motion.div 
              animate={{ scale: urgency !== "normal" ? style.pulseScale : 1 }}
              transition={{ repeat: Infinity, duration: style.pulseSpeed, ease: "easeInOut" }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full"
            >
              <CountdownCard label="Days" value={timeLeft.days} urgency={urgency} />
              <CountdownCard label="Hours" value={timeLeft.hours} urgency={urgency} />
              <CountdownCard label="Minutes" value={timeLeft.minutes} urgency={urgency} />
              <CountdownCard label="Seconds" value={timeLeft.seconds} urgency={urgency} showRing />
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// Spark Particle component for seconds card
function SparkleEffect() {
  const sparks = Array.from({ length: 8 });
  return (
    <div className="absolute inset-0 pointer-events-none">
      {sparks.map((_, i) => (
        <motion.div
          key={i}
          animate={{
            scale: [0, 1, 0],
            x: [0, (Math.random() - 0.5) * 80],
            y: [0, (Math.random() - 0.5) * 80],
            opacity: [0, 0.8, 0]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: Math.random() * i * 0.2
          }}
          className="absolute left-1/2 top-1/2 w-1.5 h-1.5 rounded-full bg-amber-400"
          style={{ transform: "translate(-50%, -50%)" }}
        />
      ))}
    </div>
  );
}

interface CardProps {
  label: string;
  value: number;
  urgency: string;
  showRing?: boolean;
}

function CountdownCard({ label, value, urgency, showRing = false }: CardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const box = cardRef.current.getBoundingClientRect();
    const x = e.clientX - box.left - box.width / 2;
    const y = e.clientY - box.top - box.height / 2;
    setRotateX(-y / 8);
    setRotateY(x / 8);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  const digit1 = Math.floor(value / 10);
  const digit2 = value % 10;

  // Ring offset calculations for seconds card
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (value / 60) * circumference;

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d"
      }}
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`relative flex flex-col items-center justify-center p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shadow-2xl cursor-default overflow-hidden group select-none`}
    >
      {/* Background soft glow */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Interactive Ripple Ring */}
      {showRing && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20 group-hover:opacity-40 transition-opacity duration-300">
          <svg className="w-full h-full transform -rotate-90 scale-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r={radius}
              className="stroke-slate-700 fill-none"
              strokeWidth="2"
            />
            <motion.circle
              cx="50"
              cy="50"
              r={radius}
              className="stroke-amber-500 fill-none"
              strokeWidth="2"
              strokeDasharray={circumference}
              animate={{ strokeDashoffset }}
              transition={{ ease: "linear", duration: 1 }}
            />
          </svg>
        </div>
      )}

      {/* Sparkles for the seconds card */}
      {showRing && <SparkleEffect />}

      {/* Heartbeat alert for critical states */}
      {urgency === "critical" && (
        <motion.div
          animate={{ scale: [1, 1.4, 1], opacity: [0.1, 0.4, 0.1] }}
          transition={{ repeat: Infinity, duration: 1, ease: "easeInOut" }}
          className="absolute inset-0 bg-red-500/10 rounded-2xl pointer-events-none"
        />
      )}

      {/* FLIP CLOCK NUMBER */}
      <div className="flex gap-1.5 justify-center items-center py-2 relative z-10">
        <Digit value={digit1} />
        <Digit value={digit2} />
      </div>

      <span className="text-[10px] md:text-xs font-semibold uppercase tracking-widest text-slate-400 group-hover:text-primary transition-colors duration-300 mt-4">
        {label}
      </span>
    </motion.div>
  );
}

function Digit({ value }: { value: number }) {
  return (
    <div 
      className="relative w-[34px] h-[56px] sm:w-[42px] sm:h-[68px] md:w-[48px] md:h-[78px] bg-slate-950/70 border border-white/5 rounded-xl overflow-hidden flex items-center justify-center shadow-inner"
      style={{ perspective: "400px" }}
    >
      <AnimatePresence mode="popLayout">
        <motion.span
          key={value}
          initial={{ rotateX: 90, opacity: 0 }}
          animate={{ rotateX: 0, opacity: 1 }}
          exit={{ rotateX: -90, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
          style={{ transformOrigin: "center", backfaceVisibility: "hidden" }}
          className="absolute inset-0 flex items-center justify-center font-extrabold text-[32px] sm:text-[40px] md:text-[48px] bg-gradient-to-b from-amber-200 via-primary to-orange-500 bg-clip-text text-transparent drop-shadow-[0_2px_8px_rgba(245,158,11,0.35)]"
        >
          {value}
        </motion.span>
      </AnimatePresence>
      <div className="absolute left-0 right-0 top-1/2 h-[1px] bg-black/40 z-10" />
    </div>
  );
}

// Drift floating particles
function Particles() {
  const particles = Array.from({ length: 15 });
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      {particles.map((_, i) => (
        <motion.div
          key={i}
          animate={{
            x: [0, (Math.random() - 0.5) * 200, (Math.random() - 0.5) * 200, 0],
            y: [0, (Math.random() - 0.5) * 200, (Math.random() - 0.5) * 200, 0],
            scale: [1, 1.2, 0.8, 1],
            opacity: [0.1, 0.2, 0.05, 0.1]
          }}
          transition={{
            duration: 15 + Math.random() * 15,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 5
          }}
          className="absolute rounded-full bg-sky-400/20 blur-[2px]"
          style={{
            width: `${Math.random() * 8 + 4}px`,
            height: `${Math.random() * 8 + 4}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`
          }}
        />
      ))}
    </div>
  );
}
