import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";
import { jsonError, jsonSuccess } from "@/lib/api-response";
import { confirmHandoverSchema } from "@/lib/validations/handover.schema";
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

    const isCustomer = booking.customerId === user.id;
    const isOwner = booking.ownerId === user.id;

    if (!isCustomer && !isOwner) {
      return jsonError("You are not authorized for this booking", 403);
    }

    const body = await req.json();
    const parseResult = confirmHandoverSchema.safeParse(body);

    if (!parseResult.success) {
      return jsonError("Validation error", 422, parseResult.error.flatten().fieldErrors);
    }

    const { handoverId } = parseResult.data;

    const handover = await db.handoverRecord.findUnique({
      where: { id: handoverId },
    });

    if (!handover || handover.bookingId !== booking.id) {
      return jsonError("Handover record not found", 404);
    }

    // Update the relevant confirmation flag
    const updatedHandover = await db.handoverRecord.update({
      where: { id: handoverId },
      data: {
        ...(isCustomer
          ? { customerConfirmed: true, customerConfirmedAt: new Date() }
          : {}),
        ...(isOwner
          ? { ownerConfirmed: true, ownerConfirmedAt: new Date() }
          : {}),
      },
    });

    // Check if both parties have now confirmed
    const bothConfirmed =
      updatedHandover.customerConfirmed && updatedHandover.ownerConfirmed;

    if (bothConfirmed) {
      if (updatedHandover.type === HandoverType.PICKUP) {
        // Transition to ACTIVE rental
        await db.booking.update({
          where: { id: booking.id },
          data: { status: BookingStatus.ACTIVE, isDepositHeld: true },
        });
      } else if (updatedHandover.type === HandoverType.RETURN) {
        // Transition to COMPLETED and release security deposit hold
        await db.booking.update({
          where: { id: booking.id },
          data: {
            status: BookingStatus.COMPLETED,
            isDepositReleased: true,
          },
        });
      }
    }

    return jsonSuccess(
      {
        handover: updatedHandover,
        bothConfirmed,
      },
      bothConfirmed
        ? `Handover fully confirmed by both parties! Booking status is now ${
            updatedHandover.type === HandoverType.PICKUP ? "ACTIVE" : "COMPLETED"
          }.`
        : "Your confirmation has been recorded. Waiting for the other party to confirm."
    );
  } catch (error) {
    console.error("Handover confirm error:", error);
    return jsonError("Internal server error", 500);
  }
}
