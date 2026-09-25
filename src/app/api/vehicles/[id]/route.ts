import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";
import { jsonError, jsonSuccess } from "@/lib/api-response";
import { UserRole, VehicleStatus } from "@/lib/generated/prisma/client";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// Get detailed vehicle information
export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    const vehicle = await db.vehicle.findUnique({
      where: { id },
      include: {
        owner: {
          select: {
            id: true,
            fullName: true,
            profilePhotoUrl: true,
            verificationStatus: true,
            createdAt: true,
          },
        },
        reviews: {
          orderBy: { createdAt: "desc" },
          take: 10,
          include: {
            reviewer: {
              select: {
                id: true,
                fullName: true,
                profilePhotoUrl: true,
              },
            },
          },
        },
      },
    });

    if (!vehicle) {
      return jsonError("Vehicle not found", 404);
    }

    return jsonSuccess({ vehicle });
  } catch (error) {
    console.error("Fetch vehicle error:", error);
    return jsonError("Internal server error", 500);
  }
}

// Update vehicle listing (Owner or Admin)
export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    const user = await getAuthUser(req);
    if (!user) {
      return jsonError("Unauthorized", 401);
    }

    const { id } = await params;
    const existing = await db.vehicle.findUnique({
      where: { id },
    });

    if (!existing) {
      return jsonError("Vehicle not found", 404);
    }

    if (existing.ownerId !== user.id && user.role !== UserRole.ADMIN) {
      return jsonError("You do not have permission to update this vehicle listing", 403);
    }

    const body = await req.json();

    const updated = await db.vehicle.update({
      where: { id },
      data: {
        pricePerDay: body.pricePerDay !== undefined ? body.pricePerDay : existing.pricePerDay,
        kmIncludedPerDay:
          body.kmIncludedPerDay !== undefined ? body.kmIncludedPerDay : existing.kmIncludedPerDay,
        pricePerExtraKm:
          body.pricePerExtraKm !== undefined ? body.pricePerExtraKm : existing.pricePerExtraKm,
        securityDeposit:
          body.securityDeposit !== undefined ? body.securityDeposit : existing.securityDeposit,
        chauffeurIncluded:
          body.chauffeurIncluded !== undefined ? body.chauffeurIncluded : existing.chauffeurIncluded,
        decorationAvailable:
          body.decorationAvailable !== undefined
            ? body.decorationAvailable
            : existing.decorationAvailable,
        minimumBookingHours:
          body.minimumBookingHours !== undefined
            ? body.minimumBookingHours
            : existing.minimumBookingHours,
        photos: body.photos || existing.photos,
        status: body.status || existing.status,
      },
    });

    return jsonSuccess({ vehicle: updated }, "Vehicle updated successfully");
  } catch (error) {
    console.error("Update vehicle error:", error);
    return jsonError("Internal server error", 500);
  }
}

// Delete vehicle listing (Owner or Admin)
export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const user = await getAuthUser(req);
    if (!user) {
      return jsonError("Unauthorized", 401);
    }

    const { id } = await params;
    const existing = await db.vehicle.findUnique({
      where: { id },
    });

    if (!existing) {
      return jsonError("Vehicle not found", 404);
    }

    if (existing.ownerId !== user.id && user.role !== UserRole.ADMIN) {
      return jsonError("You do not have permission to delete this listing", 403);
    }

    // Set to INACTIVE rather than hard-deleting if historical bookings exist
    await db.vehicle.update({
      where: { id },
      data: { status: VehicleStatus.INACTIVE },
    });

    return jsonSuccess(null, "Vehicle listing removed successfully");
  } catch (error) {
    console.error("Delete vehicle error:", error);
    return jsonError("Internal server error", 500);
  }
}
