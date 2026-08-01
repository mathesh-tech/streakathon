import { prisma } from "@/lib/prisma";
import UAParser from "ua-parser-js";

export interface AuditActionParams {
  userId: string;
  action: string;
  entity: string;
  target?: string;
  previousValue?: any;
  newValue?: any;
  details?: string;
  reason?: string;
  req?: Request;
}

export async function logAuditAction(params: AuditActionParams) {
  const { userId, action, entity, target, previousValue, newValue, details, reason, req } = params;

  let ipAddress = "Unknown";
  let browser = "Unknown";

  if (req) {
    ipAddress = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "Unknown";
    const userAgentStr = req.headers.get("user-agent") || "";
    const parser = new UAParser(userAgentStr);
    browser = parser.getBrowser().name || "Unknown Browser";
  }

  await prisma.auditLog.create({
    data: {
      userId,
      action,
      entity,
      target: target || null,
      previousValue: previousValue ? JSON.stringify(previousValue) : null,
      newValue: newValue ? JSON.stringify(newValue) : null,
      details: details || null,
      reason: reason || null,
      ipAddress,
      browser
    }
  });
}
