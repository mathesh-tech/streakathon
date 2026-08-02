"use client";

import Link from 'next/link';
import { Menu, Shield, QrCode, Laptop } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [hoveredPath, setHoveredPath] = useState<string | null>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/5 bg-[#0b1526]">
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
              transition={{ type: 'spring', stiffness: 300 }}
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

          <nav className="hidden md:flex items-center gap-1" onMouseLeave={() => setHoveredPath(null)}>
            {[
              { name: 'Home', href: '/' },
              { name: 'Problems', href: '/dashboard/student/hackathon/15/problem' },
              { name: 'Hall of Fame', href: '/hall-of-fame' }
            ].map((link) => (
              <Link 
                key={link.name} 
                href={link.href} 
                onMouseEnter={() => setHoveredPath(link.href)}
                className="relative px-4 py-2 text-sm font-bold text-slate-300 hover:text-white transition-colors"
              >
                <span className="relative z-10 drop-shadow-md">{link.name}</span>
                {hoveredPath === link.href && (
                  <motion.div
                    layoutId="navbar-hover-pill"
                    className="absolute inset-0 bg-sky-500/20 border border-sky-400/30 rounded-full"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                {hoveredPath === link.href && (
                  <motion.div
                    layoutId="navbar-hover-glow"
                    className="absolute bottom-0 left-1/4 right-1/4 h-[2px] bg-sky-400 blur-[2px]"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Role Based Login Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="inline-flex items-center justify-center rounded-md text-sm font-bold transition-transform active:scale-95 bg-transparent border border-black/10 text-foreground shadow-sm hover:bg-black/5 h-10 w-10 p-0"
              aria-label="Menu"
            >
              <Menu className="w-5 h-5" />
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
                      href="/dashboard/ambassador"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-primary/20 hover:text-primary transition-colors text-sm font-semibold group text-foreground"
                    >
                      <div className="bg-black/10 p-1.5 rounded-md group-hover:bg-primary/30 transition-colors">
                        <QrCode className="w-4 h-4" />
                      </div>
                      Ambassador Portal
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
        </div>
      </div>
    </header>
  );
}
