"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, ArrowRight, Calendar, MapPin, Users } from "lucide-react";
import confetti from "canvas-confetti";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function Countdown() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [difference, setDifference] = useState<number>(1);
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
      initial={{ opacity: 0, scale: 0.9, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`relative w-full max-w-md rounded-[24px] border ${style.borderColor} bg-[#08121e]/80 backdrop-blur-xl p-6 sm:p-8 overflow-hidden shadow-2xl transition-all duration-500`}
      style={{
        boxShadow: `0 0 50px -15px ${style.glowColor}`
      }}
    >
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <Particles />
      </div>

      <div className="relative z-10 flex flex-col space-y-6">
        {/* HEADER */}
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="flex items-center gap-2 text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-slate-300">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400"></span>
            </span>
            🚀 NEXT HACKATHON REGISTRATION
          </div>
          
          <div className="w-full flex items-center justify-center gap-3">
            <div className="h-[1px] flex-1 bg-white/10" />
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-primary">
              CLOSES IN
            </span>
            <div className="h-[1px] flex-1 bg-white/10" />
          </div>
        </div>

        {/* TIMER CARDS */}
        {isCompleted ? (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center py-6"
          >
            <h3 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-primary to-yellow-500 drop-shadow-[0_0_20px_rgba(250,204,21,0.3)] mb-2">
              🎉 Registration Closed
            </h3>
            <p className="text-slate-400 text-xs">
              Teams have been locked. Stay tuned for Saturday morning release!
            </p>
          </motion.div>
        ) : (
          <motion.div 
            animate={{ scale: urgency !== "normal" ? style.pulseScale : 1 }}
            transition={{ repeat: Infinity, duration: style.pulseSpeed, ease: "easeInOut" }}
            className="grid grid-cols-4 gap-3 w-full"
          >
            <CountdownCard label="DAYS" value={timeLeft.days} urgency={urgency} />
            <CountdownCard label="HOURS" value={timeLeft.hours} urgency={urgency} />
            <CountdownCard label="MINS" value={timeLeft.minutes} urgency={urgency} />
            <CountdownCard label="SECS" value={timeLeft.seconds} urgency={urgency} showRing />
          </motion.div>
        )}

        {/* PROGRESS LINE */}
        {!isCompleted && (
          <div className="space-y-3 pt-2">
            <div className="w-full bg-slate-900/60 border border-white/5 h-1.5 rounded-full relative overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "72%" }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-amber-400 via-primary to-yellow-500 rounded-full shadow-[0_0_12px_rgba(245,158,11,0.5)]"
              />
            </div>
            <p className="text-center text-xs italic font-medium text-slate-400">
              Be part of something extraordinary!
            </p>
          </div>
        )}

        {/* BOTTOM METADATA PILLS */}
        <div className="border-t border-white/10 pt-4 flex items-center justify-between text-[9px] font-bold text-slate-400 tracking-wider">
          <div className="flex items-center gap-1 bg-white/[0.03] border border-white/5 rounded-full px-2.5 py-1">
            <Calendar className="h-3 w-3 text-primary" />
            <span>12 - 14 SEP 2026</span>
          </div>
          <div className="flex items-center gap-1 bg-white/[0.03] border border-white/5 rounded-full px-2.5 py-1">
            <MapPin className="h-3 w-3 text-primary" />
            <span>SONA CAMPUS</span>
          </div>
          <div className="flex items-center gap-1 bg-white/[0.03] border border-white/5 rounded-full px-2.5 py-1">
            <Users className="h-3 w-3 text-primary" />
            <span>300+ TEAMS</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function SparkleEffect() {
  const sparks = Array.from({ length: 6 });
  return (
    <div className="absolute inset-0 pointer-events-none">
      {sparks.map((_, i) => (
        <motion.div
          key={i}
          animate={{
            scale: [0, 1, 0],
            x: [0, (Math.random() - 0.5) * 50],
            y: [0, (Math.random() - 0.5) * 50],
            opacity: [0, 0.8, 0]
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            delay: Math.random() * i * 0.2
          }}
          className="absolute left-1/2 top-1/2 w-1 h-1 rounded-full bg-amber-400"
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
    setRotateX(-y / 6);
    setRotateY(x / 6);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  const digit1 = Math.floor(value / 10);
  const digit2 = value % 10;

  const radius = 22;
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
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`relative flex flex-col items-center justify-center p-2.5 rounded-xl bg-slate-950/40 border border-white/10 backdrop-blur-md shadow-inner cursor-default overflow-hidden group select-none`}
    >
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {showRing && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10 group-hover:opacity-20 transition-opacity duration-300">
          <svg className="w-full h-full transform -rotate-90 scale-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r={radius}
              className="stroke-slate-800 fill-none"
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

      {showRing && <SparkleEffect />}

      {urgency === "critical" && (
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.05, 0.2, 0.05] }}
          transition={{ repeat: Infinity, duration: 1, ease: "easeInOut" }}
          className="absolute inset-0 bg-red-500/10 rounded-xl pointer-events-none"
        />
      )}

      <div className="flex gap-0.5 justify-center items-center py-1 relative z-10">
        <Digit value={digit1} />
        <Digit value={digit2} />
      </div>

      <span className="text-[8px] sm:text-[9px] font-extrabold uppercase tracking-widest text-slate-500 group-hover:text-primary transition-colors duration-300 mt-2">
        {label}
      </span>
    </motion.div>
  );
}

function Digit({ value }: { value: number }) {
  return (
    <div 
      className="relative w-[18px] h-[30px] sm:w-[22px] sm:h-[36px] bg-slate-950/90 border border-white/5 rounded-lg overflow-hidden flex items-center justify-center shadow-inner"
      style={{ perspective: "200px" }}
    >
      <AnimatePresence mode="popLayout">
        <motion.span
          key={value}
          initial={{ rotateX: 90, opacity: 0 }}
          animate={{ rotateX: 0, opacity: 1 }}
          exit={{ rotateX: -90, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
          style={{ transformOrigin: "center", backfaceVisibility: "hidden" }}
          className="absolute inset-0 flex items-center justify-center font-extrabold text-[16px] sm:text-[20px] bg-gradient-to-b from-amber-200 via-primary to-orange-500 bg-clip-text text-transparent drop-shadow-[0_1.5px_4px_rgba(245,158,11,0.35)]"
        >
          {value}
        </motion.span>
      </AnimatePresence>
      <div className="absolute left-0 right-0 top-1/2 h-[1px] bg-black/40 z-10" />
    </div>
  );
}

function Particles() {
  const particles = Array.from({ length: 8 });
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      {particles.map((_, i) => (
        <motion.div
          key={i}
          animate={{
            x: [0, (Math.random() - 0.5) * 80, 0],
            y: [0, (Math.random() - 0.5) * 80, 0],
            opacity: [0.05, 0.15, 0.05]
          }}
          transition={{
            duration: 10 + Math.random() * 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 3
          }}
          className="absolute rounded-full bg-sky-400/20 blur-[1px]"
          style={{
            width: `${Math.random() * 4 + 2}px`,
            height: `${Math.random() * 4 + 2}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`
          }}
        />
      ))}
    </div>
  );
}
