"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Calendar, MapPin } from "lucide-react";
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

  const isCompleted = difference <= 0;
  
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

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, scale: 0.9, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`relative w-full max-w-md rounded-[24px] border border-sky-500/20 bg-[#060c18]/90 backdrop-blur-2xl p-6 sm:p-7 overflow-hidden shadow-2xl transition-all duration-500`}
      style={{
        boxShadow: `0 0 40px -10px rgba(56, 189, 248, 0.15), inset 0 1px 1px rgba(255,255,255,0.1)`
      }}
    >
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/4 w-1/2 h-32 bg-sky-500/20 blur-[80px] -z-10 pointer-events-none rounded-full mix-blend-screen" />
      <div className="absolute bottom-0 right-1/4 w-1/3 h-32 bg-amber-500/10 blur-[60px] -z-10 pointer-events-none rounded-full mix-blend-screen" />

      <div className="relative z-10 flex flex-col space-y-7">
        {/* HEADER */}
        <div className="flex flex-col space-y-5">
          <div className="w-full flex justify-between items-center px-1">
            <div className="flex items-center gap-2 text-[11px] sm:text-[12px] font-bold uppercase tracking-[0.15em] text-slate-200">
              🚀 NEXT HACKATHON REGISTRATION
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
              <span className="flex h-1.5 w-1.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
              </span>
              LIVE
            </div>
          </div>
          
          <div className="w-full flex items-center justify-center gap-4">
            <div className="h-[1px] flex-1 bg-gradient-to-l from-amber-500/60 to-transparent relative">
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-1 bg-amber-300 rounded-full shadow-[0_0_8px_rgba(251,191,36,0.9)]" />
            </div>
            <span className="text-[11px] sm:text-[12px] font-extrabold uppercase tracking-[0.15em] text-slate-200">
              REGISTRATION CLOSES IN
            </span>
            <div className="h-[1px] flex-1 bg-gradient-to-r from-amber-500/60 to-transparent relative">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1 bg-amber-300 rounded-full shadow-[0_0_8px_rgba(251,191,36,0.9)]" />
            </div>
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
          <div className="grid grid-cols-4 gap-3 w-full">
            <CountdownCard label="DAYS" value={timeLeft.days} />
            <CountdownCard label="HOURS" value={timeLeft.hours} />
            <CountdownCard label="MINS" value={timeLeft.minutes} />
            <CountdownCard label="SECS" value={timeLeft.seconds} />
          </div>
        )}

        {/* PROGRESS LINE */}
        {!isCompleted && (
          <div className="space-y-4 pt-1">
            <div className="w-full bg-[#0a1120] border border-white/5 h-2 rounded-full relative overflow-hidden flex items-center shadow-inner">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "72%" }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-sky-500 via-blue-500 to-amber-400 relative overflow-hidden"
              >
                {/* Wavy/textured overlay */}
                <div 
                  className="absolute inset-0 opacity-30" 
                  style={{ backgroundImage: 'repeating-linear-gradient(-45deg, rgba(255,255,255,0.3) 0px, rgba(255,255,255,0.3) 4px, transparent 4px, transparent 8px)' }}
                />
              </motion.div>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="absolute left-[72%] -ml-1.5 w-3 h-3 bg-amber-200 rounded-full shadow-[0_0_12px_4px_rgba(251,191,36,0.9)] z-10" 
              />
            </div>
            <p className="text-center text-sm font-medium text-slate-300 flex items-center justify-center gap-1.5">
              <span className="text-amber-400 text-base">⚡</span> Be part of something extraordinary!
            </p>
          </div>
        )}

        {/* BOTTOM METADATA PILLS */}
        <div className="flex items-center justify-center gap-5 sm:gap-6 bg-[#080d17] border border-white/5 rounded-xl px-4 py-3 text-[10px] sm:text-[11px] font-semibold text-slate-400 tracking-wider w-full shadow-inner mt-1">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-slate-500" />
            <span>12 - 14 SEP 2026</span>
          </div>
          <div className="h-4 w-[1px] bg-white/10" />
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-slate-500" />
            <span>SONA TECH CAMPUS</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

interface CardProps {
  label: string;
  value: number;
}

function CountdownCard({ label, value }: CardProps) {
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

  const formattedValue = value.toString().padStart(2, '0');

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
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={`relative flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl bg-[#09101d] border border-white/5 shadow-inner cursor-default overflow-hidden group select-none h-[85px] sm:h-[105px]`}
    >
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Soft inner glow */}
      <div className="absolute inset-0 rounded-2xl shadow-[inset_0_0_15px_rgba(0,0,0,0.6)] pointer-events-none" />

      <div className="flex justify-center items-center py-0.5 relative z-10" style={{ transform: "translateZ(15px)" }}>
         <span className="font-extrabold text-[32px] sm:text-[42px] tracking-tight bg-gradient-to-b from-[#fef08a] via-[#eab308] to-[#a16207] bg-clip-text text-transparent drop-shadow-[0_2px_12px_rgba(234,179,8,0.4)] leading-none">
           {formattedValue}
         </span>
      </div>

      <span 
        className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-slate-400 group-hover:text-amber-400 transition-colors duration-300 mt-1 sm:mt-2"
        style={{ transform: "translateZ(5px)" }}
      >
        {label}
      </span>
    </motion.div>
  );
}
