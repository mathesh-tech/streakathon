"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Trophy, Calendar, Users, FileText, Check, Circle, ShieldCheck, X, Info, AlertTriangle, CheckCircle2 } from "lucide-react";
import { markAsRead, markAllAsRead as apiMarkAllAsRead, deleteNotification } from "@/actions/notifications";
import { formatDistanceToNow } from "date-fns";

export function NotificationCenter({ initialNotifications }: { initialNotifications: any[] }) {
  const [notifications, setNotifications] = useState(initialNotifications);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleMarkAllAsRead = async () => {
    await apiMarkAllAsRead();
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  const handleMarkAsRead = async (id: string) => {
    await markAsRead(id);
    setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const handleRemoveNotification = async (id: string) => {
    await deleteNotification(id);
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "ALERT":
      case "WARNING":
      case "PROBLEM_RELEASE":
      case "SUBMISSION_DEADLINE":
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case "SUCCESS":
      case "ACHIEVEMENT_UNLOCKED":
      case "REGISTRATION_SUCCESS":
        return <ShieldCheck className="w-5 h-5 text-emerald-500" />;
      case "LEADERBOARD_UPDATE":
      case "INNOVATION_CREDITS":
        return <Trophy className="w-5 h-5 text-yellow-500" />;
      case "TEAM_INVITATION":
      case "TEAM_ACCEPTED":
        return <Users className="w-5 h-5 text-purple-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case "ALERT":
      case "WARNING":
      case "PROBLEM_RELEASE":
      case "SUBMISSION_DEADLINE":
        return "bg-red-500/20";
      case "SUCCESS":
      case "ACHIEVEMENT_UNLOCKED":
      case "REGISTRATION_SUCCESS":
        return "bg-emerald-500/20";
      case "LEADERBOARD_UPDATE":
      case "INNOVATION_CREDITS":
        return "bg-yellow-500/20";
      case "TEAM_INVITATION":
      case "TEAM_ACCEPTED":
        return "bg-purple-500/20";
      default:
        return "bg-blue-500/20";
    }
  };

  return (
    <div className="flex-1 w-full space-y-8">
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
            onClick={handleMarkAllAsRead}
            className="flex items-center gap-2 text-sm font-semibold text-primary hover:text-foreground transition-colors bg-primary/10 hover:bg-primary/20 px-4 py-2 rounded-xl"
          >
            <Check className="w-4 h-4" /> Mark all as read
          </button>
        )}
      </header>

      {notifications.length === 0 ? (
        <div className="glass-card p-12 rounded-3xl text-center border-black/5">
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
                  notification.isRead ? 'border-black/5 opacity-80' : 'border-primary/30 bg-primary/5'
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${getColor(notification.type)}`}>
                  {getIcon(notification.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-1">
                    <h3 className={`font-bold truncate ${notification.isRead ? 'text-foreground' : 'text-primary'}`}>
                      {notification.title}
                    </h3>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs font-medium text-muted-foreground">
                        {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                      </span>
                      <button 
                        onClick={() => handleRemoveNotification(notification.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-black/10 rounded-md transition-all text-muted-foreground hover:text-foreground"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {notification.message}
                  </p>
                  {notification.actionUrl && (
                    <a href={notification.actionUrl} className="text-sm font-semibold text-primary mt-2 inline-block">
                      View details &rarr;
                    </a>
                  )}
                </div>
                
                {!notification.isRead && (
                  <button 
                    onClick={() => handleMarkAsRead(notification.id)}
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
