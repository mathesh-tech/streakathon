"use client";

import Link from 'next/link';
import { Menu, User, Shield, QrCode, Laptop } from 'lucide-react';
import { motion } from 'framer-motion';

import { NotificationBell } from '@/components/notifications/NotificationBell';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl">
      <div className="container mx-auto px-4 flex h-16 max-w-screen-2xl items-center justify-between">
        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2 sm:space-x-3 group">
            <motion.img 
              src="/sona-logo.png" 
              alt="Sona College Logo" 
              className="h-8 sm:h-10 w-auto object-contain"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            />
            <motion.span 
              className="font-bold text-lg sm:text-2xl tracking-tight text-slate-900 dark:text-white"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              STREAK<span className="text-primary">ATHON</span>
            </motion.span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link href="/" className="text-sm font-medium text-slate-600 hover:text-primary dark:text-slate-300 transition-colors">
              Home
            </Link>
            <Link href="/dashboard/student/hackathon/15/problem" className="text-sm font-medium text-slate-600 hover:text-primary dark:text-slate-300 transition-colors">
              Problems
            </Link>
            <Link href="/leaderboard" className="text-sm font-medium text-slate-600 hover:text-primary dark:text-slate-300 transition-colors">
              Leaderboard
            </Link>
            <Link href="/hall-of-fame" className="text-sm font-medium text-slate-600 hover:text-primary dark:text-slate-300 transition-colors">
              Hall of Fame
            </Link>
          </nav>
        </div>
        
        <div className="flex items-center space-x-2 sm:space-x-4">
          <NotificationBell />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="rounded-full">
                <Menu className="h-5 w-5 text-slate-600 dark:text-slate-300" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 rounded-xl">
              <DropdownMenuLabel>Portals</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/auth/login" className="cursor-pointer">
                  <Laptop className="mr-2 h-4 w-4" />
                  <span>Student Login</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/ambassador" className="cursor-pointer">
                  <QrCode className="mr-2 h-4 w-4" />
                  <span>Ambassador Portal</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard/admin" className="cursor-pointer">
                  <Shield className="mr-2 h-4 w-4" />
                  <span>Admin Portal</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
