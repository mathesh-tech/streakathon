"use client";

import { Calendar, Clock, MapPin, TerminalSquare } from "lucide-react";
import Link from "next/link";

export function UpcomingHackathonMini() {
  return (
    <div className="glass-card rounded-3xl p-6 md:p-8 h-full flex flex-col justify-between">
      <div>
        <div className="inline-flex items-center rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-medium text-accent mb-4">
          <Calendar className="mr-1.5 h-3.5 w-3.5" /> Next Event
        </div>
        <h3 className="text-xl font-bold mb-2">Streakathon #15: AI & Automation</h3>
        <p className="text-sm text-muted-foreground mb-6">Build intelligent solutions that automate tedious workflows. Compete for 100 credit points.</p>
        
        <div className="space-y-3 mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Calendar className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Date</p>
              <p className="font-semibold text-sm">Sat, Oct 14</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <MapPin className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Venue</p>
              <p className="font-semibold text-sm">IT Lab 4</p>
            </div>
          </div>
        </div>
      </div>
      
      <Link href="/dashboard/student/register" className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-primary text-sm font-bold text-primary-foreground shadow transition-transform hover:scale-105 active:scale-95">
        Register Team
      </Link>
    </div>
  );
}
