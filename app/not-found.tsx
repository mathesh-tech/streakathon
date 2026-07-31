"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { SearchX, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[100px]" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 flex flex-col items-center text-center px-4"
      >
        <div className="w-32 h-32 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-8">
          <SearchX className="h-16 w-16 text-muted-foreground" />
        </div>
        
        <h1 className="text-7xl font-black mb-4 tracking-tighter">404</h1>
        <h2 className="text-2xl font-bold mb-4">You've found a dead end.</h2>
        <p className="text-muted-foreground max-w-md mb-8">
          The page you're looking for doesn't exist, has been moved, or you just don't have enough credit points to unlock it.
        </p>
        
        <Link 
          href="/" 
          className="inline-flex h-12 items-center justify-center rounded-lg bg-primary px-8 text-sm font-bold text-primary-foreground shadow transition-transform hover:scale-105 active:scale-95"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Go Back Home
        </Link>
      </motion.div>
    </div>
  );
}
