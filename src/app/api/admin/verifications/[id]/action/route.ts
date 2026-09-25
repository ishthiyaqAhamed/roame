import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";
import { jsonError, jsonSuccess } from "@/lib/api-response";
import { UserRole, VerificationStatus, VehicleStatus } from "@/lib/generated/prisma/client";
import { z } from "zod";

interface RouteParams {
  params: Promise<{ id: string }>;
}

const adminActionSchema = z.object({
  targetType: z.enum(["USER", "VEHICLE"]),
  action: z.enum(["APPROVE", "REJECT"]),
  reason: z.string().optional(),
});

export async function POST(req: NextRequest, { params }: RouteParams) {
  try {
    const user = await getAuthUser(req);
    if (!user || user.role !== UserRole.ADMIN) {
      return jsonError("Forbidden: Admin access required", 403);
    }

    const { id } = await params;
    const body = await req.json();
    const parseResult = adminActionSchema.safeParse(body);

    if (!parseResult.success) {
      return jsonError("Validation error", 422, parseResult.error.flatten().fieldErrors);
    }

    const { targetType, action } = parseResult.data;

    if (targetType === "USER") {
      const updatedUser = await db.user.update({
        where: { id },
        data: {
          verificationStatus:
            action === "APPROVE"
              ? VerificationStatus.VERIFIED
              : VerificationStatus.REJECTED,
        },
      });

      return jsonSuccess(
        { user: updatedUser },
        `User verification has been ${action === "APPROVE" ? "APPROVED" : "REJECTED"}.`
      );
    } else {
      const updatedVehicle = await db.vehicle.update({
        where: { id },
        data: {
          status:
            action === "APPROVE"
              ? VehicleStatus.ACTIVE
              : VehicleStatus.SUSPENDED,
        },
      });

      return jsonSuccess(
        { vehicle: updatedVehicle },
        `Vehicle listing has been ${action === "APPROVE" ? "ACTIVATED" : "SUSPENDED"}.`
      );
    }
  } catch (error) {
    console.error("Admin verification action error:", error);
    return jsonError("Internal server error", 500);
  }
}
