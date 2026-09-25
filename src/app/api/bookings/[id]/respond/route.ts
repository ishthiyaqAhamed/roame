import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";
import { jsonError, jsonSuccess } from "@/lib/api-response";
import { respondBookingSchema } from "@/lib/validations/booking.schema";
import { BookingStatus } from "@/lib/generated/prisma/client";

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

    if (booking.ownerId !== user.id) {
      return jsonError("Only the vehicle owner can respond to this booking request", 403);
    }

    if (booking.status !== BookingStatus.REQUESTED) {
      return jsonError(`Booking cannot be responded to in its current status (${booking.status})`, 400);
    }

    // Check if 6-hour deadline expired
    if (booking.ownerResponseDeadline && new Date() > booking.ownerResponseDeadline) {
      await db.booking.update({
        where: { id },
        data: { status: BookingStatus.EXPIRED },
      });
      return jsonError("The 6-hour response deadline for this booking has expired", 400);
    }

    const body = await req.json();
    const parseResult = respondBookingSchema.safeParse(body);

    if (!parseResult.success) {
      return jsonError("Validation error", 422, parseResult.error.flatten().fieldErrors);
    }

    const { action, reason } = parseResult.data;

    const newStatus =
      action === "ACCEPT" ? BookingStatus.ACCEPTED : BookingStatus.DECLINED;

    const updated = await db.booking.update({
      where: { id },
      data: {
        status: newStatus,
        cancellationReason: reason,
      },
    });

    return jsonSuccess(
      { booking: updated },
      action === "ACCEPT"
        ? "Booking accepted. Ready for pickup inspection."
        : "Booking declined."
    );
  } catch (error) {
    console.error("Respond booking error:", error);
    return jsonError("Internal server error", 500);
  }
}
