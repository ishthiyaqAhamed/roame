import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";
import { jsonError, jsonSuccess } from "@/lib/api-response";
import { createHandoverSchema } from "@/lib/validations/handover.schema";
import { BookingStatus, HandoverType } from "@/lib/generated/prisma/client";

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
    });

    if (!booking) {
      return jsonError("Booking not found", 404);
    }

    // Must be customer or owner
    const isCustomer = booking.customerId === user.id;
    const isOwner = booking.ownerId === user.id;

    if (!isCustomer && !isOwner) {
      return jsonError("You are not authorized for this booking inspection", 403);
    }

    const body = await req.json();
    const parseResult = createHandoverSchema.safeParse(body);

    if (!parseResult.success) {
      return jsonError("Validation error", 422, parseResult.error.flatten().fieldErrors);
    }

    const data = parseResult.data;

    // Check if handover already submitted for this phase
    const existingHandover = await db.handoverRecord.findFirst({
      where: {
        bookingId: booking.id,
        type: data.type,
      },
    });

    if (existingHandover) {
      return jsonError(
        `A ${data.type.toLowerCase()} handover inspection has already been uploaded for this booking`,
        409
      );
    }

    const handover = await db.handoverRecord.create({
      data: {
        bookingId: booking.id,
        type: data.type,
        frontPhotoUrl: data.frontPhotoUrl,
        backPhotoUrl: data.backPhotoUrl,
        leftPhotoUrl: data.leftPhotoUrl,
        rightPhotoUrl: data.rightPhotoUrl,
        dashboardPhotoUrl: data.dashboardPhotoUrl,
        odometerReading: data.odometerReading,
        fuelLevelPercent: data.fuelLevelPercent,
        notes: data.notes,
        // Mark the submitting party's confirmation automatically
        customerConfirmed: isCustomer,
        customerConfirmedAt: isCustomer ? new Date() : null,
        ownerConfirmed: isOwner,
        ownerConfirmedAt: isOwner ? new Date() : null,
      },
    });

    // Update booking status depending on handover phase
    if (data.type === HandoverType.PICKUP) {
      await db.booking.update({
        where: { id: booking.id },
        data: { status: BookingStatus.PICKUP_INSPECTION },
      });
    } else {
      await db.booking.update({
        where: { id: booking.id },
        data: { status: BookingStatus.RETURN_INSPECTION },
      });
    }

    return jsonSuccess(
      { handover },
      `${data.type === HandoverType.PICKUP ? "Pickup" : "Return"} handover inspection photos submitted. Waiting for counterpart verification.`,
      201
    );
  } catch (error) {
    console.error("Handover submit error:", error);
    return jsonError("Internal server error", 500);
  }
}
