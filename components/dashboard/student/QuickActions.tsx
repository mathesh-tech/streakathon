"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { TerminalSquare, Users, Trophy, Award, User, Bell } from "lucide-react";

export function QuickActions() {
  const actions = [
    {
      title: "Hackathons",
      description: "Register & Submit",
      icon: TerminalSquare,
      href: "/dashboard/student/register",
      color: "bg-blue-500",
    },
    {
      title: "My Team",
      description: "Manage Members",
      icon: Users,
      href: "/dashboard/student/team",
      color: "bg-indigo-500",
    },
    {
      title: "Leaderboard",
      description: "View Standings",
      icon: Trophy,
      href: "/dashboard/student/leaderboard",
      color: "bg-warning",
    },
    {
      title: "Certificates",
      description: "Download & Share",
      icon: Award,
      href: "/dashboard/student/certificates",
      color: "bg-emerald-500",
    },
    {
      title: "Profile",
      description: "Edit Info & Bio",
      icon: User,
      href: "/dashboard/student/profile",
      color: "bg-primary",
    },
    {
      title: "Alerts",
      description: "Notifications",
      icon: Bell,
      href: "/dashboard/student/notifications",
      color: "bg-destructive",
    },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, scale: 0.95 },
    show: { opacity: 1, scale: 1 }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
    >
      {actions.map((action, i) => (
        <motion.div key={i} variants={item}>
          <Link href={action.href} className="group flex flex-col items-center justify-center p-6 glass-card rounded-2xl hover:bg-white/5 transition-all border border-white/5 hover:border-white/10 relative overflow-hidden h-full">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white mb-4 ${action.color} shadow-lg shadow-black/20 group-hover:scale-110 transition-transform duration-300`}>
              <action.icon className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-foreground text-center">{action.title}</h3>
            <p className="text-xs text-muted-foreground text-center mt-1">{action.description}</p>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
}
