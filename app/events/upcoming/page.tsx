"use client";

import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, Users, TerminalSquare } from "lucide-react";
import Link from "next/link";

export default function UpcomingEventsPage() {
  return (
    <div className="flex flex-col min-h-screen w-full bg-background pt-24 pb-20">
      <section className="container max-w-screen-xl px-4 md:px-6 mb-12">
        <h1 className="text-5xl font-bold tracking-tight mb-4">Upcoming Events</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mb-12">
          Lock your spot in the upcoming hackathons. Only registered teams can access the problem statement on the day of the event.
        </p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row gap-8 items-stretch glass-card rounded-3xl p-6 md:p-8"
        >
          {/* Poster */}
          <div className="w-full lg:w-1/3 aspect-[4/3] lg:aspect-auto rounded-2xl border border-black/10 bg-primary/5 flex items-center justify-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 z-0"></div>
            <TerminalSquare className="h-24 w-24 text-black/20 relative z-10 group-hover:scale-110 transition-transform duration-500" />
            <div className="absolute top-4 left-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              Registration Open
            </div>
          </div>

          {/* Details */}
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-3">Streakathon #15: AI & Automation</h2>
              <p className="text-muted-foreground mb-6">
                Build intelligent solutions that automate tedious workflows. The most innovative solution wins 100 credit points and the exclusive "AI Innovator" badge.
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="flex items-center gap-3 bg-black/5 p-3 rounded-xl border border-black/5">
                  <Calendar className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Date</p>
                    <p className="font-semibold text-sm">Sat, Oct 14</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-black/5 p-3 rounded-xl border border-black/5">
                  <Clock className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Duration</p>
                    <p className="font-semibold text-sm">12 Hours</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-black/5 p-3 rounded-xl border border-black/5">
                  <MapPin className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Venue</p>
                    <p className="font-semibold text-sm">IT Lab 4, Block B</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-black/5 p-3 rounded-xl border border-black/5">
                  <Users className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Seats</p>
                    <p className="font-semibold text-sm">120 Available</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/auth/login" className="inline-flex h-12 items-center justify-center rounded-lg bg-primary px-8 text-sm font-bold text-primary-foreground shadow transition-transform hover:scale-105 active:scale-95 flex-1">
                Register Team
              </Link>
              <button className="inline-flex h-12 items-center justify-center rounded-lg border border-black/10 bg-black/5 px-8 text-sm font-bold transition-colors hover:bg-black/10 flex-1">
                View Rules
              </button>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
