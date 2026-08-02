import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user as any;
    
    if (!session || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (user.role !== "PARTICIPANT") {
      return NextResponse.json({ error: "Only participants can set up a student profile" }, { status: 403 });
    }

    const body = await req.json();
    const { batch, semester, section, phone, github, linkedin } = body;

    if (!batch || !semester || !section) {
      return NextResponse.json({ error: "Batch, Semester, and Section are required" }, { status: 400 });
    }

    // Check if profile already exists
    const existingProfile = await prisma.student.findUnique({
      where: { userId: user.id }
    });

    if (existingProfile) {
      return NextResponse.json({ error: "Profile already exists" }, { status: 400 });
    }

    // Create the profile
    await prisma.$transaction(async (tx) => {
      await tx.student.create({
        data: {
          userId: user.id,
          batch,
          semester: parseInt(semester, 10),
          section,
          github: github || null,
          linkedin: linkedin || null,
        }
      });

      if (phone) {
        await tx.user.update({
          where: { id: user.id },
          data: { phone }
        });
      }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Profile Setup Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
