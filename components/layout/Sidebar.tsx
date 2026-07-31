"use client";

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
  Bell, 
  Settings,
  Camera,
  CheckSquare,
  ShieldCheck,
  BarChart3,
  FileCheck,
  ClipboardList
} from "lucide-react";

type Role = "student" | "ambassador" | "admin";

interface SidebarProps {
  role: Role;
}

export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();

  const studentLinks = [
    { name: "Dashboard", href: "/dashboard/student", icon: LayoutDashboard },
    { name: "Profile", href: "/dashboard/student/profile", icon: User },
    { name: "Register Hackathon", href: "/dashboard/student/register", icon: ClipboardList },
    { name: "My Team", href: "/dashboard/student/team", icon: Users },
    { name: "Submissions", href: "/dashboard/student/submissions", icon: FileText },
    { name: "Certificates", href: "/dashboard/student/certificates", icon: Award },
    { name: "Leaderboard", href: "/dashboard/student/leaderboard", icon: Trophy },
    { name: "Activity History", href: "/dashboard/student/history", icon: History },
    { name: "Notifications", href: "/dashboard/student/notifications", icon: Bell },
    { name: "Settings", href: "/dashboard/student/settings", icon: Settings },
  ];

  const ambassadorLinks = [
    { name: "Dashboard", href: "/dashboard/ambassador", icon: LayoutDashboard },
    { name: "Attendance", href: "/dashboard/ambassador/attendance", icon: CheckSquare },
    { name: "Verify Teams", href: "/dashboard/ambassador/verify-teams", icon: Users },
    { name: "Verify Participation", href: "/dashboard/ambassador/verify-participation", icon: ShieldCheck },
    { name: "Photos", href: "/dashboard/ambassador/photos", icon: Camera },
    { name: "Reports", href: "/dashboard/ambassador/reports", icon: FileText },
    { name: "Notifications", href: "/dashboard/ambassador/notifications", icon: Bell },
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

  return (
    <aside className="hidden md:flex w-64 flex-col glass-card border-r border-white/10 h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto">
      <nav className="flex flex-col gap-2 p-4">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm font-medium ${
                isActive 
                  ? "bg-primary/20 text-primary border border-primary/20" 
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5"
              }`}
            >
              <Icon className="h-4 w-4" />
              {link.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
