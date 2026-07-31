"use client";

import { useState } from "react";
import { Lock, Bell, Moon, Sun, Monitor, Shield, Save } from "lucide-react";
import { triggerConfetti } from "@/components/dashboard/student/GamificationSystem";

export default function SettingsPage() {
  const [theme, setTheme] = useState('system');
  const [notifications, setNotifications] = useState({
    hackathons: true,
    results: true,
    team: true,
    marketing: false
  });

  const handleSave = () => {
    // Mock save
    triggerConfetti();
  };

  return (
    <div className="flex-1 w-full p-4 md:p-8 space-y-8 max-w-screen-xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Account Settings</h1>
        <p className="text-muted-foreground">Manage your preferences and security settings.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Security */}
          <section className="glass-card rounded-3xl p-6 md:p-8 border-white/5">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Lock className="w-5 h-5 text-primary" /> Security & Password
            </h3>
            <div className="space-y-4 max-w-md">
              <div className="space-y-2">
                <label className="text-sm font-medium">Current Password</label>
                <input type="password" placeholder="••••••••" className="w-full h-10 bg-background/50 border border-white/10 rounded-lg px-4 text-sm focus:border-primary focus:outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">New Password</label>
                <input type="password" placeholder="••••••••" className="w-full h-10 bg-background/50 border border-white/10 rounded-lg px-4 text-sm focus:border-primary focus:outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Confirm New Password</label>
                <input type="password" placeholder="••••••••" className="w-full h-10 bg-background/50 border border-white/10 rounded-lg px-4 text-sm focus:border-primary focus:outline-none" />
              </div>
              <button className="h-10 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg px-6 text-sm font-semibold transition-colors mt-2">
                Update Password
              </button>
            </div>
          </section>

          {/* Preferences */}
          <section className="glass-card rounded-3xl p-6 md:p-8 border-white/5">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" /> Notifications
            </h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-background/50 border border-white/5 rounded-2xl">
                <div>
                  <div className="font-semibold text-sm">Hackathon Alerts</div>
                  <div className="text-xs text-muted-foreground mt-1">Get notified when new hackathons open for registration.</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={notifications.hackathons} onChange={(e) => setNotifications({...notifications, hackathons: e.target.checked})} className="sr-only peer" />
                  <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-background/50 border border-white/5 rounded-2xl">
                <div>
                  <div className="font-semibold text-sm">Results & Leaderboard</div>
                  <div className="text-xs text-muted-foreground mt-1">Get notified when results are published and leaderboards update.</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={notifications.results} onChange={(e) => setNotifications({...notifications, results: e.target.checked})} className="sr-only peer" />
                  <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-background/50 border border-white/5 rounded-2xl">
                <div>
                  <div className="font-semibold text-sm">Team Activity</div>
                  <div className="text-xs text-muted-foreground mt-1">Get notified about team invites and member joins/leaves.</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={notifications.team} onChange={(e) => setNotifications({...notifications, team: e.target.checked})} className="sr-only peer" />
                  <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            </div>
          </section>

          <div className="flex justify-end">
            <button onClick={handleSave} className="h-12 bg-primary hover:brightness-110 text-primary-foreground font-bold rounded-xl px-8 flex items-center gap-2 transition-all">
              <Save className="w-4 h-4" /> Save Preferences
            </button>
          </div>
        </div>

        <div className="space-y-8">
          <section className="glass-card rounded-3xl p-6 border-white/5">
            <h3 className="font-bold mb-4">Appearance</h3>
            <div className="grid grid-cols-3 gap-2">
              <button 
                onClick={() => setTheme('light')}
                className={`flex flex-col items-center gap-2 p-3 rounded-xl border ${theme === 'light' ? 'bg-primary/10 border-primary text-primary' : 'bg-background/50 border-white/5 hover:bg-white/5'}`}
              >
                <Sun className="w-5 h-5" />
                <span className="text-xs font-medium">Light</span>
              </button>
              <button 
                onClick={() => setTheme('dark')}
                className={`flex flex-col items-center gap-2 p-3 rounded-xl border ${theme === 'dark' ? 'bg-primary/10 border-primary text-primary' : 'bg-background/50 border-white/5 hover:bg-white/5'}`}
              >
                <Moon className="w-5 h-5" />
                <span className="text-xs font-medium">Dark</span>
              </button>
              <button 
                onClick={() => setTheme('system')}
                className={`flex flex-col items-center gap-2 p-3 rounded-xl border ${theme === 'system' ? 'bg-primary/10 border-primary text-primary' : 'bg-background/50 border-white/5 hover:bg-white/5'}`}
              >
                <Monitor className="w-5 h-5" />
                <span className="text-xs font-medium">System</span>
              </button>
            </div>
          </section>

          <section className="glass-card rounded-3xl p-6 border-white/5">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-emerald-500" /> Privacy
            </h3>
            <p className="text-sm text-muted-foreground mb-4">Your profile and achievements are visible to other students in the leaderboard.</p>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" defaultChecked />
              <span className="text-sm font-medium">Show profile in public leaderboard</span>
            </label>
          </section>
        </div>
      </div>
    </div>
  );
}
