import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { AuditService } from "@/server/services/audit.service";

// DELETE /api/admin/ambassadors/[id] - Delete Ambassador ID
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized. Admin access required." }, { status: 403 });
    }

    const userId = params.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { ambassadorProfile: true }
    });

    if (!user || user.role !== "AMBASSADOR") {
      return NextResponse.json({ error: "Ambassador not found." }, { status: 404 });
    }

    // Deleting the user automatically cascades to Ambassador profile
    await prisma.$transaction(async (tx) => {
      if (user.ambassadorProfile) {
        await tx.ambassador.delete({ where: { ambassadorId: user.ambassadorProfile.ambassadorId } });
      }
      await tx.user.delete({ where: { id: userId } });
    });

    await AuditService.log({
      userId: (session.user as any).id,
      action: "DELETE_AMBASSADOR",
      entity: "Ambassador",
      target: userId,
      details: `Admin deleted Ambassador account ${user.name} (${user.email})`,
      req,
    }).catch(console.error);

    return NextResponse.json({
      success: true,
      message: `Ambassador account for ${user.name} deleted successfully.`
    });
  } catch (error: any) {
    console.error("Delete Ambassador Error:", error);
    return NextResponse.json({ error: "Failed to delete ambassador account" }, { status: 500 });
  }
}

// PUT /api/admin/ambassadors/[id] - Reset Password / Update Ambassador
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized. Admin access required." }, { status: 403 });
    }

    const userId = params.id;
    const { name, password, department, assignedYear, assignedSection } = await req.json();

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { ambassadorProfile: true }
    });

    if (!user || user.role !== "AMBASSADOR") {
      return NextResponse.json({ error: "Ambassador not found." }, { status: 404 });
    }

    const updateData: any = {};
    if (name) updateData.name = name;
    if (department) updateData.department = department.toUpperCase();
    if (password && password.length >= 6) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    await prisma.$transaction(async (tx) => {
      if (Object.keys(updateData).length > 0) {
        await tx.user.update({
          where: { id: userId },
          data: updateData
        });
      }

      if (user.ambassadorProfile) {
        await tx.ambassador.update({
          where: { ambassadorId: user.ambassadorProfile.ambassadorId },
          data: {
            assignedYear: assignedYear ? parseInt(assignedYear) : user.ambassadorProfile.assignedYear,
            assignedSection: assignedSection ? assignedSection.toUpperCase() : user.ambassadorProfile.assignedSection,
          }
        });
      }
    });

    return NextResponse.json({
      success: true,
      message: `Ambassador account for ${user.name} updated successfully.`
    });
  } catch (error: any) {
    console.error("Update Ambassador Error:", error);
    return NextResponse.json({ error: "Failed to update ambassador account" }, { status: 500 });
  }
}
