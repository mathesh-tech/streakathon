"use client";

import { useEffect, useState, useRef } from "react";
import { Bell } from "lucide-react";
import { getNotifications, markAsRead } from "@/actions/notifications";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export function NotificationBell() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchNotifs() {
      const data = await getNotifications(5);
      if (data) setNotifications(data);
    }
    fetchNotifs();
    
    // Polling every minute
    const interval = setInterval(fetchNotifs, 60000);
    return () => clearInterval(interval);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleRead = async (id: string, url: string | null) => {
    await markAsRead(id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    setIsOpen(false);
    if (url) {
      router.push(url);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative inline-flex items-center justify-center rounded-md text-sm font-bold transition-transform active:scale-95 bg-transparent border border-black/10 text-foreground shadow-sm hover:bg-black/5 h-10 w-10 p-0"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-80 rounded-xl border border-black/10 bg-background/95 backdrop-blur-xl shadow-xl overflow-hidden z-50"
          >
            <div className="flex items-center justify-between px-4 py-3 font-semibold border-b border-black/10 bg-black/5">
              <span>Notifications</span>
              {unreadCount > 0 && (
                <span className="text-xs text-primary">{unreadCount} unread</span>
              )}
            </div>
            <div className="max-h-[300px] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  No new notifications
                </div>
              ) : (
                notifications.map((n) => (
                  <div 
                    key={n.id} 
                    className={`flex flex-col items-start p-3 cursor-pointer hover:bg-black/5 border-b border-black/5 last:border-0 ${!n.isRead ? 'bg-primary/5' : ''}`}
                    onClick={() => handleRead(n.id, n.actionUrl)}
                  >
                    <div className="flex justify-between w-full mb-1">
                      <span className={`font-medium ${!n.isRead ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {n.title}
                      </span>
                      <span className="text-[10px] text-muted-foreground whitespace-nowrap ml-2">
                        {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground line-clamp-2">
                      {n.message}
                    </span>
                  </div>
                ))
              )}
            </div>
            <div 
              className="p-3 border-t border-black/10 text-center cursor-pointer text-sm font-semibold text-primary hover:bg-primary/10 transition-colors"
              onClick={() => {
                setIsOpen(false);
                router.push('/dashboard/student/notifications');
              }}
            >
              View All Notifications
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
