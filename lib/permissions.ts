import { Role } from "@prisma/client";

export type Action =
  // Global / Admin
  | "manage:all"
  | "manage:hackathons"
  | "manage:users"
  | "manage:certificates"
  
  // Ambassador
  | "view:participants"
  | "view:registrations"
  | "verify:attendance"
  | "approve:participation"
  | "upload:event_photos"
  | "submit:event_reports"
  | "award:credits"
  | "deduct:credits"
  | "generate:attendance_reports"
  
  // Student
  | "register:hackathon"
  | "manage:team"
  | "view:leaderboard"
  | "view:own_data"
  | "download:certificates";

export interface UserContext {
  id: string;
  role: Role | string;
  canDeductCredits?: boolean;
}

export function hasPermission(user: UserContext | null | undefined, action: Action): boolean {
  if (!user) return false;

  // Admin has full control
  if (user.role === "ADMIN") return true;

  switch (user.role) {
    case "AMBASSADOR":
      if (action === "deduct:credits") return !!user.canDeductCredits;
      return [
        "view:participants",
        "view:registrations",
        "view:leaderboard",
        "verify:attendance",
        "approve:participation",
        "upload:event_photos",
        "submit:event_reports",
        "award:credits",
        "generate:attendance_reports",
        "view:own_data" // Ambassadors can view their own data
      ].includes(action);
      
    case "PARTICIPANT":
      return [
        "register:hackathon",
        "view:leaderboard",
        "manage:team",
        "view:own_data",
        "download:certificates"
      ].includes(action);
      
    default:
      return false;
  }
}
