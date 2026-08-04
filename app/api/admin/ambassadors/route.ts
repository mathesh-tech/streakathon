import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { AuditService } from "@/server/services/audit.service";

const createAmbassadorSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address").refine(
    (val) => val.toLowerCase().endsWith("@sonatech.ac.in"),
    { message: "Ambassador email must be an official @sonatech.ac.in email" }
  ),
  password: z.string().min(6, "Password must be at least 6 characters"),
  department: z.enum(["IT", "ADS"]).default("IT"),
  assignedYear: z.number().int().min(2).max(4, "Ambassadors can be assigned to 2nd, 3rd or 4th year").default(3),
  assignedSection: z.string().optional().default("A"),
});

// GET /api/admin/ambassadors - List all Ambassadors
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized. Admin access required." }, { status: 403 });
    }

    const ambassadors = await prisma.user.findMany({
      where: { role: "AMBASSADOR" },
      select: {
        id: true,
        name: true,
        email: true,
        department: true,
        status: true,
        createdAt: true,
        lastLogin: true,
        ambassadorProfile: {
          select: {
            assignedYear: true,
            assignedSection: true,
            permissions: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, ambassadors });
  } catch (error: any) {
    console.error("Fetch Ambassadors Error:", error);
    return NextResponse.json({ error: "Failed to fetch ambassadors" }, { status: 500 });
  }
}

// POST /api/admin/ambassadors - Create a new Hackathon Ambassador
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized. Admin access required." }, { status: 403 });
    }

    const body = await req.json();
    const result = createAmbassadorSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0].message },
        { status: 400 }
      );
    }

    const { name, email, password, department, assignedYear, assignedSection } = result.data;
    const normalizedEmail = email.toLowerCase().trim();

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (existingUser) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create User & Ambassador profile in a transaction
    const newUser = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name,
          email: normalizedEmail,
          password: hashedPassword,
          role: "AMBASSADOR",
          department: department.toUpperCase(),
          emailVerified: true,
          forcePasswordChange: false,
          status: "ACTIVE",
        },
      });

      await tx.ambassador.create({
        data: {
          userId: user.id,
          assignedYear,
          assignedSection,
          permissions: ["MARK_ATTENDANCE", "VERIFY_TEAMS", "CREATE_REPORTS"],
        },
      });

      return user;
    });

    // Log action to audit logs
    await AuditService.log({
      userId: (session.user as any).id,
      action: "CREATE_AMBASSADOR",
      entity: "Ambassador",
      target: newUser.id,
      newValue: { email: newUser.email, name: newUser.name, department },
      details: `Admin created Hackathon Ambassador ID for ${newUser.name} (${newUser.email}) - Dept: ${department}`,
      req,
    }).catch(console.error);

    return NextResponse.json({
      success: true,
      message: `Hackathon Ambassador ID created successfully for ${newUser.name}`,
      ambassador: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        department: newUser.department,
        assignedYear,
        assignedSection,
      },
    });
  } catch (error: any) {
    console.error("Create Ambassador Error:", error);
    return NextResponse.json({ error: "Failed to create ambassador account" }, { status: 500 });
  }
}
