import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";
import { jsonError, jsonSuccess } from "@/lib/api-response";
import { createDamageClaimSchema } from "@/lib/validations/claim.schema";
import { BookingStatus, ClaimStatus } from "@/lib/generated/prisma/client";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(req: NextRequest, { params }: RouteParams) {
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
      },
    });

    if (!booking) {
      return jsonError("Booking not found", 404);
    }

    if (booking.ownerId !== user.id) {
      return jsonError("Only the vehicle owner can file a damage claim", 403);
    }

    // Must be in RETURN_INSPECTION or COMPLETED within 48 hours
    const completionWindowHours = 48;
    const bookingEndTime = booking.endDate.getTime();
    const now = Date.now();
    const hoursSinceDropoff = (now - bookingEndTime) / (1000 * 60 * 60);

    if (hoursSinceDropoff > completionWindowHours) {
      return jsonError(
        `Damage claims must be filed within ${completionWindowHours} hours of vehicle drop-off`,
        400
      );
    }

    // Check if claim already exists
    const existingClaim = await db.damageClaim.findUnique({
      where: { bookingId: booking.id },
    });

    if (existingClaim) {
      return jsonError("A damage claim has already been filed for this booking", 409);
    }

    const body = await req.json();
    const parseResult = createDamageClaimSchema.safeParse(body);

    if (!parseResult.success) {
      return jsonError("Validation error", 422, parseResult.error.flatten().fieldErrors);
    }

    const data = parseResult.data;

    // Renter only pays insurance excess amount, never full repair cost
    const deadlineDate = new Date(Date.now() + 48 * 60 * 60 * 1000); // 48h to respond

    const claim = await db.damageClaim.create({
      data: {
        bookingId: booking.id,
        claimantId: booking.ownerId,
        respondentId: booking.customerId,
        status: ClaimStatus.OPEN,
        damageDescription: data.damageDescription,
        evidencePhotos: data.evidencePhotos,
        estimatedRepairCost: data.estimatedRepairCost,
        insuranceExcessAmount: data.insuranceExcessAmount,
        deadlineDate,
      },
    });

    // Mark booking as DISPUTED and hold deposit
    await db.booking.update({
      where: { id: booking.id },
      data: {
        status: BookingStatus.DISPUTED,
        isDepositReleased: false,
      },
    });

    return jsonSuccess(
      { claim },
      "Damage claim filed. Renter is notified to review the insurance excess deductible.",
      201
    );
  } catch (error) {
    console.error("Damage claim filing error:", error);
    return jsonError("Internal server error", 500);
  }
}
