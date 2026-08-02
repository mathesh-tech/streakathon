"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { AlertOctagon, RefreshCw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // In a production app, log this to an error tracking service (e.g. Sentry)
    console.error("Runtime Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-500/10 rounded-full blur-[120px]" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 flex flex-col items-center text-center px-4"
      >
        <div className="w-24 h-24 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-8">
          <AlertOctagon className="h-12 w-12 text-red-500" />
        </div>
        
        <h1 className="text-4xl font-black mb-4 tracking-tighter text-foreground">Something went wrong</h1>
        <p className="text-muted-foreground max-w-md mb-8">
          An unexpected error occurred. Our engineers have been notified. Please try again or return to the homepage.
        </p>
        
        <div className="flex gap-4">
          <button 
            onClick={() => reset()}
            className="inline-flex h-12 items-center justify-center rounded-lg bg-black text-white px-8 text-sm font-bold shadow transition-transform hover:scale-105 active:scale-95 dark:bg-white dark:text-black"
          >
            <RefreshCw className="mr-2 h-4 w-4" /> Try Again
          </button>
          
          <Link 
            href="/" 
            className="inline-flex h-12 items-center justify-center rounded-lg border border-input bg-transparent px-8 text-sm font-bold shadow-sm transition-transform hover:scale-105 active:scale-95"
          >
            Go Back Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
