"use client";

import Link from 'next/link';
import { Menu, User, Shield, QrCode, ChevronDown, Laptop } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-black/10 bg-background/60 backdrop-blur-md">
      <div className="container mx-auto px-4 flex h-16 max-w-screen-2xl items-center justify-between">
        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2 sm:space-x-3 group">
            <motion.img 
              src="/sona-logo.png" 
              alt="Sona College Logo" 
              className="h-8 sm:h-10 md:h-12 w-auto object-contain drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            />
            <motion.span 
              style={{ fontFamily: 'var(--font-orbitron), sans-serif' }}
              className="font-black italic text-lg sm:text-2xl md:text-3xl tracking-wider drop-shadow-md uppercase"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              <span className="text-white">STREAK</span><span className="text-primary">ATHON</span>
            </motion.span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link href="/" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
              Home
            </Link>
            <Link href="/dashboard/student/hackathon/15/problem" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
              Problems
            </Link>
            <Link href="/leaderboard" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
              Leaderboard
            </Link>
            <Link href="/hall-of-fame" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
              Hall of Fame
            </Link>
          </nav>
        </div>
        
        <div className="flex items-center space-x-4">
          
          {/* Role Based Login Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="inline-flex items-center justify-center rounded-md text-sm font-bold transition-transform active:scale-95 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2 gap-2"
            >
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Login Portal</span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-56 rounded-xl border border-black/10 bg-background/95 backdrop-blur-xl shadow-xl overflow-hidden z-50"
                >
                  <div className="p-2 flex flex-col gap-1">
                    <Link
                      href="/auth/login"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-primary/20 hover:text-primary transition-colors text-sm font-semibold group text-foreground"
                    >
                      <div className="bg-black/10 p-1.5 rounded-md group-hover:bg-primary/30 transition-colors">
                        <Laptop className="w-4 h-4" />
                      </div>
                      Student Login
                    </Link>
                    <Link
                      href="/dashboard/ambassador/scanner"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-primary/20 hover:text-primary transition-colors text-sm font-semibold group text-foreground"
                    >
                      <div className="bg-black/10 p-1.5 rounded-md group-hover:bg-primary/30 transition-colors">
                        <QrCode className="w-4 h-4" />
                      </div>
                      Ambassador Scanner
                    </Link>
                    <Link
                      href="/dashboard/admin"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-primary/20 hover:text-primary transition-colors text-sm font-semibold group text-foreground"
                    >
                      <div className="bg-black/10 p-1.5 rounded-md group-hover:bg-primary/30 transition-colors">
                        <Shield className="w-4 h-4" />
                      </div>
                      Admin Portal
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button className="md:hidden flex items-center justify-center w-9 h-9 rounded-md bg-black/5 hover:bg-black/10 border border-black/10 transition-colors">
            <Menu className="h-5 w-5 text-foreground/80" />
          </button>
        </div>
      </div>
    </header>
  );
}
