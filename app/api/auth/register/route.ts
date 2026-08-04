import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email").regex(/^[a-zA-Z0-9._%+-]+@sonatech\.ac\.in$/, "Must be a valid @sonatech.ac.in email"),
  registerNumber: z.string().min(5, "Register number is required"),
  department: z.string().min(2, "Department is required"),
  year: z.number().int().min(1).max(5),
  section: z.string().optional(),
  gender: z.string().min(1, "Gender is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["PARTICIPANT", "AMBASSADOR"]).default("PARTICIPANT"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Validate body
    const result = registerSchema.safeParse({
      ...body,
      year: parseInt(body.year, 10)
    });

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid data", details: result.error.flatten() },
        { status: 400 }
      );
    }

    const data = result.data;

    // Mockup Backdoor for UI Testing without DB
    if (data.password === "mockup") {
      return NextResponse.json(
        { message: "Mockup registration successful", userId: "mock-user-1" },
        { status: 201 }
      );
    }

    // Check if user exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: data.email },
          { registerNumber: data.registerNumber }
        ]
      }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email or register number already exists" },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Determine batch (e.g. if year is 1, batch is current year + 3)
    const currentYear = new Date().getFullYear();
    const batchYear = currentYear + (4 - data.year) + 1; // Approximate calculation
    const batch = `${currentYear}-${batchYear}`;

    // Create user and student profile in a transaction
    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          name: data.name,
          email: data.email,
          password: hashedPassword,
          role: data.role,
          department: data.department,
          year: data.year,
          registerNumber: data.registerNumber,
          gender: data.gender,
          forcePasswordChange: false,
          status: data.role === "AMBASSADOR" ? "PENDING_APPROVAL" : "ACTIVE",
          emailVerified: false,
        },
      });

      if (data.role === "PARTICIPANT") {
        await tx.student.create({
          data: {
            userId: newUser.id,
            batch: batch,
            section: data.section || null,
            semester: data.year * 2 - 1, // approximate
          }
        });
      }

      return newUser;
    });

    return NextResponse.json(
      { message: "Registration successful", userId: user.id },
      { status: 201 }
    );

  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
