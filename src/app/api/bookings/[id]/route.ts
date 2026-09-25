import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";
import { jsonError, jsonSuccess } from "@/lib/api-response";
import { UserRole } from "@/lib/generated/prisma/client";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const user = await getAuthUser(req);
    if (!user) {
      return jsonError("Unauthorized", 401);
    }

    const { id } = await params;

    const booking = await db.booking.findUnique({
      where: { id },
      include: {
        vehicle: true,
        customer: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phoneNumber: true,
            profilePhotoUrl: true,
            verificationStatus: true,
          },
        },
        owner: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phoneNumber: true,
            profilePhotoUrl: true,
          },
        },
        handovers: {
          orderBy: { createdAt: "asc" },
        },
        damageClaim: true,
        reviews: true,
      },
    });

    if (!booking) {
      return jsonError("Booking not found", 404);
    }

    // Only customer, owner, or admin can view this booking
    if (
      booking.customerId !== user.id &&
      booking.ownerId !== user.id &&
      user.role !== UserRole.ADMIN
    ) {
      return jsonError("You do not have permission to view this booking", 403);
    }

    return jsonSuccess({ booking });
  } catch (error) {
    console.error("Fetch booking detail error:", error);
    return jsonError("Internal server error", 500);
  }
}
