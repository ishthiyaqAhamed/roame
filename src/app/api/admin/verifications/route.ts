import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";
import { jsonError, jsonSuccess } from "@/lib/api-response";
import { UserRole, VerificationStatus, VehicleStatus } from "@/lib/generated/prisma/client";

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    if (!user || user.role !== UserRole.ADMIN) {
      return jsonError("Forbidden: Admin access required", 403);
    }

    const [pendingUsers, pendingVehicles, openClaims, flaggedUsers] = await Promise.all([
      db.user.findMany({
        where: { verificationStatus: VerificationStatus.PENDING },
        select: {
          id: true,
          fullName: true,
          email: true,
          phoneNumber: true,
          dateOfBirth: true,
          address: true,
          nicNumber: true,
          nicFrontUrl: true,
          nicBackUrl: true,
          drivingLicenseNumber: true,
          drivingLicenseFrontUrl: true,
          drivingLicenseBackUrl: true,
          profilePhotoUrl: true,
          verificationStatus: true,
          createdAt: true,
        },
      }),
      db.vehicle.findMany({
        where: { status: VehicleStatus.PENDING_REVIEW },
        include: {
          owner: {
            select: {
              id: true,
              fullName: true,
              email: true,
              phoneNumber: true,
            },
          },
        },
      }),
      db.damageClaim.findMany({
        where: { status: "UNDER_MEDIATION" },
        include: {
          booking: {
            include: {
              vehicle: true,
            },
          },
          claimant: {
            select: { id: true, fullName: true, phoneNumber: true },
          },
          respondent: {
            select: { id: true, fullName: true, phoneNumber: true },
          },
        },
      }),
      db.user.findMany({
        where: { isBlacklisted: true },
        include: {
          flagsReceived: true,
        },
      }),
    ]);

    return jsonSuccess({
      pendingUsers,
      pendingVehicles,
      openClaims,
      flaggedUsers,
    });
  } catch (error) {
    console.error("Admin verification fetch error:", error);
    return jsonError("Internal server error", 500);
  }
}
