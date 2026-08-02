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
      className={`relative w-full max-w-4xl mx-auto rounded-[24px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.06)] backdrop-blur-2xl p-6 sm:p-8 lg:px-10 overflow-hidden shadow-2xl transition-all duration-500`}
      style={{
        boxShadow: `0 0 40px -10px rgba(244, 180, 0, 0.2), inset 0 1px 1px rgba(255,255,255,0.1)`
      }}
    >
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/4 w-1/2 h-32 bg-[#3F6FB5]/20 blur-[80px] -z-10 pointer-events-none rounded-full mix-blend-screen" />
      <div className="absolute bottom-0 right-1/4 w-1/3 h-32 bg-[#F4B400]/10 blur-[60px] -z-10 pointer-events-none rounded-full mix-blend-screen" />

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6 w-full">
        <div className="text-center md:text-left mb-6 md:mb-0 flex-1 overflow-visible min-w-0">
          <h3 className="text-sm md:text-base lg:text-lg font-bold text-[#F4B400] mb-1 leading-snug">
            <span className="whitespace-nowrap">Next Hackathon Registration</span> <br /> Closes In:
          </h3>
          <p className="text-xs md:text-sm text-slate-300">
            Streakathon #15 - AI &amp; Automation Theme
          </p>
        </div>

        {/* TIMER CARDS */}
        {isCompleted ? (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center py-2 shrink-0"
          >
            <h3 className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#FFD54F] via-[#F4B400] to-[#F4B400] drop-shadow-[0_0_20px_rgba(244,180,0,0.3)] mb-1">
              🎉 Registration Closed
            </h3>
            <p className="text-slate-400 text-xs">
              Teams locked. Stay tuned!
            </p>
          </motion.div>
        ) : (
          <div className="flex justify-center gap-2 lg:gap-3 shrink-0">
            <CountdownCard label="DAYS" value={timeLeft.days} />
            <CountdownCard label="HOURS" value={timeLeft.hours} />
            <CountdownCard label="MINS" value={timeLeft.minutes} />
            <CountdownCard label="SECS" value={timeLeft.seconds} />
          </div>
        )}
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
    <div className="flex flex-col items-center gap-2">
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d"
        }}
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className={`relative flex items-center justify-center p-2 rounded-xl glass-card cursor-default overflow-hidden group select-none w-12 h-14 sm:w-14 sm:h-16 md:w-14 md:h-16 lg:w-16 lg:h-20`}
      >
        <div className="flex justify-center items-center relative z-10" style={{ transform: "translateZ(10px)" }}>
           <span className="font-extrabold text-lg sm:text-xl lg:text-2xl tracking-tight text-[#F4B400] leading-none drop-shadow-[0_2px_8px_rgba(244,180,0,0.5)]">
             {formattedValue}
           </span>
        </div>
      </motion.div>

      <span 
        className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-slate-300"
      >
        {label}
      </span>
    </div>
  );
}
