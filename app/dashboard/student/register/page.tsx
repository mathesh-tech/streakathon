"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, MapPin, Clock, ArrowRight, ShieldAlert, CheckCircle2 } from "lucide-react";
import { triggerConfetti } from "@/components/dashboard/student/GamificationSystem";

export default function RegisterPage() {
  const [selectedHackathon, setSelectedHackathon] = useState<number | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);

  const hackathons = [
    {
      id: 1,
      title: "Streakathon #15: AI & Automation",
      status: "OPEN",
      date: "Oct 14, 2026",
      venue: "IT Lab 4",
      credits: 100,
      description: "Build intelligent solutions that automate tedious workflows.",
      teamSize: "2-4 Members",
    },
    {
      id: 2,
      title: "Streakathon #16: Web3 Horizons",
      status: "UPCOMING",
      date: "Nov 02, 2026",
      venue: "Main Auditorium",
      credits: 150,
      description: "Decentralized applications and smart contracts.",
      teamSize: "3-5 Members",
    },
    {
      id: 3,
      title: "Streakathon #14: Cloud Computing",
      status: "CLOSED",
      date: "Sep 28, 2026",
      venue: "IT Lab 1",
      credits: 100,
      description: "Deploy scalable microservices.",
      teamSize: "2-4 Members",
    }
  ];

  const handleRegister = () => {
    setIsRegistered(true);
    triggerConfetti();
    setTimeout(() => {
      setSelectedHackathon(null);
      setIsRegistered(false);
    }, 3000);
  };

  return (
    <div className="flex-1 w-full p-4 md:p-8 space-y-8 max-w-screen-xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Hackathon Registration</h1>
        <p className="text-muted-foreground">Find upcoming department hackathons and register your team.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hackathons.map((h, i) => (
          <motion.div 
            key={h.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`glass-card rounded-2xl overflow-hidden flex flex-col ${h.status === 'OPEN' ? 'border-primary/50 shadow-[0_0_20px_rgba(var(--primary),0.1)]' : 'border-white/5 opacity-80'}`}
          >
            <div className="p-6 flex-1">
              <div className="flex justify-between items-start mb-4">
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                  h.status === 'OPEN' ? 'bg-emerald-500/20 text-emerald-500' :
                  h.status === 'UPCOMING' ? 'bg-blue-500/20 text-blue-500' :
                  'bg-white/10 text-muted-foreground'
                }`}>
                  {h.status}
                </span>
                <span className="text-primary font-bold text-sm">+{h.credits} Pts</span>
              </div>
              <h3 className="text-xl font-bold mb-2">{h.title}</h3>
              <p className="text-sm text-muted-foreground mb-6 line-clamp-2">{h.description}</p>
              
              <div className="space-y-2 mb-6">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4 mr-2 text-primary" /> {h.date}
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4 mr-2 text-primary" /> {h.venue}
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="w-4 h-4 mr-2 text-primary" /> {h.teamSize}
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-background/50 border-t border-white/5">
              {h.status === 'OPEN' ? (
                <button 
                  onClick={() => setSelectedHackathon(h.id)}
                  className="w-full inline-flex h-10 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground transition-transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  Register Now <ArrowRight className="ml-2 w-4 h-4" />
                </button>
              ) : (
                <button disabled className="w-full inline-flex h-10 items-center justify-center rounded-lg bg-white/5 text-sm font-medium text-muted-foreground cursor-not-allowed">
                  {h.status === 'CLOSED' ? 'Registration Closed' : 'Opens Soon'}
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Confirmation Dialog Overlay */}
      {selectedHackathon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#111] border border-white/10 p-8 rounded-3xl max-w-md w-full shadow-2xl relative overflow-hidden"
          >
            {isRegistered ? (
              <div className="text-center py-8">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-20 h-20 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <CheckCircle2 className="w-10 h-10" />
                </motion.div>
                <h3 className="text-2xl font-bold text-white mb-2">Registration Confirmed!</h3>
                <p className="text-muted-foreground">You are now registered for the hackathon. Time to assemble your team!</p>
              </div>
            ) : (
              <>
                <div className="w-12 h-12 bg-primary/20 text-primary rounded-xl flex items-center justify-center mb-6">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Confirm Registration</h3>
                <p className="text-muted-foreground mb-8">By registering, you commit to participating in this hackathon. A no-show will result in a penalty on your streak.</p>
                <div className="flex gap-4">
                  <button 
                    onClick={() => setSelectedHackathon(null)}
                    className="flex-1 h-12 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleRegister}
                    className="flex-1 h-12 rounded-xl bg-primary text-primary-foreground font-bold hover:brightness-110 transition-all"
                  >
                    Yes, Register
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
}
