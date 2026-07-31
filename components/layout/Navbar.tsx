"use client";

import Link from 'next/link';
import { Menu, Search, Command, X, Laptop, User, Shield, Trophy } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Handle Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const searchResults = [
    { type: 'Hackathon', title: 'Streakathon #15: AI & Automation', icon: <Laptop className="w-4 h-4 text-primary" />, link: '/dashboard/student/register' },
    { type: 'Student', title: 'Siva Mathesh (IT-C)', icon: <User className="w-4 h-4 text-blue-500" />, link: '/dashboard/student/profile' },
    { type: 'Leaderboard', title: 'Global Semester Rankings', icon: <Trophy className="w-4 h-4 text-yellow-500" />, link: '/leaderboard' },
    { type: 'Admin', title: 'Credit Rules Configuration', icon: <Shield className="w-4 h-4 text-emerald-500" />, link: '/dashboard/admin' },
  ].filter(res => res.title.toLowerCase().includes(searchQuery.toLowerCase()) || res.type.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-black/10 bg-background/60 backdrop-blur-md">
        <div className="container mx-auto px-4 flex h-16 max-w-screen-2xl items-center justify-between">
          <div className="flex items-center gap-6 md:gap-10">
            <Link href="/" className="flex items-center space-x-2">
              <span className="font-bold text-xl tracking-tighter sm:text-2xl">
                STREAK<span className="text-primary">ATHON</span>
              </span>
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
            
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-black/5 hover:bg-black/10 border border-black/10 rounded-lg text-sm text-muted-foreground transition-colors"
            >
              <Search className="w-4 h-4" />
              <span>Search...</span>
              <kbd className="ml-2 pointer-events-none inline-flex h-5 items-center gap-1 rounded border border-black/10 bg-background/50 px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                <span className="text-xs">⌘</span>K
              </kbd>
            </button>

            <button 
              onClick={() => setIsSearchOpen(true)}
              className="md:hidden flex items-center justify-center w-9 h-9 rounded-md bg-black/5 hover:bg-black/10 border border-black/10 transition-colors"
            >
              <Search className="h-4 w-4 text-foreground/80" />
            </button>

            <Link
              href="/auth/login"
              className="hidden md:inline-flex items-center justify-center rounded-md text-sm font-bold transition-transform active:scale-95 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-5 py-2"
            >
              Login
            </Link>

            <button className="md:hidden flex items-center justify-center w-9 h-9 rounded-md bg-black/5 hover:bg-black/10 border border-black/10 transition-colors">
              <Menu className="h-5 w-5 text-foreground/80" />
            </button>
          </div>
        </div>
      </header>

      {/* Command Palette Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSearchOpen(false)}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-2xl bg-[#111] border border-black/10 rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="flex items-center px-4 border-b border-black/10">
                <Search className="w-5 h-5 text-muted-foreground shrink-0" />
                <input 
                  autoFocus
                  type="text"
                  placeholder="Search students, hackathons, certificates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 h-14 bg-transparent border-none focus:outline-none focus:ring-0 px-4 text-base text-foreground placeholder:text-muted-foreground/50"
                />
                <button 
                  onClick={() => setIsSearchOpen(false)}
                  className="p-1 text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-black/10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="max-h-[60vh] overflow-y-auto p-2">
                {searchResults.length > 0 ? (
                  <div className="space-y-1">
                    {searchResults.map((result, i) => (
                      <Link 
                        key={i}
                        href={result.link}
                        onClick={() => setIsSearchOpen(false)}
                        className="flex items-center justify-between p-3 rounded-xl hover:bg-primary/10 hover:text-primary transition-colors group cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-black/5 flex items-center justify-center border border-black/5 group-hover:bg-primary/20 group-hover:border-primary/30 transition-colors">
                            {result.icon}
                          </div>
                          <div>
                            <div className="text-sm font-semibold">{result.title}</div>
                            <div className="text-xs text-muted-foreground">{result.type}</div>
                          </div>
                        </div>
                        <Command className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="p-12 text-center text-muted-foreground">
                    <Search className="w-8 h-8 mx-auto mb-3 opacity-20" />
                    <p className="text-sm">No results found for "{searchQuery}"</p>
                  </div>
                )}
              </div>
              
              <div className="p-3 border-t border-black/10 bg-background/50 flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <span className="font-mono bg-black/10 px-1.5 py-0.5 rounded text-foreground">↑</span>
                  <span className="font-mono bg-black/10 px-1.5 py-0.5 rounded text-foreground">↓</span>
                  to navigate
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono bg-black/10 px-1.5 py-0.5 rounded text-foreground">Esc</span>
                  to close
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
