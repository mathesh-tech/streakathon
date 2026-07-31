"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Trophy, Calendar, Users, FileText, Check, Circle, ShieldCheck, X } from "lucide-react";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "ALERT",
      icon: <Calendar className="w-5 h-5 text-blue-500" />,
      color: "bg-blue-500/20",
      title: "Registration Opening Soon",
      message: "Registration for Streakathon #16: Web3 Horizons opens in 24 hours.",
      time: "2 hours ago",
      read: false
    },
    {
      id: 2,
      type: "SUCCESS",
      icon: <ShieldCheck className="w-5 h-5 text-emerald-500" />,
      color: "bg-emerald-500/20",
      title: "Badge Earned: Streak Master",
      message: "Congratulations! You've maintained a 5-hackathon streak. Check your profile to see your new badge.",
      time: "1 day ago",
      read: false
    },
    {
      id: 3,
      type: "INFO",
      icon: <Trophy className="w-5 h-5 text-yellow-500" />,
      color: "bg-yellow-500/20",
      title: "Leaderboard Updated",
      message: "The global leaderboard for Streakathon #14 has been finalized. See where you rank!",
      time: "2 days ago",
      read: true
    },
    {
      id: 4,
      type: "ALERT",
      icon: <Users className="w-5 h-5 text-purple-500" />,
      color: "bg-purple-500/20",
      title: "Team Invitation",
      message: "Alex Hacker has invited you to join 'Team Horizon' for the upcoming hackathon.",
      time: "3 days ago",
      read: true
    },
    {
      id: 5,
      type: "SUCCESS",
      icon: <FileText className="w-5 h-5 text-emerald-500" />,
      color: "bg-emerald-500/20",
      title: "Certificate Generated",
      message: "Your Top 10 Performer certificate for Streakathon #13 is now available in your vault.",
      time: "1 week ago",
      read: true
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const removeNotification = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  return (
    <div className="flex-1 w-full p-4 md:p-8 space-y-8 max-w-screen-md mx-auto">
      <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-3">
            Notifications 
            {unreadCount > 0 && (
              <span className="bg-primary text-primary-foreground text-sm px-2.5 py-0.5 rounded-full font-bold">
                {unreadCount} new
              </span>
            )}
          </h1>
          <p className="text-muted-foreground">Stay updated on events, achievements, and team activities.</p>
        </div>
        {unreadCount > 0 && (
          <button 
            onClick={markAllAsRead}
            className="flex items-center gap-2 text-sm font-semibold text-primary hover:text-white transition-colors bg-primary/10 hover:bg-primary/20 px-4 py-2 rounded-xl"
          >
            <Check className="w-4 h-4" /> Mark all as read
          </button>
        )}
      </header>

      {notifications.length === 0 ? (
        <div className="glass-card p-12 rounded-3xl text-center border-white/5">
          <div className="w-24 h-24 bg-primary/20 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
            <Bell className="w-12 h-12" />
          </div>
          <h2 className="text-2xl font-bold mb-2">All Caught Up!</h2>
          <p className="text-muted-foreground">You don't have any new notifications at the moment.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {notifications.map((notification, i) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ delay: i * 0.05 }}
                className={`glass-card rounded-2xl p-5 border flex items-start gap-4 group transition-colors ${
                  notification.read ? 'border-white/5 opacity-80' : 'border-primary/30 bg-primary/5'
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${notification.color}`}>
                  {notification.icon}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-1">
                    <h3 className={`font-bold truncate ${notification.read ? 'text-foreground' : 'text-primary'}`}>
                      {notification.title}
                    </h3>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs font-medium text-muted-foreground">
                        {notification.time}
                      </span>
                      <button 
                        onClick={() => removeNotification(notification.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-white/10 rounded-md transition-all text-muted-foreground hover:text-white"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {notification.message}
                  </p>
                </div>
                
                {!notification.read && (
                  <button 
                    onClick={() => markAsRead(notification.id)}
                    className="shrink-0 p-2 text-primary hover:bg-primary/20 rounded-full transition-colors self-center"
                    title="Mark as read"
                  >
                    <Circle className="w-3 h-3 fill-primary" />
                  </button>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
