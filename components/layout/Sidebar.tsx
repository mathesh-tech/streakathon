"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  User, 
  Trophy, 
  Users, 
  FileText, 
  Award, 
  History, 
  Settings,
  Camera,
  CheckSquare,
  ShieldCheck,
  BarChart3,
  FileCheck,
  ClipboardList,
  Menu,
  X,
  PanelLeft
} from "lucide-react";

type Role = "student" | "ambassador" | "admin";

interface SidebarProps {
  role: Role;
}

export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const studentLinks = [
    { name: "Dashboard", href: "/dashboard/student", icon: LayoutDashboard },
    { name: "Profile", href: "/dashboard/student/profile", icon: User },
    { name: "Register Hackathon", href: "/dashboard/student/register", icon: ClipboardList },
    { name: "My Team", href: "/dashboard/student/team", icon: Users },
    { name: "Submissions", href: "/dashboard/student/submissions", icon: FileText },
    { name: "Certificates", href: "/dashboard/student/certificates", icon: Award },
    { name: "Leaderboard", href: "/dashboard/student/leaderboard", icon: Trophy },
    { name: "Activity History", href: "/dashboard/student/history", icon: History },
    { name: "Settings", href: "/dashboard/student/settings", icon: Settings },
  ];

  const ambassadorLinks = [
    { name: "Dashboard", href: "/dashboard/ambassador", icon: LayoutDashboard },
    { name: "Attendance & QR", href: "/dashboard/ambassador/attendance", icon: CheckSquare },
    { name: "Verify Teams", href: "/dashboard/ambassador/verify-teams", icon: Users },
    { name: "Students", href: "/dashboard/ambassador/students", icon: User },
    { name: "Leaderboard", href: "/dashboard/ambassador/leaderboard", icon: Trophy },
    { name: "Photos", href: "/dashboard/ambassador/photos", icon: Camera },
    { name: "Reports", href: "/dashboard/ambassador/reports", icon: FileText },
  ];

  const adminLinks = [
    { name: "Analytics", href: "/dashboard/admin", icon: BarChart3 },
    { name: "Hackathons", href: "/dashboard/admin/hackathons", icon: Trophy },
    { name: "Students", href: "/dashboard/admin/students", icon: User },
    { name: "Ambassadors", href: "/dashboard/admin/ambassadors", icon: ShieldCheck },
    { name: "Teams", href: "/dashboard/admin/teams", icon: Users },
    { name: "Certificates", href: "/dashboard/admin/certificates", icon: Award },
    { name: "Credit Rules", href: "/dashboard/admin/credit-rules", icon: FileCheck },
    { name: "Leaderboard", href: "/dashboard/admin/leaderboard", icon: Trophy },
    { name: "Reports", href: "/dashboard/admin/reports", icon: FileText },
    { name: "Audit Logs", href: "/dashboard/admin/audit-logs", icon: History },
    { name: "Settings", href: "/dashboard/admin/settings", icon: Settings },
  ];

  const links = role === "student" ? studentLinks : role === "ambassador" ? ambassadorLinks : adminLinks;

  const currentRoleTitle = role === "admin" ? "Admin Portal" : role === "ambassador" ? "Ambassador Panel" : "Student Portal";

  return (
    <>
      {/* Mobile Sticky Header Bar for Sidebar Navigation Toggle (< md) */}
      <div className="md:hidden w-full bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between sticky top-16 z-30 shadow-md">
        <button
          onClick={() => setMobileOpen(true)}
          className="flex items-center gap-2.5 px-3 py-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-lg text-sm font-bold active:scale-95 transition"
          aria-label="Open Navigation Menu"
        >
          <PanelLeft className="w-5 h-5" />
          <span>Menu</span>
        </button>

        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
          {currentRoleTitle}
        </span>
      </div>

      {/* Desktop Sidebar (>= md) */}
      <aside className="hidden md:flex w-64 flex-col bg-slate-950 border-r border-slate-800/80 h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto shrink-0 shadow-lg">
        <div className="p-4 border-b border-slate-800/80">
          <span className="text-xs font-extrabold uppercase tracking-widest text-amber-400">
            {currentRoleTitle}
          </span>
        </div>
        <nav className="flex flex-col gap-1 p-3">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all duration-200 text-sm font-semibold ${
                  isActive 
                    ? "bg-amber-500/15 text-amber-400 border border-amber-500/30 shadow-md shadow-amber-500/5 font-bold" 
                    : "text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent"
                }`}
              >
                <Icon className={`h-4 h-4 ${isActive ? "text-amber-400" : "opacity-70"}`} />
                {link.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Mobile Drawer Backdrop & Sidebar Slide-over Modal (< md) */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileOpen(false)}
          />

          {/* Drawer Content */}
          <div className="relative w-4/5 max-w-xs bg-slate-950 border-r border-slate-800 h-full flex flex-col shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
              <span className="text-xs font-extrabold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                <PanelLeft className="w-4 h-4" />
                {currentRoleTitle} Navigation
              </span>
              <button 
                onClick={() => setMobileOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto p-4 space-y-1.5">
              {links.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-200 text-sm ${
                      isActive 
                        ? "bg-amber-500/20 text-amber-400 border border-amber-500/40 font-bold shadow-md shadow-amber-500/10" 
                        : "text-slate-300 hover:text-white hover:bg-slate-900 border border-transparent font-medium"
                    }`}
                  >
                    <Icon className={`h-5 w-5 ${isActive ? "text-amber-400" : "text-slate-400"}`} />
                    {link.name}
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 border-t border-slate-800 text-center text-xs text-slate-500">
              Streakathon • Sona College of Technology
            </div>
          </div>
        </div>
      )}
    </>
  );
}
